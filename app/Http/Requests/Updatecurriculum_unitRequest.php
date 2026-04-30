<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Updatecurriculum_unitRequest extends FormRequest
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
            'course_curriculum_id' => 'required|exists:course_curriculum,id',
            'unit_id' => 'required|exists:units,id',
            'module_taught' => 'required|integer|min:1|max:6',
        ];
    }
}
