<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFeeAssignmentRequest extends FormRequest
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
            'fee_plan_id' => 'required|exists:fee_plans,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'curriculum_mapping_id' => 'required|exists:curriculum_mappings,id',
            'year_of_study' => 'required|integer|min:1|max:20',
            'session_number' => 'required|integer|min:1|max:20',
        ];
    }
}
