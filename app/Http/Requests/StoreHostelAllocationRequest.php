<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHostelAllocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'academic_session_enrollment_id' => ['required', 'integer', 'exists:academic_session_enrollments,id'],
            'hostel_id' => ['required', 'integer', 'exists:hostels,id'],
            'hostel_room_id' => ['required', 'integer', 'exists:hostel_rooms,id'],
            'hostel_bed_id' => ['required', 'integer', 'exists:hostel_beds,id'],
            'allocated_on' => ['required', 'date'],
            'status' => ['nullable', Rule::in(['active', 'vacated'])],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
