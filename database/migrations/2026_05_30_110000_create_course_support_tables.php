<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_change_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('old_course_enrollment_id')->nullable()->constrained('course_enrollments')->nullOnDelete();
            $table->foreignId('new_course_enrollment_id')->nullable()->constrained('course_enrollments')->nullOnDelete();
            $table->foreignId('old_course_version_mapping_id')->constrained('course_version_mappings')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('new_course_version_mapping_id')->constrained('course_version_mappings')->cascadeOnUpdate()->restrictOnDelete();
            $table->string('old_registration_number');
            $table->string('new_registration_number');
            $table->foreignId('old_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('new_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('changed_at')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('login_account_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('course_change_log_id')->nullable()->constrained('course_change_logs')->nullOnDelete();
            $table->string('login_id')->nullable();
            $table->string('email')->nullable();
            $table->string('status', 30)->default('active');
            $table->timestamp('deactivated_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('login_account_histories');
        Schema::dropIfExists('course_change_logs');
    }
};
