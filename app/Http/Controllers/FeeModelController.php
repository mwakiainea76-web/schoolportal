<?php

namespace App\Http\Controllers;

use App\Filters\FeeModelFilter;
use App\Http\Requests\StoreFeeModelRequest;
use App\Http\Requests\UpdateFeeModelRequest;
use App\Models\AcademicSession;
use App\Models\CourseCurriculum;
use App\Models\Department;
use App\Models\Enrollment;
use App\Models\FeeModel;
use App\Models\FeeTemplate;
use Illuminate\Http\Request;

class FeeModelController extends Controller
{
    // ---------------- INDEX ----------------
    public function index(Request $request, FeeModelFilter $filter)
    {
        $feeModels = $filter
            ->apply(
                FeeModel::with(['template', 'department', 'courseCurriculum.curriculum', 'courseCurriculum.course', 'academicSession']),
                $request->only([
                    'search', 'status', 'scope', 'priority', 'template',
                    'department', 'curriculum', 'academic_session', 'valid',
                    'sort', 'direction',
                ])
            )
            ->ordered()
            ->paginate(10)
            ->withQueryString();

        // Get filter options
        $templates = FeeTemplate::active()->orderBy('name')->get(['id', 'name']);
        $departments = Department::orderBy('name')->get(['id', 'name']);
        $courseCurricula = CourseCurriculum::query()
            ->active()
            ->with(['curriculum:id,name', 'course:id,name'])
            ->whereHas('course', fn ($query) => $query->where('is_active', true))
            ->orderByDesc('id')
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->curriculum->name.' - '.$item->course->name,
            ]);
        $academicSessions = AcademicSession::active()->orderBy('start_date', 'desc')->get(['id', 'session_No as name']);

        return inertia('Fees/FeeModels/Index', compact(
            'feeModels', 'templates', 'departments', 'courseCurricula', 'academicSessions'
        ));
    }

    // ---------------- CREATE ----------------
    public function create()
    {
        $templates = FeeTemplate::active()->orderBy('name')->get(['id', 'name']);
        $departments = Department::orderBy('name')->get(['id', 'name']);
        $courseCurricula = CourseCurriculum::query()
            ->active()
            ->with(['curriculum:id,name', 'course:id,name'])
            ->whereHas('course', fn ($query) => $query->where('is_active', true))
            ->orderByDesc('id')
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->curriculum->name.' - '.$item->course->name,
            ]);
        $academicSessions = AcademicSession::active()->orderBy('start_date', 'desc')->get(['id', 'session_No as name']);

        return inertia('Fees/FeeModels/Create', compact(
            'templates', 'departments', 'courseCurricula', 'academicSessions'
        ));
    }

    // ---------------- STORE ----------------
    public function store(StoreFeeModelRequest $request)
    {
        $priority = null;
        if ($request['scope'] == 'curriculum') {
            $priority = 80;
        } elseif ($request['scope'] == 'department') {
            $priority = 70;
        } else {
            $priority = 60;
        }

        $validated = $this->normalizeScopeFields($request->validated());
        $validated['created_by'] = auth()->id();
        $validated['priority'] = $priority;

        FeeModel::create($validated);

        return redirect()
            ->route('fees.models.index')
            ->with('success', 'Fee model created successfully.');
    }

    // ---------------- EDIT ----------------
    public function edit(FeeModel $feeModel)
    {
        $feeModel->load(['template', 'department', 'courseCurriculum.curriculum', 'courseCurriculum.course', 'academicSession']);

        $templates = FeeTemplate::active()->orderBy('name')->get(['id', 'name']);
        $departments = Department::orderBy('name')->get(['id', 'name']);
        $courseCurricula = CourseCurriculum::query()
            ->active()
            ->with(['curriculum:id,name', 'course:id,name'])
            ->whereHas('course', fn ($query) => $query->where('is_active', true))
            ->orderByDesc('id')
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->curriculum->name.' - '.$item->course->name,
            ]);
        $academicSessions = AcademicSession::active()->orderBy('start_date', 'desc')->get(['id', 'session_No as name']);

        return inertia('Fees/FeeModels/Edit', compact(
            'feeModel', 'templates', 'departments', 'courseCurricula', 'academicSessions'
        ));
    }

    // ---------------- UPDATE ----------------
    public function update(UpdateFeeModelRequest $request, FeeModel $feeModel)
    {

        $priority = null;
        if ($request['scope'] == 'curriculum') {
            $priority = 80;
        } elseif ($request['scope'] == 'department') {
            $priority = 70;
        } else {
            $priority = 60;
        }

        $validated = $this->normalizeScopeFields($request->validated());
        $validated['updated_by'] = auth()->id();
        $validated['priority'] = $priority;

        $feeModel->update($validated);

        return redirect()
            ->route('fees.models.index')
            ->with('success', 'Fee model updated successfully.');
    }

    // ---------------- DELETE ----------------
    public function destroy(FeeModel $feeModel)
    {
        $feeModel->delete();

        return redirect()
            ->back()
            ->with('success', 'Fee model deleted successfully.');
    }

    // ---------------- SEARCH ----------------
    public function search(Request $request)
    {
        $term = $request->get('q');
        $query = FeeModel::with(['template', 'courseCurriculum.curriculum', 'courseCurriculum.course'])
            ->active();

        if ($request->filled('enrollment_id')) {
            $enrollment = Enrollment::with([
                'courseEnrollment.courseCurriculum.course',
                'courseEnrollment.courseCurriculum.curriculum',
                'academicSession',
            ])->find($request->integer('enrollment_id'));

            if ($enrollment) {
                $query->forEnrollmentContext($enrollment);
            }
        }

        return $query
            ->where(function ($query) use ($term) {
                $query->whereHas('template', function ($q) use ($term) {
                    $q->where('name', 'like', '%'.$term.'%');
                })->orWhereHas('courseCurriculum.curriculum', function ($q) use ($term) {
                    $q->where('name', 'like', '%'.$term.'%');
                })->orWhereHas('courseCurriculum.course', function ($q) use ($term) {
                    $q->where('name', 'like', '%'.$term.'%')
                        ->orWhere('code', 'like', '%'.$term.'%');
                })->orWhereHas('department', function ($q) use ($term) {
                    $q->where('name', 'like', '%'.$term.'%');
                });
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($model) {
                return [
                    'id' => $model->id,
                    'name' => $model->display_name,
                ];
            });
    }

    private function normalizeScopeFields(array $validated): array
    {
        if (($validated['scope'] ?? null) !== 'department') {
            $validated['department_id'] = null;
        }

        if (($validated['scope'] ?? null) !== 'curriculum') {
            $validated['course_curriculum_id'] = null;
        }

        return $validated;
    }
}
