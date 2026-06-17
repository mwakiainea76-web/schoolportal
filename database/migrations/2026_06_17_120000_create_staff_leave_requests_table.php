<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('staff_id')->constrained('staffs')->cascadeOnDelete();
            $table->string('leave_type', 60);
            $table->date('start_date');
            $table->date('end_date');
            $table->unsignedSmallInteger('total_days');
            $table->text('reason');
            $table->string('status', 30)->default('pending');
            $table->foreignId('reviewed_by')->nullable()->constrained('staffs')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_note')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['staff_id', 'status']);
            $table->index(['start_date', 'end_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_leave_requests');
    }
};
