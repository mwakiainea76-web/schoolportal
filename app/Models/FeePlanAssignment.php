<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeePlanAssignment extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'fee_plan_id',
        'curriculum_id',
        'academic_year_id',
        'session_id',
        'plan_type_context',
        'revises_assignment_id',
        'amount_snapshot',
        'assigned_by',
        'assigned_at',
        'status',
        'cancellation_reason',
        'cancelled_by',
        'cancelled_at',
    ];

    protected $casts = [
        'amount_snapshot' => 'array',
        'assigned_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function feePlan()
    {
        return $this->belongsTo(FeePlan::class);
    }

    public function curriculum()
    {
        return $this->belongsTo(ProgramVersion::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function session()
    {
        return $this->belongsTo(AcademicSession::class, 'session_id');
    }

    public function revisesAssignment()
    {
        return $this->belongsTo(self::class, 'revises_assignment_id');
    }

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function cancelledBy()
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}

