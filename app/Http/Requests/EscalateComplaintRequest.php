<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EscalateComplaintRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('admin');
    }

    public function rules(): array
    {
        return [
            'escalated_to' => ['required', 'integer', 'exists:staffs,id'],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
