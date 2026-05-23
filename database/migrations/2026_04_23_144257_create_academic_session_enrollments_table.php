<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academic_session_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_enrollment_id')
                ->constrained('program_enrollments', 'id')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignId('academic_session_id')
                ->constrained('academic_sessions', 'id')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->unsignedInteger('module')->default(1);
            $table->unsignedSmallInteger('year_of_study')->default(1);
            $table->unsignedSmallInteger('session_number')->default(1);
            $table->enum('status', [
                'active',
                'completed',
                'dropped',
                'transferred',
                'suspended',
            ])->default('active');
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['program_enrollment_id', 'academic_session_id'], 'academic_session_enrollments_unique_session');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academic_session_enrollments');
    }
};
