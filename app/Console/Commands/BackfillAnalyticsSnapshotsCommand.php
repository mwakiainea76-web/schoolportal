<?php

namespace App\Console\Commands;

use App\Services\Analytics\AnalyticsSnapshotService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class BackfillAnalyticsSnapshotsCommand extends Command
{
    protected $signature = 'analytics:backfill-snapshots {--from=} {--to=}';

    protected $description = 'Backfill analytics snapshot tables across a date range';

    public function handle(AnalyticsSnapshotService $analyticsSnapshotService): int
    {
        $from = $this->option('from')
            ? Carbon::parse($this->option('from'))->startOfDay()
            : Carbon::today()->subDays(29)->startOfDay();
        $to = $this->option('to')
            ? Carbon::parse($this->option('to'))->startOfDay()
            : Carbon::today()->startOfDay();

        if ($from->gt($to)) {
            $this->error('The --from date cannot be later than the --to date.');

            return self::FAILURE;
        }

        $cursor = $from->copy();
        $days = $from->diffInDays($to) + 1;

        $this->info("Backfilling analytics snapshots for {$days} day(s).");

        while ($cursor->lte($to)) {
            $result = $analyticsSnapshotService->refresh($cursor->toDateString());
            $this->line('Refreshed '.$result['metric_date']);
            $cursor->addDay();
        }

        $this->info('Analytics snapshot backfill completed successfully.');

        return self::SUCCESS;
    }
}
