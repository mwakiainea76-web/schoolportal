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
        if (! Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('email')->unique();
                $table->string('login_id')->nullable()->unique();
                $table->string('password');
                $table->boolean('is_active')->default(true);
                $table->timestamp('email_verified_at')->nullable();
                $table->rememberToken();
                $table->timestamps();
                $table->softDeletes();

                $table->index('is_active');
                $table->index('email');
            });
        }

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement('CREATE INDEX IF NOT EXISTS users_login_id_normalized_idx ON users ((LOWER(TRIM(login_id)))) WHERE login_id IS NOT NULL AND deleted_at IS NULL');
            DB::statement('CREATE INDEX IF NOT EXISTS users_email_normalized_idx ON users ((LOWER(TRIM(email)))) WHERE deleted_at IS NULL');
        }

        if (! Schema::hasTable('password_reset_tokens')) {
            Schema::create('password_reset_tokens', function (Blueprint $table) {
                $table->string('email')->primary();
                $table->string('token');

                $table->timestamp('created_at')->nullable();
            });
        }

        if (! Schema::hasTable('sessions')) {
            Schema::create('sessions', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->foreignId('user_id')->nullable()->index();
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->longText('payload');
                $table->integer('last_activity')->index();

                $table->index(['last_activity', 'user_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
