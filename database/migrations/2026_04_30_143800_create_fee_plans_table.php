<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('fee_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('plan_type', ['original', 'revised'])->default('original');
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->string('version');
            $table->boolean('is_active')->default(false);
            $table->enum('approval_status', ['draft', 'pending_approval', 'approved', 'rejected'])->default('draft');
            $table->foreignId('created_by')
                ->constrained('users', 'id')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('staffs')
                ->nullOnDelete()
                ->cascadeOnUpdate();
            $table->timestamp('approved_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->unique('name');
        });

        Schema::create('fee_components', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('fee_plan_id')
                ->constrained('fee_plans')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->string('name');
            $table->decimal('amount', 12, 2);
            $table->boolean('is_optional')->default(false);
            $table->integer('display_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        if (DB::connection()->getDriverName() !== 'sqlite') {
            DB::statement('ALTER TABLE fee_components ADD CONSTRAINT fee_components_amount_positive CHECK (amount > 0)');
        }

        Schema::create('fee_plan_assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('fee_plan_id')
                ->constrained('fee_plans')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->foreignId('curriculum_id');
            $table->foreignId('academic_year_id')
                ->constrained('academic_years')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->foreignId('session_id')
                ->constrained('academic_sessions')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->enum('plan_type_context', ['original', 'revised']);
            $table->uuid('revises_assignment_id')->nullable();
            $table->json('amount_snapshot');
            $table->foreignId('assigned_by')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->timestamp('assigned_at')->useCurrent();
            $table->enum('status', ['active', 'cancelled'])->default('active');
            $table->string('cancellation_reason')->nullable();
            $table->foreignId('cancelled_by')
                ->nullable()
                ->constrained('users')
                ->cascadeOnUpdate()
                ->nullOnDelete();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('curriculum_id')
                ->references('id')
                ->on('curricula')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });

        Schema::table('fee_plan_assignments', function (Blueprint $table) {
            $table->foreign('revises_assignment_id')
                ->references('id')
                ->on('fee_plan_assignments')
                ->nullOnDelete();
        });

        DB::statement("CREATE UNIQUE INDEX fee_plan_assignments_active_unique ON fee_plan_assignments (curriculum_id, academic_year_id, session_id) WHERE status = 'active' AND deleted_at IS NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS fee_plan_assignments_active_unique');
        Schema::dropIfExists('fee_plan_assignments');
        Schema::dropIfExists('fee_components');
        Schema::dropIfExists('fee_plans');
    }
};
