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

    /**
     * Universal Dashboard Entry Point
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $user?->loadMissing('roles:id,name');
        $roles = $user->roles->pluck('name')->map(fn($role) => strtolower($role));

        // Logic for Student Dashboard
        if ($roles->contains('student')) {
            return $this->studentDashboard($request);
        }

        // Logic for Staff/Admin/Trainer Dashboard
        return $this->staffDashboard($request);
    }

    protected function studentDashboard(Request $request): Response
    {
        $user = $request->user();
        $student = $user?->student;

        $latestSessionEnrollment = $this->studentAcademicContextService
            ->latestSessionEnrollmentForStudent($student);

        $courseEnrollment = $this->studentAcademicContextService
            ->currentCourseEnrollmentForStudent($student);

        $curriculumMapping = $courseEnrollment?->curriculumMapping;

        $activeSession = AcademicSession::select(
            'id', 'academic_year_id', 'session_number', 'session_No', 'label', 'is_active'
        )
            ->where('is_active', true)
            ->first();

        $activeSessionNumber = $activeSession?->session_number ?? $activeSession?->session_No;
        $activeYearOfStudy = $activeSessionNumber ? (int) ceil($activeSessionNumber / 3) : null;

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

        $moduleUnits = ($courseEnrollment && $currentModule)
            ? Unit::query()
                ->where('curriculum_mapping_id', $courseEnrollment->curriculum_mapping_id)
                ->where('module_taught', $currentModule)
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
                    'admission_number' => $student->admission_number,
                    'status' => $student->enrollment_status,
                    'current_module' => $student->current_module,
                    'fee_discount_percentage' => $student->fee_discount_percentage,
                ] : null,
                'course' => [
                    'name' => $courseEnrollment?->course?->name ?? $curriculumMapping?->course?->name,
                    'version' => $courseEnrollment?->curriculum?->name ?? $curriculumMapping?->curriculum?->name,
                ],
                'module_units' => $moduleUnits->map(fn (Unit $unit) => [
                    'id' => $unit->id,
                    'code' => $unit->code,
                    'name' => $unit->name,
                    'credit_factor' => $unit->credit_factor,
                    'is_registered' => $registeredUnitIds->contains($unit->id),
                ])->values(),
                'all_units_count' => $allUnitsCount,
                'latest_session' => $latestSessionEnrollment ? [
                    'session' => $latestSessionEnrollment->academicSession?->display_name,
                    'year_of_study' => $latestSessionEnrollment->year_of_study,
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
                    'total_paid' => round((float) $invoices->sum('paid_amount'), 2),
                    'outstanding_balance' => round((float) $invoices->sum('balance_due'), 2),
                    'next_invoice_due_date' => optional($nextInvoice?->due_date)->toDateString(),
                ],
            ],
        ]);
    }

    protected function staffDashboard(Request $request): Response
    {
        $user = $request->user();
        $user?->loadMissing(['roles:id,name']);

        $staff = $user ? $this->staffSummaryForUser($user->id) : null;
        $roleNames = $user?->roles->pluck('name')->map(fn($role) => strtolower($role))->all() ?? [];
        $isTrainer = in_array('trainer', $roleNames, true);
        $primaryRole = $this->resolveDashboardRole($roleNames);
        $roleContext = $this->dashboardRoleContext($primaryRole, $roleNames);
        
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

        return Inertia::render('Dashboard', [
            'dashboard' => [
                'type' => $primaryRole,
                'staff_profile' => [
                    'name' => $user?->staff?->full_name,
                    'staff_number' => $staff?->staff_number,
                    'designation' => $staff?->designation,
                    'department_name' => $staff?->department_name,
                    'roles' => $roleNames,
                ],
                'role_context' => $roleContext,
                'trainer_workspace' => [
                    'active_session' => $activeSession,
                    'department_id' => $staff?->department_id ? (string) $staff->department_id : '',
                    'trainer_staff_id' => $staff?->id ? (string) $staff->id : '',
                    'timetable_sessions_count' => $currentTimetableCount,
                    'marks_recorded_count' => $recordedMarksCount,
                    'can_view_timetable' => $isTrainer && (bool) ($staff?->id && $staff?->department_id),
                    'can_grade_students' => $isTrainer && (bool) $staff?->id,
                ],
                'stats' => $this->institutionStats(),
                'analytics' => null,
            ],
        ]);
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
        $name = $yearLabel ? "{$yearLabel} - Session {$sessionNumber}" : "Session {$sessionNumber}";

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
            ['label' => 'Courses', 'value' => (int) ($stats->courses_count ?? 0)],
            ['label' => 'Curriculums', 'value' => (int) ($stats->curricula_count ?? 0)],
            ['label' => 'Departments', 'value' => (int) ($stats->departments_count ?? 0)],
            ['label' => 'Academic Years', 'value' => (int) ($stats->academic_years_count ?? 0)],
        ];
    }

    protected function resolveDashboardRole(array $roleNames): string
    {
        return match (true) {
            in_array('admin', $roleNames, true) => 'admin',
            in_array('bursar', $roleNames, true) => 'bursar',
            in_array('hod', $roleNames, true) => 'hod',
            in_array('trainer', $roleNames, true) => 'trainer',
            default => 'staff',
        };
    }

    protected function dashboardRoleContext(string $primaryRole, array $roleNames): array
    {
        return [
            'primary_role' => $primaryRole,
            'dashboard_title' => match ($primaryRole) {
                'bursar' => 'Finance Overview',
                'hod' => 'Department Overview',
                'trainer' => 'Teaching Overview',
                'staff' => 'Staff Overview',
                default => 'Institution Overview',
            },
            'dashboard_description' => match ($primaryRole) {
                'bursar' => 'Track collections, balances, and the finance analytics that matter to bursary operations.',
                'hod' => 'Monitor teaching delivery, academic progress, and department-level academic signals.',
                'trainer' => 'Focus on your timetable, marks workflow, and teaching activity in the current session.',
                'staff' => 'Access your workspace and the analytics available to your account.',
                default => 'Monitor institution-wide operations across academic, finance, admissions, hostel, and data quality workflows.',
            },
            'analytics_sections' => $this->analyticsSectionsForRoles($roleNames),
        ];
    }

    protected function analyticsSectionsForRoles(array $roleNames): array
    {
        if (in_array('admin', $roleNames, true)) {
            return ['executive', 'finance', 'academic', 'admissions', 'hostel', 'data_quality', 'snapshot_trends'];
        }

        $sections = [];

        if (in_array('bursar', $roleNames, true)) {
            $sections = array_merge($sections, ['executive', 'finance', 'snapshot_trends']);
        }

        if (in_array('hod', $roleNames, true)) {
            $sections = array_merge($sections, ['executive', 'academic', 'admissions', 'snapshot_trends']);
        }

        if (in_array('trainer', $roleNames, true)) {
            $sections = array_merge($sections, ['academic']);
        }

        return array_values(array_unique($sections));
    }
}
