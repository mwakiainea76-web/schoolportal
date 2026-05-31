<?php

namespace App\Http\Controllers;

use App\Models\ProgramVersionUnit;
use App\Models\Student;
use App\Models\StudentMark;
use App\Models\StudentUnitRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StudentMarkController extends Controller
{
    // ─────────────────────────────────────────────────────────────────────────
    //  Index (marks entry)
    // ─────────────────────────────────────────────────────────────────────────

    public function index(Request $request): Response
    {
        [$unitCode, $type, $number, $module, $year] = $this->parseFilters($request);

        $selectedUnit = $unitCode ? $this->resolveUnit($unitCode) : null;
        $submittedMarks = null; // null = not yet searched

        if ($selectedUnit && $request->boolean('search_marks')) {
            $submittedMarks = $this->fetchMarks(
                $selectedUnit->id, $type, $number, $module, $year,
                $request->integer('page', 1)
            );
        }

        return Inertia::render('Grades/Index', [
            'filters' => $this->filtersArray($unitCode, $type, $number, $module, $year),
            'selected_unit' => $this->unitPayload($selectedUnit),
            'submitted_marks' => $submittedMarks,
            'filter_options' => $selectedUnit
                ? $this->filterOptions($selectedUnit->id, $type, $number, $year)
                : ['modules' => [], 'academic_years' => []],
            'blocker' => $unitCode && ! $selectedUnit
                ? 'No program version unit was found for the entered code.'
                : null,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Store
    // ─────────────────────────────────────────────────────────────────────────

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
        $unit = $this->resolveUnit($unitCode);

        if (! $unit) {
            throw ValidationException::withMessages([
                'program_version_unit_code' => 'No program version unit was found for the entered code.',
            ]);
        }

        $entries = collect($validated['entries'])
            ->map(fn ($e) => [
                'registration_number' => trim($e['registration_number']),
                'marks' => (int) $e['marks'],
            ])
            ->filter(fn ($e) => $e['registration_number'] !== '')
            ->values();

        // ── Validate all registration numbers exist ───────────────────────────
        $students = Student::query()
            ->whereIn('registration_number', $entries->pluck('registration_number')->all())
            ->get()
            ->keyBy('registration_number');

        $unknown = $entries
            ->pluck('registration_number')
            ->reject(fn ($reg) => $students->has($reg))
            ->values();

        if ($unknown->isNotEmpty()) {
            return back()->withErrors([
                'entries' => 'Unknown registration number(s): '.$unknown->implode(', '),
            ]);
        }

        // ── Validate all students are registered for this unit ────────────────
        $eligible = StudentUnitRegistration::query()
            ->select('student_unit_registrations.*')
            ->selectRaw('pe.student_id as resolved_student_id')
            ->join('academic_session_enrollments as ase', 'ase.id', '=', 'student_unit_registrations.academic_session_enrollment_id')
            ->join('program_enrollments as pe', 'pe.id', '=', 'ase.program_enrollment_id')
            ->with('academicSessionEnrollment')
            ->where('program_version_unit_id', $unit->id)
            ->whereIn('pe.student_id', $students->pluck('id')->all())
            ->orderByDesc('ase.academic_session_id')
            ->orderByDesc('ase.id')
            ->get()
            ->unique('resolved_student_id')
            ->keyBy('resolved_student_id');

        $notRegistered = $entries
            ->filter(fn ($e) => ! $eligible->has($students->get($e['registration_number'])?->id))
            ->pluck('registration_number')
            ->values();

        if ($notRegistered->isNotEmpty()) {
            return back()->withErrors([
                'entries' => 'Marks can only be awarded after unit registration. Invalid: '.$notRegistered->implode(', '),
            ]);
        }

        $staffId = $request->user()?->staff?->id;

        DB::transaction(function () use ($validated, $entries, $students, $eligible, $unit, $staffId) {
            foreach ($entries as $entry) {
                $student = $students->get($entry['registration_number']);
                $unitRegistration = $eligible->get($student->id);
                $session = $unitRegistration->academicSessionEnrollment;

                StudentMark::updateOrCreate(
                    [
                        'student_id' => $student->id,
                        'program_version_unit_id' => $unit->id,
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
            }
        });

        return to_route('academic.marks.index', [
            'program_version_unit_code' => $unitCode,
            'assessment_type' => $validated['assessment_type'],
            'assessment_number' => $validated['assessment_number'],
        ])->with('success', 'Marks saved as unpublished successfully.');
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Publish index (HoD)
    // ─────────────────────────────────────────────────────────────────────────

    public function publishIndex(Request $request): Response
    {
        $this->authorizeHod($request);

        [$unitCode, $type, $number, $module, $year] = $this->parseFilters($request);

        $selectedUnit = $unitCode ? $this->resolveUnit($unitCode) : null;
        $submittedMarks = $selectedUnit
            ? $this->fetchPublishMarks(
                $selectedUnit->id, $module, $year,
                $request->integer('page', 1)
            )
            : null;

        return Inertia::render('Grades/Publish', [
            // Publish frontend only uses these 3 filter fields
            'filters' => [
                'program_version_unit_code' => $unitCode,
                'academic_year' => $year ?? '',
                'module' => $module ? (string) $module : '',
            ],
            'selected_unit' => $this->unitPayload($selectedUnit),
            'submitted_marks' => $submittedMarks,
            'filter_options' => $selectedUnit
                ? $this->publishFilterOptions($selectedUnit->id, $year)
                : ['modules' => [], 'academic_years' => []],
            'blocker' => $unitCode && ! $selectedUnit
                ? 'No program version unit was found for the entered code.'
                : null,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Publish / unpublish an entire assessment
    // ─────────────────────────────────────────────────────────────────────────

    public function publishAssessment(Request $request)
    {
        $this->authorizeHod($request);

        $validated = $request->validate([
            'program_version_unit_code' => ['required', 'string'],
            'assessment_type' => ['nullable', 'in:theory,practical'],
            'assessment_number' => ['nullable', 'integer', 'min:1'],
            'academic_year' => ['nullable', 'string'],
            'module' => ['nullable', 'integer', 'min:1'],
            'action' => ['required', 'in:publish,unpublish'],
        ]);

        $unit = $this->resolveUnit(trim($validated['program_version_unit_code']));

        if (! $unit) {
            throw ValidationException::withMessages([
                'program_version_unit_code' => 'No program version unit was found for the entered code.',
            ]);
        }

        $year = trim((string) ($validated['academic_year'] ?? ''));
        $year = $year !== '' ? $year : null;
        $module = isset($validated['module']) ? (int) $validated['module'] : null;

        $query = StudentMark::query()
            ->where('program_version_unit_id', $unit->id)
            ->when(! empty($validated['assessment_type']), fn ($q) => $q->where('assessment_type', $validated['assessment_type']))
            ->when(! empty($validated['assessment_number']), fn ($q) => $q->where('assessment_number', $validated['assessment_number']));

        $this->applyYearModuleFilters($query, $year, $module);

        $updated = $query->update([
            'is_published' => $validated['action'] === 'publish',
            'updated_at' => now(),
        ]);

        $msg = match (true) {
            $updated === 0 => 'No marks were found for that assessment.',
            $validated['action'] === 'publish' => 'Assessment marks published successfully.',
            default => 'Assessment marks unpublished successfully.',
        };

        return to_route('academic.marks.publish.index', [
            'program_version_unit_code' => $validated['program_version_unit_code'],
            'academic_year' => $year,
            'module' => $module,
        ])->with('success', $msg);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Toggle a single mark's published state
    // ─────────────────────────────────────────────────────────────────────────

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

    // ─────────────────────────────────────────────────────────────────────────
    //  Marksheet
    // ─────────────────────────────────────────────────────────────────────────

    public function marksheetIndex(Request $request): Response
    {
        $validated = $request->validate([
            'program_version_unit_code' => ['nullable', 'string'],
            'session_number' => ['nullable', 'integer', 'min:1'],
            'year_of_study' => ['nullable', 'integer', 'min:1'],
            'registration_number' => ['nullable', 'string'],
        ]);

        $unitCode = trim((string) ($validated['program_version_unit_code'] ?? ''));
        $sessionNumber = isset($validated['session_number']) ? (int) $validated['session_number'] : null;
        $yearOfStudy = isset($validated['year_of_study']) ? (int) $validated['year_of_study'] : null;
        $registrationNumber = trim((string) ($validated['registration_number'] ?? ''));
        $selectedUnit = $unitCode !== '' ? $this->resolveUnit($unitCode) : null;

        $availableSessions = collect();
        $availableYears = collect();
        $marksheetData = [
            'theory' => ['average' => 0, 'top_performers' => []],
            'practical' => ['average' => 0, 'top_performers' => []],
        ];

        if ($selectedUnit) {
            // ── Sessions: JOIN instead of loading all marks into memory ──────
            $availableSessions = StudentMark::query()
                ->join('academic_sessions as acs', 'acs.id', '=', 'student_marks.academic_session_id')
                ->where('student_marks.program_version_unit_id', $selectedUnit->id)
                ->distinct()
                ->orderBy('acs.session_number')
                ->pluck('acs.session_number')
                ->filter()
                ->map(fn ($s) => [
                    'value' => (string) (int) $s,
                    'label' => 'Session '.(int) $s,
                ])
                ->values();

            $availableYears = StudentMark::query()
                ->join('academic_session_enrollments as ase', 'ase.id', '=', 'student_marks.academic_session_enrollment_id')
                ->where('student_marks.program_version_unit_id', $selectedUnit->id)
                ->distinct()
                ->orderBy('ase.year_of_study')
                ->pluck('ase.year_of_study')
                ->filter()
                ->map(fn ($y) => [
                    'value' => (string) (int) $y,
                    'label' => 'Year '.(int) $y,
                ])
                ->values();

            $marksheetData = [
                'theory' => $this->marksheetSection($selectedUnit->id, 'theory', $sessionNumber, $yearOfStudy, $registrationNumber),
                'practical' => $this->marksheetSection($selectedUnit->id, 'practical', $sessionNumber, $yearOfStudy, $registrationNumber),
            ];
        }

        return Inertia::render('Grades/Marksheet', [
            'filters' => [
                'program_version_unit_code' => $unitCode,
                'session_number' => $sessionNumber ? (string) $sessionNumber : '',
                'year_of_study' => $yearOfStudy ? (string) $yearOfStudy : '',
                'registration_number' => $registrationNumber,
            ],
            // Marksheet only renders code + name — skip full unitPayload()
            'selected_unit' => $selectedUnit ? [
                'code' => $selectedUnit->unit?->code,
                'name' => $selectedUnit->unit?->name,
            ] : null,
            'available_sessions' => $availableSessions,
            'available_years' => $availableYears,
            'marksheet_data' => $marksheetData,
            'blocker' => $unitCode !== '' && ! $selectedUnit
                ? 'No program version unit was found for the entered code.'
                : null,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Student results (student-facing)
    // ─────────────────────────────────────────────────────────────────────────

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

        // ── 1. Filter options: two cheap scalar queries, no relations ─────────
        $baseMarks = StudentMark::query()
            ->where('student_id', $student->id)
            ->where('is_published', true);

        $availableModules = (clone $baseMarks)
            ->join('program_version_units', 'student_marks.program_version_unit_id', '=', 'program_version_units.id')
            ->distinct()
            ->orderBy('program_version_units.module_taught')
            ->pluck('program_version_units.module_taught')
            ->filter()
            ->map(fn ($m) => (int) $m)
            ->values();

        $availableYears = (clone $baseMarks)
            ->join('academic_session_enrollments', 'student_marks.academic_session_enrollment_id', '=', 'academic_session_enrollments.id')
            ->distinct()
            ->orderBy('academic_session_enrollments.year_of_study')
            ->pluck('academic_session_enrollments.year_of_study')
            ->filter()
            ->map(fn ($y) => (int) $y)
            ->values();

        $publishedCount = (clone $baseMarks)->count();

        // ── 2. Filtered + paginated marks: filters pushed to SQL ─────────────
        $filteredQuery = (clone $baseMarks)
            ->with([
                'academicSessionEnrollment:id,year_of_study',
                'programVersionUnit:id,unit_id,module_taught',
                'programVersionUnit.unit:id,code,name',
            ])
            ->orderByDesc('academic_session_id')
            ->orderBy('program_version_unit_id')
            ->orderBy('assessment_type')
            ->orderBy('assessment_number');

        if ($selectedModule) {
            $filteredQuery->whereHas('programVersionUnit', fn ($q) => $q->where('module_taught', $selectedModule)
            );
        }

        if ($selectedYear) {
            $filteredQuery->whereHas('academicSessionEnrollment', fn ($q) => $q->where('year_of_study', $selectedYear)
            );
        }

        $paginator = $filteredQuery
            ->paginate(30, ['*'], 'page', $request->integer('page', 1))
            ->withQueryString();

        $paginator->setCollection(
            $paginator->getCollection()->map(fn (StudentMark $mark) => [
                'unit_code' => $mark->programVersionUnit?->unit?->code,
                'unit_name' => $mark->programVersionUnit?->unit?->name,
                'module' => $mark->programVersionUnit?->module_taught,
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
                'modules' => $availableModules->map(fn ($m) => [
                    'value' => (string) $m, 'label' => "Module $m",
                ])->values(),
                'years_of_study' => $availableYears->map(fn ($y) => [
                    'value' => (string) $y, 'label' => "Year $y",
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

    // =========================================================================
    //  Private helpers
    // =========================================================================

    /**
     * Parse the five common filter inputs from any request.
     * Returns [$unitCode, $type, $number, $module, $year].
     */
    private function parseFilters(Request $request): array
    {
        $year = trim($request->string('academic_year')->toString());

        return [
            trim($request->string('program_version_unit_code')->toString()),
            $request->string('assessment_type')->toString() ?: 'theory',
            max(1, $request->integer('assessment_number') ?: 1),
            $request->integer('module') ?: null,
            $year !== '' ? $year : null,
        ];
    }

    /**
     * Shape the filters array sent back to Index page.
     */
    private function filtersArray(
        string $unitCode,
        string $type,
        int $number,
        ?int $module,
        ?string $year,
    ): array {
        return [
            'program_version_unit_code' => $unitCode,
            'assessment_type' => $type,
            'assessment_number' => (string) $number,
            'module' => $module ? (string) $module : '',
            'academic_year' => $year ?? '',
        ];
    }

    /**
     * Resolve a ProgramVersionUnit by unit code.
     * Eager-loads everything unitPayload() needs.
     */
    private function resolveUnit(string $unitCode): ?ProgramVersionUnit
    {
        if ($unitCode === '') {
            return null;
        }

        return ProgramVersionUnit::query()
            ->select([
                'program_version_units.*',
                'units.code as resolved_unit_code',
                'units.name as resolved_unit_name',
                'programs.name as resolved_program_name',
                'program_versions.name as resolved_version_name',
            ])
            ->join('units', 'units.id', '=', 'program_version_units.unit_id')
            ->join(
                'program_version_mappings',
                'program_version_mappings.id',
                '=',
                'program_version_units.program_version_mapping_id'
            )
            ->join('programs', 'programs.id', '=', 'program_version_mappings.program_id')
            ->join(
                'program_versions',
                'program_versions.id',
                '=',
                'program_version_mappings.program_version_id'
            )
            ->where('units.code', $unitCode)
            ->orderBy('id')
            ->first();
    }

    /**
     * Shape a ProgramVersionUnit into the full payload used by Index and Publish.
     * Marksheet uses its own slimmer shape (code + name only).
     */
    private function unitPayload(?ProgramVersionUnit $unit): ?array
    {
        if (! $unit) {
            return null;
        }

        return [
            'id' => $unit->id,
            'code' => $unit->resolved_unit_code ?? $unit->unit?->code,
            'name' => $unit->resolved_unit_name ?? $unit->unit?->name,
            'module' => $unit->module_taught,
            'program' => $unit->resolved_program_name ?? $unit->programVersionMapping?->program?->name,
            'version' => $unit->resolved_version_name ?? $unit->programVersionMapping?->programVersion?->name,
        ];
    }

    /**
     * Paginated submitted marks for the Index (marks entry) page.
     * Returns a plain array shaped for the frontend paginator component.
     */
    private function fetchMarks(
        int $unitId,
        string $type,
        int $number,
        ?int $module,
        ?string $year,
        int $page = 1,
    ): array {
        $paginator = StudentMark::query()
            ->with([
                'student:id,registration_number,user_id',
                'student.user:id,first_name,last_name',
                'programVersionUnit.unit:id,name',
            ])
            ->where('program_version_unit_id', $unitId)
            ->where('assessment_type', $type)
            ->where('assessment_number', $number)
            ->when($year, function ($q) use ($year, $module) {
                $q->whereHas('academicSession.academicYear', fn ($q2) => $q2->where('academic_year', $year)
                );
                if ($module !== null) {
                    $q->whereHas('academicSessionEnrollment', fn ($q2) => $q2->where('module', $module)
                        ->whereHas('academicSession.academicYear', fn ($q3) => $q3->where('academic_year', $year)
                        )
                    );
                }
            })
            ->when(! $year && $module, fn ($q) => $q->whereHas(
                'academicSessionEnrollment',
                fn ($q2) => $q2->where('module', $module)
            ))
            ->orderBy('student_id')
            ->paginate(25, ['*'], 'page', $page)
            ->withQueryString();

        $paginator->setCollection(
            $paginator->getCollection()->map(fn (StudentMark $mark) => [
                'id' => $mark->id,
                'registration_number' => $mark->student?->registration_number,
                'student_name' => trim(
                    ($mark->student?->user?->first_name ?? '').' '.
                    ($mark->student?->user?->last_name ?? '')
                ),
                'unit_name' => $mark->programVersionUnit?->unit?->name,
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

    /**
     * Paginated submitted marks for the HoD Publish page.
     * Covers all assessments for a unit (no assessment_type/number filter).
     */
    private function fetchPublishMarks(
        int $unitId,
        ?int $module,
        ?string $year,
        int $page = 1,
    ): array {
        $query = StudentMark::query()
            ->with([
                'student:id,registration_number,user_id',
                'student.user:id,first_name,last_name',
                'programVersionUnit.unit:id,name',
            ])
            ->where('program_version_unit_id', $unitId);

        $this->applyYearModuleFilters($query, $year, $module);

        $paginator = $query
            ->orderBy('assessment_type')
            ->orderBy('assessment_number')
            ->orderBy('student_id')
            ->paginate(25, ['*'], 'page', $page)
            ->withQueryString();

        $paginator->setCollection(
            $paginator->getCollection()->map(fn (StudentMark $mark) => [
                'id' => $mark->id,
                'registration_number' => $mark->student?->registration_number,
                'student_name' => trim(
                    ($mark->student?->user?->first_name ?? '').' '.
                    ($mark->student?->user?->last_name ?? '')
                ),
                'unit_name' => $mark->programVersionUnit?->unit?->name,
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

    /**
     * Dropdown options for the Index page.
     * Academic years always unscoped; modules scoped to selected year when provided.
     */
    private function filterOptions(int $unitId, string $type, int $number, ?string $selectedYear = null): array
    {
        $years = StudentMark::query()
            ->join('academic_sessions as acs', 'acs.id', '=', 'student_marks.academic_session_id')
            ->join('academic_years as ay', 'ay.id', '=', 'acs.academic_year_id')
            ->where('student_marks.program_version_unit_id', $unitId)
            ->where('student_marks.assessment_type', $type)
            ->where('student_marks.assessment_number', $number)
            ->distinct()
            ->orderByDesc('ay.academic_year')
            ->pluck('ay.academic_year')
            ->filter()
            ->map(fn ($y) => ['value' => (string) $y, 'label' => (string) $y])
            ->values();

        $modulesQuery = StudentMark::query()
            ->join('academic_session_enrollments as ase', 'ase.id', '=', 'student_marks.academic_session_enrollment_id')
            ->join('academic_sessions as acs2', 'acs2.id', '=', 'student_marks.academic_session_id')
            ->join('academic_years as ay2', 'ay2.id', '=', 'acs2.academic_year_id')
            ->where('student_marks.program_version_unit_id', $unitId)
            ->where('student_marks.assessment_type', $type)
            ->where('student_marks.assessment_number', $number);

        if ($selectedYear !== null) {
            $modulesQuery->where('ay2.academic_year', $selectedYear);
        }

        $modules = $modulesQuery
            ->distinct()
            ->orderBy('ase.module')
            ->pluck('ase.module')
            ->filter()
            ->map(fn ($m) => ['value' => (string) (int) $m, 'label' => 'Module '.(int) $m])
            ->values();

        return ['modules' => $modules, 'academic_years' => $years];
    }

    /**
     * Dropdown options for the HoD Publish page, across all assessments.
     */
    private function publishFilterOptions(int $unitId, ?string $selectedYear = null): array
    {
        $years = StudentMark::query()
            ->join('academic_sessions as acs', 'acs.id', '=', 'student_marks.academic_session_id')
            ->join('academic_years as ay', 'ay.id', '=', 'acs.academic_year_id')
            ->where('student_marks.program_version_unit_id', $unitId)
            ->distinct()
            ->orderByDesc('ay.academic_year')
            ->pluck('ay.academic_year')
            ->filter()
            ->map(fn ($y) => ['value' => (string) $y, 'label' => (string) $y])
            ->values();

        $modulesQuery = StudentMark::query()
            ->join('academic_session_enrollments as ase', 'ase.id', '=', 'student_marks.academic_session_enrollment_id')
            ->join('academic_sessions as acs', 'acs.id', '=', 'student_marks.academic_session_id')
            ->join('academic_years as ay', 'ay.id', '=', 'acs.academic_year_id')
            ->where('student_marks.program_version_unit_id', $unitId);

        if ($selectedYear !== null) {
            $modulesQuery->where('ay.academic_year', $selectedYear);
        }

        $modules = $modulesQuery
            ->distinct()
            ->orderBy('ase.module')
            ->pluck('ase.module')
            ->filter()
            ->map(fn ($m) => ['value' => (string) (int) $m, 'label' => 'Module '.(int) $m])
            ->values();

        return ['modules' => $modules, 'academic_years' => $years];
    }

    /**
     * Top-3 performers + average for a single assessment type.
     * Used by marksheetIndex — intentionally NOT paginated (fixed top-3 display).
     */
    private function marksheetSection(
        int $unitId,
        string $assessmentType,
        ?int $sessionNumber,
        ?int $yearOfStudy,
        string $registrationNumber,
    ): array {
        $baseQuery = StudentMark::query()
            ->where('program_version_unit_id', $unitId)
            ->where('assessment_type', $assessmentType)
            ->when($sessionNumber, fn ($q) => $q->whereHas('academicSession', fn ($q2) => $q2->where('session_number', $sessionNumber)
                ->orWhere('session_No', $sessionNumber)
            ))
            ->when($yearOfStudy, fn ($q) => $q->whereHas('academicSessionEnrollment', fn ($q2) => $q2->where('year_of_study', $yearOfStudy)
            ))
            ->when($registrationNumber !== '', fn ($q) => $q->whereHas('student', fn ($q2) => $q2->where('registration_number', $registrationNumber)
            ));

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
                    'student_name' => trim(
                        ($mark->student?->user?->first_name ?? '').' '.
                        ($mark->student?->user?->last_name ?? '')
                    ),
                    'marks' => (int) $mark->marks,
                    'year_of_study' => $mark->academicSessionEnrollment?->year_of_study,
                ])
                ->values(),
        ];
    }

    /**
     * Apply year and module filters to a StudentMark query builder in place.
     * Used by publishAssessment and fetchPublishMarks.
     */
    private function applyYearModuleFilters($query, ?string $year, ?int $module): void
    {
        if ($year !== null) {
            $query->whereHas('academicSession.academicYear', fn ($q) => $q->where('academic_year', $year)
            );
        }

        if ($module !== null) {
            $query->whereHas('academicSessionEnrollment', fn ($q) => $q->where('module', $module)
            );
        }
    }

    /**
     * Abort with 403 unless the authenticated user is an HoD or admin.
     */
    private function authorizeHod(Request $request): void
    {
        abort_unless(
            $request->user()?->hasRole('hod') || $request->user()?->hasRole('admin'),
            403
        );
    }
}
