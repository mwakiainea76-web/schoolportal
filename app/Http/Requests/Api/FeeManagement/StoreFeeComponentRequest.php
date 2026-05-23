<?php

namespace App\Http\Requests\Api\FeeManagement;

use Illuminate\Foundation\Http\FormRequest;

class StoreFeeComponentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'is_optional' => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer'],
        ];
    }
}
