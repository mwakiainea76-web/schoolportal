<?php

namespace App\Services;

use App\Models\StudentInvoice;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class BillingStatementService
{
    public function decorateInvoiceListing(StudentInvoice $invoice): StudentInvoice
    {
        $invoice->setAttribute('display_type_label', $this->invoiceTypeLabelFromStoredFields($invoice));

        return $invoice;
    }

    public function decorateInvoice(StudentInvoice $invoice): StudentInvoice
    {
        $invoice->loadMissing([
            'items',
            'adjustments',
            'paymentAllocations.payment',
        ]);

        $itemsTotal = (float) $invoice->items->sum(fn ($item) => (float) $item->total_amount);
        $adjustmentsTotal = (float) $invoice->adjustments->sum(fn ($adjustment) => (float) $adjustment->signedAmount());
        $paidAmount = (float) $invoice->paymentAllocations->sum(fn ($allocation) => (float) $allocation->amount);
        $amountDue = $itemsTotal + $adjustmentsTotal;
        $balanceDue = $amountDue - $paidAmount;

        $invoice->forceFill([
            'amount_due' => $amountDue,
            'paid_amount' => $paidAmount,
            'balance_due' => $balanceDue,
            'status' => $this->resolveStatus($amountDue, $paidAmount, $balanceDue, $invoice->status),
        ]);

        $invoice->setAttribute('items_total', $itemsTotal);
        $invoice->setAttribute('adjustments_total', $adjustmentsTotal);
        $invoice->setAttribute('display_type_label', $this->invoiceTypeLabel($invoice));

        return $invoice;
    }

    public function buildStatementRow(Collection $sessionInvoices): array
    {
        /** @var StudentInvoice $anchorInvoice */
        $anchorInvoice = $sessionInvoices->sortByDesc('id')->first();

        $ledgerEntries = $this->collectLedgerEntries($sessionInvoices);
        $totals = $this->summarizeLedgerTotals($ledgerEntries);

        return [
            'id' => $anchorInvoice->id,
            'statement_reference' => $this->statementReference($anchorInvoice->academic_session_id),
            'session' => $anchorInvoice->academicSession?->display_name,
            'issue_date' => $sessionInvoices->pluck('issue_date')->filter()->sort()->first()?->toDateString(),
            'due_date' => $sessionInvoices->pluck('due_date')->filter()->sortDesc()->first()?->toDateString(),
            'amount_due' => $totals['amount_due'],
            'paid_amount' => $totals['paid_amount'],
            'balance_due' => $totals['balance_due'],
            'status' => $totals['status'],
            'invoice_count' => $sessionInvoices->count(),
            'transaction_count' => $ledgerEntries->count(),
        ];
    }

    public function buildSessionSummary(Collection $sessionInvoices): array
    {
        $sessionInvoices = $this->decorateInvoices($sessionInvoices);
        $ledgerEntries = $this->collectLedgerEntries($sessionInvoices);
        $totals = $this->summarizeLedgerTotals($ledgerEntries);

        $items = $sessionInvoices
            ->flatMap(function (StudentInvoice $sessionInvoice) {
                return $sessionInvoice->items->map(fn ($item) => [
                    'id' => $item->id,
                    'invoice_number' => $sessionInvoice->invoice_number,
                    'description' => $item->description,
                    'quantity' => (int) $item->quantity,
                    'unit_amount' => (float) $item->unit_amount,
                    'total_amount' => (float) $item->total_amount,
                ]);
            })
            ->values();

        $adjustments = $sessionInvoices
            ->flatMap(function (StudentInvoice $sessionInvoice) {
                return $sessionInvoice->adjustments->map(fn ($adjustment) => [
                    'id' => $adjustment->id,
                    'invoice_number' => $sessionInvoice->invoice_number,
                    'type' => $adjustment->type,
                    'display_type' => $this->adjustmentTypeLabel(
                        $adjustment->type,
                        $adjustment->description
                    ),
                    'description' => $adjustment->description,
                    'applied_at' => optional($adjustment->applied_at)->toDateString(),
                    'amount' => (float) $adjustment->amount,
                ]);
            })
            ->sortBy('applied_at')
            ->values();

        $paymentAllocations = $sessionInvoices
            ->flatMap(function (StudentInvoice $sessionInvoice) {
                return $sessionInvoice->paymentAllocations->map(fn ($allocation) => [
                    'id' => $allocation->id,
                    'invoice_number' => $sessionInvoice->invoice_number,
                    'amount' => (float) $allocation->amount,
                    'payment_date' => optional($allocation->payment?->payment_date)->toDateString(),
                    'method' => $allocation->payment?->method,
                    'reference' => $allocation->payment?->reference,
                ]);
            })
            ->sortBy('payment_date')
            ->values();

        return [
            'invoice_count' => $sessionInvoices->count(),
            'included_invoices' => $this->mapIncludedInvoices($sessionInvoices, true),
            'items' => $items,
            'adjustments' => $adjustments,
            'payment_allocations' => $paymentAllocations,
            'items_total' => (float) $items->sum('total_amount'),
            'adjustments_total' => (float) $sessionInvoices->sum('adjustments_total'),
            'paid_amount' => $totals['paid_amount'],
            'balance_due' => $totals['balance_due'],
        ];
    }

    public function buildStudentStatement(
        StudentInvoice $invoice,
        Collection $sessionInvoices,
    ): array {
        $sessionInvoices = $this->decorateInvoices($sessionInvoices);
        $ledgerEntries = $this->collectLedgerEntries($sessionInvoices);
        $totals = $this->summarizeLedgerTotals($ledgerEntries);

        $runningBalance = 0;
        $entries = $ledgerEntries->map(function ($entry) use (&$runningBalance) {
            $runningBalance += ((float) $entry->debit - (float) $entry->credit);

            return [
                'id' => $entry->id,
                'date' => optional($entry->transaction_date)->toDateString(),
                'reference' => $entry->reference,
                'description' => $entry->description,
                'debit' => (float) $entry->debit,
                'credit' => (float) $entry->credit,
                'running_balance' => $runningBalance,
                'type' => $entry->type,
            ];
        })->values();

        $statementItems = $sessionInvoices
            ->flatMap(fn (StudentInvoice $sessionInvoice) => $sessionInvoice->items)
            ->map(fn ($item) => [
                'description' => $item->description,
                'quantity' => (int) $item->quantity,
                'unit_amount' => (float) $item->unit_amount,
                'total_amount' => (float) $item->total_amount,
            ])
            ->values();

        $student = $invoice->student;

        return [
            'school_name' => config('app.name'),
            'generated_on' => now()->toDateString(),
            'statement_reference' => $this->statementReference($invoice->academic_session_id),
            'invoice_number' => $invoice->invoice_number,
            'issue_date' => optional($invoice->issue_date)->toDateString(),
            'due_date' => optional($invoice->due_date)->toDateString(),
            'status' => $totals['status'],
            'student' => [
                'name' => $student?->full_name,
                'admission_number' => $student?->admission_number,
                'admission_date' => optional($student?->created_at)->toDateString(),
            ],
            'session' => $invoice->academicSession?->display_name,
            'entries' => $entries,
            'items' => $statementItems,
        ];
    }

    protected function decorateInvoices(Collection $invoices): Collection
    {
        return $invoices
            ->map(fn (StudentInvoice $invoice) => $this->decorateInvoice($invoice))
            ->values();
    }

    protected function collectLedgerEntries(Collection $sessionInvoices): Collection
    {
        return $sessionInvoices
            ->flatMap(fn (StudentInvoice $invoice) => $invoice->ledgerTransactions)
            ->sortBy([
                fn ($a, $b) => ($a->transaction_date ?? '9999-12-31') <=> ($b->transaction_date ?? '9999-12-31'),
                fn ($a, $b) => $a->id <=> $b->id,
            ])
            ->values();
    }

    protected function summarizeLedgerTotals(Collection $ledgerEntries): array
    {
        $totalDebits = (float) $ledgerEntries->sum('debit');
        $totalCredits = (float) $ledgerEntries->sum('credit');
        $balanceDue = $totalDebits - $totalCredits;

        return [
            'amount_due' => $totalDebits,
            'paid_amount' => $totalCredits,
            'balance_due' => $balanceDue,
            'status' => $this->resolveStatus($totalDebits, $totalCredits, $balanceDue, 'issued'),
        ];
    }

    protected function mapIncludedInvoices(Collection $sessionInvoices, bool $includeBalance): Collection
    {
        return $sessionInvoices->map(function (StudentInvoice $sessionInvoice) use ($includeBalance) {
            $invoice = [
                'id' => $sessionInvoice->id,
                'invoice_number' => $sessionInvoice->invoice_number,
                'issue_date' => optional($sessionInvoice->issue_date)->toDateString(),
                'amount_due' => (float) $sessionInvoice->amount_due,
                'display_type_label' => $this->invoiceTypeLabel($sessionInvoice),
            ];

            if ($includeBalance) {
                $invoice['balance_due'] = (float) $sessionInvoice->balance_due;
            }

            return $invoice;
        })->values();
    }

    protected function statementReference(?int $sessionId): string
    {
        return 'STATEMENT-'.($sessionId ?? 'NA');
    }

    protected function resolveStatus(float $amountDue, float $paidAmount, float $balanceDue, ?string $fallback = null): string
    {
        if ($amountDue <= 0 || $balanceDue <= 0) {
            return $paidAmount > 0 ? 'paid' : ($fallback ?: 'draft');
        }

        if ($paidAmount > 0 && $balanceDue > 0) {
            return 'partial';
        }

        if ($amountDue > 0) {
            return 'issued';
        }

        return $fallback ?: 'draft';
    }

    protected function invoiceTypeLabel(StudentInvoice $invoice): string
    {
        $notes = (string) ($invoice->notes ?? '');
        $description = trim((string) optional($invoice->items->first())->description);

        if ($invoice->invoice_type === 'default_fees' || $notes === BillingService::NOTE_MANUAL_STANDARD) {
            return 'STANDARD INVOICE';
        }

        if ($invoice->invoice_type === 'hostel' || $notes === BillingService::NOTE_HOSTEL) {
            return 'HOSTEL INVOICE';
        }

        if ($notes === BillingService::NOTE_CARRY_FORWARD) {
            return 'INVOICE ADJUSTMENT - OPENING BALANCE';
        }

        if ($notes === BillingService::NOTE_CORRECTED_REVERSAL) {
            return 'INVOICE ADJUSTMENT';
        }

        return $this->prefixedAdjustmentLabel($description);
    }

    protected function invoiceTypeLabelFromStoredFields(StudentInvoice $invoice): string
    {
        $notes = (string) ($invoice->notes ?? '');

        if ($invoice->invoice_type === 'default_fees' || $notes === BillingService::NOTE_MANUAL_STANDARD) {
            return 'STANDARD INVOICE';
        }

        if ($invoice->invoice_type === 'hostel' || $notes === BillingService::NOTE_HOSTEL) {
            return 'HOSTEL INVOICE';
        }

        if ($notes === BillingService::NOTE_CARRY_FORWARD) {
            return 'INVOICE ADJUSTMENT - OPENING BALANCE';
        }

        if ($notes === BillingService::NOTE_CORRECTED_REVERSAL) {
            return 'INVOICE ADJUSTMENT';
        }

        if ($invoice->invoice_type === 'penalty' || $notes === BillingService::NOTE_MANUAL_PENALTY) {
            return 'INVOICE ADJUSTMENT - PENALTY';
        }

        return 'INVOICE ADJUSTMENT';
    }

    protected function adjustmentTypeLabel(string $type, ?string $description = null): string
    {
        return match ($type) {
            'reversal' => 'INVOICE ADJUSTMENT - REVERSAL',
            'penalty', 'other' => $this->prefixedAdjustmentLabel($description),
            default => Str::upper(str_replace('_', ' ', $type)),
        };
    }

    protected function prefixedAdjustmentLabel(?string $description = null): string
    {
        $normalized = Str::upper(trim((string) $description));

        if ($normalized === '') {
            return 'INVOICE ADJUSTMENT';
        }

        return 'INVOICE ADJUSTMENT - '.$normalized;
    }
}
