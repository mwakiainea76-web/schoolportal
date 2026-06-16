<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HostelAllocation extends Model
{
    use Auditable, HasFactory;

    protected string $auditModule = 'hostel_allocations';

    protected array $auditExclude = [
        'created_by',
        'updated_by',
    ];

    protected $fillable = [
        'academic_session_enrollment_id',
        'student_id',
        'academic_session_id',
        'hostel_id',
        'hostel_room_id',
        'hostel_bed_id',
        'student_invoice_id',
        'hostel_fee_amount',
        'allocated_on',
        'status',
        'notes',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'hostel_fee_amount' => 'decimal:2',
        'allocated_on' => 'date',
    ];

    public function enrollment()
    {
        return $this->belongsTo(AcademicSessionEnrollment::class, 'academic_session_enrollment_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function academicSession()
    {
        return $this->belongsTo(AcademicSession::class);
    }

    public function hostel()
    {
        return $this->belongsTo(Hostel::class);
    }

    public function room()
    {
        return $this->belongsTo(HostelRoom::class, 'hostel_room_id');
    }

    public function bed()
    {
        return $this->belongsTo(HostelBed::class, 'hostel_bed_id');
    }

    public function invoice()
    {
        return $this->belongsTo(StudentInvoice::class, 'student_invoice_id');
    }
}
