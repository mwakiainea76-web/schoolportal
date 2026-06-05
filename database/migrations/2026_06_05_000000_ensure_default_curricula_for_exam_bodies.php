<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('exam_bodies') || ! Schema::hasTable('curricula') || ! Schema::hasTable('users')) {
            return;
        }

        $userId = DB::table('users')->orderBy('id')->value('id');

        if (! $userId) {
            return;
        }

        DB::table('exam_bodies')
            ->orderBy('id')
            ->get(['id', 'code', 'name'])
            ->each(function ($examBody) use ($userId) {
                $name = trim($examBody->code.' Default');

                if ($name === '' || DB::table('curricula')->where('name', $name)->exists()) {
                    return;
                }

                DB::table('curricula')->insert([
                    'course_id' => null,
                    'exam_body_id' => $examBody->id,
                    'name' => $name,
                    'is_active' => true,
                    'description' => 'Default curriculum for '.$examBody->name,
                    'start_date' => now()->toDateString(),
                    'end_date' => null,
                    'created_by' => $userId,
                    'updated_by' => $userId,
                    'deleted_at' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            });
    }

    public function down(): void
    {
        //
    }
};
