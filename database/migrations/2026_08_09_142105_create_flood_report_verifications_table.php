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
        Schema::create('flood_report_verifications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('flood_report_id')
                ->constrained('flood_reports')
                ->cascadeOnDelete();

            $table->foreignId('verified_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->enum('status', [
                'pending',
                'verified',
                'rejected',
            ])->default('pending');

            $table->text('notes')
                ->nullable();

            $table->timestamp('verified_at')
                ->nullable();

            $table->timestamps();

            $table->index('flood_report_id');
            $table->index('verified_by');
            $table->index('status');
            $table->index('verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flood_report_verifications');
    }
};
