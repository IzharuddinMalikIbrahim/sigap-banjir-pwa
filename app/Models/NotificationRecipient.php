<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationRecipient extends Model
{
    protected $fillable = [
        'notification_id',
        'user_id',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }

    /**
     * Get the notification.
     */
    public function notification(): BelongsTo
    {
        return $this->belongsTo(
            Notification::class
        );
    }

    /**
     * Get the recipient user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class
        );
    }

    /**
     * Scope unread notifications.
     */
    public function scopeUnread(
        Builder $query
    ): Builder {
        return $query->whereNull('read_at');
    }

    /**
     * Scope read notifications.
     */
    public function scopeRead(
        Builder $query
    ): Builder {
        return $query->whereNotNull('read_at');
    }

    /**
     * Mark the notification as read.
     */
    public function markAsRead(): bool
    {
        if ($this->read_at !== null) {
            return true;
        }

        return $this->update([
            'read_at' => now(),
        ]);
    }

    /**
     * Check whether the notification has been read.
     */
    public function isRead(): bool
    {
        return $this->read_at !== null;
    }
}
