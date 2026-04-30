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
        Schema::create('student_invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')
                ->constrained('academic_session_enrollments', 'id')
                ->cascadeOnDelete();
            $table->foreignId('fee_model_id')
                ->constrained('fee_models', 'id')
                ->cascadeOnDelete();
            $table->decimal('gross_amount', 12, 2);
            $table->decimal('adjusted_amount', 12, 2);
            $table->decimal('credit_balance', 12, 2)->default(0);
            $table->enum('overpayment_action', ['credit', 'refund', 'pending'])->default('credit');
            $table->enum('status', ['draft', 'issued', 'cancelled'])->default('draft');
            $table->date('due_date')->nullable();
            $table->softDeletes();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_invoices');
    }
};
