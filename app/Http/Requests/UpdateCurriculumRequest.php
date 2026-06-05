<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCurriculumRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'course_id' => ['nullable', 'exists:courses,id'],
            'exam_body_code' => ['required', 'string', 'exists:exam_bodies,code'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('curricula', 'name')->ignore($this->route('curriculum')),
            ],
            'description' => ['nullable', 'string'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $examBodyCode = trim((string) $this->input('exam_body_code', ''));

        $this->merge([
            'exam_body_code' => $examBodyCode,
        ]);
    }
}
