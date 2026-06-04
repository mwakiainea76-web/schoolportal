<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatecourseRequest extends FormRequest
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
                Rule::unique('courses', 'code')
                    ->ignore($this->route('course')),
            ],
            'initials' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'course_version_id' => 'nullable|exists:course_versions,id',
            'certification_level_id' => 'required|exists:certification_levels,id',
            'department_id' => 'required|exists:departments,id',
        ];
    }
}
