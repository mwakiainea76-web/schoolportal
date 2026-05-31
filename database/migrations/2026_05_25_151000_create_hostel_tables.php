<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hostels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->decimal('session_fee_amount', 12, 2)->default(0);
            $table->string('gender')->nullable();
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();

            $table->index(['is_active', 'name']);
        });

        Schema::create('hostel_rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hostel_id')->constrained('hostels')->cascadeOnDelete();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('floor')->nullable();
            $table->unsignedInteger('bed_count')->default(1);
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();

            $table->index(['hostel_id', 'is_active', 'name']);
        });

        Schema::create('hostel_beds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hostel_room_id')->constrained('hostel_rooms')->cascadeOnDelete();
            $table->unsignedInteger('bed_number');
            $table->string('label');
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['hostel_room_id', 'bed_number']);
            $table->index(['hostel_room_id', 'is_active', 'label']);
        });

        Schema::create('hostel_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_session_enrollment_id')
                ->constrained('academic_session_enrollments')
                ->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('academic_session_id')->constrained('academic_sessions')->cascadeOnDelete();
            $table->foreignId('hostel_id')->constrained('hostels')->cascadeOnDelete();
            $table->foreignId('hostel_room_id')->constrained('hostel_rooms')->cascadeOnDelete();
            $table->foreignId('hostel_bed_id')->constrained('hostel_beds')->cascadeOnDelete();
            $table->foreignId('student_invoice_id')->nullable()->constrained('student_invoices')->nullOnDelete();
            $table->decimal('hostel_fee_amount', 12, 2)->default(0);
            $table->date('allocated_on');
            $table->enum('status', ['active', 'vacated'])->default('active');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('staffs')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('staffs')->nullOnDelete();
            $table->timestamps();

            $table->unique(['academic_session_enrollment_id', 'academic_session_id'], 'hostel_allocations_enrollment_session_unique');
            $table->unique(['hostel_bed_id', 'academic_session_id'], 'hostel_allocations_bed_session_unique');
            $table->index(['academic_session_id', 'status', 'allocated_on']);
            $table->index(['hostel_id', 'status']);
            $table->index(['student_id', 'academic_session_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hostel_allocations');
        Schema::dropIfExists('hostel_beds');
        Schema::dropIfExists('hostel_rooms');
        Schema::dropIfExists('hostels');
    }
};
