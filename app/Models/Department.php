<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'departments';

    protected $fillable = [
        'code',
        'name',
        'description',
        'hod_staff_id',
    ];

    public function courses()
    {
        return $this->hasMany(Course::class, 'department_id');
    }

    public function staffs()
    {
        return $this->hasMany(Staff::class, 'department_id');
    }

    public function hod()
    {
        return $this->belongsTo(Staff::class, 'hod_staff_id');
    }

    public function academicTimetables()
    {
        return $this->hasMany(AcademicTimetable::class, 'department_id');
    }

    public function lectureRooms()
    {
        return $this->hasMany(LectureRoom::class, 'department_id');
    }
}
