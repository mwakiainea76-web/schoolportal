<?php

namespace App\Http\Controllers;

use App\Models\FeeComponent;
use App\Models\FeeTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeeComponentController extends Controller
{
    public function index(Request $request)
    {
        $components = FeeComponent::query()
            ->with('template:id,name')
            ->when($request->search, function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('type', 'like', "%{$request->search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Fees/FeeComponents/Index', [
            'components' => $components,
        ]);
    }

    public function create()
    {
        return Inertia::render('Fees/FeeComponents/Create', [
            'templates' => FeeTemplate::select('id', 'name')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fee_template_id' => ['required', 'exists:fee_templates,id'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string'],
            'amount' => ['required', 'numeric', 'min:0'],
            'frequency' => ['required', 'in:admission,always,session,year'],
            'is_optional' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        FeeComponent::create($validated);

        return redirect()
            ->route('fees.components.create')
            ->with('success', 'Fee component created successfully.');
    }

    public function edit(FeeComponent $feeComponent)
    {
        return Inertia::render('Fees/FeeComponents/Edit', [
            'component' => $feeComponent->load('template:id,name'),
            'templates' => FeeTemplate::select('id', 'name')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function update(Request $request, FeeComponent $feeComponent)
    {
        $validated = $request->validate([
            'fee_template_id' => ['required', 'exists:fee_templates,id'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string'],
            'amount' => ['required', 'numeric', 'min:0'],
            'frequency' => ['required', 'in:admission,always,session,year'],
            'is_optional' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $feeComponent->update($validated);

        return redirect()
            ->route('fees.components.edit', $feeComponent->id)
            ->with('success', 'Fee component updated successfully.');
    }

    public function destroy(FeeComponent $feeComponent)
    {
        $feeComponent->delete();

        return redirect()
            ->back()
            ->with('success', 'Fee component deleted successfully.');
    }
}
