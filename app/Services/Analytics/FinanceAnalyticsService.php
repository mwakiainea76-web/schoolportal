<?php

namespace App\Services\Analytics;

use App\Models\StudentInvoice;
use App\Services\Analytics\Concerns\BuildsAnalyticsFilters;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class FinanceAnalyticsService
{
    use BuildsAnalyticsFilters;

    public function summary(array $filters = []): array
    {
        $filters = $this->normalizeFilters($filters);
        $includedInvoiceStatuses = ['issued', 'partial', 'paid'];
        $today = Carbon::today();
        $startDate = ! empty($filters['date_from'])
            ? Carbon::parse($filters['date_from'])->startOfDay()
            : Carbon::now()->subMonths(5)->startOfMonth();
        $endDate = ! empty($filters['date_to'])
            ? Carbon::parse($filters['date_to'])->endOfDay()
            : Carbon::now()->endOfMonth();

        $invoiceBaseQuery = StudentInvoice::query()
            ->whereIn('status', $includedInvoiceStatuses)
            ->where('approval_status', '!=', 'rejected');

        $totalInvoiced = (clone $invoiceBaseQuery)
            ->whereBetween('issue_date', [$startDate->toDateString(), $endDate->toDateString()])
            ->sum('amount_due');

        $totalCollected = DB::table('payment_allocations')
            ->join('payments', 'payments.id', '=', 'payment_allocations.payment_id')
            ->where('payments.status', 'completed')
            ->whereBetween('payments.payment_date', [$startDate->toDateString(), $endDate->toDateString()])
            ->sum('payment_allocations.amount');

        $outstandingBalance = (clone $invoiceBaseQuery)
            ->where('balance_due', '>', 0)
            ->sum('balance_due');

        $overdueBalance = (clone $invoiceBaseQuery)
            ->where('balance_due', '>', 0)
            ->whereDate('due_date', '<', $today->toDateString())
            ->sum('balance_due');

        $overdueInvoiceCount = (clone $invoiceBaseQuery)
            ->where('balance_due', '>', 0)
            ->whereDate('due_date', '<', $today->toDateString())
            ->count();

        $collectionRate = $totalInvoiced > 0
            ? round(($totalCollected / $totalInvoiced) * 100, 2)
            : 0.0;

        $approvalBacklogCount = StudentInvoice::query()
            ->where('approval_status', 'pending_approval')
            ->count();

        $manualBillingOperationCount = StudentInvoice::query()
            ->where(function ($query) {
                $query->where('notes', 'like', '%manual%')
                    ->orWhere('notes', 'like', '%hostel%');
            })
            ->count();

        $aging = [
            [
                'label' => 'Current',
                'amount' => $this->sumAgingBucket((clone $invoiceBaseQuery), null, 0, 0, $today),
            ],
            [
                'label' => '1-30 Days',
                'amount' => $this->sumAgingBucket((clone $invoiceBaseQuery), 1, 30, null, $today),
            ],
            [
                'label' => '31-60 Days',
                'amount' => $this->sumAgingBucket((clone $invoiceBaseQuery), 31, 60, null, $today),
            ],
            [
                'label' => '61-90 Days',
                'amount' => $this->sumAgingBucket((clone $invoiceBaseQuery), 61, 90, null, $today),
            ],
            [
                'label' => '90+ Days',
                'amount' => $this->sumAgingBucket((clone $invoiceBaseQuery), 91, null, null, $today),
            ],
        ];

        $paymentMethods = DB::table('payments')
            ->select('method')
            ->selectRaw('COUNT(*) as payment_count')
            ->selectRaw('SUM(amount) as total_amount')
            ->where('status', 'completed')
            ->whereBetween('payment_date', [$startDate->toDateString(), $endDate->toDateString()])
            ->groupBy('method')
            ->orderByDesc('total_amount')
            ->get()
            ->map(fn ($row) => [
                'method' => $row->method ?: 'unknown',
                'payment_count' => (int) $row->payment_count,
                'total_amount' => round((float) $row->total_amount, 2),
            ])
            ->all();

        $invoiceStatuses = StudentInvoice::query()
            ->select('status')
            ->selectRaw('COUNT(*) as invoice_count')
            ->where('approval_status', '!=', 'rejected')
            ->groupBy('status')
            ->orderBy('status')
            ->get()
            ->map(fn ($row) => [
                'status' => $row->status,
                'invoice_count' => (int) $row->invoice_count,
            ])
            ->all();

        $adjustments = DB::table('fee_adjustments')
            ->select('type')
            ->selectRaw('COUNT(*) as adjustment_count')
            ->selectRaw('SUM(amount) as total_amount')
            ->groupBy('type')
            ->orderByDesc('total_amount')
            ->get()
            ->map(fn ($row) => [
                'type' => $row->type,
                'adjustment_count' => (int) $row->adjustment_count,
                'total_amount' => round((float) $row->total_amount, 2),
            ])
            ->all();

        $collectionTrend = collect(range(0, 5))
            ->map(function ($offset) use ($startDate) {
                return $startDate->copy()->startOfMonth()->addMonths($offset);
            })
            ->filter(fn ($date) => $date->lte($endDate))
            ->values()
            ->map(function (Carbon $month) use ($includedInvoiceStatuses) {
                $monthStart = $month->copy()->startOfMonth()->toDateString();
                $monthEnd = $month->copy()->endOfMonth()->toDateString();

                $invoiced = StudentInvoice::query()
                    ->whereIn('status', $includedInvoiceStatuses)
                    ->where('approval_status', '!=', 'rejected')
                    ->whereBetween('issue_date', [$monthStart, $monthEnd])
                    ->sum('amount_due');

                $collected = DB::table('payment_allocations')
                    ->join('payments', 'payments.id', '=', 'payment_allocations.payment_id')
                    ->where('payments.status', 'completed')
                    ->whereBetween('payments.payment_date', [$monthStart, $monthEnd])
                    ->sum('payment_allocations.amount');

                return [
                    'month' => $month->format('M Y'),
                    'invoiced' => round((float) $invoiced, 2),
                    'collected' => round((float) $collected, 2),
                ];
            })
            ->all();

        $allocationTotals = DB::table('payment_allocations')
            ->select('payment_id')
            ->selectRaw('SUM(amount) as allocated_amount')
            ->groupBy('payment_id');

        $creditBalanceStudents = DB::table('payments')
            ->leftJoinSub($allocationTotals, 'allocation_totals', function ($join) {
                $join->on('allocation_totals.payment_id', '=', 'payments.id');
            })
            ->join('students', 'students.id', '=', 'payments.student_id')
            ->where('payments.status', 'completed')
            ->whereNull('students.deleted_at')
            ->groupBy('payments.student_id', 'students.admission_number', 'students.first_name', 'students.last_name')
            ->select(
                'payments.student_id',
                'students.admission_number',
                'students.first_name',
                'students.last_name'
            )
            ->selectRaw('SUM(payments.amount - COALESCE(allocation_totals.allocated_amount, 0)) as credit_balance')
            ->havingRaw('SUM(payments.amount - COALESCE(allocation_totals.allocated_amount, 0)) > 0')
            ->orderByDesc('credit_balance')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'student_id' => (int) $row->student_id,
                'admission_number' => $row->admission_number,
                'student_name' => "{$row->first_name} {$row->last_name}",
                'credit_balance' => round((float) $row->credit_balance, 2),
            ])
            ->all();

        $paymentsWithoutAllocations = DB::table('payments')
            ->leftJoinSub($allocationTotals, 'allocation_totals', function ($join) {
                $join->on('allocation_totals.payment_id', '=', 'payments.id');
            })
            ->leftJoin('students', 'students.id', '=', 'payments.student_id')
            ->where('payments.status', 'completed')
            ->select(
                'payments.id',
                'payments.reference',
                'payments.payment_date',
                'students.admission_number',
                'students.first_name',
                'students.last_name'
            )
            ->selectRaw('payments.amount - COALESCE(allocation_totals.allocated_amount, 0) as unallocated_amount')
            ->whereRaw('payments.amount - COALESCE(allocation_totals.allocated_amount, 0) > 0')
            ->orderByDesc('unallocated_amount')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'payment_id' => (int) $row->id,
                'reference' => $row->reference ?: 'No reference',
                'payment_date' => $row->payment_date,
                'admission_number' => $row->admission_number,
                'student_name' => "{$row->first_name} {$row->last_name}",
                'unallocated_amount' => round((float) $row->unallocated_amount, 2),
            ])
            ->all();

        return [
            'filters' => $filters,
            'metrics' => [
                'total_invoiced' => round((float) $totalInvoiced, 2),
                'total_collected' => round((float) $totalCollected, 2),
                'outstanding_balance' => round((float) $outstandingBalance, 2),
                'overdue_balance' => round((float) $overdueBalance, 2),
                'collection_rate' => $collectionRate,
                'overdue_invoice_count' => (int) $overdueInvoiceCount,
                'approval_backlog_count' => (int) $approvalBacklogCount,
                'manual_billing_operation_count' => (int) $manualBillingOperationCount,
                'credit_balance_students' => count($creditBalanceStudents),
            ],
            'aging' => $aging,
            'breakdowns' => [
                'payment_methods' => $paymentMethods,
                'invoice_statuses' => $invoiceStatuses,
                'adjustments' => $adjustments,
                'collection_trend' => $collectionTrend,
            ],
            'exceptions' => [
                'credit_balances' => $creditBalanceStudents,
                'payments_without_allocations' => $paymentsWithoutAllocations,
            ],
            'policy' => [
                'included_invoice_statuses' => $includedInvoiceStatuses,
                'excluded_approval_statuses' => ['rejected'],
            ],
        ];
    }

    protected function sumAgingBucket($query, ?int $minDaysOverdue, ?int $maxDaysOverdue, ?int $unused, Carbon $today): float
    {
        $query->where('balance_due', '>', 0);

        if ($minDaysOverdue === null || $minDaysOverdue === 0) {
            return round((float) $query->whereDate('due_date', '>=', $today->toDateString())->sum('balance_due'), 2);
        }

        if ($maxDaysOverdue === null) {
            return round((float) $query
                ->whereDate('due_date', '<=', $today->copy()->subDays($minDaysOverdue)->toDateString())
                ->sum('balance_due'), 2);
        }

        return round((float) $query
            ->whereDate('due_date', '<=', $today->copy()->subDays($minDaysOverdue)->toDateString())
            ->whereDate('due_date', '>=', $today->copy()->subDays($maxDaysOverdue)->toDateString())
            ->sum('balance_due'), 2);
    }
}
