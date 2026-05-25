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
            $table->string('designation')->nullable();
            $table->string('staff_number')->unique();
            $table->string('national_id_number')->nullable()->unique();
            $table->unsignedInteger('salary')->default(0);
            $table->date('hired_date');
            $table->string('employment_type');
            $table->string('highest_qualification')->nullable();
            $table->string('specialization')->nullable();
            $table->string('kra_pin')->nullable();
            $table->string('nhif_number')->nullable();
            $table->string('nssf_number')->nullable();
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
        Schema::dropIfExists('staffs');
    }
};
