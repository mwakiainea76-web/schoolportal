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
            'course_id' => ['nullable', 'exists:courses,id'],
            'exam_body_id' => ['nullable', 'exists:exam_bodies,id'],
            'curriculum_id' => [
                'nullable',
                Rule::exists('curricula', 'id')
                    ->where('exam_body_id', $this->input('exam_body_id')),
            ],
            'current_module' => ['required', 'string'],
            'study_mode' => ['nullable', Rule::in(['fulltime', 'parttime'])],
            'fee_discount_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'student_status' => ['nullable', Rule::in(['active', 'deferred', 'expelled', 'graduated'])],
            'curriculum_mapping_id' => [
                'nullable',
                Rule::exists('curriculum_mappings', 'id')
                    ->where('course_id', $this->input('course_id'))
                    ->where('curriculum_id', $this->input('curriculum_id')),
            ],

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
