<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('programs', 'code')
                    ->ignore($this->route('program')),
            ],
            'initials' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'certification_level_id' => 'required|exists:certification_levels,id',
            'department_id' => 'required|exists:departments,id',
        ];
    }
}
