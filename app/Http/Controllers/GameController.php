<?php
// app/Http/Controllers/GameController.php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    private function authorizeTeam(Team $team): void
    {
        abort_if($team->user_id !== Auth::id(), 403);
    }

    public function index(Team $team): Response
    {
        $this->authorizeTeam($team);

        $games = $team->games()
            ->orderByDesc('date')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Games/Index', [
            'team'  => $team,
            'games' => $games,
        ]);
    }

    public function create(Team $team): Response
    {
        $this->authorizeTeam($team);

        return Inertia::render('Games/Create', [
            'team'        => $team,
            'fieldLength' => Game::fieldLengthForGrade($team->grade ?? '8'),
        ]);
    }

    public function store(Request $request, Team $team)
    {
        $this->authorizeTeam($team);

        $validated = $request->validate([
            'opponent_name' => 'required|string|max:255',
            'date'          => 'nullable|date',
            'home_or_away'  => 'required|in:home,away,neutral',
            'my_team_score' => 'integer|min:0',
            'opponent_score'=> 'integer|min:0',
            'is_finished'   => 'boolean',
        ]);

        $validated['my_team_id']   = $team->id;
        $validated['field_length'] = Game::fieldLengthForGrade($team->grade ?? '8');

        $game = Game::create($validated);

        return redirect()
            ->route('teams.games.show', [$team, $game])
            ->with('success', 'Game created.');
    }

    public function show(Team $team, Game $game): Response
    {
        $this->authorizeTeam($team);

        $game->load([
            'plays.ballCarrier',
            'plays.tackler',
            'opponentPlays',
        ]);

        // Game summary stats
        $offensivePlays = $game->plays->where('side', 'offense');
        $defensivePlays = $game->plays->where('side', 'defense');
        $passingPlays   = $offensivePlays->where('play_type', 'pass');

        $summary = [
            'total_offensive_plays' => $offensivePlays->count(),
            'total_yards'           => $offensivePlays->sum('yards_gained'),
            'total_runs'            => $offensivePlays->where('play_type', 'run')->count(),
            'total_passes'          => $passingPlays->count(),
            'completions'           => $passingPlays->where('is_complete', true)->count(),
            'touchdowns'            => $offensivePlays->where('is_touchdown', true)->count(),
            'turnovers_given'       => $offensivePlays->where('is_turnover', true)->count(),
            'turnovers_forced'      => $defensivePlays->where('turnover_forced', true)->count(),
            'total_tackles'         => $defensivePlays->whereNotNull('tackler_id')->count(),
            'missed_tackles'        => $game->opponentPlays->where('miss_tackle', true)->count(),
            'interceptions'         => $game->opponentPlays->where('interception', true)->count(),
        ];

        // Top ball carriers
        $topCarriers = $offensivePlays
            ->whereNotNull('ball_carrier_id')
            ->groupBy('ball_carrier_id')
            ->map(fn($plays, $playerId) => [
                'player'     => $plays->first()->ballCarrier,
                'yards'      => $plays->sum('yards_gained'),
                'carries'    => $plays->count(),
                'touchdowns' => $plays->where('is_touchdown', true)->count(),
            ])
            ->sortByDesc('yards')
            ->values();

        return Inertia::render('Games/Show', [
            'team'         => $team,
            'game'         => $game,
            'summary'      => $summary,
            'topCarriers'  => $topCarriers,
            'plays'        => $game->plays->values(),
            'opponentPlays'=> $game->opponentPlays->values(),
        ]);
    }

    public function edit(Team $team, Game $game): Response
    {
        $this->authorizeTeam($team);

        return Inertia::render('Games/Edit', [
            'team' => $team,
            'game' => $game,
        ]);
    }

    public function update(Request $request, Team $team, Game $game)
    {
        $this->authorizeTeam($team);

        $validated = $request->validate([
            'opponent_name'  => 'required|string|max:255',
            'date'           => 'nullable|date',
            'home_or_away'   => 'required|in:home,away,neutral',
            'my_team_score'  => 'integer|min:0',
            'opponent_score' => 'integer|min:0',
            'is_finished'    => 'boolean',
        ]);

        $game->update($validated);

        return redirect()
            ->route('teams.games.show', [$team, $game])
            ->with('success', 'Game updated.');
    }

    public function destroy(Team $team, Game $game)
    {
        $this->authorizeTeam($team);

        $game->delete();

        return redirect()
            ->route('teams.games.index', $team)
            ->with('success', 'Game deleted.');
    }
}