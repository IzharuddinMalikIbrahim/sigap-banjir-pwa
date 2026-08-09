<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'module',
        'description',
        'ip_address',
        'user_agent',
    ];

    /**
     * Get the user who performed the activity.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class
        );
    }

    /**
     * Scope logs by action.
     */
    public function scopeAction(
        Builder $query,
        string $action
    ): Builder {
        return $query->where(
            'action',
            $action
        );
    }

    /**
     * Scope logs by module.
     */
    public function scopeModule(
        Builder $query,
        string $module
    ): Builder {
        return $query->where(
            'module',
            $module
        );
    }

    /**
     * Scope logs created by a specific user.
     */
    public function scopeByUser(
        Builder $query,
        int $userId
    ): Builder {
        return $query->where(
            'user_id',
            $userId
        );
    }

    /**
     * Scope logs created within a date range.
     */
    public function scopeBetween(
        Builder $query,
        $from,
        $to
    ): Builder {
        return $query->whereBetween(
            'created_at',
            [$from, $to]
        );
    }
}
