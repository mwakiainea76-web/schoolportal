<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramVersionUnit extends Model
{
    /** @use HasFactory<\Database\Factories\ProgramVersionUnitFactory> */
    use HasFactory;

    protected $table = 'program_version_units';

    protected $fillable = [
        'module_taught',
        'program_version_mapping_id',
        'unit_id',
    ];

    public function programVersionMapping()
    {
        return $this->belongsTo(ProgramVersionMapping::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function academicTimetables()
    {
        return $this->hasMany(AcademicTimetable::class, 'program_version_unit_id');
    }

    public function timetableSessions()
    {
        return $this->belongsToMany(
            AcademicTimetable::class,
            'academic_timetable_program_version_unit',
            'program_version_unit_id',
            'academic_timetable_id'
        )->withTimestamps();
    }

    public function studentRegistrations()
    {
        return $this->hasMany(StudentUnitRegistration::class, 'program_version_unit_id');
    }

    public function marks()
    {
        return $this->hasMany(StudentMark::class, 'program_version_unit_id');
    }
}

