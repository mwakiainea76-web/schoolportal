<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorecourseRequest extends FormRequest
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
            'exam_body_id' => [
                'required',
                'exists:exam_bodies,id',
            ],
            'curriculum_id' => [
                'required',
                Rule::exists('curricula', 'id')
                    ->where(fn ($query) => $query
                        ->where('exam_body_id', $this->input('exam_body_id'))
                        ->where('is_active', true)),
            ],
            'certification_level_id' => [
                'required',
                Rule::exists('certification_levels', 'id')
                    ->where(fn ($query) => $query->where('exam_body_id', $this->input('exam_body_id'))),
            ],
            'department_id' => 'required|exists:departments,id',
        ];
    }
}
