<?php

namespace App\Services;

use App\Models\AcademicSessionEnrollment;
use App\Models\FeeAdjustment;
use App\Models\HostelAllocation;
use App\Models\InvoiceItem;
use App\Models\LedgerTransaction;
use App\Models\Payment;
use App\Models\PaymentAllocation;
use App\Models\Student;
use App\Models\StudentInvoice;
use App\Services\FeeAssignmentService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BillingService
{
    public const NOTE_CARRY_FORWARD = 'Carry-forward balance invoice.';
    public const NOTE_CORRECTED_REVERSAL = 'Corrected reversed invoice.';
    public const NOTE_MANUAL_STANDARD = 'Manual standard invoice.';
    public const NOTE_MANUAL_ADJUSTMENT = 'Manual invoice adjustment.';
    public const NOTE_MANUAL_PENALTY = 'Manual penalty invoice.';
    public const NOTE_HOSTEL = 'Hostel accommodation invoice.';

    protected FeeAssignmentService $feeAssignmentService;

    public function __construct(FeeAssignmentService $feeAssignmentService)
    {
        $this->feeAssignmentService = $feeAssignmentService;
    }

    public function createInvoiceForEnrollment(AcademicSessionEnrollment $enrollment, ?int $createdBy = null, ?string $issueDate = null, ?string $dueDate = null): StudentInvoice
    {
        return DB::transaction(function () use ($enrollment, $createdBy, $issueDate, $dueDate) {
            $studentId = $this->studentIdForEnrollment($enrollment);

            $assignment = $this->feeAssignmentService->resolveActiveAssignment(
                $enrollment->academicSession?->academic_year_id ?? 0,
                $enrollment->programEnrollment?->program_version_mapping_id ?? null,
                $enrollment->year_of_study,
                $enrollment->session_number ?: ($enrollment->academicSession?->session_number ?? $enrollment->academicSession?->session_No ?? null),
                $issueDate
            );

            if (! $assignment) {
                $programName = $enrollment->programEnrollment?->programVersionMapping?->program?->name ?? 'your program';
                $programVersionName = $enrollment->programEnrollment?->programVersionMapping?->programVersion?->name ?? 'your program version';
                $sessionLabel = $enrollment->academicSession?->display_name ?? 'this session';

                throw ValidationException::withMessages([
                    'assignment' => "No active fee assignment exists for {$programName} - {$programVersionName} in {$sessionLabel}. Assign a fee plan to this program version before session registration.",
                ]);
            }

            $invoiceCreatorId = $createdBy ?? $assignment->created_by;

            if (! $invoiceCreatorId) {
                throw ValidationException::withMessages([
                    'assignment' => 'No staff user is available to create the invoice for this enrollment.',
                ]);
            }

            $this->transferClosedSessionBalancesToCurrentSession(
                $enrollment,
                $invoiceCreatorId,
                $issueDate,
                $dueDate
            );

            $existingInvoice = StudentInvoice::query()
                ->where('enrollment_id', $enrollment->id)
                ->where('invoice_type', 'default_fees')
                ->latest()
                ->first();

            if ($existingInvoice) {
                return $existingInvoice;
            }

            $invoice = StudentInvoice::create([
                'invoice_number' => StudentInvoice::generateInvoiceNumber(),
                'student_id' => $studentId,
                'enrollment_id' => $enrollment->id,
                'fee_assignment_id' => $assignment->id,
                'invoice_type' => 'default_fees',
                'academic_session_id' => $enrollment->academic_session_id,
                'status' => 'issued',
                'issue_date' => $issueDate ?? now()->toDateString(),
                'due_date' => $dueDate ?? now()->addDays(30)->toDateString(),
                'amount_due' => 0,
                'paid_amount' => 0,
                'balance_due' => 0,
                'created_by' => $invoiceCreatorId,
            ]);

            $this->createInvoiceItemsFromAssignment($invoice, $assignment);
            $invoice->recalculateTotals();
            $this->recordLedgerTransaction([
                'student_id' => $studentId,
                'student_invoice_id' => $invoice->id,
                'academic_session_id' => $invoice->academic_session_id,
                'type' => $this->resolveLedgerTypeForInvoice('default_fees'),
                'debit' => (float) $invoice->amount_due,
                'credit' => 0,
                'reference' => $invoice->invoice_number,
                'description' => 'Invoice generated for session enrollment.',
                'transaction_date' => $invoice->issue_date?->toDateString() ?? now()->toDateString(),
                'created_by' => $invoiceCreatorId,
            ]);
            $this->applyAvailableCredits($invoice, $invoiceCreatorId, $invoice->issue_date?->toDateString());
            $invoice->refresh();

            return $invoice;
        });
    }

    public function createManualInvoice(
        AcademicSessionEnrollment $enrollment,
        float $amount,
        int $createdBy,
        string $description,
        ?string $issueDate = null,
        ?string $dueDate = null,
        ?string $notes = null,
        ?string $idempotencyKey = null,
        string $invoiceType = 'fees'
    ): StudentInvoice {
        if ($idempotencyKey) {
            $existingInvoice = StudentInvoice::query()
                ->where('idempotency_key', $idempotencyKey)
                ->first();

            if ($existingInvoice) {
                return $existingInvoice->loadMissing(['items', 'adjustments', 'paymentAllocations']);
            }
        }

        return DB::transaction(function () use ($enrollment, $amount, $createdBy, $description, $issueDate, $dueDate, $notes, $idempotencyKey, $invoiceType) {
            $studentId = $this->studentIdForEnrollment($enrollment);

            $invoice = StudentInvoice::create([
                'invoice_number' => StudentInvoice::generateInvoiceNumber(),
                'student_id' => $studentId,
                'enrollment_id' => $enrollment->id,
                'fee_assignment_id' => null,
                'invoice_type' => $invoiceType,
                'academic_session_id' => $enrollment->academic_session_id,
                'status' => 'issued',
                'issue_date' => $issueDate ?? now()->toDateString(),
                'due_date' => $dueDate ?? now()->addDays(14)->toDateString(),
                'amount_due' => 0,
                'paid_amount' => 0,
                'balance_due' => 0,
                'idempotency_key' => $idempotencyKey,
                'notes' => $notes ?? self::NOTE_MANUAL_ADJUSTMENT,
                'created_by' => $createdBy,
            ]);

            InvoiceItem::create([
                'student_invoice_id' => $invoice->id,
                'fee_plan_item_id' => null,
                'description' => $description,
                'unit_amount' => $amount,
                'quantity' => 1,
                'total_amount' => $amount,
            ]);

            $invoice->recalculateTotals();
            $this->recordLedgerTransaction([
                'student_id' => $studentId,
                'student_invoice_id' => $invoice->id,
                'academic_session_id' => $invoice->academic_session_id,
                'type' => $this->resolveLedgerTypeForInvoice($invoiceType, $invoice->notes),
                'debit' => (float) $invoice->amount_due,
                'credit' => 0,
                'reference' => $invoice->invoice_number,
                'description' => $description,
                'transaction_date' => $invoice->issue_date?->toDateString() ?? now()->toDateString(),
                'created_by' => $createdBy,
            ]);
            $this->applyAvailableCredits($invoice, $createdBy, $invoice->issue_date?->toDateString());
            $invoice->refresh();

            return $invoice;
        });
    }

    public function createHostelInvoice(
        HostelAllocation $allocation,
        int $createdBy,
        ?string $issueDate = null,
        ?string $dueDate = null
    ): StudentInvoice {
        if ($allocation->student_invoice_id && $allocation->invoice) {
            return $allocation->invoice->loadMissing(['items', 'adjustments', 'paymentAllocations']);
        }

        $allocation->loadMissing(['enrollment', 'hostel', 'room', 'bed', 'invoice']);

        $effectiveIssueDate = $issueDate ?? optional($allocation->allocated_on)->toDateString() ?? now()->toDateString();
        $description = trim(collect([
            'Hostel accommodation',
            $allocation->hostel?->name,
            $allocation->room?->name,
            $allocation->bed?->label,
        ])->filter()->implode(' - '));

        $invoice = $this->createManualInvoice(
            $allocation->enrollment,
            (float) $allocation->hostel_fee_amount,
            $createdBy,
            $description,
            $effectiveIssueDate,
            $dueDate ?? Carbon::parse($effectiveIssueDate)->addDays(14)->toDateString(),
            self::NOTE_HOSTEL,
            'hostel-allocation:'.$allocation->id,
            'hostel'
        );

        $allocation->update([
            'student_invoice_id' => $invoice->id,
            'updated_by' => $createdBy,
        ]);

        return $invoice;
    }

    protected function studentIdForEnrollment(AcademicSessionEnrollment $enrollment, bool $throw = true): ?int
    {
        $enrollment->loadMissing('programEnrollment');

        $studentId = $enrollment->programEnrollment?->student_id ?? $enrollment->student_id;

        if (! $studentId && $throw) {
            throw ValidationException::withMessages([
                'registration_number' => 'The selected session enrollment is not linked to a student.',
            ]);
        }

        return $studentId ? (int) $studentId : null;
    }

    protected function transferClosedSessionBalancesToCurrentSession(
        AcademicSessionEnrollment $enrollment,
        ?int $createdBy = null,
        ?string $issueDate = null,
        ?string $dueDate = null
    ): ?StudentInvoice {
        $studentId = $this->studentIdForEnrollment($enrollment, false);
        $currentSessionId = $enrollment->academic_session_id;

        if (! $studentId || ! $currentSessionId || ! $createdBy) {
            return null;
        }

        $existingCarryForwardInvoice = StudentInvoice::query()
            ->where('student_id', $studentId)
            ->where('academic_session_id', $currentSessionId)
            ->where('notes', self::NOTE_CARRY_FORWARD)
            ->latest('id')
            ->first();

        if ($existingCarryForwardInvoice) {
            return $existingCarryForwardInvoice;
        }

        $priorInvoices = StudentInvoice::query()
            ->with(['academicSession', 'items', 'adjustments', 'paymentAllocations'])
            ->where('student_id', $studentId)
            ->where('academic_session_id', '!=', $currentSessionId)
            ->whereHas('academicSession', fn ($query) => $query->whereNotNull('end_date'))
            ->where('balance_due', '>', 0)
            ->orderBy('issue_date')
            ->orderBy('id')
            ->get();

        if ($priorInvoices->isEmpty()) {
            return null;
        }

        $carryForwardAmount = 0;
        $sourceSessions = [];

        foreach ($priorInvoices as $priorInvoice) {
            $priorInvoice->recalculateTotals()->refresh();
            $outstanding = (float) $priorInvoice->balance_due;

            if ($outstanding <= 0) {
                continue;
            }

            $sessionLabel = $priorInvoice->academicSession?->display_name ?? $priorInvoice->invoice_number;
            $sourceSessions[] = $sessionLabel;
            $carryForwardAmount += $outstanding;

            $this->applyAdjustment(
                $priorInvoice,
                'reversal',
                $outstanding,
                $createdBy,
                'Closing balance transferred to next session carry-forward.',
                $issueDate
            );
        }

        if ($carryForwardAmount <= 0) {
            return null;
        }

        $description = 'Closing balance brought forward from '.collect($sourceSessions)
            ->unique()
            ->implode(', ');

        return $this->createManualInvoice(
            $enrollment,
            $carryForwardAmount,
            $createdBy,
            $description,
            $issueDate,
            $dueDate,
            self::NOTE_CARRY_FORWARD
        );
    }

    protected function createInvoiceItemsFromAssignment(StudentInvoice $invoice, $assignment): void
    {
        $items = $assignment->feePlan->feePlanItems;

        foreach ($items as $item) {
            InvoiceItem::create([
                'student_invoice_id' => $invoice->id,
                'fee_plan_item_id' => $item->id,
                'description' => $item->name,
                'unit_amount' => $item->amount,
                'quantity' => 1,
                'total_amount' => $item->amount,
            ]);
        }
    }

    public function recordPayment(
        StudentInvoice $invoice,
        float $amount,
        string $method,
        int $createdBy,
        ?string $reference = null,
        ?string $paymentDate = null,
        ?string $notes = null,
        ?string $idempotencyKey = null
    ): Payment
    {
        if ($idempotencyKey) {
            $existingPayment = Payment::query()
                ->where('idempotency_key', $idempotencyKey)
                ->first();

            if ($existingPayment) {
                return $existingPayment->loadMissing('allocations');
            }
        }

        return $this->createAndAllocatePayment(
            $invoice->student,
            $amount,
            $method,
            $createdBy,
            $reference,
            $paymentDate,
            $notes,
            $idempotencyKey,
            $invoice->id
        );
    }

    public function recordStudentPayment(
        Student $student,
        float $amount,
        string $method,
        int $createdBy,
        ?string $reference = null,
        ?string $paymentDate = null,
        ?string $notes = null,
        ?string $idempotencyKey = null
    ): Payment {
        if ($idempotencyKey) {
            $existingPayment = Payment::query()
                ->where('idempotency_key', $idempotencyKey)
                ->first();

            if ($existingPayment) {
                return $existingPayment->loadMissing('allocations.invoice');
            }
        }

        return $this->createAndAllocatePayment(
            $student,
            $amount,
            $method,
            $createdBy,
            $reference,
            $paymentDate,
            $notes,
            $idempotencyKey
        );
    }

    protected function createAndAllocatePayment(
        Student $student,
        float $amount,
        string $method,
        int $createdBy,
        ?string $reference = null,
        ?string $paymentDate = null,
        ?string $notes = null,
        ?string $idempotencyKey = null,
        ?int $studentInvoiceId = null
    ): Payment {
        return DB::transaction(function () use ($student, $amount, $method, $createdBy, $reference, $paymentDate, $notes, $idempotencyKey, $studentInvoiceId) {
            $payment = Payment::create([
                'student_invoice_id' => $studentInvoiceId,
                'student_id' => $student->id,
                'amount' => $amount,
                'payment_date' => $paymentDate ?? now()->toDateString(),
                'method' => $method,
                'reference' => $reference,
                'status' => 'completed',
                'idempotency_key' => $idempotencyKey,
                'created_by' => $createdBy,
                'notes' => $notes,
            ]);

            $this->allocatePaymentAcrossInvoices($payment, $student, $createdBy);

            return $payment;
        });
    }

    public function applyAdjustment(StudentInvoice $invoice, string $type, float $amount, int $createdBy, ?string $description = null, ?string $appliedAt = null, ?string $idempotencyKey = null): FeeAdjustment
    {
        if ($idempotencyKey) {
            $existingAdjustment = FeeAdjustment::query()
                ->where('idempotency_key', $idempotencyKey)
                ->first();

            if ($existingAdjustment) {
                return $existingAdjustment;
            }
        }

        if ($type === 'refund') {
            $this->assertRefundCanBeProcessed($invoice, $amount);
        }

        return DB::transaction(function () use ($invoice, $type, $amount, $createdBy, $description, $appliedAt, $idempotencyKey) {
            $adjustment = FeeAdjustment::create([
                'student_invoice_id' => $invoice->id,
                'type' => $type,
                'amount' => $amount,
                'idempotency_key' => $idempotencyKey,
                'description' => $description,
                'applied_at' => $appliedAt ?? now()->toDateString(),
                'created_by' => $createdBy,
            ]);

            $invoice->recalculateTotals();
            $invoice->refresh();

            [$ledgerType, $debit, $credit] = $this->mapAdjustmentToLedger((string) $type, (float) $amount);

            $this->recordLedgerTransaction([
                'student_id' => $invoice->student_id,
                'student_invoice_id' => $invoice->id,
                'academic_session_id' => $invoice->academic_session_id,
                'type' => $ledgerType,
                'debit' => $debit,
                'credit' => $credit,
                'reference' => null,
                'description' => $description ?: ucfirst($type).' adjustment applied.',
                'transaction_date' => $adjustment->applied_at?->toDateString() ?? ($appliedAt ?? now()->toDateString()),
                'created_by' => $createdBy,
            ]);

            return $adjustment;
        });
    }

    public function reverseInvoiceAndOptionallyReissue(
        StudentInvoice $invoice,
        float $reversalAmount,
        int $createdBy,
        ?string $reversalDescription = null,
        ?string $appliedAt = null,
        ?float $replacementAmount = null,
        ?string $replacementDescription = null,
        ?string $idempotencyKey = null
    ): array {
        return DB::transaction(function () use (
            $invoice,
            $reversalAmount,
            $createdBy,
            $reversalDescription,
            $appliedAt,
            $replacementAmount,
            $replacementDescription,
            $idempotencyKey
        ) {
            $reversal = $this->applyAdjustment(
                $invoice,
                'reversal',
                $reversalAmount,
                $createdBy,
                $reversalDescription ?: 'Invoice reversal applied.',
                $appliedAt,
                $idempotencyKey ? $idempotencyKey.':reversal' : null
            );

            $replacementInvoice = null;

            if ($replacementAmount !== null && $replacementAmount > 0) {
                if (! $invoice->enrollment) {
                    throw ValidationException::withMessages([
                        'replacement_amount' => 'The reversed invoice is not linked to an enrollment, so a corrected invoice cannot be issued automatically.',
                    ]);
                }

                $issueDate = $appliedAt ?? now()->toDateString();
                $dueDate = Carbon::parse($issueDate)->addDays(14)->toDateString();

                $replacementInvoice = $this->createManualInvoice(
                    $invoice->enrollment,
                    $replacementAmount,
                    $createdBy,
                    $replacementDescription ?: 'Corrected invoice issued after reversal.',
                    $issueDate,
                    $dueDate,
                    self::NOTE_CORRECTED_REVERSAL,
                    $idempotencyKey ? $idempotencyKey.':replacement' : null
                );
            }

            return [
                'reversal' => $reversal,
                'replacement_invoice' => $replacementInvoice,
            ];
        });
    }

    protected function recordLedgerTransaction(array $data): LedgerTransaction
    {
        return LedgerTransaction::create([
            'student_id' => $data['student_id'],
            'student_invoice_id' => $data['student_invoice_id'] ?? null,
            'academic_session_id' => $data['academic_session_id'],
            'type' => $data['type'],
            'debit' => $data['debit'] ?? 0,
            'credit' => $data['credit'] ?? 0,
            'reference' => $data['reference'] ?? null,
            'description' => $data['description'] ?? null,
            'transaction_date' => $data['transaction_date'] ?? now()->toDateString(),
            'created_by' => $data['created_by'] ?? null,
        ]);
    }

    protected function mapAdjustmentToLedger(string $type, float $amount): array
    {
        return match ($type) {
            'discount', 'waiver' => ['discount', 0, $amount],
            'penalty' => ['penalty', $amount, 0],
            'bursary' => ['bursary', 0, $amount],
            'helb' => ['helb', 0, $amount],
            'refund' => ['refund', $amount, 0],
            'reversal' => ['reversal', 0, $amount],
            default => ['adjustment', $amount, 0],
        };
    }

    protected function resolveLedgerTypeForInvoice(string $invoiceType, ?string $notes = null): string
    {
        if (in_array($notes, [self::NOTE_CARRY_FORWARD, self::NOTE_CORRECTED_REVERSAL, self::NOTE_MANUAL_ADJUSTMENT], true)) {
            return 'adjustment';
        }

        if ($invoiceType === 'penalty' || $notes === self::NOTE_MANUAL_PENALTY) {
            return 'penalty';
        }

        if ($invoiceType === 'hostel' || $notes === self::NOTE_HOSTEL) {
            return 'hostel';
        }

        return 'invoice';
    }

    protected function assertRefundCanBeProcessed(StudentInvoice $invoice, float $amount): void
    {
        $studentId = $invoice->student_id;

        $outstandingBalance = (float) StudentInvoice::query()
            ->where('student_id', $studentId)
            ->sum('balance_due');

        if ($outstandingBalance > 0) {
            throw ValidationException::withMessages([
                'amount' => 'Refund can only be processed after all student invoices are fully settled.',
            ]);
        }

        $ledgerTotals = LedgerTransaction::query()
            ->where('student_id', $studentId)
            ->selectRaw('COALESCE(SUM(debit), 0) as total_debit, COALESCE(SUM(credit), 0) as total_credit')
            ->first();

        $availableCredit = max(
            0,
            (float) ($ledgerTotals?->total_credit ?? 0) - (float) ($ledgerTotals?->total_debit ?? 0)
        );

        if ($availableCredit <= 0) {
            throw ValidationException::withMessages([
                'amount' => 'No refundable student credit exists on this account.',
            ]);
        }

        if ($amount > $availableCredit) {
            throw ValidationException::withMessages([
                'amount' => 'Refund amount exceeds the student credit currently available for payout.',
            ]);
        }
    }

    public function bulkGenerateInvoices(array $enrollmentIds, int $createdBy, ?string $issueDate = null, ?string $dueDate = null): array
    {
        $invoices = [];
        $errors = [];

        DB::transaction(function () use ($enrollmentIds, $createdBy, $issueDate, $dueDate, &$invoices, &$errors) {
            foreach ($enrollmentIds as $enrollmentId) {
                try {
                    $enrollment = AcademicSessionEnrollment::findOrFail($enrollmentId);
                    $invoice = $this->createInvoiceForEnrollment($enrollment, $createdBy, $issueDate, $dueDate);
                    $invoices[] = $invoice;
                } catch (\Exception $e) {
                    $errors[] = [
                        'enrollment_id' => $enrollmentId,
                        'error' => $e->getMessage(),
                    ];
                }
            }
        });

        return [
            'invoices_created' => count($invoices),
            'errors' => $errors,
        ];
    }

    public function bulkApplyDiscount(array $discountData, array $studentIds, int $createdBy): array
    {
        $adjustments = [];
        $errors = [];

        DB::transaction(function () use ($discountData, $studentIds, $createdBy, &$adjustments, &$errors) {
            foreach ($studentIds as $studentId) {
                try {
                    $invoices = StudentInvoice::where('student_id', $studentId)
                        ->where('balance_due', '>', 0)
                        ->get();

                    foreach ($invoices as $invoice) {
                        $adjustment = $this->applyAdjustment($invoice, 'discount', $discountData['amount'], $createdBy, $discountData['description']);
                        $adjustments[] = $adjustment;
                    }
                } catch (\Exception $e) {
                    $errors[] = [
                        'student_id' => $studentId,
                        'error' => $e->getMessage(),
                    ];
                }
            }
        });

        return [
            'adjustments_created' => count($adjustments),
            'errors' => $errors,
        ];
    }

    protected function allocatePaymentAcrossInvoices(Payment $payment, Student $student, int $createdBy): void
    {
        $remaining = (float) $payment->amount;
        $outstandingInvoices = StudentInvoice::query()
            ->where('student_id', $student->id)
            ->where('balance_due', '>', 0)
            ->orderBy('issue_date')
            ->orderBy('id')
            ->get();

        foreach ($outstandingInvoices as $invoice) {
            if ($remaining <= 0) {
                break;
            }

            $allocationAmount = min($remaining, (float) $invoice->balance_due);

            if ($allocationAmount <= 0) {
                continue;
            }

            PaymentAllocation::create([
                'payment_id' => $payment->id,
                'student_invoice_id' => $invoice->id,
                'amount' => $allocationAmount,
                'allocated_at' => $payment->payment_date?->toDateString() ?? now()->toDateString(),
            ]);

            $invoice->recalculateTotals();
            $invoice->refresh();

            $this->recordLedgerTransaction([
                'student_id' => $student->id,
                'student_invoice_id' => $invoice->id,
                'academic_session_id' => $invoice->academic_session_id,
                'type' => 'payment',
                'debit' => 0,
                'credit' => $allocationAmount,
                'reference' => $payment->reference,
                'description' => $payment->notes ?: 'Payment allocated to invoice.',
                'transaction_date' => $payment->payment_date?->toDateString() ?? now()->toDateString(),
                'created_by' => $createdBy,
            ]);

            $remaining -= $allocationAmount;
        }

        if ($remaining > 0) {
            $this->recordLedgerTransaction([
                'student_id' => $student->id,
                'student_invoice_id' => null,
                'academic_session_id' => $this->resolveStudentAcademicSessionId($student, $outstandingInvoices->last()?->academic_session_id),
                'type' => 'payment',
                'debit' => 0,
                'credit' => $remaining,
                'reference' => $payment->reference,
                'description' => $payment->notes ?: 'Unallocated student account credit from overpayment.',
                'transaction_date' => $payment->payment_date?->toDateString() ?? now()->toDateString(),
                'created_by' => $createdBy,
            ]);
        }
    }

    protected function applyAvailableCredits(StudentInvoice $invoice, int $createdBy, ?string $allocatedAt = null): void
    {
        $remainingBalance = (float) $invoice->balance_due;

        if ($remainingBalance <= 0) {
            return;
        }

        $creditPayments = Payment::query()
            ->where('student_id', $invoice->student_id)
            ->orderBy('payment_date')
            ->orderBy('id')
            ->get();

        foreach ($creditPayments as $payment) {
            if ($remainingBalance <= 0) {
                break;
            }

            $availableCredit = $payment->unallocated_amount;

            if ($availableCredit <= 0) {
                continue;
            }

            $allocationAmount = min($remainingBalance, $availableCredit);

            PaymentAllocation::create([
                'payment_id' => $payment->id,
                'student_invoice_id' => $invoice->id,
                'amount' => $allocationAmount,
                'allocated_at' => $allocatedAt ?? now()->toDateString(),
            ]);

            $this->recordLedgerTransaction([
                'student_id' => $invoice->student_id,
                'student_invoice_id' => null,
                'academic_session_id' => $invoice->academic_session_id,
                'type' => 'reversal',
                'debit' => $allocationAmount,
                'credit' => 0,
                'reference' => $payment->reference,
                'description' => 'Allocated stored student credit to invoice '.$invoice->invoice_number.'.',
                'transaction_date' => $allocatedAt ?? now()->toDateString(),
                'created_by' => $createdBy,
            ]);

            $this->recordLedgerTransaction([
                'student_id' => $invoice->student_id,
                'student_invoice_id' => $invoice->id,
                'academic_session_id' => $invoice->academic_session_id,
                'type' => 'payment',
                'debit' => 0,
                'credit' => $allocationAmount,
                'reference' => $payment->reference,
                'description' => 'Applied existing student credit to invoice.',
                'transaction_date' => $allocatedAt ?? now()->toDateString(),
                'created_by' => $createdBy,
            ]);

            $invoice->recalculateTotals();
            $invoice->refresh();
            $remainingBalance = (float) $invoice->balance_due;
        }
    }

    protected function resolveStudentAcademicSessionId(Student $student, ?int $fallback = null): int
    {
        if ($fallback) {
            return $fallback;
        }

        $latestInvoiceSessionId = StudentInvoice::query()
            ->where('student_id', $student->id)
            ->latest('issue_date')
            ->value('academic_session_id');

        if ($latestInvoiceSessionId) {
            return (int) $latestInvoiceSessionId;
        }

        $latestEnrollmentSessionId = AcademicSessionEnrollment::query()
            ->whereHas('programEnrollment', fn ($query) => $query->where('student_id', $student->id))
            ->latest('academic_session_id')
            ->value('academic_session_id');

        if ($latestEnrollmentSessionId) {
            return (int) $latestEnrollmentSessionId;
        }

        throw ValidationException::withMessages([
            'payment' => 'No academic session context is available for this student payment.',
        ]);
    }
}
