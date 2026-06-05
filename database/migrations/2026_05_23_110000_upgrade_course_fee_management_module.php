<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->createFeeComponentsTable();
        $this->createFeePlanAssignmentsTable();
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS fee_plan_assignments_active_unique');
        Schema::dropIfExists('fee_plan_assignments');
        Schema::dropIfExists('fee_components');
    }

    private function createFeeComponentsTable(): void
    {
        if (Schema::hasTable('fee_components')) {
            return;
        }

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
    }

    private function createFeePlanAssignmentsTable(): void
    {
        if (Schema::hasTable('fee_plan_assignments')) {
            return;
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

        DB::statement('CREATE UNIQUE INDEX fee_plan_assignments_active_unique ON fee_plan_assignments (curriculum_id, academic_year_id, session_id) WHERE status = \'active\' AND deleted_at IS NULL');
    }
};
