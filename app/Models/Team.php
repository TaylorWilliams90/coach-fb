<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Team extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'season',
        'location',
        'grade',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function players(): HasMany
    {
        return $this->hasMany(Player::class)->orderBy('jersey_number');
    }

    // ✅ Keep only ONE games() method
    public function games(): HasMany
    {
        return $this->hasMany(Game::class, 'my_team_id');
    }

    // All plays across all games this season
    public function plays(): HasManyThrough
    {
        return $this->hasManyThrough(
            Play::class,
            Game::class,
            'my_team_id',
            'game_id',
        );
    }
}