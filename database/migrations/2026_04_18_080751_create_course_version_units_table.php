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
        Schema::create('course_version_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_version_id')
                ->constrained('course_versions')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->unsignedSmallInteger('module_taught');
            $table->foreignId('course_version_mapping_id')
                ->constrained('course_version_mappings', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('unit_id')
                ->constrained('units', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->unsignedSmallInteger('semester')->nullable();
            $table->unsignedSmallInteger('module')->nullable();
            $table->boolean('is_compulsory')->default(true);
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();

            $table->unique(['course_version_id', 'unit_id', 'module_taught'], 'course_version_units_course_version_id_unit_id_module_taught_unique');
            $table->index(['course_version_id', 'module', 'semester', 'sort_order']);
            $table->index(['course_version_mapping_id', 'module_taught', 'id']);
            $table->index('unit_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_version_units');
    }
};
