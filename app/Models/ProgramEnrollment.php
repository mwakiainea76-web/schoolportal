<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProgramEnrollment extends Model
{
    /** @use HasFactory<\Database\Factories\EnrollmentFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'program_enrollments';

    protected $fillable = [
        'student_id',
        'program_version_mapping_id',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function programVersionMapping()
    {
        return $this->belongsTo(ProgramVersionMapping::class);
    }

    public function academicSessionEnrollments()
    {
        return $this->hasMany(AcademicSessionEnrollment::class);
    }

    public function curriculum()
    {
        return $this->programVersionMapping?->programVersion();
    }

    public function program()
    {
        return $this->programVersionMapping?->program();
    }
}

