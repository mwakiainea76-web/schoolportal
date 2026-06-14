<?php

namespace App\Jobs;

use App\Models\AuditLog;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

class WriteAuditLogJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public array $backoff = [10, 30, 120];

    public function __construct(
        public array $payload,
    ) {
        $this->onQueue(config('audit.queue.name', 'audit'));
    }

    public function handle(): void
    {
        AuditLog::query()->create($this->payload);
    }

    public function failed(Throwable $exception): void
    {
        Log::error('audit_log_write_failed', [
            'message' => $exception->getMessage(),
            'payload' => $this->payload,
        ]);
    }
}
