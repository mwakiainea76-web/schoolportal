<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseVersionTransfer extends Model
{
    protected $fillable = [
        'student_id',
        'from_course_version_mapping_id',
        'to_course_version_mapping_id',
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

    public function fromCourseVersionMapping()
    {
        return $this->belongsTo(CourseVersionMapping::class, 'from_course_version_mapping_id');
    }

    public function toCourseVersionMapping()
    {
        return $this->belongsTo(CourseVersionMapping::class, 'to_course_version_mapping_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(Staff::class, 'approved_by');
    }
}
