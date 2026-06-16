<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentUnitRegistration extends Model
{
    use Auditable, HasFactory;

    protected string $auditModule = 'student_unit_registrations';

    protected $fillable = [
        'academic_session_enrollment_id',
        'curriculum_unit_id',
    ];

    public function academicSessionEnrollment()
    {
        return $this->belongsTo(AcademicSessionEnrollment::class);
    }

    public function curriculumUnit()
    {
        return $this->belongsTo(Unit::class, 'curriculum_unit_id');
    }
}
