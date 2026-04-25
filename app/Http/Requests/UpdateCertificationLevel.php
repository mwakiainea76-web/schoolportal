<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCertificationLevel extends FormRequest
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
                Rule::unique('certification_levels', 'code')
                    ->ignore($this->route('certification_level')?->id),

            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'entry_grade' => [
                'required',
                'string',
                'max:255',
            ],

            'exam_body_id' => [
                'required',
                'exists:exam_bodies,id',
            ],
        ];
    }
}
