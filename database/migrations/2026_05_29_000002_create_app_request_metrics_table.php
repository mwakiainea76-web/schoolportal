<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('app_request_metrics', function (Blueprint $table) {
            $table->id();
            $table->string('method', 10);
            $table->string('path', 500);
            $table->string('route_name')->nullable();
            $table->unsignedSmallInteger('status_code');
            $table->unsignedInteger('duration_ms');
            $table->unsignedInteger('memory_peak_kb');
            $table->unsignedInteger('response_size_bytes')->nullable();
            $table->boolean('is_api')->default(false);
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('occurred_at')->index();
            $table->timestamps();

            $table->index(['is_api', 'occurred_at']);
            $table->index(['status_code', 'occurred_at']);
            $table->index(['route_name', 'occurred_at']);
            $table->index(['method', 'route_name', 'occurred_at']);
            $table->index(['method', 'path', 'occurred_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('app_request_metrics');
    }
};
