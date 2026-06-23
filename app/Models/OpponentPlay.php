<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OpponentPlay extends Model
{
    protected $fillable = [
        'game_id', 'quarter', 'down',
        'distance', 'yard_line', 'play_type',
        'yards_gained', 'miss_tackle',
        'miss_coverage', 'interception',
        'blocked', 'touchdown_allowed', 'notes',
    ];

    protected $casts = [
        'miss_tackle'       => 'boolean',
        'miss_coverage'     => 'boolean',
        'interception'      => 'boolean',
        'blocked'           => 'boolean',
        'touchdown_allowed' => 'boolean',
    ];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
}