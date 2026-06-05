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
        if (! Schema::hasTable('course_enrollments')) {
            Schema::create('course_enrollments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_id')
                    ->constrained('students', 'id')
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();
                $table->foreignId('course_id')
                    ->nullable()
                    ->constrained('courses')
                    ->nullOnDelete()
                    ->cascadeOnUpdate();
                $table->foreignId('curriculum_id')
                    ->nullable()
                    ->constrained('curricula')
                    ->nullOnDelete()
                    ->cascadeOnUpdate();
                $table->foreignId('exam_body_id')
                    ->nullable()
                    ->constrained('exam_bodies')
                    ->nullOnDelete()
                    ->cascadeOnUpdate();
                $table->foreignId('curriculum_mapping_id')
                    ->constrained('curriculum_mappings', 'id')
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();
                $table->date('enrollment_date')->nullable();
                $table->unsignedSmallInteger('intake_year')->nullable();
                $table->string('intake_period', 50)->nullable();
                $table->date('expected_completion_date')->nullable();
                $table->string('study_mode', 50)->nullable();
                $table->string('status', 30)->default('active');
                $table->timestamp('transferred_at')->nullable();
                $table->foreignId('transferred_by')->nullable()->constrained('users')->nullOnDelete();
                $table->softDeletes();
                $table->timestamps();

                $table->index(['student_id', 'id']);
                $table->index(['course_id', 'curriculum_id', 'exam_body_id']);
                $table->index('curriculum_mapping_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_enrollments');
    }
};
