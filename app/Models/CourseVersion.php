<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CourseVersion extends Model
{
    use SoftDeletes;

    protected $table = 'course_versions';

    protected $fillable = [
        'course_id',
        'exam_body_id',
        'name',
        'description',
        'start_date',
        'end_date',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function owningCourse()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function examBody()
    {
        return $this->belongsTo(ExamBody::class);
    }

    public function courseVersionMappings()
    {
        return $this->hasMany(CourseVersionMapping::class);
    }

    public function activeCourseVersionMapping()
    {
        return $this->hasOne(CourseVersionMapping::class)->where('is_active', true);
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function courseVersionUnits()
    {
        return $this->hasMany(CourseVersionUnit::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_version_mappings')
            ->withPivot(['is_active', 'description', 'created_by', 'updated_by'])
            ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function feePlanAssignments()
    {
        return $this->hasMany(FeePlanAssignment::class);
    }
}

