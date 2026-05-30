<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('security_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('event_type', 120);
            $table->string('risk_level', 20)->default('info');
            $table->string('login_identifier')->nullable();
            $table->string('email')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('device_id')->nullable();
            $table->string('location_hint')->nullable();
            $table->string('route_name')->nullable();
            $table->text('user_agent')->nullable();
            $table->json('context')->nullable();
            $table->timestamp('occurred_at')->index();
            $table->timestamps();

            $table->index(['event_type', 'occurred_at']);
            $table->index(['risk_level', 'occurred_at']);
            $table->index(['login_identifier', 'occurred_at']);
            $table->index(['email', 'occurred_at']);
            $table->index(['ip_address', 'occurred_at']);
            $table->index(['device_id', 'occurred_at']);
        });

        Schema::create('security_blocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('triggered_by_event_id')->nullable()->constrained('security_events')->nullOnDelete();
            $table->string('login_identifier')->nullable();
            $table->string('email')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('device_id')->nullable();
            $table->string('location_hint')->nullable();
            $table->string('reason', 255);
            $table->string('risk_level', 20)->default('warning');
            $table->boolean('is_active')->default(true)->index();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('lifted_at')->nullable();
            $table->text('notes')->nullable();
            $table->json('context')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'is_active']);
            $table->index(['login_identifier', 'is_active']);
            $table->index(['email', 'is_active']);
            $table->index(['ip_address', 'is_active']);
            $table->index(['device_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('security_blocks');
        Schema::dropIfExists('security_events');
    }
};
