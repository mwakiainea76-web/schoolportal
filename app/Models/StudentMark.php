<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentMark extends Model
{
    use Auditable, HasFactory;

    protected string $auditModule = 'student_marks';

    protected array $auditExclude = [
        'recorded_by_staff_id',
    ];

    protected $fillable = [
        'academic_session_id',
        'academic_session_enrollment_id',
        'student_id',
        'curriculum_unit_id',
        'assessment_type',
        'assessment_number',
        'marks',
        'is_published',
        'recorded_by_staff_id',
    ];

    protected $casts = [
        'assessment_number' => 'integer',
        'marks' => 'integer',
        'is_published' => 'boolean',
    ];

    public function academicSession()
    {
        return $this->belongsTo(AcademicSession::class);
    }

    public function academicSessionEnrollment()
    {
        return $this->belongsTo(AcademicSessionEnrollment::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function curriculumUnit()
    {
        return $this->belongsTo(Unit::class, 'curriculum_unit_id');
    }

    public function recordedByStaff()
    {
        return $this->belongsTo(Staff::class, 'recorded_by_staff_id');
    }
}
