<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Strict Eloquent Mode
    |--------------------------------------------------------------------------
    |
    | Helps surface lazy loading and similar issues early while we are still
    | building. This is especially useful before data volume grows.
    |
    */
    'strict_mode' => env('PERF_STRICT_MODE', env('APP_ENV', 'production') !== 'production'),

    /*
    |--------------------------------------------------------------------------
    | Total Query Time Budget Per Request
    |--------------------------------------------------------------------------
    |
    | Laravel logs a warning when cumulative query time for a request exceeds
    | this threshold.
    |
    */
    'query_budget_ms' => env('PERF_QUERY_BUDGET_MS', 200),

    /*
    |--------------------------------------------------------------------------
    | Slow Request Log Threshold
    |--------------------------------------------------------------------------
    |
    | Requests at or above this duration are written to the performance log.
    |
    */
    'slow_request_ms' => env('PERF_SLOW_REQUEST_MS', 1000),
];
