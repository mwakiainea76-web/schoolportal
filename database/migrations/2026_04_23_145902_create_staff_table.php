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
        Schema::create('staffs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('department_id')
                ->constrained('departments', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->string('staff_number')->unique();
            $table->unsignedInteger('salary')->default(0);
            $table->date('hired_date');
            $table->string('employment_type');
            $table->enum('staff_status', [
                'active',
                'suspended',
                'onleave',
                'exited',
            ])->default('active');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};
