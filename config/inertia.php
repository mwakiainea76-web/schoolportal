<?php

return [
    'ssr' => [
        'enabled' => env('INERTIA_SSR_ENABLED', true),
        'url' => env('INERTIA_SSR_URL', 'http://127.0.0.1:13714'),
        'ensure_bundle_exists' => env('INERTIA_SSR_ENSURE_BUNDLE_EXISTS', true),
    ],
];
