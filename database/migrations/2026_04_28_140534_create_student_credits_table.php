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
        Schema::create('student_credits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')
                ->constrained('students', 'id')
                ->cascadeOnDelete();
            $table->foreignId('source_invoice_id')
                ->nullable()
                ->constrained('student_invoices', 'id')
                ->nullOnDelete();
            $table->foreignId('applied_invoice_id')
                ->nullable()
                ->constrained('student_invoices', 'id')
                ->nullOnDelete();
            $table->decimal('amount', 12, 2);
            $table->enum('status', ['pending', 'applied'])->default('pending');
            $table->timestamp('applied_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_credits');
    }
};
