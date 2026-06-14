<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCurriculumRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'exam_body_id' => ['required', 'integer', 'exists:exam_bodies,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('curricula', 'name')->where('exam_body_id', $this->exam_body_id),
            ],
            'description' => ['nullable', 'string'],
        ];
    }
}
