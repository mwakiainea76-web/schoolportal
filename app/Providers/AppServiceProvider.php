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
    }
}

