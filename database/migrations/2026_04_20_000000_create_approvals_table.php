<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('approvals', function (Blueprint $table) {
            $table->id();
            $table->string('approvable_type');
            $table->unsignedBigInteger('approvable_id');
            $table->string('type')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending')->index();
            $table->text('notes')->nullable();
            $table->foreignId('requested_by')->nullable()->constrained('staffs')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('staffs')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->index(['approvable_type', 'approvable_id']);
            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('approvals');
    }
};
