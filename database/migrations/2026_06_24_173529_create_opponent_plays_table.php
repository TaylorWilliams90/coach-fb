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
        Schema::create('opponent_plays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->foreignId('opponent_id')->constrained()->cascadeOnDelete();
            $table->integer('drive_number')->default(1);

            // Situation
            $table->integer('quarter');
            $table->integer('down');
            $table->integer('distance');
            $table->integer('yard_line');

            // Play
            $table->enum('play_type', ['middle_run', 'toss', 'screen', 'pass', 'punt', 'kickoff']);
            $table->foreignId('ball_carrier_id')->nullable()->constrained('opponent_players')->nullOnDelete();
            $table->integer('yards_gained')->default(0);
            $table->boolean('is_touchdown')->default(false);
            $table->boolean('is_turnover')->default(false);

            // My team's defensive performance on this play
            $table->boolean('miss_tackle')->default(false);
            $table->boolean('miss_coverage')->default(false);
            $table->boolean('interception')->default(false);
            $table->boolean('blocked')->default(false);

            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opponent_plays');
    }
};
