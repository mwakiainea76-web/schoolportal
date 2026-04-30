<?php

namespace App\Http\Controllers;

use App\Filters\UnitFilter;
use App\Http\Requests\StoreUnitRequest;
use App\Http\Requests\UpdateUnitRequest;
use App\Models\Unit;
use App\Services\UnitService;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    public function __construct(
        protected UnitService $service
    ) {
        $this->middleware('permission:units.view')->only(['index', 'show']);
        $this->middleware('permission:units.create')->only(['create', 'store']);
        $this->middleware('permission:units.edit')->only(['edit', 'update']);
        $this->middleware('permission:units.delete')->only(['destroy']);
    }

    public function index(UnitFilter $filter)
    {
        $units = Unit::query()
            ->tap(fn ($query) => $filter->apply(
                $query,
                request()->only(['search', 'sort', 'direction'])
            ))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Units/Index', [
            'units' => $units,
        ]);
    }

    public function create()
    {
        return inertia('Units/Create');
    }

    public function store(StoreUnitRequest $request)
    {
        $this->service->store($request->validated());

        return redirect()
            ->route('units.create')
            ->with('success', 'Unit created successfully.');
    }

    public function show(Unit $unit)
    {
        return inertia('Units/Edit', [
            'unit' => $unit->load(['course']),
        ]);
    }

    public function edit(Unit $unit)
    {

        return inertia('Units/Edit', [
            'unit' => $unit,
        ]);
    }

    public function update(UpdateUnitRequest $request, Unit $unit)
    {
        $this->service->update($unit, $request->validated());

        return redirect()
            ->route('units.edit', $unit->id)
            ->with('success', 'Unit updated successfully.');
    }

    public function destroy(Unit $unit)
    {
        $this->service->delete($unit);

        return redirect()
            ->route('units.index')
            ->with('success', 'Unit deleted successfully.');
    }

    public function search(Request $request)
    {
        $q = $request->q;

        $units = Unit::query()
            ->when($q, function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('code', 'like', "%{$q}%");
            })
            ->limit(10)
            ->get();

        return response()->json(
            $units->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->code.' - '.$u->name,
            ])
        );
    }
}
