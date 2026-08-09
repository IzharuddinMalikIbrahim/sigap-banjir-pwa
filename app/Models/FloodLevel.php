<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class FloodLevel extends Model
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
     * Scope active flood levels.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where(
            'status',
            'active'
        );
    }

    /**
     * Scope flood levels by severity.
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
     * Check whether the flood level is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
