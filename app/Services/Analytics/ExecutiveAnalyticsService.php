<?php

namespace App\Services\Analytics;

use App\Models\AcademicSession;
use App\Models\HostelAllocation;
use App\Models\HostelBed;
use App\Models\ProgramEnrollment;
use App\Models\Student;
use App\Models\StudentInvoice;
use App\Services\Analytics\Concerns\BuildsAnalyticsFilters;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ExecutiveAnalyticsService
{
    use BuildsAnalyticsFilters;

    public function summary(array $filters = []): array
    {
        $filters = $this->normalizeFilters($filters);
        $activeSession = AcademicSession::query()
            ->where('is_active', true)
            ->latest('start_date')
            ->latest('id')
            ->first();

        $includedInvoiceStatuses = ['issued', 'partial', 'paid'];

        $totalStudents = Student::query()->count();
        $activeStudents = Student::query()
            ->where('student_status', 'active')
            ->count();
        $newAdmissionsThisMonth = Student::query()
            ->whereBetween('admission_date', [
                Carbon::now()->startOfMonth()->toDateString(),
                Carbon::now()->endOfMonth()->toDateString(),
            ])
            ->count();

        $eligibleStudents = Student::query()
            ->where('student_status', 'active')
            ->whereExists(function ($query) {
                $query->selectRaw('1')
                    ->from('program_enrollments')
                    ->whereColumn('program_enrollments.student_id', 'students.id')
                    ->whereNull('program_enrollments.deleted_at');
            })
            ->count();

        $registeredStudentsInActiveSession = $activeSession
            ? DB::table('academic_session_enrollments')
                ->join('program_enrollments', 'program_enrollments.id', '=', 'academic_session_enrollments.program_enrollment_id')
                ->join('students', 'students.id', '=', 'program_enrollments.student_id')
                ->whereNull('academic_session_enrollments.deleted_at')
                ->whereNull('program_enrollments.deleted_at')
                ->whereNull('students.deleted_at')
                ->where('students.student_status', 'active')
                ->where('academic_session_enrollments.academic_session_id', $activeSession->id)
                ->distinct()
                ->count('students.id')
            : 0;

        $sessionRegistrationRate = $eligibleStudents > 0
            ? round(($registeredStudentsInActiveSession / $eligibleStudents) * 100, 2)
            : 0.0;

        $totalInvoiced = StudentInvoice::query()
            ->whereIn('status', $includedInvoiceStatuses)
            ->where('approval_status', '!=', 'rejected')
            ->sum('amount_due');

        $outstandingBalance = StudentInvoice::query()
            ->whereIn('status', $includedInvoiceStatuses)
            ->where('approval_status', '!=', 'rejected')
            ->where('balance_due', '>', 0)
            ->sum('balance_due');

        $overdueBalance = StudentInvoice::query()
            ->whereIn('status', $includedInvoiceStatuses)
            ->where('approval_status', '!=', 'rejected')
            ->where('balance_due', '>', 0)
            ->whereDate('due_date', '<', Carbon::today()->toDateString())
            ->sum('balance_due');

        $totalCollected = DB::table('payment_allocations')
            ->join('payments', 'payments.id', '=', 'payment_allocations.payment_id')
            ->where('payments.status', 'completed')
            ->sum('payment_allocations.amount');

        $activeBeds = HostelBed::query()
            ->where('is_active', true)
            ->count();

        $occupiedBeds = HostelAllocation::query()
            ->where('status', 'active')
            ->distinct()
            ->count('hostel_bed_id');

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
                    'label' => $activeSession->display_name,
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
}
