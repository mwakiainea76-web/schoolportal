<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseChangeLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'old_course_enrollment_id',
        'new_course_enrollment_id',
        'old_course_version_mapping_id',
        'new_course_version_mapping_id',
        'old_registration_number',
        'new_registration_number',
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

    public function oldCourseVersionMapping(): BelongsTo
    {
        return $this->belongsTo(CourseVersionMapping::class, 'old_course_version_mapping_id');
    }

    public function newCourseVersionMapping(): BelongsTo
    {
        return $this->belongsTo(CourseVersionMapping::class, 'new_course_version_mapping_id');
    }

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
