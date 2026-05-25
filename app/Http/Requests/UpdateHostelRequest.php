<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHostelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $hostel = $this->route('hostel');
        $rooms = collect($this->input('rooms', []));

        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:100', Rule::unique('hostels', 'code')->ignore($hostel?->id)],
            'session_fee_amount' => ['required', 'numeric', 'min:0'],
            'gender' => ['nullable', Rule::in(['male', 'female', 'mixed'])],
            'location' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'rooms' => ['required', 'array', 'min:1'],
            'rooms.*.id' => ['nullable', 'integer'],
            'rooms.*.name' => ['required', 'string', 'max:255'],
            'rooms.*.code' => ['required', 'string', 'max:100', 'distinct'],
            'rooms.*.floor' => ['nullable', 'string', 'max:100'],
            'rooms.*.bed_count' => ['required', 'integer', 'min:1'],
            'rooms.*.is_active' => ['nullable', 'boolean'],
        ];
    }
}
