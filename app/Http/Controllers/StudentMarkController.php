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
use Symfony\Component\HttpFoundation\StreamedResponse;

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
        [$mappingId, $unitId, $type, $number, $academicSessionId, $academicYearId] = $this->parseSelectionFilters($request, true);
        $selectedUnit = $this->resolveSelectedUnit($mappingId, $unitId);
        $submittedMarks = null;

        if ($selectedUnit && $request->boolean('search_marks')) {
            $submittedMarks = $this->fetchMarks(
                $selectedUnit->id,
                $type,
                $number,
                $academicSessionId,
                $academicYearId,
                $request->integer('page', 1)
            );
        }

        return Inertia::render('Grades/View', [
            'filters' => $this->selectionFiltersArray($mappingId, $unitId, $type, $number, $academicSessionId, $academicYearId),
            'selected_unit' => $this->unitPayload($selectedUnit),
            'submitted_marks' => $submittedMarks,
            'course_mappings' => $this->courseMappingOptions($request),
            'unit_options' => $this->unitOptions($mappingId, $request),
            'filter_options' => $selectedUnit
                ? $this->filterOptions($selectedUnit->id, $type, $number, $academicYearId, $academicSessionId)
                : ['sessions' => [], 'academic_years' => [], 'assessment_numbers' => []],
            'blocker' => $this->selectedUnitBlocker($mappingId, $unitId, $selectedUnit),
            'can_publish' => $this->canPublishMarks($request),
            'selected_filters' => [
                'academic_year' => $this->academicYearPayload($academicYearId),
                'academic_session' => $this->academicSessionPayload($academicSessionId),
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

        [$mappingId, $unitId, $type, $number, $academicSessionId, $academicYearId] = $this->parseSelectionFilters($request, true);
        $selectedUnit = $this->resolveSelectedUnit($mappingId, $unitId);
        $submittedMarks = null;

        if ($selectedUnit && $request->boolean('search_marks')) {
            $submittedMarks = $this->fetchPublishMarks(
                $selectedUnit->id,
                $type,
                $number,
                $academicSessionId,
                $academicYearId,
                $request->integer('page', 1)
            );
        }

        return Inertia::render('Grades/Publish', [
            'filters' => $this->selectionFiltersArray($mappingId, $unitId, $type, $number, $academicSessionId, $academicYearId),
            'selected_unit' => $this->unitPayload($selectedUnit),
            'submitted_marks' => $submittedMarks,
            'course_mappings' => $this->courseMappingOptions($request),
            'unit_options' => $this->unitOptions($mappingId, $request),
            'filter_options' => $selectedUnit
                ? $this->publishFilterOptions($selectedUnit->id, $type, $number, $academicYearId, $academicSessionId)
                : ['sessions' => [], 'academic_years' => [], 'assessment_numbers' => []],
            'blocker' => $this->selectedUnitBlocker($mappingId, $unitId, $selectedUnit),
            'can_publish' => true,
            'selected_filters' => [
                'academic_year' => $this->academicYearPayload($academicYearId),
                'academic_session' => $this->academicSessionPayload($academicSessionId),
            ],
        ]);
    }

    public function publishAssessment(Request $request)
    {
        $this->authorizeHod($request);

        $validated = $request->validate([
            'curriculum_unit_id' => ['required', 'integer'],
            'curriculum_mapping_id' => ['nullable', 'integer'],
            'assessment_type' => ['nullable', 'in:theory,practical'],
            'assessment_number' => ['nullable', 'integer', 'min:1'],
            'academic_year_id' => ['nullable', 'integer'],
            'academic_session_id' => ['nullable', 'integer'],
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
        $academicSessionId = isset($validated['academic_session_id']) ? (int) $validated['academic_session_id'] : null;
        $assessmentType = $validated['assessment_type'] ?? null;
        $assessmentNumber = isset($validated['assessment_number']) ? (int) $validated['assessment_number'] : null;

        $query = StudentMark::query()->where('curriculum_unit_id', $unit->id);

        $this->applyAssessmentFilters($query, $assessmentType, $assessmentNumber);
        $this->applyYearSessionFilters($query, $academicYearId, $academicSessionId);

        $updated = $query->update([
            'is_published' => $validated['action'] === 'publish',
            'updated_at' => now(),
        ]);

        $message = match (true) {
            $updated === 0 => 'No marks were found for that assessment.',
            $validated['action'] === 'publish' => 'Selected marks published successfully.',
            default => 'Selected marks unpublished successfully.',
        };

        return to_route('academic.marks.publish.index', [
            'curriculum_mapping_id' => isset($validated['curriculum_mapping_id']) ? (string) $validated['curriculum_mapping_id'] : '',
            'curriculum_unit_id' => $unitId,
            'assessment_type' => $assessmentType,
            'assessment_number' => $assessmentNumber,
            'academic_year_id' => $academicYearId,
            'academic_session_id' => $academicSessionId,
            'search_marks' => true,
        ])->with('success', $message);
    }

    public function export(Request $request): StreamedResponse
    {
        $validated = $request->validate([
            'curriculum_mapping_id' => ['nullable', 'integer'],
            'curriculum_unit_id' => ['required', 'integer'],
            'assessment_type' => ['nullable', 'in:theory,practical'],
            'assessment_number' => ['nullable', 'integer', 'min:1'],
            'academic_year_id' => ['nullable', 'integer'],
            'academic_session_id' => ['nullable', 'integer'],
            'format' => ['required', 'in:csv,excel,pdf'],
            'context' => ['nullable', 'in:view,publish'],
        ]);

        if (($validated['context'] ?? 'view') === 'publish') {
            $this->authorizeHod($request);
        }

        if ($validated['format'] === 'pdf') {
            abort(501, 'PDF export is not available because no PDF renderer is installed for this project.');
        }

        $unitId = (int) $validated['curriculum_unit_id'];
        $mappingId = isset($validated['curriculum_mapping_id']) ? (int) $validated['curriculum_mapping_id'] : null;
        $unit = $this->resolveSelectedUnit($mappingId, $unitId);

        abort_unless($unit, 422, 'Select a valid unit before exporting marks.');

        $assessmentType = $validated['assessment_type'] ?? null;
        $assessmentNumber = isset($validated['assessment_number']) ? (int) $validated['assessment_number'] : null;
        $academicYearId = isset($validated['academic_year_id']) ? (int) $validated['academic_year_id'] : null;
        $academicSessionId = isset($validated['academic_session_id']) ? (int) $validated['academic_session_id'] : null;
        $format = $validated['format'];
        $separator = $format === 'excel' ? "\t" : ',';
        $extension = $format === 'excel' ? 'xls' : 'csv';
        $contentType = $format === 'excel'
            ? 'application/vnd.ms-excel; charset=UTF-8'
            : 'text/csv; charset=UTF-8';
        $fileName = 'marks-export-'.now()->format('Y-m-d-His').'.'.$extension;

        $query = $this->marksQuery(
            $unitId,
            $assessmentType,
            $assessmentNumber,
            $academicSessionId,
            $academicYearId
        );

        set_time_limit(60);

        return response()->streamDownload(function () use ($query, $separator) {
            $handle = fopen('php://output', 'wb');
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'Admission Number',
                'Student',
                'Unit',
                'Session',
                'Assessment Type',
                'Assessment Number',
                'Marks',
                'Status',
            ], $separator);

            foreach ($query->lazyById(100) as $mark) {
                fputcsv($handle, [
                    $mark->student?->admission_number,
                    $mark->student?->full_name,
                    $mark->curriculumUnit?->name,
                    $mark->academicSession?->display_name,
                    ucfirst((string) $mark->assessment_type),
                    (int) $mark->assessment_number,
                    (int) $mark->marks,
                    $mark->is_published ? 'Published' : 'Unpublished',
                ], $separator);
            }

            fclose($handle);
        }, $fileName, [
            'Content-Type' => $contentType,
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
        ]);
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
            'curriculum_mapping_id' => ['nullable', 'integer'],
            'curriculum_unit_id' => ['nullable', 'integer'],
            'academic_year_id' => ['nullable', 'integer'],
            'academic_session_id' => ['nullable', 'integer'],
        ]);

        $mappingId = isset($validated['curriculum_mapping_id']) ? (int) $validated['curriculum_mapping_id'] : null;
        $unitId = isset($validated['curriculum_unit_id']) ? (int) $validated['curriculum_unit_id'] : null;
        $academicYearId = isset($validated['academic_year_id']) ? (int) $validated['academic_year_id'] : null;
        $academicSessionId = isset($validated['academic_session_id']) ? (int) $validated['academic_session_id'] : null;
        $selectedUnit = $this->resolveSelectedUnit($mappingId, $unitId);
        $sheet = $selectedUnit
            ? $this->buildMarksheet(
                $selectedUnit,
                $academicYearId,
                $academicSessionId,
                $request->integer('page', 1)
            )
            : null;

        return Inertia::render('Grades/Marksheet', [
            'filters' => [
                'curriculum_mapping_id' => $mappingId ? (string) $mappingId : '',
                'curriculum_unit_id' => $unitId ? (string) $unitId : '',
                'academic_year_id' => $academicYearId ? (string) $academicYearId : '',
                'academic_session_id' => $academicSessionId ? (string) $academicSessionId : '',
            ],
            'selected_unit' => $this->unitPayload($selectedUnit),
            'course_mappings' => $this->courseMappingOptions($request),
            'unit_options' => $this->unitOptions($mappingId, $request),
            'filter_options' => $selectedUnit
                ? $this->filterOptions($selectedUnit->id, null, null, $academicYearId, $academicSessionId)
                : ['sessions' => [], 'academic_years' => [], 'assessment_numbers' => []],
            'marksheet' => $sheet,
            'blocker' => $unitId && ! $selectedUnit
                ? 'Select a valid unit from the chosen course mapping.'
                : null,
            'can_publish' => $this->canPublishMarks($request),
            'selected_filters' => [
                'academic_year' => $this->academicYearPayload($academicYearId),
                'academic_session' => $this->academicSessionPayload($academicSessionId),
            ],
        ]);
    }

    public function marksheetExport(Request $request): StreamedResponse
    {
        $validated = $request->validate([
            'curriculum_mapping_id' => ['nullable', 'integer'],
            'curriculum_unit_id' => ['required', 'integer'],
            'academic_year_id' => ['nullable', 'integer'],
            'academic_session_id' => ['nullable', 'integer'],
            'format' => ['required', 'in:csv,excel'],
        ]);

        $mappingId = isset($validated['curriculum_mapping_id']) ? (int) $validated['curriculum_mapping_id'] : null;
        $unitId = (int) $validated['curriculum_unit_id'];
        $academicYearId = isset($validated['academic_year_id']) ? (int) $validated['academic_year_id'] : null;
        $academicSessionId = isset($validated['academic_session_id']) ? (int) $validated['academic_session_id'] : null;
        $unit = $this->resolveSelectedUnit($mappingId, $unitId);

        abort_unless($unit, 422, 'Select a valid unit before downloading the marksheet.');

        $format = $validated['format'];
        $separator = $format === 'excel' ? "\t" : ',';
        $extension = $format === 'excel' ? 'xls' : 'csv';
        $contentType = $format === 'excel'
            ? 'application/vnd.ms-excel; charset=UTF-8'
            : 'text/csv; charset=UTF-8';
        $fileName = 'marksheet-'.($unit->code ?? 'unit').'-'.now()->format('Y-m-d-His').'.'.$extension;
        $query = $this->marksheetRowsQuery($unitId, $academicYearId, $academicSessionId);

        set_time_limit(60);

        return response()->streamDownload(function () use ($query, $separator) {
            $handle = fopen('php://output', 'wb');
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'Admission Number',
                'Student Name',
                'FA 1',
                'FA 2',
                'FA 3',
                'Theory Average',
                'Pract 1',
                'Pract 2',
                'Pract 3',
                'Practical Average',
            ], $separator);

            $count = 0;

            foreach ($query->cursor() as $row) {
                fputcsv($handle, [
                    $row->admission_number ?? '',
                    trim(($row->first_name ?? '').' '.($row->last_name ?? '')),
                    $row->theory_fa1 ?? '',
                    $row->theory_fa2 ?? '',
                    $row->theory_fa3 ?? '',
                    $row->theory_average !== null ? number_format((float) $row->theory_average, 1) : '',
                    $row->practical_fa1 ?? '',
                    $row->practical_fa2 ?? '',
                    $row->practical_fa3 ?? '',
                    $row->practical_average !== null ? number_format((float) $row->practical_average, 1) : '',
                ], $separator);

                $count++;

                if ($count % 100 === 0) {
                    fflush($handle);
                }
            }

            fclose($handle);
        }, $fileName, [
            'Content-Type' => $contentType,
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
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
                'name' => $student->full_name,
                'admission_number' => $student->admission_number,
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
            $includeHistoryFilters
                ? $this->normalizeAssessmentType($request->query('assessment_type'))
                : ($request->string('assessment_type')->toString() ?: 'theory'),
            $includeHistoryFilters
                ? $this->normalizeAssessmentNumber($request->query('assessment_number'))
                : max(1, $request->integer('assessment_number') ?: 1),
        ];

        if (! $includeHistoryFilters) {
            return $filters;
        }

        $filters[] = $request->integer('academic_session_id') ?: null;
        $filters[] = $request->integer('academic_year_id') ?: null;

        return $filters;
    }

    private function selectionFiltersArray(
        ?int $mappingId,
        ?int $unitId,
        ?string $type,
        ?int $number,
        ?int $academicSessionId = null,
        ?int $academicYearId = null,
    ): array {
        return [
            'curriculum_mapping_id' => $mappingId ? (string) $mappingId : '',
            'curriculum_unit_id' => $unitId ? (string) $unitId : '',
            'assessment_type' => $type ?? '',
            'assessment_number' => $number ? (string) $number : '',
            'academic_session_id' => $academicSessionId ? (string) $academicSessionId : '',
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
            'display_name' => $this->unitDisplayName($unit),
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
                'name' => trim(
                    ($mapping->curriculum?->name ?? '').' - '.($mapping->course?->name ?? ''),
                    ' -'
                ),
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
                'name' => $this->unitDisplayName($unit),
            ])
            ->values()
            ->all();
    }

    private function unitDisplayName(Unit $unit): string
    {
        return trim(($unit->code ?? '').' - '.($unit->name ?? ''), ' -');
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
                    $query->whereIn('admission_number', $registrationNumbers);
                }

                if ($numericIds !== []) {
                    $query->orWhereIn('id', $numericIds);
                }
            })
            ->get();

        $keyed = collect();

        foreach ($students as $student) {
            $keyed->put($this->normalizeStudentIdentifier($student->admission_number), $student);
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
        ?string $type,
        ?int $number,
        ?int $academicSessionId,
        ?int $academicYearId,
        int $page = 1,
    ): array {
        $query = $this->marksQuery(
            $unitId,
            $type,
            $number,
            $academicSessionId,
            $academicYearId
        );

        $paginator = $query
            ->orderBy('assessment_type')
            ->orderBy('assessment_number')
            ->orderBy('student_id')
            ->paginate(25, ['*'], 'page', $page)
            ->withQueryString();

        $paginator->setCollection(
            $paginator->getCollection()->map(fn (StudentMark $mark) => [
                'id' => $mark->id,
                'admission_number' => $mark->student?->admission_number,
                'student_name' => $mark->student?->full_name,
                'unit_name' => $mark->curriculumUnit?->name,
                'assessment_type' => ucfirst($mark->assessment_type),
                'assessment_number' => (int) $mark->assessment_number,
                'session_name' => $mark->academicSession?->display_name,
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
        ?string $type,
        ?int $number,
        ?int $academicSessionId,
        ?int $academicYearId,
        int $page = 1,
    ): array {
        $query = $this->marksQuery(
            $unitId,
            $type,
            $number,
            $academicSessionId,
            $academicYearId
        );

        $paginator = $query
            ->orderBy('assessment_type')
            ->orderBy('assessment_number')
            ->orderBy('student_id')
            ->paginate(25, ['*'], 'page', $page)
            ->withQueryString();

        $paginator->setCollection(
            $paginator->getCollection()->map(fn (StudentMark $mark) => [
                'id' => $mark->id,
                'admission_number' => $mark->student?->admission_number,
                'student_name' => $mark->student?->full_name,
                'unit_name' => $mark->curriculumUnit?->name,
                'assessment_type' => ucfirst($mark->assessment_type),
                'assessment_number' => (int) $mark->assessment_number,
                'session_name' => $mark->academicSession?->display_name,
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

    private function filterOptions(
        int $unitId,
        ?string $type,
        ?int $number,
        ?int $selectedAcademicYearId = null,
        ?int $selectedAcademicSessionId = null,
    ): array {
        $yearsQuery = StudentMark::query()
            ->join('academic_sessions as acs', 'acs.id', '=', 'student_marks.academic_session_id')
            ->join('academic_years as ay', 'ay.id', '=', 'acs.academic_year_id')
            ->where('student_marks.curriculum_unit_id', $unitId);

        $this->applyAssessmentFilters($yearsQuery, $type, $number);

        $years = $yearsQuery
            ->distinct()
            ->orderByDesc('ay.academic_year')
            ->get(['ay.id', 'ay.label', 'ay.academic_year'])
            ->map(fn ($year) => [
                'value' => (string) $year->id,
                'label' => trim(($year->label ?? '').' '.($year->academic_year ?? '')),
            ])
            ->unique('value')
            ->values();

        $sessionsQuery = StudentMark::query()
            ->join('academic_sessions as acs2', 'acs2.id', '=', 'student_marks.academic_session_id')
            ->join('academic_years as ay2', 'ay2.id', '=', 'acs2.academic_year_id')
            ->where('student_marks.curriculum_unit_id', $unitId);

        $this->applyAssessmentFilters($sessionsQuery, $type, $number);

        if ($selectedAcademicYearId !== null) {
            $sessionsQuery->where('acs2.academic_year_id', $selectedAcademicYearId);
        }

        $sessions = $sessionsQuery
            ->distinct()
            ->orderBy('acs2.session_No')
            ->get(['acs2.id', 'acs2.session_No', 'acs2.session_number', 'acs2.label', 'ay2.label as academic_year_label', 'ay2.academic_year'])
            ->map(fn ($session) => [
                'value' => (string) $session->id,
                'label' => trim(
                    ($session->academic_year_label ?: $session->academic_year).
                    ' - Session '.($session->session_number ?? $session->session_No),
                    ' -'
                ),
            ])
            ->unique('value')
            ->values();

        $numbersQuery = StudentMark::query()->where('curriculum_unit_id', $unitId);

        $this->applyAssessmentFilters($numbersQuery, $type, null);
        $this->applyYearSessionFilters($numbersQuery, $selectedAcademicYearId, $selectedAcademicSessionId);

        $assessmentNumbers = $numbersQuery
            ->distinct()
            ->orderBy('assessment_number')
            ->pluck('assessment_number')
            ->filter()
            ->map(fn ($assessmentNumber) => [
                'value' => (string) (int) $assessmentNumber,
                'label' => 'Assessment '.(int) $assessmentNumber,
            ])
            ->values();

        return [
            'sessions' => $sessions,
            'academic_years' => $years,
            'assessment_numbers' => $assessmentNumbers,
        ];
    }

    private function publishFilterOptions(
        int $unitId,
        ?string $type,
        ?int $number,
        ?int $selectedAcademicYearId = null,
        ?int $selectedAcademicSessionId = null,
    ): array {
        return $this->filterOptions(
            $unitId,
            $type,
            $number,
            $selectedAcademicYearId,
            $selectedAcademicSessionId
        );
    }

    private function buildMarksheet(
        Unit $unit,
        ?int $academicYearId,
        ?int $academicSessionId,
        int $page = 1,
    ): array
    {
        $paginator = $this->marksheetRowsQuery(
            $unit->id,
            $academicYearId,
            $academicSessionId
        )
            ->paginate(25, ['*'], 'page', $page)
            ->withQueryString();

        $marks = $paginator->getCollection();

        $selectedSession = $academicSessionId
            ? AcademicSession::query()
                ->with('academicYear:id,label,academic_year')
                ->find($academicSessionId, [
                    'id',
                    'academic_year_id',
                    'start_date',
                    'end_date',
                    'session_number',
                    'session_No',
                    'label',
                ])
            : null;

        $groupedRows = $marks
            ->map(function ($row) {
                return [
                    'admission_number' => $row->admission_number ?? '',
                    'student_name' => trim(($row->first_name ?? '').' '.($row->last_name ?? '')),
                    'theory' => [
                        1 => $row->theory_fa1 !== null ? (string) (int) $row->theory_fa1 : '',
                        2 => $row->theory_fa2 !== null ? (string) (int) $row->theory_fa2 : '',
                        3 => $row->theory_fa3 !== null ? (string) (int) $row->theory_fa3 : '',
                    ],
                    'practical' => [
                        1 => $row->practical_fa1 !== null ? (string) (int) $row->practical_fa1 : '',
                        2 => $row->practical_fa2 !== null ? (string) (int) $row->practical_fa2 : '',
                        3 => $row->practical_fa3 !== null ? (string) (int) $row->practical_fa3 : '',
                    ],
                    'theory_average' => $row->theory_average !== null
                        ? number_format((float) $row->theory_average, 1)
                        : '',
                    'practical_average' => $row->practical_average !== null
                        ? number_format((float) $row->practical_average, 1)
                        : '',
                ];
            })
            ->sortBy('admission_number')
            ->values();

        return [
            'meta' => [
                'assessment_center_code' => '',
                'assessment_center_name' => config('app.name'),
                'course_code' => $unit->curriculumMapping?->course?->code ?? '',
                'course_title' => $unit->curriculumMapping?->course?->name ?? '',
                'unit_code' => $unit->code,
                'unit_title' => $unit->name,
                'term_from' => $selectedSession?->start_date,
                'term_to' => $selectedSession?->end_date,
                'session_name' => $selectedSession?->display_name,
            ],
            'rows' => $groupedRows->all(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
            ],
        ];
    }

    private function marksheetRowsQuery(
        int $unitId,
        ?int $academicYearId,
        ?int $academicSessionId,
    ) {
        return StudentMark::query()
            ->join('students', 'students.id', '=', 'student_marks.student_id')
            ->join('academic_sessions', 'academic_sessions.id', '=', 'student_marks.academic_session_id')
            ->where('student_marks.curriculum_unit_id', $unitId)
            ->when($academicYearId, fn ($query) => $query->where('academic_sessions.academic_year_id', $academicYearId))
            ->when($academicSessionId, fn ($query) => $query->where('student_marks.academic_session_id', $academicSessionId))
            ->groupBy('students.id', 'students.admission_number', 'students.first_name', 'students.last_name')
            ->orderBy('students.id')
            ->selectRaw('
                students.id as student_id,
                students.admission_number,
                students.first_name,
                students.last_name,
                MAX(CASE WHEN student_marks.assessment_type = \'theory\' AND student_marks.assessment_number = 1 THEN student_marks.marks END) as theory_fa1,
                MAX(CASE WHEN student_marks.assessment_type = \'theory\' AND student_marks.assessment_number = 2 THEN student_marks.marks END) as theory_fa2,
                MAX(CASE WHEN student_marks.assessment_type = \'theory\' AND student_marks.assessment_number = 3 THEN student_marks.marks END) as theory_fa3,
                AVG(CASE WHEN student_marks.assessment_type = \'theory\' THEN student_marks.marks END) as theory_average,
                MAX(CASE WHEN student_marks.assessment_type = \'practical\' AND student_marks.assessment_number = 1 THEN student_marks.marks END) as practical_fa1,
                MAX(CASE WHEN student_marks.assessment_type = \'practical\' AND student_marks.assessment_number = 2 THEN student_marks.marks END) as practical_fa2,
                MAX(CASE WHEN student_marks.assessment_type = \'practical\' AND student_marks.assessment_number = 3 THEN student_marks.marks END) as practical_fa3,
                AVG(CASE WHEN student_marks.assessment_type = \'practical\' THEN student_marks.marks END) as practical_average
            ');
    }

    private function marksQuery(
        int $unitId,
        ?string $type,
        ?int $number,
        ?int $academicSessionId,
        ?int $academicYearId,
    ) {
        $query = StudentMark::query()
            ->with([
                'student',
                'curriculumUnit:id,name',
                'academicSession:id,academic_year_id,session_number,session_No,label',
                'academicSession.academicYear:id,label,academic_year',
            ])
            ->where('curriculum_unit_id', $unitId);

        $this->applyAssessmentFilters($query, $type, $number);
        $this->applyYearSessionFilters($query, $academicYearId, $academicSessionId);

        return $query;
    }

    private function applyAssessmentFilters($query, ?string $type, ?int $number): void
    {
        if ($type !== null) {
            $query->where('assessment_type', $type);
        }

        if ($number !== null) {
            $query->where('assessment_number', $number);
        }
    }

    private function applyYearSessionFilters($query, ?int $academicYearId, ?int $academicSessionId): void
    {
        if ($academicYearId !== null) {
            $query->whereHas('academicSession', fn ($sessionQuery) => $sessionQuery->where('academic_year_id', $academicYearId));
        }

        if ($academicSessionId !== null) {
            $query->where('academic_session_id', $academicSessionId);
        }
    }

    private function normalizeAssessmentType(mixed $value): ?string
    {
        $type = trim((string) ($value ?? ''));

        return in_array($type, ['theory', 'practical'], true) ? $type : null;
    }

    private function normalizeAssessmentNumber(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        $number = (int) $value;

        return $number > 0 ? $number : null;
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
            'name' => $year->label ?: $year->academic_year,
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
