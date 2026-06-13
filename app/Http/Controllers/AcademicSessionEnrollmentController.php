<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAcademicSessionEnrollmentRequest;
use App\Http\Requests\UpdateAcademicSessionEnrollmentStatusRequest;
use App\Models\AcademicSession;
use App\Models\AcademicSessionEnrollment;
use App\Models\CourseEnrollment;
use App\Models\Unit;
use App\Models\Student;
use App\Models\StudentUnitRegistration;
use App\Services\BillingService;
use App\Services\StudentEnrollmentStatusService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AcademicSessionEnrollmentController extends Controller
{
    public function __construct(protected BillingService $billingService)
    {
    }

    public function index(Request $request)
    {
        $filters = $request->only([
            'course_id',
            'curriculum_id',
            'academic_year_id',
            'academic_session_id',
            'department_id',
            'year_of_study',
            'admission_number',
            'status',
        ]);

        $enrollments = AcademicSessionEnrollment::with([
            'courseEnrollment.student',
            'courseEnrollment.curriculumMapping.curriculum',
            'courseEnrollment.curriculumMapping.course.department',
            'courseEnrollment.course.department',
            'academicSession.academicYear',
        ])
            ->when($filters['admission_number'] ?? null, function ($q, $admissionNumber) {
                $q->whereHas('courseEnrollment.student', function ($q) use ($admissionNumber) {
                    $q->where('admission_number', 'like', "%{$admissionNumber}%");
                });
            })
            ->when($filters['department_id'] ?? null, function ($q, $departmentId) {
                $q->whereHas('courseEnrollment', function ($q) use ($departmentId) {
                    $q->whereHas('course', fn ($courseQuery) => $courseQuery->where('department_id', $departmentId))
                        ->orWhereHas('curriculumMapping.course', fn ($courseQuery) => $courseQuery->where('department_id', $departmentId));
                });
            })
            ->when($filters['course_id'] ?? null, function ($q, $courseId) {
                $q->whereHas('courseEnrollment', function ($q) use ($courseId) {
                    $q->where('course_id', $courseId)
                        ->orWhereHas('curriculumMapping', fn ($mq) => $mq->where('course_id', $courseId));
                });
            })
            ->when($filters['curriculum_id'] ?? null, function ($q, $curriculumId) {
                $q->whereHas('courseEnrollment', function ($q) use ($curriculumId) {
                    $q->where('curriculum_id', $curriculumId)
                        ->orWhereHas('curriculumMapping', fn ($mq) => $mq->where('curriculum_id', $curriculumId));
                });
            })
            ->when($filters['academic_year_id'] ?? null, function ($q, $yearId) {
                $q->whereHas('academicSession', fn ($sq) => $sq->where('academic_year_id', $yearId));
            })
            ->when($filters['academic_session_id'] ?? null, function ($q, $sessionId) {
                $q->where('academic_session_id', $sessionId);
            })
            ->when($filters['year_of_study'] ?? null, function ($q, $year) {
                $q->where('year_of_study', $year);
            })
            ->when($filters['status'] ?? null, function ($q, $status) {
                $q->where('status', $status);
            })
            ->orderBy($request->sort ?? 'created_at', $request->direction ?? 'desc')
            ->paginate(15)
            ->withQueryString();

        $mapped = $enrollments->through(fn ($e) => [
            'id' => $e->id,
            'student_name' => $e->courseEnrollment?->student?->full_name ?? 'N/A',
            'admission_number' => $e->courseEnrollment?->student?->admission_number ?? 'N/A',
            'department' => $e->courseEnrollment?->course?->department?->name
                ?? $e->courseEnrollment?->curriculumMapping?->course?->department?->name
                ?? 'N/A',
            'session' => $e->academicSession
                ? "{$e->academicSession->academicYear->academic_year} - Session {$e->academicSession->session_No}"
                : 'N/A',
            'course' => $e->courseEnrollment?->curriculumMapping?->course?->name ?? 'N/A',
            'curriculum' => $e->courseEnrollment?->curriculumMapping?->curriculum?->name ?? 'N/A',
            'module' => $e->module,
            'year_of_study' => $e->year_of_study,
            'status' => $e->status,
            'created_at' => optional($e->created_at)->toDateString(),
        ]);

        return Inertia::render('AcademicSessionEnrollments/Index', [
            'enrollments' => $mapped,
            'filters' => (object) $filters,
            'selectedFilters' => $this->selectedFilters($filters),
            'statuses' => ['active', 'completed', 'dropped', 'transferred', 'suspended'],
        ]);
    }

    protected function selectedFilters(array $filters): array
    {
        $course = ! empty($filters['course_id'])
            ? \App\Models\Course::select('id', 'name', 'code', 'certification_level_id')
                ->with('certificationLevel:id,name')
                ->find($filters['course_id'])
            : null;

        $curriculum = ! empty($filters['curriculum_id'])
            ? \App\Models\Curriculum::select('id', 'name')->find($filters['curriculum_id'])
            : null;

        $academicYear = ! empty($filters['academic_year_id'])
            ? \App\Models\AcademicYear::select('id', 'academic_year', 'label')->find($filters['academic_year_id'])
            : null;

        $academicSession = ! empty($filters['academic_session_id'])
            ? AcademicSession::with('academicYear:id,academic_year,label')
                ->select('id', 'academic_year_id', 'session_number', 'session_No', 'label')
                ->find($filters['academic_session_id'])
            : null;

        $department = ! empty($filters['department_id'])
            ? \App\Models\Department::select('id', 'name', 'code')->find($filters['department_id'])
            : null;

        return [
            'course' => $course?->display_name ?? $course?->name,
            'curriculum' => $curriculum?->name,
            'academic_year' => $academicYear?->name,
            'academic_session' => $academicSession?->display_name,
            'department' => $department ? trim($department->code . ' - ' . $department->name, ' -') : null,
            'year_of_study' => $filters['year_of_study'] ?? null,
            'admission_number' => $filters['admission_number'] ?? null,
        ];
    }

    public function create()
    {
        $activeSession = AcademicSession::with('academicYear')
            ->where('is_active', true)
            ->first();

        return Inertia::render('AcademicSessionEnrollments/Create', [
            'activeSession' => $activeSession ? [
                'id' => $activeSession->id,
                'name' => "{$activeSession->academicYear->academic_year} - Session ".($activeSession->session_number ?? $activeSession->session_No),
                'session_number' => (int) ($activeSession->session_number ?? $activeSession->session_No ?? 1),
            ] : null,
        ]);
    }

    public function createStatusPage()
    {
        return Inertia::render('AcademicSessionEnrollments/ChangeStatus', [
            'statuses' => ['active', 'deferred', 'expelled', 'graduated'],
        ]);
    }

    public function store(StoreAcademicSessionEnrollmentRequest $request)
    {
        $student = Student::where('admission_number', $request->admission_number)
            ->first();

        if (! $student) {
            return back()->withInput()->withErrors([
                'admission_number' => "No student found with admission number '{$request->admission_number}'.",
            ]);
        }
        $activeSession = AcademicSession::query()
            ->where('id', $request->active_session_id)
            ->first();

        try {
            $moduleNumber = (int) $request->integer('module_number');
            $studyProgress = $this->deriveStudyProgressFromModule($moduleNumber);

            $enrollment = $this->enrollStudentIntoConfiguredSession(
                $student,
                $activeSession,
                $moduleNumber,
                $studyProgress['year_of_study'],
                $studyProgress['session_number'],
                auth()->user()?->staff?->id
            );
        } catch (ValidationException $e) {
            return back()->withInput()->withErrors($e->errors());
        }

        $activeSession = $enrollment->academicSession;
        $sessionNumber = $enrollment->session_number;

        return redirect()
            ->route('students.session-enrollment.create')
            ->with('success', "Student successfully enrolled in {$activeSession->academicYear->academic_year} - Session {$sessionNumber} for module {$enrollment->module}. The session invoice has been generated.");
    }

    public function registerCurrentStudent(Request $request)
    {
        $student = $request->user()?->student;

        if (! $student) {
            return back()->withErrors([
                'session_registration' => 'Your account is not linked to a student profile.',
            ]);
        }

        try {
            $enrollment = $this->enrollStudentIntoActiveSession($student, auth()->user()?->staff?->id);
        } catch (ValidationException $e) {
            return back()->withErrors($this->normalizeSessionRegistrationErrors($e));
        }

        $activeSession = $enrollment->academicSession;
        $sessionNumber = $enrollment->session_number;

        return redirect()
            ->route('dashboard')
            ->with('success', "You have been registered for {$activeSession->academicYear->academic_year} - Session {$sessionNumber}. Your session invoice has been generated.");
    }

    public function registerCurrentStudentUnits(Request $request)
    {
        $student = $request->user()?->student;

        if (! $student) {
            return back()->withErrors([
                'unit_registration' => 'Your account is not linked to a student profile.',
            ]);
        }

        try {
            $result = $this->registerUnitsForCurrentStudent(
                $student,
                collect($request->input('curriculum_unit_ids', []))
            );
        } catch (ValidationException $e) {
            return back()->withErrors($this->normalizeUnitRegistrationErrors($e));
        }

        return redirect()
            ->route('dashboard')
            ->with('success', "You have registered {$result['registered_count']} unit(s) for {$result['session_name']}.");
    }

    public function edit(AcademicSessionEnrollment $academicSessionEnrollment)
    {
        $e = $academicSessionEnrollment->load([
            'courseEnrollment.student',
            'courseEnrollment.curriculumMapping.curriculum',
            'courseEnrollment.curriculumMapping.course',
            'academicSession.academicYear',
        ]);

        return Inertia::render('AcademicSessionEnrollments/Edit', [
            'enrollment' => [
                'id' => $e->id,
                'student_name' => $e->courseEnrollment?->student?->full_name ?? 'N/A',
                'admission_number' => $e->courseEnrollment?->student?->admission_number ?? 'N/A',
                'session' => $e->academicSession
                    ? "{$e->academicSession->academicYear->academic_year} - Session {$e->academicSession->session_No}"
                    : 'N/A',
                'course' => $e->courseEnrollment?->curriculumMapping?->course?->name ?? 'N/A',
                'curriculum' => $e->courseEnrollment?->curriculumMapping?->curriculum?->name ?? 'N/A',
                'module' => $e->module,
                'year_of_study' => $e->year_of_study,
                'status' => $e->status,
            ],
            'statuses' => ['active', 'completed', 'dropped', 'transferred', 'suspended'],
        ]);
    }

    public function update(AcademicSessionEnrollment $academicSessionEnrollment, Request $request)
    {
        $request->validate([
            'status' => ['required', 'in:active,completed,dropped,transferred,suspended'],
        ]);

        $academicSessionEnrollment->update(['status' => $request->status]);

        return back()->with('success', 'Enrollment status updated successfully.');
    }

    public function updateStatusByAdmission(
        UpdateAcademicSessionEnrollmentStatusRequest $request,
        StudentEnrollmentStatusService $studentStatusService
    )
    {
        $student = Student::where('admission_number', $request->admission_number)->first();

        if (! $student) {
            throw ValidationException::withMessages([
                'admission_number' => 'No student was found with that admission number.',
            ]);
        }

        $status = $request->status;
        $requiresReason = in_array($status, ['deferred', 'expelled'], true);

        $studentStatusService->updateEnrollmentStatus($student, $status, [
            'effective_date' => $request->effective_date,
            'reason' => $requiresReason ? $request->reason : null,
            'resume_date' => $status === 'deferred' ? $request->resume_date : null,
            'recorded_by' => $request->user()?->id,
        ]);

        return back()->with('success', 'Student status updated successfully.');
    }

    public function destroy(AcademicSessionEnrollment $academicSessionEnrollment)
    {
        $academicSessionEnrollment->delete();

        return back()->with('success', 'Enrollment removed successfully.');
    }

    protected function enrollStudentIntoActiveSession(Student $student, ?int $creatorStaffId = null): AcademicSessionEnrollment
    {
        $activeSession = AcademicSession::with('academicYear')
            ->where('is_active', true)
            ->first();

        if (! $activeSession) {
            throw ValidationException::withMessages([
                'session_registration' => 'No active academic session found. Please contact the school office.',
            ]);
        }

        $moduleNumber = max(1, (int) ($student->current_module ?: 1));
        $studyProgress = $this->deriveStudyProgressFromModule($moduleNumber);

        return $this->enrollStudentIntoConfiguredSession(
            $student,
            $activeSession,
            $moduleNumber,
            $studyProgress['year_of_study'],
            $studyProgress['session_number'],
            $creatorStaffId
        );
    }

    protected function enrollStudentIntoConfiguredSession(
        Student $student,
        ?AcademicSession $activeSession,
        int $moduleNumber,
        int $yearOfStudy,
        int $sessionNumber,
        ?int $creatorStaffId = null
    ): AcademicSessionEnrollment {
        $courseEnrollment = CourseEnrollment::where('student_id', $student->id)
            ->latest()
            ->first();

        if (! $courseEnrollment) {
            throw ValidationException::withMessages([
                'session_registration' => "Student '{$student->admission_number}' is not enrolled in any course.",
            ]);
        }

        if (! $activeSession) {
            throw ValidationException::withMessages([
                'session_registration' => 'No active academic session found. Please contact the school office.',
            ]);
        }

        $activeSessionNumber = (int) ($activeSession->session_number ?? $activeSession->session_No ?? 1);

        if ($sessionNumber !== $activeSessionNumber) {
            throw ValidationException::withMessages([
                'module_number' => "Module {$moduleNumber} maps to Session {$sessionNumber}, but the current active session is Session {$activeSessionNumber}.",
            ]);
        }

        $alreadyEnrolled = AcademicSessionEnrollment::where('course_enrollment_id', $courseEnrollment->id)
            ->where('academic_session_id', $activeSession->id)
            ->exists();

        if ($alreadyEnrolled) {
            throw ValidationException::withMessages([
                'session_registration' => "You are already registered for {$activeSession->academicYear->academic_year} - Session {$activeSessionNumber}.",
            ]);
        }

        return DB::transaction(function () use (
            $courseEnrollment,
            $activeSession,
            $student,
            $moduleNumber,
            $yearOfStudy,
            $sessionNumber,
            $creatorStaffId
        ) {
            $enrollment = AcademicSessionEnrollment::create([
                'course_enrollment_id' => $courseEnrollment->id,
                'academic_session_id' => $activeSession->id,
                'module' => $moduleNumber,
                'year_of_study' => $yearOfStudy,
                'session_number' => $sessionNumber,
                'status' => 'active',
            ]);

            $student->update([
                'current_module' => (string) $moduleNumber,
            ]);

            $this->billingService->createInvoiceForEnrollment(
                $enrollment->load(['academicSession.academicYear', 'courseEnrollment']),
                $creatorStaffId
            );

            return $enrollment;
        });
    }

    protected function deriveStudyProgressFromModule(int $moduleNumber): array
    {
        return [
            'year_of_study' => (int) intdiv($moduleNumber - 1, 3) + 1,
            'session_number' => (int) (($moduleNumber - 1) % 3) + 1,
        ];
    }

    protected function registerUnitsForCurrentStudent(Student $student, \Illuminate\Support\Collection $selectedUnitIds): array
    {
        $courseEnrollment = CourseEnrollment::query()
            ->where('student_id', $student->id)
            ->latest('id')
            ->first();

        if (! $courseEnrollment) {
            throw ValidationException::withMessages([
                'unit_registration' => "Student '{$student->admission_number}' is not enrolled in any course.",
            ]);
        }

        $activeSession = AcademicSession::with('academicYear')
            ->where('is_active', true)
            ->first();

        if (! $activeSession) {
            throw ValidationException::withMessages([
                'unit_registration' => 'No active academic session found. Please contact the school office.',
            ]);
        }

        $sessionEnrollment = AcademicSessionEnrollment::query()
            ->with('academicSession.academicYear')
            ->where('course_enrollment_id', $courseEnrollment->id)
            ->where('academic_session_id', $activeSession->id)
            ->latest('id')
            ->first();

        if (! $sessionEnrollment) {
            throw ValidationException::withMessages([
                'unit_registration' => 'Register the current active session before registering units.',
            ]);
        }

        $moduleUnits = Unit::query()
            ->where('curriculum_mapping_id', $courseEnrollment->curriculum_mapping_id)
            ->where(function ($query) use ($sessionEnrollment) {
                $query->where('module', $sessionEnrollment->module)
                    ->orWhere('module_taught', $sessionEnrollment->module);
            })
            ->orderBy('id')
            ->get(['id']);

        if ($moduleUnits->isEmpty()) {
            throw ValidationException::withMessages([
                'unit_registration' => 'No units have been mapped to your current module yet.',
            ]);
        }

        $selectedIds = $selectedUnitIds
            ->filter(fn ($value) => filled($value))
            ->map(fn ($value) => (int) $value)
            ->unique()
            ->values();

        if ($selectedIds->isEmpty()) {
            throw ValidationException::withMessages([
                'unit_registration' => 'Select the units for this module before submitting your registration.',
            ]);
        }

        $expectedIds = $moduleUnits->pluck('id')->values();

        if ($selectedIds->sort()->values()->all() !== $expectedIds->sort()->values()->all()) {
            throw ValidationException::withMessages([
                'unit_registration' => 'You must select every unit assigned to your current module before registration can be completed.',
            ]);
        }

        DB::transaction(function () use ($sessionEnrollment, $expectedIds) {
            StudentUnitRegistration::query()
                ->where('academic_session_enrollment_id', $sessionEnrollment->id)
                ->delete();

            StudentUnitRegistration::query()->insert(
                $expectedIds->map(fn (int $curriculumUnitId) => [
                    'academic_session_enrollment_id' => $sessionEnrollment->id,
                    'curriculum_unit_id' => $curriculumUnitId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ])->all()
            );
        });

        return [
            'registered_count' => $expectedIds->count(),
            'session_name' => $sessionEnrollment->academicSession?->display_name
                ?? "Session {$sessionEnrollment->session_number}",
        ];
    }

    protected function normalizeSessionRegistrationErrors(ValidationException $exception): array
    {
        $errors = $exception->errors();

        if (isset($errors['session_registration'])) {
            return $errors;
        }

        $firstMessage = collect($errors)
            ->flatten()
            ->filter()
            ->first();

        return [
            'session_registration' => [
                $firstMessage ?: 'Session registration failed. Please try again.',
            ],
        ];
    }

    protected function normalizeUnitRegistrationErrors(ValidationException $exception): array
    {
        $errors = $exception->errors();

        if (isset($errors['unit_registration'])) {
            return $errors;
        }

        $firstMessage = collect($errors)
            ->flatten()
            ->filter()
            ->first();

        return [
            'unit_registration' => [
                $firstMessage ?: 'Unit registration failed. Please try again.',
            ],
        ];
    }
}
