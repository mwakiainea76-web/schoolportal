<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseVersionMappingRequest extends FormRequest
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
            'is_active' => ['required', 'boolean'],
            'exam_body_id' => ['required', 'exists:exam_bodies,id'],
            'course_version_id' => ['required', 'exists:course_versions,id'],
            'description' => ['nullable', 'string'],
        ];

    }
}
