<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAcademicSessionEnrollmentRequest;
use App\Models\AcademicSession;
use App\Models\AcademicSessionEnrollment;
use App\Models\CourseEnrollment;
use App\Models\Unit;
use App\Models\Student;
use App\Models\StudentUnitRegistration;
use App\Services\BillingService;
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
        $enrollments = AcademicSessionEnrollment::with([
            'courseEnrollment.student',
            'courseEnrollment.curriculumMapping.curriculum',
            'courseEnrollment.curriculumMapping.course',
            'academicSession.academicYear',
        ])
            ->when($request->search, function ($q) use ($request) {
                $q->whereHas('courseEnrollment.student', function ($q) use ($request) {
                    $q->where('admission_number', 'like', "%{$request->search}%")
                        ->orWhere('first_name', 'like', "%{$request->search}%")
                        ->orWhere('last_name', 'like', "%{$request->search}%");
                });
            })
            ->orderBy($request->sort ?? 'created_at', $request->direction ?? 'desc')
            ->paginate(15)
            ->withQueryString();

        $mapped = $enrollments->through(fn ($e) => [
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
            'created_at' => optional($e->created_at)->toDateString(),
        ]);

        return Inertia::render('AcademicSessionEnrollments/Index', [
            'enrollments' => $mapped,
            'statuses' => ['active', 'completed', 'dropped', 'transferred', 'suspended'],
        ]);
    }

    public function create()
    {
        $activeSession = AcademicSession::with('academicYear')
            ->where('is_active', true)
            ->first();

        return Inertia::render('AcademicSessionEnrollments/Create', [
            'activeSession' => $activeSession ? [
                'id' => $activeSession->id,
                'name' => "{$activeSession->academicYear->academic_year} - Session {$activeSession->session_No}",
            ] : null,
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

        try {
            $enrollment = $this->enrollStudentIntoActiveSession($student, auth()->user()?->staff?->id);
        } catch (ValidationException $e) {
            return back()->withInput()->withErrors($this->normalizeSessionRegistrationErrors($e));
        }

        $activeSession = $enrollment->academicSession;
        $sessionNumber = $enrollment->session_number;

        return redirect()
            ->route('academic.sessions.enrollments.index')
            ->with('success', "Student successfully enrolled in {$activeSession->academicYear->academic_year} - Session {$sessionNumber}. The session invoice has been generated.");
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
            ->route('student.dashboard')
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
            ->route('student.dashboard')
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

    public function destroy(AcademicSessionEnrollment $academicSessionEnrollment)
    {
        $academicSessionEnrollment->delete();

        return back()->with('success', 'Enrollment removed successfully.');
    }

    protected function enrollStudentIntoActiveSession(Student $student, ?int $creatorStaffId = null): AcademicSessionEnrollment
    {
        $courseEnrollment = CourseEnrollment::where('student_id', $student->id)
            ->latest()
            ->first();

        if (! $courseEnrollment) {
            throw ValidationException::withMessages([
                'session_registration' => "Student '{$student->admission_number}' is not enrolled in any course.",
            ]);
        }

        $activeSession = AcademicSession::with('academicYear')
            ->where('is_active', true)
            ->first();

        if (! $activeSession) {
            throw ValidationException::withMessages([
                'session_registration' => 'No active academic session found. Please contact the school office.',
            ]);
        }

        $alreadyEnrolled = AcademicSessionEnrollment::where('course_enrollment_id', $courseEnrollment->id)
            ->where('academic_session_id', $activeSession->id)
            ->exists();

        if ($alreadyEnrolled) {
            throw ValidationException::withMessages([
                'session_registration' => "You are already registered for {$activeSession->academicYear->academic_year} - Session {$activeSession->session_No}.",
            ]);
        }

        $sessionNumber = $activeSession->session_number ?? $activeSession->session_No ?? 1;

        if ($sessionNumber > 3) {
            throw ValidationException::withMessages([
                'session_registration' => 'An academic year can only have 3 modules/sessions.',
            ]);
        }

        return DB::transaction(function () use ($courseEnrollment, $activeSession, $sessionNumber, $creatorStaffId) {
            $enrollment = AcademicSessionEnrollment::create([
                'course_enrollment_id' => $courseEnrollment->id,
                'academic_session_id' => $activeSession->id,
                'module' => $sessionNumber,
                'session_number' => $sessionNumber,
                'status' => 'active',
            ]);

            $this->billingService->createInvoiceForEnrollment(
                $enrollment->load(['academicSession.academicYear', 'courseEnrollment']),
                $creatorStaffId
            );

            return $enrollment;
        });
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
