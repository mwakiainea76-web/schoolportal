<?php

namespace App\Http\Controllers;

use App\Filters\FeeAssignmentFilter;
use App\Http\Requests\StoreFeeAssignmentRequest;
use App\Http\Requests\UpdateFeeAssignmentRequest;
use App\Models\AcademicSessionEnrollment;
use App\Models\AcademicYear;
use App\Models\CertificationLevel;
use App\Models\CourseVersionMapping;
use App\Models\Department;
use App\Models\FeeAssignment;
use App\Models\FeePlan;
use App\Models\StudentInvoice;
use App\Services\FeeAssignmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class FeeAssignmentController extends Controller
{
    protected FeeAssignmentService $feeAssignmentService;

    public function __construct(FeeAssignmentService $feeAssignmentService)
    {
        $this->feeAssignmentService = $feeAssignmentService;
    }

    /* =========================================================
     | INDEX
     ========================================================= */
    public function index(Request $request, FeeAssignmentFilter $filter)
    {
        $query = FeeAssignment::with([
            'feePlan',
            'academicYear',
            'courseVersionMapping',
            'courseVersionMapping.course.certificationLevel',
            'createdBy',
        ]);

        // Default to only active assignments, unless explicitly requested to show all
        if ($request->query('show_inactive') != 'true') {
            $query->where('is_active', true);
        }

        $assignments = $filter->apply($query, $request->all())
            ->latest()
            ->paginate($request->get('per_page', 15))
            ->withQueryString();

        return inertia('Fees/FeeAssignments/Index', [
            'assignments' => $assignments,
            'filters' => $request->all(),
        ]);
    }

    /* =========================================================
     | CREATE
     ========================================================= */
    public function create()
    {
        $academicYear = AcademicYear::select('id', 'academic_year')
            ->orderBy('academic_year')
            ->get();

        $curriculums = CourseVersionMapping::query()
            ->with(['courseVersion:id,name', 'course:id,name'])
            ->get()
            ->map(fn (CourseVersionMapping $curriculum) => [
                'id' => $curriculum->id,
                'name' => trim(($curriculum->courseVersion?->name ?? 'Course Version').' - '.($curriculum->course?->name ?? 'Course')),
            ]);

        return inertia('Fees/FeeAssignments/Create', [
            'feePlans' => FeePlan::select('id', 'name')->get(),
            'academicYear' => $academicYear,
            'curriculums' => $curriculums,
        ]);
    }

    public function bulk()
    {
        $year = AcademicYear::select('id', 'academic_year')
            ->orderBy('academic_year')
            ->get();
        $departments = Department::select('id', 'name')
            ->orderBy('name')
            ->get();
        $certifications = CertificationLevel::select('id', 'name')
            ->orderBy('name')
            ->get();

        return inertia('Fees/FeeAssignments/BulkAssign', [
            'feePlans' => FeePlan::select('id', 'name')->orderBy('name')->get(),
            'academicYear' => $year,
            'departments' => $departments,
            'certifications' => $certifications,
        ]);
    }

    /* =========================================================
     | EDIT
     ========================================================= */
    public function edit(FeeAssignment $feeAssignment)
    {
        $year = AcademicYear::select('id', 'academic_year')
            ->orderBy('academic_year')
            ->get();

        $curriculums = CourseVersionMapping::query()
            ->with(['courseVersion:id,name', 'course:id,name'])
            ->get()
            ->map(fn (CourseVersionMapping $curriculum) => [
                'id' => $curriculum->id,
                'name' => trim(($curriculum->courseVersion?->name ?? 'Course Version').' - '.($curriculum->course?->name ?? 'Course')),
            ]);

        return inertia('Fees/FeeAssignments/Edit', [
            'assignment' => $feeAssignment->load([
                'feePlan',
                'academicYear',
                'courseVersionMapping',
            ]),
            'feePlans' => FeePlan::select('id', 'name')->get(),
            'academicYear' => $year,
            'curriculums' => $curriculums,
        ]);
    }

    /* =========================================================
     | STORE (RULE ENGINE ENTRY)
     ========================================================= */
    public function store(StoreFeeAssignmentRequest $request)
    {
        $validated = $request->validated();
        $courseVersionMappingId = $validated['course_curriculum_id'];

        DB::transaction(function () use ($validated, $courseVersionMappingId) {
            // Deactivate all existing active assignments for this combination
            FeeAssignment::query()
                ->where('academic_year_id', $validated['academic_year_id'])
                ->where('course_version_mapping_id', $courseVersionMappingId)
                ->where('year_of_study', $validated['year_of_study'])
                ->where('session_number', $validated['session_number'])
                ->where('is_active', true)
                ->update([
                    'is_active' => false,
                    'valid_to' => now()->toDateString(),
                ]);

            // Create new active assignment
            FeeAssignment::create([
                'fee_plan_id' => $validated['fee_plan_id'],
                'academic_year_id' => $validated['academic_year_id'],
                'course_version_mapping_id' => $courseVersionMappingId,
                'year_of_study' => $validated['year_of_study'],
                'session_number' => $validated['session_number'],
                'created_by' => Auth::user()->staff->id,
                'valid_from' => now()->toDateString(),
                'valid_to' => null,
                'is_active' => true,
            ]);
        });

        return redirect()
            ->route('fees.assignments.index')
            ->with('success', 'Fee assignment created successfully');
    }

    /* =========================================================
     | UPDATE (SAFE REPLACEMENT)
     ========================================================= */
    public function update(Request $request, FeeAssignment $feeAssignment)
    {
        $validated = $request->validate($this->rules($feeAssignment->id));
        $courseVersionMappingId = $validated['course_curriculum_id'];

        DB::transaction(function () use ($validated, $feeAssignment, $courseVersionMappingId) {
            // Deactivate the current assignment (being replaced)
            $feeAssignment->update([
                'is_active' => false,
                'valid_to' => now()->toDateString(),
            ]);

            // Deactivate any other active assignment for the target combination
            FeeAssignment::query()
                ->where('academic_year_id', $validated['academic_year_id'])
                ->where('course_version_mapping_id', $courseVersionMappingId)
                ->where('year_of_study', $validated['year_of_study'])
                ->where('session_number', $validated['session_number'])
                ->where('is_active', true)
                ->update([
                    'is_active' => false,
                    'valid_to' => now()->toDateString(),
                ]);

            // Create new active assignment
            FeeAssignment::create([
                'fee_plan_id' => $validated['fee_plan_id'],
                'academic_year_id' => $validated['academic_year_id'],
                'course_version_mapping_id' => $courseVersionMappingId,
                'year_of_study' => $validated['year_of_study'],
                'session_number' => $validated['session_number'],
                'created_by' => Auth::user()->staff->id,
                'valid_from' => now()->toDateString(),
                'valid_to' => null,
                'is_active' => true,
            ]);
        });

        return back()->with('success', 'Fee assignment updated');
    }

    /* =========================================================
     | DELETE
     ========================================================= */
    public function destroy(FeeAssignment $feeAssignment)
    {
        $feeAssignment->delete();

        return back()->with('success', 'Fee assignment deleted');
    }

    /* =========================================================
     | RESTORE (Soft Delete Restore)
     ========================================================= */
    public function restore($id)
    {
        $assignment = FeeAssignment::withTrashed()->findOrFail($id);
        $assignment->restore();

        return back()->with('success', 'Fee assignment restored');
    }

    /* =========================================================
     | SHOW
     ========================================================= */
    public function show(FeeAssignment $feeAssignment)
    {
        return inertia('Fees/FeeAssignments/Show', [
            'assignment' => $feeAssignment->load([
                'feePlan',
                'academicYear',
                'courseVersionMapping',
                'createdBy',
            ]),
        ]);
    }

    /* =========================================================
     | APPROVAL
     ========================================================= */
    public function approval(Request $request, FeeAssignment $feeAssignment)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
        ]);

        $feeAssignment->update([
            'approval_status' => $request->action === 'approve' ? 'approved' : 'rejected',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return back()->with('success', 'Fee assignment approval updated');
    }

    /* =========================================================
     | SEARCH
     ========================================================= */
    public function search(Request $request)
    {
        return FeeAssignment::with([
            'feePlan:id,name',
            'courseVersionMapping:id,course_id,course_version_id',
            'courseVersionMapping.course:id,name',
            'courseVersionMapping.courseVersion:id,name',
        ])
            ->when($request->search, function ($q, $search) {
                $q->where(function ($query) use ($search) {
                    $query->whereHas('feePlan', fn ($feePlanQuery) => $feePlanQuery->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('courseVersionMapping.course', fn ($courseQuery) => $courseQuery->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('courseVersionMapping.courseVersion', fn ($versionQuery) => $versionQuery->where('name', 'like', "%{$search}%"));
                });
            })
            ->limit(20)
            ->get()
            ->map(fn (FeeAssignment $assignment) => [
                'id' => $assignment->id,
                'name' => collect([
                    $assignment->feePlan?->name,
                    $assignment->courseVersionMapping?->course?->name,
                    $assignment->courseVersionMapping?->courseVersion?->name,
                ])->filter()->implode(' - '),
            ]);
    }

    /* =========================================================
     | RESOLVE (Get active assignment for a student)
     ========================================================= */
    public function resolve(Request $request)
    {
        $validated = $request->validate([
            'enrollment_id' => 'required|exists:academic_session_enrollments,id',
        ]);

        $enrollment = AcademicSessionEnrollment::findOrFail($validated['enrollment_id']);

        $assignment = FeeAssignment::query()
            ->where('course_version_mapping_id', $enrollment->courseEnrollment?->course_version_mapping_id)
            ->where('year_of_study', $enrollment->year_of_study)
            ->where('session_number', $enrollment->academicSession->session_No ?? 1)
            ->where('is_active', true)
            ->first();

        if (! $assignment) {
            return response()->json([
                'message' => 'No active fee assignment found for this enrollment.',
            ], 404);
        }

        return response()->json([
            'assignment' => [
                'id' => $assignment->id,
                'fee_plan_id' => $assignment->fee_plan_id,
                'fee_plan_name' => $assignment->feePlan?->name,
                'academic_year_id' => $assignment->academic_year_id,
                'course_curriculum_id' => $assignment->course_version_mapping_id,
                'year_of_study' => $assignment->year_of_study,
                'session_number' => $assignment->session_number,
                'valid_from' => $assignment->valid_from,
                'valid_to' => $assignment->valid_to,
            ],
        ]);
    }

    public function bulkCertificationLevels(Request $request)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'q' => 'nullable|string',
        ]);

        $levels = CertificationLevel::query()
            ->whereHas('courses', function ($query) use ($validated) {
                $query->where('department_id', $validated['department_id'])
                    ->whereNull('deleted_at');
            })
            ->when($validated['q'] ?? null, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->limit(20)
            ->get(['id', 'name']);

        return response()->json($levels->values());
    }

    public function bulkCourseVersions(Request $request)
    {
        $validated = $request->validate([
            'fee_plan_id' => 'required|exists:fee_plans,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'department_id' => 'required|exists:departments,id',
            'certification_level_id' => 'required|exists:certification_levels,id',
            'year_of_study' => 'required|integer|min:1|max:20',
            'session_number' => 'required|integer|min:1|max:20',
        ]);

        $curriculums = CourseVersionMapping::query()
            ->active()
            ->with([
                'courseVersion:id,name',
                'course:id,name,department_id,certification_level_id',
                'course.certificationLevel:id,name',
            ])
            ->whereHas('course', function ($query) use ($validated) {
                $query->where('department_id', $validated['department_id'])
                    ->where('is_active', true)
                    ->where('certification_level_id', $validated['certification_level_id']);
            })
            ->orderBy('course_version_id')
            ->get();

        $existingAssignments = FeeAssignment::query()
            ->with('feePlan:id,name')
            ->where('academic_year_id', $validated['academic_year_id'])
            ->where('year_of_study', $validated['year_of_study'])
            ->where('session_number', $validated['session_number'])
            ->where('is_active', true)
            ->whereIn('course_version_mapping_id', $curriculums->pluck('id'))
            ->orderByDesc('id')
            ->get()
            ->unique('course_version_mapping_id')
            ->keyBy('course_version_mapping_id');

        return response()->json([
            'rows' => $curriculums->map(function (CourseVersionMapping $curriculum) use ($existingAssignments, $validated) {
                $assignment = $existingAssignments->get($curriculum->id);

                return [
                    'id' => $curriculum->id,
                    'course_name' => $curriculum->course?->name,
                    'curriculum_name' => $curriculum->courseVersion?->name ?? $curriculum->name,
                    'certification_level_name' => $curriculum->course?->certificationLevel?->name,
                    'is_assigned' => (int) $assignment?->fee_plan_id === (int) $validated['fee_plan_id'],
                    'has_other_fee_plan' => $assignment && (int) $assignment->fee_plan_id !== (int) $validated['fee_plan_id'],
                    'assigned_fee_plan_id' => $assignment?->fee_plan_id,
                    'year_of_study' => $assignment?->year_of_study,
                    'session_number' => $assignment?->session_number,
                    'assigned_fee_plan_name' => $assignment?->feePlan?->name,
                ];
            })->values(),
        ]);
    }

    /* =========================================================
     | BULK ASSIGNMENT (CORE FEATURE)
     ========================================================= */
    public function bulkAssign(Request $request)
    {
        $validated = $request->validate([
            'fee_plan_id' => 'required|exists:fee_plans,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'department_id' => 'nullable|exists:departments,id',
            'certification_level_id' => 'nullable|exists:certification_levels,id',
            'year_of_study' => 'required|integer|min:1|max:20',
            'session_number' => 'required|integer|min:1|max:20',
            'visible_course_curriculum_ids' => 'required|array|min:1',
            'visible_course_curriculum_ids.*' => 'integer|exists:course_version_mappings,id',
            'selected_course_curriculum_ids' => 'nullable|array',
            'selected_course_curriculum_ids.*' => 'integer|exists:course_version_mappings,id',
        ]);

        $visibleIds = collect($validated['visible_course_curriculum_ids'])
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values();

        $selectedIds = collect($validated['selected_course_curriculum_ids'] ?? [])
            ->map(fn ($id) => (int) $id)
            ->intersect($visibleIds)
            ->unique()
            ->values();

        DB::transaction(function () use ($validated, $visibleIds, $selectedIds) {
            // Deactivate ALL assignments for these curricula in this combination (including selected)
            FeeAssignment::query()
                ->where('academic_year_id', $validated['academic_year_id'])
                ->where('year_of_study', $validated['year_of_study'])
                ->where('session_number', $validated['session_number'])
                ->whereIn('course_version_mapping_id', $visibleIds)
                ->where('is_active', true)
                ->update([
                    'is_active' => false,
                    'valid_to' => now()->toDateString(),
                ]);

            // Create new active assignments for selected curricula
            foreach ($selectedIds as $courseCourseVersionId) {
                FeeAssignment::create([
                    'fee_plan_id' => $validated['fee_plan_id'],
                    'academic_year_id' => $validated['academic_year_id'],
                    'course_version_mapping_id' => $courseCourseVersionId,
                    'year_of_study' => $validated['year_of_study'],
                    'session_number' => $validated['session_number'],
                    'created_by' => Auth::user()->staff->id,
                    'valid_from' => now()->toDateString(),
                    'valid_to' => null,
                    'is_active' => true,
                ]);
            }
        });

        return redirect()
            ->route('fees.assignments.bulk')
            ->with('success', 'CourseVersion fee assignments updated successfully.');
    }

    /* =========================================================
     | BULK REPLACE (Replace fee plan assignments in bulk)
     ========================================================= */
    public function bulkReplace(Request $request)
    {
        $validated = $request->validate([
            'from_fee_plan_id' => 'required|exists:fee_plans,id',
            'to_fee_plan_id' => 'required|exists:fee_plans,id|different:from_fee_plan_id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'year_of_study' => 'required|integer|min:1|max:20',
            'session_number' => 'required|integer|min:1|max:20',
        ]);

        $updated = DB::transaction(function () use ($validated) {
            // Deactivate current assignments for the source fee plan
            FeeAssignment::query()
                ->where('fee_plan_id', $validated['from_fee_plan_id'])
                ->where('academic_year_id', $validated['academic_year_id'])
                ->where('year_of_study', $validated['year_of_study'])
                ->where('session_number', $validated['session_number'])
                ->where('is_active', true)
                ->update([
                    'is_active' => false,
                    'valid_to' => now()->toDateString(),
                ]);

            // Get the course_curriculum_ids from the deactivated assignments
            $curriculumIds = FeeAssignment::query()
                ->where('fee_plan_id', $validated['from_fee_plan_id'])
                ->where('academic_year_id', $validated['academic_year_id'])
                ->where('year_of_study', $validated['year_of_study'])
                ->where('session_number', $validated['session_number'])
                ->pluck('course_version_mapping_id');

            if ($curriculumIds->isEmpty()) {
                return 0;
            }

            // Deactivate any existing active assignments for the target fee plan with these curricula
            FeeAssignment::query()
                ->where('fee_plan_id', $validated['to_fee_plan_id'])
                ->whereIn('course_version_mapping_id', $curriculumIds)
                ->where('is_active', true)
                ->update([
                    'is_active' => false,
                    'valid_to' => now()->toDateString(),
                ]);

            // Create new assignments with the target fee plan
            $count = 0;
            foreach ($curriculumIds as $curriculumId) {
                FeeAssignment::create([
                    'fee_plan_id' => $validated['to_fee_plan_id'],
                    'academic_year_id' => $validated['academic_year_id'],
                    'course_version_mapping_id' => $curriculumId,
                    'year_of_study' => $validated['year_of_study'],
                    'session_number' => $validated['session_number'],
                    'created_by' => Auth::user()->staff->id,
                    'valid_from' => now()->toDateString(),
                    'valid_to' => null,
                    'is_active' => true,
                ]);
                $count++;
            }

            return $count;
        });

        return redirect()
            ->route('fees.assignments.index')
            ->with('success', "{$updated} fee assignments replaced successfully.");
    }

    /* =========================================================
     | BULK PREVIEW (Preview bulk replacement before applying)
     ========================================================= */
    public function bulkPreview(Request $request)
    {
        $validated = $request->validate([
            'from_fee_plan_id' => 'required|exists:fee_plans,id',
            'to_fee_plan_id' => 'required|exists:fee_plans,id|different:from_fee_plan_id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'year_of_study' => 'required|integer|min:1|max:20',
            'session_number' => 'required|integer|min:1|max:20',
        ]);

        $affected = FeeAssignment::query()
            ->with([
                'feePlan:id,name',
                'courseVersionMapping:id,course_version_id,course_id',
                'courseVersionMapping.courseVersion:id,name',
            ])
            ->where('fee_plan_id', $validated['from_fee_plan_id'])
            ->where('academic_year_id', $validated['academic_year_id'])
            ->where('year_of_study', $validated['year_of_study'])
            ->where('session_number', $validated['session_number'])
            ->where('is_active', true)
            ->get();

        $toFeePlan = FeePlan::select('id', 'name')->find($validated['to_fee_plan_id']);

        return Inertia::render('Fees/FeeAssignments/BulkPreview', [
            'affected' => $affected,
            'toFeePlan' => $toFeePlan,
            'criteria' => [
                'from_fee_plan_id' => $validated['from_fee_plan_id'],
                'to_fee_plan_id' => $validated['to_fee_plan_id'],
                'academic_year_id' => $validated['academic_year_id'],
                'year_of_study' => $validated['year_of_study'],
                'session_number' => $validated['session_number'],
            ],
        ]);
    }

    /* =========================================================
     | VALIDATION RULES
     ========================================================= */
    private function rules(?int $ignoreId = null): array
    {
        return [
            'fee_plan_id' => 'required|exists:fee_plans,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'course_curriculum_id' => 'required|exists:course_version_mappings,id',
            'year_of_study' => 'required|integer|min:1|max:20',
            'session_number' => 'required|integer|min:1|max:20',
        ];
    }
}

