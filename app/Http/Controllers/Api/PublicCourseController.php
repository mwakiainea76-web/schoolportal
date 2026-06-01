<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProgramVersion;
use App\Models\ProgramVersionMapping;
use App\Support\ApiResponse;

class PublicCourseController extends Controller
{
    public function index()
    {
        $activeProgramVersion = ProgramVersion::query()
            ->active()
            ->first(['id', 'name', 'start_date', 'end_date']);

        $courses = ProgramVersionMapping::query()
            ->active()
            ->whereHas('programVersion', fn ($query) => $query->active())
            ->with([
                'program:id,code,name,duration_in_months,certification_level_id',
                'program.certificationLevel:id,name',
                'programVersion:id,name',
            ])
            ->orderBy('program_id')
            ->get()
            ->map(function (ProgramVersionMapping $mapping) {
                $program = $mapping->program;
                $certificationLevel = $program?->certificationLevel?->name;

                return [
                    'id' => $mapping->programVersion?->id,
                    'code' => $program?->code,
                    'course_name' => $program?->name,
                    'certification_level' => $certificationLevel,
                    'program_version_name' => $mapping->programVersion?->name,
                    'duration_in_months' => $program?->duration_in_months,
                ];
            })
            ->values();

        return ApiResponse::success([
            'data' => [
                'active_program_version' => $activeProgramVersion ? [
                    'id' => $activeProgramVersion->id,
                    'name' => $activeProgramVersion->name,
                    'start_date' => optional($activeProgramVersion->start_date)->toDateString(),
                    'end_date' => optional($activeProgramVersion->end_date)->toDateString(),
                ] : null,
                'courses' => $courses,
            ],
        ]);
    }
}
