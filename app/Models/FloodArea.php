<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class FloodArea extends Model
{
    protected $fillable = [
        'name',
        'code',
        'geometry',
        'severity',
        'status',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'geometry' => 'array',
        ];
    }

    /**
     * Scope active flood areas.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where(
            'status',
            'active'
        );
    }

    /**
     * Scope published flood areas by severity.
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
     * Check whether the flood area is currently active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
