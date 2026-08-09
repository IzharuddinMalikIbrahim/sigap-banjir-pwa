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
        Schema::create('evacuation_post_facilities', function (Blueprint $table) {
            $table->id();

            $table->foreignId('evacuation_post_id')
                ->constrained('evacuation_posts')
                ->cascadeOnDelete();

            $table->string('facility_name', 150);

            $table->text('description')
                ->nullable();

            $table->timestamps();

            $table->index('evacuation_post_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evacuation_post_facilities');
    }
};
