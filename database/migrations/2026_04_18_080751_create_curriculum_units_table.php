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
        Schema::create('curriculum_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('curriculum_id')
                ->constrained('curricula')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->unsignedSmallInteger('module_taught');
            $table->foreignId('curriculum_mapping_id')
                ->constrained('curriculum_mappings', 'id')
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

            $table->unique(['curriculum_id', 'unit_id', 'module_taught'], 'curriculum_units_curriculum_id_unit_id_module_taught_unique');
            $table->index(['curriculum_id', 'module', 'semester', 'sort_order']);
            $table->index(['curriculum_mapping_id', 'module_taught', 'id']);
            $table->index('unit_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curriculum_units');
    }
};
