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
        return $this->hasMany(CourseEnrollment::class);
    }

    public function courseEnrollment()
    {
        return $this->hasOne(CourseEnrollment::class)
            ->where('status', 'active')
            ->latestOfMany();
    }

    public function courseChangeLogs()
    {
        return $this->hasMany(CourseChangeLog::class);
    }

    public function courseVersionTransfers()
    {
        return $this->hasMany(CourseVersionTransfer::class);
    }

    public function enrollments()
    {
        return $this->hasManyThrough(
            Enrollment::class,
            CourseEnrollment::class,
            'student_id',
            'course_enrollment_id'
        );
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ledgerTransactions()
    {
        return $this->hasMany(LedgerTransaction::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function hostelAllocations()
    {
        return $this->hasMany(HostelAllocation::class);
    }

    public function marks()
    {
        return $this->hasMany(StudentMark::class);
    }
}
