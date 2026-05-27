<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('login_id')->nullable()->after('email');
        });

        DB::statement('
            UPDATE users
            SET login_id = TRIM(staffs.staff_number)
            FROM staffs
            WHERE staffs.user_id = users.id
              AND users.deleted_at IS NULL
              AND staffs.deleted_at IS NULL
        ');

        DB::statement('
            UPDATE users
            SET login_id = TRIM(students.registration_number)
            FROM students
            WHERE students.user_id = users.id
              AND users.deleted_at IS NULL
              AND students.deleted_at IS NULL
        ');

        Schema::table('users', function (Blueprint $table) {
            $table->unique('login_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['login_id']);
            $table->dropColumn('login_id');
        });
    }
};
