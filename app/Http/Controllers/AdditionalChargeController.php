<?php

namespace App\Http\Controllers;

use App\Filters\AdditionalChargeFilter;
use App\Http\Requests\StoreAdditionalChargesRequest;
use App\Http\Requests\UpdateAdditionalChargesRequest;
use App\Models\AdditionalCharge;
use App\Models\FeeModel;
use Illuminate\Http\Request;

class AdditionalChargeController extends Controller
{
    // ---------------- INDEX ----------------
    public function index(Request $request, AdditionalChargeFilter $filter)
    {
        $additionalCharges = $filter
            ->apply(
                AdditionalCharge::with(['feeModel.template']),
                $request->only([
                    'search', 'frequency', 'fee_model', 'min_amount', 'max_amount',
                    'sort', 'direction',
                ])
            )
            ->ordered()
            ->paginate(10)
            ->withQueryString();

        // Get filter options
        $feeModels = FeeModel::with('template')->active()->get()->map(function ($model) {
            return [
                'id' => $model->id,
                'name' => $model->display_name,
            ];
        });

        return inertia('Fees/AdditionalCharges/Index', compact(
            'additionalCharges', 'feeModels'
        ));
    }

    // ---------------- CREATE ----------------
    public function create()
    {
        $feeModels = FeeModel::with('template')->active()->get()->map(function ($model) {
            return [
                'id' => $model->id,
                'name' => $model->display_name,
            ];
        });

        return inertia('Fees/AdditionalCharges/Create', compact('feeModels'));
    }

    // ---------------- STORE ----------------
    public function store(StoreAdditionalChargesRequest $request)
    {
        $validated = $request->validated();

        AdditionalCharge::create(
            [
                'fee_model_id' => $request['fee_model_id'],
                'name' => $request['name'],
                'amount' => $request['amount'],
                'frequency' => $request['frequency'],
                'description' => $request['description'],
            ]
        );

        return redirect()
            ->route('fees.additional-charges.index')
            ->with('success', 'Additional charge created successfully.');
    }

    // ---------------- EDIT ----------------
    public function edit(AdditionalCharge $additionalCharge)
    {
        $additionalCharge->load(['feeModel.template']);

        $feeModels = FeeModel::with('template')->active()->get()->map(function ($model) {
            return [
                'id' => $model->id,
                'name' => $model->display_name,
            ];
        });

        return inertia('Fees/AdditionalCharges/Edit', compact(
            'additionalCharge', 'feeModels'
        ));
    }

    // ---------------- UPDATE ----------------
    public function update(UpdateAdditionalChargesRequest $request, AdditionalCharge $additionalCharge)
    {
        $validated = $request->validated();

        $additionalCharge->update($validated);

        return redirect()
            ->route('fees.additional-charges.index')
            ->with('success', 'Additional charge updated successfully.');
    }

    // ---------------- DELETE ----------------
    public function destroy(AdditionalCharge $additionalCharge)
    {
        $additionalCharge->delete();

        return redirect()
            ->back()
            ->with('success', 'Additional charge deleted successfully.');
    }
}
