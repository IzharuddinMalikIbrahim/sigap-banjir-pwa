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
        Schema::create('flood_levels', function (Blueprint $table) {
            $table->id();

            $table->string('name', 150);

            $table->string('code', 100)
                ->unique();

            $table->json('geometry');

            $table->enum('severity', [
                'safe',
                'warning',
                'alert',
                'high_alert',
                'danger',
            ])->default('warning');

            $table->enum('status', [
                'active',
                'inactive',
                'expired',
            ])->default('active');

            $table->text('description')
                ->nullable();

            $table->timestamps();

            $table->index('severity');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flood_levels');
    }
};
