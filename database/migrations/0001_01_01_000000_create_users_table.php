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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('other_name')->nullable();
            $table->string('phone_number');
            $table->date('date_of_birth');
            $table->string('county');
            $table->text('address');
            $table->string('gender');
            $table->string('profile_photo')->nullable();
            $table->string('religion');
            $table->string('email');
            $table->boolean('is_pwd')->default(false);
            $table->string('disability_type')->nullable();
            $table->string('medical_condition')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });

        // Ensure unique index on users.email (safe and idempotent)
        if (config('database.default') === 'pgsql') {
            DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email)');
        } elseif (config('database.default') === 'mysql') {
            try {
                DB::statement('ALTER TABLE users ADD UNIQUE users_email_unique (email)');
            } catch (\Exception $e) {
                // ignore if already exists
            }
        }

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
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
