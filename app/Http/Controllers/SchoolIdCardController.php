<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SchoolIdCardController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type') === 'student' ? 'student' : 'staff';
        $identifier = trim((string) $request->query('identifier', ''));
        $selectedIds = $this->selectedStudentIds($request);
        $cards = [];
        $selectedOptions = [];
        $selectedStudents = [];

        if ($type === 'student') {
            if ($selectedIds !== []) {
                $students = Student::query()
                    ->with(['courseEnrollment.course:id,name'])
                    ->whereIn('id', $selectedIds)
                    ->get()
                    ->sortBy(fn (Student $student) => array_search((int) $student->id, $selectedIds, true))
                    ->values();

                $cards = $request->boolean('generate')
                    ? $students->map(fn (Student $student) => $this->studentCard($student))->values()->all()
                    : [];
                $selectedStudents = $students->map(fn (Student $student) => $this->selectedStudent($student))->values()->all();
                $selectedOptions = $students->map(fn (Student $student) => $this->studentOption($student))->values()->all();
            } elseif ($identifier !== '') {
                $student = Student::query()
                    ->with(['courseEnrollment.course:id,name'])
                    ->find($identifier);

                if ($student) {
                    $cards = [$this->studentCard($student)];
                    $selectedOptions = [$this->studentOption($student)];
                }
            }
        } elseif ($identifier !== '') {
            $staff = Staff::query()
                ->with('department:id,name')
                ->where('staff_number', $identifier)
                ->first();

            if ($staff) {
                $cards = [$this->staffCard($staff)];
                $selectedOptions = [$this->staffOption($staff)];
            }
        }

        return inertia('HR/IdCards/Index', [
            'filters' => [
                'type' => $type,
                'identifier' => $identifier,
                'selected_ids' => $selectedIds,
            ],
            'selectedOptions' => $selectedOptions,
            'selectedStudents' => $selectedStudents,
            'cards' => $cards,
            'schoolName' => config('app.name', 'School Portal'),
        ]);
    }

    private function staffCard(Staff $staff): array
    {
        return [
            'type' => 'Staff ID',
            'name' => $staff->full_name,
            'number' => $staff->staff_number,
            'role' => $staff->designation,
            'unit' => $staff->department?->name,
            'email' => $staff->email,
            'phone' => $staff->phone_number,
            'photo_url' => $this->photoUrl($staff->profile_photo),
            'status' => $staff->staff_status,
            'issued_at' => now()->format('M Y'),
        ];
    }

    private function studentCard(Student $student): array
    {
        return [
            'type' => 'Student ID',
            'name' => $student->full_name,
            'number' => $student->admission_number,
            'role' => $student->courseEnrollment?->course?->name,
            'unit' => $student->enrollment_status,
            'email' => $student->email,
            'phone' => $student->phone_number,
            'photo_url' => $this->photoUrl($student->profile_photo),
            'status' => $student->enrollment_status,
            'module' => $student->current_module,
            'issued_at' => now()->format('M Y'),
        ];
    }

    private function photoUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return Storage::url($path);
    }

    private function selectedStudentIds(Request $request): array
    {
        return collect(explode(',', (string) $request->query('selected_ids', '')))
            ->map(fn ($id) => (int) trim($id))
            ->filter(fn ($id) => $id > 0)
            ->unique()
            ->values()
            ->all();
    }

    private function staffOption(Staff $staff): array
    {
        return [
            'id' => $staff->staff_number,
            'name' => collect([
                $staff->full_name,
                $staff->staff_number,
                $staff->designation,
            ])->filter()->implode(' - '),
        ];
    }

    private function studentOption(Student $student): array
    {
        return [
            'id' => $student->id,
            'name' => trim($student->full_name).' ('.($student->admission_number ?? 'N/A').')',
        ];
    }

    private function selectedStudent(Student $student): array
    {
        return [
            'id' => $student->id,
            'name' => $student->full_name,
            'admission_number' => $student->admission_number,
            'course' => $student->courseEnrollment?->course?->name,
            'status' => $student->enrollment_status,
        ];
    }
}
