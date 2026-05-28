<?php

namespace App\Http\Controllers;

use App\Models\ProgramVersionUnit;
use App\Models\Student;
use App\Models\StudentMark;
use App\Models\StudentUnitRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StudentMarkController extends Controller
{
    public function index(Request $request): Response
    {
        $unitCode = trim($request->string('program_version_unit_code')->toString());
        $selectedAssessmentType = $request->string('assessment_type')->toString() ?: 'theory';
        $selectedAssessmentNumber = max(1, $request->integer('assessment_number') ?: 1);
        $selectedUnit = $this->resolveProgramVersionUnitByCode($unitCode);
        $submittedMarks = $selectedUnit
            ? $this->submittedMarksForAssessment(
                $selectedUnit->id,
                $selectedAssessmentType,
                $selectedAssessmentNumber
            )
            : collect();

        return Inertia::render('Grades/Index', [
            'filters' => [
                'program_version_unit_code' => $unitCode,
                'assessment_type' => $selectedAssessmentType,
                'assessment_number' => (string) $selectedAssessmentNumber,
            ],
            'selected_unit' => $selectedUnit ? [
                'id' => $selectedUnit->id,
                'code' => $selectedUnit->unit?->code,
                'name' => $selectedUnit->unit?->name,
                'module' => $selectedUnit->module_taught,
                'program' => $selectedUnit->programVersionMapping?->program?->name,
                'version' => $selectedUnit->programVersionMapping?->programVersion?->name,
            ] : null,
            'submitted_marks' => $submittedMarks,
            'blocker' => $unitCode !== '' && ! $selectedUnit
                ? 'No program version unit was found for the entered code.'
                : null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_version_unit_code' => ['required', 'string'],
            'assessment_type' => ['required', 'in:theory,practical'],
            'assessment_number' => ['required', 'integer', 'min:1'],
            'entries' => ['required', 'array', 'min:1'],
            'entries.*.registration_number' => ['required', 'string', 'distinct'],
            'entries.*.marks' => ['required', 'integer', 'min:0', 'max:100'],
        ]);

        $unitCode = trim($validated['program_version_unit_code']);
        $programVersionUnit = $this->resolveProgramVersionUnitByCode($unitCode);

        if (! $programVersionUnit) {
            throw ValidationException::withMessages([
                'program_version_unit_code' => 'No program version unit was found for the entered code.',
            ]);
        }

        $entries = collect($validated['entries'])
            ->map(fn (array $entry) => [
                'registration_number' => trim($entry['registration_number']),
                'marks' => (int) $entry['marks'],
            ])
            ->filter(fn (array $entry) => $entry['registration_number'] !== '')
            ->values();

        $students = Student::query()
            ->whereIn('registration_number', $entries->pluck('registration_number')->all())
            ->get()
            ->keyBy('registration_number');

        $missingStudents = $entries
            ->pluck('registration_number')
            ->reject(fn (string $registrationNumber) => $students->has($registrationNumber))
            ->values();

        if ($missingStudents->isNotEmpty()) {
            return back()->withErrors([
                'entries' => 'Unknown registration number(s): '.$missingStudents->implode(', '),
            ]);
        }

        $unitRegistrations = StudentUnitRegistration::query()
            ->with('academicSessionEnrollment.programEnrollment.student')
            ->where('program_version_unit_id', $programVersionUnit->id)
            ->get();

        $eligibleByStudentId = $unitRegistrations
            ->filter(fn (StudentUnitRegistration $registration) => $registration->academicSessionEnrollment?->programEnrollment?->student_id)
            ->groupBy(fn (StudentUnitRegistration $registration) => $registration->academicSessionEnrollment->programEnrollment->student_id)
            ->map(fn ($registrations) => $registrations
                ->sortByDesc(fn (StudentUnitRegistration $registration) => $registration->academicSessionEnrollment?->academic_session_id ?? 0)
                ->sortByDesc(fn (StudentUnitRegistration $registration) => $registration->academicSessionEnrollment?->id ?? 0)
                ->first());

        $invalidRegistrations = $entries->filter(function (array $entry) use ($students, $eligibleByStudentId) {
            $student = $students->get($entry['registration_number']);

            return ! $student || ! $eligibleByStudentId->has($student->id);
        })->pluck('registration_number')->values();

        if ($invalidRegistrations->isNotEmpty()) {
            return back()->withErrors([
                'entries' => 'Marks can only be awarded after unit registration. Invalid registration number(s): '.$invalidRegistrations->implode(', '),
            ]);
        }

        $staffId = $request->user()?->staff?->id;

        DB::transaction(function () use ($validated, $entries, $students, $eligibleByStudentId, $programVersionUnit, $staffId) {
            foreach ($entries as $entry) {
                $student = $students->get($entry['registration_number']);
                $unitRegistration = $eligibleByStudentId->get($student->id);
                $sessionEnrollment = $unitRegistration->academicSessionEnrollment;

                $mark = StudentMark::firstOrNew([
                    'student_id' => $student->id,
                    'program_version_unit_id' => $programVersionUnit->id,
                    'assessment_type' => $validated['assessment_type'],
                    'assessment_number' => $validated['assessment_number'],
                ]);

                $mark->academic_session_id = $sessionEnrollment->academic_session_id;
                $mark->academic_session_enrollment_id = $sessionEnrollment->id;
                $mark->marks = $entry['marks'];
                $mark->recorded_by_staff_id = $staffId;
                $mark->is_published = false;
                $mark->save();
            }
        });

        return to_route('academic.marks.index', [
            'program_version_unit_code' => $unitCode,
            'assessment_type' => $validated['assessment_type'],
            'assessment_number' => $validated['assessment_number'],
        ])->with('success', 'Marks saved as unpublished successfully.');
    }

    public function publishIndex(Request $request): Response
    {
        $this->ensureHod($request);

        $unitCode = trim($request->string('program_version_unit_code')->toString());
        $selectedAssessmentType = $request->string('assessment_type')->toString() ?: 'theory';
        $selectedAssessmentNumber = max(1, $request->integer('assessment_number') ?: 1);
        $selectedUnit = $this->resolveProgramVersionUnitByCode($unitCode);
        $submittedMarks = $selectedUnit
            ? $this->submittedMarksForAssessment(
                $selectedUnit->id,
                $selectedAssessmentType,
                $selectedAssessmentNumber
            )
            : collect();

        return Inertia::render('Grades/Publish', [
            'filters' => [
                'program_version_unit_code' => $unitCode,
                'assessment_type' => $selectedAssessmentType,
                'assessment_number' => (string) $selectedAssessmentNumber,
            ],
            'selected_unit' => $selectedUnit ? [
                'id' => $selectedUnit->id,
                'code' => $selectedUnit->unit?->code,
                'name' => $selectedUnit->unit?->name,
                'module' => $selectedUnit->module_taught,
                'program' => $selectedUnit->programVersionMapping?->program?->name,
                'version' => $selectedUnit->programVersionMapping?->programVersion?->name,
            ] : null,
            'submitted_marks' => $submittedMarks,
            'blocker' => $unitCode !== '' && ! $selectedUnit
                ? 'No program version unit was found for the entered code.'
                : null,
        ]);
    }

    public function studentResultsIndex(Request $request): Response
    {
        $validated = $request->validate([
            'module' => ['nullable', 'integer', 'min:1'],
            'year_of_study' => ['nullable', 'integer', 'min:1'],
        ]);

        $student = $request->user()?->student?->loadMissing('user');
        $selectedModule = isset($validated['module']) ? (int) $validated['module'] : null;
        $selectedYearOfStudy = isset($validated['year_of_study']) ? (int) $validated['year_of_study'] : null;

        $publishedMarks = $student
            ? StudentMark::query()
                ->with([
                    'academicSession:id,academic_year_id,session_No,session_number,label',
                    'academicSession.academicYear:id,label,academic_year',
                    'academicSessionEnrollment:id,year_of_study,module',
                    'programVersionUnit:id,program_version_mapping_id,unit_id,module_taught',
                    'programVersionUnit.unit:id,code,name',
                ])
                ->where('student_id', $student->id)
                ->where('is_published', true)
                ->orderByDesc('academic_session_id')
                ->orderBy('program_version_unit_id')
                ->orderBy('assessment_type')
                ->orderBy('assessment_number')
                ->get()
            : collect();

        $availableModules = $publishedMarks
            ->pluck('programVersionUnit.module_taught')
            ->filter()
            ->map(fn ($module) => (int) $module)
            ->unique()
            ->sort()
            ->values();

        $availableYears = $publishedMarks
            ->pluck('academicSessionEnrollment.year_of_study')
            ->filter()
            ->map(fn ($year) => (int) $year)
            ->unique()
            ->sort()
            ->values();

$filteredMarks = $publishedMarks
             ->when($selectedModule, fn (Collection $marks) => $marks->filter(
                 fn (StudentMark $mark) => (int) $mark->programVersionUnit?->module_taught === $selectedModule
             ))
             ->when($selectedYearOfStudy, fn (Collection $marks) => $marks->filter(
                 fn (StudentMark $mark) => (int) $mark->academicSessionEnrollment?->year_of_study === $selectedYearOfStudy
             ))
             ->values();

         $results = $filteredMarks
             ->groupBy(fn (StudentMark $mark) => implode('|', [
                 $mark->academic_session_id,
                 $mark->academic_session_enrollment_id,
                 $mark->program_version_unit_id,
             ]))
             ->flatMap(function (Collection $marks) {
                 $firstMark = $marks->first();
                 
                 // Get all individual assessments instead of averaging
                 return $marks->map(function (StudentMark $mark) use ($firstMark) {
                     return [
                         'id' => $mark->id,
                         'session' => $firstMark->academicSession?->display_name
                             ?? $firstMark->academicSession?->label
                             ?? 'Session not available',
                         'year_of_study' => $firstMark->academicSessionEnrollment?->year_of_study,
                         'module' => $firstMark->programVersionUnit?->module_taught,
                         'unit_code' => $firstMark->programVersionUnit?->unit?->code,
                         'unit_name' => $firstMark->programVersionUnit?->unit?->name,
                         'mark_type' => $mark->assessment_type,
                         'assessment_number' => $mark->assessment_number,
                         'marks' => $mark->marks,
                         'theory_marks' => $mark->assessment_type === 'theory' ? $mark->marks : null,
                         'practical_marks' => $mark->assessment_type === 'practical' ? $mark->marks : null,
                     ];
                 });
             })
             ->values();

        return Inertia::render('Grades/StudentResults', [
            'filters' => [
                'module' => $selectedModule ? (string) $selectedModule : '',
                'year_of_study' => $selectedYearOfStudy ? (string) $selectedYearOfStudy : '',
            ],
            'filter_options' => [
                'modules' => $availableModules->map(fn (int $module) => [
                    'value' => (string) $module,
                    'label' => 'Module '.$module,
                ])->values(),
                'years_of_study' => $availableYears->map(fn (int $year) => [
                    'value' => (string) $year,
                    'label' => 'Year '.$year,
                ])->values(),
            ],
            'student' => $student ? [
                'name' => trim(($student->user?->first_name ?? '').' '.($student->user?->last_name ?? '')),
                'registration_number' => $student->registration_number,
            ] : null,
            'summary' => [
                'published_count' => $publishedMarks->count(),
                'filtered_count' => $filteredMarks->count(),
            ],
'results' => $results,
        ]);
    }

    public function publishAssessment(Request $request)
    {
        $this->ensureHod($request);

        $validated = $request->validate([
            'program_version_unit_code' => ['required', 'string'],
            'assessment_type' => ['required', 'in:theory,practical'],
            'assessment_number' => ['required', 'integer', 'min:1'],
            'action' => ['required', 'in:publish,unpublish'],
        ]);

        $programVersionUnit = $this->resolveProgramVersionUnitByCode(trim($validated['program_version_unit_code']));

        if (! $programVersionUnit) {
            throw ValidationException::withMessages([
                'program_version_unit_code' => 'No program version unit was found for the entered code.',
            ]);
        }

        $updated = StudentMark::query()
            ->where('program_version_unit_id', $programVersionUnit->id)
            ->where('assessment_type', $validated['assessment_type'])
            ->where('assessment_number', $validated['assessment_number'])
            ->update([
                'is_published' => $validated['action'] === 'publish',
                'updated_at' => now(),
            ]);

        return to_route('academic.marks.publish.index', [
            'program_version_unit_code' => $validated['program_version_unit_code'],
            'assessment_type' => $validated['assessment_type'],
            'assessment_number' => $validated['assessment_number'],
        ])->with(
            'success',
            $updated
                ? ($validated['action'] === 'publish'
                    ? 'Assessment marks published successfully.'
                    : 'Assessment marks unpublished successfully.')
                : 'No marks were found for that assessment.'
        );
    }

    public function togglePublish(Request $request, StudentMark $studentMark)
    {
        $this->ensureHod($request);

        $validated = $request->validate([
            'action' => ['required', 'in:publish,unpublish'],
        ]);

        $studentMark->update([
            'is_published' => $validated['action'] === 'publish',
        ]);

        return back()->with(
            'success',
            $validated['action'] === 'publish'
                ? 'Student mark published successfully.'
                : 'Student mark unpublished successfully.'
        );
    }

    protected function resolveProgramVersionUnitByCode(string $unitCode): ?ProgramVersionUnit
    {
        if ($unitCode === '') {
            return null;
        }

        return ProgramVersionUnit::query()
            ->with([
                'unit:id,code,name',
                'programVersionMapping.program:id,name',
                'programVersionMapping.programVersion:id,name',
            ])
            ->whereHas('unit', fn ($query) => $query->where('code', $unitCode))
            ->orderBy('id')
            ->first();
    }

    protected function submittedMarksForAssessment(
        int $programVersionUnitId,
        string $assessmentType,
        int $assessmentNumber
    ) {
        return StudentMark::query()
            ->with([
                'student.user',
                'programVersionUnit.unit',
                'academicSession.academicYear',
                'academicSessionEnrollment',
            ])
            ->where('program_version_unit_id', $programVersionUnitId)
            ->where('assessment_type', $assessmentType)
            ->where('assessment_number', $assessmentNumber)
            ->orderBy('student_id')
            ->get()
            ->map(fn (StudentMark $mark) => [
                'id' => $mark->id,
                'registration_number' => $mark->student?->registration_number,
                'student_name' => trim(($mark->student?->user?->first_name ?? '').' '.($mark->student?->user?->last_name ?? '')),
                'unit_name' => $mark->programVersionUnit?->unit?->name,
                'marks' => (int) $mark->marks,
                'is_published' => (bool) $mark->is_published,
                'module' => $mark->programVersionUnit?->module_taught,
                'session' => $mark->academicSession?->display_name ?? $mark->academicSession?->label ?? 'Session',
                'academic_year' => $mark->academicSession?->academicYear?->academic_year,
                'assessment_type' => $mark->assessment_type,
                'assessment_number' => $mark->assessment_number,
            ])
            ->values();
    }

    protected function ensureHod(Request $request): void
    {
        $user = $request->user();

        abort_unless($user?->hasRole('hod') || $user?->hasRole('admin'), 403);
    }
}
