<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('course_curriculum', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->foreignId('course_id')
                ->constrained('courses', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('curriculum_id')
                ->constrained('curriculum', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('created_by')
                ->constrained('users', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->timestamps();
            $table->softDeletes();
        });

        DB::statement('
            CREATE UNIQUE INDEX course_curriculum_one_active_per_course_idx
            ON course_curriculum (course_id)
            WHERE is_active = true AND deleted_at IS NULL
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS course_curriculum_one_active_per_course_idx');
        Schema::dropIfExists('course_curriculum');
    }
};
