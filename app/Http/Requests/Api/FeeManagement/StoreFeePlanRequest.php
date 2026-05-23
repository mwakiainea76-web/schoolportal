<?php

namespace App\Http\Requests\Api\FeeManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFeePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'plan_type' => ['nullable', Rule::in(['original', 'revised'])],
        ];
    }
}
