<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'curriculum_mapping_id' => ['required', 'exists:curriculum_mappings,id'],
            'code' => [
                'required', 
                'string', 
                'max:255',
                Rule::unique('units')->where(function ($query) {
                    return $query->where('curriculum_mapping_id', $this->curriculum_mapping_id);
                })->ignore($this->route('unit')?->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'credit_factor' => ['required', 'integer', 'min:1'],
            'training_hours' => ['required', 'integer', 'min:1'],
            'description' => ['nullable', 'string', 'max:255'],
            'scope' => ['required', Rule::in(['basic', 'common', 'core'])],
            'module_taught' => ['required', 'integer', 'min:1', 'max:6'],
        ];
    }
}
