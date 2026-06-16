<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;

class PerformanceEndpointStatus extends Model
{
    use Auditable;

    protected string $auditModule = 'performance_endpoint_statuses';

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
