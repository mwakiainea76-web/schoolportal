<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Personal
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'other_name' => ['nullable', 'string', 'max:255'],
            'email' => [
                'required', 'email',
                Rule::unique('users', 'email')->ignore($this->route('student')->user_id),
            ],
            'phone_number' => ['required', 'string', 'max:15'],
            'gender' => ['required', 'string'],
            'date_of_birth' => ['required', 'date'],
            'county' => ['required', 'string', 'max:70'],
            'address' => ['required', 'string', 'min:3'],
            'religion' => ['required', 'string', 'min:3'],

            // Academic
            'previous_school' => ['required', 'string', 'max:255'],
            'current_module' => ['required', 'string'],
            'fee_discount_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'student_status' => ['nullable', Rule::in(['active', 'suspended', 'graduated', 'dropped'])],
            'curriculum_id' => ['required', 'exists:curricula,id'],

            // Medical
            'is_pwd' => ['boolean'],
            'disability_type' => ['nullable', 'string', 'max:255'],
            'medical_condition' => ['nullable', 'string', 'max:255'],

            // Next of kin
            'kin_first_name' => ['required', 'string', 'max:255'],
            'kin_last_name' => ['required', 'string', 'max:255'],
            'kin_relationship' => ['required', 'string', 'max:255'],
            'kin_phone' => ['required', 'string', 'max:15'],
            'kin_alt_phone' => ['nullable', 'string', 'max:15'],
            'kin_email' => ['nullable', 'email', 'max:255'],
        ];
    }
}
