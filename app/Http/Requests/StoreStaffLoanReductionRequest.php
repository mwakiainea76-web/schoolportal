<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStaffLoanReductionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->hasRole('admin');
    }

    public function rules(): array
    {
        return [
            'staff_number' => ['required', 'string', 'exists:staffs,staff_number'],
            'loan_name' => ['required', 'string', 'max:120'],
            'principal_amount' => ['required', 'numeric', 'min:1', 'max:999999999'],
            'monthly_reduction' => ['required', 'numeric', 'min:1', 'max:999999999'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'staff_number.exists' => 'Select a valid staff number.',
            'principal_amount.min' => 'Loan amount must be greater than zero.',
            'monthly_reduction.min' => 'Monthly reduction must be greater than zero.',
            'end_date.after_or_equal' => 'End date must be on or after the start date.',
        ];
    }
}
