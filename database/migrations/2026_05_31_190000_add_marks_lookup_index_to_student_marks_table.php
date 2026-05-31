<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_marks', function (Blueprint $table) {
            $table->index(
                [
                    'program_version_unit_id',
                    'assessment_type',
                    'assessment_number',
                    'academic_session_id',
                    'academic_session_enrollment_id',
                    'student_id',
                ],
                'student_marks_lookup_index'
            );
        });
    }

    public function down(): void
    {
        Schema::table('student_marks', function (Blueprint $table) {
            $table->dropIndex('student_marks_lookup_index');
        });
    }
};
