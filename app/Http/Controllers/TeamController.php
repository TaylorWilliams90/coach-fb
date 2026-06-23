<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function index(): Response
    {
        $teams = Auth::user()
            ->teams()
            ->latest()
            ->get();

        return Inertia::render('Teams/Index', [
            'teams' => $teams,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Teams/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'season'   => 'nullable|string|max:100',
            'location' => 'nullable|string|max:255',
            'grade'    => 'nullable|string|max:100',
        ]);

        Auth::user()->teams()->create($validated);

        return redirect()->route('teams.index')
            ->with('success', 'Team created successfully.');
    }

    public function show(Team $team): Response
    {
        $this->authorize('view', $team);

        $team->load('players');
        $recentGames = $team->games()->latest('date')->take(3)->get();

        return Inertia::render('Teams/Show', [
            'team'        => $team,
            'players'     => $team->players,
            'recentGames' => $recentGames,
        ]);
    }

    public function edit(Team $team): Response
    {
        $this->authorize('update', $team);

        return Inertia::render('Teams/Edit', [
            'team' => $team,
        ]);
    }

    public function update(Request $request, Team $team)
    {
        $this->authorize('update', $team);

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'season'   => 'nullable|string|max:100',
            'location' => 'nullable|string|max:255',
            'grade'    => 'nullable|string|max:100',
        ]);

        $team->update($validated);

        return redirect()->route('teams.index')
            ->with('success', 'Team updated.');
    }

    public function destroy(Team $team)
    {
        $this->authorize('delete', $team);

        $team->delete();

        return redirect()->route('teams.index')
            ->with('success', 'Team deleted.');
    }
}