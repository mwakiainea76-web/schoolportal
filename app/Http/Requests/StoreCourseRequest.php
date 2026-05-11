<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCourseRequest extends FormRequest
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
                Rule::unique('courses', 'code'),
            ],
            'initials' => [
                'required',
                'string',
                'max:255',
            ],
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration_in_months' => 'required|integer|min:1|max:20',
            'certification_level_id' => 'required|exists:certification_levels,id',
            'department_id' => 'required|exists:departments,id',
        ];
    }
}
