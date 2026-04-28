<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentInvoicesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'enrollment_id' => ['sometimes', 'required', 'exists:enrollments,id'],
            'fee_model_id' => ['sometimes', 'required', 'exists:fee_models,id'],
            'gross_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'adjusted_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'credit_balance' => ['nullable', 'numeric', 'min:0'],
            'overpayment_action' => ['nullable', 'string', 'in:credit,refund,pending'],
            'due_date' => ['nullable', 'date'],
        ];
    }
}
