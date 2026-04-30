<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\StudentInvoices;
use App\Http\Requests\StorePaymentRequest;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payments = Payment::with([
            'invoice.enrollment.student.user',
            'invoice.enrollment.academicSession',
            'invoice.enrollment.courseEnrollment.courseCurriculum.course',
            'invoice.enrollment.courseEnrollment.courseCurriculum.curriculum',
        ])
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
        $invoices = StudentInvoices::with([
            'enrollment.student.user',
            'enrollment.academicSession',
            'enrollment.courseEnrollment.courseCurriculum.course',
            'enrollment.courseEnrollment.courseCurriculum.curriculum',
        ])
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn ($i) => [
                'id' => $i->id,
                'name' => "Invoice #{$i->id} - ".$i->enrollment?->display_name." (Bal: ".number_format($i->balance_remaining, 2).")",
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
            $invoice->syncOverpaymentArtifacts();
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
        DB::transaction(function () use ($payment) {
            $invoice = $payment->invoice;
            $payment->delete();
            $invoice->refresh();
            $invoice->syncOverpaymentArtifacts();
        });

        return redirect()
            ->back()
            ->with('success', 'Payment removed successfully.');
    }
}
