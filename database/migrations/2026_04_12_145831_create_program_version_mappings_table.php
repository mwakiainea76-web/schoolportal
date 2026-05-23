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
        Schema::create('program_version_mappings', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->foreignId('program_id')
                ->constrained('programs', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('program_version_id')
                ->constrained('program_versions', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('created_by')
                ->constrained('users', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users', 'id')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->timestamps();
            $table->softDeletes();
        });

        DB::statement('
            CREATE UNIQUE INDEX program_version_mappings_one_active_per_program_idx
            ON program_version_mappings (program_id)
            WHERE is_active = true AND deleted_at IS NULL
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS program_version_mappings_one_active_per_program_idx');
        Schema::dropIfExists('program_version_mappings');
    }
};
