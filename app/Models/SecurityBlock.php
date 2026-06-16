<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SecurityBlock extends Model
{
    use Auditable, HasFactory;

    protected string $auditModule = 'security_blocks';

    protected array $auditExclude = [
        'created_by',
        'triggered_by_event_id',
    ];

    protected $fillable = [
        'user_id',
        'created_by',
        'triggered_by_event_id',
        'login_identifier',
        'email',
        'ip_address',
        'device_id',
        'location_hint',
        'reason',
        'risk_level',
        'is_active',
        'starts_at',
        'ends_at',
        'lifted_at',
        'notes',
        'context',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'lifted_at' => 'datetime',
        'context' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function triggeredByEvent(): BelongsTo
    {
        return $this->belongsTo(SecurityEvent::class, 'triggered_by_event_id');
    }
}
