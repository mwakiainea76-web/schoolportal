<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_unit_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_session_enrollment_id')
                ->constrained('academic_session_enrollments')
                ->cascadeOnDelete();
            $table->foreignId('program_version_unit_id')
                ->constrained('program_version_units')
                ->cascadeOnDelete();
            $table->timestamps();

            $table->unique(
                ['academic_session_enrollment_id', 'program_version_unit_id'],
                'student_unit_registration_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_unit_registrations');
    }
};
