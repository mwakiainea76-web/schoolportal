<?php

namespace App\Services;

use App\Models\AcademicSession;
use App\Models\Department;
use App\Models\FeeAssignment;
use App\Models\FeePlan;
use App\Models\StudentInvoice;
use Illuminate\Support\Facades\DB;

class ReportingService
{
    public function getOutstandingBalanceBySession(?int $academicSessionId = null): array
    {
        $query = StudentInvoice::select(
            'academic_session_enrollments.academic_session_id',
            DB::raw('SUM(student_invoices.balance_due) as total_outstanding'),
            DB::raw('COUNT(*) as invoice_count')
        )
        ->join('academic_session_enrollments', 'student_invoices.enrollment_id', '=', 'academic_session_enrollments.id')
        ->where('student_invoices.balance_due', '>', 0)
        ->groupBy('academic_session_enrollments.academic_session_id');

        if ($academicSessionId) {
            $query->where('academic_session_enrollments.academic_session_id', $academicSessionId);
        }

        $results = $query->with('academicSession:id,name')->get();

        return $results->map(function ($result) {
            return [
                'session' => $result->academicSession->name ?? 'Unknown',
                'total_outstanding' => $result->total_outstanding,
                'invoice_count' => $result->invoice_count,
            ];
        })->toArray();
    }

    public function getOverdueByDepartment(?int $departmentId = null): array
    {
        $query = StudentInvoice::select(
            'departments.id as department_id',
            'departments.name as department_name',
            DB::raw('SUM(student_invoices.balance_due) as total_overdue'),
            DB::raw('COUNT(*) as overdue_count')
        )
        ->join('academic_session_enrollments', 'student_invoices.enrollment_id', '=', 'academic_session_enrollments.id')
        ->join('course_enrollments', 'academic_session_enrollments.course_enrollment_id', '=', 'course_enrollments.id')
        ->join('course_curriculum', 'course_enrollments.course_curriculum_id', '=', 'course_curriculum.id')
        ->join('courses', 'course_curriculum.course_id', '=', 'courses.id')
        ->join('departments', 'courses.department_id', '=', 'departments.id')
        ->where('student_invoices.balance_due', '>', 0)
        ->where('student_invoices.due_date', '<', now()->toDateString())
        ->groupBy('departments.id', 'departments.name');

        if ($departmentId) {
            $query->where('departments.id', $departmentId);
        }

        return $query->get()->toArray();
    }

    public function getCollectionPerformance(?string $startDate = null, ?string $endDate = null): array
    {
        $startDate = $startDate ?? now()->subMonths(6)->toDateString();
        $endDate = $endDate ?? now()->toDateString();

        $totalInvoiced = StudentInvoice::whereBetween('issue_date', [$startDate, $endDate])->sum('amount_due');
        $totalCollected = StudentInvoice::whereBetween('issue_date', [$startDate, $endDate])->sum('paid_amount');
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
        $query = FeeAssignment::select(
            'fee_plans.name as plan_name',
            'fee_assignments.year_of_study',
            'fee_assignments.session_number',
            DB::raw('COUNT(fee_assignments.id) as assignment_count'),
            DB::raw('COUNT(DISTINCT fee_assignments.course_curriculum_id) as curriculum_count')
        )
        ->join('fee_plans', 'fee_assignments.fee_plan_id', '=', 'fee_plans.id')
        ->whereNull('fee_assignments.valid_to')
        ->groupBy(
            'fee_plans.id',
            'fee_plans.name',
            'fee_assignments.year_of_study',
            'fee_assignments.session_number'
        )
        ->orderBy('assignment_count', 'desc');

        if ($academicSessionId) {
            $query->where('fee_assignments.academic_session_id', $academicSessionId);
        }

        if ($yearOfStudy) {
            $query->where('fee_assignments.year_of_study', $yearOfStudy);
        }

        if ($sessionNumber) {
            $query->where('fee_assignments.session_number', $sessionNumber);
        }

        return $query->get()->toArray();
    }
}

