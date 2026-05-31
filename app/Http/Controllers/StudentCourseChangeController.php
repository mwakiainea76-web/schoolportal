<?php

namespace App\Http\Controllers;

use App\Models\CourseChangeLog;
use App\Models\LoginAccountHistory;
use App\Models\ProgramEnrollment;
use App\Models\ProgramVersionMapping;
use App\Models\Student;
use App\Models\User;
use App\Support\RbacCache;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StudentCourseChangeController extends Controller
{
    public function index(Request $request): Response
    {
        $registrationNumber = trim((string) $request->query('registration_number', ''));
        $studentDetails = null;
        $lookupError = null;

        if ($registrationNumber !== '') {
            $student = $this->findActiveStudent($registrationNumber);

            if (! $student) {
                $lookupError = 'Student not found or the student is inactive.';
            } else {
                $studentDetails = $this->studentPayload($student);
            }
        }

        return Inertia::render('students/CourseChange', [
            'filters' => [
                'registration_number' => $registrationNumber,
            ],
            'student' => $studentDetails,
            'lookupError' => $lookupError,
            'courseCurricula' => $this->activeCourseCurricula(),
            'latestTransfer' => session('latestTransfer'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'registration_number' => ['required', 'string', 'max:100'],
            'new_program_version_mapping_id' => ['required', 'integer', 'exists:program_version_mappings,id'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $result = DB::transaction(function () use ($request, $validated) {
            $student = Student::query()
                ->where('registration_number', trim($validated['registration_number']))
                ->where('student_status', 'active')
                ->lockForUpdate()
                ->first();

            if (! $student) {
                throw ValidationException::withMessages([
                    'registration_number' => 'Student not found or the student is inactive.',
                ]);
            }

            $student->loadMissing(['user.nextofkin']);

            $oldEnrollment = ProgramEnrollment::query()
                ->where('student_id', $student->id)
                ->where('status', 'active')
                ->with(['programVersionMapping.program.certificationLevel', 'programVersionMapping.programVersion'])
                ->lockForUpdate()
                ->first();

            if (! $oldEnrollment) {
                throw ValidationException::withMessages([
                    'registration_number' => 'This student does not have an active course enrolment.',
                ]);
            }

            $otherActiveEnrollments = ProgramEnrollment::query()
                ->where('student_id', $student->id)
                ->where('status', 'active')
                ->whereKeyNot($oldEnrollment->id)
                ->lockForUpdate()
                ->exists();

            if ($otherActiveEnrollments) {
                throw ValidationException::withMessages([
                    'registration_number' => 'This student already has more than one active enrolment. Please investigate before processing a course change.',
                ]);
            }

            $newMapping = ProgramVersionMapping::query()
                ->active()
                ->with(['program.certificationLevel', 'programVersion'])
                ->find($validated['new_program_version_mapping_id']);

            if (! $newMapping) {
                throw ValidationException::withMessages([
                    'new_program_version_mapping_id' => 'The selected course is not active.',
                ]);
            }

            if ((int) $oldEnrollment->program_version_mapping_id === (int) $newMapping->id) {
                throw ValidationException::withMessages([
                    'new_program_version_mapping_id' => 'New course must differ from current course.',
                ]);
            }

            $oldUser = $student->user;
            if (! $oldUser) {
                throw ValidationException::withMessages([
                    'registration_number' => 'This student does not have an existing login account to transfer.',
                ]);
            }

            $oldRegistrationNumber = $student->registration_number;
            $newRegistrationNumber = $this->generateRegistrationNumber();
            $temporaryPassword = Str::password(10);
            $generatedEmail = $this->generatedTransferEmail($newRegistrationNumber);

            $newUser = User::create([
                'first_name' => $oldUser->first_name,
                'last_name' => $oldUser->last_name,
                'other_name' => $oldUser->other_name,
                'email' => $generatedEmail,
                'login_id' => $newRegistrationNumber,
                'profile_photo' => $oldUser->profile_photo,
                'gender' => $oldUser->gender,
                'date_of_birth' => $oldUser->date_of_birth,
                'phone_number' => $oldUser->phone_number,
                'county' => $oldUser->county,
                'address' => $oldUser->address,
                'religion' => $oldUser->religion,
                'is_pwd' => $oldUser->is_pwd,
                'is_active' => true,
                'disability_type' => $oldUser->disability_type,
                'medical_condition' => $oldUser->medical_condition,
                'password' => Hash::make($temporaryPassword),
            ]);

            $newUser->assignRole('student');
            RbacCache::forgetForUser($newUser);

            if ($oldUser->nextofkin) {
                $newUser->nextofkin()->create([
                    'first_name' => $oldUser->nextofkin->first_name,
                    'last_name' => $oldUser->nextofkin->last_name,
                    'relationship' => $oldUser->nextofkin->relationship,
                    'phone_number' => $oldUser->nextofkin->phone_number,
                    'alternate_phone_number' => $oldUser->nextofkin->alternate_phone_number,
                    'email' => $oldUser->nextofkin->email,
                ]);
            }

            $oldEnrollment->update([
                'status' => 'transferred',
                'transferred_at' => now(),
                'transferred_by' => $request->user()?->id,
            ]);

            $newEnrollment = ProgramEnrollment::create([
                'student_id' => $student->id,
                'program_version_mapping_id' => $newMapping->id,
                'status' => 'active',
            ]);

            $student->update([
                'user_id' => $newUser->id,
                'registration_number' => $newRegistrationNumber,
                'current_module' => '1',
                'student_status' => 'active',
                'admission_date' => now(),
            ]);

            $oldUser->update([
                'is_active' => false,
            ]);

            $changeLog = CourseChangeLog::create([
                'student_id' => $student->id,
                'old_program_enrollment_id' => $oldEnrollment->id,
                'new_program_enrollment_id' => $newEnrollment->id,
                'old_program_version_mapping_id' => $oldEnrollment->program_version_mapping_id,
                'new_program_version_mapping_id' => $newMapping->id,
                'old_registration_number' => $oldRegistrationNumber,
                'new_registration_number' => $newRegistrationNumber,
                'old_user_id' => $oldUser->id,
                'new_user_id' => $newUser->id,
                'processed_by' => $request->user()?->id,
                'changed_at' => now(),
                'notes' => $validated['notes'] ?? null,
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
                    'new_registration_number' => $newRegistrationNumber,
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
                    'old_registration_number' => $oldRegistrationNumber,
                ],
            ]);

            return [
                'old_registration_number' => $oldRegistrationNumber,
                'new_registration_number' => $newRegistrationNumber,
                'old_course' => $this->courseName($oldEnrollment->programVersionMapping),
                'new_course' => $this->courseName($newMapping),
                'username' => $newRegistrationNumber,
                'email' => $generatedEmail,
                'temporary_password' => $temporaryPassword,
            ];
        });

        return redirect()
            ->route('students.course-change.index')
            ->with('success', 'Student course change processed successfully.')
            ->with('latestTransfer', $result);
    }

    protected function findActiveStudent(string $registrationNumber): ?Student
    {
        return Student::query()
            ->where('registration_number', $registrationNumber)
            ->where('student_status', 'active')
            ->with([
                'user:id,first_name,last_name,email,login_id,is_active',
                'programEnrollment.programVersionMapping.program.certificationLevel',
                'programEnrollment.programVersionMapping.programVersion',
            ])
            ->first();
    }

    protected function studentPayload(Student $student): array
    {
        $mapping = $student->programEnrollment?->programVersionMapping;

        return [
            'id' => $student->id,
            'full_name' => trim(($student->user?->first_name ?? '').' '.($student->user?->last_name ?? '')),
            'current_course' => $this->courseName($mapping),
            'current_program_version_mapping_id' => $mapping?->id,
            'current_admission_number' => $student->registration_number,
            'current_enrolment_status' => $student->programEnrollment?->status ?? 'missing',
            'student_status' => $student->student_status,
        ];
    }

    protected function activeCourseCurricula()
    {
        return ProgramVersionMapping::query()
            ->active()
            ->with(['program.certificationLevel', 'programVersion'])
            ->orderByDesc('id')
            ->get()
            ->map(fn (ProgramVersionMapping $mapping) => [
                'id' => $mapping->id,
                'name' => $this->courseName($mapping),
            ]);
    }

    protected function courseName(?ProgramVersionMapping $mapping): string
    {
        if (! $mapping) {
            return 'No course assigned';
        }

        return trim(($mapping->programVersion?->name ?? 'Program Version').' - '.($mapping->program?->display_name ?? $mapping->program?->name ?? 'Program'), ' -');
    }

    protected function generateRegistrationNumber(): string
    {
        $year = now()->year;
        $month = now()->format('m');

        $last = Student::query()
            ->whereYear('created_at', $year)
            ->lockForUpdate()
            ->latest('id')
            ->value('registration_number');

        $next = $last ? ((int) substr($last, -4)) + 1 : 1;
        $sequence = str_pad((string) $next, 4, '0', STR_PAD_LEFT);

        $candidate = "STD/{$year}/{$month}/{$sequence}";

        while (
            Student::query()->where('registration_number', $candidate)->exists()
            || User::query()->where('login_id', $candidate)->exists()
        ) {
            $next++;
            $sequence = str_pad((string) $next, 4, '0', STR_PAD_LEFT);
            $candidate = "STD/{$year}/{$month}/{$sequence}";
        }

        return $candidate;
    }

    protected function generatedTransferEmail(string $registrationNumber): string
    {
        $slug = Str::lower(Str::replace(['/', ' '], '.', $registrationNumber));
        $email = "{$slug}.transfer@local.invalid";
        $suffix = 1;

        while (User::query()->where('email', $email)->exists()) {
            $email = "{$slug}.transfer{$suffix}@local.invalid";
            $suffix++;
        }

        return $email;
    }
}
