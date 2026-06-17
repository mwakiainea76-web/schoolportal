<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStaffLoanReductionRequest;
use App\Http\Requests\UpdateStaffSalaryRequest;
use App\Models\Staff;
use App\Models\StaffLoanReduction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StaffSalaryController extends Controller
{
    public function index(Request $request)
    {
        $query = trim((string) $request->query('search', ''));

        $staffs = Staff::query()
            ->with('department:id,name')
            ->select([
                'id',
                'department_id',
                'staff_number',
                'first_name',
                'last_name',
                'other_name',
                'email',
                'designation',
                'salary',
                'staff_status',
            ])
            ->when($query !== '', function ($builder) use ($query) {
                $term = '%'.Str::lower($query).'%';

                $builder->where(function ($q) use ($term) {
                    $q->whereRaw('LOWER(staff_number) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(first_name) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(last_name) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(email) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(designation) LIKE ?', [$term]);
                });
            })
            ->orderBy('first_name')
            ->paginate(10)
            ->withQueryString();

        $staffs->through(fn (Staff $staff) => [
            'id' => $staff->id,
            'staff_number' => $staff->staff_number,
            'name' => $staff->full_name,
            'email' => $staff->email,
            'designation' => $staff->designation,
            'department' => $staff->department?->name,
            'salary' => $staff->salary,
            'staff_status' => $staff->staff_status,
        ]);

        $loanReductions = StaffLoanReduction::query()
            ->with([
                'staff:id,department_id,staff_number,first_name,last_name,other_name,designation,email',
                'staff.department:id,name',
            ])
            ->latest('id')
            ->paginate(8, ['*'], 'loan_page')
            ->withQueryString();

        $loanReductions->through(fn (StaffLoanReduction $reduction) => [
            'id' => $reduction->id,
            'loan_name' => $reduction->loan_name,
            'principal_amount' => $reduction->principal_amount,
            'monthly_reduction' => $reduction->monthly_reduction,
            'start_date' => $reduction->start_date?->toDateString(),
            'end_date' => $reduction->end_date?->toDateString(),
            'status' => $reduction->status,
            'notes' => $reduction->notes,
            'staff' => $reduction->staff ? [
                'staff_number' => $reduction->staff->staff_number,
                'name' => $reduction->staff->full_name,
                'email' => $reduction->staff->email,
                'designation' => $reduction->staff->designation,
                'department' => $reduction->staff->department?->name,
            ] : null,
        ]);

        return inertia('HR/Salaries/Index', [
            'staffs' => $staffs,
            'loanReductions' => $loanReductions,
            'filters' => [
                'search' => $query,
            ],
        ]);
    }

    public function update(UpdateStaffSalaryRequest $request)
    {
        $staff = Staff::query()
            ->where('staff_number', $request->staff_number)
            ->firstOrFail();

        $staff->update([
            'salary' => $request->salary,
        ]);

        return redirect()
            ->route('hr.salaries.index')
            ->with('success', 'Staff salary updated successfully.');
    }

    public function storeLoanReduction(StoreStaffLoanReductionRequest $request)
    {
        $staff = Staff::query()
            ->where('staff_number', $request->staff_number)
            ->firstOrFail();

        StaffLoanReduction::create([
            'staff_id' => $staff->id,
            'loan_name' => $request->loan_name,
            'principal_amount' => $request->principal_amount,
            'monthly_reduction' => $request->monthly_reduction,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => 'active',
            'notes' => $request->notes,
            'created_by' => $request->user()?->id,
        ]);

        return redirect()
            ->route('hr.salaries.index')
            ->with('success', 'Loan reduction added successfully.');
    }
}
