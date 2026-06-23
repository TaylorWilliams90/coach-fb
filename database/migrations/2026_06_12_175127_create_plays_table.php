<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->enum('side', ['offense', 'defense']);

            // Situational
            $table->integer('quarter');
            $table->integer('down');
            $table->integer('distance');
            $table->integer('yard_line');

            // Offensive columns
            $table->string('formation')->nullable();
            $table->string('play_name')->nullable();
            $table->enum('play_type', [
                'run', 'pass', 'punt',
                'kickoff', 'extra_point', 'penalty'
            ])->nullable();
            $table->foreignId('ball_carrier_id')
                ->nullable()->constrained('players')->nullOnDelete();
            $table->integer('yards_gained')->default(0);
            $table->boolean('is_complete')->nullable();
            $table->boolean('is_touchdown')->default(false);
            $table->boolean('is_turnover')->default(false);

            // Penalty
            $table->string('penalty_type')->nullable();
            $table->integer('penalty_yards')->nullable();

            // Defensive columns
            $table->string('defensive_look')->nullable();
            $table->foreignId('tackler_id')
                ->nullable()->constrained('players')->nullOnDelete();
            $table->foreignId('missed_tackler_id')
                ->nullable()->constrained('players')->nullOnDelete();
            $table->foreignId('coverage_miss_player_id')
                ->nullable()->constrained('players')->nullOnDelete();
            $table->foreignId('interception_player_id')
                ->nullable()->constrained('players')->nullOnDelete();
            $table->foreignId('blocked_by_player_id')
                ->nullable()->constrained('players')->nullOnDelete();
            $table->boolean('turnover_forced')->default(false);

            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plays');
    }
};