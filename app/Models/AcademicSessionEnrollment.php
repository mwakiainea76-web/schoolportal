<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcademicSessionEnrollment extends Model
{
    use Auditable, HasFactory, SoftDeletes;

    protected string $auditModule = 'academic_session_enrollments';

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
        'session_number' => 'integer',
    ];

    /**
     * Keep module-derived study progress consistent at the model level.
     */
    protected static function booted()
    {
        static::creating(function ($enrollment) {
            if ($enrollment->module) {
                $enrollment->syncStudyProgressFromModule();
            }
        });

        static::updating(function ($enrollment) {
            if ($enrollment->isDirty('module') && $enrollment->module) {
                $enrollment->syncStudyProgressFromModule();
            }
        });
    }

    public function syncStudyProgressFromModule(): void
    {
        $moduleNumber = (int) $this->module;

        if ($moduleNumber < 1) {
            $this->year_of_study = 1;
            $this->session_number = 1;

            return;
        }

        $this->year_of_study = (int) intdiv($moduleNumber - 1, 3) + 1;
        $this->session_number = (int) (($moduleNumber - 1) % 3) + 1;
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

        $studentName = $student?->full_name ?? 'N/A';
        $registration = $student?->admission_number ?? 'N/A';
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
