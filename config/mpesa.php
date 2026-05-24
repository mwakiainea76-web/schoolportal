<?php

$kcbBaseUrl = rtrim((string) env('KCB_BASE_URL', ''), '/');

return [
    'collection_bank' => 'KCB',
    'channel' => 'KCB_BUNI',
    'environment' => str_contains($kcbBaseUrl, 'uat.') ? 'sandbox' : 'production',
    'paybill_number' => '522533',
    'school_code' => env('KCB_SCHOOL_TILL'),
    'callback_url' => rtrim((string) config('app.url'), '/').'/api/payments/mpesa/callback',
    'callback_secret' => null,
    'callback_secret_header' => 'X-Callback-Secret',
    'api_base_url' => $kcbBaseUrl,
    'api_key' => env('KCB_CONSUMER_KEY'),
    'api_secret' => env('KCB_CONSUMER_SECRET'),
    'stk_push_url' => env('KCB_STK_PUSH_URL', $kcbBaseUrl),
    'stk_push_narration' => 'School fees payment',
    'timeout_seconds' => 30,
    'verify_school_code' => true,
    'auto_post' => true,
    'queue_connection' => env('QUEUE_CONNECTION', 'database'),
    'posted_by_staff_id' => env('MPESA_POSTED_BY_STAFF_ID'),
    'reconciliation_alert_email' => null,
];
