<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('course_enrollments')) {
            return;
        }

        if (! Schema::hasTable('academic_session_enrollments')) {
            Schema::create('academic_session_enrollments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('course_enrollment_id')
                    ->constrained('course_enrollments', 'id')
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();
                $table->foreignId('academic_session_id')
                    ->constrained('academic_sessions', 'id')
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();
                $table->unsignedInteger('module')->default(1);
                $table->enum('status', [
                    'active',
                    'completed',
                    'dropped',
                    'transferred',
                    'suspended',
                ])->default('active');
                $table->softDeletes();
                $table->timestamps();

                $table->unique(
                    ['course_enrollment_id', 'academic_session_id'],
                    'academic_session_enrollments_unique_session'
                );
            });
        }

        if (
            Schema::hasColumn('course_enrollments', 'academic_session_id') &&
            Schema::hasColumn('course_enrollments', 'module') &&
            Schema::hasColumn('course_enrollments', 'status')
        ) {
            $legacyEnrollments = DB::table('course_enrollments')
                ->select([
                    'id',
                    'academic_session_id',
                    'module',
                    'status',
                    'created_at',
                    'updated_at',
                    'deleted_at',
                ])
                ->whereNotNull('academic_session_id')
                ->get();

            foreach ($legacyEnrollments as $enrollment) {
                DB::table('academic_session_enrollments')->updateOrInsert(
                    [
                        'course_enrollment_id' => $enrollment->id,
                        'academic_session_id' => $enrollment->academic_session_id,
                    ],
                    [
                        'module' => $enrollment->module ?? 1,
                        'status' => $enrollment->status ?? 'active',
                        'created_at' => $enrollment->created_at ?? now(),
                        'updated_at' => $enrollment->updated_at ?? now(),
                        'deleted_at' => $enrollment->deleted_at,
                    ]
                );
            }

            Schema::table('course_enrollments', function (Blueprint $table) {
                $table->dropConstrainedForeignId('academic_session_id');
            });

            Schema::table('course_enrollments', function (Blueprint $table) {
                $table->dropColumn(['module', 'status']);
            });
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('course_enrollments')) {
            return;
        }

        if (! Schema::hasColumn('course_enrollments', 'academic_session_id')) {
            Schema::table('course_enrollments', function (Blueprint $table) {
                $table->foreignId('academic_session_id')
                    ->nullable()
                    ->constrained('academic_sessions', 'id')
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();
                $table->unsignedInteger('module')->default(1);
                $table->enum('status', [
                    'active',
                    'completed',
                    'dropped',
                    'transferred',
                    'suspended',
                ])->default('active');
            });
        }
    }
};
