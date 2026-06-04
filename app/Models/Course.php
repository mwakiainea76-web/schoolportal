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

    public function courseVersionMappings()
    {
        return $this->hasMany(CourseVersionMapping::class);
    }

    public function ownedCourseVersions()
    {
        return $this->hasMany(CourseVersion::class);
    }

    public function curriculum()
    {
        return $this->hasOneThrough(
            CourseVersion::class,
            CourseVersionMapping::class,
            'course_id',
            'id',
            'id',
            'course_version_id'
        )->where('course_version_mappings.is_active', true);
    }

    public function courseVersions()
    {
        return $this->belongsToMany(CourseVersion::class, 'course_version_mappings')
            ->withPivot(['is_active', 'description', 'created_by', 'updated_by'])
            ->withTimestamps();
    }

    public function getDisplayNameAttribute(): string
    {
        $certificationLevel = $this->relationLoaded('certificationLevel')
            ? $this->getRelation('certificationLevel')
            : null;

        return trim($this->name.' - '.($certificationLevel?->name ?? ''), ' -');
    }
}


