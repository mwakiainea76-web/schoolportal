<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StaffLeaveRequest extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected string $auditModule = 'hr.leave_requests';

    protected $fillable = [
        'staff_id',
        'leave_type',
        'start_date',
        'end_date',
        'total_days',
        'reason',
        'status',
        'reviewed_by',
        'reviewed_at',
        'review_note',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'reviewed_at' => 'datetime',
        ];
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(Staff::class, 'reviewed_by');
    }
}
