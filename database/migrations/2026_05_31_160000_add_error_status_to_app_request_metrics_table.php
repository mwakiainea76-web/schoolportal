<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('app_request_metrics', function (Blueprint $table) {
            $table->string('error_status', 20)->nullable()->after('user_id');
            $table->timestamp('error_status_updated_at')->nullable()->after('error_status');

            $table->index(['error_status', 'occurred_at']);
        });
    }

    public function down(): void
    {
        Schema::table('app_request_metrics', function (Blueprint $table) {
            $table->dropIndex(['error_status', 'occurred_at']);
            $table->dropColumn(['error_status', 'error_status_updated_at']);
        });
    }
};
