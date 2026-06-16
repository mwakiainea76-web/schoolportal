<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;

class CurriculumTransfer extends Model
{
    use Auditable;

    protected string $auditModule = 'curriculum_transfers';

    protected array $auditExclude = [
        'approved_by',
    ];

    protected $fillable = [
        'student_id',
        'from_curriculum_mapping_id',
        'to_curriculum_mapping_id',
        'transfer_date',
        'reason',
        'approved_by',
    ];

    protected $casts = [
        'transfer_date' => 'date',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function fromCurriculumMapping()
    {
        return $this->belongsTo(CurriculumMapping::class, 'from_curriculum_mapping_id');
    }

    public function toCurriculumMapping()
    {
        return $this->belongsTo(CurriculumMapping::class, 'to_curriculum_mapping_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(Staff::class, 'approved_by');
    }
}
