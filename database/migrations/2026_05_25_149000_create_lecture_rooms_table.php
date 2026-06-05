<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lecture_rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')
                ->constrained('departments', 'id')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->string('name')->index();
            $table->string('code')->unique();
            $table->unsignedInteger('capacity')->nullable();
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lecture_rooms');
    }
};
