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
        Schema::create('device_tokens', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->text('token');

            $table->enum('device_type', [
                'web',
                'android',
                'ios',
            ])->default('web');

            $table->string('browser', 100)
                ->nullable();

            $table->timestamp('last_used_at')
                ->nullable();

            $table->timestamps();

            $table->index('user_id');
            $table->index('device_type');
            $table->index('last_used_at');

            /*
             * Token dibuat unique secara hash karena
             * token bisa lebih panjang dari batas index MySQL.
             */
            $table->string('token_hash', 64)
                ->unique();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('device_tokens');
    }
};
