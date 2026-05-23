<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAcademicSessionEnrollmentRequest;
use App\Models\AcademicSession;
use App\Models\AcademicSessionEnrollment;
use App\Models\ProgramEnrollment;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AcademicSessionEnrollmentController extends Controller
{
    public function index(Request $request)
    {
        $enrollments = AcademicSessionEnrollment::with([
            'courseEnrollment.student.user',
            'courseEnrollment.courseProgramVersion.curriculum',
            'courseEnrollment.courseProgramVersion.course',
            'academicSession.academicYear',
        ])
            ->when($request->search, function ($q) use ($request) {
                $q->whereHas('courseEnrollment.student', function ($q) use ($request) {
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
                ($e->courseEnrollment?->student?->user?->first_name ?? '').' '.
                ($e->courseEnrollment?->student?->user?->last_name ?? '')
            ),
            'registration_number' => $e->courseEnrollment?->student?->registration_number ?? 'N/A',
            'session' => $e->academicSession
                ? "{$e->academicSession->academicYear->academic_year} - Session {$e->academicSession->session_No}"
                : 'N/A',
            'course' => $e->courseEnrollment?->courseProgramVersion?->course?->name ?? 'N/A',
            'curriculum' => $e->courseEnrollment?->courseProgramVersion?->curriculum?->name ?? 'N/A',
            'module' => $e->module,
            'year_of_study' => $e->year_of_study,
            'status' => $e->status,
            'created_at' => $e->created_at->format('d M Y'),
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
        // 1. Find student
        $student = Student::where('registration_number', $request->registration_number)
            ->first();

        if (! $student) {
            return back()->withInput()->withErrors([
                'registration_number' => "No student found with registration number '{$request->registration_number}'.",
            ]);
        }

        // 2. Find the student's course enrollment
        $courseEnrollment = ProgramEnrollment::where('student_id', $student->id)
            ->latest()
            ->first();

        if (! $courseEnrollment) {
            return back()->withInput()->withErrors([
                'registration_number' => "Student '{$request->registration_number}' is not enrolled in any course.",
            ]);
        }

        // 3. Find active academic session
        $activeSession = AcademicSession::with('academicYear')
            ->where('is_active', true)
            ->first();

        if (! $activeSession) {
            return back()->withInput()->withErrors([
                'registration_number' => 'No active academic session found. Please activate a session first.',
            ]);
        }

        // 4. Check if already enrolled in this session
        $alreadyEnrolled = AcademicSessionEnrollment::where('course_enrollment_id', $courseEnrollment->id)
            ->where('academic_session_id', $activeSession->id)
            ->exists();

        if ($alreadyEnrolled) {
            return back()->withInput()->withErrors([
                'registration_number' => "Student '{$request->registration_number}' is already enrolled in {$activeSession->academicYear->academic_year} - Session {$activeSession->session_No}.",
            ]);
        }

        // 5. Auto-calculate module
        $completedSessions = AcademicSessionEnrollment::where('course_enrollment_id', $courseEnrollment->id)
            ->where('status', 'completed')
            ->count();

        $nextModule = $completedSessions + 1;

        // 6. Create enrollment (year_of_study will be auto-calculated from session_No)
        DB::transaction(function () use ($courseEnrollment, $activeSession, $nextModule) {
            AcademicSessionEnrollment::create([
                'course_enrollment_id' => $courseEnrollment->id,
                'academic_session_id' => $activeSession->id,
                'module' => $nextModule,
                'status' => 'active',
                // year_of_study is automatically calculated in the model's boot method
                // Formula: year_of_study = ceil(session_No / 3)
                // Sessions 1-3 = Year 1, Sessions 4-6 = Year 2, etc.
            ]);
        });

        return redirect()
            ->route('academic.sessions.enrollments.index')
            ->with('success', "Student successfully enrolled in {$activeSession->academicYear->academic_year} - Session {$activeSession->session_No} as Module {$nextModule}.");
    }

    public function edit(AcademicSessionEnrollment $academicSessionEnrollment)
    {
        $e = $academicSessionEnrollment->load([
            'courseEnrollment.student.user',
            'courseEnrollment.courseProgramVersion.curriculum',
            'courseEnrollment.courseProgramVersion.course',
            'academicSession.academicYear',
        ]);

        return Inertia::render('AcademicSessionEnrollments/Edit', [
            'enrollment' => [
                'id' => $e->id,
                'student_name' => trim(
                    ($e->courseEnrollment?->student?->user?->first_name ?? '').' '.
                    ($e->courseEnrollment?->student?->user?->last_name ?? '')
                ),
                'registration_number' => $e->courseEnrollment?->student?->registration_number ?? 'N/A',
                'session' => $e->academicSession
                    ? "{$e->academicSession->academicYear->academic_year} - Session {$e->academicSession->session_No}"
                    : 'N/A',
                'course' => $e->courseEnrollment?->courseProgramVersion?->course?->name ?? 'N/A',
                'curriculum' => $e->courseEnrollment?->courseProgramVersion?->curriculum?->name ?? 'N/A',
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
}

