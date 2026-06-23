<?php
// app/Http/Controllers/PlayController.php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Play;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PlayController extends Controller
{
    private function authorizeTeam(Team $team): void
    {
        abort_if($team->user_id !== Auth::id(), 403);
    }

    public function index(Team $team, Game $game): Response
    {
        $this->authorizeTeam($team);

        $plays = $game->plays()
            ->with(['ballCarrier', 'tackler', 'missedTackler'])
            ->orderBy('quarter')
            ->orderBy('created_at')
            ->get();

        // Figure out next down/distance based on last offensive play
        $lastOffensivePlay = $game->plays()
            ->where('side', 'offense')
            ->latest()
            ->first();

        $nextDown     = 1;
        $nextDistance = 10;

        if ($lastOffensivePlay) {
            $yardsGained = $lastOffensivePlay->yards_gained;
            $prevDown    = $lastOffensivePlay->down;
            $prevDist    = $lastOffensivePlay->distance;

            if ($yardsGained >= $prevDist) {
                // First down
                $nextDown     = 1;
                $nextDistance = 10;
            } elseif ($prevDown >= 4) {
                // Turnover on downs — reset
                $nextDown     = 1;
                $nextDistance = 10;
            } else {
                $nextDown     = $prevDown + 1;
                $nextDistance = $prevDist - $yardsGained;
            }
        }

        return Inertia::render('Plays/Index', [
            'team'         => $team,
            'game'         => $game,
            'plays'        => $plays->values(),
            'players'      => $team->players()->get(),
            'nextDown'     => $nextDown,
            'nextDistance' => $nextDistance,
            'lastQuarter'  => $lastOffensivePlay?->quarter ?? 1,
        ]);
    }

    public function store(Request $request, Team $team, Game $game)
    {
        $this->authorizeTeam($team);

        $validated = $request->validate([
            'side'                    => 'required|in:offense,defense',
            'quarter'                 => 'required|integer|min:1|max:4',
            'down'                    => 'required|integer|min:1|max:4',
            'distance'                => 'required|integer|min:0',
            'yard_line'               => 'required|integer|min:0|max:100',

            // Offensive
            'formation'               => 'nullable|string|max:100',
            'play_name'               => 'nullable|string|max:100',
            'play_type'               => 'nullable|in:run,pass,punt,kickoff,extra_point,penalty',
            'ball_carrier_id'         => 'nullable|exists:players,id',
            'yards_gained'            => 'nullable|integer',
            'is_complete'             => 'nullable|boolean',
            'is_touchdown'            => 'boolean',
            'is_turnover'             => 'boolean',
            'penalty_type'            => 'nullable|string|max:100',
            'penalty_yards'           => 'nullable|integer',

            // Defensive
            'defensive_look'          => 'nullable|string|max:100',
            'tackler_id'              => 'nullable|exists:players,id',
            'missed_tackler_id'       => 'nullable|exists:players,id',
            'coverage_miss_player_id' => 'nullable|exists:players,id',
            'interception_player_id'  => 'nullable|exists:players,id',
            'blocked_by_player_id'    => 'nullable|exists:players,id',
            'turnover_forced'         => 'boolean',

            'notes'                   => 'nullable|string|max:500',
        ]);

        $validated['game_id'] = $game->id;
        $validated['team_id'] = $team->id;

        Play::create($validated);

        return redirect()
            ->route('teams.games.plays.index', [$team, $game])
            ->with('success', 'Play logged.');
    }

    public function destroy(Team $team, Game $game, Play $play)
    {
        $this->authorizeTeam($team);

        $play->delete();

        return redirect()
            ->route('teams.games.plays.index', [$team, $game])
            ->with('success', 'Play deleted.');
    }
}