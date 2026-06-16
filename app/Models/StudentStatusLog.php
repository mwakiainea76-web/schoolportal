<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentStatusLog extends Model
{
    use Auditable, HasFactory;

    protected string $auditModule = 'student_status_logs';

    protected array $auditExclude = [
        'recorded_by',
    ];

    protected $fillable = [
        'student_id',
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

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
