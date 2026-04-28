<?php

namespace App\Http\Controllers;

use App\Models\Refund;
use Illuminate\Http\Request;

class RefundController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $refunds = Refund::with(['invoice.enrollment.student.user', 'raisedByUser', 'processedByUser'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Fees/Refunds/Index', compact('refunds'));
    }

    /**
     * Process the refund.
     */
    public function process(Request $request, Refund $refund)
    {
        // raised_by and processed_by must be different users
        if ($refund->raised_by === auth()->id()) {
            return redirect()
                ->back()
                ->with('error', 'You cannot process a refund that you raised.');
        }

        $refund->update([
            'status' => 'processed',
            'processed_by' => auth()->id(),
            'processed_at' => now(),
        ]);

        return redirect()
            ->back()
            ->with('success', 'Refund processed successfully.');
    }

    /**
     * Mark refund as failed.
     */
    public function fail(Request $request, Refund $refund)
    {
        $refund->update([
            'status' => 'failed',
            'processed_by' => auth()->id(),
            'processed_at' => now(),
        ]);

        return redirect()
            ->back()
            ->with('success', 'Refund marked as failed.');
    }
}
