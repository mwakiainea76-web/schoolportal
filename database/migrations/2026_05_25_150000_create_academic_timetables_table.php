<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academic_timetables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')
                ->constrained('departments', 'id')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignId('academic_session_id')
                ->nullable()
                ->constrained('academic_sessions')
                ->nullOnDelete();
            $table->foreignId('curriculum_unit_id')
                ->constrained('units', 'id')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignId('trainer_staff_id')
                ->constrained('staffs', 'id')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignId('lecture_room_id')
                ->nullable()
                ->constrained('lecture_rooms', 'id')
                ->nullOnDelete()
                ->cascadeOnUpdate();
            $table->string('day_of_week', 20);
            $table->time('start_time');
            $table->time('end_time');
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('staffs', 'id')
                ->nullOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('staffs', 'id')
                ->nullOnDelete()
                ->cascadeOnUpdate();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['academic_session_id', 'department_id'], 'academic_timetables_session_department_index');
            $table->index(['department_id', 'day_of_week']);
            $table->index(['trainer_staff_id', 'day_of_week', 'start_time']);
            $table->index(['curriculum_unit_id', 'day_of_week', 'start_time']);
            $table->index(['lecture_room_id', 'day_of_week', 'start_time']);
        });

        Schema::create('academic_timetable_curriculum_unit', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_timetable_id')
                ->constrained('academic_timetables', 'id')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignId('curriculum_unit_id')
                ->constrained('units', 'id')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['academic_timetable_id', 'curriculum_unit_id'], 'academic_timetable_unit_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academic_timetable_curriculum_unit');
        Schema::dropIfExists('academic_timetables');
    }
};
