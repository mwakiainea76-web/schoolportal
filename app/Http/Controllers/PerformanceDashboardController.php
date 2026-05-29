<?php

namespace App\Http\Controllers;

use App\Models\AppRequestMetric;
use App\Models\CorsAllowedOrigin;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class PerformanceDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $range = in_array($request->query('range'), ['1h', '24h', '7d'], true)
            ? $request->query('range')
            : '24h';

        $start = match ($range) {
            '1h' => now()->subHour(),
            '7d' => now()->subDays(7),
            default => now()->subDay(),
        };

        $metrics = AppRequestMetric::query()
            ->where('occurred_at', '>=', $start)
            ->orderBy('occurred_at')
            ->get();

        return Inertia::render('Settings/PerformanceDashboard', [
            'range' => $range,
            'summary' => $this->summary($metrics),
            'status_breakdown' => $this->statusBreakdown($metrics),
            'method_breakdown' => $this->methodBreakdown($metrics),
            'traffic_trend' => $this->trafficTrend($metrics, $range),
            'slow_endpoints' => $this->slowEndpoints($metrics),
            'recent_errors' => $this->recentErrors($start),
            'cors' => [
                'active_origins' => CorsAllowedOrigin::query()->where('is_active', true)->count(),
                'inactive_origins' => CorsAllowedOrigin::query()->where('is_active', false)->count(),
            ],
        ]);
    }

    private function summary(Collection $metrics): array
    {
        $total = $metrics->count();
        $api = $metrics->where('is_api', true);
        $errors = $metrics->filter(fn (AppRequestMetric $metric) => $metric->status_code >= 500);
        $clientErrors = $metrics->filter(fn (AppRequestMetric $metric) =>
            $metric->status_code >= 400 && $metric->status_code < 500
        );
        $slow = $metrics->filter(fn (AppRequestMetric $metric) => $metric->duration_ms >= 1000);

        return [
            'total_requests' => $total,
            'api_requests' => $api->count(),
            'web_requests' => $total - $api->count(),
            'average_ms' => $total ? round($metrics->avg('duration_ms'), 1) : 0,
            'p95_ms' => $this->percentile($metrics->pluck('duration_ms')->all(), 95),
            'max_ms' => $total ? (int) $metrics->max('duration_ms') : 0,
            'error_rate' => $total ? round(($errors->count() / $total) * 100, 2) : 0,
            'server_errors' => $errors->count(),
            'client_errors' => $clientErrors->count(),
            'slow_requests' => $slow->count(),
            'memory_peak_mb' => $total ? round(((int) $metrics->max('memory_peak_kb')) / 1024, 2) : 0,
        ];
    }

    private function statusBreakdown(Collection $metrics): array
    {
        return $metrics
            ->groupBy(fn (AppRequestMetric $metric) => (string) $metric->status_code)
            ->map(fn (Collection $group, string $status) => [
                'status' => $status,
                'count' => $group->count(),
            ])
            ->sortKeys()
            ->values()
            ->all();
    }

    private function methodBreakdown(Collection $metrics): array
    {
        return $metrics
            ->groupBy('method')
            ->map(fn (Collection $group, string $method) => [
                'method' => $method,
                'count' => $group->count(),
            ])
            ->sortByDesc('count')
            ->values()
            ->all();
    }

    private function trafficTrend(Collection $metrics, string $range): array
    {
        $format = $range === '7d' ? 'M j' : 'H:00';

        return $metrics
            ->groupBy(fn (AppRequestMetric $metric) => $metric->occurred_at->format($format))
            ->map(fn (Collection $group, string $label) => [
                'label' => $label,
                'requests' => $group->count(),
                'average_ms' => round($group->avg('duration_ms'), 1),
                'errors' => $group->filter(fn (AppRequestMetric $metric) => $metric->status_code >= 500)->count(),
            ])
            ->values()
            ->all();
    }

    private function slowEndpoints(Collection $metrics): array
    {
        return $metrics
            ->groupBy(fn (AppRequestMetric $metric) =>
                $metric->method . ' ' . ($metric->route_name ?: $metric->path)
            )
            ->map(fn (Collection $group, string $endpoint) => [
                'endpoint' => $endpoint,
                'requests' => $group->count(),
                'average_ms' => round($group->avg('duration_ms'), 1),
                'p95_ms' => $this->percentile($group->pluck('duration_ms')->all(), 95),
                'max_ms' => (int) $group->max('duration_ms'),
                'errors' => $group->filter(fn (AppRequestMetric $metric) => $metric->status_code >= 500)->count(),
                'last_seen' => optional($group->max('occurred_at'))->toDateTimeString(),
            ])
            ->sortByDesc('p95_ms')
            ->take(10)
            ->values()
            ->all();
    }

    private function recentErrors($start): array
    {
        return AppRequestMetric::query()
            ->where('occurred_at', '>=', $start)
            ->where('status_code', '>=', 500)
            ->latest('occurred_at')
            ->limit(10)
            ->get()
            ->map(fn (AppRequestMetric $metric) => [
                'id' => $metric->id,
                'method' => $metric->method,
                'path' => $metric->path,
                'route_name' => $metric->route_name,
                'status_code' => $metric->status_code,
                'duration_ms' => $metric->duration_ms,
                'occurred_at' => $metric->occurred_at?->toDateTimeString(),
            ])
            ->all();
    }

    private function percentile(array $values, int $percentile): int
    {
        $values = array_values(array_filter($values, fn ($value) => is_numeric($value)));

        if ($values === []) {
            return 0;
        }

        sort($values);
        $index = (int) ceil(($percentile / 100) * count($values)) - 1;

        return (int) $values[max(0, min($index, count($values) - 1))];
    }
}
