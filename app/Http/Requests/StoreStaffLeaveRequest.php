<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStaffLeaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->staff;
    }

    public function rules(): array
    {
        return [
            'staff_number' => ['required', 'string', 'exists:staffs,staff_number'],
            'leave_type' => ['required', 'string', Rule::in([
                'annual',
                'sick',
                'maternity',
                'paternity',
                'compassionate',
                'study',
                'unpaid',
                'other',
            ])],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'staff_number.exists' => 'Select a valid staff number.',
            'leave_type.in' => 'Select a valid leave type.',
            'start_date.after_or_equal' => 'The start date cannot be in the past.',
            'end_date.after_or_equal' => 'The end date must be on or after the start date.',
        ];
    }
}
