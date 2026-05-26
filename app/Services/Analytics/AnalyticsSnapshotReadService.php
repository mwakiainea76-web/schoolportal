<?php

namespace App\Services\Analytics;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsSnapshotReadService
{
    public function trendSummary(int $days = 30): array
    {
        $startDate = Carbon::today()->subDays(max($days - 1, 0))->toDateString();

        return [
            'range' => [
                'days' => $days,
                'date_from' => $startDate,
                'date_to' => Carbon::today()->toDateString(),
            ],
            'executive' => [
                'student_growth' => $this->loadMetricTrend('daily_student_metrics', 'total_students', $startDate),
                'active_students' => $this->loadMetricTrend('daily_student_metrics', 'active_students', $startDate),
                'new_admissions' => $this->loadMetricTrend('daily_student_metrics', 'new_admissions_this_month', $startDate),
            ],
            'finance' => [
                'total_invoiced' => $this->loadMetricTrend('daily_finance_metrics', 'total_invoiced', $startDate),
                'total_collected' => $this->loadMetricTrend('daily_finance_metrics', 'total_collected', $startDate),
                'outstanding_balance' => $this->loadMetricTrend('daily_finance_metrics', 'outstanding_balance', $startDate),
            ],
            'academic' => [
                'session_registration_rate' => $this->loadMetricTrend('session_registration_metrics', 'session_registration_rate', $startDate),
                'registered_students' => $this->loadMetricTrend('session_registration_metrics', 'registered_students', $startDate),
            ],
            'hostel' => [
                'occupancy_rate' => $this->loadMetricTrend('daily_hostel_metrics', 'occupancy_rate', $startDate),
                'hostel_revenue_collected' => $this->loadMetricTrend('daily_hostel_metrics', 'hostel_revenue_collected', $startDate),
            ],
            'quality' => [
                'slow_query_count' => $this->loadMetricTrend('data_quality_metrics', 'slow_query_count', $startDate),
                'failed_job_count' => $this->loadMetricTrend('data_quality_metrics', 'failed_job_count', $startDate),
            ],
        ];
    }

    protected function loadMetricTrend(string $table, string $metricKey, string $startDate): array
    {
        return DB::table($table)
            ->where('metric_key', $metricKey)
            ->whereDate('metric_date', '>=', $startDate)
            ->orderBy('metric_date')
            ->get(['metric_date', 'metric_value'])
            ->map(fn ($row) => [
                'date' => $row->metric_date,
                'value' => round((float) $row->metric_value, 2),
            ])
            ->all();
    }
}
