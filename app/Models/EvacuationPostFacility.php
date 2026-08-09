<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvacuationPostFacility extends Model
{
    protected $fillable = [
        'evacuation_post_id',
        'facility_name',
        'description',
    ];

    /**
     * Get the evacuation post associated with this facility.
     */
    public function evacuationPost(): BelongsTo
    {
        return $this->belongsTo(
            EvacuationPost::class
        );
    }
}
