<?php

return [
    'enabled' => env('AUDIT_ENABLED', true),

    'queue' => [
        'name' => env('AUDIT_QUEUE', 'audit'),
        'connection' => env('AUDIT_QUEUE_CONNECTION', 'sync'),
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
        'idempotency_key',
        'secret',
        'otp',
        'pin',
        'remember_token',
    ],

    'ignored_model_fields' => [
        'created_at',
        'updated_at',
        'deleted_at',
        'last_activity',
        'remember_token',
        'email_verified_at',
        'created_by',
        'updated_by',
        'recorded_by',
        'approved_by',
        'assigned_by',
        'cancelled_by',
        'transferred_by',
        'processed_by',
        'deactivated_by',
        'triggered_by_event_id',
        'idempotency_key',
    ],

    'ignored_metadata_fields' => [
        'automatic',
        'request',
    ],

    'max_display_changes' => 8,

    'ignored_model_events' => [
        'retrieved',
        'saving',
        'saved',
    ],
];
