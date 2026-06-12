<?php

namespace App\Http\Controllers;

use App\Models\CourseChangeLog;
use App\Models\LoginAccountHistory;
use App\Models\CourseEnrollment;
use App\Models\CurriculumMapping;
use App\Models\CurriculumTransfer;
use App\Models\Student;
use App\Models\User;
use App\Services\AdmissionNumberService;
use App\Support\RbacCache;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StudentCourseChangeController extends Controller
{
    public function index(Request $request): Response
    {
        $admissionNumber = trim((string) $request->query('admission_number', ''));
        $studentDetails = null;
        $lookupError = null;

        if ($admissionNumber !== '') {
            $student = $this->findActiveStudent($admissionNumber);

            if (! $student) {
                $lookupError = 'Student not found or the student is inactive.';
            } else {
                $studentDetails = $this->studentPayload($student);
            }
        }

        return Inertia::render('students/CourseChange', [
            'filters' => [
                'admission_number' => $admissionNumber,
            ],
            'student' => $studentDetails,
            'lookupError' => $lookupError,
            'curriculumMappings' => $this->activeCourseCurricula(),
            'latestTransfer' => session('latestTransfer'),
        ]);
    }

    public function store(Request $request, AdmissionNumberService $admissionNumbers): RedirectResponse
    {
        $validated = $request->validate([
            'admission_number' => ['required', 'string', 'max:100'],
            'new_curriculum_mapping_id' => ['required', 'integer', 'exists:curriculum_mappings,id'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $result = DB::transaction(function () use ($request, $validated, $admissionNumbers) {
            $student = Student::query()
                ->where('admission_number', trim($validated['admission_number']))
                ->where('enrollment_status', 'active')
                ->lockForUpdate()
                ->first();

            if (! $student) {
                throw ValidationException::withMessages([
                    'admission_number' => 'Student not found or the student is inactive.',
                ]);
            }

            $student->loadMissing(['user.nextOfKin']);

            $oldEnrollment = CourseEnrollment::query()
                ->where('student_id', $student->id)
                ->where('status', 'active')
                ->with(['curriculumMapping.course.certificationLevel', 'curriculumMapping.curriculum'])
                ->lockForUpdate()
                ->first();

            if (! $oldEnrollment) {
                throw ValidationException::withMessages([
                    'admission_number' => 'This student does not have an active course enrolment.',
                ]);
            }

            $otherActiveEnrollments = CourseEnrollment::query()
                ->where('student_id', $student->id)
                ->where('status', 'active')
                ->whereKeyNot($oldEnrollment->id)
                ->lockForUpdate()
                ->exists();

            if ($otherActiveEnrollments) {
                throw ValidationException::withMessages([
                    'admission_number' => 'This student already has more than one active enrolment. Please investigate before processing a course change.',
                ]);
            }

            $newMapping = CurriculumMapping::query()
                ->active()
                ->with(['course.certificationLevel', 'curriculum'])
                ->find($validated['new_curriculum_mapping_id']);

            if (! $newMapping) {
                throw ValidationException::withMessages([
                    'new_curriculum_mapping_id' => 'The selected course is not active.',
                ]);
            }

            if ((int) $oldEnrollment->curriculum_mapping_id === (int) $newMapping->id) {
                throw ValidationException::withMessages([
                    'new_curriculum_mapping_id' => 'New course must differ from current course.',
                ]);
            }

            $oldUser = $student->user;
            if (! $oldUser) {
                throw ValidationException::withMessages([
                    'admission_number' => 'This student does not have an existing login account to transfer.',
                ]);
            }

            $oldAdmissionNumber = $student->admission_number;
            $newAdmissionNumber = $admissionNumbers->generateForCourse($newMapping->course_id);
            $generatedEmail = $this->generatedTransferEmail($newAdmissionNumber);

            $newUser = User::create([
                'email' => $generatedEmail,
                'login_id' => $newAdmissionNumber,
                'is_active' => true,
                'password' => $oldUser->password,
            ]);

            $newUser->assignRole('student');
            RbacCache::forgetForUser($newUser);

            // Copy next of kin if it exists
            if ($oldUser->nextOfKin->isNotEmpty()) {
                foreach ($oldUser->nextOfKin as $kin) {
                    $newUser->nextOfKin()->create([
                        'first_name' => $kin->first_name,
                        'last_name' => $kin->last_name,
                        'relationship' => $kin->relationship,
                        'phone_number' => $kin->phone_number,
                        'alternate_phone_number' => $kin->alternate_phone_number,
                        'email' => $kin->email,
                    ]);
                }
            }

            $oldEnrollment->update([
                'status' => 'transferred',
                'transferred_at' => now(),
                'transferred_by' => $request->user()?->id,
            ]);

            $newEnrollment = CourseEnrollment::create([
                'student_id' => $student->id,
                'course_id' => $newMapping->course_id,
                'curriculum_id' => $newMapping->curriculum_id,
                'exam_body_id' => $newMapping->course?->certificationLevel?->exam_body_id,
                'curriculum_mapping_id' => $newMapping->id,
                'enrollment_date' => now()->toDateString(),
                'intake_year' => now()->year,
                'intake_period' => $this->intakePeriod(),
                'expected_completion_date' => $newMapping->course?->duration_in_months
                    ? now()->addMonthsNoOverflow((int) $newMapping->course->duration_in_months)->toDateString()
                    : null,
                'study_mode' => $oldEnrollment->study_mode ?: 'fulltime',
                'status' => 'active',
            ]);

            $student->update([
                'user_id' => $newUser->id,
                'admission_number' => $newAdmissionNumber,
                'email' => $generatedEmail,
                'current_module' => '1',
                'enrollment_status' => 'active',
                'created_at' => now(), // Updating admission date/time
            ]);

            $oldUser->update([
                'is_active' => false,
            ]);

            $changeLog = CourseChangeLog::create([
                'student_id' => $student->id,
                'old_course_enrollment_id' => $oldEnrollment->id,
                'new_course_enrollment_id' => $newEnrollment->id,
                'old_curriculum_mapping_id' => $oldEnrollment->curriculum_mapping_id,
                'new_curriculum_mapping_id' => $newMapping->id,
                'old_admission_number' => $oldAdmissionNumber,
                'new_admission_number' => $newAdmissionNumber,
                'old_user_id' => $oldUser->id,

                'new_user_id' => $newUser->id,
                'processed_by' => $request->user()?->id,
                'changed_at' => now(),
                'notes' => $validated['notes'] ?? null,
            ]);

            CurriculumTransfer::create([
                'student_id' => $student->id,
                'from_curriculum_mapping_id' => $oldEnrollment->curriculum_mapping_id,
                'to_curriculum_mapping_id' => $newMapping->id,
                'transfer_date' => now()->toDateString(),
                'reason' => $validated['notes'] ?? null,
                'approved_by' => $request->user()?->staff?->id,
            ]);

            LoginAccountHistory::create([
                'student_id' => $student->id,
                'user_id' => $oldUser->id,
                'course_change_log_id' => $changeLog->id,
                'login_id' => $oldUser->login_id,
                'email' => $oldUser->email,
                'status' => 'deactivated',
                'deactivated_at' => now(),
                'deactivated_by' => $request->user()?->id,
                'context' => [
                    'reason' => 'course_change',
                    'new_admission_number' => $newAdmissionNumber,
                ],
            ]);

            LoginAccountHistory::create([
                'student_id' => $student->id,
                'user_id' => $newUser->id,
                'course_change_log_id' => $changeLog->id,
                'login_id' => $newUser->login_id,
                'email' => $newUser->email,
                'status' => 'active',
                'context' => [
                    'reason' => 'course_change',
                    'old_admission_number' => $oldAdmissionNumber,
                ],
            ]);

            return [
                'old_admission_number' => $oldAdmissionNumber,
                'new_admission_number' => $newAdmissionNumber,
                'old_course' => $this->courseName($oldEnrollment->curriculumMapping),
                'new_course' => $this->courseName($newMapping),
                'username' => $newAdmissionNumber,
                'email' => $generatedEmail,
            ];
        });

        return redirect()
            ->route('students.course-change.index')
            ->with('success', 'Student course change processed successfully.')
            ->with('latestTransfer', $result);
    }

    protected function findActiveStudent(string $admissionNumber): ?Student
    {
        return Student::query()
            ->where('admission_number', $admissionNumber)
            ->where('enrollment_status', 'active')
            ->with([
                'user:id,email,login_id,is_active',
                'courseEnrollment.curriculumMapping.course.certificationLevel',
                'courseEnrollment.curriculumMapping.curriculum',
            ])
            ->first();
    }

    protected function studentPayload(Student $student): array
    {
        $mapping = $student->courseEnrollment?->curriculumMapping;

        return [
            'id' => $student->id,
            'full_name' => $student->full_name,
            'current_course' => $this->courseName($mapping),
            'current_curriculum_mapping_id' => $mapping?->id,
            'current_admission_number' => $student->admission_number,
            'current_enrolment_status' => $student->courseEnrollment?->status ?? 'missing',
            'student_status' => $student->enrollment_status,
        ];

    }

    protected function activeCourseCurricula()
    {
        return CurriculumMapping::query()
            ->active()
            ->with(['course.certificationLevel', 'curriculum'])
            ->orderByDesc('id')
            ->get()
            ->map(fn (CurriculumMapping $mapping) => [
                'id' => $mapping->id,
                'name' => $this->courseName($mapping),
            ]);
    }

    protected function courseName(?CurriculumMapping $mapping): string
    {
        if (! $mapping) {
            return 'No course assigned';
        }

        return trim(($mapping->curriculum?->name ?? 'Curriculum').' - '.($mapping->course?->display_name ?? $mapping->course?->name ?? 'Course'), ' -');
    }

    protected function generatedTransferEmail(string $admissionNumber): string
    {
        $slug = Str::lower(Str::replace(['/', ' '], '.', $admissionNumber));
        $email = "{$slug}.transfer@local.invalid";
        $suffix = 1;

        while (User::query()->where('email', $email)->exists()) {
            $email = "{$slug}.transfer{$suffix}@local.invalid";
            $suffix++;
        }

        return $email;
    }

    protected function intakePeriod(): string
    {
        $month = (int) now()->format('n');

        return match (true) {
            $month <= 4 => 'Jan',
            $month <= 8 => 'May',
            default => 'Sep',
        };
    }
}
