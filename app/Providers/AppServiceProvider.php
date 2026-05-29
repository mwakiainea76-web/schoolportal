<?php

namespace App\Providers;

use App\Repositories\FeeManagement\Contracts\ProgramVersionRepositoryInterface;
use App\Repositories\FeeManagement\Contracts\FeeComponentRepositoryInterface;
use App\Repositories\FeeManagement\Contracts\FeePlanAssignmentRepositoryInterface;
use App\Repositories\FeeManagement\Contracts\FeePlanRepositoryInterface;
use App\Repositories\FeeManagement\Eloquent\EloquentProgramVersionRepository;
use App\Repositories\FeeManagement\Eloquent\EloquentFeeComponentRepository;
use App\Repositories\FeeManagement\Eloquent\EloquentFeePlanAssignmentRepository;
use App\Repositories\FeeManagement\Eloquent\EloquentFeePlanRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(FeePlanRepositoryInterface::class, EloquentFeePlanRepository::class);
        $this->app->bind(FeeComponentRepositoryInterface::class, EloquentFeeComponentRepository::class);
        $this->app->bind(FeePlanAssignmentRepositoryInterface::class, EloquentFeePlanAssignmentRepository::class);
        $this->app->bind(ProgramVersionRepositoryInterface::class, EloquentProgramVersionRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Model::shouldBeStrict((bool) config('performance.strict_mode', false));

        DB::whenQueryingForLongerThan(
            (int) config('performance.query_budget_ms', 200),
            function ($connection, QueryExecuted $event): void {
                $context = [
                    'connection' => $connection->getName(),
                    'sql' => $event->toRawSql(),
                    'time_ms' => $event->time,
                    'route' => request()?->route()?->getName(),
                    'url' => request()?->fullUrl(),
                ];

                Log::warning('Slow database query detected.', $context);
                Log::channel('performance')->warning('Slow database query detected.', $context);
            }
        );
    }
}
