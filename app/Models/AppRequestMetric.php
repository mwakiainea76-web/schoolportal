<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppRequestMetric extends Model
{
    use HasFactory;

    protected $fillable = [
        'method',
        'path',
        'route_name',
        'status_code',
        'duration_ms',
        'memory_peak_kb',
        'response_size_bytes',
        'is_api',
        'user_id',
        'occurred_at',
    ];

    protected $casts = [
        'duration_ms' => 'integer',
        'memory_peak_kb' => 'integer',
        'response_size_bytes' => 'integer',
        'is_api' => 'boolean',
        'occurred_at' => 'datetime',
    ];
}
