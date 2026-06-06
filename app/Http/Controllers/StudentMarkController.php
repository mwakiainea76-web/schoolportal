<?php

namespace App\Http\Controllers;

use App\Models\AcademicSession;
use App\Models\AcademicYear;
use App\Models\CurriculumMapping;
use App\Models\Student;
use App\Models\StudentMark;
use App\Models\StudentUnitRegistration;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StudentMarkController extends Controller
{
    public function index(Request $request)
    {
        return to_route('academic.marks.add.index', $request->query());
    }

    public function addIndex(Request $request): Response
    {
        [$mappingId, $unitId, $type, $number] = $this->parseSelectionFilters($request);
        $selectedUnit = $this->resolveSelectedUnit($mappingId, $unitId);

        return Inertia::render('Grades/Add', [
            'filters' => $this->selectionFiltersArray($mappingId, $unitId, $type, $number),
            'selected_unit' => $this->unitPayload($selectedUnit),
            'unit_options' => $this->unitOptions(null, $request),
            'blocker' => $this->selectedUnitBlocker($mappingId, $unitId, $selectedUnit),
            'can_publish' => $this->canPublishMarks($request),
        ]);
    }

    public function viewIndex(Request $request): Response
    {
        [$mappingId, $unitId, $type, $number, $module, $academicYearId] = $this->parseSelectionFilters($request, true);
        $selectedUnit = $this->resolveSelectedUnit($mappingId, $unitId);
        $submittedMarks = null;

        if ($selectedUnit && $request->boolean('search_marks')) {
            $submittedMarks = $this->fetchMarks(
                $selectedUnit->id,
                $type,
                $number,
                $module,
                $academicYearId,
                $request->integer('page', 1)
            );
        }

        return Inertia::render('Grades/View', [
            'filters' => $this->selectionFiltersArray($mappingId, $unitId, $type, $number, $module, $academicYearId),
            'selected_unit' => $this->unitPayload($selectedUnit),
            'submitted_marks' => $submittedMarks,
            'course_mappings' => $this->courseMappingOptions($request),
            'unit_options' => $this->unitOptions($mappingId, $request),
            'filter_options' => $selectedUnit
                ? $this->filterOptions($selectedUnit->id, $type, $number, $academicYearId)
                : ['modules' => [], 'academic_years' => []],
            'blocker' => $this->selectedUnitBlocker($mappingId, $unitId, $selectedUnit),
            'can_publish' => $this->canPublishMarks($request),
            'selected_filters' => [
                'academic_year' => $this->academicYearPayload($academicYearId),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'curriculum_unit_id' => ['required', 'integer'],
            'assessment_type' => ['required', 'in:theory,practical'],
            'assessment_number' => ['required', 'integer', 'min:1'],
            'student_identifier' => ['required', 'string'],
            'marks' => ['required', 'integer', 'min:0', 'max:100'],
        ]);

        $unitId = (int) $validated['curriculum_unit_id'];
        $unit = $this->resolveSelectedUnit(null, $unitId);

        if (! $unit) {
            throw ValidationException::withMessages([
                'curriculum_unit_id' => 'Select a valid unit before saving marks.',
            ]);
        }

        $entry = [
            'student_identifier' => trim((string) $validated['student_identifier']),
            'marks' => (int) $validated['marks'],
        ];

        $students = $this->resolveStudentsForIdentifiers([$entry['student_identifier']]);

        $unknown = collect([$entry['student_identifier']])
            ->reject(fn ($identifier) => $students->has($this->normalizeStudentIdentifier($identifier)))
            ->values();

        if ($unknown->isNotEmpty()) {
            return back()->withErrors([
                'student_identifier' => 'Unknown student ID or registration number: '.$unknown->implode(', '),
            ]);
        }

        $eligible = StudentUnitRegistration::query()
            ->select('student_unit_registrations.*')
            ->addSelect('course_enrollments.student_id')
            ->join('academic_session_enrollments', 'academic_session_enrollments.id', '=', 'student_unit_registrations.academic_session_enrollment_id')
            ->join('course_enrollments', 'course_enrollments.id', '=', 'academic_session_enrollments.course_enrollment_id')
            ->with('academicSessionEnrollment')
            ->where('curriculum_unit_id', $unit->id)
            ->whereIn('course_enrollments.student_id', $students->pluck('id')->unique()->all())
            ->orderByDesc('academic_session_enrollments.academic_session_id')
            ->orderByDesc('academic_session_enrollments.id')
            ->get()
            ->unique('student_id')
            ->keyBy('student_id');

        $student = $students->get($this->normalizeStudentIdentifier($entry['student_identifier']));
        $notRegistered = (! $student || ! $eligible->has($student->id))
            ? collect([$entry['student_identifier']])
            : collect();

        if ($notRegistered->isNotEmpty()) {
            return back()->withErrors([
                'student_identifier' => 'Marks can only be awarded after unit registration. Invalid: '.$notRegistered->implode(', '),
            ]);
        }

        $staffId = $request->user()?->staff?->id;

        DB::transaction(function () use ($validated, $entry, $students, $eligible, $unit, $staffId) {
            $student = $students->get($this->normalizeStudentIdentifier($entry['student_identifier']));
            $unitRegistration = $eligible->get($student->id);
            $session = $unitRegistration->academicSessionEnrollment;

            StudentMark::updateOrCreate(
                [
                    'student_id' => $student->id,
                    'curriculum_unit_id' => $unit->id,
                    'assessment_type' => $validated['assessment_type'],
                    'assessment_number' => $validated['assessment_number'],
                ],
                [
                    'academic_session_id' => $session->academic_session_id,
                    'academic_session_enrollment_id' => $session->id,
                    'marks' => $entry['marks'],
                    'recorded_by_staff_id' => $staffId,
                    'is_published' => false,
                ]
            );
        });

        return to_route('academic.marks.add.index', [
            'curriculum_unit_id' => $unitId,
            'assessment_type' => $validated['assessment_type'],
            'assessment_number' => $validated['assessment_number'],
        ])->with('success', 'Marks saved as unpublished successfully.');
    }

    public function publishIndex(Request $request): Response
    {
        $this->authorizeHod($request);

        [$mappingId, $unitId, $type, $number, $module, $academicYearId] = $this->parseSelectionFilters($request, true);
        $selectedUnit = $this->resolveSelectedUnit($mappingId, $unitId);
        $submittedMarks = null;

        if ($selectedUnit && $request->boolean('search_marks')) {
            $submittedMarks = $this->fetchPublishMarks(
                $selectedUnit->id,
                $type,
                $number,
                $module,
                $academicYearId,
                $request->integer('page', 1)
            );
        }

        return Inertia::render('Grades/Publish', [
            'filters' => $this->selectionFiltersArray($mappingId, $unitId, $type, $number, $module, $academicYearId),
            'selected_unit' => $this->unitPayload($selectedUnit),
            'submitted_marks' => $submittedMarks,
            'unit_options' => $this->unitOptions(null, $request),
            'filter_options' => $selectedUnit
                ? $this->publishFilterOptions($selectedUnit->id, $type, $number, $academicYearId)
                : ['modules' => [], 'academic_years' => []],
            'blocker' => $this->selectedUnitBlocker($mappingId, $unitId, $selectedUnit),
            'can_publish' => true,
            'selected_filters' => [
                'academic_year' => $this->academicYearPayload($academicYearId),
            ],
        ]);
    }

    public function publishAssessment(Request $request)
    {
        $this->authorizeHod($request);

        $validated = $request->validate([
            'curriculum_unit_id' => ['required', 'integer'],
            'assessment_type' => ['required', 'in:theory,practical'],
            'assessment_number' => ['required', 'integer', 'min:1'],
            'academic_year_id' => ['nullable', 'integer'],
            'module' => ['nullable', 'integer', 'min:1'],
            'action' => ['required', 'in:publish,unpublish'],
        ]);

        $unitId = (int) $validated['curriculum_unit_id'];
        $unit = $this->resolveSelectedUnit(null, $unitId);

        if (! $unit) {
            throw ValidationException::withMessages([
                'curriculum_unit_id' => 'Select a valid unit before publishing marks.',
            ]);
        }

        $academicYearId = isset($validated['academic_year_id']) ? (int) $validated['academic_year_id'] : null;
        $module = isset($validated['module']) ? (int) $validated['module'] : null;

        $query = StudentMark::query()
            ->where('curriculum_unit_id', $unit->id)
            ->where('assessment_type', $validated['assessment_type'])
            ->where('assessment_number', $validated['assessment_number']);

        $this->applyYearModuleFilters($query, $academicYearId, $module);

        $updated = $query->update([
            'is_published' => $validated['action'] === 'publish',
            'updated_at' => now(),
        ]);

        $message = match (true) {
            $updated === 0 => 'No marks were found for that assessment.',
            $validated['action'] === 'publish' => 'Assessment marks published successfully.',
            default => 'Assessment marks unpublished successfully.',
        };

        return to_route('academic.marks.publish.index', [
            'curriculum_unit_id' => $unitId,
            'assessment_type' => $validated['assessment_type'],
            'assessment_number' => $validated['assessment_number'],
            'academic_year_id' => $academicYearId,
            'module' => $module,
            'search_marks' => true,
        ])->with('success', $message);
    }

    public function togglePublish(Request $request, StudentMark $studentMark)
    {
        $this->authorizeHod($request);

        $validated = $request->validate(['action' => ['required', 'in:publish,unpublish']]);

        $studentMark->update(['is_published' => $validated['action'] === 'publish']);

        return back()->with(
            'success',
            $validated['action'] === 'publish'
                ? 'Student mark published successfully.'
                : 'Student mark unpublished successfully.'
        );
    }

    public function marksheetIndex(Request $request): Response
    {
        $validated = $request->validate([
            'curriculum_unit_code' => ['nullable', 'string'],
            'academic_session_id' => ['nullable', 'integer'],
            'year_of_study' => ['nullable', 'integer', 'min:1'],
            'registration_number' => ['nullable', 'string'],
        ]);

        $unitCode = trim((string) ($validated['curriculum_unit_code'] ?? ''));
        $academicSessionId = isset($validated['academic_session_id']) ? (int) $validated['academic_session_id'] : null;
        $yearOfStudy = isset($validated['year_of_study']) ? (int) $validated['year_of_study'] : null;
        $registrationNumber = trim((string) ($validated['registration_number'] ?? ''));
        $selectedUnit = $unitCode !== '' ? $this->resolveUnit($unitCode) : null;

        $availableYears = collect();
        $marksheetData = [
            'theory' => ['average' => 0, 'top_performers' => []],
            'practical' => ['average' => 0, 'top_performers' => []],
        ];

        if ($selectedUnit) {
            $availableYears = StudentMark::query()
                ->join('academic_session_enrollments as ase', 'ase.id', '=', 'student_marks.academic_session_enrollment_id')
                ->where('student_marks.curriculum_unit_id', $selectedUnit->id)
                ->distinct()
                ->orderBy('ase.year_of_study')
                ->pluck('ase.year_of_study')
                ->filter()
                ->map(fn ($year) => [
                    'value' => (string) (int) $year,
                    'label' => 'Year '.(int) $year,
                ])
                ->values();

            $marksheetData = [
                'theory' => $this->marksheetSection($selectedUnit->id, 'theory', $academicSessionId, $yearOfStudy, $registrationNumber),
                'practical' => $this->marksheetSection($selectedUnit->id, 'practical', $academicSessionId, $yearOfStudy, $registrationNumber),
            ];
        }

        return Inertia::render('Grades/Marksheet', [
            'filters' => [
                'curriculum_unit_code' => $unitCode,
                'academic_session_id' => $academicSessionId ? (string) $academicSessionId : '',
                'year_of_study' => $yearOfStudy ? (string) $yearOfStudy : '',
                'registration_number' => $registrationNumber,
            ],
            'selected_unit' => $selectedUnit ? [
                'code' => $selectedUnit->code,
                'name' => $selectedUnit->name,
            ] : null,
            'available_years' => $availableYears,
            'marksheet_data' => $marksheetData,
            'blocker' => $unitCode !== '' && ! $selectedUnit
                ? 'No curriculum unit was found for the entered code.'
                : null,
            'selected_filters' => [
                'academic_session' => $this->academicSessionPayload($academicSessionId),
            ],
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
        $selectedYear = isset($validated['year_of_study']) ? (int) $validated['year_of_study'] : null;

        if (! $student) {
            return Inertia::render('Grades/StudentResults', [
                'filters' => ['module' => '', 'year_of_study' => ''],
                'filter_options' => ['modules' => [], 'years_of_study' => []],
                'student' => null,
                'summary' => ['published_count' => 0, 'filtered_count' => 0],
                'results' => null,
            ]);
        }

        $baseMarks = StudentMark::query()
            ->where('student_id', $student->id)
            ->where('is_published', true);

        $availableModules = (clone $baseMarks)
            ->join('units', 'student_marks.curriculum_unit_id', '=', 'units.id')
            ->distinct()
            ->orderBy('units.module_taught')
            ->pluck('units.module_taught')
            ->filter()
            ->map(fn ($module) => (int) $module)
            ->values();

        $availableYears = (clone $baseMarks)
            ->join('academic_session_enrollments', 'student_marks.academic_session_enrollment_id', '=', 'academic_session_enrollments.id')
            ->distinct()
            ->orderBy('academic_session_enrollments.year_of_study')
            ->pluck('academic_session_enrollments.year_of_study')
            ->filter()
            ->map(fn ($year) => (int) $year)
            ->values();

        $publishedCount = (clone $baseMarks)->count();

        $filteredQuery = (clone $baseMarks)
            ->with([
                'academicSessionEnrollment:id,year_of_study',
                'curriculumUnit:id,module_taught,code,name',
            ])
            ->orderByDesc('academic_session_id')
            ->orderBy('curriculum_unit_id')
            ->orderBy('assessment_type')
            ->orderBy('assessment_number');

        if ($selectedModule) {
            $filteredQuery->whereHas('curriculumUnit', fn ($query) => $query->where('module_taught', $selectedModule));
        }

        if ($selectedYear) {
            $filteredQuery->whereHas('academicSessionEnrollment', fn ($query) => $query->where('year_of_study', $selectedYear));
        }

        $paginator = $filteredQuery
            ->paginate(30, ['*'], 'page', $request->integer('page', 1))
            ->withQueryString();

        $paginator->setCollection(
            $paginator->getCollection()->map(fn (StudentMark $mark) => [
                'unit_code' => $mark->curriculumUnit?->code,
                'unit_name' => $mark->curriculumUnit?->name,
                'module' => $mark->curriculumUnit?->module_taught,
                'year_of_study' => $mark->academicSessionEnrollment?->year_of_study,
                'mark_type' => $mark->assessment_type,
                'marks' => $mark->marks,
            ])
        );

        return Inertia::render('Grades/StudentResults', [
            'filters' => [
                'module' => $selectedModule ? (string) $selectedModule : '',
                'year_of_study' => $selectedYear ? (string) $selectedYear : '',
            ],
            'filter_options' => [
                'modules' => $availableModules->map(fn ($module) => [
                    'value' => (string) $module,
                    'label' => "Module $module",
                ])->values(),
                'years_of_study' => $availableYears->map(fn ($year) => [
                    'value' => (string) $year,
                    'label' => "Year $year",
                ])->values(),
            ],
            'student' => [
                'name' => trim(($student->user?->first_name ?? '').' '.($student->user?->last_name ?? '')),
                'registration_number' => $student->registration_number,
            ],
            'summary' => [
                'published_count' => $publishedCount,
                'filtered_count' => $paginator->total(),
            ],
            'results' => [
                'data' => $paginator->items(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
                'links' => $paginator->linkCollection()->toArray(),
            ],
        ]);
    }

    private function parseSelectionFilters(Request $request, bool $includeHistoryFilters = false): array
    {
        $filters = [
            $request->integer('curriculum_mapping_id') ?: null,
            $request->integer('curriculum_unit_id') ?: null,
            $request->string('assessment_type')->toString() ?: 'theory',
            max(1, $request->integer('assessment_number') ?: 1),
        ];

        if (! $includeHistoryFilters) {
            return $filters;
        }

        $filters[] = $request->integer('module') ?: null;
        $filters[] = $request->integer('academic_year_id') ?: null;

        return $filters;
    }

    private function selectionFiltersArray(
        ?int $mappingId,
        ?int $unitId,
        string $type,
        int $number,
        ?int $module = null,
        ?int $academicYearId = null,
    ): array {
        return [
            'curriculum_mapping_id' => $mappingId ? (string) $mappingId : '',
            'curriculum_unit_id' => $unitId ? (string) $unitId : '',
            'assessment_type' => $type,
            'assessment_number' => (string) $number,
            'module' => $module ? (string) $module : '',
            'academic_year_id' => $academicYearId ? (string) $academicYearId : '',
        ];
    }

    private function resolveUnit(string $unitCode): ?Unit
    {
        if ($unitCode === '') {
            return null;
        }

        return Unit::query()
            ->with([
                'curriculumMapping.course:id,name,code',
                'curriculumMapping.curriculum:id,name',
            ])
            ->where('units.code', $unitCode)
            ->orderBy('units.id')
            ->first();
    }

    private function resolveSelectedUnit(?int $mappingId, ?int $unitId): ?Unit
    {
        if (! $unitId) {
            return null;
        }

        return Unit::query()
            ->with([
                'curriculumMapping.course:id,name,code',
                'curriculumMapping.curriculum:id,name',
            ])
            ->where('units.id', $unitId)
            ->when($mappingId, fn ($query) => $query->where('units.curriculum_mapping_id', $mappingId))
            ->first();
    }

    private function unitPayload(?Unit $unit): ?array
    {
        if (! $unit) {
            return null;
        }

        return [
            'id' => $unit->id,
            'curriculum_mapping_id' => (string) $unit->curriculum_mapping_id,
            'code' => $unit->code,
            'name' => $unit->name,
            'module' => $unit->module_taught,
            'course' => $unit->curriculumMapping?->course?->name,
            'version' => $unit->curriculumMapping?->curriculum?->name,
        ];
    }

    private function courseMappingOptions(Request $request): array
    {
        return CurriculumMapping::query()
            ->with([
                'course:id,name,code',
                'curriculum:id,name',
            ])
            ->where('is_active', true)
            ->whereHas('units')
            ->when(
                $this->shouldScopeMarksToDepartment($request),
                fn ($query) => $query->whereHas(
                    'course',
                    fn ($courseQuery) => $courseQuery->where('department_id', $this->currentDepartmentId($request))
                )
            )
            ->latest('id')
            ->get(['id', 'course_id', 'curriculum_id'])
            ->map(fn (CurriculumMapping $mapping) => [
                'id' => (string) $mapping->id,
                'name' => trim(($mapping->curriculum?->name ?? '').' - '.($mapping->course?->name ?? '').' ('.($mapping->course?->code ?? '').')', ' -()'),
            ])
            ->values()
            ->all();
    }

    private function unitOptions(?int $mappingId, Request $request): array
    {
        return $this->unitSearchResults($request, $mappingId, '', 12);
    }

    private function unitSearchResults(Request $request, ?int $mappingId, string $query, int $limit): array
    {
        return Unit::query()
            ->with([
                'curriculumMapping.course:id,name,department_id',
                'curriculumMapping.curriculum:id,name',
            ])
            ->when($mappingId, fn ($builder) => $builder->where('curriculum_mapping_id', $mappingId))
            ->when(
                $this->shouldScopeMarksToDepartment($request),
                fn ($builder) => $builder->whereHas(
                    'curriculumMapping.course',
                    fn ($courseQuery) => $courseQuery->where('department_id', $this->currentDepartmentId($request))
                )
            )
            ->when($query !== '', function ($builder) use ($query) {
                $builder->where(function ($unitQuery) use ($query) {
                    $unitQuery
                        ->where('units.name', 'like', "%{$query}%")
                        ->orWhere('units.code', 'like', "%{$query}%")
                        ->orWhereHas('curriculumMapping.course', fn ($courseQuery) => $courseQuery->where('name', 'like', "%{$query}%"))
                        ->orWhereHas('curriculumMapping.curriculum', fn ($curriculumQuery) => $curriculumQuery->where('name', 'like', "%{$query}%"));
                });
            })
            ->orderBy('module_taught')
            ->orderBy('code')
            ->limit($limit)
            ->get(['id', 'curriculum_mapping_id', 'code', 'name', 'module_taught'])
            ->map(fn (Unit $unit) => [
                'id' => (string) $unit->id,
                'name' => trim(
                    ($unit->curriculumMapping?->course?->name ?? '').
                    ' / Module '.($unit->module_taught ?: '?').
                    ' / '.($unit->code ?? '').
                    ' - '.($unit->name ?? '')
                ),
            ])
            ->values()
            ->all();
    }

    private function selectedUnitBlocker(?int $mappingId, ?int $unitId, ?Unit $selectedUnit): ?string
    {
        if ($unitId && ! $selectedUnit) {
            return $mappingId
                ? 'Select a valid unit from the chosen course mapping.'
                : 'Select a valid unit before continuing.';
        }

        return null;
    }

    private function resolveStudentsForIdentifiers(array $identifiers): Collection
    {
        $normalized = collect($identifiers)
            ->map(fn ($identifier) => $this->normalizeStudentIdentifier($identifier))
            ->filter()
            ->unique()
            ->values();

        $numericIds = $normalized
            ->filter(fn ($identifier) => ctype_digit($identifier))
            ->map(fn ($identifier) => (int) $identifier)
            ->values()
            ->all();

        $registrationNumbers = $normalized->all();

        $students = Student::query()
            ->where(function ($query) use ($registrationNumbers, $numericIds) {
                if ($registrationNumbers !== []) {
                    $query->whereIn('registration_number', $registrationNumbers);
                }

                if ($numericIds !== []) {
                    $query->orWhereIn('id', $numericIds);
                }
            })
            ->get();

        $keyed = collect();

        foreach ($students as $student) {
            $keyed->put($this->normalizeStudentIdentifier($student->registration_number), $student);
            $keyed->put((string) $student->id, $student);
        }

        return $keyed;
    }

    private function normalizeStudentIdentifier(string $identifier): string
    {
        return strtoupper(trim($identifier));
    }

    private function fetchMarks(
        int $unitId,
        string $type,
        int $number,
        ?int $module,
        ?int $academicYearId,
        int $page = 1,
    ): array {
        $paginator = StudentMark::query()
            ->with([
                'student:id,registration_number,user_id',
                'student.user:id,first_name,last_name',
                'curriculumUnit:id,name',
            ])
            ->where('curriculum_unit_id', $unitId)
            ->where('assessment_type', $type)
            ->where('assessment_number', $number)
            ->when($academicYearId, function ($query) use ($academicYearId, $module) {
                $query->whereHas('academicSession', fn ($sessionQuery) => $sessionQuery->where('academic_year_id', $academicYearId));

                if ($module !== null) {
                    $query->whereHas('academicSessionEnrollment', fn ($enrollmentQuery) => $enrollmentQuery
                        ->where('module', $module)
                        ->whereHas('academicSession', fn ($sessionQuery) => $sessionQuery->where('academic_year_id', $academicYearId)));
                }
            })
            ->when(! $academicYearId && $module, fn ($query) => $query->whereHas(
                'academicSessionEnrollment',
                fn ($enrollmentQuery) => $enrollmentQuery->where('module', $module)
            ))
            ->orderBy('student_id')
            ->paginate(25, ['*'], 'page', $page)
            ->withQueryString();

        $paginator->setCollection(
            $paginator->getCollection()->map(fn (StudentMark $mark) => [
                'id' => $mark->id,
                'registration_number' => $mark->student?->registration_number,
                'student_name' => trim(($mark->student?->user?->first_name ?? '').' '.($mark->student?->user?->last_name ?? '')),
                'unit_name' => $mark->curriculumUnit?->name,
                'marks' => (int) $mark->marks,
                'is_published' => (bool) $mark->is_published,
            ])
        );

        return [
            'data' => $paginator->items(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'total' => $paginator->total(),
            'links' => $paginator->linkCollection()->toArray(),
        ];
    }

    private function fetchPublishMarks(
        int $unitId,
        string $type,
        int $number,
        ?int $module,
        ?int $academicYearId,
        int $page = 1,
    ): array {
        $query = StudentMark::query()
            ->with([
                'student:id,registration_number,user_id',
                'student.user:id,first_name,last_name',
                'curriculumUnit:id,name',
            ])
            ->where('curriculum_unit_id', $unitId)
            ->where('assessment_type', $type)
            ->where('assessment_number', $number);

        $this->applyYearModuleFilters($query, $academicYearId, $module);

        $paginator = $query
            ->orderBy('student_id')
            ->paginate(25, ['*'], 'page', $page)
            ->withQueryString();

        $paginator->setCollection(
            $paginator->getCollection()->map(fn (StudentMark $mark) => [
                'id' => $mark->id,
                'registration_number' => $mark->student?->registration_number,
                'student_name' => trim(($mark->student?->user?->first_name ?? '').' '.($mark->student?->user?->last_name ?? '')),
                'unit_name' => $mark->curriculumUnit?->name,
                'marks' => (int) $mark->marks,
                'is_published' => (bool) $mark->is_published,
            ])
        );

        return [
            'data' => $paginator->items(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'total' => $paginator->total(),
            'links' => $paginator->linkCollection()->toArray(),
        ];
    }

    private function filterOptions(int $unitId, string $type, int $number, ?int $selectedAcademicYearId = null): array
    {
        $years = StudentMark::query()
            ->join('academic_sessions as acs', 'acs.id', '=', 'student_marks.academic_session_id')
            ->join('academic_years as ay', 'ay.id', '=', 'acs.academic_year_id')
            ->where('student_marks.curriculum_unit_id', $unitId)
            ->where('student_marks.assessment_type', $type)
            ->where('student_marks.assessment_number', $number)
            ->distinct()
            ->orderByDesc('ay.academic_year')
            ->get(['ay.id', 'ay.label', 'ay.academic_year'])
            ->map(fn ($year) => [
                'value' => (string) $year->id,
                'label' => trim(($year->label ?? '').' '.($year->academic_year ?? '')),
            ])
            ->unique('value')
            ->values();

        $modulesQuery = StudentMark::query()
            ->join('academic_session_enrollments as ase', 'ase.id', '=', 'student_marks.academic_session_enrollment_id')
            ->join('academic_sessions as acs2', 'acs2.id', '=', 'student_marks.academic_session_id')
            ->join('academic_years as ay2', 'ay2.id', '=', 'acs2.academic_year_id')
            ->where('student_marks.curriculum_unit_id', $unitId)
            ->where('student_marks.assessment_type', $type)
            ->where('student_marks.assessment_number', $number);

        if ($selectedAcademicYearId !== null) {
            $modulesQuery->where('ay2.id', $selectedAcademicYearId);
        }

        $modules = $modulesQuery
            ->distinct()
            ->orderBy('ase.module')
            ->pluck('ase.module')
            ->filter()
            ->map(fn ($module) => ['value' => (string) (int) $module, 'label' => 'Module '.(int) $module])
            ->values();

        return ['modules' => $modules, 'academic_years' => $years];
    }

    private function publishFilterOptions(int $unitId, string $type, int $number, ?int $selectedAcademicYearId = null): array
    {
        return $this->filterOptions($unitId, $type, $number, $selectedAcademicYearId);
    }

    private function marksheetSection(
        int $unitId,
        string $assessmentType,
        ?int $academicSessionId,
        ?int $yearOfStudy,
        string $registrationNumber,
    ): array {
        $baseQuery = StudentMark::query()
            ->where('curriculum_unit_id', $unitId)
            ->where('assessment_type', $assessmentType)
            ->when($academicSessionId, fn ($query) => $query->where('academic_session_id', $academicSessionId))
            ->when($yearOfStudy, fn ($query) => $query->whereHas('academicSessionEnrollment', fn ($enrollmentQuery) => $enrollmentQuery->where('year_of_study', $yearOfStudy)))
            ->when($registrationNumber !== '', fn ($query) => $query->whereHas('student', fn ($studentQuery) => $studentQuery->where('registration_number', $registrationNumber)));

        $average = round((float) (clone $baseQuery)->avg('marks'), 2);

        $topPerformers = (clone $baseQuery)
            ->with([
                'student:id,registration_number,user_id',
                'student.user:id,first_name,last_name',
                'academicSessionEnrollment:id,year_of_study',
            ])
            ->orderByDesc('marks')
            ->orderBy('student_id')
            ->limit(3)
            ->get();

        return [
            'average' => $average,
            'top_performers' => $topPerformers
                ->map(fn (StudentMark $mark) => [
                    'registration_number' => $mark->student?->registration_number,
                    'student_name' => trim(($mark->student?->user?->first_name ?? '').' '.($mark->student?->user?->last_name ?? '')),
                    'marks' => (int) $mark->marks,
                    'year_of_study' => $mark->academicSessionEnrollment?->year_of_study,
                ])
                ->values(),
        ];
    }

    private function applyYearModuleFilters($query, ?int $academicYearId, ?int $module): void
    {
        if ($academicYearId !== null) {
            $query->whereHas('academicSession', fn ($sessionQuery) => $sessionQuery->where('academic_year_id', $academicYearId));
        }

        if ($module !== null) {
            $query->whereHas('academicSessionEnrollment', fn ($enrollmentQuery) => $enrollmentQuery->where('module', $module));
        }
    }

    private function authorizeHod(Request $request): void
    {
        abort_unless($this->canPublishMarks($request), 403);
    }

    private function canPublishMarks(Request $request): bool
    {
        return (bool) ($request->user()?->hasRole('hod') || $request->user()?->hasRole('admin'));
    }

    private function currentDepartmentId(Request $request): ?int
    {
        return $request->user()?->staff?->department_id
            ? (int) $request->user()->staff->department_id
            : null;
    }

    private function shouldScopeMarksToDepartment(Request $request): bool
    {
        return (bool) ($request->user()?->hasRole('hod') && ! $request->user()?->hasRole('admin') && $this->currentDepartmentId($request));
    }

    private function academicYearPayload(?int $academicYearId): ?array
    {
        if (! $academicYearId) {
            return null;
        }

        $year = AcademicYear::query()->find($academicYearId, ['id', 'label', 'academic_year']);

        if (! $year) {
            return null;
        }

        return [
            'id' => (string) $year->id,
            'name' => $year->name,
        ];
    }

    private function academicSessionPayload(?int $academicSessionId): ?array
    {
        if (! $academicSessionId) {
            return null;
        }

        $session = AcademicSession::query()
            ->with('academicYear:id,label,academic_year')
            ->find($academicSessionId, ['id', 'academic_year_id', 'session_number', 'session_No', 'label']);

        if (! $session) {
            return null;
        }

        return [
            'id' => (string) $session->id,
            'name' => $session->display_name,
        ];
    }
}
