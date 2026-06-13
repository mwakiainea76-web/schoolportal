<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStaffRequest extends FormRequest
{
    public static function stepRules(): array
    {
        return [
            1 => [
                'first_name' => ['required', 'string', 'max:255'],
                'last_name' => ['required', 'string', 'max:255'],
                'other_name' => ['nullable', 'string', 'max:255'],
                'email' => ['required', 'email', Rule::unique('users', 'email')],
                'phone_number' => ['required', 'string', 'max:15'],
                'gender' => ['required', 'string', 'max:15'],
                'date_of_birth' => ['required', 'date'],
                'county' => ['required', 'string', 'max:70'],
                'address' => ['required', 'string', 'min:3'],
                'religion' => ['required', 'string', 'min:3'],
                'is_pwd' => ['boolean'],
                'disability_type' => ['nullable', 'string', 'max:255'],
                'medical_condition' => ['nullable', 'string', 'max:255'],
            ],
            2 => [
                'department_id' => ['required', 'exists:departments,id'],
                'role_name' => ['required', 'exists:roles,name'],
                'designation' => ['required', 'string', 'max:255'],
                'national_id_number' => ['required', 'string', 'max:50', Rule::unique('staffs', 'national_id_number')],
                'salary' => ['nullable', 'numeric'],
                'employment_type' => ['required', 'string', 'min:3'],
                'hired_date' => ['required', 'date'],
                'staff_status' => ['nullable', 'in:active,suspended,onleave,exited'],
                'highest_qualification' => ['required', 'string', 'max:255'],
                'specialization' => ['nullable', 'string', 'max:255'],
                'kra_pin' => ['nullable', 'string', 'max:50'],
                'nhif_number' => ['nullable', 'string', 'max:50'],
                'nssf_number' => ['nullable', 'string', 'max:50'],
            ],
            3 => [
                'kin_first_name' => ['required', 'string', 'max:255'],
                'kin_last_name' => ['required', 'string', 'max:255'],
                'kin_relationship' => ['required', 'string', 'max:255'],
                'kin_phone' => ['required', 'string', 'max:15'],
                'kin_alt_phone' => ['nullable', 'string', 'max:255'],
                'kin_email' => ['nullable', 'email', 'max:255'],
            ],
        ];
    }

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
        return array_merge(...array_values(self::stepRules()));
    }
}
