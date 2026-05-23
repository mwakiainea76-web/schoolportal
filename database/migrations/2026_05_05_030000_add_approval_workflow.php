<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add approval status to fee_plans
        Schema::table('fee_plans', function (Blueprint $table) {
            $table->enum('approval_status', ['draft', 'pending_approval', 'approved', 'rejected'])->default('draft')->after('is_active');
            $table->foreignId('approved_by')->nullable()->after('created_by');
            $table->timestamp('approved_at')->nullable()->after('approved_by');
        });

        if (Schema::hasTable('staffs')) {
            Schema::table('fee_plans', function (Blueprint $table) {
                $table->foreign('approved_by')->references('id')->on('staffs')->nullOnDelete()->cascadeOnUpdate();
            });
        }

        // Add approval status to fee_assignments
        Schema::table('fee_assignments', function (Blueprint $table) {
            $table->enum('approval_status', ['draft', 'pending_approval', 'approved', 'rejected'])->default('draft')->after('valid_to');
            $table->foreignId('approved_by')->nullable()->after('created_by');
            $table->timestamp('approved_at')->nullable()->after('approved_by');
        });

        if (Schema::hasTable('staffs')) {
            Schema::table('fee_assignments', function (Blueprint $table) {
                $table->foreign('approved_by')->references('id')->on('staffs')->nullOnDelete()->cascadeOnUpdate();
            });
        }

        // Add approval status to student_invoices for write-offs
        Schema::table('student_invoices', function (Blueprint $table) {
            $table->enum('approval_status', ['draft', 'pending_approval', 'approved', 'rejected'])->default('draft')->after('status');
            $table->foreignId('approved_by')->nullable()->after('created_by');
            $table->timestamp('approved_at')->nullable()->after('approved_by');
        });

        if (Schema::hasTable('staffs')) {
            Schema::table('student_invoices', function (Blueprint $table) {
                $table->foreign('approved_by')->references('id')->on('staffs')->nullOnDelete()->cascadeOnUpdate();
            });
        }

        // Create approvals table for tracking approval requests
        Schema::create('approvals', function (Blueprint $table) {
            $table->id();
            $table->string('approvable_type'); // e.g., 'App\\Models\\FeePlan'
            $table->unsignedBigInteger('approvable_id');
            $table->enum('type', ['fee_plan_change', 'assignment_change', 'invoice_write_off'])->default('fee_plan_change');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('notes')->nullable();
            $table->foreignId('requested_by')->nullable();
            $table->foreignId('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->index(['approvable_type', 'approvable_id']);
            $table->index('status');
        });

        if (Schema::hasTable('staffs')) {
            Schema::table('approvals', function (Blueprint $table) {
                $table->foreign('requested_by')->references('id')->on('staffs')->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreign('approved_by')->references('id')->on('staffs')->nullOnDelete()->cascadeOnUpdate();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approvals');

        Schema::table('student_invoices', function (Blueprint $table) {
            $table->dropColumn(['approval_status', 'approved_by', 'approved_at']);
        });

        Schema::table('fee_assignments', function (Blueprint $table) {
            $table->dropColumn(['approval_status', 'approved_by', 'approved_at']);
        });

        Schema::table('fee_plans', function (Blueprint $table) {
            $table->dropColumn(['approval_status', 'approved_by', 'approved_at']);
        });
    }
};
