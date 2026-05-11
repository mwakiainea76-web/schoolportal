<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFeePlanItemRequest extends FormRequest
{
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'fee_plan_id' => ['required', 'exists:fee_plans,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('fee_plan_items')
                    ->ignore($this->route('feePlanItem')->id)
                    ->where('fee_plan_id', $this->fee_plan_id),
            ],
            'amount' => ['required', 'numeric', 'min:0'],
        ];
    }
}