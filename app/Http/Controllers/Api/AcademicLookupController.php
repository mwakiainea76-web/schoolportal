<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CertificationLevel;
use App\Models\Department;
use App\Models\ExamBody;
use App\Models\Course;
use App\Models\CourseVersion;
use App\Models\CourseVersionMapping;
use App\Models\Staff;
use App\Models\Unit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AcademicLookupController extends Controller
{
    public function departments(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        $departments = Department::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($searchQuery) use ($q) {
                    $searchQuery
                        ->where('name', 'like', "{$q}%")
                        ->orWhere('code', 'like', "{$q}%");
                });
            })
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'code', 'name'])
            ->map(fn (Department $department) => [
                'id' => $department->id,
                'name' => trim($department->code.' - '.$department->name, ' -'),
            ]);

        return response()->json($departments);
    }

    public function courseVersions(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));
        $courseId = $request->integer('course_id') ?: null;
        $examBodyId = $request->integer('exam_body_id') ?: null;

        $courseVersions = CourseVersion::query()
            ->where('is_active', true)
            ->when($courseId, fn ($query) => $query->where('course_id', $courseId))
            ->when($examBodyId, fn ($query) => $query->where('exam_body_id', $examBodyId))
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($searchQuery) use ($q) {
                    $searchQuery
                        ->where('name', 'like', "%{$q}%")
                        ->orWhere('description', 'like', "%{$q}%");
                });
            })
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'course_id', 'exam_body_id', 'name'])
            ->map(fn (CourseVersion $courseVersion) => [
                'id' => $courseVersion->id,
                'name' => $courseVersion->name,
                'course_id' => $courseVersion->course_id,
                'exam_body_id' => $courseVersion->exam_body_id,
            ]);

        return response()->json($courseVersions);
    }

    public function courses(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));
        $courseVersionId = $request->integer('course_version_id') ?: null;

        $courses = Course::query()
            ->with('certificationLevel:id,name')
            ->when($courseVersionId, function ($query) use ($courseVersionId) {
                $query->whereHas('courseVersionMappings', function ($mappingQuery) use ($courseVersionId) {
                    $mappingQuery
                        ->where('course_version_id', $courseVersionId)
                        ->where('is_active', true);
                });
            })
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($searchQuery) use ($q) {
                    $searchQuery
                        ->where('name', 'like', "%{$q}%")
                        ->orWhere('code', 'like', "%{$q}%");
                });
            })
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'name', 'code', 'certification_level_id'])
            ->map(fn (Course $course) => [
                'id' => $course->id,
                'name' => $course->display_name,
                'exam_body_id' => $course->certificationLevel?->exam_body_id,
            ]);

        return response()->json($courses);
    }

    public function courseVersionMappings(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));
        $courseVersionId = $request->integer('course_version_id') ?: null;

        $mappings = CourseVersionMapping::query()
            ->active()
            ->with([
                'course:id,name,code,certification_level_id',
                'courseVersion:id,name',
                'course.certificationLevel:id,name',
            ])
            ->when($courseVersionId, fn ($query) => $query->where('course_version_id', $courseVersionId))
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($searchQuery) use ($q) {
                    $searchQuery
                        ->whereHas('course', function ($courseQuery) use ($q) {
                            $courseQuery
                                ->where('name', 'like', "%{$q}%")
                                ->orWhere('code', 'like', "%{$q}%");
                        })
                        ->orWhereHas('courseVersion', function ($versionQuery) use ($q) {
                            $versionQuery->where('name', 'like', "%{$q}%");
                        });
                });
            })
            ->orderByDesc('id')
            ->limit(10)
            ->get()
            ->map(fn (CourseVersionMapping $mapping) => [
                'id' => $mapping->id,
                'name' => collect([
                    $mapping->courseVersion?->name,
                    $mapping->course?->display_name ?? $mapping->course?->name,
                    $mapping->course?->certificationLevel?->name,
                ])->filter()->implode(' - '),
            ]);

        return response()->json($mappings);
    }

    public function units(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        $units = Unit::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($searchQuery) use ($q) {
                    $searchQuery
                        ->where('name', 'like', "%{$q}%")
                        ->orWhere('code', 'like', "%{$q}%");
                });
            })
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'name', 'code'])
            ->map(fn (Unit $unit) => [
                'id' => $unit->id,
                'name' => trim($unit->code.' - '.$unit->name, ' -'),
            ]);

        return response()->json($units);
    }

    public function examBodies(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        $examBodies = ExamBody::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($searchQuery) use ($q) {
                    $searchQuery
                        ->where('name', 'like', "{$q}%")
                        ->orWhere('code', 'like', "{$q}%");
                });
            })
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'code', 'name'])
            ->map(fn (ExamBody $examBody) => [
                'id' => $examBody->id,
                'name' => trim($examBody->code.' - '.$examBody->name, ' -'),
            ]);

        return response()->json($examBodies);
    }

    public function certificationLevels(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));
        $examBodyId = $request->integer('exam_body_id') ?: null;

        $levels = CertificationLevel::query()
            ->when($examBodyId, fn ($query) => $query->where('exam_body_id', $examBodyId))
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($searchQuery) use ($q) {
                    $searchQuery
                        ->where('name', 'like', "{$q}%")
                        ->orWhere('code', 'like', "{$q}%");
                });
            })
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'name', 'modules', 'duration_in_months'])
            ->map(fn (CertificationLevel $level) => [
                'id' => $level->id,
                'name' => $level->name,
                'modules' => $level->modules,
                'duration_in_months' => $level->duration_in_months,
            ]);

        return response()->json($levels);
    }

    public function staffs(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        $staffs = Staff::query()
            ->with('user:id,first_name,last_name,email')
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($searchQuery) use ($q) {
                    $searchQuery
                        ->where('staff_number', 'like', "{$q}%")
                        ->orWhere('designation', 'like', "{$q}%")
                        ->orWhereHas('user', function ($userQuery) use ($q) {
                            $userQuery
                                ->where('first_name', 'like', "{$q}%")
                                ->orWhere('last_name', 'like', "{$q}%")
                                ->orWhere('email', 'like', "{$q}%");
                        });
                });
            })
            ->orderByDesc('id')
            ->limit(10)
            ->get(['id', 'user_id', 'staff_number', 'designation'])
            ->map(fn (Staff $staff) => [
                'id' => $staff->id,
                'name' => collect([
                    trim(($staff->user?->first_name ?? '').' '.($staff->user?->last_name ?? '')),
                    $staff->staff_number,
                    $staff->designation,
                ])->filter()->implode(' - '),
            ]);

        return response()->json($staffs);
    }
}
