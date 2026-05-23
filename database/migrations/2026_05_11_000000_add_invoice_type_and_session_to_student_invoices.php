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
        Schema::table('student_invoices', function (Blueprint $table) {
            $table->enum('invoice_type', ['fees', 'penalty', 'default_fees'])
                ->default('fees')
                ->after('fee_assignment_id');

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

        DB::table('student_invoices')->update(['invoice_type' => 'fees']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_invoices', function (Blueprint $table) {
            $table->dropForeign(['academic_session_id']);
            $table->dropColumn('academic_session_id');
            $table->dropColumn('invoice_type');
        });
    }
};
