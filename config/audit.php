<?php

return [
    'enabled' => env('AUDIT_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Queue
    |--------------------------------------------------------------------------
    | Use an async queue (database, redis) in production to avoid blocking
    | HTTP responses. Set AUDIT_QUEUE_CONNECTION=database and run a queue
    | worker (php artisan queue:work --queue=audit) for async processing.
    | Keep 'sync' (default) when no queue worker is configured.
    */
    'queue' => [
        'name' => env('AUDIT_QUEUE', 'audit'),
        'connection' => env('AUDIT_QUEUE_CONNECTION', 'sync'),
        'sync_in_tests' => env('AUDIT_QUEUE_SYNC_IN_TESTS', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Data retention
    |--------------------------------------------------------------------------
    | Logs older than this many days are pruned automatically via the
    | prune-audit-logs artisan command (scheduled daily).
    */
    'prune_after_days' => env('AUDIT_PRUNE_AFTER_DAYS', 365),

    /*
    |--------------------------------------------------------------------------
    | Diff limits
    |--------------------------------------------------------------------------
    | Cap the number of changed fields stored per audit entry. When more
    | fields change than this limit, excess fields are summarized as a count
    | to keep payload size predictable.
    */
    'max_diff_fields' => env('AUDIT_MAX_DIFF_FIELDS', 20),

    /*
    |--------------------------------------------------------------------------
    | Payload size limits
    |--------------------------------------------------------------------------
    | Truncate individual string values in old/new/metadata that exceed this
    | length to keep JSONB storage efficient.
    */
    'max_field_length' => env('AUDIT_MAX_FIELD_LENGTH', 500),

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
