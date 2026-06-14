<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedBigInteger('school_id')->nullable();
            $table->string('module', 100);
            $table->string('action', 150);
            $table->string('entity_type', 150)->nullable();
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->string('entity_label')->nullable();
            $table->jsonb('old_values')->nullable();
            $table->jsonb('new_values')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->char('user_agent_hash', 64)->nullable();
            $table->string('request_id', 100)->nullable();
            $table->timestampTz('created_at')->useCurrent();

            $table->index(['user_id', 'created_at'], 'audit_logs_user_created_at_idx');
            $table->index(['entity_type', 'entity_id', 'created_at'], 'audit_logs_entity_created_at_idx');
            $table->index(['action', 'created_at'], 'audit_logs_action_created_at_idx');
            $table->index('created_at', 'audit_logs_created_at_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
