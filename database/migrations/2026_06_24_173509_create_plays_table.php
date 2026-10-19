<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('plays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('formation_id')->constrained();   // required — no play without formation
            $table->enum('side', ['offense', 'defense']);
            $table->integer('drive_number')->default(1);

            // Situation
            $table->integer('quarter');
            $table->integer('down');
            $table->integer('distance');
            $table->integer('yard_line');

            // Play info
            $table->string('play_name');
            $table->enum('play_type', ['run', 'pass', 'punt', 'kickoff', 'extra_point', 'two_point', 'penalty']);
            $table->foreignId('ball_carrier_id')->nullable()->constrained('players')->nullOnDelete();

            // Result
            $table->integer('yards_gained')->default(0);
            $table->boolean('is_first_down')->default(false);
            $table->boolean('is_touchdown')->default(false);
            $table->boolean('is_turnover')->default(false);
            $table->boolean('is_complete')->nullable();         // pass plays only
            $table->boolean('turnover_forced')->default(false); // defense forced it
            $table->string('penalty_type')->nullable();
            $table->integer('penalty_yards')->nullable();

            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plays');
    }
};
