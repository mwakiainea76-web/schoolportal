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
        Schema::create('penalties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_invoice_id')
                ->constrained('student_invoices', 'id')
                ->cascadeOnDelete();
            $table->enum('penalty_type', ['lost_library_card', 'lost_id', 'lost_book', 'late_payment', 'other']);
            $table->decimal('amount', 12, 2);
            $table->enum('trigger', ['event', 'manual'])->default('manual');
            $table->foreignId('raised_by')
                ->nullable()
                ->constrained('users', 'id')
                ->nullOnDelete();
            $table->timestamp('raised_at')->useCurrent();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penalties');
    }
};
