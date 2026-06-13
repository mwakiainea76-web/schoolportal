<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateAcademicSessionEnrollmentStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'admission_number' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:active,deferred,expelled,graduated'],
            'effective_date' => ['required', 'date'],
            'reason' => ['nullable', 'string', 'max:1000'],
            'resume_date' => ['nullable', 'date', 'after_or_equal:effective_date'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (in_array($this->input('status'), ['deferred', 'expelled'], true)
                && blank(trim((string) $this->input('reason')))) {
                $validator->errors()->add('reason', 'A reason is required when deferring or expelling a student.');
            }
        });
    }
}
