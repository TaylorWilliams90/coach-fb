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
        Schema::create('opponent_players', function (Blueprint $table) {
            $table->id();
            $table->foreignId('opponent_id')->constrained()->cascadeOnDelete();
            $table->integer('jersey_number');
            $table->string('position')->nullable();
            $table->string('name')->nullable();
            $table->timestamps();

            $table->unique(['opponent_id', 'jersey_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opponent_players');
    }
};
