<?php
// app/Http/Controllers/OpponentPlayController.php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\OpponentPlay;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OpponentPlayController extends Controller
{
    private function authorizeTeam(Team $team): void
    {
        abort_if($team->user_id !== Auth::id(), 403);
    }

    public function store(Request $request, Team $team, Game $game)
    {
        $this->authorizeTeam($team);

        $validated = $request->validate([
            'quarter'           => 'required|integer|min:1|max:4',
            'down'              => 'required|integer|min:1|max:4',
            'distance'          => 'required|integer|min:0',
            'yard_line'         => 'required|integer|min:0|max:100',
            'play_type'         => 'required|in:middle_run,toss,screen,pass,punt,kickoff',
            'yards_gained'      => 'required|integer',
            'miss_tackle'       => 'boolean',
            'miss_coverage'     => 'boolean',
            'interception'      => 'boolean',
            'blocked'           => 'boolean',
            'touchdown_allowed' => 'boolean',
            'notes'             => 'nullable|string|max:500',
        ]);

        $validated['game_id'] = $game->id;

        OpponentPlay::create($validated);

        return redirect()
            ->route('teams.games.plays.index', [$team, $game])
            ->with('success', 'Opponent play logged.');
    }

    public function destroy(Team $team, Game $game, OpponentPlay $opponentPlay)
    {
        $this->authorizeTeam($team);

        $opponentPlay->delete();

        return redirect()
            ->route('teams.games.plays.index', [$team, $game])
            ->with('success', 'Opponent play deleted.');
    }
}