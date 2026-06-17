<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStaffSalaryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->hasRole('admin');
    }

    public function rules(): array
    {
        return [
            'staff_number' => ['required', 'string', 'exists:staffs,staff_number'],
            'salary' => ['required', 'numeric', 'min:0', 'max:999999999'],
        ];
    }

    public function messages(): array
    {
        return [
            'staff_number.exists' => 'Select a valid staff number.',
            'salary.min' => 'Salary cannot be negative.',
        ];
    }
}
