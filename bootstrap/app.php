<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\EnforceSecurityBlock;
use App\Support\ApiResponse;
use App\Exceptions\ApiException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\DatabaseCors;
use App\Http\Middleware\RedirectStudentsFromAdmin;
use App\Http\Middleware\RecordRequestPerformance;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        // Web middleware stack
        $middleware->web(append: [
            HandleInertiaRequests::class,
            RecordRequestPerformance::class,
            EnforceSecurityBlock::class,
        ]);

        $middleware->api(prepend: [
            DatabaseCors::class,
            RecordRequestPerformance::class,
        ]);

        // Middleware aliases (Spatie)
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'non_student' => RedirectStudentsFromAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ApiException $exception, $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                $exception->errorCode(),
                $exception->getMessage(),
                $exception->details(),
                $exception->status()
            );
        });

        $exceptions->render(function (ValidationException $exception, $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return ApiResponse::error(
                'VALIDATION_ERROR',
                'The given data was invalid.',
                ['errors' => $exception->errors()],
                422
            );
        });

        $exceptions->render(function (\Throwable $exception, $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $status = $exception instanceof HttpExceptionInterface
                ? $exception->getStatusCode()
                : 500;

            return ApiResponse::error(
                'SERVER_ERROR',
                $status === 500 ? 'An unexpected server error occurred.' : $exception->getMessage(),
                [],
                $status
            );
        });
    })
    ->create();
