<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Department;
use App\Models\Staff;

class DepartmentService
{
    public function create(array $data): Department
    {
        return Department::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'code' => $data['code'],
            'hod_staff_id' => $this->resolveHodStaffId($data['hod_staff_number'] ?? null),
        ]);
    }

    public function update(Department $department, array $data): Department
    {
        $department->update([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'code' => $data['code'],
            'hod_staff_id' => $this->resolveHodStaffId($data['hod_staff_number'] ?? null),
        ]);

        return $department;
    }

    protected function resolveHodStaffId(?string $staffNumber): ?int
    {
        if (! $staffNumber) {
            return null;
        }

        return Staff::query()
            ->where('staff_number', $staffNumber)
            ->value('id');
    }

    public function delete(Department $department): array
    {
        $hascourses = Course::where('department_id', $department->id)->exists();

        if ($hascourses) {
            return [
                'status' => false,
                'message' => 'To continue delete all courses linked to this department first',
            ];
        }

        $department->delete();

        return [
            'status' => true,
            'message' => 'Department deleted successfully',
        ];
    }

    public function search(?string $q)
    {
        return Department::query()
            ->when($q, function ($query) use ($q) {
                $query->where('name', 'like', "{$q}%")
                    ->orWhere('code', 'like', "{$q}%");
            })
            ->orderBy('name', 'asc')
            ->limit(10)
            ->get()
            ->map(fn ($dept) => [
                'id' => $dept->id,
                'name' => $dept->code.' - '.$dept->name,
            ]);
    }
}
