<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcademicTimetable extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'academic_timetables';

    protected $fillable = [
        'department_id',
        'academic_session_id',
        'curriculum_unit_id',
        'trainer_staff_id',
        'lecture_room_id',
        'day_of_week',
        'start_time',
        'end_time',
        'created_by',
        'updated_by',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function academicSession()
    {
        return $this->belongsTo(AcademicSession::class, 'academic_session_id');
    }

    public function curriculumUnit()
    {
        return $this->belongsTo(Unit::class, 'curriculum_unit_id');
    }

    public function curriculumUnits()
    {
        return $this->belongsToMany(
            Unit::class,
            'academic_timetable_curriculum_unit',
            'academic_timetable_id',
            'curriculum_unit_id'
        )->withTimestamps();
    }

    public function trainer()
    {
        return $this->belongsTo(Staff::class, 'trainer_staff_id');
    }

    public function lectureRoom()
    {
        return $this->belongsTo(LectureRoom::class, 'lecture_room_id');
    }

    public function creator()
    {
        return $this->belongsTo(Staff::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(Staff::class, 'updated_by');
    }
}
