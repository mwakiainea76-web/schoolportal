<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Staff extends Model
{
    use Auditable, HasFactory,SoftDeletes;

    protected string $auditModule = 'staff';

    protected array $auditExclude = [
        'user_id',
        'profile_photo',
    ];

    /** @use HasFactory<\Database\Factories\StaffFactory> */
    protected $table = 'staffs';

    protected $fillable = [
        'user_id',
        'department_id',
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
        'designation',
        'staff_number',
        'national_id_number',
        'salary',
        'hired_date',
        'employment_type',
        'highest_qualification',
        'specialization',
        'kra_pin',
        'nhif_number',
        'nssf_number',
        'staff_status',
    ];

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}".($this->other_name ? " {$this->other_name}" : '');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function statusLogs()
    {
        return $this->hasMany(StaffStatusLog::class)
            ->orderByDesc('effective_date')
            ->orderByDesc('id');
    }

    public function hodDepartments()
    {
        return $this->hasMany(Department::class, 'hod_staff_id');
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

    public function approvedCurriculumTransfers()
    {
        return $this->hasMany(CurriculumTransfer::class, 'approved_by');
    }

    public function leaveRequests()
    {
        return $this->hasMany(StaffLeaveRequest::class);
    }

    public function reviewedLeaveRequests()
    {
        return $this->hasMany(StaffLeaveRequest::class, 'reviewed_by');
    }

    public function loanReductions()
    {
        return $this->hasMany(StaffLoanReduction::class);
    }
}
