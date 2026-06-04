<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDepartmentRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('departments', 'code')
                    ->ignore($this->route('department')?->id),
            ],
            'description' => ['nullable', 'string', 'max:255'],
            'hod_staff_id' => ['nullable', 'exists:staffs,id'],
        ];
    }
}
