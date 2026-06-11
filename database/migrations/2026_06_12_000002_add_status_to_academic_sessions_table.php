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
        Schema::table('academic_sessions', function (Blueprint $table) {
            if (! Schema::hasColumn('academic_sessions', 'status')) {
                $table->string('status', 30)->default('upcoming')->index()->after('end_date');
            }
        });

        DB::table('academic_sessions')
            ->whereNull('status')
            ->orWhere('status', '')
            ->update(['status' => 'upcoming']);

        DB::statement("
            UPDATE academic_sessions
            SET status = CASE
                WHEN is_active = true THEN 'ongoing'
                WHEN end_date IS NOT NULL AND end_date <= CURRENT_DATE THEN 'completed'
                ELSE 'upcoming'
            END
            WHERE status = 'upcoming'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('academic_sessions', function (Blueprint $table) {
            if (Schema::hasColumn('academic_sessions', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
