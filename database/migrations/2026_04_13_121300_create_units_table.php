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
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('name')->index();
            $table->unsignedSmallInteger('credit_factor');
            $table->unsignedSmallInteger('training_hours');
            $table->string('description')->nullable();
            $table->foreignId('curriculum_mapping_id')
                ->constrained('curriculum_mappings')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->unsignedSmallInteger('module_taught')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['curriculum_mapping_id', 'code'], 'units_mapping_code_unique');
            $table->unique(['curriculum_mapping_id', 'module_taught', 'code'], 'units_mapping_module_taught_code_unique');

            $table->index(['curriculum_mapping_id', 'module_taught'], 'units_mapping_module_taught_index');
            $table->index(['curriculum_mapping_id', 'module_taught', 'id'], 'units_mapping_module_taught_id_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
