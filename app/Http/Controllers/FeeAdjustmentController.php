<?php

namespace App\Http\Controllers;

use App\Models\FeeAdjustment;
use App\Models\StudentInvoices;
use App\Models\User;
use App\Http\Requests\StoreFeeAdjustmentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeeAdjustmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $adjustments = FeeAdjustment::with(['invoice.enrollment.student.user', 'approver'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Fees/FeeAdjustments/Index', compact('adjustments'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $invoices = StudentInvoices::with(['enrollment.student.user'])
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn ($i) => [
                'id' => $i->id,
                'name' => "Invoice #{$i->id} - " . ($i->enrollment->student->user->first_name ?? '') . ' ' . ($i->enrollment->student->user->last_name ?? ''),
            ]);

        $users = User::all()->map(fn ($u) => [
            'id' => $u->id,
            'name' => "{$u->first_name} {$u->last_name}",
        ]);

        return inertia('Fees/FeeAdjustments/Create', compact('invoices', 'users'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFeeAdjustmentRequest $request)
    {
        DB::transaction(function () use ($request) {
            $adjustment = FeeAdjustment::create($request->validated());
            
            // Sync the adjusted amount on the invoice
            $adjustment->invoice->syncAdjustedAmount();
        });

        return redirect()
            ->route('fees.adjustments.index')
            ->with('success', 'Adjustment applied successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FeeAdjustment $feeAdjustment)
    {
        $feeAdjustment->load('invoice.enrollment.student.user');
        
        $invoices = StudentInvoices::with(['enrollment.student.user'])
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn ($i) => [
                'id' => $i->id,
                'name' => "Invoice #{$i->id} - " . ($i->enrollment->student->user->first_name ?? '') . ' ' . ($i->enrollment->student->user->last_name ?? ''),
            ]);

        $users = User::all()->map(fn ($u) => [
            'id' => $u->id,
            'name' => "{$u->first_name} {$u->last_name}",
        ]);

        return inertia('Fees/FeeAdjustments/Edit', compact('feeAdjustment', 'invoices', 'users'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreFeeAdjustmentRequest $request, FeeAdjustment $feeAdjustment)
    {
        DB::transaction(function () use ($request, $feeAdjustment) {
            $oldInvoice = $feeAdjustment->invoice;
            $feeAdjustment->update($request->validated());
            
            // Sync both old and new invoice if changed, though usually invoice doesn't change
            $oldInvoice->syncAdjustedAmount();
            $feeAdjustment->fresh()->invoice->syncAdjustedAmount();
        });

        return redirect()
            ->route('fees.adjustments.index')
            ->with('success', 'Adjustment updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FeeAdjustment $feeAdjustment)
    {
        DB::transaction(function () use ($feeAdjustment) {
            $invoice = $feeAdjustment->invoice;
            $feeAdjustment->delete();
            
            // Recalculate and sync the adjusted amount
            $invoice->syncAdjustedAmount();
        });

        return redirect()
            ->back()
            ->with('success', 'Adjustment removed successfully.');
    }
}
