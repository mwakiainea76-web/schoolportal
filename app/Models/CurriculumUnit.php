<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CurriculumUnit extends Model
{
    /** @use HasFactory<\Database\Factories\CurriculumUnitFactory> */
    use HasFactory;

    protected $table = 'curriculum_units';

    protected $fillable = [
        'curriculum_id',
        'module_taught',
        'module',
        'semester',
        'is_compulsory',
        'sort_order',
        'curriculum_mapping_id',
        'unit_id',
    ];

    protected $casts = [
        'is_compulsory' => 'boolean',
    ];

    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class);
    }

    public function curriculumMapping()
    {
        return $this->belongsTo(CurriculumMapping::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function academicTimetables()
    {
        return $this->hasMany(AcademicTimetable::class, 'curriculum_unit_id');
    }

    public function timetableSessions()
    {
        return $this->belongsToMany(
            AcademicTimetable::class,
            'academic_timetable_curriculum_unit',
            'curriculum_unit_id',
            'academic_timetable_id'
        )->withTimestamps();
    }

    public function studentRegistrations()
    {
        return $this->hasMany(StudentUnitRegistration::class, 'curriculum_unit_id');
    }

    public function marks()
    {
        return $this->hasMany(StudentMark::class, 'curriculum_unit_id');
    }
}
