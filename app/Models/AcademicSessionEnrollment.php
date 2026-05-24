<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcademicSessionEnrollment extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'academic_session_enrollments';

    protected $fillable = [
        'program_enrollment_id',
        'academic_session_id',
        'module',
        'year_of_study',
        'session_number',
        'status',
    ];

    protected $appends = [
        'student_id',
        'display_name',
        'curriculum',
        'program',
    ];

    protected $casts = [
        'module' => 'integer',
        'year_of_study' => 'integer',
    ];

    /**
     * Boot method to set year_of_study automatically based on session_No
     * Every 3 sessions = 1 year of study
     * Sessions 1-3 = Year 1, Sessions 4-6 = Year 2, etc.
     */
    protected static function booted()
    {
        static::creating(function ($enrollment) {
            if ($enrollment->academic_session_id && ! $enrollment->year_of_study) {
                $enrollment->year_of_study = $enrollment->calculateYearOfStudy();
            }
        });

        static::updating(function ($enrollment) {
            if ($enrollment->isDirty('academic_session_id') && ! $enrollment->isDirty('year_of_study')) {
                $enrollment->year_of_study = $enrollment->calculateYearOfStudy();
            }
        });
    }

    /**
     * Calculate year of study from academic session's session number.
     * Formula: year = ceil(session_No / 3)
     */
    public function calculateYearOfStudy(): int
    {
        if (! $this->academicSession) {
            $session = AcademicSession::find($this->academic_session_id);
        } else {
            $session = $this->academicSession;
        }

        if (! $session || ! $session->session_No) {
            return 1; // Default to year 1 if no session found
        }

        return (int) ceil($session->session_No / 3);
    }

    public function programEnrollment()
    {
        return $this->belongsTo(ProgramEnrollment::class);
    }

    public function academicSession()
    {
        return $this->belongsTo(AcademicSession::class);
    }

    public function student()
    {
        return $this->hasOneThrough(
            Student::class,
            ProgramEnrollment::class,
            'id',
            'id',
            'program_enrollment_id',
            'student_id'
        );
    }

    public function programVersionMapping()
    {
        return $this->hasOneThrough(
            ProgramVersionMapping::class,
            ProgramEnrollment::class,
            'id',
            'id',
            'program_enrollment_id',
            'program_version_mapping_id'
        );
    }

    public function getProgramVersionAttribute()
    {
        return $this->programVersionMapping?->programVersion;
    }

    public function getCurriculumAttribute()
    {
        return $this->getProgramVersionAttribute();
    }

    public function getProgramAttribute()
    {
        return $this->programVersionMapping?->program;
    }

    public function getStudentIdAttribute()
    {
        return $this->programEnrollment?->student_id;
    }

    public function getDisplayNameAttribute(): string
    {
        $studentName = trim(
            ($this->student?->user?->first_name ?? '').' '.($this->student?->user?->last_name ?? '')
        );
        $registration = $this->student?->registration_number ?? 'N/A';
        $session = $this->academicSession?->session_No ?? $this->academicSession?->name ?? 'No Session';
        $curriculum = $this->curriculum?->name ?? 'No ProgramVersion';
        $program = $this->program?->name ?? 'No Program';

        return "{$studentName} ({$registration}) - {$session} - {$curriculum} - {$program} - Year {$this->year_of_study} - Module {$this->module}";
    }

    // In AcademicSessionEnrollment model

    // In StudentInvoices model

    public function adjustments()
    {
        return $this->hasMany(FeeAdjustment::class, 'student_invoice_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'student_invoice_id');
    }
    // app/Models/AcademicSessionEnrollment.php

    public function invoices()
    {
        return $this->hasMany(StudentInvoice::class, 'enrollment_id');
    }
}

