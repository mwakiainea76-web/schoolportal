<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Curriculum extends Model
{
    use SoftDeletes;

    protected $table = 'curriculum';

    protected $fillable = [
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

    public function courseCurricula()
    {
        return $this->hasMany(CourseCurriculum::class);
    }

    public function activeCourseCurriculum()
    {
        return $this->hasOne(CourseCurriculum::class)->where('is_active', true);
    }

    public function course()
    {
        return $this->hasOneThrough(
            Course::class,
            CourseCurriculum::class,
            'curriculum_id',
            'id',
            'id',
            'course_id'
        )->where('course_curriculum.is_active', true);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_curriculum')
            ->withPivot(['is_active', 'description', 'created_by', 'updated_by'])
            ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
