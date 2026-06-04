<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseVersionMappingRequest extends FormRequest
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
            'exam_body_id' => 'required|exists:exam_bodies,id',
            'course_version_id' => 'required|exists:course_versions,id',
            'is_active' => 'required|boolean',
            'description' => 'nullable|string',
        ];
    }
}
