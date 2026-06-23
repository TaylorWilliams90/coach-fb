<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\PlayController;
use App\Http\Controllers\OpponentPlayController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Teams
    Route::resource('teams', TeamController::class);

    Route::prefix('teams/{team}')->name('teams.')->group(function () {

        // Players
        Route::post('players/import', [PlayerController::class, 'importCsv'])
            ->name('players.import');
        Route::resource('players', PlayerController::class);

        // Games
        Route::resource('games', GameController::class);

        // Plays (scoped to a game)
        Route::prefix('games/{game}')->name('games.')->group(function () {
            Route::resource('plays', PlayController::class);
            Route::resource('opponent-plays', OpponentPlayController::class);
        });
    });
});

require __DIR__.'/auth.php';