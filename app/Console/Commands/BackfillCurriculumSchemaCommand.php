<?php

namespace App\Console\Commands;

use App\Models\CourseEnrollment;
use App\Models\Curriculum;
use App\Models\CurriculumMapping;
use App\Models\CurriculumUnit;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class BackfillCurriculumSchemaCommand extends Command
{
    protected $signature = 'academics:backfill-curriculum-schema {--dry-run : Report changes without writing them}';

    protected $description = 'Backfill curricula, curriculum_units, and course_enrollments for the existing curriculum schema.';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        $this->info('Backfilling existing curriculum schema tables...');

        $curriculumsUpdated = $this->backfillCurriculums($dryRun);
        $curriculumUnitsUpdated = $this->backfillCurriculumUnits($dryRun);
        $courseEnrollmentsUpdated = $this->backfillCourseEnrollments($dryRun);
        $duplicates = $this->duplicateCurriculumUnits();

        $this->line("curricula updated: {$curriculumsUpdated}");
        $this->line("curriculum_units updated: {$curriculumUnitsUpdated}");
        $this->line("course_enrollments updated: {$courseEnrollmentsUpdated}");

        if ($duplicates->isNotEmpty()) {
            $this->warn('Duplicate curriculum_units found for (curriculum_id, unit_id). These must be reviewed before enforcing uniqueness:');
            $this->table(
                ['curriculum_id', 'unit_id', 'duplicate_count'],
                $duplicates->map(fn ($row) => [
                    $row->curriculum_id,
                    $row->unit_id,
                    $row->duplicate_count,
                ])->all()
            );
        }

        $this->info($dryRun ? 'Dry run complete.' : 'Backfill complete.');

        return self::SUCCESS;
    }

    private function backfillCurriculums(bool $dryRun): int
    {
        $updated = 0;

        Curriculum::query()
            ->where(function ($query) {
                $query->whereNull('program_id')
                    ->orWhereNull('exam_body_id');
            })
            ->orderBy('id')
            ->chunkById(100, function ($curriculums) use ($dryRun, &$updated) {
                foreach ($curriculums as $curriculum) {
                    $mapping = CurriculumMapping::query()
                        ->with('course.certificationLevel:id,exam_body_id')
                        ->where('curriculum_id', $curriculum->id)
                        ->where('is_active', true)
                        ->latest('id')
                        ->first()
                        ?? CurriculumMapping::query()
                            ->with('course.certificationLevel:id,exam_body_id')
                            ->where('curriculum_id', $curriculum->id)
                            ->latest('id')
                            ->first();

                    if (! $mapping?->program) {
                        continue;
                    }

                    $payload = [
                        'program_id' => $mapping->program_id,
                        'exam_body_id' => $mapping->program?->certificationLevel?->exam_body_id,
                    ];

                    if (! $dryRun) {
                        $curriculum->forceFill($payload)->save();
                    }

                    $updated++;
                }
            });

        return $updated;
    }

    private function backfillCurriculumUnits(bool $dryRun): int
    {
        $updated = 0;

        CurriculumUnit::query()
            ->where(function ($query) {
                $query->whereNull('curriculum_id')
                    ->orWhereNull('module');
            })
            ->with('curriculumMapping:id,curriculum_id')
            ->orderBy('id')
            ->chunkById(100, function ($curriculumUnits) use ($dryRun, &$updated) {
                foreach ($curriculumUnits as $curriculumUnit) {
                    $curriculumId = $curriculumUnit->curriculum_id
                        ?? $curriculumUnit->curriculumMapping?->curriculum_id;

                    if (! $curriculumId) {
                        continue;
                    }

                    $payload = [
                        'curriculum_id' => $curriculumId,
                        'module' => $curriculumUnit->module ?? $curriculumUnit->module_taught,
                    ];

                    if (! $dryRun) {
                        $curriculumUnit->forceFill($payload)->save();
                    }

                    $updated++;
                }
            });

        return $updated;
    }

    private function backfillCourseEnrollments(bool $dryRun): int
    {
        $updated = 0;

        CourseEnrollment::query()
            ->where(function ($query) {
                $query->whereNull('program_id')
                    ->orWhereNull('curriculum_id')
                    ->orWhereNull('exam_body_id')
                    ->orWhereNull('enrollment_date');
            })
            ->with('curriculumMapping.course.certificationLevel:id,exam_body_id')
            ->orderBy('id')
            ->chunkById(100, function ($courseEnrollments) use ($dryRun, &$updated) {
                foreach ($courseEnrollments as $courseEnrollment) {
                    $mapping = $courseEnrollment->curriculumMapping;
                    $createdAt = $courseEnrollment->created_at
                        ? Carbon::parse($courseEnrollment->created_at)
                        : now();

                    $payload = [
                        'program_id' => $courseEnrollment->program_id ?? $mapping?->program_id,
                        'curriculum_id' => $courseEnrollment->curriculum_id ?? $mapping?->curriculum_id,
                        'exam_body_id' => $courseEnrollment->exam_body_id ?? $mapping?->program?->certificationLevel?->exam_body_id,
                        'enrollment_date' => $courseEnrollment->enrollment_date ?? $createdAt->toDateString(),
                        'intake_year' => $courseEnrollment->intake_year ?? (int) $createdAt->format('Y'),
                        'study_mode' => $courseEnrollment->study_mode ?? 'full_time',
                    ];

                    if (! $payload['program_id'] || ! $payload['curriculum_id'] || ! $payload['exam_body_id']) {
                        continue;
                    }

                    if (! $dryRun) {
                        $courseEnrollment->forceFill($payload)->save();
                    }

                    $updated++;
                }
            });

        return $updated;
    }

    private function duplicateCurriculumUnits()
    {
        return DB::table('curriculum_units')
            ->select('curriculum_id', 'unit_id', DB::raw('COUNT(*) as duplicate_count'))
            ->whereNotNull('curriculum_id')
            ->groupBy('curriculum_id', 'unit_id')
            ->havingRaw('COUNT(*) > 1')
            ->orderBy('curriculum_id')
            ->orderBy('unit_id')
            ->get();
    }
}
