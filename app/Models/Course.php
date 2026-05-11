<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'courses';

    protected $appends = ['display_name'];

    protected $fillable = [
        'code',
        'name',
        'description',
        'duration_in_months',
        'initials',
        'certification_level_id',
        'department_id',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function certificationLevel()
    {
        return $this->belongsTo(CertificationLevel::class);
    }

    public function courseCurricula()
    {
        return $this->hasMany(CourseCurriculum::class);
    }

    public function curriculum()
    {
        return $this->hasOneThrough(
            Curriculum::class,
            CourseCurriculum::class,
            'course_id',
            'id',
            'id',
            'curriculum_id'
        )->where('course_curriculum.is_active', true);
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->name.' - '.
            optional($this->certificationLevel)->name;
    }
}
