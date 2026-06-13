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
        Schema::create('student_status_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->enum('status', [
                'active',
                'deferred',
                'expelled',
                'graduated',
            ]);
            $table->date('effective_date');
            $table->text('reason')->nullable();
            $table->date('resume_date')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users');
            $table->timestamps();

            $table->index(['student_id', 'status']);
            $table->index('effective_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_status_logs');
    }
};
