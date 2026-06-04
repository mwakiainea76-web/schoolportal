<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCourseVersionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'course_id' => ['required', 'exists:courses,id'],
            'exam_body_id' => ['required', 'exists:exam_bodies,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('course_versions', 'name')->ignore($this->route('curriculum')),
            ],
            'is_active' => ['sometimes', 'boolean'],
            'version_state' => ['required', Rule::in(['start', 'end'])],
            'description' => ['nullable', 'string'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ];
    }
}
