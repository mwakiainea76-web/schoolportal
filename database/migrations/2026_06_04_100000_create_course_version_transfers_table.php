<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('course_version_transfers')) {
            return;
        }

        Schema::create('course_version_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('from_course_version_mapping_id')->constrained('course_version_mappings')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('to_course_version_mapping_id')->constrained('course_version_mappings')->cascadeOnUpdate()->restrictOnDelete();
            $table->date('transfer_date');
            $table->text('reason')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('staffs')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_version_transfers');
    }
};
