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
        Schema::create('video_educations', function (Blueprint $table) {
            $table->id();

            $table->string('title');

            $table->string('slug')->unique();

            $table->string('thumbnail')->nullable();

            $table->string('video_path');

            $table->text('description')->nullable();

            $table->string('category')
                ->nullable()
                ->index();

            $table->unsignedInteger('duration')
                ->nullable()
                ->comment('Durasi video dalam detik');

            $table->enum('status', [
                'draft',
                'published',
                'archived',
            ])->default('draft');

            $table->timestamp('published_at')
                ->nullable();

            $table->timestamps();

            $table->index([
                'status',
                'published_at',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_education');
    }
};
