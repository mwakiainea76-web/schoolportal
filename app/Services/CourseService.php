<?php

namespace App\Services;

use App\Models\CertificationLevel;
use App\Models\Course;
use App\Models\CurriculumMapping;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class CourseService
{
    public function create(array $data): Course
    {
        $certificationLevel = CertificationLevel::findOrFail($data['certification_level_id']);

        return DB::transaction(function () use ($data, $certificationLevel) {
            $course = Course::create([
                'code' => $data['code'],
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'initials' => $data['initials'],
                'duration_in_months' => $certificationLevel->duration_in_months,
                'certification_level_id' => $data['certification_level_id'],
                'department_id' => $data['department_id'],
            ]);

            $this->ensureCurriculumMapping($course, (int) $data['curriculum_id']);

            return $course;
        });
    }

    public function update(Course $course, array $data): Course
    {
        $certificationLevel = CertificationLevel::findOrFail($data['certification_level_id']);

        DB::transaction(function () use ($course, $data, $certificationLevel) {
            $course->update([
                'code' => $data['code'],
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'initials' => $data['initials'],
                'duration_in_months' => $certificationLevel->duration_in_months,
                'certification_level_id' => $data['certification_level_id'],
                'department_id' => $data['department_id'],
            ]);

            $this->ensureCurriculumMapping($course, (int) $data['curriculum_id']);
        });

        return $course;
    }

    public function delete(Course $course): array
    {
        if (Unit::where('course_id', $course->id)->exists()) {
            return [
                'status' => false,
                'message' => 'Delete all units linked to this course first.',
            ];
        }

        $course->delete();

        return [
            'status' => true,
            'message' => 'Course deleted successfully.',
        ];
    }

    /**
     * Paginated course listing.
     *
     * @param  int|null  $departmentId  When set, restricts to that department
     *                                  and requires an active curriculum mapping.
     *                                  Pass null for an unrestricted admin listing.
     */
    public function index(array $filters, $filter, ?int $departmentId = null)
    {
        return Course::query()
            ->with([
                'certificationLevel:id,name',
                'department:id,name',
                'curriculum',
            ])
            ->when($departmentId, function (Builder $q, int $id) {
                $q->where('department_id', $id)
                    ->whereHas('curriculumMappings', fn ($mq) => $this->activeMappingScope($mq));
            })
            ->tap(fn ($q) => $filter->apply($q, $filters))
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Course $course) => $this->indexRow($course));
    }

    /**
     * Course search.
     *
     * @param  int|null  $departmentId  When set, restricts to that department
     *                                  and requires an active curriculum mapping.
     *                                  Pass null for an unrestricted admin search.
     */
    public function search(
        ?string $q,
        ?int $departmentId = null,
        bool $versionedOnly = false,
        int $limit = 10,
        bool $prefixOnly = false,
    ) {
        return Course::query()
            ->when($departmentId, function (Builder $b, int $id) {
                $b->where('department_id', $id)
                    ->whereHas('curriculumMappings', fn ($mq) => $this->activeMappingScope($mq));
            })
            ->when($versionedOnly, fn (Builder $b) => $this->versionedOnlyScope($b))
            ->when($q, fn (Builder $b) => $this->nameOrCodeScope($b, $q, $prefixOnly))
            ->orderBy('name')
            ->limit($limit)
            ->get(['id', 'name', 'code'])
            ->map(fn (Course $course) => [
                'id' => (string) $course->id,
                'name' => $course->display_name,
            ])
            ->values();
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    private function activeMappingScope($query)
    {
        return $query
            ->where('is_active', true)
            ->whereHas('curriculum', fn ($cq) => $cq->where('is_active', true));
    }

    private function versionedOnlyScope(Builder $builder): Builder
    {
        return $builder->whereHas('curriculumMappings', function ($mq) {
            $this->activeMappingScope($mq)->whereHas('units');
        });
    }

    private function nameOrCodeScope(Builder $builder, string $q, bool $prefixOnly = false): Builder
    {
        $pattern = $prefixOnly ? "{$q}%" : "%{$q}%";

        return $builder->where(fn ($sub) => $sub
            ->where('name', 'like', $pattern)
            ->orWhere('code', 'like', $pattern)
        );
    }

    // -------------------------------------------------------------------------
    // Transforms
    // -------------------------------------------------------------------------

    private function indexRow(Course $course): array
    {
        return [
            'id' => $course->id,
            'name' => $course->display_name,
            'code' => $course->code,
            'certification_level' => $course->certificationLevel?->name,
            'department' => $course->department?->name,
            'curriculum' => $course->curriculum?->name,
            'created_at' => $course->created_at,
        ];
    }

    // -------------------------------------------------------------------------
    // Internals
    // -------------------------------------------------------------------------

    private function ensureCurriculumMapping(Course $course, int $curriculumId): CurriculumMapping
    {
        return CurriculumMapping::firstOrCreate(
            [
                'course_id' => $course->id,
                'curriculum_id' => $curriculumId,
            ],
            [
                'is_active' => true,
                'description' => $course->description,
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]
        );
    }
}
