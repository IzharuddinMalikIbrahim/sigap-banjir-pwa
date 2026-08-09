<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class EmergencyContact extends Model
{
    protected $fillable = [
        'name',
        'category',
        'phone',
        'description',
        'latitude',
        'longitude',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    /**
     * Scope active emergency contacts.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where(
            'status',
            'active'
        );
    }

    /**
     * Scope contacts by category.
     */
    public function scopeCategory(
        Builder $query,
        string $category
    ): Builder {
        return $query->where(
            'category',
            $category
        );
    }

    /**
     * Check whether the contact is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check whether the contact has a location.
     */
    public function hasLocation(): bool
    {
        return $this->latitude !== null
            && $this->longitude !== null;
    }
}
