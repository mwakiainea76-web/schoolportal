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
        Schema::create('program_versions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->foreignId('created_by')
                ->constrained('users', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users', 'id')
                ->cascadeOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });

        DB::statement('
            CREATE UNIQUE INDEX program_versions_single_active_idx
            ON program_versions (is_active)
            WHERE is_active = true AND deleted_at IS NULL
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS program_versions_single_active_idx');
        Schema::dropIfExists('program_versions');
    }
};
