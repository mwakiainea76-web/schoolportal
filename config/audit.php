<?php

return [
    'enabled' => env('AUDIT_ENABLED', true),

    'queue' => [
        'name' => env('AUDIT_QUEUE', 'audit'),
        'sync_in_tests' => env('AUDIT_QUEUE_SYNC_IN_TESTS', true),
    ],

    'authorization_roles' => [
        'admin',
        'super admin',
        'super_admin',
        'super-admin',
        'principal',
        'system administrator',
        'system_administrator',
        'system-administrator',
    ],

    'redacted_fields' => [
        'password',
        'password_confirmation',
        'current_password',
        'token',
        'api_key',
        'secret',
        'otp',
        'pin',
        'remember_token',
    ],

    'ignored_model_fields' => [
        'created_at',
        'updated_at',
        'deleted_at',
        'remember_token',
    ],

    'ignored_model_events' => [
        'retrieved',
        'saving',
        'saved',
    ],
];
