<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FloodReportImage extends Model
{
    protected $fillable = [
        'flood_report_id',
        'file_path',
        'file_name',
        'mime_type',
        'file_size',
    ];

    /**
     * Get the flood report associated with this image.
     */
    public function floodReport(): BelongsTo
    {
        return $this->belongsTo(
            FloodReport::class
        );
    }

    /**
     * Get the file size in a human-readable format.
     */
    public function getFormattedFileSizeAttribute(): string
    {
        $bytes = $this->file_size;

        if ($bytes === 0) {
            return '0 Bytes';
        }

        $units = [
            'Bytes',
            'KB',
            'MB',
            'GB',
        ];

        $index = floor(
            log($bytes, 1024)
        );

        $index = min(
            $index,
            count($units) - 1
        );

        return round(
            $bytes / (1024 ** $index),
            2
        ) . ' ' . $units[$index];
    }
}
