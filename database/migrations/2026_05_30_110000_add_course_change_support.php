<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('program_enrollments', function (Blueprint $table) {
            if (! Schema::hasColumn('program_enrollments', 'status')) {
                $table->string('status', 30)->default('active')->after('program_version_mapping_id');
            }

            if (! Schema::hasColumn('program_enrollments', 'transferred_at')) {
                $table->timestamp('transferred_at')->nullable()->after('status');
            }

            if (! Schema::hasColumn('program_enrollments', 'transferred_by')) {
                $table->foreignId('transferred_by')->nullable()->after('transferred_at')->constrained('users')->nullOnDelete();
            }
        });

        Schema::create('course_change_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('old_program_enrollment_id')->nullable()->constrained('program_enrollments')->nullOnDelete();
            $table->foreignId('new_program_enrollment_id')->nullable()->constrained('program_enrollments')->nullOnDelete();
            $table->foreignId('old_program_version_mapping_id')->constrained('program_version_mappings')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('new_program_version_mapping_id')->constrained('program_version_mappings')->cascadeOnUpdate()->restrictOnDelete();
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
            $table->foreignId('deactivated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->json('context')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('login_account_histories');
        Schema::dropIfExists('course_change_logs');

        Schema::table('program_enrollments', function (Blueprint $table) {
            if (Schema::hasColumn('program_enrollments', 'transferred_by')) {
                $table->dropConstrainedForeignId('transferred_by');
            }

            if (Schema::hasColumn('program_enrollments', 'transferred_at')) {
                $table->dropColumn('transferred_at');
            }

            if (Schema::hasColumn('program_enrollments', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
