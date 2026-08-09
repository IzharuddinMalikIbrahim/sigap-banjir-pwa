<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Notification extends Model
{
    protected $fillable = [
        'type',
        'title',
        'message',
        'data',
        'priority',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
        ];
    }

    /**
     * Get notification recipients.
     */
    public function recipients(): HasMany
    {
        return $this->hasMany(
            NotificationRecipient::class
        );
    }

    /**
     * Get users who received this notification.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'notification_recipients'
        )->withPivot([
            'id',
            'read_at',
        ])->withTimestamps();
    }

    /**
     * Get notification recipient records.
     */
    public function notificationRecipients(): HasMany
    {
        return $this->hasMany(
            NotificationRecipient::class
        );
    }

    /**
     * Get notifications received by the user.
     */
    public function notifications(): BelongsToMany
    {
        return $this->belongsToMany(
            Notification::class,
            'notification_recipients'
        )->withPivot([
            'id',
            'read_at',
        ])->withTimestamps();
    }

    /**
     * Scope notifications by type.
     */
    public function scopeType(
        Builder $query,
        string $type
    ): Builder {
        return $query->where(
            'type',
            $type
        );
    }

    /**
     * Scope notifications by priority.
     */
    public function scopePriority(
        Builder $query,
        string $priority
    ): Builder {
        return $query->where(
            'priority',
            $priority
        );
    }

    /**
     * Scope high priority notifications.
     */
    public function scopeHighPriority(
        Builder $query
    ): Builder {
        return $query->whereIn('priority', [
            'high',
            'critical',
        ]);
    }

    /**
     * Check whether the notification is critical.
     */
    public function isCritical(): bool
    {
        return $this->priority === 'critical';
    }
}
