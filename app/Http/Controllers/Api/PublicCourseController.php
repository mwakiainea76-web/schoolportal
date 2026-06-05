<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Curriculum;
use App\Models\CurriculumMapping;
use App\Support\ApiResponse;

class PublicCourseController extends Controller
{
    public function index()
    {
        $activeCurriculum = Curriculum::query()
            ->active()
            ->first(['id', 'name', 'start_date', 'end_date']);

        $courses = CurriculumMapping::query()
            ->active()
            ->whereHas('curriculum', fn ($query) => $query->active())
            ->with([
                'course:id,code,name,certification_level_id',
                'course.certificationLevel:id,name,duration_in_months',
                'curriculum:id,name',
            ])
            ->orderBy('course_id')
            ->get()
            ->map(function (CurriculumMapping $mapping) {
                $course = $mapping->course;
                $certificationLevel = $course?->certificationLevel?->name;

                return [

                    'code' => $course?->code,
                    'course_name' => $course?->name,
                    'certification_level' => $certificationLevel,
                    'curriculum_name' => $mapping->curriculum?->name,
                    'duration_in_months' => $course?->certificationLevel?->duration_in_months,
                ];
            })
            ->values();

        return ApiResponse::success(
            data: ['courses' => $courses]);
    }
}
