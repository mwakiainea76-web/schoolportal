<?php

namespace App\Services;

use App\Models\CourseVersion;
use Illuminate\Support\Facades\DB;

class CourseVersionService
{
    public function store(array $data): array
    {
        $exists = CourseVersion::where('name', $data['name'])->exists();

        if ($exists) {
            return [
                'status' => false,
                'message' => 'CourseVersion already exists.',
            ];
        }

        DB::transaction(function () use ($data) {
            $isActive = (bool) ($data['is_active'] ?? false);

            CourseVersion::create([
                'course_id' => $data['course_id'],
                'exam_body_id' => $data['exam_body_id'],
                'name' => $data['name'],
                'is_active' => $isActive,
                'description' => $data['description'] ?? null,
                'start_date' => $data['start_date'] ?? null,
                'end_date' => $data['end_date'] ?? null,
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);
        });

        return [
            'status' => true,
            'message' => 'CourseVersion created successfully.',
        ];
    }

    public function update(CourseVersion $curriculum, array $data): array
    {
        $exists = CourseVersion::where('name', $data['name'])
            ->whereKeyNot($curriculum->getKey())
            ->exists();

        if ($exists) {
            return [
                'status' => false,
                'message' => 'CourseVersion already exists.',
            ];
        }

        if ($curriculum->end_date && ($data['version_state'] ?? null) === 'start') {
            return [
                'status' => false,
                'message' => 'This course version is closed and cannot be reactivated.',
            ];
        }

        DB::transaction(function () use ($curriculum, $data) {
            $versionState = $data['version_state'] ?? ($curriculum->is_active ? 'start' : 'end');
            $isActive = $versionState === 'start';
            $startDate = $curriculum->start_date;
            $endDate = $curriculum->end_date;

            if ($isActive) {
                $startDate = $startDate ?: now()->toDateString();
                $endDate = null;
            } else {
                $endDate = now()->toDateString();
            }

            $curriculum->update([
                'course_id' => $data['course_id'],
                'exam_body_id' => $data['exam_body_id'],
                'name' => $data['name'],
                'is_active' => $isActive,
                'description' => $data['description'] ?? null,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'updated_by' => auth()->id(),
            ]);
        });

        return [
            'status' => true,
            'message' => 'CourseVersion updated successfully.',
        ];
    }

    public function delete(CourseVersion $curriculum): void
    {
        $curriculum->delete();
    }
}
