<?php

namespace App\Http\Middleware;

use App\Models\AppRequestMetric;
use App\Support\RequestLogContext;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class RecordRequestPerformance
{
    public function handle(Request $request, Closure $next): Response
    {
        $startedAt = microtime(true);
        $requestId = RequestLogContext::ensureRequestId($request);

        Log::shareContext([
            'request_id' => $requestId,
        ]);

        try {
            /** @var Response $response */
            $response = $next($request);
        } catch (Throwable $exception) {
            $this->recordException($request, $exception, $startedAt);

            throw $exception;
        }

        $this->record($request, $response, $startedAt);
        $response->headers->set('X-Request-Id', $requestId);

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
            $statusCode = $response->getStatusCode();
            $isApi = $request->is('api/*');
            $isSlowOrError = $statusCode >= 400 || $durationMs >= (int) config('performance.slow_request_ms', 1000);

            if ($isApi || $isSlowOrError) {
                AppRequestMetric::create([
                    'method' => $request->method(),
                    'path' => $path,
                    'route_name' => $routeName,
                    'status_code' => $statusCode,
                    'duration_ms' => $durationMs,
                    'memory_peak_kb' => $memoryPeakKb,
                    'response_size_bytes' => $this->responseSize($response),
                    'is_api' => $isApi,
                    'user_id' => $request->user()?->id,
                    'occurred_at' => now(),
                ]);
            }

            if ($isSlowOrError) {
                $responseSizeBytes = $this->responseSize($response);
                $context = $statusCode >= 400
                    ? RequestLogContext::responseError($request, $statusCode, $durationMs)
                    : RequestLogContext::slowRequest($request, $statusCode, $durationMs);
                $context['response_size_bytes'] = $responseSizeBytes;
                $context['memory_peak_kb'] = $memoryPeakKb;

                $level = strtolower($context['level']);

                Log::channel('performance')->{$level}($context['event'], $context);
            }
        } catch (\Throwable $exception) {
            Log::warning('request_metric_recording_failed', RequestLogContext::request($request, [
                'level' => 'WARNING',
                'event' => 'request_metric_recording_failed',
                'message' => 'Request completed, but the performance metric could not be persisted.',
                'exception_class' => $exception::class,
                'exception_message' => $exception->getMessage(),
                'file' => basename($exception->getFile()),
                'line' => $exception->getLine(),
            ]));
        }
    }

    private function recordException(Request $request, Throwable $exception, float $startedAt): void
    {
        if ($this->shouldSkip($request)) {
            return;
        }

        $statusCode = RequestLogContext::statusFromException($exception);
        $durationMs = max(1, (int) round((microtime(true) - $startedAt) * 1000));
        $context = RequestLogContext::exception(
            $request,
            $exception,
            RequestLogContext::eventForException($exception),
            RequestLogContext::messageForException($exception),
            $statusCode,
            $durationMs
        );
        $context['memory_peak_kb'] = (int) round(memory_get_peak_usage(true) / 1024);
        $level = strtolower($context['level']);

        Log::channel('performance')->{$level}($context['event'], $context);
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
