<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Refund;
use App\Models\StudentInvoices;
use App\Http\Requests\StorePaymentRequest;
use App\Models\StudentCredit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payments = Payment::with(['invoice.enrollment.student.user'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Fees/Payments/Index', compact('payments'));
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
                'name' => "Invoice #{$i->id} - " . ($i->enrollment->student->user->first_name ?? '') . ' ' . ($i->enrollment->student->user->last_name ?? '') . " (Bal: " . number_format($i->balance_remaining, 2) . ")",
            ]);

        return inertia('Fees/Payments/Create', compact('invoices'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentRequest $request)
    {
        DB::transaction(function () use ($request) {
            $payment = Payment::create($request->validated());
            $invoice = $payment->invoice;

            // Check for overpayment and create credit if needed
            if ($invoice->status === 'overpaid' && $invoice->overpayment_action === 'credit') {
                $totalPaid = (float)$invoice->total_paid;
                $adjusted = (float)$invoice->adjusted_amount;
                $excess = $totalPaid - $adjusted;

                // Check if we already have a pending credit for this source invoice
                $existingCredit = StudentCredit::where('source_invoice_id', $invoice->id)
                    ->where('status', 'pending')
                    ->first();

                if ($existingCredit) {
                    $existingCredit->update(['amount' => $excess]);
                } else {
                    StudentCredit::create([
                        'student_id' => $invoice->enrollment->student_id,
                        'source_invoice_id' => $invoice->id,
                        'amount' => $excess,
                        'status' => 'pending',
                    ]);
                }
            } elseif ($invoice->status === 'overpaid' && $invoice->overpayment_action === 'refund') {
                $totalPaid = (float)$invoice->total_paid;
                $adjusted = (float)$invoice->adjusted_amount;
                $excess = $totalPaid - $adjusted;

                // Check if we already have a pending refund for this invoice
                $existingRefund = Refund::where('student_invoice_id', $invoice->id)
                    ->where('status', 'pending')
                    ->first();

                if ($existingRefund) {
                    $existingRefund->update(['amount' => $excess]);
                } else {
                    Refund::create([
                        'student_invoice_id' => $invoice->id,
                        'amount' => $excess,
                        'reason' => "Overpayment on invoice #{$invoice->id}",
                        'method' => $payment->method,
                        'status' => 'pending',
                        'raised_by' => auth()->id(),
                        'raised_at' => now(),
                    ]);
                }
            }
        });

        return redirect()
            ->route('fees.payments.index')
            ->with('success', 'Payment recorded successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        $payment->delete();

        return redirect()
            ->back()
            ->with('success', 'Payment removed successfully.');
    }
}
