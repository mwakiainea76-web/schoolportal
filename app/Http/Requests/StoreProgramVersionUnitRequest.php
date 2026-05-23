<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProgramVersionUnitRequest extends FormRequest
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
            'program_version_mapping_id' => 'required|exists:program_version_mappings,id',
            'unit_id' => [
                'required',
                'exists:units,id',
            ],
            'module_taught' => 'required|integer|min:1|max:6',
        ];

    }
}

