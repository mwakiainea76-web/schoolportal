<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\StudentFactory> */
    use Auditable, HasFactory, SoftDeletes;

    protected string $auditModule = 'students';

    protected array $auditExclude = [
        'user_id',
        'profile_photo',
    ];

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'other_name',
        'email',
        'phone_number',
        'date_of_birth',
        'county',
        'address',
        'gender',
        'profile_photo',
        'religion',
        'is_pwd',
        'disability_type',
        'medical_condition',
        'admission_number',
        'current_module',
        'previous_school',
        'fee_discount_percentage',
        'enrollment_status',
    ];

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}" . ($this->other_name ? " {$this->other_name}" : "");
    }

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

    public function statusLogs()
    {
        return $this->hasMany(StudentStatusLog::class)
            ->orderByDesc('effective_date')
            ->orderByDesc('id');
    }

    public function curriculumTransfers()
    {
        return $this->hasMany(CurriculumTransfer::class);
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

    public function nextOfKin()
    {
        return $this->hasMany(NextOfKin::class, 'user_id', 'user_id');
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
