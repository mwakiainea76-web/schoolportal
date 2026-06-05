<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCurriculumUnitRequest extends FormRequest
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
            'curriculum_id' => 'required|exists:curricula,id',
            'curriculum_mapping_id' => 'required|exists:curriculum_mappings,id',
            'unit_id' => 'required|exists:units,id',
            'semester' => ['nullable', 'integer', 'min:1', 'max:12'],
            'module_taught' => 'required|integer|min:1|max:6',
            'module' => ['nullable', 'integer', 'min:1', 'max:6'],
            'is_compulsory' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
