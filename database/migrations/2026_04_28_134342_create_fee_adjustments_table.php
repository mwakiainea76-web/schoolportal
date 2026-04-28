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
        Schema::create('fee_adjustments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_invoice_id')
                ->constrained('student_invoices', 'id')
                ->cascadeOnDelete();
            $table->enum('scope', ['student', 'department', 'curriculum', 'session']);
            $table->unsignedBigInteger('scope_ref')->nullable();
            $table->enum('type', ['percentage', 'fixed']);
            $table->decimal('value', 12, 2);
            $table->string('reason');
            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users', 'id')
                ->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fee_adjustments');
    }
};
