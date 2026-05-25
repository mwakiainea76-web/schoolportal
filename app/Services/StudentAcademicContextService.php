<?php

namespace App\Services;

use App\Models\AcademicSessionEnrollment;
use App\Models\ProgramEnrollment;
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
                'programEnrollment.programVersionMapping.program',
                'programEnrollment.programVersionMapping.programVersion',
            ])
            ->whereHas('programEnrollment', fn ($query) => $query->where('student_id', $student->id))
            ->latest('academic_session_id')
            ->latest('id')
            ->first();
    }

    public function latestProgramEnrollmentForStudent(?Student $student): ?ProgramEnrollment
    {
        if (! $student) {
            return null;
        }

        return ProgramEnrollment::query()
            ->with([
                'programVersionMapping.program',
                'programVersionMapping.programVersion',
            ])
            ->where('student_id', $student->id)
            ->latest('id')
            ->first();
    }

    public function currentProgramEnrollmentForStudent(?Student $student): ?ProgramEnrollment
    {
        $sessionEnrollment = $this->latestSessionEnrollmentForStudent($student);

        if ($sessionEnrollment?->programEnrollment) {
            return $sessionEnrollment->programEnrollment;
        }

        return $this->latestProgramEnrollmentForStudent($student);
    }

    public function programEnrollmentForInvoice(StudentInvoice $invoice): ?ProgramEnrollment
    {
        if ($invoice->relationLoaded('enrollment') && $invoice->enrollment?->programEnrollment) {
            return $invoice->enrollment->programEnrollment;
        }

        $invoice->loadMissing('enrollment.programEnrollment.programVersionMapping.program');
        $invoice->loadMissing('enrollment.programEnrollment.programVersionMapping.programVersion');

        if ($invoice->enrollment?->programEnrollment) {
            return $invoice->enrollment->programEnrollment;
        }

        return $this->latestProgramEnrollmentForStudent($invoice->student);
    }
}
