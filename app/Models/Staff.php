<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Staff extends Model
{
    use HasFactory,SoftDeletes;

    /** @use HasFactory<\Database\Factories\StaffFactory> */
    protected $table = 'staffs';

    protected $fillable = [
        'designation',
        'salary',
        'staff_status',
        'hired_date',
        'employment_type',
        'staff_number',
        'national_id_number',
        'highest_qualification',
        'specialization',
        'kra_pin',
        'nhif_number',
        'nssf_number',

        'user_id',
        'department_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function next_of_kin()
    {
        return $this->hasMany(NextOfKin::class, 'user_id', 'user_id');
    }

    public function timetableSessions()
    {
        return $this->hasMany(AcademicTimetable::class, 'trainer_staff_id');
    }

    public function createdTimetableSessions()
    {
        return $this->hasMany(AcademicTimetable::class, 'created_by');
    }
}
