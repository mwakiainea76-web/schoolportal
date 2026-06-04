<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCourseVersionRequest extends FormRequest
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
                Rule::unique('course_versions', 'name'),
            ],
            'is_active' => ['sometimes', 'boolean'],
            'description' => ['nullable', 'string'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ];
    }
}
