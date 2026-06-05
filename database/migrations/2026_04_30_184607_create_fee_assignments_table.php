<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('fee_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fee_plan_id')
                ->constrained('fee_plans', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('academic_year_id')
                ->constrained('academic_years', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('curriculum_mapping_id')
                ->nullable()
                ->constrained('curriculum_mappings')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('created_by')
                ->constrained('staffs', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->unsignedSmallInteger('year_of_study')
                ->nullable()
                ->after('curriculum_mapping_id');
            $table->unsignedSmallInteger('session_number')
                ->nullable()
                ->after('year_of_study');
            $table->boolean('is_active')->default(true);
            $table->date('valid_from');
            $table->date('valid_to')->nullable();
            $table->enum('approval_status', ['draft', 'pending_approval', 'approved', 'rejected'])->default('draft');
            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('staffs')
                ->nullOnDelete()
                ->cascadeOnUpdate();
            $table->timestamp('approved_at')->nullable();
            $table->index('valid_from');
            $table->index('valid_to');
            $table->index(['academic_year_id', 'curriculum_mapping_id']);
            $table->index(['curriculum_mapping_id', 'year_of_study', 'session_number', 'academic_year_id', 'is_active']);
            $table->index(['approval_status', 'valid_to']);
            $table->softDeletes();
            $table->timestamps();
        });

        // Add partial unique index to enforce only ONE active assignment per combination
        if (config('database.default') === 'mysql') {
            DB::statement('CREATE UNIQUE INDEX fee_assignments_active_unique ON fee_assignments (academic_year_id, curriculum_mapping_id, year_of_study, session_number) WHERE is_active = 1');
        } elseif (config('database.default') === 'pgsql') {
            DB::statement('CREATE UNIQUE INDEX fee_assignments_active_unique ON fee_assignments (academic_year_id, curriculum_mapping_id, year_of_study, session_number) WHERE is_active = true');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop partial unique index
        if (config('database.default') === 'mysql') {
            DB::statement('DROP INDEX IF EXISTS fee_assignments_active_unique ON fee_assignments');
        } elseif (config('database.default') === 'pgsql') {
            DB::statement('DROP INDEX IF EXISTS fee_assignments_active_unique');
        }

        Schema::dropIfExists('fee_assignments');
    }
};
