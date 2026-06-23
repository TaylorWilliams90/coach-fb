<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('opponent_plays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();

            // Situational
            $table->integer('quarter');
            $table->integer('down');
            $table->integer('distance');
            $table->integer('yard_line');

            // High level play type
            $table->enum('play_type', [
                'middle_run', 'toss', 'screen',
                'pass', 'punt', 'kickoff'
            ]);
            $table->integer('yards_gained')->default(0);

            // My team's defensive performance
            $table->boolean('miss_tackle')->default(false);
            $table->boolean('miss_coverage')->default(false);
            $table->boolean('interception')->default(false);
            $table->boolean('blocked')->default(false);
            $table->boolean('touchdown_allowed')->default(false);

            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('opponent_plays');
    }
};