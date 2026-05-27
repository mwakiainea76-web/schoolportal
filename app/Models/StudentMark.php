<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentMark extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_session_id',
        'academic_session_enrollment_id',
        'student_id',
        'program_version_unit_id',
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

    public function programVersionUnit()
    {
        return $this->belongsTo(ProgramVersionUnit::class);
    }

    public function recordedByStaff()
    {
        return $this->belongsTo(Staff::class, 'recorded_by_staff_id');
    }
}
