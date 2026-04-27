<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFeeTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('template')?->id;

        return [
            'name' => ['required', 'string', 'max:255', "unique:fee_templates,name,{$id}"],
            'description' => ['nullable', 'string'],

            'is_active' => ['required', 'boolean'],
            'is_reusable' => ['required', 'boolean'],
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'is_active' => $this->boolean('is_active'),
            'is_reusable' => $this->boolean('is_reusable'),
        ]);
    }
}
