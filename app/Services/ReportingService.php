<?php

namespace App\Services;

use App\Models\AcademicSession;
use App\Models\FeeAssignment;
use App\Models\StudentInvoice;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportingService
{
    public function getOutstandingBalanceBySession(?int $academicSessionId = null): array
    {
        $query = StudentInvoice::query()->select(
            'academic_session_id',
            DB::raw('SUM(student_invoices.balance_due) as total_outstanding'),
            DB::raw('COUNT(*) as invoice_count')
        )
        ->whereIn('student_invoices.status', ['issued', 'partial', 'paid'])
        ->where('student_invoices.approval_status', '!=', 'rejected')
        ->where('student_invoices.balance_due', '>', 0)
        ->groupBy('academic_session_id');

        if ($academicSessionId) {
            $query->where('academic_session_id', $academicSessionId);
        }

        $results = $query->get();
        $sessions = AcademicSession::query()
            ->with('academicYear')
            ->whereIn('id', $results->pluck('academic_session_id')->filter()->all())
            ->get()
            ->keyBy('id');

        return $results->map(function ($result) use ($sessions) {
            $session = $result->academic_session_id
                ? $sessions->get($result->academic_session_id)
                : null;

            return [
                'session' => $session?->display_name ?? 'Unknown',
                'total_outstanding' => (float) $result->total_outstanding,
                'invoice_count' => (int) $result->invoice_count,
            ];
        })->values()->all();
    }

    public function getOverdueByDepartment(?int $departmentId = null): array
    {
        $query = StudentInvoice::query()->select(
            'departments.id as department_id',
            'departments.name as department_name',
            DB::raw('SUM(student_invoices.balance_due) as total_overdue'),
            DB::raw('COUNT(*) as overdue_count')
        )
        ->join('academic_session_enrollments', 'student_invoices.enrollment_id', '=', 'academic_session_enrollments.id')
        ->join('program_enrollments', 'academic_session_enrollments.program_enrollment_id', '=', 'program_enrollments.id')
        ->join('program_version_mappings', 'program_enrollments.program_version_mapping_id', '=', 'program_version_mappings.id')
        ->join('programs', 'program_version_mappings.program_id', '=', 'programs.id')
        ->join('departments', 'programs.department_id', '=', 'departments.id')
        ->whereIn('student_invoices.status', ['issued', 'partial', 'paid'])
        ->where('student_invoices.approval_status', '!=', 'rejected')
        ->where('student_invoices.balance_due', '>', 0)
        ->where('student_invoices.due_date', '<', now()->toDateString())
        ->groupBy('departments.id', 'departments.name');

        if ($departmentId) {
            $query->where('departments.id', $departmentId);
        }

        return $query->get()->map(fn ($row) => [
            'department_id' => (int) $row->department_id,
            'department_name' => $row->department_name,
            'total_overdue' => (float) $row->total_overdue,
            'overdue_count' => (int) $row->overdue_count,
        ])->all();
    }

    public function getCollectionPerformance(?string $startDate = null, ?string $endDate = null): array
    {
        $startDate = $startDate ?? Carbon::now()->subMonths(6)->toDateString();
        $endDate = $endDate ?? Carbon::now()->toDateString();

        $totalInvoiced = StudentInvoice::query()
            ->whereIn('status', ['issued', 'partial', 'paid'])
            ->where('approval_status', '!=', 'rejected')
            ->whereBetween('issue_date', [$startDate, $endDate])
            ->sum('amount_due');
        $totalCollected = DB::table('payment_allocations')
            ->join('payments', 'payments.id', '=', 'payment_allocations.payment_id')
            ->where('payments.status', 'completed')
            ->whereBetween('payments.payment_date', [$startDate, $endDate])
            ->sum('payment_allocations.amount');
        $outstanding = $totalInvoiced - $totalCollected;
        $collectionRate = $totalInvoiced > 0 ? ($totalCollected / $totalInvoiced) * 100 : 0;

        return [
            'total_invoiced' => $totalInvoiced,
            'total_collected' => $totalCollected,
            'outstanding' => $outstanding,
            'collection_rate' => round($collectionRate, 2),
            'period' => [$startDate, $endDate],
        ];
    }

    public function getFeePlanUsage(
        ?int $academicSessionId = null,
        ?int $yearOfStudy = null,
        ?int $sessionNumber = null
    ): array
    {
        $query = FeeAssignment::query()->select(
            'fee_plans.name as plan_name',
            'fee_assignments.year_of_study',
            'fee_assignments.session_number',
            DB::raw('COUNT(fee_assignments.id) as assignment_count'),
            DB::raw('COUNT(DISTINCT fee_assignments.program_version_mapping_id) as curriculum_count')
        )
        ->join('fee_plans', 'fee_assignments.fee_plan_id', '=', 'fee_plans.id')
        ->where('fee_assignments.approval_status', '!=', 'rejected')
        ->whereNull('fee_assignments.valid_to')
        ->groupBy(
            'fee_plans.id',
            'fee_plans.name',
            'fee_assignments.year_of_study',
            'fee_assignments.session_number'
        )
        ->orderBy('assignment_count', 'desc');

        if ($academicSessionId) {
            $academicYearId = AcademicSession::query()
                ->whereKey($academicSessionId)
                ->value('academic_year_id');

            if ($academicYearId) {
                $query->where('fee_assignments.academic_year_id', $academicYearId);
            }
        }

        if ($yearOfStudy) {
            $query->where('fee_assignments.year_of_study', $yearOfStudy);
        }

        if ($sessionNumber) {
            $query->where('fee_assignments.session_number', $sessionNumber);
        }

        return $query->get()->map(fn ($row) => [
            'plan_name' => $row->plan_name,
            'year_of_study' => $row->year_of_study ? (int) $row->year_of_study : null,
            'session_number' => $row->session_number ? (int) $row->session_number : null,
            'assignment_count' => (int) $row->assignment_count,
            'curriculum_count' => (int) $row->curriculum_count,
        ])->all();
    }
}

