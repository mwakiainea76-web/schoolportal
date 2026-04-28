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
        Schema::create('refunds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_invoice_id')
                ->constrained('student_invoices', 'id')
                ->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->string('reason');
            $table->enum('method', ['mpesa', 'bank_transfer', 'cash'])->default('cash');
            $table->enum('status', ['pending', 'processed', 'failed'])->default('pending');
            $table->foreignId('raised_by')
                ->nullable()
                ->constrained('users', 'id')
                ->nullOnDelete();
            $table->foreignId('processed_by')
                ->nullable()
                ->constrained('users', 'id')
                ->nullOnDelete();
            $table->timestamp('raised_at')->useCurrent();
            $table->timestamp('processed_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refunds');
    }
};
