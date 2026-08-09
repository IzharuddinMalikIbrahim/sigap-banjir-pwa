<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property int|null $role_id
 * @property float|null $latitude
 * @property float|null $longitude
 * @property Carbon|null $location_updated_at
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property-read Role|null $role
 */
#[Fillable([
    'name',
    'email',
    'password',
    'role_id',
    'latitude',
    'longitude',
    'location_updated_at',
])]
#[Hidden([
    'password',
    'two_factor_secret',
    'two_factor_recovery_codes',
    'remember_token',
])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'location_updated_at' => 'datetime',
        ];
    }

    /**
     * Get the role assigned to the user.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the flood reports created by the user.
     */
    public function floodReports(): HasMany
    {
        return $this->hasMany(FloodReport::class);
    }

    /**
     * Get the flood reports verified by the user.
     */
    public function verifiedFloodReports(): HasMany
    {
        return $this->hasMany(
            FloodReport::class,
            'verified_by'
        );
    }

    public function floodReportVerifications(): HasMany
    {
        return $this->hasMany(
            FloodReportVerification::class,
            'verified_by'
        );
    }

    /**
     * Get all activity logs created by the user.
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(
            ActivityLog::class
        );
    }
}
