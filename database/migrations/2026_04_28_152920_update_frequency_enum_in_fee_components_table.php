<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Map existing values to new ones
        DB::statement("UPDATE fee_components SET frequency = 'recurring' WHERE frequency IN ('always', 'session', 'year')");

        // Drop the old column
        Schema::table('fee_components', function (Blueprint $table) {
            $table->dropColumn('frequency');
        });

        // Add the new column with updated enum
        Schema::table('fee_components', function (Blueprint $table) {
            $table->enum('frequency', ['admission', 'recurring'])->default('recurring');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the new column
        Schema::table('fee_components', function (Blueprint $table) {
            $table->dropColumn('frequency');
        });

        // Add back the old column
        Schema::table('fee_components', function (Blueprint $table) {
            $table->enum('frequency', ['admission', 'always', 'session', 'year'])->default('session');
        });
    }
};
