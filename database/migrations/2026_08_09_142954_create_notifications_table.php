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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            $table->string('type', 100);

            $table->string('title', 255);

            $table->text('message');

            $table->json('data')
                ->nullable();

            $table->enum('priority', [
                'low',
                'normal',
                'high',
                'critical',
            ])->default('normal');

            $table->timestamps();

            $table->index('type');
            $table->index('priority');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
