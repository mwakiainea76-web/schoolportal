<?php

namespace App\Http\Controllers;

use App\Filters\StudentFilter;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Course;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    // ----------------------------------------------------------------
    // STEP VALIDATION (shared by create & edit)
    // ----------------------------------------------------------------

    public function validateStep(Request $request): \Illuminate\Http\JsonResponse
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
                'course_id' => ['required', 'exists:courses,id'],
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
                Student::query()->with(['user']),
                $request->all()
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('students/Index', compact('students'));
    }

    // ----------------------------------------------------------------
    // CREATE
    // ----------------------------------------------------------------

    public function create()
    {
        $courses = Course::query()
            ->active()
            ->with('certificationLevel:id,name')
            ->orderBy('name')
            ->get(['id', 'code', 'name', 'certification_level_id'])
            ->map(fn ($course) => [
                'id' => $course->id,
                'name' => $course->display_name,
            ]);

        return inertia('students/Create', compact('courses'));
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

            Student::create([
                'user_id' => $user->id,
                'registration_number' => $registrationNumber,
                'previous_school' => $request->previous_school,
                'fee_discount_percentage' => $request->fee_discount_percentage ?? 0,
                'current_module' => $request->current_module ?? 1,
                'admission_date' => now(),
                'student_status' => 'active',
            ]);

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
        $student->load(['user.nextofkin']);

        return inertia('Students/Edit', compact('student'));
    }

    // ----------------------------------------------------------------
    // UPDATE
    // ----------------------------------------------------------------

    public function update(UpdateStudentRequest $request, Student $student)
    {
        DB::transaction(function () use ($request, $student) {

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
        //
    }
}
