<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('academic_timetables', function (Blueprint $table) {
            $table->foreignId('academic_session_id')
                ->nullable()
                ->after('department_id')
                ->constrained('academic_sessions')
                ->nullOnDelete();

            $table->index(['academic_session_id', 'department_id'], 'academic_timetables_session_department_index');
        });

        $currentSessionId = DB::table('academic_sessions')
            ->where('is_active', true)
            ->orderByDesc('id')
            ->value('id');

        if ($currentSessionId) {
            DB::table('academic_timetables')
                ->whereNull('academic_session_id')
                ->update(['academic_session_id' => $currentSessionId]);
        }
    }

    public function down(): void
    {
        Schema::table('academic_timetables', function (Blueprint $table) {
            $table->dropIndex('academic_timetables_session_department_index');
            $table->dropConstrainedForeignId('academic_session_id');
        });
    }
};
