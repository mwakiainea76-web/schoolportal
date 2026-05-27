<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_session_id')
                ->constrained('academic_sessions')
                ->cascadeOnDelete();
            $table->foreignId('academic_session_enrollment_id')
                ->constrained('academic_session_enrollments')
                ->cascadeOnDelete();
            $table->foreignId('student_id')
                ->constrained('students')
                ->cascadeOnDelete();
            $table->foreignId('program_version_unit_id')
                ->constrained('program_version_units')
                ->cascadeOnDelete();
            $table->string('assessment_type', 20);
            $table->unsignedInteger('assessment_number');
            $table->unsignedTinyInteger('marks');
            $table->boolean('is_published')->default(false);
            $table->foreignId('recorded_by_staff_id')
                ->nullable()
                ->constrained('staffs')
                ->nullOnDelete();
            $table->timestamps();

            $table->unique(
                [
                    'student_id',
                    'program_version_unit_id',
                    'assessment_type',
                    'assessment_number',
                ],
                'student_marks_unique_assessment'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_marks');
    }
};
