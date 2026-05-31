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
        Schema::create('program_version_units', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('module_taught');
            $table->foreignId('program_version_mapping_id')
                ->constrained('program_version_mappings', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('unit_id')
                ->constrained('units', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->timestamps();

            $table->index(['program_version_mapping_id', 'module_taught', 'id']);
            $table->index('unit_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_version_units');
    }
};
