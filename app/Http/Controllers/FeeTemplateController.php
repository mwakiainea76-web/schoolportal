<?php

namespace App\Http\Controllers;

use App\Filters\FeeTemplateFilter;
use App\Http\Requests\StoreFeeTemplateRequest;
use App\Http\Requests\UpdateFeeTemplateRequest;
use App\Models\FeeTemplate;
use Illuminate\Http\Request;

class FeeTemplateController extends Controller
{
    // ---------------- INDEX ----------------
    public function index(Request $request, FeeTemplateFilter $filter)
    {
        $templates = $filter
            ->apply(
                FeeTemplate::query(),
                $request->only(['search', 'status', 'reusable', 'sort', 'direction'])
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Fees/FeeTemplates/Index', compact('templates'));
    }

    // ---------------- CREATE ----------------
    public function create()
    {
        return inertia('Fees/FeeTemplates/Create');
    }

    // ---------------- STORE ----------------
    public function store(StoreFeeTemplateRequest $request)
    {
        FeeTemplate::create($request->validated());

        return redirect()
            ->route('fees.templates.create')
            ->with('success', 'Fee template created successfully.');
    }

    // ---------------- EDIT ----------------
    public function edit(FeeTemplate $template)
    {
        return inertia('Fees/FeeTemplates/Edit', [
            'template' => $template,
        ]);
    }

    // ---------------- UPDATE ----------------
    public function update(UpdateFeeTemplateRequest $request, FeeTemplate $template)
    {
        $template->update($request->validated());

        return redirect()
            ->route('fees.templates.index')
            ->with('success', 'Fee template updated successfully.');
    }

    // ---------------- DELETE ----------------
    public function destroy(FeeTemplate $template)
    {
        $template->delete();

        return redirect()
            ->back()
            ->with('success', 'Fee template deleted.');
    }
}
