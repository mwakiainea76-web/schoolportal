<?php

namespace App\Console\Commands;

use App\Services\Analytics\AnalyticsSnapshotService;
use Illuminate\Console\Command;

class RefreshAnalyticsSnapshotsCommand extends Command
{
    protected $signature = 'analytics:refresh-snapshots {--date=}';

    protected $description = 'Refresh analytics snapshot tables for the given date';

    public function handle(AnalyticsSnapshotService $analyticsSnapshotService): int
    {
        $result = $analyticsSnapshotService->refresh($this->option('date'));

        $this->info('Analytics snapshots refreshed successfully.');
        $this->line('Metric date: '.$result['metric_date']);

        foreach ($result['metrics_written'] as $table => $count) {
            $this->line($table.': '.$count.' metrics');
        }

        return self::SUCCESS;
    }
}
