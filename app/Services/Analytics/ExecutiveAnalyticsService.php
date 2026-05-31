<?php

namespace App\Services\Analytics;

use App\Models\AcademicSession;
use App\Models\ProgramEnrollment;
use App\Models\Student;
use App\Services\Analytics\Concerns\BuildsAnalyticsFilters;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ExecutiveAnalyticsService
{
    use BuildsAnalyticsFilters;

    public function summary(array $filters = []): array
    {
        $filters = $this->normalizeFilters($filters);

        return Cache::remember(
            $this->cacheKey($filters),
            now()->addMinutes(5),
            fn () => $this->buildSummary($filters)
        );
    }

    protected function buildSummary(array $filters): array
    {
        $activeSession = AcademicSession::query()
            ->leftJoin('academic_years', function ($join) {
                $join->on('academic_years.id', '=', 'academic_sessions.academic_year_id')
                    ->whereNull('academic_years.deleted_at');
            })
            ->where('is_active', true)
            ->whereNull('academic_sessions.deleted_at')
            ->latest('start_date')
            ->latest('id')
            ->first([
                'academic_sessions.id',
                'academic_sessions.session_number',
                'academic_sessions.session_No',
                'academic_years.label as academic_year_label',
                'academic_years.academic_year as academic_year_name',
            ]);

        $includedInvoiceStatuses = ['issued', 'partial', 'paid'];
        $monthStart = Carbon::now()->startOfMonth()->toDateString();
        $monthEnd = Carbon::now()->endOfMonth()->toDateString();
        $today = Carbon::today()->toDateString();
        $activeSessionId = $activeSession?->id;

        $summary = DB::selectOne(
            <<<'SQL'
                select
                    (select count(*)
                     from students
                     where deleted_at is null) as total_students,
                    (select count(*)
                     from students
                     where deleted_at is null
                       and student_status = 'active') as active_students,
                    (select count(*)
                     from students
                     where deleted_at is null
                       and admission_date between ? and ?) as new_admissions_this_month,
                    (select count(*)
                     from students
                     where deleted_at is null
                       and student_status = 'active'
                       and exists (
                           select 1
                           from program_enrollments
                           where program_enrollments.student_id = students.id
                             and program_enrollments.deleted_at is null
                       )) as eligible_students,
                    (select count(distinct students.id)
                     from academic_session_enrollments
                     inner join program_enrollments
                        on program_enrollments.id = academic_session_enrollments.program_enrollment_id
                     inner join students
                        on students.id = program_enrollments.student_id
                     where academic_session_enrollments.deleted_at is null
                       and program_enrollments.deleted_at is null
                       and students.deleted_at is null
                       and students.student_status = 'active'
                       and ? is not null
                       and academic_session_enrollments.academic_session_id = ?) as registered_students_in_active_session,
                    (select coalesce(sum(amount_due), 0)
                     from student_invoices
                     where status in (?, ?, ?)
                       and approval_status != 'rejected') as total_invoiced,
                    (select coalesce(sum(balance_due), 0)
                     from student_invoices
                     where status in (?, ?, ?)
                       and approval_status != 'rejected'
                       and balance_due > 0) as outstanding_balance,
                    (select coalesce(sum(balance_due), 0)
                     from student_invoices
                     where status in (?, ?, ?)
                       and approval_status != 'rejected'
                       and balance_due > 0
                       and due_date < ?) as overdue_balance,
                    (select coalesce(sum(payment_allocations.amount), 0)
                     from payment_allocations
                     inner join payments on payments.id = payment_allocations.payment_id
                     where payments.status = 'completed') as total_collected,
                    (select count(*)
                     from hostel_beds
                     where is_active = true
                       and deleted_at is null) as active_beds,
                    (select count(distinct hostel_bed_id)
                     from hostel_allocations
                     where status = 'active'
                       and deleted_at is null) as occupied_beds
            SQL,
            [
                $monthStart,
                $monthEnd,
                $activeSessionId,
                $activeSessionId,
                ...$includedInvoiceStatuses,
                ...$includedInvoiceStatuses,
                ...$includedInvoiceStatuses,
                $today,
            ]
        );

        $totalStudents = (int) ($summary->total_students ?? 0);
        $activeStudents = (int) ($summary->active_students ?? 0);
        $newAdmissionsThisMonth = (int) ($summary->new_admissions_this_month ?? 0);
        $eligibleStudents = (int) ($summary->eligible_students ?? 0);
        $registeredStudentsInActiveSession = (int) ($summary->registered_students_in_active_session ?? 0);
        $totalInvoiced = (float) ($summary->total_invoiced ?? 0);
        $outstandingBalance = (float) ($summary->outstanding_balance ?? 0);
        $overdueBalance = (float) ($summary->overdue_balance ?? 0);
        $totalCollected = (float) ($summary->total_collected ?? 0);
        $activeBeds = (int) ($summary->active_beds ?? 0);
        $occupiedBeds = (int) ($summary->occupied_beds ?? 0);

        $sessionRegistrationRate = $eligibleStudents > 0
            ? round(($registeredStudentsInActiveSession / $eligibleStudents) * 100, 2)
            : 0.0;

        $hostelOccupancyRate = $activeBeds > 0
            ? round(($occupiedBeds / $activeBeds) * 100, 2)
            : 0.0;

        $topPrograms = ProgramEnrollment::query()
            ->join('program_version_mappings', 'program_version_mappings.id', '=', 'program_enrollments.program_version_mapping_id')
            ->join('programs', 'programs.id', '=', 'program_version_mappings.program_id')
            ->whereNull('program_enrollments.deleted_at')
            ->whereNull('program_version_mappings.deleted_at')
            ->whereNull('programs.deleted_at')
            ->select('programs.id', 'programs.name')
            ->selectRaw('COUNT(DISTINCT program_enrollments.student_id) as student_count')
            ->groupBy('programs.id', 'programs.name')
            ->orderByDesc('student_count')
            ->limit(5)
            ->get()
            ->map(fn ($program) => [
                'id' => $program->id,
                'name' => $program->name,
                'student_count' => (int) $program->student_count,
            ])
            ->all();

        $studentStatusBreakdown = Student::query()
            ->select('student_status')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('student_status')
            ->orderBy('student_status')
            ->get()
            ->map(fn ($row) => [
                'status' => $row->student_status,
                'total' => (int) $row->total,
            ])
            ->all();

        return [
            'filters' => $filters,
            'active_session' => $activeSession
                ? [
                    'id' => $activeSession->id,
                    'label' => $this->activeSessionLabel($activeSession),
                ]
                : null,
            'metrics' => [
                'total_students' => (int) $totalStudents,
                'active_students' => (int) $activeStudents,
                'new_admissions_this_month' => (int) $newAdmissionsThisMonth,
                'students_registered_in_active_session' => (int) $registeredStudentsInActiveSession,
                'eligible_students_for_active_session' => (int) $eligibleStudents,
                'session_registration_rate' => $sessionRegistrationRate,
                'total_invoiced' => round((float) $totalInvoiced, 2),
                'total_collected' => round((float) $totalCollected, 2),
                'outstanding_balance' => round((float) $outstandingBalance, 2),
                'overdue_balance' => round((float) $overdueBalance, 2),
                'hostel_occupancy_rate' => $hostelOccupancyRate,
                'occupied_beds' => (int) $occupiedBeds,
                'active_beds' => (int) $activeBeds,
            ],
            'breakdowns' => [
                'top_programs' => $topPrograms,
                'student_statuses' => $studentStatusBreakdown,
            ],
            'policy' => [
                'included_invoice_statuses' => $includedInvoiceStatuses,
                'excluded_approval_statuses' => ['rejected'],
            ],
        ];
    }

    protected function cacheKey(array $filters): string
    {
        return 'analytics.executive-summary.'.md5(json_encode([
            'filters' => $filters,
            'date' => Carbon::today()->toDateString(),
        ]));
    }

    protected function activeSessionLabel(object $activeSession): string
    {
        $sessionNumber = $activeSession->session_number ?? $activeSession->session_No;
        $yearLabel = $activeSession->academic_year_label ?: $activeSession->academic_year_name;

        return $yearLabel
            ? "{$yearLabel} - Session {$sessionNumber}"
            : "Session {$sessionNumber}";
    }
}
