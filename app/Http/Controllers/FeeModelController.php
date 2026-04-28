<?php

namespace App\Http\Controllers;

use App\Filters\FeeModelFilter;
use App\Http\Requests\StoreFeeModelRequest;
use App\Http\Requests\UpdateFeeModelRequest;
use App\Models\AcademicSession;
use App\Models\Curriculum;
use App\Models\Department;
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
                FeeModel::with(['template', 'department', 'curriculum', 'academicSession']),
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
        $curricula = Curriculum::orderBy('name')->get(['id', 'name']);
        $academicSessions = AcademicSession::active()->orderBy('start_date', 'desc')->get(['id', 'session_No as name']);

        return inertia('Fees/FeeModels/Index', compact(
            'feeModels', 'templates', 'departments', 'curricula', 'academicSessions'
        ));
    }

    // ---------------- CREATE ----------------
    public function create()
    {
        $templates = FeeTemplate::active()->orderBy('name')->get(['id', 'name']);
        $departments = Department::orderBy('name')->get(['id', 'name']);
        $curricula = Curriculum::orderBy('name')->get(['id', 'name']);
        $academicSessions = AcademicSession::active()->orderBy('start_date', 'desc')->get(['id', 'session_No as name']);

        return inertia('Fees/FeeModels/Create', compact(
            'templates', 'departments', 'curricula', 'academicSessions'
        ));
    }

    // ---------------- STORE ----------------
    public function store(StoreFeeModelRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = auth()->id();

        FeeModel::create($validated);

        return redirect()
            ->route('fees.models.index')
            ->with('success', 'Fee model created successfully.');
    }

    // ---------------- EDIT ----------------
    public function edit(FeeModel $feeModel)
    {
        $feeModel->load(['template', 'department', 'curriculum', 'academicSession']);

        $templates = FeeTemplate::active()->orderBy('name')->get(['id', 'name']);
        $departments = Department::orderBy('name')->get(['id', 'name']);
        $curricula = Curriculum::orderBy('name')->get(['id', 'name']);
        $academicSessions = AcademicSession::active()->orderBy('start_date', 'desc')->get(['id', 'session_No as name']);

        return inertia('Fees/FeeModels/Edit', compact(
            'feeModel', 'templates', 'departments', 'curricula', 'academicSessions'
        ));
    }

    // ---------------- UPDATE ----------------
    public function update(UpdateFeeModelRequest $request, FeeModel $feeModel)
    {
        $validated = $request->validated();
        $validated['updated_by'] = auth()->id();

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
        return FeeModel::with('template')
            ->active()
            ->whereHas('template', function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->get('q').'%');
            })
            ->orWhere('display_name', 'like', '%'.$request->get('q').'%')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($model) {
                return [
                    'id' => $model->id,
                    'name' => $model->display_name,
                ];
            });
    }
}
