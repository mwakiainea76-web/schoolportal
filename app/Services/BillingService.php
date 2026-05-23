<?php

namespace App\Services;

use App\Models\AcademicSessionEnrollment;
use App\Models\FeeAdjustment;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\StudentInvoice;
use App\Services\FeeAssignmentService;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BillingService
{
    protected FeeAssignmentService $feeAssignmentService;

    public function __construct(FeeAssignmentService $feeAssignmentService)
    {
        $this->feeAssignmentService = $feeAssignmentService;
    }

    public function createInvoiceForEnrollment(AcademicSessionEnrollment $enrollment, ?int $createdBy = null, ?string $issueDate = null, ?string $dueDate = null): StudentInvoice
    {
        $assignment = $this->feeAssignmentService->resolveActiveAssignment(
            $enrollment->academicSession?->academic_year_id ?? 0,
            $enrollment->programEnrollment?->program_version_mapping_id ?? null,
            $enrollment->year_of_study,
            $enrollment->session_number ?: ($enrollment->academicSession?->session_number ?? $enrollment->academicSession?->session_No ?? null),
            $issueDate
        );

        if (! $assignment) {
            throw ValidationException::withMessages([
                'assignment' => 'No active fee assignment exists for this student and session.',
            ]);
        }

        $invoiceCreatorId = $createdBy ?? $assignment->created_by;

        if (! $invoiceCreatorId) {
            throw ValidationException::withMessages([
                'assignment' => 'No staff user is available to create the invoice for this enrollment.',
            ]);
        }

        $existingInvoice = StudentInvoice::query()
            ->where('enrollment_id', $enrollment->id)
            ->where('invoice_type', 'fees')
            ->latest()
            ->first();

        if ($existingInvoice) {
            return $existingInvoice;
        }

        $invoice = StudentInvoice::create([
            'invoice_number' => StudentInvoice::generateInvoiceNumber(),
            'student_id' => $enrollment->student_id,
            'enrollment_id' => $enrollment->id,
            'fee_assignment_id' => $assignment->id,
            'invoice_type' => 'fees',
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

        return $invoice;
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

    public function recordPayment(StudentInvoice $invoice, float $amount, string $method, int $createdBy, ?string $reference = null, ?string $paymentDate = null): Payment
    {
        $payment = Payment::create([
            'student_invoice_id' => $invoice->id,
            'amount' => $amount,
            'payment_date' => $paymentDate ?? now()->toDateString(),
            'method' => $method,
            'reference' => $reference,
            'status' => 'completed',
            'created_by' => $createdBy,
        ]);

        $invoice->recalculateTotals();

        return $payment;
    }

    public function applyAdjustment(StudentInvoice $invoice, string $type, float $amount, int $createdBy, ?string $description = null, ?string $appliedAt = null): FeeAdjustment
    {
        $adjustment = FeeAdjustment::create([
            'student_invoice_id' => $invoice->id,
            'type' => $type,
            'amount' => $amount,
            'description' => $description,
            'applied_at' => $appliedAt ?? now()->toDateString(),
            'created_by' => $createdBy,
        ]);

        $invoice->recalculateTotals();

        return $adjustment;
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
}

