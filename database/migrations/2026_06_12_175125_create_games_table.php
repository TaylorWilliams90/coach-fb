<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('my_team_id')->constrained('teams')->cascadeOnDelete();
            $table->string('opponent_name');
            $table->date('date')->nullable();
            $table->enum('home_or_away', ['home', 'away', 'neutral'])->default('home');
            $table->integer('my_team_score')->default(0);
            $table->integer('opponent_score')->default(0);
            $table->integer('field_length')->default(100); // 80 or 100
            $table->boolean('is_finished')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};