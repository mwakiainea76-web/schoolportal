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
        if (
            Schema::hasTable('student_invoices')
            && ! Schema::hasColumn('student_invoices', 'invoice_type')
        ) {
            Schema::table('student_invoices', function (Blueprint $table) {
                $table->enum('invoice_type', ['fees', 'penalty', 'hostel', 'default_fees'])
                    ->default('fees')
                    ->after('fee_assignment_id');
            });
        }

        if (
            Schema::hasTable('student_invoices')
            && ! Schema::hasColumn('student_invoices', 'academic_session_id')
        ) {
            Schema::table('student_invoices', function (Blueprint $table) {
                $table->foreignId('academic_session_id')
                    ->nullable()
                    ->after('invoice_type');
            });

            if (Schema::hasTable('academic_sessions')) {
                Schema::table('student_invoices', function (Blueprint $table) {
                    $table->foreign('academic_session_id')->references('id')->on('academic_sessions')->nullOnDelete()->cascadeOnUpdate();
                });
            }

            DB::statement(
                'UPDATE student_invoices SET academic_session_id = academic_session_enrollments.academic_session_id FROM academic_session_enrollments WHERE student_invoices.enrollment_id = academic_session_enrollments.id'
            );
        }

        if (Schema::hasTable('student_invoices') && Schema::hasColumn('student_invoices', 'invoice_type')) {
            DB::table('student_invoices')->whereNull('invoice_type')->update(['invoice_type' => 'fees']);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op: these columns now belong to the base create migration.
    }
};
