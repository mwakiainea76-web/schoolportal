<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();

            $table->string('code')->unique();
            $table->string('name')->index();
            $table->text('description')->nullable();
            $table->string('initials');
            $table->unsignedSmallInteger('duration_in_months');
            $table->foreignId('certification_level_id')
                ->constrained('certification_levels', 'id')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('department_id')
                ->constrained('departments', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
