<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    protected $fillable = [
        'my_team_id',
        'opponent_name',
        'date',
        'home_or_away',
        'my_team_score',
        'opponent_score',
        'field_length',
        'is_finished',
    ];

    protected $casts = [
        'date'        => 'date',
        'is_finished' => 'boolean',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'my_team_id');
    }

    public function plays(): HasMany
    {
        return $this->hasMany(Play::class);
    }

    public function opponentPlays(): HasMany
    {
        return $this->hasMany(OpponentPlay::class);
    }

    // Scopes for summary calculations
    public function offensivePlays(): HasMany
    {
        return $this->plays()->where('side', 'offense');
    }

    public function defensivePlays(): HasMany
    {
        return $this->plays()->where('side', 'defense');
    }

    // Auto-set field length from team grade
    public static function fieldLengthForGrade(string $grade): int
    {
        $gradeNumber = (int) filter_var($grade, FILTER_SANITIZE_NUMBER_INT);
        return $gradeNumber <= 7 ? 80 : 100;
    }
}