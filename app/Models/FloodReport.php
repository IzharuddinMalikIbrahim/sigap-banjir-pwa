<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FloodReport extends Model
{
    protected $fillable = [
        'user_id',
        'latitude',
        'longitude',
        'address',
        'water_level',
        'severity',
        'description',
        'status',
        'reported_at',
        'verified_at',
        'verified_by',
        'expired_at',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'water_level' => 'decimal:2',
            'reported_at' => 'datetime',
            'verified_at' => 'datetime',
            'expired_at' => 'datetime',
        ];
    }

    /**
     * User who created the flood report.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * User who verified the flood report.
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'verified_by'
        );
    }

    /**
     * Images attached to this flood report.
     */
    public function images(): HasMany
    {
        return $this->hasMany(
            FloodReportImage::class
        );
    }

    public function verifications(): HasMany
    {
        return $this->hasMany(
            FloodReportVerification::class
        );
    }

    /**
     * Scope: published reports.
     */
    public function scopePublished(
        Builder $query
    ): Builder {
        return $query->where(
            'status',
            'published'
        );
    }

    /**
     * Scope: active reports.
     */
    public function scopeActive(
        Builder $query
    ): Builder {
        return $query
            ->whereIn('status', [
                'verified',
                'published',
            ])
            ->where(function ($query) {
                $query
                    ->whereNull('expired_at')
                    ->orWhere(
                        'expired_at',
                        '>',
                        now()
                    );
            });
    }

    /**
     * Scope: reports by severity.
     */
    public function scopeSeverity(
        Builder $query,
        string $severity
    ): Builder {
        return $query->where(
            'severity',
            $severity
        );
    }

    /**
     * Scope: reports within a geographic bounding box.
     */
    public function scopeWithinBounds(
        Builder $query,
        float $minLatitude,
        float $maxLatitude,
        float $minLongitude,
        float $maxLongitude
    ): Builder {
        return $query
            ->whereBetween(
                'latitude',
                [$minLatitude, $maxLatitude]
            )
            ->whereBetween(
                'longitude',
                [$minLongitude, $maxLongitude]
            );
    }
}
