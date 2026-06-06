<?php

namespace App\Http\Controllers;

use App\Models\AcademicSession;
use App\Models\AcademicTimetable;
use App\Models\Staff;
use App\Models\StudentInvoice;
use App\Models\StudentMark;
use App\Models\StudentUnitRegistration;
use App\Models\Unit;
use App\Models\User;
use App\Services\FeeAssignmentService;
use App\Services\StudentAcademicContextService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        return redirect()->route($this->dashboardRouteFor($request->user()));
    }

    public function studentDashboard(Request $request): Response
    {
        $user = $request->user();
        $student = $user?->student;

        $latestSessionEnrollment = $this->studentAcademicContextService
            ->latestSessionEnrollmentForStudent($student);

        $courseEnrollment = $this->studentAcademicContextService
            ->currentCourseEnrollmentForStudent($student);

        $curriculumMapping = $courseEnrollment?->curriculumMapping;
        $curriculumId = $courseEnrollment?->curriculum_id
            ?? $curriculumMapping?->curriculum_id;

        // ── Active session: select only columns actually used ────────────────
        $activeSession = AcademicSession::select(
            'id', 'academic_year_id', 'session_number', 'session_No', 'label', 'is_active'
        )
            ->where('is_active', true)
            ->first();

        $activeSessionNumber = $activeSession?->session_number ?? $activeSession?->session_No;
        $activeYearOfStudy = $activeSessionNumber ? (int) ceil($activeSessionNumber / 3) : null;

        // ── Fee assignment & current enrollment (unchanged logic) ────────────
        $activeFeeAssignment = ($activeSession && $courseEnrollment)
            ? $this->feeAssignmentService->resolveActiveAssignment(
                $activeSession->academic_year_id,
                $courseEnrollment->curriculum_mapping_id,
                $activeYearOfStudy,
                $activeSessionNumber
            )
            : null;

        $currentEnrollment = ($activeSession && $courseEnrollment)
            ? $courseEnrollment->academicSessionEnrollments()
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
        $moduleUnits = ($courseEnrollment && $currentModule)
            ? Unit::query()
                ->where('curriculum_mapping_id', $courseEnrollment->curriculum_mapping_id)
                ->where(function ($query) use ($currentModule) {
                    $query->where('module_taught', $currentModule);
                })
                ->orderBy('id')
                ->get()
            : collect();

        $registeredUnitIds = $currentEnrollment
            ? StudentUnitRegistration::query()
                ->where('academic_session_enrollment_id', $currentEnrollment->id)
                ->pluck('curriculum_unit_id')
            : collect();

        $allUnitsCount = $courseEnrollment
            ? Unit::query()
                ->where('curriculum_mapping_id', $courseEnrollment->curriculum_mapping_id)
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

        return Inertia::render('Dashboard/StudentDashboard', [
            'dashboard' => [
                'type' => 'student',
                'student' => $student ? [
                    'registration_number' => $student->registration_number,
                    'status' => $student->student_status,
                    'current_module' => $student->current_module,
                    'fee_discount_percentage' => $student->fee_discount_percentage,
                    // admission_date removed — not read by frontend
                ] : null,
                'course' => [
                    'name' => $courseEnrollment?->course?->name
                        ?? $curriculumMapping?->course?->name,
                    'version' => $courseEnrollment?->curriculum?->name
                        ?? $curriculumMapping?->curriculum?->name,
                ],
                'module_units' => $moduleUnits->map(fn (Unit $unit) => [
                    'id' => $unit->id,
                    'code' => $unit->code,
                    'name' => $unit->name,
                    'credit_factor' => $unit->credit_factor,
                    // training_hours removed — not read by frontend
                    'is_registered' => $registeredUnitIds->contains($unit->id),
                ])->values(),
                'all_units_count' => $allUnitsCount,
                'latest_session' => $latestSessionEnrollment ? [
                    'session' => $latestSessionEnrollment->academicSession?->display_name,
                    'year_of_study' => $latestSessionEnrollment->year_of_study,
                    // module, status removed — not read by frontend
                ] : null,
                'active_session' => $activeSession?->display_name,
                'session_registration' => [
                    'can_register' => (bool) ($activeSession && $courseEnrollment && $activeFeeAssignment),
                    'blocker' => ! $courseEnrollment
                        ? 'You are not yet enrolled in a curriculum.'
                        : (! $activeSession
                            ? 'No active academic session is currently available.'
                            : (! $activeFeeAssignment
                                ? 'No fee plan has been assigned to your curriculum for the current session yet.'
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

    public function staffDashboard(Request $request): Response
    {
        return Inertia::render('Dashboard/AdminDashboard', [
            'dashboard' => $this->staffDashboardPayload($request),
        ]);
    }

    public function trainerDashboard(Request $request): Response
    {
        return Inertia::render('Dashboard/TrainerDashboard', [
            'dashboard' => $this->staffDashboardPayload($request),
        ]);
    }

    protected function staffDashboardPayload(Request $request): array
    {
        $user = $request->user();
        $user?->loadMissing([
            'roles:id,name',
        ]);

        $staff = $user ? $this->staffSummaryForUser($user->id) : null;
        $roleNames = $user?->roles
            ?->pluck('name')
            ->filter()
            ->values()
            ->all() ?? [];
        $isTrainer = in_array('trainer', $roleNames, true);
        $shouldLoadInstitutionStats = in_array($request->route()?->getName(), [
            'admin.dashboard',
            'staff.dashboard',
        ], true);
        $activeSession = $this->activeSessionSummary();

        $currentTimetableCount = $isTrainer && $staff
            ? AcademicTimetable::query()
                ->when($activeSession, fn ($query) => $query->where('academic_session_id', $activeSession['id']))
                ->where('trainer_staff_id', $staff->id)
                ->count()
            : 0;

        $recordedMarksCount = $isTrainer && $staff && $activeSession
            ? StudentMark::query()
                ->where('recorded_by_staff_id', $staff->id)
                ->where('academic_session_id', $activeSession['id'])
                ->count()
            : 0;

        return [
            'type' => 'staff',
            'staff_profile' => [
                'name' => trim(($user?->first_name ?? '').' '.($user?->last_name ?? '')),
                'staff_number' => $staff?->staff_number,
                'designation' => $staff?->designation,
                'department_name' => $staff?->department_name,
                'roles' => $roleNames,
            ],
            'trainer_workspace' => [
                'active_session' => $activeSession,
                'department_id' => $staff?->department_id ? (string) $staff->department_id : '',
                'trainer_staff_id' => $staff?->id ? (string) $staff->id : '',
                'timetable_sessions_count' => $currentTimetableCount,
                'marks_recorded_count' => $recordedMarksCount,
                'can_view_timetable' => $isTrainer && (bool) ($staff?->id && $staff?->department_id),
                'can_grade_students' => $isTrainer && (bool) $staff?->id,
            ],
            'stats' => $shouldLoadInstitutionStats ? $this->institutionStats() : [],
            'analytics' => null,
        ];
    }

    protected function activeSessionSummary(): ?array
    {
        $session = AcademicSession::query()
            ->leftJoin('academic_years', function ($join) {
                $join->on('academic_years.id', '=', 'academic_sessions.academic_year_id')
                    ->whereNull('academic_years.deleted_at');
            })
            ->where('academic_sessions.is_active', true)
            ->whereNull('academic_sessions.deleted_at')
            ->orderByDesc('academic_sessions.id')
            ->first([
                'academic_sessions.id',
                'academic_sessions.session_number',
                'academic_sessions.session_No',
                'academic_years.label as academic_year_label',
                'academic_years.academic_year as academic_year_name',
            ]);

        if (! $session) {
            return null;
        }

        $sessionNumber = $session->session_number ?? $session->session_No;
        $yearLabel = $session->academic_year_label ?: $session->academic_year_name;
        $name = $yearLabel
            ? "{$yearLabel} - Session {$sessionNumber}"
            : "Session {$sessionNumber}";

        return [
            'id' => (string) $session->id,
            'name' => $name,
        ];
    }

    protected function staffSummaryForUser(int $userId): ?object
    {
        return Staff::query()
            ->leftJoin('departments', function ($join) {
                $join->on('departments.id', '=', 'staffs.department_id')
                    ->whereNull('departments.deleted_at');
            })
            ->where('staffs.user_id', $userId)
            ->whereNull('staffs.deleted_at')
            ->first([
                'staffs.id',
                'staffs.department_id',
                'staffs.staff_number',
                'staffs.designation',
                'departments.name as department_name',
            ]);
    }

    protected function institutionStats(): array
    {
        $stats = DB::selectOne(<<<'SQL'
            select
                (select count(*) from courses where deleted_at is null) as courses_count,
                (select count(*) from curricula where deleted_at is null) as curricula_count,
                (select count(*) from departments where deleted_at is null) as departments_count,
                (select count(*) from academic_years where deleted_at is null) as academic_years_count
        SQL);

        return [
            [
                'label' => 'Courses',
                'value' => (int) ($stats->courses_count ?? 0),
            ],
            [
                'label' => 'Curriculums',
                'value' => (int) ($stats->curricula_count ?? 0),
            ],
            [
                'label' => 'Departments',
                'value' => (int) ($stats->departments_count ?? 0),
            ],
            [
                'label' => 'Academic Years',
                'value' => (int) ($stats->academic_years_count ?? 0),
            ],
        ];
    }

    private function dashboardRouteFor(?User $user): string
    {
        if (! $user) {
            return 'admin.dashboard';
        }

        $user->loadMissing('roles:id,name');
        $roles = $user->roles->pluck('name');

        if ($roles->contains('student')) {
            return 'student.dashboard';
        }

        if ($roles->contains('trainer') && ! $roles->contains('admin') && ! $roles->contains('hod')) {
            return 'trainer.dashboard';
        }

        return 'admin.dashboard';
    }
}
