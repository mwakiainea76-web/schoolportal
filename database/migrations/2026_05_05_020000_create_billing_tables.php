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
        if (! Schema::hasTable('student_invoices')) {
            Schema::create('student_invoices', function (Blueprint $table) {
                $table->id();
                $table->string('invoice_number')->unique();
                $table->foreignId('student_id')
                    ->constrained('students')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
                $table->foreignId('enrollment_id')
                    ->constrained('academic_session_enrollments')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
                $table->foreignId('fee_assignment_id')
                    ->nullable()
                    ->constrained('fee_assignments')
                    ->nullOnDelete()
                    ->cascadeOnUpdate();
                $table->enum('status', ['draft', 'issued', 'partial', 'paid'])->default('draft');
                $table->date('issue_date')->nullable();
                $table->date('due_date')->nullable();
                $table->decimal('amount_due', 10, 2)->default(0);
                $table->decimal('paid_amount', 10, 2)->default(0);
                $table->decimal('balance_due', 10, 2)->default(0);
                $table->string('idempotency_key')->nullable()->unique();
                $table->text('notes')->nullable();
                $table->foreignId('created_by')
                    ->constrained('staffs')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
                $table->softDeletes();
                $table->timestamps();
                $table->index('status');
                $table->index('due_date');
                $table->index('student_id');
            });
        }

        if (! Schema::hasTable('invoice_items')) {
            Schema::create('invoice_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_invoice_id')
                    ->constrained('student_invoices')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
                $table->foreignId('fee_plan_item_id')
                    ->nullable()
                    ->constrained('fee_plan_items')
                    ->nullOnDelete()
                    ->cascadeOnUpdate();
                $table->string('description');
                $table->decimal('unit_amount', 10, 2);
                $table->unsignedInteger('quantity')->default(1);
                $table->decimal('total_amount', 10, 2);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('payments')) {
            Schema::create('payments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_invoice_id')
                    ->nullable()
                    ->constrained('student_invoices')
                    ->nullOnDelete()
                    ->cascadeOnUpdate();
                $table->foreignId('student_id')
                    ->nullable()
                    ->constrained('students')
                    ->nullOnDelete()
                    ->cascadeOnUpdate();
                $table->decimal('amount', 10, 2);
                $table->date('payment_date');
                $table->string('method')->nullable();
                $table->string('reference')->nullable();
                $table->enum('status', ['completed', 'pending', 'failed'])->default('completed');
                $table->string('idempotency_key')->nullable()->unique();
                $table->foreignId('created_by')
                    ->constrained('staffs')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
                $table->text('notes')->nullable();
                $table->timestamps();
                $table->index('payment_date');
                $table->index('status');
            });
        }

        if (! Schema::hasTable('payment_allocations')) {
            Schema::create('payment_allocations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('payment_id')
                    ->constrained('payments')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
                $table->foreignId('student_invoice_id')
                    ->constrained('student_invoices')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
                $table->decimal('amount', 10, 2);
                $table->date('allocated_at')->nullable();
                $table->timestamps();

                $table->index(['payment_id', 'student_invoice_id']);
            });
        }

        if (! Schema::hasTable('fee_adjustments')) {
            Schema::create('fee_adjustments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_invoice_id')
                    ->constrained('student_invoices')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
                $table->enum('type', ['discount', 'waiver', 'penalty', 'bursary', 'helb', 'refund', 'reversal', 'other'])->default('other');
                $table->decimal('amount', 10, 2);
                $table->string('idempotency_key')->nullable()->unique();
                $table->text('description')->nullable();
                $table->date('applied_at')->nullable();
                $table->foreignId('created_by')
                    ->constrained('staffs')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
                $table->timestamps();
                $table->index('type');
            });
        }

        if (! Schema::hasTable('ledger_transactions')) {
            Schema::create('ledger_transactions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_id');
                $table->foreignId('student_invoice_id')->nullable();
                $table->foreignId('academic_session_id');
                $table->enum('type', [
                    'invoice',
                    'payment',
                    'bursary',
                    'helb',
                    'discount',
                    'penalty',
                    'adjustment',
                    'refund',
                    'reversal',
                ]);
                $table->decimal('debit', 12, 2)->default(0);
                $table->decimal('credit', 12, 2)->default(0);
                $table->string('reference')->nullable();
                $table->text('description')->nullable();
                $table->date('transaction_date');
                $table->foreignId('created_by')->nullable();
                $table->softDeletes();
                $table->timestamps();

                $table->index(['student_id', 'academic_session_id']);
                $table->index('type');
                $table->index('transaction_date');
                $table->index('reference');
            });

            Schema::table('ledger_transactions', function (Blueprint $table) {
                $table->foreign('student_id', 'ledger_transactions_student_id_foreign')
                    ->references('id')
                    ->on('students')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();

                $table->foreign('student_invoice_id', 'ledger_transactions_student_invoice_id_foreign')
                    ->references('id')
                    ->on('student_invoices')
                    ->nullOnDelete()
                    ->cascadeOnUpdate();

                $table->foreign('academic_session_id', 'ledger_transactions_academic_session_id_foreign')
                    ->references('id')
                    ->on('academic_sessions')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();

                $table->foreign('created_by', 'ledger_transactions_created_by_foreign')
                    ->references('id')
                    ->on('staffs')
                    ->nullOnDelete()
                    ->cascadeOnUpdate();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ledger_transactions');
        Schema::dropIfExists('fee_adjustments');
        Schema::dropIfExists('payment_allocations');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('invoice_items');
        Schema::dropIfExists('student_invoices');
    }
};
