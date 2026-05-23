<?php

namespace App\Services;

use App\Models\Program;
use App\Models\Unit;

class ProgramService
{
    public function create(array $data): Program
    {
        return Program::create([
            'code' => $data['code'],
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'initials' => $data['initials'],
            'duration_in_months' => $data['duration_in_months'],
            'certification_level_id' => $data['certification_level_id'],
            'department_id' => $data['department_id'],
        ]);
    }

    public function update(Program $course, array $data): Program
    {
        $course->update([
            'code' => $data['code'],
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'initials' => $data['initials'],
            'duration_in_months' => $data['duration_in_months'],
            'certification_level_id' => $data['certification_level_id'],
            'department_id' => $data['department_id'],
        ]);

        return $course;
    }

    public function delete(Program $course): array
    {
        $hasUnits = Unit::where('course_id', $course->id)->exists();

        if ($hasUnits) {
            return [
                'status' => false,
                'message' => 'To continue delete all units linked to this course first',
            ];
        }

        $course->delete();

        return [
            'status' => true,
            'message' => 'Program deleted successfully.',
        ];
    }

    public function search(?string $q)
    {
        return Program::query()
            ->with('certificationLevel:id,name')
            ->when($q, function ($query) use ($q) {
                $query->where(function ($sub) use ($q) {
                    $sub->where('name', 'like', "{$q}%")
                        ->orWhere('code', 'like', "{$q}%");
                });
            })
            ->orderBy('name', 'asc')
            ->limit(10)
            ->get(['id', 'name', 'code', 'certification_level_id'])
            ->map(fn ($course) => [
                'id' => $course->id,
                'name' => $course->display_name, // ✅ single source of truth
            ]);
    }
}

