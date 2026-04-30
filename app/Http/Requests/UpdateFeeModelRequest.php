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
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'course_curriculum_id' => 'nullable|required_if:scope,curriculum|exists:course_curriculum,id',
            'academic_session_id' => 'required|exists:academic_sessions,id',
            'department_id' => 'nullable|required_if:scope,department|exists:departments,id',
            'scope' => 'required|in:global,department,curriculum',
            'valid_from' => 'required|date',
            'valid_until' => 'nullable|date|after:valid_from',
            'is_active' => 'required|boolean',
            'fee_template_id' => 'required|exists:fee_templates,id',

        ];
    }
}
