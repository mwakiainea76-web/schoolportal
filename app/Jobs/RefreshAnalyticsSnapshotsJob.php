<?php

namespace App\Jobs;

use App\Services\Analytics\AnalyticsSnapshotService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class RefreshAnalyticsSnapshotsJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public ?string $date = null,
    ) {
    }

    public function handle(AnalyticsSnapshotService $analyticsSnapshotService): void
    {
        $analyticsSnapshotService->refresh($this->date);
    }
}
