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
        if (! Schema::hasTable('program_enrollments')) {
            Schema::create('program_enrollments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_id')
                    ->constrained('students', 'id')
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();
                $table->foreignId('program_version_mapping_id')
                    ->constrained('program_version_mappings', 'id')
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();
                $table->softDeletes();
                $table->timestamps();

                $table->index(['student_id', 'id']);
                $table->index('program_version_mapping_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_enrollments');
    }
};
