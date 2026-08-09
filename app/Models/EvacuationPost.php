<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class EvacuationPost extends Model
{
    protected $fillable = [
        'name',
        'address',
        'latitude',
        'longitude',
        'capacity',
        'current_occupancy',
        'contact',
        'status',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'capacity' => 'integer',
            'current_occupancy' => 'integer',
        ];
    }

    /**
     * Get facilities available at this evacuation post.
     */
    public function facilities(): HasMany
    {
        return $this->hasMany(
            EvacuationPostFacility::class
        );
    }

    /**
     * Scope active evacuation posts.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope evacuation posts that still have capacity.
     */
    public function scopeAvailable(Builder $query): Builder
    {
        return $query
            ->where('status', 'active')
            ->whereColumn(
                'current_occupancy',
                '<',
                'capacity'
            );
    }

    /**
     * Scope full evacuation posts.
     */
    public function scopeFull(Builder $query): Builder
    {
        return $query->where(function ($query) {
            $query
                ->where('status', 'full')
                ->orWhereColumn(
                    'current_occupancy',
                    '>=',
                    'capacity'
                );
        });
    }

    /**
     * Check whether the evacuation post is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check whether the evacuation post is full.
     */
    public function isFull(): bool
    {
        return $this->capacity > 0
            && $this->current_occupancy >= $this->capacity;
    }

    /**
     * Get remaining capacity.
     */
    public function getRemainingCapacityAttribute(): int
    {
        return max(
            0,
            $this->capacity - $this->current_occupancy
        );
    }

    /**
     * Get occupancy percentage.
     */
    public function getOccupancyPercentageAttribute(): float
    {
        if ($this->capacity <= 0) {
            return 0;
        }

        return round(
            ($this->current_occupancy / $this->capacity) * 100,
            2
        );
    }
}
