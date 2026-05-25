<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LectureRoom extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'lecture_rooms';

    protected $fillable = [
        'department_id',
        'name',
        'code',
        'capacity',
        'location',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function academicTimetables()
    {
        return $this->hasMany(AcademicTimetable::class, 'lecture_room_id');
    }
}
