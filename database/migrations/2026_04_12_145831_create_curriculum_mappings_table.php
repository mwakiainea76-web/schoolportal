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
        Schema::create('curriculum_mappings', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->foreignId('course_id')
                ->constrained('courses', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('curriculum_id')
                ->constrained('curricula', 'id')
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

            $table->index('course_id');
            $table->index('curriculum_id');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curriculum_mappings');
    }
};
