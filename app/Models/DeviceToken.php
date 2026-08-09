<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceToken extends Model
{
    protected $fillable = [
        'user_id',
        'token',
        'token_hash',
        'device_type',
        'browser',
        'last_used_at',
    ];

    protected function casts(): array
    {
        return [
            'last_used_at' => 'datetime',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function booted(): void
    {
        static::saving(function (DeviceToken $deviceToken) {
            if ($deviceToken->isDirty('token')) {
                $deviceToken->token_hash = hash(
                    'sha256',
                    $deviceToken->token
                );
            }
        });
    }

    /**
     * Get the user who owns this device token.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class
        );
    }

    /**
     * Scope tokens by device type.
     */
    public function scopeDeviceType(
        Builder $query,
        string $deviceType
    ): Builder {
        return $query->where(
            'device_type',
            $deviceType
        );
    }

    /**
     * Scope web device tokens.
     */
    public function scopeWeb(
        Builder $query
    ): Builder {
        return $query->where(
            'device_type',
            'web'
        );
    }

    /**
     * Scope mobile device tokens.
     */
    public function scopeMobile(
        Builder $query
    ): Builder {
        return $query->whereIn(
            'device_type',
            [
                'android',
                'ios',
            ]
        );
    }

    /**
     * Update the last used timestamp.
     */
    public function touchLastUsed(): bool
    {
        return $this->update([
            'last_used_at' => now(),
        ]);
    }
}
