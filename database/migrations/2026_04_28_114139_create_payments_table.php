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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_invoice_id')
                ->constrained('student_invoices', 'id')
                ->cascadeOnDelete();
            $table->decimal('amount_paid', 12, 2);
            $table->string('reference')->nullable();
            $table->enum('method', ['mpesa', 'bank_transfer', 'cash'])->default('cash');
            $table->timestamp('paid_at')->useCurrent();
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
