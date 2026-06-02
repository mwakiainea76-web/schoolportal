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
        Schema::create('certification_levels', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('exam_body_id')
                ->foreign('exam_body_id')
                ->constrained('exam_bodies', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->string('entry_grade');
            $table->unsignedSmallInteger('modules');
            $table->unsignedSmallInteger('duration_in_months');
            $table->text('description')->nullable();
            $table->string('code')->unique();
            $table->string('name')->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certification_levels');
    }
};
