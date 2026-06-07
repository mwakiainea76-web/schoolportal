<?php

namespace App\Http\Controllers;

use App\Filters\StudentFilter;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\Curriculum;
use App\Models\CurriculumMapping;
use App\Models\ExamBody;
use App\Models\Student;
use App\Models\User;
use App\Support\RbacCache;
use Carbon\Carbon;
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

        $studentId = $request->input('_student_id');
        $ignoreStudentId = Student::find($studentId)?->id;

        $rules = match ($step) {
            1 => [
                'first_name' => ['required', 'string', 'max:255'],
                'last_name' => ['required', 'string', 'max:255'],
                'other_name' => ['nullable', 'string', 'max:255'],
                'email' => [
                    'required', 'email', 'max:255',
                    $ignoreStudentId
                        ? Rule::unique('students', 'email')->ignore($ignoreStudentId)
                        : Rule::unique('students', 'email'),
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
    // ADMISSION NUMBER GENERATION
    // ----------------------------------------------------------------

    private function generateAdmissionNumber(): string
    {
        $year = now()->year;
        $month = now()->format('m');

        $last = Student::whereYear('created_at', $year)
            ->lockForUpdate()
            ->latest('id')
            ->value('admission_number');

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
            ->apply(Student::query(), $request->all())
            ->select([
                'students.id',
                'students.admission_number',
                'students.current_module',
                'students.created_at',
                'students.enrollment_status',
                'students.first_name',
                'students.last_name',
                'students.email',
            ])
            ->latest('students.id')
            ->paginate(10)
            ->through(fn ($student) => [
                'id' => $student->id,
                'admission_number' => $student->admission_number,
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'email' => $student->email,
                'current_module' => $student->current_module,
                'admission_date' => $student->created_at->toDateString(),
                'student_status' => $student->enrollment_status,
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
                'email' => $request->email,
                'password' => bcrypt($request->phone_number),
                'is_active' => true,
                'role' => 'student',
            ]);

            $user->assignRole('student');
            RbacCache::forgetForUser($user);

            // Generate unique admission number (retry up to 5 times on collision)
            $admissionNumber = null;
            for ($i = 0; $i < 5; $i++) {
                $candidate = $this->generateAdmissionNumber();
                if (! Student::where('admission_number', $candidate)->exists()) {
                    $admissionNumber = $candidate;
                    break;
                }
            }

            throw_if(
                ! $admissionNumber,
                \RuntimeException::class,
                'Failed to generate a unique admission number.'
            );

            $student = Student::create([
                'user_id' => $user->id,
                'department_id' => $request->department_id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'other_name' => $request->other_name,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'date_of_birth' => $request->date_of_birth,
                'county' => $request->county,
                'address' => $request->address,
                'gender' => $request->gender,
                'religion' => $request->religion,
                'is_pwd' => $request->boolean('is_pwd'),
                'disability_type' => $request->disability_type,
                'medical_condition' => $request->medical_condition,
                'admission_number' => $admissionNumber,
                'previous_school' => $request->previous_school,
                'fee_discount_percentage' => $request->fee_discount_percentage ?? 0,
                'current_module' => $request->current_module ?? 1,
                'enrollment_status' => 'active',
            ]);

            $user->update([
                'login_id' => $admissionNumber,
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

    // ----------------------------------------------------------------
    // ADMISSION LETTER
    // ----------------------------------------------------------------

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
                'email' => $request->email,
                'is_active' => $request->boolean('is_active'),
            ]);

            $student->update([
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
                'previous_school' => $request->previous_school,
                'fee_discount_percentage' => $request->fee_discount_percentage ?? 0,
                'current_module' => $request->current_module,
                'enrollment_status' => $request->student_status,
            ]);

            $student->user->update([
                'login_id' => $student->admission_number,
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
                $courseEnrollment->curriculum_mapping_id = $curriculumMappingId;
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

    // ----------------------------------------------------------------
    // SEARCH
    // ----------------------------------------------------------------

    public function search(Request $request)
    {
        $q = trim((string) $request->get('q'));

        return Student::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($builder) use ($q) {
                    $builder
                        ->where('admission_number', 'like', "%{$q}%")
                        ->orWhere('first_name', 'like', "%{$q}%")
                        ->orWhere('last_name', 'like', "%{$q}%")
                        ->orWhere('email', 'like', "%{$q}%");
                });
            })
            ->select(['id', 'admission_number', 'first_name', 'last_name'])
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->limit(10)
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'name' => trim("{$s->first_name} {$s->last_name}").' ('.($s->admission_number ?? 'N/A').')',
            ]);
    }

    // ----------------------------------------------------------------
    // AJAX HELPERS
    // ----------------------------------------------------------------

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

    // ----------------------------------------------------------------
    // PRIVATE HELPERS
    // ----------------------------------------------------------------

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
            ->map(fn (Curriculum $curriculum) => [
                'id' => $curriculum->id,
                'course_id' => $curriculum->course_id,
                'exam_body_id' => $curriculum->exam_body_id,
                'curriculum_mapping_id' => $curriculum->activeCurriculumMapping?->id,
                'name' => $curriculum->name,
            ])
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
