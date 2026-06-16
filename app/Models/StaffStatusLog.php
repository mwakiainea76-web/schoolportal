<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffStatusLog extends Model
{
    use Auditable, HasFactory;

    protected string $auditModule = 'staff_status_logs';

    protected array $auditExclude = [
        'recorded_by',
    ];

    protected $fillable = [
        'staff_id',
        'status',
        'effective_date',
        'reason',
        'resume_date',
        'recorded_by',
    ];

    protected function casts(): array
    {
        return [
            'effective_date' => 'date',
            'resume_date' => 'date',
        ];
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }

    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
