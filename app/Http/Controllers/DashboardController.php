<?php

namespace App\Http\Controllers;

use App\Models\AcademicSession;
use App\Models\AcademicYear;
use App\Models\Department;
use App\Models\Program;
use App\Models\ProgramVersion;
use App\Models\ProgramVersionUnit;
use App\Models\StudentInvoice;
use App\Models\StudentUnitRegistration;
use App\Services\Analytics\AcademicAnalyticsService;
use App\Services\Analytics\AdmissionsAnalyticsService;
use App\Services\Analytics\AnalyticsSnapshotReadService;
use App\Services\Analytics\DataQualityAnalyticsService;
use App\Services\Analytics\ExecutiveAnalyticsService;
use App\Services\Analytics\FinanceAnalyticsService;
use App\Services\Analytics\HostelAnalyticsService;
use App\Services\FeeAssignmentService;
use App\Services\StudentAcademicContextService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected FeeAssignmentService $feeAssignmentService,
        protected StudentAcademicContextService $studentAcademicContextService
    )
    {
    }

    public function redirect(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user?->hasRole('student')) {
            return redirect()->route('student.dashboard');
        }

        return redirect()->route('staff.dashboard');
    }

    public function studentDashboard(Request $request): Response
    {
        $user = $request->user();
        $student = $user?->student;

        $latestSessionEnrollment = $this->studentAcademicContextService->latestSessionEnrollmentForStudent($student);
        $programEnrollment = $this->studentAcademicContextService->currentProgramEnrollmentForStudent($student);

        $programVersionMapping = $programEnrollment?->programVersionMapping;
        $activeSession = AcademicSession::with('academicYear')
            ->where('is_active', true)
            ->first();
        $activeSessionNumber = $activeSession?->session_number ?? $activeSession?->session_No;
        $activeYearOfStudy = $activeSessionNumber ? (int) ceil($activeSessionNumber / 3) : null;
        $activeFeeAssignment = ($activeSession && $programEnrollment)
            ? $this->feeAssignmentService->resolveActiveAssignment(
                $activeSession->academic_year_id,
                $programEnrollment->program_version_mapping_id,
                $activeYearOfStudy,
                $activeSessionNumber
            )
            : null;
        $currentEnrollment = ($activeSession && $programEnrollment)
            ? $programEnrollment->academicSessionEnrollments()
                ->with('academicSession.academicYear')
                ->where('academic_session_id', $activeSession->id)
                ->latest('id')
                ->first()
            : $latestSessionEnrollment;
        $currentModule = $currentEnrollment?->module
            ?? $activeSessionNumber
            ?? $latestSessionEnrollment?->module
            ?? $student?->current_module;
        $moduleUnits = $programEnrollment && $currentModule
            ? ProgramVersionUnit::query()
                ->with('unit:id,code,name,credit_factor,training_hours')
                ->where('program_version_mapping_id', $programEnrollment->program_version_mapping_id)
                ->where('module_taught', $currentModule)
                ->orderBy('id')
                ->get()
            : collect();
        $registeredUnitIds = $currentEnrollment
            ? StudentUnitRegistration::query()
                ->where('academic_session_enrollment_id', $currentEnrollment->id)
                ->pluck('program_version_unit_id')
            : collect();
        $allUnitsCount = $programEnrollment
            ? ProgramVersionUnit::query()
                ->where('program_version_mapping_id', $programEnrollment->program_version_mapping_id)
                ->count()
            : 0;

        $invoices = $student
            ? StudentInvoice::query()
                ->with(['academicSession.academicYear'])
                ->where('student_id', $student->id)
                ->latest()
                ->limit(5)
                ->get()
            : collect();

        $totalDue = (float) $invoices->sum('amount_due');
        $totalPaid = (float) $invoices->sum('paid_amount');
        $outstandingBalance = (float) $invoices->sum('balance_due');
        $nextInvoice = $invoices
            ->whereIn('status', ['issued', 'partial', 'draft'])
            ->sortBy('due_date')
            ->first();

        return Inertia::render('Dashboard', [
            'dashboard' => [
                'type' => 'student',
                'student' => $student ? [
                    'registration_number' => $student->registration_number,
                    'status' => $student->student_status,
                    'current_module' => $student->current_module,
                    'fee_discount_percentage' => $student->fee_discount_percentage,
                    'admission_date' => optional($student->admission_date)->toDateString(),
                ] : null,
                'program' => [
                    'name' => $programVersionMapping?->program?->name,
                    'version' => $programVersionMapping?->programVersion?->name,
                ],
                'module_units' => $moduleUnits->map(fn (ProgramVersionUnit $programVersionUnit) => [
                    'id' => $programVersionUnit->id,
                    'code' => $programVersionUnit->unit?->code,
                    'name' => $programVersionUnit->unit?->name,
                    'credit_factor' => $programVersionUnit->unit?->credit_factor,
                    'training_hours' => $programVersionUnit->unit?->training_hours,
                    'is_registered' => $registeredUnitIds->contains($programVersionUnit->id),
                ])->values(),
                'all_units_count' => $allUnitsCount,
                'latest_session' => $latestSessionEnrollment ? [
                    'session' => $latestSessionEnrollment->academicSession?->display_name,
                    'year_of_study' => $latestSessionEnrollment->year_of_study,
                    'module' => $latestSessionEnrollment->module,
                    'status' => $latestSessionEnrollment->status,
                ] : null,
                'active_session' => $activeSession?->display_name,
                'session_registration' => [
                    'can_register' => (bool) ($activeSession && $programEnrollment && $activeFeeAssignment),
                    'blocker' => ! $programEnrollment
                        ? 'You are not yet enrolled in a program version.'
                        : (! $activeSession
                            ? 'No active academic session is currently available.'
                            : (! $activeFeeAssignment
                                ? 'No fee plan has been assigned to your program version for the current session yet.'
                                : null)),
                ],
                'unit_registration' => [
                    'can_register' => (bool) ($currentEnrollment && $moduleUnits->isNotEmpty() && $registeredUnitIds->count() !== $moduleUnits->count()),
                    'blocker' => ! $currentEnrollment
                        ? 'Register the current session first before selecting your units.'
                        : ($moduleUnits->isEmpty()
                            ? 'No units have been assigned to your current module yet.'
                            : null),
                    'registered_count' => $registeredUnitIds->count(),
                    'total_count' => $moduleUnits->count(),
                    'is_complete' => $moduleUnits->isNotEmpty() && $registeredUnitIds->count() === $moduleUnits->count(),
                ],
                'finance' => [
                    'total_due' => round($totalDue, 2),
                    'total_paid' => round($totalPaid, 2),
                    'outstanding_balance' => round($outstandingBalance, 2),
                    'next_invoice_due_date' => optional($nextInvoice?->due_date)->toDateString(),
                    'next_invoice_status' => $nextInvoice?->status,
                ],
                'recent_invoices' => $invoices->map(fn (StudentInvoice $invoice) => [
                    'id' => $invoice->id,
                    'invoice_number' => $invoice->invoice_number,
                    'status' => $invoice->status,
                    'amount_due' => (float) $invoice->amount_due,
                    'paid_amount' => (float) $invoice->paid_amount,
                    'balance_due' => (float) $invoice->balance_due,
                    'due_date' => optional($invoice->due_date)->toDateString(),
                    'session' => $invoice->academicSession?->display_name,
                ])->values(),
            ],
        ]);
    }

    public function staffDashboard(
        ExecutiveAnalyticsService $executiveAnalyticsService,
        FinanceAnalyticsService $financeAnalyticsService,
        AcademicAnalyticsService $academicAnalyticsService,
        AdmissionsAnalyticsService $admissionsAnalyticsService,
        HostelAnalyticsService $hostelAnalyticsService,
        DataQualityAnalyticsService $dataQualityAnalyticsService,
        AnalyticsSnapshotReadService $analyticsSnapshotReadService,
    ): Response
    {
        $dashboardData = Cache::remember('dashboard.staff.analytics.v1', now()->addMinutes(1), function () use (
            $executiveAnalyticsService,
            $financeAnalyticsService,
            $academicAnalyticsService,
            $admissionsAnalyticsService,
            $hostelAnalyticsService,
            $dataQualityAnalyticsService,
            $analyticsSnapshotReadService
        ) {
            return [
                'stats' => [
                    [
                        'label' => 'Programs',
                        'value' => Program::query()->count(),
                    ],
                    [
                        'label' => 'Program Versions',
                        'value' => ProgramVersion::query()->count(),
                    ],
                    [
                        'label' => 'Departments',
                        'value' => Department::query()->count(),
                    ],
                    [
                        'label' => 'Academic Years',
                        'value' => AcademicYear::query()->count(),
                    ],
                ],
                'analytics' => [
                    'executive' => $executiveAnalyticsService->summary(),
                    'finance' => $financeAnalyticsService->summary(),
                    'academic' => $academicAnalyticsService->summary(),
                    'admissions' => $admissionsAnalyticsService->summary(),
                    'hostel' => $hostelAnalyticsService->summary(),
                    'data_quality' => $dataQualityAnalyticsService->summary(),
                    'snapshot_trends' => $analyticsSnapshotReadService->trendSummary(14),
                ],
            ];
        });

        return Inertia::render('Dashboard', [
            'dashboard' => [
                'type' => 'staff',
                'stats' => $dashboardData['stats'],
                'analytics' => $dashboardData['analytics'],
            ],
        ]);
    }
}
