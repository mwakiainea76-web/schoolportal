<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Map existing 'pending' to 'available'
        DB::statement("UPDATE student_credits SET status = 'available' WHERE status = 'pending'");

        // Drop the old column
        Schema::table('student_credits', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        // Add the new column with updated enum
        Schema::table('student_credits', function (Blueprint $table) {
            $table->enum('status', ['available', 'applied'])->default('available');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the new column
        Schema::table('student_credits', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        // Add back the old column
        Schema::table('student_credits', function (Blueprint $table) {
            $table->enum('status', ['pending', 'applied'])->default('pending');
        });
    }
};
