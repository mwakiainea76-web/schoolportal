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
        'course_id',
        'course_version_id',
        'exam_body_id',
        'course_version_mapping_id',
        'enrollment_date',
        'intake_year',
        'intake_period',
        'expected_completion_date',
        'study_mode',
        'status',
        'transferred_at',
        'transferred_by',
    ];

    protected $casts = [
        'transferred_at' => 'datetime',
        'enrollment_date' => 'date',
        'expected_completion_date' => 'date',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function courseVersionMapping()
    {
        return $this->belongsTo(CourseVersionMapping::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function courseVersion()
    {
        return $this->belongsTo(CourseVersion::class);
    }

    public function examBody()
    {
        return $this->belongsTo(ExamBody::class);
    }

    public function academicSessionEnrollments()
    {
        return $this->hasMany(AcademicSessionEnrollment::class);
    }

    public function curriculum()
    {
        if ($this->relationLoaded('courseVersion')) {
            return $this->getRelation('courseVersion');
        }

        if (! $this->relationLoaded('courseVersionMapping')) {
            return null;
        }

        return $this->getRelation('courseVersionMapping')?->courseVersion();
    }

}
