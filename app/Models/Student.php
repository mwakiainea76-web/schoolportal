<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\StudentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'registration_number',
        'previous_school',
        'current_module',
        'admission_date',
        'student_status',
        'fee_discount_percentage',
    ];

    public function courseEnrollments()
    {
        return $this->hasMany(ProgramEnrollment::class);
    }

    public function programEnrollment()
    {
        return $this->hasOne(ProgramEnrollment::class);
    }

    public function enrollments()
    {
        return $this->hasManyThrough(
            Enrollment::class,
            ProgramEnrollment::class,
            'student_id',
            'course_enrollment_id'
        );
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

