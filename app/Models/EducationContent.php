<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EducationContent extends Model
{
    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'thumbnail',
        'content',
        'video_url',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    /**
     * Get the education category.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(
            EducationCategory::class,
            'category_id'
        );
    }

    /**
     * Scope published contents.
     */
    public function scopePublished(
        Builder $query
    ): Builder {
        return $query
            ->where('status', 'published')
            ->where(function (Builder $query) {
                $query
                    ->whereNull('published_at')
                    ->orWhere(
                        'published_at',
                        '<=',
                        now()
                    );
            });
    }

    /**
     * Scope contents by category.
     */
    public function scopeCategory(
        Builder $query,
        int $categoryId
    ): Builder {
        return $query->where(
            'category_id',
            $categoryId
        );
    }

    /**
     * Scope search contents.
     */
    public function scopeSearch(
        Builder $query,
        string $search
    ): Builder {
        return $query->where(function (Builder $query) use ($search) {
            $query
                ->where(
                    'title',
                    'like',
                    "%{$search}%"
                )
                ->orWhere(
                    'content',
                    'like',
                    "%{$search}%"
                );
        });
    }

    /**
     * Check whether the content is published.
     */
    public function isPublished(): bool
    {
        return $this->status === 'published'
            && (
                $this->published_at === null
                || $this->published_at->isPast()
            );
    }

    /**
     * Check whether the content has a video.
     */
    public function hasVideo(): bool
    {
        return !empty($this->video_url);
    }

    /**
     * Check whether the content has a thumbnail.
     */
    public function hasThumbnail(): bool
    {
        return !empty($this->thumbnail);
    }
}
