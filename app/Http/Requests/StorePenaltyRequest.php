<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePenaltyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
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
            'penalty_type' => ['required', 'in:lost_library_card,lost_id,lost_book,late_payment,other'],
            'amount' => ['required', 'numeric', 'min:0'],
            'trigger' => ['required', 'in:event,manual'],
            'raised_by' => ['nullable', 'exists:users,id'],
            'raised_at' => ['nullable', 'date'],
        ];
    }
}
