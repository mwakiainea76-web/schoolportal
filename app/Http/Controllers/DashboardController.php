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
use App\Services\FeeAssignmentService;
use App\Services\StudentAcademicContextService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected FeeAssignmentService $feeAssignmentService,
        protected StudentAcademicContextService $studentAcademicContextService
    ) {}

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

        $latestSessionEnrollment = $this->studentAcademicContextService
            ->latestSessionEnrollmentForStudent($student);

        $programEnrollment = $this->studentAcademicContextService
            ->currentProgramEnrollmentForStudent($student);

        $programVersionMapping = $programEnrollment?->programVersionMapping;

        // ── Active session: select only columns actually used ────────────────
        $activeSession = AcademicSession::select(
            'id', 'academic_year_id', 'session_number', 'session_No', 'label', 'is_active'
        )
            ->where('is_active', true)
            ->first();

        $activeSessionNumber = $activeSession?->session_number ?? $activeSession?->session_No;
        $activeYearOfStudy = $activeSessionNumber ? (int) ceil($activeSessionNumber / 3) : null;

        // ── Fee assignment & current enrollment (unchanged logic) ────────────
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
                ->with('academicSession:id,academic_year_id,session_number,label')
                ->where('academic_session_id', $activeSession->id)
                ->latest('id')
                ->first()
            : $latestSessionEnrollment;

        $currentModule = $currentEnrollment?->module
            ?? $activeSessionNumber
            ?? $latestSessionEnrollment?->module
            ?? $student?->current_module;

        // ── Module units ─────────────────────────────────────────────────────
        $moduleUnits = ($programEnrollment && $currentModule)
            ? ProgramVersionUnit::query()
                ->with('unit:id,code,name,credit_factor') // training_hours not used
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

        // ── Finance: no relation needed, columns are on the invoice itself ───
        $invoices = $student
            ? StudentInvoice::query()
                ->select('id', 'student_id', 'status', 'amount_due', 'paid_amount', 'balance_due', 'due_date')
                ->where('student_id', $student->id)
                ->latest()
                ->limit(5)
                ->get()
            : collect();

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
                    // admission_date removed — not read by frontend
                ] : null,
                'program' => [
                    'name' => $programVersionMapping?->program?->name,
                    'version' => $programVersionMapping?->programVersion?->name,
                ],
                'module_units' => $moduleUnits->map(fn (ProgramVersionUnit $pvu) => [
                    'id' => $pvu->id,
                    'code' => $pvu->unit?->code,
                    'name' => $pvu->unit?->name,
                    'credit_factor' => $pvu->unit?->credit_factor,
                    // training_hours removed — not read by frontend
                    'is_registered' => $registeredUnitIds->contains($pvu->id),
                ])->values(),
                'all_units_count' => $allUnitsCount,
                'latest_session' => $latestSessionEnrollment ? [
                    'session' => $latestSessionEnrollment->academicSession?->display_name,
                    'year_of_study' => $latestSessionEnrollment->year_of_study,
                    // module, status removed — not read by frontend
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
                    // total_due removed — not read by frontend
                    'total_paid' => round((float) $invoices->sum('paid_amount'), 2),
                    'outstanding_balance' => round((float) $invoices->sum('balance_due'), 2),
                    'next_invoice_due_date' => optional($nextInvoice?->due_date)->toDateString(),
                    // next_invoice_status removed — not read by frontend
                ],
            ],
        ]);
    }

    public function staffDashboard(): Response
    {
        return Inertia::render('Dashboard', [
            'dashboard' => [
                'type' => 'staff',
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
                'analytics' => null,
            ],
        ]);
    }
}
