<?php

namespace App\Services;

use App\Models\AcademicSessionEnrollment;
use App\Models\CourseEnrollment;
use App\Models\Student;
use App\Models\StudentInvoice;

class StudentAcademicContextService
{
    public function latestSessionEnrollmentForStudent(?Student $student): ?AcademicSessionEnrollment
    {
        if (! $student) {
            return null;
        }

        return AcademicSessionEnrollment::query()
            ->with([
                'academicSession.academicYear',
                'courseEnrollment.course',
                'courseEnrollment.courseVersion',
                'courseEnrollment.examBody',
                'courseEnrollment.courseVersionMapping.course',
                'courseEnrollment.courseVersionMapping.courseVersion',
            ])
            ->whereHas('courseEnrollment', fn ($query) => $query->where('student_id', $student->id))
            ->latest('academic_session_id')
            ->latest('id')
            ->first();
    }

    public function latestCourseEnrollmentForStudent(?Student $student): ?CourseEnrollment
    {
        if (! $student) {
            return null;
        }

        return CourseEnrollment::query()
            ->with([
                'course',
                'courseVersion',
                'examBody',
                'courseVersionMapping.course',
                'courseVersionMapping.courseVersion',
            ])
            ->where('student_id', $student->id)
            ->latest('id')
            ->first();
    }

    public function currentCourseEnrollmentForStudent(?Student $student): ?CourseEnrollment
    {
        $sessionEnrollment = $this->latestSessionEnrollmentForStudent($student);

        if ($sessionEnrollment?->courseEnrollment) {
            return $sessionEnrollment->courseEnrollment;
        }

        return $this->latestCourseEnrollmentForStudent($student);
    }

    public function courseEnrollmentForInvoice(StudentInvoice $invoice): ?CourseEnrollment
    {
        if ($invoice->relationLoaded('enrollment') && $invoice->enrollment?->courseEnrollment) {
            return $invoice->enrollment->courseEnrollment;
        }

        $invoice->loadMissing('enrollment.courseEnrollment.course');
        $invoice->loadMissing('enrollment.courseEnrollment.courseVersion');
        $invoice->loadMissing('enrollment.courseEnrollment.examBody');
        $invoice->loadMissing('enrollment.courseEnrollment.courseVersionMapping.course');
        $invoice->loadMissing('enrollment.courseEnrollment.courseVersionMapping.courseVersion');

        if ($invoice->enrollment?->courseEnrollment) {
            return $invoice->enrollment->courseEnrollment;
        }

        return $this->latestCourseEnrollmentForStudent($invoice->student);
    }
}
