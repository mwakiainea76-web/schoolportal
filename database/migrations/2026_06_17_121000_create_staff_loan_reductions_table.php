<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_loan_reductions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('staff_id')->constrained('staffs')->cascadeOnDelete();
            $table->string('loan_name', 120);
            $table->decimal('principal_amount', 12, 2);
            $table->decimal('monthly_reduction', 12, 2);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('status', 30)->default('active');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['staff_id', 'status']);
            $table->index('start_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_loan_reductions');
    }
};
