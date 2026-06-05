<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentUnitRegistration extends Model
{
    use HasFactory;

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
