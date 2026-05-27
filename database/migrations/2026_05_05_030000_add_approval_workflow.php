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
        $feePlansPatched = false;
        $feeAssignmentsPatched = false;
        $studentInvoicesPatched = false;

        if (Schema::hasTable('fee_plans') && ! Schema::hasColumn('fee_plans', 'approval_status')) {
            Schema::table('fee_plans', function (Blueprint $table) {
                $table->enum('approval_status', ['draft', 'pending_approval', 'approved', 'rejected'])->default('draft')->after('is_active');
                $table->foreignId('approved_by')->nullable()->after('created_by');
                $table->timestamp('approved_at')->nullable()->after('approved_by');
            });
            $feePlansPatched = true;
        }

        if (Schema::hasTable('fee_assignments') && ! Schema::hasColumn('fee_assignments', 'approval_status')) {
            Schema::table('fee_assignments', function (Blueprint $table) {
                $table->enum('approval_status', ['draft', 'pending_approval', 'approved', 'rejected'])->default('draft')->after('valid_to');
                $table->foreignId('approved_by')->nullable()->after('created_by');
                $table->timestamp('approved_at')->nullable()->after('approved_by');
            });
            $feeAssignmentsPatched = true;
        }

        if (Schema::hasTable('student_invoices') && ! Schema::hasColumn('student_invoices', 'approval_status')) {
            Schema::table('student_invoices', function (Blueprint $table) {
                $table->enum('approval_status', ['draft', 'pending_approval', 'approved', 'rejected'])->default('draft')->after('status');
                $table->foreignId('approved_by')->nullable()->after('created_by');
                $table->timestamp('approved_at')->nullable()->after('approved_by');
            });
            $studentInvoicesPatched = true;
        }

        if (Schema::hasTable('staffs')) {
            if ($feePlansPatched) {
                Schema::table('fee_plans', function (Blueprint $table) {
                    $table->foreign('approved_by')->references('id')->on('staffs')->nullOnDelete()->cascadeOnUpdate();
                });
            }

            if ($feeAssignmentsPatched) {
                Schema::table('fee_assignments', function (Blueprint $table) {
                    $table->foreign('approved_by')->references('id')->on('staffs')->nullOnDelete()->cascadeOnUpdate();
                });
            }

            if ($studentInvoicesPatched) {
                Schema::table('student_invoices', function (Blueprint $table) {
                    $table->foreign('approved_by')->references('id')->on('staffs')->nullOnDelete()->cascadeOnUpdate();
                });
            }
        }

        if (! Schema::hasTable('approvals')) {
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approvals');
    }
};
