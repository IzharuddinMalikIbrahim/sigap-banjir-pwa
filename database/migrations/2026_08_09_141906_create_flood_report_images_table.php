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
        Schema::create('flood_report_images', function (Blueprint $table) {
            $table->id();

            $table->foreignId('flood_report_id')
                ->constrained('flood_reports')
                ->cascadeOnDelete();

            $table->string('file_path', 500);

            $table->string('file_name', 255);

            $table->string('mime_type', 100);

            $table->unsignedBigInteger('file_size')
                ->comment('Ukuran file dalam bytes');

            $table->timestamps();

            $table->index('flood_report_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flood_report_images');
    }
};
