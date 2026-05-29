<?php

namespace App\Http\Middleware;

use App\Models\AppRequestMetric;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RecordRequestPerformance
{
    public function handle(Request $request, Closure $next): Response
    {
        $startedAt = microtime(true);

        /** @var Response $response */
        $response = $next($request);

        $this->record($request, $response, $startedAt);

        return $response;
    }

    private function record(Request $request, Response $response, float $startedAt): void
    {
        if ($this->shouldSkip($request)) {
            return;
        }

        try {
            $durationMs = max(1, (int) round((microtime(true) - $startedAt) * 1000));
            $memoryPeakKb = (int) round(memory_get_peak_usage(true) / 1024);
            $path = '/' . ltrim($request->path(), '/');
            $routeName = $request->route()?->getName();

            AppRequestMetric::create([
                'method' => $request->method(),
                'path' => $path,
                'route_name' => $routeName,
                'status_code' => $response->getStatusCode(),
                'duration_ms' => $durationMs,
                'memory_peak_kb' => $memoryPeakKb,
                'response_size_bytes' => $this->responseSize($response),
                'is_api' => $request->is('api/*'),
                'user_id' => $request->user()?->id,
                'occurred_at' => now(),
            ]);

            if ($durationMs >= (int) config('performance.slow_request_ms', 1000)) {
                Log::channel('performance')->warning('Slow request detected.', [
                    'method' => $request->method(),
                    'path' => $path,
                    'route' => $routeName,
                    'status_code' => $response->getStatusCode(),
                    'duration_ms' => $durationMs,
                    'memory_peak_kb' => $memoryPeakKb,
                    'is_api' => $request->is('api/*'),
                    'user_id' => $request->user()?->id,
                ]);
            }
        } catch (\Throwable $exception) {
            Log::debug('Unable to record request performance metric.', [
                'error' => $exception->getMessage(),
            ]);
        }
    }

    private function shouldSkip(Request $request): bool
    {
        return $request->is('up')
            || $request->is('build/*')
            || $request->is('favicon.ico')
            || $request->is('settings/performance*');
    }

    private function responseSize(Response $response): ?int
    {
        $length = $response->headers->get('Content-Length');

        if (is_numeric($length)) {
            return (int) $length;
        }

        $content = $response->getContent();

        return is_string($content) ? strlen($content) : null;
    }
}
