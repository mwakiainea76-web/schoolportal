<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDepartmentRequest extends FormRequest
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
            'hod_staff_number' => ['nullable', 'string', 'exists:staffs,staff_number'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $staffNumber = trim((string) $this->input('hod_staff_number', ''));

        $this->merge([
            'hod_staff_number' => $staffNumber === '' ? null : $staffNumber,
        ]);
    }
}
