<?php

use App\Jobs\RefreshAnalyticsSnapshotsJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('analytics:queue-refresh-snapshots {--date=}', function () {
    RefreshAnalyticsSnapshotsJob::dispatch($this->option('date'));

    $this->info('Analytics snapshot refresh job dispatched.');
})->purpose('Queue an analytics snapshot refresh job');

Artisan::command('analytics:queue-backfill-snapshots {--from=} {--to=}', function () {
    $from = $this->option('from') ? \Carbon\Carbon::parse($this->option('from'))->startOfDay() : now()->subDays(29)->startOfDay();
    $to = $this->option('to') ? \Carbon\Carbon::parse($this->option('to'))->startOfDay() : now()->startOfDay();

    if ($from->gt($to)) {
        $this->error('The --from date cannot be later than the --to date.');

        return;
    }

    while ($from->lte($to)) {
        RefreshAnalyticsSnapshotsJob::dispatch($from->toDateString());
        $from->addDay();
    }

    $this->info('Analytics snapshot backfill jobs dispatched.');
})->purpose('Queue analytics snapshot backfill jobs for a date range');

Schedule::command('analytics:refresh-snapshots')->dailyAt('01:00');
