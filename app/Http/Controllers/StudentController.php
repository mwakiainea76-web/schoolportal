<?php

namespace App\Http\Controllers;

use App\Filters\StudentFilter;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\CourseEnrollment;
use App\Models\Course;
use App\Models\ExamBody;
use App\Models\CourseVersion;
use App\Models\CourseVersionMapping;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use App\Support\RbacCache;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    // ----------------------------------------------------------------
    // STEP VALIDATION (shared by create & edit)
    // ----------------------------------------------------------------

    public function validateStep(Request $request): JsonResponse
    {
        $step = (int) $request->input('step');

        // Edit mode: ignore the current student's user in the unique email check
        $ignoreUserId = Student::find($request->input('_student_id'))?->user_id;

        $rules = match ($step) {
            1 => [
                'first_name' => ['required', 'string', 'max:255'],
                'last_name' => ['required', 'string', 'max:255'],
                'other_name' => ['nullable', 'string', 'max:255'],
                'email' => [
                    'required', 'email',
                    $ignoreUserId
                        ? Rule::unique('users', 'email')->ignore($ignoreUserId)
                        : Rule::unique('users', 'email'),
                ],
                'phone_number' => ['required', 'string', 'max:15'],
                'gender' => ['required', 'string'],
                'date_of_birth' => ['required', 'date'],
                'county' => ['required', 'string', 'max:70'],
                'address' => ['required', 'string', 'min:3'],
                'religion' => ['required', 'string', 'min:3'],
                'is_pwd' => ['boolean'],
                'disability_type' => ['nullable', 'string', 'max:255'],
                'medical_condition' => ['nullable', 'string', 'max:255'],
            ],
            2 => [
                'previous_school' => ['required', 'string', 'max:255'],
                'course_version_id' => $request->filled('_student_id')
                    ? ['nullable', 'exists:course_versions,id']
                    : ['required', 'exists:course_versions,id'],
                'course_curriculum_id' => $request->filled('_student_id')
                    ? ['nullable', 'exists:course_version_mappings,id']
                    : ['required', 'exists:course_version_mappings,id'],
                'current_module' => ['required', 'string'],
                'fee_discount_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            ],
            3 => [

                'kin_first_name' => ['required', 'string', 'max:255'],
                'kin_last_name' => ['required', 'string', 'max:255'],
                'kin_relationship' => ['required', 'string', 'max:255'],
                'kin_phone' => ['required', 'string', 'max:15'],
                'kin_alt_phone' => ['nullable', 'string', 'max:15'],
                'kin_email' => ['nullable', 'email', 'max:255'],
            ],
            default => [],
        };

        $request->validate($rules);

        return response()->json(['ok' => true]);
    }

    // ----------------------------------------------------------------
    // REGISTRATION NUMBER GENERATION
    // ----------------------------------------------------------------

    private function generateRegistrationNumber(): string
    {
        $year = now()->year;
        $month = now()->format('m');

        $last = Student::whereYear('created_at', $year)
            ->lockForUpdate()
            ->latest('id')
            ->value('registration_number');

        $next = $last ? ((int) substr($last, -4)) + 1 : 1;
        $sequence = str_pad($next, 4, '0', STR_PAD_LEFT);

        return "STD/{$year}/{$month}/{$sequence}";
    }

    // ----------------------------------------------------------------
    // INDEX
    // ----------------------------------------------------------------

    public function index(Request $request, StudentFilter $filter)
    {
        $students = $filter
            ->apply(
                Student::query(),
                $request->all()
            )
            ->select([
                'students.id',
                'students.registration_number',
                'students.current_module',
                'students.admission_date',
                'students.student_status',
                'users.first_name as user_first_name',
                'users.last_name as user_last_name',
                'users.email as user_email',
            ])
            ->latest('students.id')
            ->paginate(10)
            ->through(fn ($student) => [
                'id' => $student->id,
                'registration_number' => $student->registration_number,
                'current_module' => $student->current_module,
                'admission_date' => $student->admission_date,
                'student_status' => $student->student_status,
                'user' => [
                    'first_name' => $student->user_first_name,
                    'last_name' => $student->user_last_name,
                    'email' => $student->user_email,
                ],
            ])
            ->withQueryString();

        return inertia('students/Index', compact('students'));
    }

    // ----------------------------------------------------------------
    // CREATE
    // ----------------------------------------------------------------

    public function create()
    {
        return inertia('students/Create', [
            'courseVersions' => [],
            'coursesForVersion' => [],
            'courseCurricula' => [],
        ]);
    }

    // ----------------------------------------------------------------
    // STORE
    // ----------------------------------------------------------------

    public function store(StoreStudentRequest $request)
    {
        DB::transaction(function () use ($request) {

            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'other_name' => $request->other_name,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'county' => $request->county,
                'address' => $request->address,
                'religion' => $request->religion,
                'password' => bcrypt($request->phone_number),
                'is_pwd' => $request->boolean('is_pwd'),
                'is_active' => true,
                'disability_type' => $request->disability_type,
                'medical_condition' => $request->medical_condition,
            ]);

            $user->assignRole('student');
            RbacCache::forgetForUser($user);

            // Generate unique registration number (retry up to 5 times on collision)
            $registrationNumber = null;
            for ($i = 0; $i < 5; $i++) {
                $candidate = $this->generateRegistrationNumber();
                if (! Student::where('registration_number', $candidate)->exists()) {
                    $registrationNumber = $candidate;
                    break;
                }
            }

            throw_if(
                ! $registrationNumber,
                \RuntimeException::class,
                'Failed to generate a unique registration number.'
            );

            $student = Student::create([
                'user_id' => $user->id,
                'registration_number' => $registrationNumber,
                'previous_school' => $request->previous_school,
                'fee_discount_percentage' => $request->fee_discount_percentage ?? 0,
                'current_module' => $request->current_module ?? 1,
                'admission_date' => now(),
                'student_status' => 'active',
            ]);

            $user->update([
                'login_id' => $registrationNumber,
            ]);

            $courseEnrollment = new CourseEnrollment;
            $courseEnrollment->student_id = $student->id;
            $courseEnrollment->course_id = $request->course_id;
            $courseEnrollment->course_version_id = $request->course_version_id;
            $courseEnrollment->exam_body_id = $request->exam_body_id;
            $courseEnrollment->course_version_mapping_id = $request->course_curriculum_id;
            $courseEnrollment->enrollment_date = now()->toDateString();
            $courseEnrollment->intake_year = now()->year;
            $courseEnrollment->intake_period = $this->intakePeriod();
            $courseEnrollment->expected_completion_date = $this->expectedCompletionDate($request->course_id);
            $courseEnrollment->study_mode = $request->study_mode ?? 'fulltime';
            $courseEnrollment->status = 'active';
            $courseEnrollment->save();

            $user->nextOfKin()->create([
                'first_name' => $request->kin_first_name,
                'last_name' => $request->kin_last_name,
                'relationship' => $request->kin_relationship,
                'phone_number' => $request->kin_phone,
                'alternate_phone_number' => $request->kin_alt_phone,
                'email' => $request->kin_email,
            ]);
        });

        return redirect()->route('students.index')->with('success', 'Student created successfully.');
    }

    // ----------------------------------------------------------------
    // EDIT
    // ----------------------------------------------------------------

    public function edit(Student $student)
    {
        $student->load([
            'user.nextofkin',
            'courseEnrollment.course',
            'courseEnrollment.courseVersion',
            'courseEnrollment.examBody',
            'courseEnrollment.courseVersionMapping.course',
            'courseEnrollment.courseVersionMapping.courseVersion',
        ]);

        return inertia('students/Edit', [
            'student' => $student,
            'courseVersions' => $student->courseEnrollment?->exam_body_id
                ? $this->activeCourseVersionOptionsForExamBody($student->courseEnrollment->exam_body_id)
                : [],
            'coursesForVersion' => $student->courseEnrollment?->course_version_id
                ? $this->courseOptionsForCourseVersion($student->courseEnrollment->course_version_id)
                : [],
            'courseCurricula' => [],
        ]);
    }

    public function admissionLetter(Student $student): View
    {
        $student->loadMissing([
            'user',
            'courseEnrollment.courseVersionMapping.course.department',
            'courseEnrollment.courseVersionMapping.course.certificationLevel',
            'courseEnrollment.courseVersionMapping.courseVersion',
        ]);

        $mapping = $student->courseEnrollment?->courseVersionMapping;
        $course = $mapping?->course;
        $courseVersion = $mapping?->courseVersion;

        return view('students.admission-letter', [
            'student' => $student,
            'user' => $student->user,
            'program' => $course,
            'courseVersion' => $courseVersion,
            'department' => $course?->department,
            'certificationLevel' => $course?->certificationLevel,
        ]);
    }

    // ----------------------------------------------------------------
    // UPDATE
    // ----------------------------------------------------------------

    public function update(UpdateStudentRequest $request, Student $student)
    {
        DB::transaction(function () use ($request, $student) {
            $courseVersionMappingId =
                $request->course_curriculum_id
                ?? $student->courseEnrollment?->course_version_mapping_id;

            $student->user->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'other_name' => $request->other_name,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'county' => $request->county,
                'address' => $request->address,
                'religion' => $request->religion,
                'is_pwd' => $request->boolean('is_pwd'),
                'disability_type' => $request->disability_type,
                'medical_condition' => $request->medical_condition,
            ]);

            $student->update([
                'previous_school' => $request->previous_school,
                'fee_discount_percentage' => $request->fee_discount_percentage ?? 0,
                'current_module' => $request->current_module,
                'admission_date' => $request->admission_date,
                'student_status' => $request->student_status,
            ]);

            $student->user->update([
                'login_id' => $student->registration_number,
            ]);

            $courseEnrollment = $student->courseEnrollment()->firstOrNew([
                'student_id' => $student->id,
            ]);
            if (! $courseEnrollment->exists && $courseVersionMappingId) {
                $mapping = CourseVersionMapping::query()
                    ->with('course.certificationLevel:id,exam_body_id')
                    ->find($courseVersionMappingId);

                $courseEnrollment->course_id = $request->course_id ?? $mapping?->course_id;
                $courseEnrollment->course_version_id = $request->course_version_id ?? $mapping?->course_version_id;
                $courseEnrollment->exam_body_id = $request->exam_body_id ?? $mapping?->course?->certificationLevel?->exam_body_id;
                $courseEnrollment->course_version_mapping_id =
                    $courseVersionMappingId;
                $courseEnrollment->enrollment_date = now()->toDateString();
                $courseEnrollment->intake_year = now()->year;
                $courseEnrollment->intake_period = $this->intakePeriod();
                $courseEnrollment->expected_completion_date = $this->expectedCompletionDate($courseEnrollment->course_id);
                $courseEnrollment->study_mode = $request->study_mode ?? 'fulltime';
                $courseEnrollment->status = 'active';
                $courseEnrollment->save();
            }

            $student->user->nextOfKin()->updateOrCreate(
                ['user_id' => $student->user_id],
                [
                    'first_name' => $request->kin_first_name,
                    'last_name' => $request->kin_last_name,
                    'relationship' => $request->kin_relationship,
                    'phone_number' => $request->kin_phone,
                    'alternate_phone_number' => $request->kin_alt_phone,
                    'email' => $request->kin_email,
                ]
            );
        });

        return redirect()->route('students.index')->with('success', 'Student updated successfully.');
    }

    // ----------------------------------------------------------------
    // DESTROY
    // ----------------------------------------------------------------

    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()->route('students.index')->with('success', 'Student deleted successfully.');
    }

    /**
     * Search for students.
     */
    public function search(Request $request)
    {
        $q = trim((string) $request->get('q'));

        return Student::query()
            ->join('users', function ($join) {
                $join->on('users.id', '=', 'students.user_id')
                    ->whereNull('users.deleted_at');
            })
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($builder) use ($q) {
                    $builder->where('students.registration_number', 'like', "%{$q}%")
                        ->orWhere('users.first_name', 'like', "%{$q}%")
                        ->orWhere('users.last_name', 'like', "%{$q}%")
                        ->orWhere('users.email', 'like', "%{$q}%");
                });
            })
            ->select([
                'students.id',
                'students.registration_number',
                'users.first_name',
                'users.last_name',
            ])
            ->orderBy('users.first_name')
            ->orderBy('users.last_name')
            ->limit(10)
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'name' => trim(($s->first_name ?? '').' '.($s->last_name ?? '')).' ('.($s->registration_number ?? 'N/A').')',
            ]);
    }

    public function cycleCourses(CourseVersion $courseVersion): JsonResponse
    {
        return response()->json($this->courseOptionsForCourseVersion($courseVersion->id));
    }

    public function examBodyCourseVersions(ExamBody $examBody): JsonResponse
    {
        return response()->json($this->activeCourseVersionOptionsForExamBody($examBody->id));
    }

    public function courseCurricula(Course $course): JsonResponse
    {
        return response()->json($this->curriculumOptionsForCourse($course->id));
    }

    private function courseVersionOptions()
    {
        return CourseVersion::query()
            ->whereHas('courseVersionMappings')
            ->orderByDesc('id')
            ->get(['id', 'name'])
            ->map(fn (CourseVersion $courseVersion) => [
                'id' => $courseVersion->id,
                'name' => $courseVersion->name,
            ])
            ->values();
    }

    private function courseOptionsForCourseVersion(?int $courseVersionId)
    {
        if (! $courseVersionId) {
            return collect();
        }

        return CourseVersionMapping::query()
            ->with([
                'course:id,name,code,certification_level_id',
                'course.certificationLevel:id,name,exam_body_id',
                'course.certificationLevel.examBody:id,code,name',
            ])
            ->active()
            ->where('course_version_id', $courseVersionId)
            ->orderByDesc('id')
            ->get(['id', 'course_id', 'course_version_id'])
            ->map(function (CourseVersionMapping $mapping) {
                $course = $mapping->course;
                $level = $course?->certificationLevel;
                $examBody = $level?->examBody;

                return [
                    'id' => $mapping->id,
                    'course_id' => $mapping->course_id,
                    'course_version_id' => $mapping->course_version_id,
                    'course_version_mapping_id' => $mapping->id,
                    'name' => collect([
                        $course?->display_name ?? $course?->name ?? 'Course',
                        $examBody?->code,
                        $level?->name,
                    ])->filter()->implode(' - '),
                ];
            })
            ->values();
    }

    private function curriculumOptionsForCourse(?int $courseId)
    {
        if (! $courseId) {
            return collect();
        }

        $course = Course::query()
            ->with('certificationLevel:id,exam_body_id')
            ->find($courseId);

        if (! $course) {
            return collect();
        }

        $examBodyId = $course->certificationLevel?->exam_body_id;

        return CourseVersion::query()
            ->with([
                'activeCourseVersionMapping' => fn ($query) => $query
                    ->where('course_id', $course->id)
                    ->select('id', 'course_id', 'course_version_id'),
            ])
            ->where('is_active', true)
            ->whereDate('start_date', '<=', Carbon::today())
            ->when($examBodyId, fn ($query) => $query->where('exam_body_id', $examBodyId))
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', Carbon::today());
            })
            ->whereHas('activeCourseVersionMapping', fn ($query) => $query->where('course_id', $course->id))
            ->orderByDesc('id')
            ->get(['id', 'course_id', 'exam_body_id', 'name'])
            ->map(function (CourseVersion $courseVersion) {
                return [
                    'id' => $courseVersion->id,
                    'course_id' => $courseVersion->course_id,
                    'exam_body_id' => $courseVersion->exam_body_id,
                    'course_version_mapping_id' => $courseVersion->activeCourseVersionMapping?->id,
                    'name' => $courseVersion->name,
                ];
            })
            ->values();
    }

    private function activeCourseVersionOptionsForExamBody(?int $examBodyId)
    {
        if (! $examBodyId) {
            return collect();
        }

        return CourseVersion::query()
            ->where('exam_body_id', $examBodyId)
            ->where('is_active', true)
            ->whereDate('start_date', '<=', Carbon::today())
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', Carbon::today());
            })
            ->orderBy('name')
            ->get(['id', 'exam_body_id', 'name'])
            ->map(fn (CourseVersion $courseVersion) => [
                'id' => $courseVersion->id,
                'exam_body_id' => $courseVersion->exam_body_id,
                'name' => $courseVersion->name,
            ])
            ->values();
    }

    private function intakePeriod(): string
    {
        $month = (int) now()->format('n');

        return match (true) {
            $month <= 4 => 'Jan',
            $month <= 8 => 'May',
            default => 'Sep',
        };
    }

    private function expectedCompletionDate(?int $courseId): ?string
    {
        if (! $courseId) {
            return null;
        }

        $durationInMonths = Course::query()->whereKey($courseId)->value('duration_in_months');

        if (! $durationInMonths) {
            return null;
        }

        return now()->addMonthsNoOverflow((int) $durationInMonths)->toDateString();
    }
}
