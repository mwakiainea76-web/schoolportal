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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users', 'id')
                ->cascadeOnDelete();
            
            // Identity Fields
            $table->string('first_name');
            $table->string('last_name');
            $table->string('other_name')->nullable();
            $table->string('phone_number');
            $table->date('date_of_birth');
            $table->string('email')->nullable()->unique();
            $table->string('county');
            $table->text('address');
            $table->string('gender');
            $table->string('profile_photo')->nullable();
            $table->string('religion');
            $table->boolean('is_pwd')->default(false);
            $table->string('disability_type')->nullable();
            $table->string('medical_condition')->nullable();

            // Academic Fields
            $table->string('admission_number')->unique();
            $table->string('current_module')->default('1');
            $table->string('previous_school')->nullable();
            $table->decimal('fee_discount_percentage', 5, 2)->default(0);
            $table->enum('enrollment_status', [
                'active',
                'deferred',
                'expelled',
                'graduated',
            ])->default('active');

            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('enrollment_status');
            $table->index('first_name');
            $table->index('last_name');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
