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
        Schema::create('fee_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('plan_type', ['original', 'revised'])->default('original');
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->string('version');
            $table->boolean('is_active')->default(false);
            $table->foreignId('created_by')
                ->constrained('users', 'id')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->softDeletes();
            $table->timestamps();
            $table->unique('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fee_plans');
    }
};
