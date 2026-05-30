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
use App\Support\RequestLogContext;
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
                $request = request();

                if ($request->attributes->get('query_budget_logged', false)) {
                    return;
                }

                $request->attributes->set('query_budget_logged', true);

                $context = RequestLogContext::request($request, [
                    'level' => 'WARNING',
                    'event' => 'slow_database_query_detected',
                    'message' => 'A database query exceeded the configured query performance budget.',
                    'connection' => $connection->getName(),
                    'sql_template' => $event->sql,
                    'time_ms' => $event->time,
                    'user_id' => $request->attributes->get('authenticated_user_id'),
                ]);

                Log::warning($context['event'], $context);
                Log::channel('performance')->warning($context['event'], $context);
            }
        );
    }
}
