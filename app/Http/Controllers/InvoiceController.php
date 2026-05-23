<?php

namespace App\Http\Controllers;

use App\Models\AcademicSessionEnrollment;
use App\Models\Student;
use App\Models\StudentInvoice;
use App\Services\BillingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * LIST (Index)
     */
    public function index(Request $request)
    {
        $query = StudentInvoice::with([
            'student',
            'enrollment.courseProgramVersion.course',
            'enrollment.academicSession',
        ])
            ->when($request->search, function ($q) use ($request) {
                $q->where('invoice_number', 'like', "%{$request->search}%")
                    ->orWhereHas('student', function ($s) use ($request) {
                        $s->where('registration_number', 'like', "%{$request->search}%")
                            ->orWhere('name', 'like', "%{$request->search}%");
                    });
            })
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->when($request->approval_status, fn ($q) => $q->where('approval_status', $request->approval_status));

        $invoices = $query
            ->orderBy($request->sort ?? 'created_at', $request->direction ?? 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Billing/InvoiceIndex', [
            'invoices' => $invoices,
            'filters' => $request->only(['search', 'status', 'approval_status']),
        ]);
    }

    /**
     * CREATE PAGE
     */
    public function create()
    {
        $enrollments = AcademicSessionEnrollment::with([
            'student',
            'courseProgramVersion.course',
            'academicSession',
        ])->get();

        return Inertia::render('Billing/InvoiceCreate', [
            'students' => Student::with('user')
                ->orderByDesc('id')
                ->limit(20)
                ->get()
                ->map(fn (Student $student) => [
                    'id' => $student->id,
                    'name' => trim(($student->user?->first_name ?? '').' '.($student->user?->last_name ?? '')).' ('.($student->registration_number ?? 'N/A').')',
                ]),
            'enrollments' => $enrollments,
        ]);
    }

    /**
     * STORE (Single or Bulk Invoice from Fee Plans)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fee_plan_ids' => 'required|array|min:1',
            'fee_plan_ids.*' => 'exists:fee_plans,id',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after:issue_date',
        ]);

        $billingService = app(BillingService::class);

        try {
            DB::transaction(function () use ($validated, $billingService) {
                $created = 0;

                foreach ($validated['fee_plan_ids'] as $feePlanId) {
                    // Find all active enrollments that have a fee assignment for this fee plan
                    $enrollments = AcademicSessionEnrollment::query()
                        ->whereHas('feeAssignments', function ($q) use ($feePlanId) {
                            $q->where('fee_plan_id', $feePlanId)
                                ->where('is_active', true);
                        })
                        ->with([
                            'student',
                            'courseProgramVersion.course',
                            'academicSession',
                        ])
                        ->get();

                    foreach ($enrollments as $enrollment) {
                        $billingService->createInvoiceForEnrollment(
                            $enrollment,
                            auth()->id(),
                            $validated['issue_date'],
                            $validated['due_date']
                        );
                        $created++;
                    }
                }

                return $created;
            });

            return redirect()
                ->route('billing.invoices.index')
                ->with('success', 'Invoices created successfully');

        } catch (\Throwable $e) {
            return back()->withErrors([
                'error' => $e->getMessage(),
            ])->withInput();
        }
    }

    /**
     * SHOW
     */
    public function show(StudentInvoice $invoice)
    {
        $invoice->load([
            'student',
            'enrollment.courseProgramVersion.course',
            'enrollment.academicSession',
            'invoiceItems',
            'payments',
            'adjustments',
        ]);

        return Inertia::render('Billing/InvoiceShow', [
            'invoice' => $invoice,
        ]);
    }

    /**
     * DELETE
     */
    public function destroy(StudentInvoice $invoice)
    {
        $invoice->delete();

        return back()->with('success', 'Invoice deleted successfully');
    }

    /**
     * APPROVAL (Approve / Reject)
     */
    public function approval(Request $request, StudentInvoice $invoice)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
        ]);

        $invoice->update([
            'approval_status' => $request->action === 'approve' ? 'approved' : 'rejected',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return back()->with('success', 'Invoice approval updated');
    }

    /**
     * BULK OPERATIONS (Page - Bulk Generate / Bulk Discounts)
     */
    public function bulkOperations()
    {
        $enrollments = AcademicSessionEnrollment::with([
            'student',
            'courseProgramVersion.course',
            'academicSession',
        ])->get();

        $students = \App\Models\Student::select('id', 'registration_number')->get();

        return Inertia::render('Billing/BulkOperations', [
            'enrollments' => $enrollments,
            'students' => $students,
        ]);
    }

    /**
     * BULK GENERATE INVOICES
     */
    public function bulkGenerate(Request $request)
    {
        $request->validate([
            'enrollment_ids' => 'required|array',
            'enrollment_ids.*' => 'exists:academic_session_enrollments,id',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after:issue_date',
        ]);

        $billingService = app(\App\Services\BillingService::class);

        $created = 0;
        $errors = [];

        DB::transaction(function () use ($request, $billingService, &$created, &$errors) {
            foreach ($request->enrollment_ids as $id) {
                try {
                    $enrollment = AcademicSessionEnrollment::findOrFail($id);

                    $billingService->createInvoiceForEnrollment(
                        $enrollment,
                        auth()->id(),
                        $request->issue_date,
                        $request->due_date
                    );

                    $created++;
                } catch (\Throwable $e) {
                    $errors[] = "Enrollment {$id}: ".$e->getMessage();
                }
            }
        });

        return back()->with([
            'success' => "{$created} invoices generated",
            'errors' => $errors,
        ]);
    }

    /**
     * BULK APPLY DISCOUNTS
     */
    public function bulkApplyDiscount(Request $request)
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:discount,waiver,scholarship',
            'description' => 'nullable|string',
        ]);

        $billingService = app(\App\Services\BillingService::class);

        $count = 0;
        $errors = [];

        DB::transaction(function () use ($request, $billingService, &$count, &$errors) {
            foreach ($request->student_ids as $studentId) {
                try {
                    $invoices = StudentInvoice::where('student_id', $studentId)
                        ->where('balance_due', '>', 0)
                        ->get();

                    foreach ($invoices as $invoice) {
                        $billingService->applyAdjustment(
                            $invoice,
                            $request->type,
                            $request->amount,
                            auth()->id(),
                            $request->description
                        );
                        $count++;
                    }
                } catch (\Throwable $e) {
                    $errors[] = "Student {$studentId}: ".$e->getMessage();
                }
            }
        });

        return back()->with([
            'success' => "{$count} adjustments applied",
            'errors' => $errors,
        ]);
    }
}

