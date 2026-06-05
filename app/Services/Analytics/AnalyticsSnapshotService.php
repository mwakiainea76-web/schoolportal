<?php

namespace App\Services\Analytics;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsSnapshotService
{
    public function __construct(
        protected ExecutiveAnalyticsService $executiveAnalyticsService,
        protected AdmissionsAnalyticsService $admissionsAnalyticsService,
        protected FinanceAnalyticsService $financeAnalyticsService,
        protected AcademicAnalyticsService $academicAnalyticsService,
        protected HostelAnalyticsService $hostelAnalyticsService,
        protected DataQualityAnalyticsService $dataQualityAnalyticsService,
    ) {
    }

    public function refresh(?string $date = null): array
    {
        $metricDate = $date
            ? Carbon::parse($date)->toDateString()
            : Carbon::today()->toDateString();
        $generatedAt = now();

        $activeSession = DB::table('academic_sessions')
            ->select('id', 'academic_year_id')
            ->whereNull('deleted_at')
            ->where('is_active', true)
            ->orderByDesc('start_date')
            ->orderByDesc('id')
            ->first();

        $dimensionContext = [
            'metric_date' => $metricDate,
            'academic_year_id' => $activeSession?->academic_year_id,
            'academic_session_id' => $activeSession?->id,
            'department_id' => null,
            'course_id' => null,
            'curriculum_id' => null,
            'snapshot_generated_at' => $generatedAt,
            'created_at' => $generatedAt,
            'updated_at' => $generatedAt,
        ];

        $executive = $this->executiveAnalyticsService->summary();
        $admissions = $this->admissionsAnalyticsService->summary();
        $finance = $this->financeAnalyticsService->summary();
        $academic = $this->academicAnalyticsService->summary();
        $hostel = $this->hostelAnalyticsService->summary();
        $dataQuality = $this->dataQualityAnalyticsService->summary();

        $this->storeMetricSet('daily_student_metrics', $dimensionContext, array_merge(
            $this->numericMetrics($executive['metrics'] ?? []),
            $this->prefixMetrics('admissions_', $this->numericMetrics($admissions['metrics'] ?? []))
        ));

        $this->storeMetricSet('daily_finance_metrics', $dimensionContext, $this->numericMetrics($finance['metrics'] ?? []));
        $this->storeMetricSet('daily_hostel_metrics', $dimensionContext, $this->numericMetrics($hostel['metrics'] ?? []));
        $this->storeMetricSet('daily_academic_metrics', $dimensionContext, $this->numericMetrics($academic['metrics'] ?? []));
        $this->storeMetricSet('data_quality_metrics', $dimensionContext, $this->numericMetrics($dataQuality['metrics'] ?? []));

        $sessionMetrics = $this->onlyMetrics(
            $this->numericMetrics($academic['metrics'] ?? []),
            ['session_registration_rate', 'registered_students', 'eligible_students', 'students_not_registered_count']
        );

        $this->storeMetricSet('session_registration_metrics', $dimensionContext, $sessionMetrics);

        return [
            'metric_date' => $metricDate,
            'tables_refreshed' => [
                'daily_student_metrics',
                'daily_finance_metrics',
                'daily_hostel_metrics',
                'daily_academic_metrics',
                'session_registration_metrics',
                'data_quality_metrics',
            ],
            'metrics_written' => [
                'daily_student_metrics' => count($this->numericMetrics($executive['metrics'] ?? [])) + count($this->numericMetrics($admissions['metrics'] ?? [])),
                'daily_finance_metrics' => count($this->numericMetrics($finance['metrics'] ?? [])),
                'daily_hostel_metrics' => count($this->numericMetrics($hostel['metrics'] ?? [])),
                'daily_academic_metrics' => count($this->numericMetrics($academic['metrics'] ?? [])),
                'session_registration_metrics' => count($sessionMetrics),
                'data_quality_metrics' => count($this->numericMetrics($dataQuality['metrics'] ?? [])),
            ],
        ];
    }

    protected function storeMetricSet(string $table, array $context, array $metrics): void
    {
        if ($metrics === []) {
            return;
        }

        $rows = collect($metrics)
            ->map(fn ($value, $key) => array_merge($context, [
                'metric_key' => $key,
                'metric_value' => round((float) $value, 4),
            ]))
            ->values()
            ->all();

        DB::table($table)->upsert(
            $rows,
            [
                'metric_date',
                'academic_year_id',
                'academic_session_id',
                'department_id',
                'course_id',
                'curriculum_id',
                'metric_key',
            ],
            ['metric_value', 'snapshot_generated_at', 'updated_at']
        );
    }

    protected function numericMetrics(array $metrics): array
    {
        return collect($metrics)
            ->filter(fn ($value) => is_int($value) || is_float($value))
            ->map(fn ($value) => (float) $value)
            ->all();
    }

    protected function prefixMetrics(string $prefix, array $metrics): array
    {
        return collect($metrics)
            ->mapWithKeys(fn ($value, $key) => [$prefix.$key => $value])
            ->all();
    }

    protected function onlyMetrics(array $metrics, array $keys): array
    {
        return collect($metrics)
            ->only($keys)
            ->all();
    }
}
