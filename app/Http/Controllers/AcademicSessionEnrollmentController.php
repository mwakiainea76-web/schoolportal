<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAcademicSessionEnrollmentRequest;
use App\Models\AcademicSession;
use App\Models\AcademicSessionEnrollment;
use App\Models\ProgramEnrollment;
use App\Models\ProgramVersionUnit;
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
            'programEnrollment.student.user',
            'programEnrollment.programVersionMapping.programVersion',
            'programEnrollment.programVersionMapping.program',
            'academicSession.academicYear',
        ])
            ->when($request->search, function ($q) use ($request) {
                $q->whereHas('programEnrollment.student', function ($q) use ($request) {
                    $q->where('registration_number', 'like', "%{$request->search}%")
                        ->orWhereHas('user', function ($q) use ($request) {
                            $q->where('first_name', 'like', "%{$request->search}%")
                                ->orWhere('last_name', 'like', "%{$request->search}%");
                        });
                });
            })
            ->orderBy($request->sort ?? 'created_at', $request->direction ?? 'desc')
            ->paginate(15)
            ->withQueryString();

        $mapped = $enrollments->through(fn ($e) => [
            'id' => $e->id,
            'student_name' => trim(
                ($e->programEnrollment?->student?->user?->first_name ?? '').' '.
                ($e->programEnrollment?->student?->user?->last_name ?? '')
            ),
            'registration_number' => $e->programEnrollment?->student?->registration_number ?? 'N/A',
            'session' => $e->academicSession
                ? "{$e->academicSession->academicYear->academic_year} - Session {$e->academicSession->session_No}"
                : 'N/A',
            'course' => $e->programEnrollment?->programVersionMapping?->program?->name ?? 'N/A',
            'curriculum' => $e->programEnrollment?->programVersionMapping?->programVersion?->name ?? 'N/A',
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
        $student = Student::where('registration_number', $request->registration_number)
            ->first();

        if (! $student) {
            return back()->withInput()->withErrors([
                'registration_number' => "No student found with registration number '{$request->registration_number}'.",
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
                collect($request->input('program_version_unit_ids', []))
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
            'programEnrollment.student.user',
            'programEnrollment.programVersionMapping.programVersion',
            'programEnrollment.programVersionMapping.program',
            'academicSession.academicYear',
        ]);

        return Inertia::render('AcademicSessionEnrollments/Edit', [
            'enrollment' => [
                'id' => $e->id,
                'student_name' => trim(
                    ($e->programEnrollment?->student?->user?->first_name ?? '').' '.
                    ($e->programEnrollment?->student?->user?->last_name ?? '')
                ),
                'registration_number' => $e->programEnrollment?->student?->registration_number ?? 'N/A',
                'session' => $e->academicSession
                    ? "{$e->academicSession->academicYear->academic_year} - Session {$e->academicSession->session_No}"
                    : 'N/A',
                'course' => $e->programEnrollment?->programVersionMapping?->program?->name ?? 'N/A',
                'curriculum' => $e->programEnrollment?->programVersionMapping?->programVersion?->name ?? 'N/A',
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
        $programEnrollment = ProgramEnrollment::where('student_id', $student->id)
            ->latest()
            ->first();

        if (! $programEnrollment) {
            throw ValidationException::withMessages([
                'session_registration' => "Student '{$student->registration_number}' is not enrolled in any program.",
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

        $alreadyEnrolled = AcademicSessionEnrollment::where('program_enrollment_id', $programEnrollment->id)
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

        return DB::transaction(function () use ($programEnrollment, $activeSession, $sessionNumber, $creatorStaffId) {
            $enrollment = AcademicSessionEnrollment::create([
                'program_enrollment_id' => $programEnrollment->id,
                'academic_session_id' => $activeSession->id,
                'module' => $sessionNumber,
                'session_number' => $sessionNumber,
                'status' => 'active',
            ]);

            $this->billingService->createInvoiceForEnrollment(
                $enrollment->load(['academicSession.academicYear', 'programEnrollment']),
                $creatorStaffId
            );

            return $enrollment;
        });
    }

    protected function registerUnitsForCurrentStudent(Student $student, \Illuminate\Support\Collection $selectedUnitIds): array
    {
        $programEnrollment = ProgramEnrollment::query()
            ->where('student_id', $student->id)
            ->latest('id')
            ->first();

        if (! $programEnrollment) {
            throw ValidationException::withMessages([
                'unit_registration' => "Student '{$student->registration_number}' is not enrolled in any program.",
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
            ->where('program_enrollment_id', $programEnrollment->id)
            ->where('academic_session_id', $activeSession->id)
            ->latest('id')
            ->first();

        if (! $sessionEnrollment) {
            throw ValidationException::withMessages([
                'unit_registration' => 'Register the current active session before registering units.',
            ]);
        }

        $moduleUnits = ProgramVersionUnit::query()
            ->where('program_version_mapping_id', $programEnrollment->program_version_mapping_id)
            ->where('module_taught', $sessionEnrollment->module)
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
                $expectedIds->map(fn (int $programVersionUnitId) => [
                    'academic_session_enrollment_id' => $sessionEnrollment->id,
                    'program_version_unit_id' => $programVersionUnitId,
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

