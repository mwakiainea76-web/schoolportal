<?php

namespace App\Http\Controllers;

use App\Filters\StudentFilter;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\CourseEnrollment;
use App\Models\Course;
use App\Models\ExamBody;
use App\Models\Curriculum;
use App\Models\CurriculumMapping;
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
                'curriculum_id' => $request->filled('_student_id')
                    ? ['nullable', 'exists:curricula,id']
                    : ['required', 'exists:curricula,id'],
                'curriculum_mapping_id' => $request->filled('_student_id')
                    ? ['nullable', 'exists:curriculum_mappings,id']
                    : ['required', 'exists:curriculum_mappings,id'],
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
            'curriculums' => [],
            'coursesForVersion' => [],
            'curriculumMappings' => [],
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
            $courseEnrollment->curriculum_id = $request->curriculum_id;
            $courseEnrollment->exam_body_id = $request->exam_body_id;
            $courseEnrollment->curriculum_mapping_id = $request->curriculum_mapping_id;
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
            'courseEnrollment.curriculum',
            'courseEnrollment.examBody',
            'courseEnrollment.curriculumMapping.course',
            'courseEnrollment.curriculumMapping.curriculum',
        ]);

        return inertia('students/Edit', [
            'student' => $student,
            'curriculums' => $student->courseEnrollment?->exam_body_id
                ? $this->activeCurriculumOptionsForExamBody($student->courseEnrollment->exam_body_id)
                : [],
            'coursesForVersion' => $student->courseEnrollment?->curriculum_id
                ? $this->courseOptionsForCurriculum($student->courseEnrollment->curriculum_id)
                : [],
            'curriculumMappings' => [],
        ]);
    }

    public function admissionLetter(Student $student): View
    {
        $student->loadMissing([
            'user',
            'courseEnrollment.curriculumMapping.course.department',
            'courseEnrollment.curriculumMapping.course.certificationLevel',
            'courseEnrollment.curriculumMapping.curriculum',
        ]);

        $mapping = $student->courseEnrollment?->curriculumMapping;
        $course = $mapping?->course;
        $curriculum = $mapping?->curriculum;

        return view('students.admission-letter', [
            'student' => $student,
            'user' => $student->user,
            'program' => $course,
            'curriculum' => $curriculum,
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
            $curriculumMappingId =
                $request->curriculum_mapping_id
                ?? $student->courseEnrollment?->curriculum_mapping_id;

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
            if (! $courseEnrollment->exists && $curriculumMappingId) {
                $mapping = CurriculumMapping::query()
                    ->with('course.certificationLevel:id,exam_body_id')
                    ->find($curriculumMappingId);

                $courseEnrollment->course_id = $request->course_id ?? $mapping?->course_id;
                $courseEnrollment->curriculum_id = $request->curriculum_id ?? $mapping?->curriculum_id;
                $courseEnrollment->exam_body_id = $request->exam_body_id ?? $mapping?->course?->certificationLevel?->exam_body_id;
                $courseEnrollment->curriculum_mapping_id =
                    $curriculumMappingId;
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

    public function cycleCourses(Curriculum $curriculum): JsonResponse
    {
        return response()->json($this->courseOptionsForCurriculum($curriculum->id));
    }

    public function examBodyCurriculums(ExamBody $examBody): JsonResponse
    {
        return response()->json($this->activeCurriculumOptionsForExamBody($examBody->id));
    }

    public function curriculumMappings(Course $course): JsonResponse
    {
        return response()->json($this->curriculumOptionsForCourse($course->id));
    }

    private function curriculumOptions()
    {
        return Curriculum::query()
            ->whereHas('curriculumMappings')
            ->orderByDesc('id')
            ->get(['id', 'name'])
            ->map(fn (Curriculum $curriculum) => [
                'id' => $curriculum->id,
                'name' => $curriculum->name,
            ])
            ->values();
    }

    private function courseOptionsForCurriculum(?int $curriculumId)
    {
        if (! $curriculumId) {
            return collect();
        }

        return CurriculumMapping::query()
            ->with([
                'course:id,name,code,certification_level_id',
                'course.certificationLevel:id,name,exam_body_id',
                'course.certificationLevel.examBody:id,code,name',
            ])
            ->active()
            ->where('curriculum_id', $curriculumId)
            ->orderByDesc('id')
            ->get(['id', 'course_id', 'curriculum_id'])
            ->map(function (CurriculumMapping $mapping) {
                $course = $mapping->course;
                $level = $course?->certificationLevel;
                $examBody = $level?->examBody;

                return [
                    'id' => $mapping->id,
                    'course_id' => $mapping->course_id,
                    'curriculum_id' => $mapping->curriculum_id,
                    'curriculum_mapping_id' => $mapping->id,
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

        return Curriculum::query()
            ->with([
                'activeCurriculumMapping' => fn ($query) => $query
                    ->where('course_id', $course->id)
                    ->select('id', 'course_id', 'curriculum_id'),
            ])
            ->where('is_active', true)
            ->whereDate('start_date', '<=', Carbon::today())
            ->when($examBodyId, fn ($query) => $query->where('exam_body_id', $examBodyId))
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', Carbon::today());
            })
            ->whereHas('activeCurriculumMapping', fn ($query) => $query->where('course_id', $course->id))
            ->orderByDesc('id')
            ->get(['id', 'course_id', 'exam_body_id', 'name'])
            ->map(function (Curriculum $curriculum) {
                return [
                    'id' => $curriculum->id,
                    'course_id' => $curriculum->course_id,
                    'exam_body_id' => $curriculum->exam_body_id,
                    'curriculum_mapping_id' => $curriculum->activeCurriculumMapping?->id,
                    'name' => $curriculum->name,
                ];
            })
            ->values();
    }

    private function activeCurriculumOptionsForExamBody(?int $examBodyId)
    {
        if (! $examBodyId) {
            return collect();
        }

        return Curriculum::query()
            ->where('exam_body_id', $examBodyId)
            ->where('is_active', true)
            ->whereDate('start_date', '<=', Carbon::today())
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', Carbon::today());
            })
            ->orderBy('name')
            ->get(['id', 'exam_body_id', 'name'])
            ->map(fn (Curriculum $curriculum) => [
                'id' => $curriculum->id,
                'exam_body_id' => $curriculum->exam_body_id,
                'name' => $curriculum->name,
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
