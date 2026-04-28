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
        Schema::create('fee_models', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fee_template_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('curricula_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('academic_session_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('department_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();
            $table->enum('scope', ['global', 'department', 'curriculum'])->default('global');
            $table->enum('priority', ['60', '70', '80'])->default('60');
            $table->date('valid_from');
            $table->date('valid_until');
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fee_models');
    }
};
