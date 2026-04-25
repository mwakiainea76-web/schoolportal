<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $staffId = $this->route('staff')?->id;

        return [
            // -------------------
            // PERSONAL DETAILS
            // -------------------
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'other_name' => ['nullable', 'string', 'max:255'],

            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($this->route('staff')->user_id),
            ],

            'phone_number' => ['required', 'string', 'max:15'],
            'gender' => ['required', 'string', 'max:15'],
            'date_of_birth' => ['required', 'date'],
            'county' => ['required', 'string', 'max:70'],
            'address' => ['required', 'string', 'min:3'],
            'religion' => ['required', 'string', 'min:3'],

            'profile_photo' => ['nullable', 'string'],

            // -------------------
            // EMPLOYMENT
            // -------------------
            'department_id' => ['required', 'exists:departments,id'],
            'role_name' => ['required', 'exists:roles,name'],
            'salary' => ['nullable', 'numeric'],
            'staff_status' => ['nullable', 'string'],
            'employment_type' => ['required', 'string'],

            // -------------------
            // NEXT OF KIN
            // -------------------
            'kin_first_name' => ['required', 'string', 'max:255'],
            'kin_last_name' => ['required', 'string', 'max:255'],
            'kin_relationship' => ['required', 'string', 'max:255'],
            'kin_phone' => ['required', 'string', 'max:15'],
            'kin_alt_phone' => ['nullable', 'string', 'max:255'],
            'kin_email' => ['nullable', 'email', 'max:255'],

            // -------------------
            // MEDICAL
            // -------------------
            'is_pwd' => ['boolean'],
            'disability_type' => ['nullable', 'string', 'max:255'],
            'medical_condition' => ['nullable', 'string', 'max:255'],
        ];
    }
}
