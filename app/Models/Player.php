<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Player extends Model
{
    protected $fillable = [
        'team_id', 'name', 'jersey_number', 'position',
        'grade', 'parent_name', 'parent_phone', 'parent_email',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(Assignment::class);
    }

    public function depthCharts(): HasMany
    {
        return $this->hasMany(FormationDepthChart::class);
    }

    // Season stats helpers
    public function tntSuccessRate(): float
    {
        $total      = $this->assignments()->count();
        $successful = $this->assignments()->where('is_successful', true)->count();
        return $total > 0 ? round(($successful / $total) * 100, 1) : 0.0;
    }

    public function totalYards(): int
    {
        return Play::where('ball_carrier_id', $this->id)->sum('yards_gained');
    }

    public function totalTouchdowns(): int
    {
        return Play::where('ball_carrier_id', $this->id)
            ->where('is_touchdown', true)
            ->count();
    }
}