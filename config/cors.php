<?php

$parseOrigins = static fn (string $value): array => array_values(array_filter(array_map(
    'trim',
    explode(',', $value)
)));

$allowedOrigins = $parseOrigins((string) env('CORS_ALLOWED_ORIGINS', ''));
$publicAllowedOrigins = $parseOrigins((string) env('PUBLIC_API_ALLOWED_ORIGINS', ''));

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => $allowedOrigins,

    'public_allowed_origins' => $publicAllowedOrigins,

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 600,

    'supports_credentials' => true,
];
