<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('performance_endpoint_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('endpoint_key')->unique();
            $table->string('method', 10);
            $table->string('route_name')->nullable();
            $table->string('path', 500);
            $table->string('status', 20)->default('pending');
            $table->timestamp('status_updated_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'updated_at']);
            $table->index(['status', 'status_updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('performance_endpoint_statuses');
    }
};
