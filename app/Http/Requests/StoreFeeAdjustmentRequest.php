<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFeeAdjustmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Assuming authorization is handled elsewhere or allowed for now
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'student_invoice_id' => ['required', 'exists:student_invoices,id'],
            'scope' => ['required', 'in:student,department,curriculum,session'],
            'scope_ref' => ['nullable', 'integer'],
            'type' => ['required', 'in:percentage,fixed'],
            'value' => ['required', 'numeric'],
            'reason' => ['required', 'string', 'max:255'],
            'approved_by' => ['nullable', 'exists:users,id'],
        ];
    }
}
