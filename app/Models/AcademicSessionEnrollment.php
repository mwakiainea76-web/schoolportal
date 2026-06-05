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
        'course_enrollment_id',
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
        'course',
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

    public function courseEnrollment()
    {
        return $this->belongsTo(CourseEnrollment::class);
    }

    public function academicSession()
    {
        return $this->belongsTo(AcademicSession::class);
    }

    public function student()
    {
        return $this->hasOneThrough(
            Student::class,
            CourseEnrollment::class,
            'id',
            'id',
            'course_enrollment_id',
            'student_id'
        );
    }

    public function curriculumMapping()
    {
        return $this->hasOneThrough(
            CurriculumMapping::class,
            CourseEnrollment::class,
            'id',
            'id',
            'course_enrollment_id',
            'curriculum_mapping_id'
        );
    }

    public function getCurriculumAttribute()
    {
        if (! $this->relationLoaded('curriculumMapping')) {
            return null;
        }

        $mapping = $this->getRelation('curriculumMapping');

        if (! $mapping || ! $mapping->relationLoaded('curriculum')) {
            return null;
        }

        return $mapping->getRelation('curriculum');
    }

    public function getCourseAttribute()
    {
        if (! $this->relationLoaded('curriculumMapping')) {
            return null;
        }

        $mapping = $this->getRelation('curriculumMapping');

        if (! $mapping || ! $mapping->relationLoaded('course')) {
            return null;
        }

        return $mapping->getRelation('course');
    }

    public function getStudentIdAttribute()
    {
        if (! $this->relationLoaded('courseEnrollment')) {
            return null;
        }

        return $this->getRelation('courseEnrollment')?->student_id;
    }

    public function getDisplayNameAttribute(): string
    {
        $student = $this->relationLoaded('student')
            ? $this->getRelation('student')
            : null;
        $studentUser = $student && $student->relationLoaded('user')
            ? $student->getRelation('user')
            : null;
        $academicSession = $this->relationLoaded('academicSession')
            ? $this->getRelation('academicSession')
            : null;

        $studentName = trim(
            ($studentUser?->first_name ?? '').' '.($studentUser?->last_name ?? '')
        );
        $registration = $student?->registration_number ?? 'N/A';
        $session = $academicSession?->session_No ?? $academicSession?->name ?? 'No Session';
        $curriculum = $this->curriculum?->name ?? 'No Curriculum';
        $course = $this->course?->name ?? 'No Course';

        return "{$studentName} ({$registration}) - {$session} - {$curriculum} - {$course} - Year {$this->year_of_study} - Module {$this->module}";
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

    public function hostelAllocation()
    {
        return $this->hasOne(HostelAllocation::class, 'academic_session_enrollment_id');
    }

    public function unitRegistrations()
    {
        return $this->hasMany(StudentUnitRegistration::class, 'academic_session_enrollment_id');
    }

    public function marks()
    {
        return $this->hasMany(StudentMark::class, 'academic_session_enrollment_id');
    }
}
