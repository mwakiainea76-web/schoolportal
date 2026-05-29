<?php

namespace App\Http\Controllers;

use App\Models\AcademicSessionEnrollment;
use App\Models\Student;
use App\Models\StudentInvoice;
use App\Services\BillingService;
use App\Services\BillingStatementService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;

class InvoiceController extends Controller
{
    public function __construct(
        protected BillingStatementService $billingStatementService,
    ) {}

    /**
     * LIST (Index)
     */
    public function index(Request $request)
    {
        $query = StudentInvoice::with([
            'student',
            'student.user',
            'enrollment.programEnrollment.programVersionMapping.program',
            'enrollment.programEnrollment.programVersionMapping.programVersion',
            'enrollment.academicSession',
            'academicSession',
            'items',
            'adjustments',
            'paymentAllocations',
        ])
            ->when($request->search, function ($q) use ($request) {
                $search = $request->search;

                $q->where(function ($invoiceQuery) use ($search) {
                    $invoiceQuery
                        ->where('invoice_number', 'like', "%{$search}%")
                        ->orWhereHas('student', function ($studentQuery) use ($search) {
                            $studentQuery
                                ->where('registration_number', 'like', "%{$search}%")
                                ->orWhereHas('user', function ($userQuery) use ($search) {
                                    $userQuery
                                        ->where('first_name', 'like', "%{$search}%")
                                        ->orWhere('last_name', 'like', "%{$search}%");
                                });
                        });
                });
            })
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->when($request->approval_status, fn ($q) => $q->where('approval_status', $request->approval_status));

        $invoices = $query
            ->orderBy($request->sort ?? 'created_at', $request->direction ?? 'desc')
            ->paginate(15)
            ->withQueryString();

        $invoices->setCollection(
            $invoices->getCollection()->map(
                fn (StudentInvoice $invoice) => $this->billingStatementService->decorateInvoice($invoice)
            )
        );

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
        return redirect()
            ->route('billing.invoices.index')
            ->with('info', 'Use Manual Billing to post student charges, charge reductions, reversals, and payments.');
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
        $creatorStaffId = auth()->user()?->staff?->id;

        try {
            DB::transaction(function () use ($validated, $billingService, $creatorStaffId) {
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
                            'programEnrollment.programVersionMapping.program',
                            'programEnrollment.programVersionMapping.programVersion',
                            'academicSession',
                        ])
                        ->get();

                    foreach ($enrollments as $enrollment) {
                        $billingService->createInvoiceForEnrollment(
                            $enrollment,
                            $creatorStaffId,
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
            'student.user',
            'enrollment.programEnrollment.programVersionMapping.program',
            'enrollment.programEnrollment.programVersionMapping.programVersion',
            'enrollment.academicSession',
            'academicSession',
            'items',
            'paymentAllocations.payment',
            'adjustments',
            'ledgerTransactions',
        ]);

        $sessionInvoices = $this->sessionInvoicesQuery($invoice)
            ->with([
                'items',
                'adjustments',
                'paymentAllocations.payment',
                'ledgerTransactions',
            ])
            ->get();

        $invoice = $this->billingStatementService->decorateInvoice($invoice);
        $sessionSummary = $this->billingStatementService->buildSessionSummary($sessionInvoices);

        return Inertia::render('Billing/InvoiceShow', [
            'invoice' => $invoice,
            'sessionSummary' => $sessionSummary,
        ]);
    }

    public function studentStatementsIndex(Request $request)
    {
        $student = $request->user()?->student;

        abort_unless($student, 403);

        $invoices = StudentInvoice::query()
            ->with([
                'academicSession.academicYear',
                'items',
                'adjustments',
                'paymentAllocations.payment',
                'ledgerTransactions',
            ])
            ->where('student_id', $student->id)
            ->latest('issue_date')
            ->latest('created_at')
            ->get();

        $statementRows = $invoices
            ->groupBy('academic_session_id')
            ->map(fn ($sessionInvoices) => $this->billingStatementService->buildStatementRow($sessionInvoices))
            ->sortByDesc('issue_date')
            ->values();

        $page = LengthAwarePaginator::resolveCurrentPage();
        $perPage = 12;
        $paginatedStatements = new LengthAwarePaginator(
            $statementRows->slice(($page - 1) * $perPage, $perPage)->values(),
            $statementRows->count(),
            $perPage,
            $page,
            [
                'path' => $request->url(),
                'query' => $request->query(),
            ]
        );

        return Inertia::render('Billing/StudentStatements/Index', [
            'statements' => $paginatedStatements,
        ]);
    }

    public function studentStatementShow(Request $request, StudentInvoice $invoice)
    {
        $student = $request->user()?->student;

        abort_unless($student && $invoice->student_id === $student->id, 403);

        $invoice->load([
            'student.user',
            'academicSession.academicYear',
            'items',
            'adjustments',
            'paymentAllocations.payment',
        ]);

        $statementInvoices = $this->sessionInvoicesQuery($invoice)
            ->with([
                'items',
                'adjustments',
                'paymentAllocations.payment',
                'ledgerTransactions',
            ])
            ->get();

        return Inertia::render('Billing/StudentStatements/Show', [
            'statement' => $this->billingStatementService->buildStudentStatement(
                $invoice,
                $statementInvoices
            ),
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
        return redirect()
            ->route('billing.invoices.index')
            ->with('info', 'Bulk billing shortcuts were retired. Use the focused manual billing pages instead.');
    }

    public function manualOperations(Request $request)
    {
        $this->ensureBillingStaff($request);

        return Inertia::render('Billing/ManualOperations/Index', [
            'selectedRegistrationNumber' => $this->resolveSelectedRegistrationNumber($request),
        ]);
    }

    public function manualInvoiceCreate(Request $request)
    {
        $this->ensureBillingStaff($request);

        return Inertia::render('Billing/ManualOperations/AdditionalInvoice', [
            'selectedRegistrationNumber' => $this->resolveSelectedRegistrationNumber($request),
            'selectedInvoiceKind' => $request->string('invoice_kind')->toString() ?: 'standard_invoice',
        ]);
    }

    public function manualPaymentCreate(Request $request)
    {
        $this->ensureBillingStaff($request);

        return Inertia::render('Billing/ManualOperations/RecordPayment', [
            'selectedRegistrationNumber' => $this->resolveSelectedRegistrationNumber($request),
        ]);
    }

    public function manualPenaltyCreate(Request $request)
    {
        $this->ensureBillingStaff($request);

        return redirect()
            ->route('billing.manual.invoices.create', [
                'registration_number' => $this->resolveSelectedRegistrationNumber($request),
                'invoice_kind' => 'penalty',
            ])
            ->with('info', 'Penalties are now posted from Student Charge using the Penalty charge class.');
    }

    public function manualAdjustmentCreate(Request $request)
    {
        $this->ensureBillingStaff($request);

        return Inertia::render('Billing/ManualOperations/ApplyAdjustment', [
            'selectedRegistrationNumber' => $this->resolveSelectedRegistrationNumber($request),
        ]);
    }

    public function storeManualInvoice(Request $request, BillingService $billingService)
    {
        $validated = $request->validate([
            'registration_number' => 'required|string|max:100',
            'invoice_kind' => 'required|in:standard_invoice,penalty,hostel,invoice_adjustment',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
        ]);

        $creatorStaffId = $this->ensureBillingStaff($request);

        $enrollment = $this->resolveEnrollmentByRegistrationNumber($validated['registration_number']);
        $idempotencyKey = $this->makeTransactionIdempotencyKey(
            'manual-invoice',
            [
                'enrollment_id' => $enrollment->id,
                'invoice_kind' => $validated['invoice_kind'],
                'amount' => (string) $validated['amount'],
                'description' => $validated['description'],
                'issue_date' => $validated['issue_date'],
                'due_date' => $validated['due_date'],
            ],
            $creatorStaffId
        );

        [$invoiceType, $invoiceNotes] = match ($validated['invoice_kind']) {
            'standard_invoice' => ['fees', BillingService::NOTE_MANUAL_STANDARD],
            'penalty' => ['penalty', BillingService::NOTE_MANUAL_PENALTY],
            'hostel' => ['hostel', BillingService::NOTE_HOSTEL],
            default => ['fees', BillingService::NOTE_MANUAL_ADJUSTMENT],
        };

        $invoice = $billingService->createManualInvoice(
            $enrollment,
            (float) $validated['amount'],
            $creatorStaffId,
            $validated['description'],
            $validated['issue_date'],
            $validated['due_date'],
            $invoiceNotes,
            $idempotencyKey,
            $invoiceType
        );

        return redirect()
            ->route('billing.invoices.show', $invoice)
            ->with('success', 'Student charge posted successfully.');
    }

    public function storePenalty(Request $request, BillingService $billingService)
    {
        $validated = $request->validate([
            'registration_number' => 'required|string|max:100',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
            'applied_at' => 'required|date',
        ]);

        $creatorStaffId = $this->ensureBillingStaff($request);

        $invoice = $this->resolveInvoiceByRegistrationNumber(
            $validated['registration_number'],
            true
        );
        $idempotencyKey = $this->makeTransactionIdempotencyKey(
            'manual-penalty',
            [
                'invoice_id' => $invoice->id,
                'amount' => (string) $validated['amount'],
                'description' => $validated['description'],
                'applied_at' => $validated['applied_at'],
            ],
            $creatorStaffId
        );

        $billingService->applyAdjustment(
            $invoice,
            'penalty',
            (float) $validated['amount'],
            $creatorStaffId,
            $validated['description'],
            $validated['applied_at'],
            $idempotencyKey
        );

        return redirect()
            ->route('billing.invoices.show', $invoice)
            ->with('success', 'Penalty posted successfully.');
    }

    public function storeAdjustment(Request $request, BillingService $billingService)
    {
        $validated = $request->validate([
            'registration_number' => 'required|string|max:100',
            'type' => 'required|in:discount,waiver,bursary,helb,refund,reversal,other',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
            'applied_at' => 'required|date',
            'replacement_amount' => 'nullable|numeric|min:0.01',
            'replacement_description' => 'nullable|string|max:255',
        ]);

        $creatorStaffId = $this->ensureBillingStaff($request);

        $invoice = $this->resolveInvoiceByRegistrationNumber(
            $validated['registration_number'],
            ! in_array($validated['type'], ['refund', 'reversal'], true)
        );
        $idempotencyKey = $this->makeTransactionIdempotencyKey(
            'manual-adjustment',
            [
                'invoice_id' => $invoice->id,
                'type' => $validated['type'],
                'amount' => (string) $validated['amount'],
                'description' => $validated['description'],
                'applied_at' => $validated['applied_at'],
                'replacement_amount' => (string) ($validated['replacement_amount'] ?? ''),
                'replacement_description' => $validated['replacement_description'] ?? '',
            ],
            $creatorStaffId
        );

        if ($validated['type'] === 'reversal') {
            $result = $billingService->reverseInvoiceAndOptionallyReissue(
                $invoice,
                (float) $validated['amount'],
                $creatorStaffId,
                $validated['description'],
                $validated['applied_at'],
                isset($validated['replacement_amount']) && $validated['replacement_amount'] !== null
                    ? (float) $validated['replacement_amount']
                    : null,
                $validated['replacement_description'] ?? null,
                $idempotencyKey
            );

            $redirectInvoice = $result['replacement_invoice'] ?? $invoice;
            $message = $result['replacement_invoice']
                ? 'Invoice reversed and corrected invoice issued successfully.'
                : 'Invoice reversal applied successfully.';

            return redirect()
                ->route('billing.invoices.show', $redirectInvoice)
                ->with('success', $message);
        }

        $billingService->applyAdjustment(
            $invoice,
            $validated['type'],
            (float) $validated['amount'],
            $creatorStaffId,
            $validated['description'],
            $validated['applied_at'],
            $idempotencyKey
        );

        return redirect()
            ->route('billing.invoices.show', $invoice)
            ->with('success', 'Fee adjustment applied successfully.');
    }

    public function storePayment(Request $request, BillingService $billingService)
    {
        $validated = $request->validate([
            'registration_number' => 'required|string|max:100',
            'amount' => 'required|numeric|min:0.01',
            'method' => 'required|in:mpesa,bank,cash,card,cheque,other',
            'reference' => 'nullable|string|max:150',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string|max:500',
        ]);

        $creatorStaffId = $this->ensureBillingStaff($request);

        $student = $this->resolveStudentByRegistrationNumber($validated['registration_number']);
        $idempotencyKey = $this->makeTransactionIdempotencyKey(
            'manual-payment',
            [
                'student_id' => $student->id,
                'amount' => (string) $validated['amount'],
                'method' => $validated['method'],
                'reference' => $validated['reference'] ?? '',
                'payment_date' => $validated['payment_date'],
                'notes' => $validated['notes'] ?? '',
            ],
            $creatorStaffId
        );

        $payment = $billingService->recordStudentPayment(
            $student,
            (float) $validated['amount'],
            $validated['method'],
            $creatorStaffId,
            $validated['reference'] ?? null,
            $validated['payment_date'],
            $validated['notes'] ?? null,
            $idempotencyKey
        );

        $invoice = $payment->allocations()
            ->with('invoice')
            ->latest('id')
            ->first()
            ?->invoice;

        if (! $invoice) {
            return back()->with('success', 'Payment recorded successfully as student account credit.');
        }

        return redirect()
            ->route('billing.invoices.show', $invoice)
            ->with('success', 'Payment recorded successfully.');
    }

    protected function resolveSelectedRegistrationNumber(Request $request): ?string
    {
        if ($request->filled('registration_number')) {
            return trim($request->string('registration_number')->toString());
        }

        if ($request->filled('invoice')) {
            return StudentInvoice::query()
                ->with('student')
                ->find($request->integer('invoice'))
                ?->student?->registration_number;
        }

        return null;
    }

    protected function ensureBillingStaff(Request $request): int
    {
        $staffId = $request->user()?->staff?->id;

        if (! $staffId) {
            throw new HttpException(403, 'A staff billing account is required to access manual billing.');
        }

        return (int) $staffId;
    }

    protected function resolveEnrollmentByRegistrationNumber(string $registrationNumber): AcademicSessionEnrollment
    {
        $student = $this->resolveStudentByRegistrationNumber($registrationNumber);

        $enrollment = AcademicSessionEnrollment::query()
            ->with([
                'programEnrollment',
                'student.user',
                'academicSession',
                'programVersionMapping.program',
                'programVersionMapping.programVersion',
            ])
            ->whereHas('programEnrollment', fn ($query) => $query->where('student_id', $student->id))
            ->latest('academic_session_id')
            ->latest('id')
            ->first();

        if (! $enrollment) {
            throw ValidationException::withMessages([
                'registration_number' => 'This student does not have a session enrollment yet.',
            ]);
        }

        return $enrollment;
    }

    protected function resolveInvoiceByRegistrationNumber(string $registrationNumber, bool $requireOutstanding = false): StudentInvoice
    {
        $student = $this->resolveStudentByRegistrationNumber($registrationNumber);

        $query = StudentInvoice::query()
            ->where('student_id', $student->id);

        if ($requireOutstanding) {
            $query->where('balance_due', '>', 0);
        }

        $invoice = $query
            ->latest('issue_date')
            ->latest('id')
            ->first();

        if (! $invoice) {
            $message = $requireOutstanding
                ? 'No outstanding invoice was found for that student registration number.'
                : 'No invoice was found for that student registration number.';

            throw ValidationException::withMessages([
                'registration_number' => $message,
            ]);
        }

        return $invoice;
    }

    protected function resolveStudentByRegistrationNumber(string $registrationNumber): Student
    {
        $student = Student::query()
            ->where('registration_number', $registrationNumber)
            ->first();

        if (! $student) {
            throw ValidationException::withMessages([
                'registration_number' => 'No student was found with that registration number.',
            ]);
        }

        return $student;
    }

    protected function makeTransactionIdempotencyKey(string $operation, array $payload, int $actorId): string
    {
        return hash('sha256', json_encode([
            'operation' => $operation,
            'actor_id' => $actorId,
            'payload' => $this->normalizeIdempotencyPayload($payload),
        ]));
    }

    protected function normalizeIdempotencyPayload(array $payload): array
    {
        ksort($payload);

        foreach ($payload as $key => $value) {
            if (is_array($value)) {
                $payload[$key] = $this->normalizeIdempotencyPayload($value);
            }
        }

        return $payload;
    }

    protected function sessionInvoicesQuery(StudentInvoice $invoice)
    {
        return StudentInvoice::query()
            ->where('student_id', $invoice->student_id)
            ->where('academic_session_id', $invoice->academic_session_id)
            ->orderBy('issue_date')
            ->orderBy('id');
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
        $creatorStaffId = auth()->user()?->staff?->id;

        $created = 0;
        $errors = [];

        DB::transaction(function () use ($request, $billingService, $creatorStaffId, &$created, &$errors) {
            foreach ($request->enrollment_ids as $id) {
                try {
                    $enrollment = AcademicSessionEnrollment::findOrFail($id);

                    $billingService->createInvoiceForEnrollment(
                        $enrollment,
                        $creatorStaffId,
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
            'type' => 'required|in:discount,waiver,bursary,helb,penalty,refund,other',
            'description' => 'nullable|string',
        ]);

        $billingService = app(\App\Services\BillingService::class);
        $creatorStaffId = auth()->user()?->staff?->id;

        $count = 0;
        $errors = [];

        DB::transaction(function () use ($request, $billingService, $creatorStaffId, &$count, &$errors) {
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
                            $creatorStaffId,
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
