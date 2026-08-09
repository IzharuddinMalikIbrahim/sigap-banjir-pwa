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
        Schema::create('flood_reports', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);

            $table->string('address')
                ->nullable();

            $table->decimal('water_level', 8, 2)
                ->comment('Tinggi genangan dalam centimeter');

            $table->enum('severity', [
                'safe',
                'warning',
                'alert',
                'high_alert',
                'danger',
            ])->default('warning');

            $table->text('description')
                ->nullable();

            $table->enum('status', [
                'submitted',
                'verification',
                'verified',
                'published',
                'rejected',
                'expired',
            ])->default('submitted');

            $table->timestamp('reported_at');

            $table->timestamp('verified_at')
                ->nullable();

            $table->foreignId('verified_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('expired_at')
                ->nullable();

            $table->timestamps();

            $table->index([
                'latitude',
                'longitude',
            ]);

            $table->index('severity');
            $table->index('status');
            $table->index('reported_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flood_reports');
    }
};
