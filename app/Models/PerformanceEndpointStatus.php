<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerformanceEndpointStatus extends Model
{

    protected $fillable = [
        'endpoint_key',
        'method',
        'route_name',
        'path',
        'status',
        'status_updated_at',
    ];

    protected $casts = [
        'status_updated_at' => 'datetime',
    ];
}
