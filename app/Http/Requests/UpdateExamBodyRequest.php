<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateExamBodyRequest extends FormRequest
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
     'code' => [
    'required',
    'string',
    'min:2',
    'max:255',
    Rule::unique('exam_bodies', 'code')->ignore($this->exam_body),
],
            
            'name' => ['required', 'string','min:2', 'max:255'],
            'description' => ['nullable', 'string', 'min:2', 'max:255'],
            //
        ];
    }
    public function messages()
    {
        return [
            'code.required' => 'Code is required',
            'name.required' => 'Name is required',
            'description.nullable' => 'Description is optional',
            'code.min' => 'Code must be at least 2 characters long',
            'name.min' => 'Name must be at least 2 characters long',
            'description.min' => 'Description must be at least 2 characters long',

        ];
    }
}
