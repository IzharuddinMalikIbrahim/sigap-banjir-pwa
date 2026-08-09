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
        Schema::create('education_contents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('category_id')
                ->constrained('education_categories')
                ->cascadeOnDelete();

            $table->string('title', 255);

            $table->string('slug', 255)
                ->unique();

            $table->string('thumbnail', 500)
                ->nullable();

            $table->longText('content')
                ->nullable();

            $table->string('video_url', 500)
                ->nullable();

            $table->enum('status', [
                'draft',
                'published',
                'archived',
            ])->default('draft');

            $table->timestamp('published_at')
                ->nullable();

            $table->timestamps();

            $table->index('category_id');
            $table->index('status');
            $table->index('published_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('education_contents');
    }
};
