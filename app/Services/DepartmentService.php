<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Department;

class DepartmentService
{
    public function create(array $data): Department
    {
        return Department::create($data);
    }

    public function update(Department $department, array $data): Department
    {
        $department->update([
            'name' => $data['name'],
            'description' => $data['description'],
            'code' => $data['code'],
        ]);

        return $department;
    }

    public function delete(Department $department): array
    {
        $hasCourses = Course::where('department_id', $department->id)->exists();

        if ($hasCourses) {
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
