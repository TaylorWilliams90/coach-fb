<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormationDepthChart extends Model
{
    protected $fillable = [
        'formation_id', 'player_id', 'position_label', 'sort_order',
    ];

    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }
}