<?php

namespace App\Http\Controllers;

use App\Filters\FeePlanFilter;
use App\Models\FeePlan;
use App\Models\FeePlanItem;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FeePlanController extends Controller
{
    /**
     * LIST fee plans
     */
    public function index(Request $request, FeePlanFilter $filter)
    {
        $query = FeePlan::query();

        $feePlans = $filter->apply($query, $request->all())
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Fees/FeePlans/Index', [
            'feePlans' => $feePlans,
            'filters' => $request->all(),
        ]);
    }

    /**
     * CREATE form
     */
    public function create()
    {
        return inertia('Fees/FeePlans/Create');
    }

    /**
     * STORE
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('fee_plans')->where(fn ($q) => $q->where('version', $request->version)
                ),
            ],
            'version' => 'required|string|max:50',
            'is_active' => 'required|boolean',
        ]);

        $validated['created_by'] = auth()->user()->staff->id;

        FeePlan::create($validated);

        return redirect()
            ->route('fees.plans.index')
            ->with('success', 'Fee plan created successfully');
    }

    /**
     * SHOW
     */
    public function show($id)
    {
        $feePlan = FeePlan::findOrFail($id);

        return inertia('Fees/FeePlans/Show', [
            'feePlan' => $feePlan,
        ]);
    }

    public function items($feePlan)
    {
        $feePlan = FeePlan::findOrFail($feePlan);
        $items = FeePlanItem::select('id', 'fee_plan_id', 'name', 'amount')
            ->where('fee_plan_id', $feePlan->id)
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return inertia('Fees/FeePlanItems/Index', [
            'feePlans' => $items,
            'feePlan' => $feePlan,
            'feePlanOptions' => FeePlan::all(),
        ]);
    }

    /**
     * EDIT
     */
    public function edit($id)
    {
        $feePlan = FeePlan::findOrFail($id);

        return inertia('Fees/FeePlans/Edit', [
            'feePlan' => $feePlan,
        ]);
    }

    public function search(Request $request)
    {
        return FeePlan::query()
            ->when($request->filled('q'), function ($query) use ($request) {
                $term = $request->string('q')->toString();

                $query->where(function ($nested) use ($term) {
                    $nested->where('name', 'like', "%{$term}%")
                        ->orWhere('version', 'like', "%{$term}%");
                });
            })
            ->orderBy('name')
            ->limit(20)
            ->get(['id', 'name']);
    }

    /**
     * UPDATE
     */
    public function update(Request $request, $id)
    {
        $feePlan = FeePlan::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'version' => 'required|string|max:50',
            'is_active' => 'required|boolean',
        ]);

        // FIXED: safe duplicate check (exclude current record)
        $exists = FeePlan::where('name', $validated['name'])
            ->where('version', $validated['version'])
            ->where('id', '!=', $id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'name' => 'A fee plan with this name and version already exists.',
            ])->withInput();
        }

        $feePlan->update($validated);

        return redirect()
            ->route('fees.plans.edit', $feePlan->id)
            ->with('success', 'Fee plan updated successfully');
    }

    /**
     * DELETE
     */
    public function destroy($id)
    {
        $feePlan = FeePlan::findOrFail($id);
        $feePlan->delete();

        return redirect()
            ->route('fees.plans.index')
            ->with('success', 'Fee plan deleted successfully');
    }

    /**
     * APPROVAL
     */
    public function approval(Request $request, FeePlan $feePlan)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
        ]);

        if ($request->action === 'approve') {
            $feePlan->update([
                'approval_status' => 'approved',
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);
        } else {
            $feePlan->update([
                'approval_status' => 'rejected',
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);
        }

        return redirect()->back()->with('success', 'Fee plan approval updated successfully');
    }
}
