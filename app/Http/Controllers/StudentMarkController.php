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
    // ─────────────────────────────────────────────────────────────────────────
    //  Index (marks entry)
    // ─────────────────────────────────────────────────────────────────────────

    public function index(Request $request): Response
    {
        [$unitCode, $type, $number, $module, $year] = $this->parseFilters($request);

        $selectedUnit   = $unitCode ? $this->resolveUnit($unitCode) : null;
        $submittedMarks = collect();

        // Only run the marks query when the Search button was explicitly clicked.
        if ($selectedUnit && $request->boolean('search_marks')) {
            $submittedMarks = $this->fetchMarks(
                $selectedUnit->id, $type, $number, $module, $year
            );
        }

        return Inertia::render('Grades/Index', [
            'filters'         => $this->filtersArray($unitCode, $type, $number, $module, $year),
            'selected_unit'   => $this->unitPayload($selectedUnit),
            'submitted_marks' => $submittedMarks,
            'filter_options'  => $selectedUnit
                                    ? $this->filterOptions($selectedUnit->id, $type, $number, $year)
                                    : ['modules' => [], 'academic_years' => []],
            'blocker'         => $unitCode && ! $selectedUnit
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
            'program_version_unit_code'         => ['required', 'string'],
            'assessment_type'                   => ['required', 'in:theory,practical'],
            'assessment_number'                 => ['required', 'integer', 'min:1'],
            'entries'                           => ['required', 'array', 'min:1'],
            'entries.*.registration_number'     => ['required', 'string', 'distinct'],
            'entries.*.marks'                   => ['required', 'integer', 'min:0', 'max:100'],
        ]);

        $unitCode = trim($validated['program_version_unit_code']);
        $unit     = $this->resolveUnit($unitCode);

        if (! $unit) {
            throw ValidationException::withMessages([
                'program_version_unit_code' => 'No program version unit was found for the entered code.',
            ]);
        }

        $entries = collect($validated['entries'])
            ->map(fn ($e) => [
                'registration_number' => trim($e['registration_number']),
                'marks'               => (int) $e['marks'],
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
                'entries' => 'Unknown registration number(s): ' . $unknown->implode(', '),
            ]);
        }

        // ── Validate all students are registered for this unit ────────────────
        // One query — get all eligible registrations for this unit, keyed by student_id.
        $eligible = StudentUnitRegistration::query()
            ->with('academicSessionEnrollment')
            ->where('program_version_unit_id', $unit->id)
            ->whereIn(
                DB::raw('(SELECT student_id FROM program_enrollments WHERE id = (SELECT program_enrollment_id FROM academic_session_enrollments WHERE id = academic_session_enrollment_id LIMIT 1))'),
                $students->pluck('id')->all()
            )
            ->get()
            ->filter(fn ($r) => $r->academicSessionEnrollment?->programEnrollment?->student_id)
            ->sortByDesc(fn ($r) => $r->academicSessionEnrollment?->academic_session_id ?? 0)
            ->keyBy(fn ($r) => $r->academicSessionEnrollment->programEnrollment->student_id);

        $notRegistered = $entries
            ->filter(fn ($e) => ! $eligible->has($students->get($e['registration_number'])?->id))
            ->pluck('registration_number')
            ->values();

        if ($notRegistered->isNotEmpty()) {
            return back()->withErrors([
                'entries' => 'Marks can only be awarded after unit registration. Invalid: ' . $notRegistered->implode(', '),
            ]);
        }

        $staffId = $request->user()?->staff?->id;

        DB::transaction(function () use ($validated, $entries, $students, $eligible, $unit, $staffId) {
            foreach ($entries as $entry) {
                $student          = $students->get($entry['registration_number']);
                $unitRegistration = $eligible->get($student->id);
                $session          = $unitRegistration->academicSessionEnrollment;

                StudentMark::updateOrCreate(
                    [
                        'student_id'              => $student->id,
                        'program_version_unit_id' => $unit->id,
                        'assessment_type'         => $validated['assessment_type'],
                        'assessment_number'       => $validated['assessment_number'],
                    ],
                    [
                        'academic_session_id'              => $session->academic_session_id,
                        'academic_session_enrollment_id'   => $session->id,
                        'marks'                            => $entry['marks'],
                        'recorded_by_staff_id'             => $staffId,
                        'is_published'                     => false,
                    ]
                );
            }
        });

        return to_route('academic.marks.index', [
            'program_version_unit_code' => $unitCode,
            'assessment_type'           => $validated['assessment_type'],
            'assessment_number'         => $validated['assessment_number'],
        ])->with('success', 'Marks saved as unpublished successfully.');
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Publish index (HoD)
    // ─────────────────────────────────────────────────────────────────────────

    public function publishIndex(Request $request): Response
    {
        $this->authorizeHod($request);

        [$unitCode, $type, $number, $module, $year] = $this->parseFilters($request);

        $selectedUnit   = $unitCode ? $this->resolveUnit($unitCode) : null;
        $submittedMarks = $selectedUnit
            ? $this->fetchPublishMarks($selectedUnit->id, $module, $year)
            : collect();

        return Inertia::render('Grades/Publish', [
            'filters'         => $this->filtersArray($unitCode, $type, $number, $module, $year),
            'selected_unit'   => $this->unitPayload($selectedUnit),
            'submitted_marks' => $submittedMarks,
            'filter_options'  => $selectedUnit
                                    ? $this->publishFilterOptions($selectedUnit->id, $year)
                                    : ['modules' => [], 'academic_years' => []],
            'blocker'         => $unitCode && ! $selectedUnit
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
            'assessment_type'           => ['nullable', 'in:theory,practical'],
            'assessment_number'         => ['nullable', 'integer', 'min:1'],
            'academic_year'             => ['nullable', 'string'],
            'module'                    => ['nullable', 'integer', 'min:1'],
            'action'                    => ['required', 'in:publish,unpublish'],
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
            ->when(! empty($validated['assessment_type']), fn ($q) =>
                $q->where('assessment_type', $validated['assessment_type'])
            )
            ->when(! empty($validated['assessment_number']), fn ($q) =>
                $q->where('assessment_number', $validated['assessment_number'])
            );

        $this->applyYearModuleFilters($query, $year, $module);

        $updated = $query->update([
            'is_published' => $validated['action'] === 'publish',
            'updated_at' => now(),
        ]);

        $msg = match (true) {
            $updated === 0              => 'No marks were found for that assessment.',
            $validated['action'] === 'publish'   => 'Assessment marks published successfully.',
            default                     => 'Assessment marks unpublished successfully.',
        };

        return to_route('academic.marks.publish.index', [
            'program_version_unit_code' => $validated['program_version_unit_code'],
            'academic_year'             => $year,
            'module'                    => $module,
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

    public function marksheetIndex(Request $request): Response
    {
        $validated = $request->validate([
            'program_version_unit_code' => ['nullable', 'string'],
            'session_number'            => ['nullable', 'integer', 'min:1'],
            'year_of_study'             => ['nullable', 'integer', 'min:1'],
            'registration_number'       => ['nullable', 'string'],
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
            $availableSessions = StudentMark::query()
                ->with('academicSession:id,session_No,session_number')
                ->where('student_marks.program_version_unit_id', $selectedUnit->id)
                ->get()
                ->map(fn (StudentMark $mark) =>
                    $mark->academicSession?->session_number ?? $mark->academicSession?->session_No
                )
                ->filter(fn ($session) => $session !== null)
                ->unique()
                ->sort()
                ->map(fn ($session) => [
                    'value' => (string) (int) $session,
                    'label' => 'Session ' . (int) $session,
                ])
                ->values();

            $availableYears = StudentMark::query()
                ->join('academic_session_enrollments as ase', 'ase.id', '=', 'student_marks.academic_session_enrollment_id')
                ->where('student_marks.program_version_unit_id', $selectedUnit->id)
                ->distinct()
                ->orderBy('ase.year_of_study')
                ->pluck('ase.year_of_study')
                ->filter()
                ->map(fn ($year) => [
                    'value' => (string) (int) $year,
                    'label' => 'Year ' . (int) $year,
                ])
                ->values();

            $marksheetData = [
                'theory' => $this->marksheetSection(
                    $selectedUnit->id,
                    'theory',
                    $sessionNumber,
                    $yearOfStudy,
                    $registrationNumber
                ),
                'practical' => $this->marksheetSection(
                    $selectedUnit->id,
                    'practical',
                    $sessionNumber,
                    $yearOfStudy,
                    $registrationNumber
                ),
            ];
        }

        return Inertia::render('Grades/Marksheet', [
            'filters' => [
                'program_version_unit_code' => $unitCode,
                'session_number'            => $sessionNumber ? (string) $sessionNumber : '',
                'year_of_study'             => $yearOfStudy ? (string) $yearOfStudy : '',
                'registration_number'       => $registrationNumber,
            ],
            'selected_unit'      => $this->unitPayload($selectedUnit),
            'available_sessions' => $availableSessions,
            'available_years'    => $availableYears,
            'marksheet_data'     => $marksheetData,
            'blocker'            => $unitCode !== '' && ! $selectedUnit
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
            'module'        => ['nullable', 'integer', 'min:1'],
            'year_of_study' => ['nullable', 'integer', 'min:1'],
        ]);

        $student           = $request->user()?->student?->loadMissing('user');
        $selectedModule    = isset($validated['module']) ? (int) $validated['module'] : null;
        $selectedYear      = isset($validated['year_of_study']) ? (int) $validated['year_of_study'] : null;

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

        // Build filter option lists from the full set before filtering.
        $availableModules = $publishedMarks
            ->pluck('programVersionUnit.module_taught')
            ->filter()->map(fn ($m) => (int) $m)->unique()->sort()->values();

        $availableYears = $publishedMarks
            ->pluck('academicSessionEnrollment.year_of_study')
            ->filter()->map(fn ($y) => (int) $y)->unique()->sort()->values();

        // Apply in-memory filters.
        $filteredMarks = $publishedMarks
            ->when($selectedModule, fn ($c) => $c->filter(
                fn ($m) => (int) $m->programVersionUnit?->module_taught === $selectedModule
            ))
            ->when($selectedYear, fn ($c) => $c->filter(
                fn ($m) => (int) $m->academicSessionEnrollment?->year_of_study === $selectedYear
            ))
            ->values();

        $results = $filteredMarks->map(fn (StudentMark $mark) => [
            'id'                => $mark->id,
            'session'           => $mark->academicSession?->display_name
                                    ?? $mark->academicSession?->label
                                    ?? 'Session not available',
            'year_of_study'     => $mark->academicSessionEnrollment?->year_of_study,
            'module'            => $mark->programVersionUnit?->module_taught,
            'unit_code'         => $mark->programVersionUnit?->unit?->code,
            'unit_name'         => $mark->programVersionUnit?->unit?->name,
            'mark_type'         => $mark->assessment_type,
            'assessment_number' => $mark->assessment_number,
            'marks'             => $mark->marks,
            'theory_marks'      => $mark->assessment_type === 'theory' ? $mark->marks : null,
            'practical_marks'   => $mark->assessment_type === 'practical' ? $mark->marks : null,
        ])->values();

        return Inertia::render('Grades/StudentResults', [
            'filters' => [
                'module'        => $selectedModule ? (string) $selectedModule : '',
                'year_of_study' => $selectedYear   ? (string) $selectedYear   : '',
            ],
            'filter_options' => [
                'modules' => $availableModules->map(fn ($m) => [
                    'value' => (string) $m, 'label' => "Module $m",
                ])->values(),
                'years_of_study' => $availableYears->map(fn ($y) => [
                    'value' => (string) $y, 'label' => "Year $y",
                ])->values(),
            ],
            'student' => $student ? [
                'name'                => trim(($student->user?->first_name ?? '') . ' ' . ($student->user?->last_name ?? '')),
                'registration_number' => $student->registration_number,
            ] : null,
            'summary' => [
                'published_count' => $publishedMarks->count(),
                'filtered_count'  => $filteredMarks->count(),
            ],
            'results' => $results,
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
            $request->string('assessment_type')->toString()  ?: 'theory',
            max(1, $request->integer('assessment_number')    ?: 1),
            $request->integer('module') ?: null,
            $year !== '' ? $year : null,   // keep as string – academic_year may be "2024/2025"
        ];
    }

    /**
     * Shape the filters array sent back to every Inertia page.
     */
    private function filtersArray(
        string  $unitCode,
        string  $type,
        int     $number,
        ?int    $module,
        ?string $year,
    ): array {
        return [
            'program_version_unit_code' => $unitCode,
            'assessment_type'           => $type,
            'assessment_number'         => (string) $number,
            'module'                    => $module ? (string) $module : '',
            'academic_year'             => $year ?? '',
        ];
    }

    /**
     * Resolve a ProgramVersionUnit by unit code (not PVU code).
     * Eager-loads everything the frontend payload and mark queries need.
     */
    private function resolveUnit(string $unitCode): ?ProgramVersionUnit
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
            ->whereHas('unit', fn ($q) => $q->where('code', $unitCode))
            ->orderBy('id')
            ->first();
    }

    /**
     * Shape a ProgramVersionUnit model into the payload the frontend expects,
     * or return null when no unit is resolved.
     */
    private function unitPayload(?ProgramVersionUnit $unit): ?array
    {
        if (! $unit) {
            return null;
        }

        return [
            'id'      => $unit->id,
            'code'    => $unit->unit?->code,
            'name'    => $unit->unit?->name,
            'module'  => $unit->module_taught,
            'program' => $unit->programVersionMapping?->program?->name,
            'version' => $unit->programVersionMapping?->programVersion?->name,
        ];
    }

    /**
     * Run the submitted-marks query.
     * Module filter joins through the unit; academic-year filter joins through
     * the session → year relationship so filtering actually works.
     */
    private function fetchMarks(
        int     $unitId,
        string  $type,
        int     $number,
        ?int    $module,
        ?string $year,
    ): Collection {
        return StudentMark::query()
            ->with([
                'student.user',
                'programVersionUnit.unit:id,name',
                'academicSession.academicYear:id,academic_year',
                'academicSessionEnrollment:id,module,year_of_study',
            ])
            ->where('program_version_unit_id', $unitId)
            ->where('assessment_type', $type)
            ->where('assessment_number', $number)
            // When a year is supplied, scope to that year's sessions.
            // When a module is also supplied, it must come from the enrollment
            // row that belongs to that same year — not from a different year.
            ->when($year, function ($q) use ($year, $module) {
                $q->whereHas('academicSession.academicYear', fn ($q2) =>
                    $q2->where('academic_year', $year)
                );
                if ($module !== null) {
                    // The module enrolled in during that specific year's session.
                    $q->whereHas('academicSessionEnrollment', fn ($q2) =>
                        $q2->where('module', $module)
                            ->whereHas('academicSession.academicYear', fn ($q3) =>
                                $q3->where('academic_year', $year)
                            )
                    );
                }
            })
            // Module filter with no year: just match the enrollment module.
            ->when(! $year && $module, fn ($q) => $q->whereHas(
                'academicSessionEnrollment',
                fn ($q2) => $q2->where('module', $module)
            ))
            ->orderBy('student_id')
            ->get()
            ->map(fn (StudentMark $mark) => [
                'id'                  => $mark->id,
                'registration_number' => $mark->student?->registration_number,
                'student_name'        => trim(
                    ($mark->student?->user?->first_name ?? '') . ' ' .
                    ($mark->student?->user?->last_name  ?? '')
                ),
                'unit_name'           => $mark->programVersionUnit?->unit?->name,
                'marks'               => (int) $mark->marks,
                'is_published'        => (bool) $mark->is_published,
                'module'              => $mark->academicSessionEnrollment?->module,
                'session'             => $mark->academicSession?->display_name
                                            ?? $mark->academicSession?->label
                                            ?? 'Session',
                'academic_year'       => $mark->academicSession?->academicYear?->academic_year,
                'assessment_type'     => $mark->assessment_type,
                'assessment_number'   => $mark->assessment_number,
            ])
            ->values();
    }

    /**
     * Marks shown on the HoD publish page. This intentionally follows the
     * page's unit/year/module filters instead of requiring an assessment number.
     */
    private function fetchPublishMarks(int $unitId, ?int $module, ?string $year): Collection
    {
        $query = StudentMark::query()
            ->with([
                'student.user',
                'programVersionUnit.unit:id,name',
                'academicSession.academicYear:id,academic_year',
                'academicSessionEnrollment:id,module,year_of_study',
            ])
            ->where('program_version_unit_id', $unitId);

        $this->applyYearModuleFilters($query, $year, $module);

        return $query
            ->orderBy('assessment_type')
            ->orderBy('assessment_number')
            ->orderBy('student_id')
            ->get()
            ->map(fn (StudentMark $mark) => [
                'id'                  => $mark->id,
                'registration_number' => $mark->student?->registration_number,
                'student_name'        => trim(
                    ($mark->student?->user?->first_name ?? '') . ' ' .
                    ($mark->student?->user?->last_name  ?? '')
                ),
                'unit_name'           => $mark->programVersionUnit?->unit?->name,
                'marks'               => (int) $mark->marks,
                'is_published'        => (bool) $mark->is_published,
                'module'              => $mark->academicSessionEnrollment?->module,
                'academic_year'       => $mark->academicSession?->academicYear?->academic_year,
                'assessment_type'     => $mark->assessment_type,
                'assessment_number'   => $mark->assessment_number,
            ])
            ->values();
    }

    /**
     * Build the module and academic-year dropdown options for a given unit +
     * assessment, using a lightweight DB query rather than loading full models.
     */
    /**
     * Build dropdown options.
     *
     * Academic years: always all years that have marks for this assessment.
     * Modules: when a year is selected, only the modules enrolled during
     *          that year's sessions. Otherwise all modules across all years.
     */
    private function filterOptions(int $unitId, string $type, int $number, ?string $selectedYear = null): array
    {
        // ── Academic years (always unscoped) ─────────────────────────────────
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

        // ── Modules: scope to the selected year when one is chosen ────────────
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
            ->map(fn ($m) => ['value' => (string)(int) $m, 'label' => 'Module ' . (int) $m])
            ->values();

        return ['modules' => $modules, 'academic_years' => $years];
    }

    /**
     * Dropdown options for the HoD publish page, across all assessments.
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
            ->map(fn ($m) => ['value' => (string)(int) $m, 'label' => 'Module ' . (int) $m])
            ->values();

        return ['modules' => $modules, 'academic_years' => $years];
    }

    private function marksheetSection(
        int $unitId,
        string $assessmentType,
        ?int $sessionNumber,
        ?int $yearOfStudy,
        string $registrationNumber,
    ): array {
        $query = StudentMark::query()
            ->with([
                'student.user',
                'academicSession:id,session_No,session_number',
                'academicSessionEnrollment:id,year_of_study',
            ])
            ->where('program_version_unit_id', $unitId)
            ->where('assessment_type', $assessmentType)
            ->when($sessionNumber, fn ($q) => $q->whereHas('academicSession', fn ($q2) =>
                $q2->where('session_number', $sessionNumber)
                    ->orWhere('session_No', $sessionNumber)
            ))
            ->when($yearOfStudy, fn ($q) => $q->whereHas('academicSessionEnrollment', fn ($q2) =>
                $q2->where('year_of_study', $yearOfStudy)
            ))
            ->when($registrationNumber !== '', fn ($q) => $q->whereHas('student', fn ($q2) =>
                $q2->where('registration_number', $registrationNumber)
            ));

        $marks = $query
            ->orderByDesc('marks')
            ->orderBy('student_id')
            ->get();

        return [
            'average' => round((float) $marks->avg('marks'), 2),
            'top_performers' => $marks
                ->take(3)
                ->map(fn (StudentMark $mark) => [
                    'registration_number' => $mark->student?->registration_number,
                    'student_name' => trim(
                        ($mark->student?->user?->first_name ?? '') . ' ' .
                        ($mark->student?->user?->last_name ?? '')
                    ),
                    'marks' => (int) $mark->marks,
                    'year_of_study' => $mark->academicSessionEnrollment?->year_of_study,
                ])
                ->values(),
        ];
    }

    private function applyYearModuleFilters($query, ?string $year, ?int $module): void
    {
        if ($year !== null) {
            $query->whereHas('academicSession.academicYear', fn ($q) =>
                $q->where('academic_year', $year)
            );
        }

        if ($module !== null) {
            $query->whereHas('academicSessionEnrollment', fn ($q) =>
                $q->where('module', $module)
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
