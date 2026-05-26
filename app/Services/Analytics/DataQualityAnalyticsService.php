<?php

namespace App\Services\Analytics;

use App\Services\Analytics\Concerns\BuildsAnalyticsFilters;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DataQualityAnalyticsService
{
    use BuildsAnalyticsFilters;

    public function summary(array $filters = []): array
    {
        $filters = $this->normalizeFilters($filters);

        $studentsWithoutUserBase = DB::table('students')
            ->leftJoin('users', 'users.id', '=', 'students.user_id')
            ->whereNull('students.deleted_at')
            ->where(function ($query) {
                $query->whereNull('users.id')
                    ->orWhereNotNull('users.deleted_at');
            });

        $studentsWithoutProgramEnrollmentBase = DB::table('students')
            ->join('users', 'users.id', '=', 'students.user_id')
            ->whereNull('students.deleted_at')
            ->whereNull('users.deleted_at')
            ->whereNotExists(function ($query) {
                $query->selectRaw('1')
                    ->from('program_enrollments')
                    ->whereColumn('program_enrollments.student_id', 'students.id')
                    ->whereNull('program_enrollments.deleted_at');
            });

        $enrollmentsWithoutAcademicSessionBase = DB::table('academic_session_enrollments')
            ->leftJoin('academic_sessions', 'academic_sessions.id', '=', 'academic_session_enrollments.academic_session_id')
            ->leftJoin('program_enrollments', 'program_enrollments.id', '=', 'academic_session_enrollments.program_enrollment_id')
            ->whereNull('academic_session_enrollments.deleted_at')
            ->where(function ($query) {
                $query->whereNull('academic_sessions.id')
                    ->orWhereNotNull('academic_sessions.deleted_at')
                    ->orWhereNull('program_enrollments.id')
                    ->orWhereNotNull('program_enrollments.deleted_at');
            });

        $invoicesWithoutEnrollmentBase = DB::table('student_invoices')
            ->leftJoin('academic_session_enrollments', 'academic_session_enrollments.id', '=', 'student_invoices.enrollment_id')
            ->whereNull('student_invoices.deleted_at')
            ->where(function ($query) {
                $query->whereNull('academic_session_enrollments.id')
                    ->orWhereNotNull('academic_session_enrollments.deleted_at');
            });

        $paymentsWithoutStudentBase = DB::table('payments')
            ->leftJoin('students', 'students.id', '=', 'payments.student_id')
            ->where(function ($query) {
                $query->whereNull('payments.student_id')
                    ->orWhereNull('students.id')
                    ->orWhereNotNull('students.deleted_at');
            });

        $hostelAllocationsWithoutBedOrRoomBase = DB::table('hostel_allocations')
            ->leftJoin('hostel_rooms', 'hostel_rooms.id', '=', 'hostel_allocations.hostel_room_id')
            ->leftJoin('hostel_beds', 'hostel_beds.id', '=', 'hostel_allocations.hostel_bed_id')
            ->where(function ($query) {
                $query->whereNull('hostel_rooms.id')
                    ->orWhereNotNull('hostel_rooms.deleted_at')
                    ->orWhereNull('hostel_beds.id')
                    ->orWhereNotNull('hostel_beds.deleted_at');
            });

        $multipleActiveAcademicSessionsBase = DB::table('academic_sessions')
            ->leftJoin('academic_years', 'academic_years.id', '=', 'academic_sessions.academic_year_id')
            ->whereNull('academic_sessions.deleted_at')
            ->where('academic_sessions.is_active', true);

        $multipleActiveProgramMappingsBase = DB::table('program_version_mappings')
            ->join('programs', 'programs.id', '=', 'program_version_mappings.program_id')
            ->join('program_versions', 'program_versions.id', '=', 'program_version_mappings.program_version_id')
            ->whereNull('program_version_mappings.deleted_at')
            ->where('program_version_mappings.is_active', true);

        $invoiceStudentMismatchBase = DB::table('student_invoices')
            ->join('academic_session_enrollments', 'academic_session_enrollments.id', '=', 'student_invoices.enrollment_id')
            ->join('program_enrollments', 'program_enrollments.id', '=', 'academic_session_enrollments.program_enrollment_id')
            ->whereNull('student_invoices.deleted_at')
            ->whereNull('academic_session_enrollments.deleted_at')
            ->whereNull('program_enrollments.deleted_at')
            ->whereColumn('student_invoices.student_id', '!=', 'program_enrollments.student_id');

        $invalidInvoiceStatusesBase = DB::table('student_invoices')
            ->whereNull('deleted_at')
            ->where(function ($query) {
                $query->where(function ($nested) {
                    $nested->where('status', 'paid')
                        ->where('balance_due', '>', 0);
                })->orWhere(function ($nested) {
                    $nested->whereIn('status', ['issued', 'partial'])
                        ->where('amount_due', '<=', 0);
                })->orWhere(function ($nested) {
                    $nested->where('status', 'draft')
                        ->where('paid_amount', '>', 0);
                });
            });

        $inactiveStudentActiveAllocationBase = DB::table('hostel_allocations')
            ->join('students', 'students.id', '=', 'hostel_allocations.student_id')
            ->join('users', 'users.id', '=', 'students.user_id')
            ->whereNull('students.deleted_at')
            ->whereNull('users.deleted_at')
            ->where('hostel_allocations.status', 'active')
            ->where('students.student_status', '!=', 'active');

        $duplicateContactIdentifierCount = $this->duplicateContactIdentifierCount();
        $duplicateContacts = $this->duplicateContacts();

        $studentsWithoutUserCount = (clone $studentsWithoutUserBase)->count();
        $studentsWithoutProgramEnrollmentCount = (clone $studentsWithoutProgramEnrollmentBase)->count();
        $enrollmentsWithoutAcademicSessionCount = (clone $enrollmentsWithoutAcademicSessionBase)->count();
        $invoicesWithoutEnrollmentCount = (clone $invoicesWithoutEnrollmentBase)->count();
        $paymentsWithoutStudentCount = (clone $paymentsWithoutStudentBase)->count();
        $hostelAllocationsWithoutBedOrRoomCount = (clone $hostelAllocationsWithoutBedOrRoomBase)->count();
        $invoiceStudentMismatchCount = (clone $invoiceStudentMismatchBase)->count();
        $invalidInvoiceStatusesCount = (clone $invalidInvoiceStatusesBase)->count();
        $inactiveStudentActiveAllocationCount = (clone $inactiveStudentActiveAllocationBase)->count();

        $activeAcademicSessions = (clone $multipleActiveAcademicSessionsBase)
            ->select(
                'academic_sessions.id',
                'academic_sessions.session_number',
                'academic_sessions.session_No',
                'academic_sessions.label',
                'academic_years.academic_year'
            )
            ->orderByDesc('academic_sessions.id')
            ->get()
            ->map(fn ($row) => [
                'academic_session_id' => (int) $row->id,
                'session_label' => trim(($row->academic_year ? $row->academic_year.' / ' : '').($row->label ?: 'Session '.($row->session_number ?? $row->session_No))),
                'session_number' => (int) ($row->session_number ?? $row->session_No ?? 0),
            ])
            ->all();

        $multipleActiveAcademicSessions = count($activeAcademicSessions) > 1
            ? $activeAcademicSessions
            : [];

        $multipleActiveProgramMappings = (clone $multipleActiveProgramMappingsBase)
            ->groupBy('program_version_mappings.program_id', 'programs.name')
            ->select('program_version_mappings.program_id', 'programs.name as program_name')
            ->selectRaw('COUNT(*) as active_mapping_count')
            ->havingRaw('COUNT(*) > 1')
            ->orderByDesc('active_mapping_count')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'program_id' => (int) $row->program_id,
                'program_name' => $row->program_name,
                'active_mapping_count' => (int) $row->active_mapping_count,
            ])
            ->all();

        $slowQueryCount = $this->countLogOccurrences('Slow database query detected.');
        $strictModeErrorCount = $this->countLogOccurrences('LazyLoadingViolationException');
        $failedJobCount = Schema::hasTable('failed_jobs')
            ? DB::table('failed_jobs')->count()
            : 0;

        return [
            'filters' => $filters,
            'metrics' => [
                'records_missing_required_relationships' => (int) (
                    $studentsWithoutUserCount +
                    $studentsWithoutProgramEnrollmentCount +
                    $enrollmentsWithoutAcademicSessionCount +
                    $invoicesWithoutEnrollmentCount +
                    $paymentsWithoutStudentCount +
                    $hostelAllocationsWithoutBedOrRoomCount
                ),
                'duplicate_contact_identifiers' => $duplicateContactIdentifierCount,
                'orphaned_financial_records' => (int) (
                    $invoicesWithoutEnrollmentCount +
                    $paymentsWithoutStudentCount +
                    $invoiceStudentMismatchCount
                ),
                'invalid_status_combinations' => (int) (
                    $invalidInvoiceStatusesCount +
                    $inactiveStudentActiveAllocationCount
                ),
                'strict_mode_error_count' => $strictModeErrorCount,
                'slow_query_count' => $slowQueryCount,
                'failed_job_count' => (int) $failedJobCount,
                'multi_active_session_count' => count($multipleActiveAcademicSessions),
                'multi_active_program_mapping_count' => count($multipleActiveProgramMappings),
            ],
            'exceptions' => [
                'students_without_user' => (clone $studentsWithoutUserBase)
                    ->select('students.id', 'students.registration_number')
                    ->orderByDesc('students.id')
                    ->limit(10)
                    ->get()
                    ->map(fn ($row) => [
                        'student_id' => (int) $row->id,
                        'registration_number' => $row->registration_number,
                    ])
                    ->all(),
                'students_without_program_enrollment' => (clone $studentsWithoutProgramEnrollmentBase)
                    ->select('students.id', 'students.registration_number', 'users.first_name', 'users.last_name')
                    ->orderByDesc('students.id')
                    ->limit(10)
                    ->get()
                    ->map(fn ($row) => [
                        'student_id' => (int) $row->id,
                        'registration_number' => $row->registration_number,
                        'student_name' => trim($row->first_name.' '.$row->last_name),
                    ])
                    ->all(),
                'enrollments_without_academic_session' => (clone $enrollmentsWithoutAcademicSessionBase)
                    ->select('academic_session_enrollments.id', 'academic_session_enrollments.program_enrollment_id', 'academic_session_enrollments.academic_session_id')
                    ->orderByDesc('academic_session_enrollments.id')
                    ->limit(10)
                    ->get()
                    ->map(fn ($row) => [
                        'enrollment_id' => (int) $row->id,
                        'program_enrollment_id' => (int) $row->program_enrollment_id,
                        'academic_session_id' => $row->academic_session_id ? (int) $row->academic_session_id : null,
                    ])
                    ->all(),
                'invoices_without_enrollment' => (clone $invoicesWithoutEnrollmentBase)
                    ->select('student_invoices.id', 'student_invoices.invoice_number', 'student_invoices.student_id')
                    ->orderByDesc('student_invoices.id')
                    ->limit(10)
                    ->get()
                    ->map(fn ($row) => [
                        'invoice_id' => (int) $row->id,
                        'invoice_number' => $row->invoice_number,
                        'student_id' => (int) $row->student_id,
                    ])
                    ->all(),
                'payments_without_student' => (clone $paymentsWithoutStudentBase)
                    ->select('payments.id', 'payments.reference', 'payments.amount', 'payments.student_id')
                    ->orderByDesc('payments.id')
                    ->limit(10)
                    ->get()
                    ->map(fn ($row) => [
                        'payment_id' => (int) $row->id,
                        'reference' => $row->reference ?: 'No reference',
                        'amount' => round((float) $row->amount, 2),
                        'student_id' => $row->student_id ? (int) $row->student_id : null,
                    ])
                    ->all(),
                'hostel_allocations_without_bed_or_room' => (clone $hostelAllocationsWithoutBedOrRoomBase)
                    ->select('hostel_allocations.id', 'hostel_allocations.hostel_room_id', 'hostel_allocations.hostel_bed_id')
                    ->orderByDesc('hostel_allocations.id')
                    ->limit(10)
                    ->get()
                    ->map(fn ($row) => [
                        'allocation_id' => (int) $row->id,
                        'hostel_room_id' => $row->hostel_room_id ? (int) $row->hostel_room_id : null,
                        'hostel_bed_id' => $row->hostel_bed_id ? (int) $row->hostel_bed_id : null,
                    ])
                    ->all(),
                'multiple_active_academic_sessions' => $multipleActiveAcademicSessions,
                'multiple_active_program_mappings' => $multipleActiveProgramMappings,
                'duplicate_contact_identifiers' => $duplicateContacts,
                'invoice_student_mismatches' => (clone $invoiceStudentMismatchBase)
                    ->join('students', 'students.id', '=', 'student_invoices.student_id')
                    ->join('users', 'users.id', '=', 'students.user_id')
                    ->select(
                        'student_invoices.id',
                        'student_invoices.invoice_number',
                        'students.registration_number',
                        'users.first_name',
                        'users.last_name'
                    )
                    ->orderByDesc('student_invoices.id')
                    ->limit(10)
                    ->get()
                    ->map(fn ($row) => [
                        'invoice_id' => (int) $row->id,
                        'invoice_number' => $row->invoice_number,
                        'registration_number' => $row->registration_number,
                        'student_name' => trim($row->first_name.' '.$row->last_name),
                    ])
                    ->all(),
                'invalid_invoice_statuses' => (clone $invalidInvoiceStatusesBase)
                    ->select('id', 'invoice_number', 'status', 'amount_due', 'paid_amount', 'balance_due')
                    ->orderByDesc('id')
                    ->limit(10)
                    ->get()
                    ->map(fn ($row) => [
                        'invoice_id' => (int) $row->id,
                        'invoice_number' => $row->invoice_number,
                        'status' => $row->status,
                        'amount_due' => round((float) $row->amount_due, 2),
                        'paid_amount' => round((float) $row->paid_amount, 2),
                        'balance_due' => round((float) $row->balance_due, 2),
                    ])
                    ->all(),
            ],
            'signals' => [
                'log_window' => 'latest laravel.log tail sample',
                'slow_query_count' => $slowQueryCount,
                'strict_mode_error_count' => $strictModeErrorCount,
                'failed_job_count' => (int) $failedJobCount,
            ],
        ];
    }

    protected function duplicateContacts(): array
    {
        return DB::table(DB::raw("
            (
                SELECT email as contact_value, 'email' as contact_type, COUNT(*) as duplicate_count
                FROM users
                WHERE deleted_at IS NULL AND email IS NOT NULL AND email <> ''
                GROUP BY email
                HAVING COUNT(*) > 1
                UNION ALL
                SELECT phone_number as contact_value, 'phone' as contact_type, COUNT(*) as duplicate_count
                FROM users
                WHERE deleted_at IS NULL AND phone_number IS NOT NULL AND phone_number <> ''
                GROUP BY phone_number
                HAVING COUNT(*) > 1
            ) duplicate_contacts
        "))
            ->orderByDesc('duplicate_count')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'contact_type' => $row->contact_type,
                'contact_value' => $row->contact_value,
                'duplicate_count' => (int) $row->duplicate_count,
            ])
            ->all();
    }

    protected function duplicateContactIdentifierCount(): int
    {
        $emailCount = DB::table('users')
            ->select('email')
            ->whereNull('deleted_at')
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->groupBy('email')
            ->havingRaw('COUNT(*) > 1')
            ->get()
            ->count();

        $phoneCount = DB::table('users')
            ->select('phone_number')
            ->whereNull('deleted_at')
            ->whereNotNull('phone_number')
            ->where('phone_number', '!=', '')
            ->groupBy('phone_number')
            ->havingRaw('COUNT(*) > 1')
            ->get()
            ->count();

        return $emailCount + $phoneCount;
    }

    protected function countLogOccurrences(string $needle, int $maxBytes = 1048576): int
    {
        $path = storage_path('logs/laravel.log');

        if (! is_file($path) || ! is_readable($path)) {
            return 0;
        }

        $handle = fopen($path, 'rb');

        if ($handle === false) {
            return 0;
        }

        $size = filesize($path);
        $bytesToRead = min($size ?: 0, $maxBytes);

        if ($bytesToRead > 0) {
            fseek($handle, -$bytesToRead, SEEK_END);
        }

        $content = stream_get_contents($handle) ?: '';
        fclose($handle);

        return substr_count($content, $needle);
    }
}
