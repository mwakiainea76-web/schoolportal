<?php

namespace App\Http\Controllers;

use App\Filters\StudentInvoicesFilter;
use App\Http\Requests\StoreStudentInvoicesRequest;
use App\Http\Requests\UpdateStudentInvoicesRequest;
use App\Models\Enrollment;
use App\Models\FeeModel;
use App\Models\StudentInvoices;
use App\Models\StudentCredit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentInvoicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, StudentInvoicesFilter $filter)
    {
        $invoices = $filter
            ->apply(
                StudentInvoices::with(['enrollment.student.user', 'feeModel']),
                $request->all()
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Fees/StudentInvoices/Index', compact('invoices'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $enrollments = Enrollment::with('student.user')
            ->limit(10)
            ->get()
            ->map(fn ($e) => [
                'id' => $e->id,
                'name' => ($e->student->user->first_name ?? '') . ' ' . ($e->student->user->last_name ?? '') . ' (' . ($e->student->registration_number ?? 'N/A') . ')',
            ]);

        $feeModels = FeeModel::active()
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'name' => $m->display_name,
            ]);

        return inertia('Fees/StudentInvoices/Create', compact('enrollments', 'feeModels'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentInvoicesRequest $request)
    {
        DB::transaction(function () use ($request) {
            $invoice = StudentInvoices::create($request->validated());

            // Check for pending credits for this student
            $pendingCredits = StudentCredit::where('student_id', $invoice->enrollment->student_id)
                ->where('status', 'pending')
                ->get();

            foreach ($pendingCredits as $credit) {
                // Apply as a fee adjustment
                $invoice->adjustments()->create([
                    'scope' => 'student',
                    'scope_ref' => $invoice->enrollment->student_id,
                    'type' => 'fixed',
                    'value' => -abs($credit->amount),
                    'reason' => "Credit carried from invoice #{$credit->source_invoice_id}",
                ]);

                // Mark credit as applied
                $credit->update([
                    'status' => 'applied',
                    'applied_invoice_id' => $invoice->id,
                    'applied_at' => now(),
                ]);
            }

            // Sync the adjusted amount if any adjustments were added
            if ($pendingCredits->count() > 0) {
                $invoice->syncAdjustedAmount();
            }
        });

        return redirect()
            ->route('fees.student-invoices.index')
            ->with('success', 'Invoice created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(StudentInvoices $studentInvoice)
    {
        $studentInvoice->load(['enrollment.student.user', 'feeModel', 'payments', 'adjustments', 'penalties']);
        
        return inertia('Fees/StudentInvoices/Show', compact('studentInvoice'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StudentInvoices $studentInvoice)
    {
        $studentInvoice->load(['enrollment.student.user', 'feeModel']);

        $enrollments = Enrollment::with('student.user')
            ->limit(10)
            ->get()
            ->map(fn ($e) => [
                'id' => $e->id,
                'name' => ($e->student->user->first_name ?? '') . ' ' . ($e->student->user->last_name ?? '') . ' (' . ($e->student->registration_number ?? 'N/A') . ')',
            ]);

        $feeModels = FeeModel::active()
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'name' => $m->display_name,
            ]);

        return inertia('Fees/StudentInvoices/Edit', compact('studentInvoice', 'enrollments', 'feeModels'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentInvoicesRequest $request, StudentInvoices $studentInvoice)
    {
        $studentInvoice->update($request->validated());

        return redirect()
            ->route('fees.student-invoices.index')
            ->with('success', 'Invoice updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentInvoices $studentInvoice)
    {
        $studentInvoice->delete();

        return redirect()
            ->back()
            ->with('success', 'Invoice deleted successfully.');
    }

    /**
     * Search for invoices.
     */
    public function search(Request $request)
    {
        $term = $request->get('q');

        return StudentInvoices::with(['enrollment.student.user'])
            ->where('id', 'like', "%{$term}%")
            ->orWhereHas('enrollment.student.user', function ($q) use ($term) {
                $q->where('first_name', 'like', "%{$term}%")
                  ->orWhere('last_name', 'like', "%{$term}%");
            })
            ->orWhereHas('enrollment.student', function ($q) use ($term) {
                $q->where('registration_number', 'like', "%{$term}%");
            })
            ->limit(10)
            ->get()
            ->map(fn ($i) => [
                'id' => $i->id,
                'name' => "Invoice #{$i->id} - " . ($i->enrollment->student->user->first_name ?? '') . ' ' . ($i->enrollment->student->user->last_name ?? ''),
            ]);
    }
}
