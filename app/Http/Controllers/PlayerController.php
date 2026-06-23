<?php
// app/Http/Controllers/PlayerController.php

namespace App\Http\Controllers;

use App\Models\Player;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PlayerController extends Controller
{
    private function authorizeTeam(Team $team): void
    {
        abort_if($team->user_id !== Auth::id(), 403);
    }

    public function index(Team $team): Response
    {
        $this->authorizeTeam($team);

        return Inertia::render('Players/Index', [
            'team'    => $team,
            'players' => $team->players()->get(),
        ]);
    }

    public function create(Team $team): Response
    {
        $this->authorizeTeam($team);

        return Inertia::render('Players/Create', [
            'team' => $team,
        ]);
    }

    public function store(Request $request, Team $team)
    {
        $this->authorizeTeam($team);

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'jersey_number' => [
                'required', 'integer', 'min:0', 'max:99',
                \Illuminate\Validation\Rule::unique('players')->where('team_id', $team->id),
            ],
            'position'     => 'required|string|max:50',
            'grade'        => 'nullable|integer|min:1|max:12',
            'parent_name'  => 'nullable|string|max:255',
            'parent_phone' => 'nullable|string|max:20',
            'parent_email' => 'nullable|email|max:255',
        ]);

        $team->players()->create($validated);

        return redirect()->route('teams.players.index', $team)
            ->with('success', 'Player added.');
    }

    public function edit(Team $team, Player $player): Response
    {
        $this->authorizeTeam($team);

        return Inertia::render('Players/Edit', [
            'team'   => $team,
            'player' => $player,
        ]);
    }

    public function update(Request $request, Team $team, Player $player)
    {
        $this->authorizeTeam($team);

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'jersey_number' => [
                'required', 'integer', 'min:0', 'max:99',
                \Illuminate\Validation\Rule::unique('players')
                    ->where('team_id', $team->id)
                    ->ignore($player->id),
            ],
            'position'     => 'required|string|max:50',
            'grade'        => 'nullable|integer|min:1|max:12',
            'parent_name'  => 'nullable|string|max:255',
            'parent_phone' => 'nullable|string|max:20',
            'parent_email' => 'nullable|email|max:255',
        ]);

        $player->update($validated);

        return redirect()->route('teams.players.index', $team)
            ->with('success', 'Player updated.');
    }

    public function destroy(Team $team, Player $player)
    {
        $this->authorizeTeam($team);

        $player->delete();

        return redirect()->route('teams.players.index', $team)
            ->with('success', 'Player removed.');
    }

    public function importCsv(Request $request, Team $team)
    {
        $this->authorizeTeam($team);

        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $file  = $request->file('csv_file');
        $lines = array_map('str_getcsv', file($file->getRealPath()));
        $header = array_map('strtolower', array_map('trim', array_shift($lines)));

        $imported = 0;
        $skipped  = 0;
        $errors   = [];

        foreach ($lines as $index => $row) {
            if (count($row) !== count($header)) continue;

            $data = array_combine($header, $row);

            // Support flexible column names
            $jerseyNumber = $data['jersey_number'] ?? $data['jersey'] ?? $data['number'] ?? null;
            $name         = $data['name'] ?? $data['player_name'] ?? null;
            $position     = $data['position'] ?? $data['pos'] ?? null;

            if (!$name || $jerseyNumber === null || !$position) {
                $errors[] = "Row " . ($index + 2) . ": missing name, jersey number, or position.";
                $skipped++;
                continue;
            }

            // Skip duplicate jersey numbers on this team
            $exists = $team->players()->where('jersey_number', (int) $jerseyNumber)->exists();
            if ($exists) {
                $errors[] = "Row " . ($index + 2) . ": jersey #{$jerseyNumber} already exists.";
                $skipped++;
                continue;
            }

            $team->players()->create([
                'name'          => trim($name),
                'jersey_number' => (int) $jerseyNumber,
                'position'      => trim($position),
                'grade'         => isset($data['grade']) ? (int) $data['grade'] : null,
                'parent_name'   => $data['parent_name'] ?? null,
                'parent_phone'  => $data['parent_phone'] ?? null,
                'parent_email'  => $data['parent_email'] ?? null,
            ]);

            $imported++;
        }

        return redirect()->route('teams.players.index', $team)->with([
            'success' => "{$imported} player(s) imported.",
            'importErrors' => $errors,
        ]);
    }
}