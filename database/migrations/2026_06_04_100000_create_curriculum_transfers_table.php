<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('curriculum_transfers')) {
            return;
        }

        Schema::create('curriculum_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('from_curriculum_mapping_id')->constrained('curriculum_mappings')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('to_curriculum_mapping_id')->constrained('curriculum_mappings')->cascadeOnUpdate()->restrictOnDelete();
            $table->date('transfer_date');
            $table->text('reason')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('staffs')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('curriculum_transfers');
    }
};
