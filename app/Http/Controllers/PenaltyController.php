<?php

namespace App\Http\Controllers;

use App\Models\Penalty;
use App\Models\StudentInvoices;
use App\Models\User;
use App\Http\Requests\StorePenaltyRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PenaltyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $penalties = Penalty::with(['invoice.enrollment.student.user', 'raisedBy'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Fees/Penalties/Index', compact('penalties'));
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

        return inertia('Fees/Penalties/Create', compact('invoices', 'users'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePenaltyRequest $request)
    {
        DB::transaction(function () use ($request) {
            $penalty = Penalty::create($request->validated());
            
            // Sync the adjusted amount on the invoice
            $penalty->invoice->syncAdjustedAmount();
        });

        return redirect()
            ->route('fees.penalties.index')
            ->with('success', 'Penalty raised successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Penalty $penalty)
    {
        DB::transaction(function () use ($penalty) {
            $invoice = $penalty->invoice;
            $penalty->delete();
            
            // Recalculate and sync the adjusted amount
            $invoice->syncAdjustedAmount();
        });

        return redirect()
            ->back()
            ->with('success', 'Penalty removed successfully.');
    }
}
