<?php

namespace App\Http\Requests\Api\FeeManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BulkAssignFeePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'certification_level' => ['required', 'integer', 'exists:certification_levels,id'],
            'academic_year_id' => ['required', 'integer', 'exists:academic_years,id'],
            'session_id' => ['required', 'integer', 'exists:academic_sessions,id'],
            'plan_type_context' => ['required', Rule::in(['original', 'revised'])],
            'revises_assignment_id' => ['nullable', 'uuid', 'exists:fee_plan_assignments,id'],
            'reviewed_and_confirmed' => ['sometimes', 'boolean'],
            'force' => ['sometimes', 'boolean'],
        ];
    }
}
