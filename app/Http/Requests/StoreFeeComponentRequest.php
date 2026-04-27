<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateFeeComponentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fee_template_id' => ['required', 'exists:fee_templates,id'],

            'name' => ['required', 'string', 'max:255'],

            'type' => ['required', 'string', 'max:100'],

            'amount' => ['required', 'numeric', 'min:0'],

            'frequency' => ['required', 'in:admission,always,session,year'],

            'is_optional' => ['boolean'],

            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_optional' => filter_var($this->is_optional, FILTER_VALIDATE_BOOLEAN),
            'sort_order' => $this->sort_order ?? 0,
        ]);
    }
}
