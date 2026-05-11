<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFeePlanItemRequest;
use App\Http\Requests\UpdateFeePlanItemRequest;
use App\Models\FeePlan;
use App\Models\FeePlanItem;
use Inertia\Inertia;

class FeePlanItemController extends Controller
{
    /**
     * Display list page
     */
    public function index()
    {
        $items = FeePlanItem::with('feePlan')
            ->latest()
            ->paginate(20)
            ->withQueryString();
        $feePlans = FeePlan::all();

        return Inertia::render('Fees/FeePlanItems/Index', [
            'feePlans' => $items,
            'feePlanOptions' => $feePlans,
            'sort' => request('sort', 'created_at'),
            'direction' => request('direction', 'desc'),
        ]);
    }

    public function create()
    {
        $feePlans = FeePlan::all();

        return Inertia::render('Fees/FeePlanItems/Create', [
            'feePlans' => $feePlans,
        ]);
    }

    /**
     * Store new item
     */
    public function store(StoreFeePlanItemRequest $request)
    {
        $validated = $request->validated();

        FeePlanItem::create($validated);

        return redirect()
            ->back()
            ->with('success', 'Fee plan item created successfully.');
    }

    /**
     * Show edit form
     */
    public function edit(FeePlanItem $feePlanItem)
    {
        return Inertia::render('Fees/FeePlanItems/Edit', [
            'item' => $feePlanItem,
            'feePlans' => FeePlan::all(),
        ]);
    }

    /**
     * Update fee plan item
     */
    public function update(UpdateFeePlanItemRequest $request, FeePlanItem $feePlanItem)
    {
        $validated = $request->validated();

        $feePlanItem->update($validated);

        return redirect()
            ->back()
            ->with('success', 'Fee plan item updated successfully.');
    }

    /**
     * Delete item
     */
    public function destroy($id)
    {
        $item = FeePlanItem::findOrFail($id);
        $item->delete();

        return redirect()
            ->back()
            ->with('success', 'Fee plan item deleted successfully.');
    }

    /**
     * Bulk delete items
     */
    public function bulkDestroy()
    {
        $validated = request()->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:fee_plan_items,id',
        ]);

        FeePlanItem::whereIn('id', $validated['ids'])->delete();

        return redirect()
            ->back()
            ->with('success', 'Fee plan items deleted successfully.');
    }
}