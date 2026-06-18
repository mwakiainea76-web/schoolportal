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
        $roles = $user->roles->pluck('name')->map(fn ($role) => strtolower($role));

        if ($roles->contains('student')) {
            return $this->studentDashboard($request);
        }

        if ($roles->contains('admin')) {
            return $this->adminDashboard($request, $roles->all());
        }

        if ($roles->contains('bursar')) {
            return $this->bursarDashboard($request, $roles->all());
        }

        if ($roles->contains('hod')) {
            return $this->hodDashboard($request, $roles->all());
        }

        return $this->trainerDashboard($request, $roles->all());
    }

    protected function adminDashboard(Request $request, array $roleNames): Response
    {
        $user = $request->user();
        $staff = $user ? $this->staffSummaryForUser($user->id) : null;

        return Inertia::render('Dashboard', [
            'dashboard' => [
                'type' => 'admin',
                'staff_profile' => $this->staffProfilePayload($user, $staff, $roleNames),
                'trainer_workspace' => $this->trainerWorkspacePayload($staff, false),
                'stats' => $this->institutionStats(),
            ],
        ]);
    }

    protected function bursarDashboard(Request $request, array $roleNames): Response
    {
        $user = $request->user();
        $staff = $user ? $this->staffSummaryForUser($user->id) : null;

        return Inertia::render('Dashboard', [
            'dashboard' => [
                'type' => 'bursar',
                'staff_profile' => $this->staffProfilePayload($user, $staff, $roleNames),
                'stats' => $this->institutionStats(),
            ],
        ]);
    }

    protected function hodDashboard(Request $request, array $roleNames): Response
    {
        $user = $request->user();
        $staff = $user ? $this->staffSummaryForUser($user->id) : null;

        return Inertia::render('Dashboard', [
            'dashboard' => [
                'type' => 'hod',
                'staff_profile' => $this->staffProfilePayload($user, $staff, $roleNames),
                'trainer_workspace' => $this->trainerWorkspacePayload($staff, true),
                'department_context' => $this->departmentContextPayload($staff),
                'stats' => $staff?->department_id
                    ? $this->departmentStats($staff->department_id)
                    : $this->institutionStats(),
            ],
        ]);
    }

    protected function trainerDashboard(Request $request, array $roleNames): Response
    {
        $user = $request->user();
        $staff = $user ? $this->staffSummaryForUser($user->id) : null;

        return Inertia::render('Dashboard', [
            'dashboard' => [
                'type' => 'trainer',
                'staff_profile' => $this->staffProfilePayload($user, $staff, $roleNames),
                'trainer_workspace' => $this->trainerWorkspacePayload($staff, true),
            ],
        ]);
    }

    protected function staffProfilePayload(?User $user, ?object $staff, array $roleNames): array
    {
        $staffName = $staff
            ? trim("{$staff->first_name} {$staff->last_name}".($staff->other_name ? " {$staff->other_name}" : ''))
            : null;

        return [
            'name' => $staffName,
            'staff_number' => $staff?->staff_number,
            'designation' => $staff?->designation,
            'department_id' => $staff?->department_id ? (string) $staff->department_id : null,
            'department_name' => $staff?->department_name,
            'roles' => $roleNames,
        ];
    }

    /**
     * Department-scoped context for HOD: identifies which department
     * this HOD oversees so the frontend can label/filter accordingly.
     * Course/curriculum lists for HOD must be filtered server-side by
     * this department_id in their respective controllers — do not rely
     * on the frontend to enforce this scoping.
     */
    protected function departmentContextPayload(?object $staff): ?array
    {
        if (! $staff?->department_id) {
            return null;
        }

        return [
            'department_id' => (string) $staff->department_id,
            'department_name' => $staff->department_name,
        ];
    }

    /**
     * @param  bool  $hasWorkspaceAccess  Whether this role gets timetable/marks
     *                                    workspace stats (true for trainer and HOD, false for admin/bursar).
     */
    protected function trainerWorkspacePayload(?object $staff, bool $hasWorkspaceAccess): array
    {
        $activeSession = $this->activeSessionSummary();

        $currentTimetableCount = $hasWorkspaceAccess && $staff
            ? AcademicTimetable::query()
                ->when($activeSession, fn ($query) => $query->where('academic_session_id', $activeSession['id']))
                ->where('trainer_staff_id', $staff->id)
                ->count()
            : 0;

        $recordedMarksCount = $hasWorkspaceAccess && $staff && $activeSession
            ? StudentMark::query()
                ->where('recorded_by_staff_id', $staff->id)
                ->where('academic_session_id', $activeSession['id'])
                ->count()
            : 0;

        return [
            'active_session' => $activeSession,
            'department_id' => $staff?->department_id ? (string) $staff->department_id : '',
            'trainer_staff_id' => $staff?->id ? (string) $staff->id : '',
            'timetable_sessions_count' => $currentTimetableCount,
            'marks_recorded_count' => $recordedMarksCount,
            'can_view_timetable' => $hasWorkspaceAccess && (bool) ($staff?->id && $staff?->department_id),
            'can_grade_students' => $hasWorkspaceAccess && (bool) $staff?->id,
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
                'staffs.first_name',
                'staffs.last_name',
                'staffs.other_name',
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

    /**
     * Department-scoped stats for HOD dashboards. Mirrors institutionStats()
     * shape (label/value pairs) but filtered to a single department, so
     * HodDashboard.jsx can reuse the same stat-card components as admin.
     */
    protected function departmentStats(int $departmentId): array
    {
        $stats = DB::selectOne(<<<'SQL'
            select
                (select count(*) from courses where department_id = ? and deleted_at is null) as courses_count,
                (select count(*) from curricula
                    where course_id in (select id from courses where department_id = ? and deleted_at is null)
                    and deleted_at is null) as curricula_count,
                (select count(*) from student_unit_registrations sur
                    inner join units u on u.id = sur.curriculum_unit_id
                    inner join curricula c on c.id = u.curriculum_mapping_id
                    inner join courses co on co.id = c.course_id
                    where co.department_id = ?) as enrolled_units_count
        SQL, [$departmentId, $departmentId, $departmentId]);

        return [
            ['label' => 'Courses', 'value' => (int) ($stats->courses_count ?? 0)],
            ['label' => 'Curriculums', 'value' => (int) ($stats->curricula_count ?? 0)],
            ['label' => 'Unit Enrollments', 'value' => (int) ($stats->enrolled_units_count ?? 0)],
        ];
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
}
