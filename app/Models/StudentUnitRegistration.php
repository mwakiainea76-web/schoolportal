<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentUnitRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_session_enrollment_id',
        'program_version_unit_id',
    ];

    public function academicSessionEnrollment()
    {
        return $this->belongsTo(AcademicSessionEnrollment::class);
    }

    public function programVersionUnit()
    {
        return $this->belongsTo(ProgramVersionUnit::class);
    }
}
