<?php

namespace App\Support;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\RelationNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class RequestLogContext
{
    public static function ensureRequestId(Request $request): string
    {
        $requestId = (string) $request->attributes->get('request_id');

        if ($requestId !== '') {
            return $requestId;
        }

        $incomingRequestId = (string) $request->headers->get('X-Request-Id', '');
        $requestId = preg_match('/^[A-Za-z0-9_.:-]{8,80}$/', $incomingRequestId)
            ? $incomingRequestId
            : 'req_'.Str::lower(Str::random(16));

        $request->attributes->set('request_id', $requestId);

        return $requestId;
    }

    public static function request(Request $request, array $extra = []): array
    {
        return array_filter(array_merge([
            'timestamp' => now()->utc()->toJSON(),
            'method' => $request->method(),
            'path' => '/'.ltrim($request->path(), '/'),
            'route' => $request->route()?->getName(),
            'user_id' => $request->user()?->id,
            'ip_address' => self::sanitizeIp((string) $request->ip()),
            'request_id' => self::ensureRequestId($request),
        ], $extra), fn ($value) => $value !== null && $value !== '');
    }

    public static function exception(
        Request $request,
        Throwable $exception,
        string $event,
        string $message,
        int $statusCode,
        int $durationMs
    ): array {
        return self::request($request, [
            'level' => self::levelForStatus($statusCode),
            'event' => $event,
            'message' => $message,
            'exception_class' => $exception::class,
            'exception_message' => $exception->getMessage(),
            'file' => basename($exception->getFile()),
            'line' => $exception->getLine(),
            'status_code' => $statusCode,
            'error_code' => self::errorCode($exception, $statusCode),
            'duration_ms' => $durationMs,
        ]);
    }

    public static function responseError(Request $request, int $statusCode, int $durationMs): array
    {
        return self::request($request, [
            'level' => self::levelForStatus($statusCode),
            'event' => self::eventForStatus($statusCode),
            'message' => self::messageForStatus($statusCode),
            'status_code' => $statusCode,
            'error_code' => self::statusErrorCode($statusCode),
            'duration_ms' => $durationMs,
        ]);
    }

    public static function slowRequest(Request $request, int $statusCode, int $durationMs): array
    {
        return self::request($request, [
            'level' => 'WARNING',
            'event' => 'slow_request_detected',
            'message' => 'Request completed successfully but exceeded the configured performance threshold.',
            'status_code' => $statusCode,
            'duration_ms' => $durationMs,
        ]);
    }

    public static function levelForStatus(int $statusCode): string
    {
        return $statusCode >= 500 ? 'ERROR' : 'WARNING';
    }

    public static function statusFromException(Throwable $exception): int
    {
        if ($exception instanceof ValidationException) {
            return 422;
        }

        if ($exception instanceof AuthenticationException) {
            return 401;
        }

        if ($exception instanceof AuthorizationException) {
            return 403;
        }

        if ($exception instanceof ModelNotFoundException) {
            return 404;
        }

        return $exception instanceof HttpExceptionInterface
            ? $exception->getStatusCode()
            : 500;
    }

    public static function errorCode(Throwable $exception, int $statusCode): string
    {
        return match (true) {
            $exception instanceof QueryException => 'DB_QUERY_FAILED',
            $exception instanceof RelationNotFoundException => 'ELOQUENT_RELATION_NOT_FOUND',
            $exception instanceof ModelNotFoundException => 'RECORD_NOT_FOUND',
            $exception instanceof ValidationException => 'VALIDATION_FAILED',
            $exception instanceof AuthenticationException => 'AUTHENTICATION_REQUIRED',
            $exception instanceof AuthorizationException => 'INSUFFICIENT_ROLE',
            default => self::statusErrorCode($statusCode),
        };
    }

    public static function statusErrorCode(int $statusCode): string
    {
        return match ($statusCode) {
            400 => 'BAD_REQUEST',
            401 => 'AUTHENTICATION_REQUIRED',
            403 => 'INSUFFICIENT_ROLE',
            404 => 'ROUTE_NOT_FOUND',
            419 => 'CSRF_TOKEN_MISMATCH',
            422 => 'VALIDATION_FAILED',
            429 => 'RATE_LIMIT_EXCEEDED',
            500 => 'UNHANDLED_SERVER_ERROR',
            503 => 'SERVICE_UNAVAILABLE',
            default => $statusCode >= 500 ? 'SERVER_ERROR_RESPONSE' : 'CLIENT_ERROR_RESPONSE',
        };
    }

    public static function eventForException(Throwable $exception): string
    {
        return match (true) {
            $exception instanceof QueryException => 'database_query_failed',
            $exception instanceof RelationNotFoundException => 'eloquent_relation_not_found',
            $exception instanceof ModelNotFoundException => 'record_not_found',
            $exception instanceof ValidationException => 'validation_failed',
            $exception instanceof AuthenticationException => 'authentication_required',
            $exception instanceof AuthorizationException => 'authorization_failed',
            default => 'request_exception',
        };
    }

    public static function messageForException(Throwable $exception): string
    {
        return match (true) {
            $exception instanceof QueryException => 'Request failed because a database query could not be completed.',
            $exception instanceof RelationNotFoundException => 'Request failed because code referenced an undefined Eloquent relationship.',
            $exception instanceof ModelNotFoundException => 'Request failed because the requested record was not found.',
            $exception instanceof ValidationException => 'Request failed validation.',
            $exception instanceof AuthenticationException => 'Request requires an authenticated user.',
            $exception instanceof AuthorizationException => 'Authenticated user is not allowed to perform this action.',
            default => 'Request failed because an unhandled exception was thrown.',
        };
    }

    private static function eventForStatus(int $statusCode): string
    {
        return match ($statusCode) {
            401 => 'authentication_required_response',
            403 => 'authorization_failed_response',
            404 => 'route_not_found_response',
            419 => 'csrf_token_mismatch_response',
            422 => 'validation_failed_response',
            429 => 'rate_limit_exceeded_response',
            default => $statusCode >= 500 ? 'server_error_response' : 'client_error_response',
        };
    }

    private static function messageForStatus(int $statusCode): string
    {
        return $statusCode >= 500
            ? 'Request completed with a server error response.'
            : 'Request completed with a client error response.';
    }

    private static function sanitizeIp(string $ip): string
    {
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            $parts = explode('.', $ip);

            return "{$parts[0]}.{$parts[1]}.XX.XX";
        }

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            return preg_replace('/(:?[0-9a-f]{0,4}:?){4}$/i', ':XXXX:XXXX:XXXX:XXXX', $ip) ?: 'masked-ipv6';
        }

        return 'unknown';
    }
}
