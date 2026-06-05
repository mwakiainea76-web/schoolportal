<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    /** @use HasFactory<\Database\Factories\UnitFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'units';

    protected $fillable = [
        'code',
        'name',
        'credit_factor',
        'training_hours',
        'description',
        'curriculum_mapping_id',
        'module_taught',
        'semester',
        'module',
        'is_compulsory',
        'sort_order',
    ];

    protected $casts = [
        'is_compulsory' => 'boolean',
        'credit_factor' => 'integer',
        'training_hours' => 'integer',
        'module_taught' => 'integer',
        'semester' => 'integer',
        'module' => 'integer',
        'sort_order' => 'integer',
    ];

    public function curriculumMapping()
    {
        return $this->belongsTo(CurriculumMapping::class);
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
