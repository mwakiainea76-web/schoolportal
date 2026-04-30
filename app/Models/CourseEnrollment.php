<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CourseEnrollment extends Model
{
    /** @use HasFactory<\Database\Factories\EnrollmentFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'course_enrollments';

    protected $fillable = [
        'student_id',
        'course_curriculum_id',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function courseCurriculum()
    {
        return $this->belongsTo(CourseCurriculum::class);
    }

    public function academicSessionEnrollments()
    {
        return $this->hasMany(AcademicSessionEnrollment::class);
    }

    public function curriculum()
    {
        return $this->courseCurriculum?->curriculum();
    }

    public function course()
    {
        return $this->courseCurriculum?->course();
    }
}
