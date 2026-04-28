<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateFeeModelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'curricula_id' => 'nullable|exists:curricula,id',
            'academic_session_id' => 'nullable|exists:academic_sessions,id',
            'department_id' => 'nullable|exists:departments,id',
            'scope' => 'required|in:global,department,curriculum',
            'priority' => 'required|in:60,70,80',
            'valid_from' => 'required|date',
            'valid_until' => 'nullable|date|after:valid_from',
            'is_active' => 'required|boolean',
            'fee_template_id' => 'required|exists:fee_templates,id',

        ];
    }
}
