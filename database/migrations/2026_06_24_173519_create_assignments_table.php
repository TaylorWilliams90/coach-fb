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
        // One row per player per play — 11 rows every offensive play
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('play_id')->constrained()->cascadeOnDelete();
            $table->foreignId('player_id')->constrained()->cascadeOnDelete();
            $table->string('position_label');               // their role on this specific play
            $table->boolean('is_successful')->default(false);
            $table->text('note')->nullable();
            $table->timestamps();

            $table->unique(['play_id', 'player_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
