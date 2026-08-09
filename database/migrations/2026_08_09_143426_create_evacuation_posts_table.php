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
        Schema::create('evacuation_posts', function (Blueprint $table) {
            $table->id();

            $table->string('name', 150);

            $table->string('address', 500);

            $table->decimal('latitude', 10, 8);

            $table->decimal('longitude', 11, 8);

            $table->unsignedInteger('capacity')
                ->default(0)
                ->comment('Kapasitas maksimal pengungsi');

            $table->unsignedInteger('current_occupancy')
                ->default(0)
                ->comment('Jumlah pengungsi saat ini');

            $table->string('contact', 50)
                ->nullable();

            $table->enum('status', [
                'active',
                'inactive',
                'full',
                'closed',
            ])->default('active');

            $table->text('description')
                ->nullable();

            $table->timestamps();

            $table->index([
                'latitude',
                'longitude',
            ]);

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evacuation_posts');
    }
};
