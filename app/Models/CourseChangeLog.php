<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseChangeLog extends Model
{
    use Auditable, HasFactory;

    protected string $auditModule = 'course_change_logs';

    protected array $auditExclude = [
        'processed_by',
    ];

    protected $fillable = [
        'student_id',
        'old_course_enrollment_id',
        'new_course_enrollment_id',
        'old_curriculum_mapping_id',
        'new_curriculum_mapping_id',
        'old_admission_number',
        'new_admission_number',
        'old_user_id',
        'new_user_id',
        'processed_by',
        'changed_at',
        'notes',
    ];

    protected $casts = [
        'changed_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function oldCurriculumMapping(): BelongsTo
    {
        return $this->belongsTo(CurriculumMapping::class, 'old_curriculum_mapping_id');
    }

    public function newCurriculumMapping(): BelongsTo
    {
        return $this->belongsTo(CurriculumMapping::class, 'new_curriculum_mapping_id');
    }

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
