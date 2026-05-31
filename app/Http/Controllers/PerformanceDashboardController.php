<?php

namespace App\Http\Controllers;

use App\Models\AppRequestMetric;
use App\Models\PerformanceEndpointStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class PerformanceDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $range = in_array($request->query('range'), ['1h', '24h', '7d'], true)
            ? $request->query('range')
            : '24h';
        $endpointPerPage = max(5, min((int) $request->query('endpoint_per_page', 10), 50));
        $loadSlowEndpoints = $request->boolean('load_slow_endpoints');

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
            'load_slow_endpoints' => $loadSlowEndpoints,
            'summary' => $this->summary($metrics),
            'status_breakdown' => $this->statusBreakdown($metrics),
            'method_breakdown' => $this->methodBreakdown($metrics),
            'traffic_trend' => $this->trafficTrend($metrics, $range),
            'recent_errors' => $this->recentErrors($start),
            'slow_endpoints_count' => $this->slowEndpointsCount($start),
            'slow_endpoints' => $loadSlowEndpoints
                ? $this->slowEndpoints(
                    $metrics,
                    (int) $request->query('endpoint_page', 1),
                    $endpointPerPage
                )
                : null,
        ]);
    }

    public function updateErrorStatus(Request $request, AppRequestMetric $appRequestMetric)
    {
        $validated = $request->validate([
            'error_status' => ['required', 'in:pending,in_progress,resolved'],
        ]);

        abort_unless($appRequestMetric->status_code >= 500, 404);

        $appRequestMetric->update([
            'error_status' => $validated['error_status'],
            'error_status_updated_at' => now(),
        ]);

        return back()->with('success', 'Error status updated.');
    }

    public function updateEndpointStatus(Request $request)
    {
        abort_unless(Schema::hasTable('performance_endpoint_statuses'), 503, 'Slow endpoint status tracking is not ready yet.');

        $validated = $request->validate([
            'endpoint_key' => ['required', 'string', 'max:255'],
            'method' => ['required', 'string', 'max:10'],
            'path' => ['required', 'string', 'max:500'],
            'route_name' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:pending,in_progress,resolved'],
        ]);

        PerformanceEndpointStatus::query()->updateOrCreate(
            ['endpoint_key' => $validated['endpoint_key']],
            [
                'method' => $validated['method'],
                'route_name' => $validated['route_name'] ?: null,
                'path' => $validated['path'],
                'status' => $validated['status'],
                'status_updated_at' => now(),
            ]
        );

        return back()->with('success', 'Slow endpoint status updated.');
    }

    private function summary(Collection $metrics): array
    {
        $total = $metrics->count();
        $api = $metrics->where('is_api', true);
        $errors = $metrics->filter(fn (AppRequestMetric $metric) =>
            $metric->status_code >= 500
            && (($metric->error_status ?? 'pending') !== 'resolved')
        );
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

    private function slowEndpoints(Collection $metrics, int $page = 1, int $perPage = 10): array
    {
        $statusMap = Schema::hasTable('performance_endpoint_statuses')
            ? PerformanceEndpointStatus::query()->get()->keyBy('endpoint_key')
            : collect();

        $entries = $metrics
            ->groupBy(fn (AppRequestMetric $metric) => $this->endpointKey($metric))
            ->map(function (Collection $group, string $endpointKey) use ($statusMap) {
                /** @var AppRequestMetric $sample */
                $sample = $group->first();
                $routeLabel = $sample->route_name ?: $sample->path;
                $status = $statusMap->get($endpointKey);
                $lastSeen = $group->max('occurred_at');
                $effectiveStatus = $this->effectiveEndpointStatus($status, $lastSeen);

                return [
                    'endpoint_key' => $endpointKey,
                    'method' => $sample->method,
                    'path' => $sample->path,
                    'route_name' => $sample->route_name,
                    'endpoint' => $sample->method.' '.$routeLabel,
                    'requests' => $group->count(),
                    'average_ms' => round($group->avg('duration_ms'), 1),
                    'p95_ms' => $this->percentile($group->pluck('duration_ms')->all(), 95),
                    'max_ms' => (int) $group->max('duration_ms'),
                    'errors' => $group->filter(fn (AppRequestMetric $metric) => $metric->status_code >= 500)->count(),
                    'last_seen' => optional($lastSeen)->toDateTimeString(),
                    'status' => $effectiveStatus,
                    'status_updated_at' => $status?->status_updated_at?->toDateTimeString(),
                    'hidden_resolved' => $effectiveStatus === null,
                ];
            })
            ->filter(fn (array $endpoint) => ! $endpoint['hidden_resolved'])
            ->sortByDesc('p95_ms')
            ->values()
            ->all();

        $total = count($entries);
        $lastPage = max(1, (int) ceil($total / $perPage));
        $page = max(1, min($page, $lastPage));
        $offset = ($page - 1) * $perPage;
        $data = array_slice($entries, $offset, $perPage);

        return [
            'data' => $data,
            'current_page' => $page,
            'last_page' => $lastPage,
            'per_page' => $perPage,
            'total' => $total,
            'from' => $total ? $offset + 1 : 0,
            'to' => $total ? $offset + count($data) : 0,
        ];
    }

    private function slowEndpointsCount($start): int
    {
        $count = AppRequestMetric::query()
            ->where('occurred_at', '>=', $start)
            ->selectRaw("COUNT(DISTINCT CONCAT(method, '|', COALESCE(route_name, path))) as aggregate")
            ->value('aggregate') ?? 0;

        if (! Schema::hasTable('performance_endpoint_statuses')) {
            return (int) $count;
        }

        $resolvedStatuses = PerformanceEndpointStatus::query()
            ->where('status', 'resolved')
            ->get();

        if ($resolvedStatuses->isEmpty()) {
            return (int) $count;
        }

        $hiddenCount = $resolvedStatuses
            ->filter(function (PerformanceEndpointStatus $status) use ($start) {
                $latestSeen = AppRequestMetric::query()
                    ->where('occurred_at', '>=', $start)
                    ->where('method', $status->method)
                    ->where(function ($query) use ($status) {
                        $query->where('route_name', $status->route_name);

                        if ($status->route_name === null) {
                            $query->orWhere(function ($nested) use ($status) {
                                $nested->whereNull('route_name')
                                    ->where('path', $status->path);
                            });
                        }
                    })
                    ->max('occurred_at');

                if (! $latestSeen) {
                    return false;
                }

                return $this->effectiveEndpointStatus($status, $latestSeen) === null;
            })
            ->count();

        return max(0, (int) $count - $hiddenCount);
    }

    private function endpointKey(AppRequestMetric $metric): string
    {
        return $metric->method.'|'.($metric->route_name ?: $metric->path);
    }

    private function effectiveEndpointStatus(?PerformanceEndpointStatus $status, mixed $lastSeen): ?string
    {
        if (! $status) {
            return 'pending';
        }

        if ($status->status !== 'resolved') {
            return $status->status;
        }

        if (! $status->status_updated_at || ! $lastSeen) {
            return null;
        }

        $lastSeenAt = $lastSeen instanceof \Carbon\CarbonInterface
            ? $lastSeen
            : now()->parse($lastSeen);

        return $lastSeenAt->gt($status->status_updated_at)
            ? 'pending'
            : null;
    }

    private function recentErrors($start): array
    {
        return AppRequestMetric::query()
            ->where('occurred_at', '>=', $start)
            ->where('status_code', '>=', 500)
            ->where(function ($query) {
                $query->whereNull('error_status')
                    ->orWhere('error_status', '!=', 'resolved');
            })
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
                'error_status' => $metric->error_status ?? 'pending',
                'error_status_updated_at' => $metric->error_status_updated_at?->toDateTimeString(),
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
