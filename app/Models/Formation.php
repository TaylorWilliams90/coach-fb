<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Formation extends Model
{
    protected $fillable = [
        'team_id', 'name', 'side',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function depthChart(): HasMany
    {
        return $this->hasMany(FormationDepthChart::class)->orderBy('sort_order');
    }

    public function plays(): HasMany
    {
        return $this->hasMany(Play::class);
    }

    public function isComplete(): bool
    {
        return $this->depthChart()->count() === 11;
    }
}