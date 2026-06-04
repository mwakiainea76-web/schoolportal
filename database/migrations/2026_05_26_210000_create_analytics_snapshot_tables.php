<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->createMetricTable('daily_student_metrics');
        $this->createMetricTable('daily_finance_metrics');
        $this->createMetricTable('daily_hostel_metrics');
        $this->createMetricTable('daily_academic_metrics');
        $this->createMetricTable('session_registration_metrics');
        $this->createMetricTable('data_quality_metrics');
    }

    public function down(): void
    {
        Schema::dropIfExists('data_quality_metrics');
        Schema::dropIfExists('session_registration_metrics');
        Schema::dropIfExists('daily_academic_metrics');
        Schema::dropIfExists('daily_hostel_metrics');
        Schema::dropIfExists('daily_finance_metrics');
        Schema::dropIfExists('daily_student_metrics');
    }

    protected function createMetricTable(string $tableName): void
    {
        Schema::create($tableName, function (Blueprint $table) use ($tableName) {
            $table->id();
            $table->date('metric_date');
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete();
            $table->foreignId('academic_session_id')->nullable()->constrained('academic_sessions')->nullOnDelete();
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->foreignId('course_id')->nullable()->constrained('courses')->nullOnDelete();
            $table->foreignId('course_version_id')->nullable()->constrained('course_versions')->nullOnDelete();
            $table->string('metric_key');
            $table->decimal('metric_value', 20, 4)->default(0);
            $table->timestamp('snapshot_generated_at');
            $table->timestamps();

            $table->index(['metric_date', 'metric_key']);
            $table->unique(
                [
                    'metric_date',
                    'academic_year_id',
                    'academic_session_id',
                    'department_id',
                    'course_id',
                    'course_version_id',
                    'metric_key',
                ],
                $tableName.'_metric_unique'
            );
        });
    }
};
