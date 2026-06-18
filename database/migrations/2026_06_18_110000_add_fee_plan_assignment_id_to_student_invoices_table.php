<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('student_invoices') || Schema::hasColumn('student_invoices', 'fee_plan_assignment_id')) {
            return;
        }

        Schema::table('student_invoices', function (Blueprint $table) {
            $table->uuid('fee_plan_assignment_id')->nullable();

            $table->foreign('fee_plan_assignment_id')
                ->references('id')
                ->on('fee_plan_assignments')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('student_invoices') || ! Schema::hasColumn('student_invoices', 'fee_plan_assignment_id')) {
            return;
        }

        Schema::table('student_invoices', function (Blueprint $table) {
            $table->dropForeign(['fee_plan_assignment_id']);
            $table->dropColumn('fee_plan_assignment_id');
        });
    }
};
