<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use App\Models\StaffLoanReduction;
use Carbon\Carbon;
use Illuminate\Http\Request;

class StaffPayslipController extends Controller
{
    public function index(Request $request)
    {
        $month = $this->selectedMonth($request->query('month'));
        $staffNumber = trim((string) $request->query('staff_number', ''));
        $staff = null;
        $payslip = null;

        if ($staffNumber !== '') {
            $staff = Staff::query()
                ->with('department:id,name')
                ->where('staff_number', $staffNumber)
                ->first();

            if ($staff) {
                $payslip = $this->payslipFor($staff, $month);
            }
        }

        return inertia('HR/Payslips/Index', [
            'filters' => [
                'staff_number' => $staffNumber,
                'month' => $month->format('Y-m'),
            ],
            'staffOptions' => $staff ? [$this->staffOption($staff)] : [],
            'payslip' => $payslip,
        ]);
    }

    private function payslipFor(Staff $staff, Carbon $month): array
    {
        $monthStart = $month->copy()->startOfMonth();
        $monthEnd = $month->copy()->endOfMonth();
        $grossPay = (float) ($staff->salary ?? 0);

        $deductions = StaffLoanReduction::query()
            ->where('staff_id', $staff->id)
            ->where('status', 'active')
            ->whereDate('start_date', '<=', $monthEnd)
            ->where(function ($query) use ($monthStart) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', $monthStart);
            })
            ->orderBy('loan_name')
            ->get()
            ->map(fn (StaffLoanReduction $reduction) => [
                'id' => $reduction->id,
                'label' => $reduction->loan_name,
                'amount' => (float) $reduction->monthly_reduction,
                'start_date' => $reduction->start_date?->toDateString(),
                'end_date' => $reduction->end_date?->toDateString(),
            ])
            ->values();

        $totalDeductions = (float) $deductions->sum('amount');

        return [
            'period' => $month->format('F Y'),
            'staff' => [
                'staff_number' => $staff->staff_number,
                'name' => $staff->full_name,
                'email' => $staff->email,
                'designation' => $staff->designation,
                'department' => $staff->department?->name,
            ],
            'earnings' => [
                [
                    'label' => 'Basic Salary',
                    'amount' => $grossPay,
                ],
            ],
            'deductions' => $deductions,
            'gross_pay' => $grossPay,
            'total_deductions' => $totalDeductions,
            'net_pay' => max($grossPay - $totalDeductions, 0),
        ];
    }

    private function selectedMonth($value): Carbon
    {
        $month = trim((string) $value);

        if (preg_match('/^\d{4}-\d{2}$/', $month)) {
            try {
                return Carbon::createFromFormat('Y-m', $month)->startOfMonth();
            } catch (\Throwable) {
                return now()->startOfMonth();
            }
        }

        return now()->startOfMonth();
    }

    private function staffOption(Staff $staff): array
    {
        return [
            'id' => $staff->staff_number,
            'staff_id' => $staff->id,
            'staff_number' => $staff->staff_number,
            'name' => collect([
                $staff->full_name,
                $staff->staff_number,
                $staff->designation,
            ])->filter()->implode(' - '),
            'email' => $staff->email,
        ];
    }
}
