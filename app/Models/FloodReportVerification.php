<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FloodReportVerification extends Model
{
    protected $fillable = [
        'flood_report_id',
        'verified_by',
        'status',
        'notes',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
        ];
    }

    /**
     * Get the flood report being verified.
     */
    public function floodReport(): BelongsTo
    {
        return $this->belongsTo(
            FloodReport::class
        );
    }

    /**
     * Get the user who performed the verification.
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'verified_by'
        );
    }
}
