<?php

namespace App\Console\Commands;

use App\Models\AuditLog;
use Illuminate\Console\Command;

class PruneAuditLogsCommand extends Command
{
    protected $signature = 'audit:prune {--days= : Override the configured retention period}';

    protected $description = 'Delete audit log entries older than the configured retention period';

    public function handle(): int
    {
        $days = (int) ($this->option('days') ?? config('audit.prune_after_days', 365));

        if ($days <= 0) {
            $this->warn('Retention period must be greater than 0. Skipping.');

            return self::FAILURE;
        }

        $cutoff = now()->subDays($days);

        $deleted = AuditLog::query()
            ->where('created_at', '<', $cutoff)
            ->delete();

        $this->info("Deleted {$deleted} audit log entries older than {$days} days.");

        return self::SUCCESS;
    }
}
