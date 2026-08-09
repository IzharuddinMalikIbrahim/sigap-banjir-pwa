<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EducationCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Get education contents in this category.
     */
    public function educationContents(): HasMany
    {
        return $this->hasMany(
            EducationContent::class
        );
    }

    /**
     * Scope categories by name.
     */
    public function scopeSearch(
        Builder $query,
        string $search
    ): Builder {
        return $query->where(function (Builder $query) use ($search) {
            $query
                ->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
    }
}
