<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Play extends Model
{
    protected $fillable = [
        'game_id', 'team_id', 'side',
        'quarter', 'down', 'distance', 'yard_line',
        'formation', 'play_name', 'play_type',
        'ball_carrier_id', 'yards_gained',
        'is_complete', 'is_touchdown', 'is_turnover',
        'penalty_type', 'penalty_yards',
        'defensive_look', 'tackler_id',
        'missed_tackler_id', 'coverage_miss_player_id',
        'interception_player_id', 'blocked_by_player_id',
        'turnover_forced', 'notes',
    ];

    protected $casts = [
        'is_complete'     => 'boolean',
        'is_touchdown'    => 'boolean',
        'is_turnover'     => 'boolean',
        'turnover_forced' => 'boolean',
    ];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function ballCarrier(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'ball_carrier_id');
    }

    public function tackler(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'tackler_id');
    }

    public function missedTackler(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'missed_tackler_id');
    }

    public function coverageMissPlayer(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'coverage_miss_player_id');
    }

    public function interceptionPlayer(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'interception_player_id');
    }

    public function blockedByPlayer(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'blocked_by_player_id');
    }
}