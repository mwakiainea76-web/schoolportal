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
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->string('registration_number')->unique();
            $table->string('previous_school');
            $table->decimal('fee_discount_percentage', 5, 2)->default(0);
            $table->string('current_module')->default(1);
            $table->date('admission_date');
            $table->enum('student_status', [
                'active',
                'suspended',
                'graduated',
                'dropped',
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
        Schema::dropIfExists('students');
    }
};
