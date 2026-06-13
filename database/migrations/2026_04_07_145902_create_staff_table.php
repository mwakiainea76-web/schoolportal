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
                ->cascadeOnDelete();
            $table->foreignId('department_id')
                ->constrained('departments', 'id')
                ->cascadeOnDelete();

            // Identity Fields
            $table->string('first_name');
            $table->string('email')->nullable()->unique();
            $table->string('last_name');
            $table->string('other_name')->nullable();
            $table->string('phone_number');
            $table->date('date_of_birth');
            $table->string('county');
            $table->text('address');
            $table->string('gender');
            $table->string('profile_photo')->nullable();
            $table->string('religion');
            $table->boolean('is_pwd')->default(false);
            $table->string('disability_type')->nullable();
            $table->string('medical_condition')->nullable();

            // Employment Fields
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

            $table->index('user_id');
            $table->index('department_id');
            $table->index('staff_status');
            $table->index('first_name');
            $table->index('last_name');
            $table->index('hired_date');
        });

        Schema::table('departments', function (Blueprint $table) {
            $table->foreign('hod_staff_id')
                ->references('id')
                ->on('staffs')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropForeign(['hod_staff_id']);
        });

        Schema::dropIfExists('staffs');
    }
};
