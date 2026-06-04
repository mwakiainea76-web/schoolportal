<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseVersionUnit extends Model
{
    /** @use HasFactory<\Database\Factories\CourseVersionUnitFactory> */
    use HasFactory;

    protected $table = 'course_version_units';

    protected $fillable = [
        'course_version_id',
        'module_taught',
        'module',
        'semester',
        'is_compulsory',
        'sort_order',
        'course_version_mapping_id',
        'unit_id',
    ];

    protected $casts = [
        'is_compulsory' => 'boolean',
    ];

    public function courseVersion()
    {
        return $this->belongsTo(CourseVersion::class);
    }

    public function courseVersionMapping()
    {
        return $this->belongsTo(CourseVersionMapping::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function academicTimetables()
    {
        return $this->hasMany(AcademicTimetable::class, 'course_version_unit_id');
    }

    public function timetableSessions()
    {
        return $this->belongsToMany(
            AcademicTimetable::class,
            'academic_timetable_course_version_unit',
            'course_version_unit_id',
            'academic_timetable_id'
        )->withTimestamps();
    }

    public function studentRegistrations()
    {
        return $this->hasMany(StudentUnitRegistration::class, 'course_version_unit_id');
    }

    public function marks()
    {
        return $this->hasMany(StudentMark::class, 'course_version_unit_id');
    }
}
