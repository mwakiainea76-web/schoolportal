<?php

namespace App\Console\Commands;

use App\Models\CourseEnrollment;
use App\Models\CourseVersion;
use App\Models\CourseVersionMapping;
use App\Models\CourseVersionUnit;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class BackfillCurriculumSchemaCommand extends Command
{
    protected $signature = 'academics:backfill-curriculum-schema {--dry-run : Report changes without writing them}';

    protected $description = 'Backfill course_versions, course_version_units, and course_enrollments for the existing curriculum schema.';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        $this->info('Backfilling existing curriculum schema tables...');

        $courseVersionsUpdated = $this->backfillCourseVersions($dryRun);
        $courseVersionUnitsUpdated = $this->backfillCourseVersionUnits($dryRun);
        $courseEnrollmentsUpdated = $this->backfillCourseEnrollments($dryRun);
        $duplicates = $this->duplicateCourseVersionUnits();

        $this->line("course_versions updated: {$courseVersionsUpdated}");
        $this->line("course_version_units updated: {$courseVersionUnitsUpdated}");
        $this->line("course_enrollments updated: {$courseEnrollmentsUpdated}");

        if ($duplicates->isNotEmpty()) {
            $this->warn('Duplicate course_version_units found for (course_version_id, unit_id). These must be reviewed before enforcing uniqueness:');
            $this->table(
                ['course_version_id', 'unit_id', 'duplicate_count'],
                $duplicates->map(fn ($row) => [
                    $row->course_version_id,
                    $row->unit_id,
                    $row->duplicate_count,
                ])->all()
            );
        }

        $this->info($dryRun ? 'Dry run complete.' : 'Backfill complete.');

        return self::SUCCESS;
    }

    private function backfillCourseVersions(bool $dryRun): int
    {
        $updated = 0;

        CourseVersion::query()
            ->where(function ($query) {
                $query->whereNull('program_id')
                    ->orWhereNull('exam_body_id');
            })
            ->orderBy('id')
            ->chunkById(100, function ($courseVersions) use ($dryRun, &$updated) {
                foreach ($courseVersions as $courseVersion) {
                    $mapping = CourseVersionMapping::query()
                        ->with('course.certificationLevel:id,exam_body_id')
                        ->where('course_version_id', $courseVersion->id)
                        ->where('is_active', true)
                        ->latest('id')
                        ->first()
                        ?? CourseVersionMapping::query()
                            ->with('course.certificationLevel:id,exam_body_id')
                            ->where('course_version_id', $courseVersion->id)
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
                        $courseVersion->forceFill($payload)->save();
                    }

                    $updated++;
                }
            });

        return $updated;
    }

    private function backfillCourseVersionUnits(bool $dryRun): int
    {
        $updated = 0;

        CourseVersionUnit::query()
            ->where(function ($query) {
                $query->whereNull('course_version_id')
                    ->orWhereNull('module');
            })
            ->with('courseVersionMapping:id,course_version_id')
            ->orderBy('id')
            ->chunkById(100, function ($courseVersionUnits) use ($dryRun, &$updated) {
                foreach ($courseVersionUnits as $courseVersionUnit) {
                    $courseVersionId = $courseVersionUnit->course_version_id
                        ?? $courseVersionUnit->courseVersionMapping?->course_version_id;

                    if (! $courseVersionId) {
                        continue;
                    }

                    $payload = [
                        'course_version_id' => $courseVersionId,
                        'module' => $courseVersionUnit->module ?? $courseVersionUnit->module_taught,
                    ];

                    if (! $dryRun) {
                        $courseVersionUnit->forceFill($payload)->save();
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
                    ->orWhereNull('course_version_id')
                    ->orWhereNull('exam_body_id')
                    ->orWhereNull('enrollment_date');
            })
            ->with('courseVersionMapping.course.certificationLevel:id,exam_body_id')
            ->orderBy('id')
            ->chunkById(100, function ($courseEnrollments) use ($dryRun, &$updated) {
                foreach ($courseEnrollments as $courseEnrollment) {
                    $mapping = $courseEnrollment->courseVersionMapping;
                    $createdAt = $courseEnrollment->created_at
                        ? Carbon::parse($courseEnrollment->created_at)
                        : now();

                    $payload = [
                        'program_id' => $courseEnrollment->program_id ?? $mapping?->program_id,
                        'course_version_id' => $courseEnrollment->course_version_id ?? $mapping?->course_version_id,
                        'exam_body_id' => $courseEnrollment->exam_body_id ?? $mapping?->program?->certificationLevel?->exam_body_id,
                        'enrollment_date' => $courseEnrollment->enrollment_date ?? $createdAt->toDateString(),
                        'intake_year' => $courseEnrollment->intake_year ?? (int) $createdAt->format('Y'),
                        'study_mode' => $courseEnrollment->study_mode ?? 'full_time',
                    ];

                    if (! $payload['program_id'] || ! $payload['course_version_id'] || ! $payload['exam_body_id']) {
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

    private function duplicateCourseVersionUnits()
    {
        return DB::table('course_version_units')
            ->select('course_version_id', 'unit_id', DB::raw('COUNT(*) as duplicate_count'))
            ->whereNotNull('course_version_id')
            ->groupBy('course_version_id', 'unit_id')
            ->havingRaw('COUNT(*) > 1')
            ->orderBy('course_version_id')
            ->orderBy('unit_id')
            ->get();
    }
}
