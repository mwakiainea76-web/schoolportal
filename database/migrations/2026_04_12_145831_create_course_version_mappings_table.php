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
        Schema::create('course_version_mappings', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->foreignId('course_id')
                ->constrained('courses', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('course_version_id')
                ->constrained('course_versions', 'id')
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_version_mappings');
    }
};
