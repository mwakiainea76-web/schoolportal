<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseVersion;
use App\Models\CourseVersionMapping;
use App\Support\ApiResponse;

class PublicCourseController extends Controller
{
    public function index()
    {
        $activeCourseVersion = CourseVersion::query()
            ->active()
            ->first(['id', 'name', 'start_date', 'end_date']);

        $courses = CourseVersionMapping::query()
            ->active()
            ->whereHas('courseVersion', fn ($query) => $query->active())
            ->with([
                'course:id,code,name,certification_level_id',
                'course.certificationLevel:id,name,duration_in_months',
                'courseVersion:id,name',
            ])
            ->orderBy('course_id')
            ->get()
            ->map(function (CourseVersionMapping $mapping) {
                $course = $mapping->course;
                $certificationLevel = $course?->certificationLevel?->name;

                return [

                    'code' => $course?->code,
                    'course_name' => $course?->name,
                    'certification_level' => $certificationLevel,
                    'course_version_name' => $mapping->courseVersion?->name,
                    'duration_in_months' => $course?->certificationLevel?->duration_in_months,
                ];
            })
            ->values();

        return ApiResponse::success(
            data: ['courses' => $courses]);
    }
}
