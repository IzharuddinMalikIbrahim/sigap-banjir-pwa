<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoEducation extends Model
{
    use HasFactory;

    protected $table = 'video_educations';

    protected $fillable = [
        'title',
        'slug',
        'thumbnail',
        'video_path',
        'description',
        'category',
        'duration',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'duration' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    public function scopePublished($query)
    {
        return $query
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function isPublished(): bool
    {
        return $this->status === 'published'
            && $this->published_at !== null
            && $this->published_at->lte(now());
    }

    public function getFormattedDurationAttribute(): string
    {
        if (!$this->duration) {
            return '00:00';
        }

        $minutes = floor($this->duration / 60);
        $seconds = $this->duration % 60;

        return sprintf(
            '%02d:%02d',
            $minutes,
            $seconds
        );
    }

    public function getVideoUrlAttribute(): ?string
    {
        if (!$this->video_path) {
            return null;
        }

        if (
            str_starts_with($this->video_path, 'http://') ||
            str_starts_with($this->video_path, 'https://')
        ) {
            return $this->video_path;
        }

        return asset(
            'storage/' . ltrim($this->video_path, '/')
        );
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        if (!$this->thumbnail) {
            return null;
        }

        if (
            str_starts_with($this->thumbnail, 'http://') ||
            str_starts_with($this->thumbnail, 'https://')
        ) {
            return $this->thumbnail;
        }

        return asset(
            'storage/' . ltrim($this->thumbnail, '/')
        );
    }
}
