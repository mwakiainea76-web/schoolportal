<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUnitRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
          $unit = $this->route('unit');
        return [
            'code' => ['required', 'string', 'max:255', 
              Rule::unique('units', 'code')->ignore($unit)],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'credit_factor' => ['required', 'integer', 'min:1'],
            'training_hours' => ['required', 'integer', 'min:1'],
            
        ];
    }
}
