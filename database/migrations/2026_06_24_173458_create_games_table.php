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
       Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('my_team_id')->constrained('teams')->cascadeOnDelete();
            $table->foreignId('opponent_id')->nullable()->constrained('opponents')->nullOnDelete();
            $table->string('opponent_name');                // kept as fallback display name
            $table->date('date')->nullable();
            $table->enum('home_or_away', ['home', 'away', 'neutral'])->default('home');
            $table->integer('field_length')->default(100);

            // Game state
            $table->enum('coin_flip_winner', ['my_team', 'opponent'])->nullable();
            $table->enum('first_possession', ['my_team', 'opponent'])->nullable();
            $table->enum('possession', ['my_team', 'opponent'])->nullable();
            $table->integer('current_drive')->default(1);

            // Auto-calculated scores
            $table->integer('my_team_score')->default(0);
            $table->integer('opponent_score')->default(0);
            $table->integer('my_team_first_downs')->default(0);
            $table->integer('opponent_first_downs')->default(0);

            $table->boolean('is_finished')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
