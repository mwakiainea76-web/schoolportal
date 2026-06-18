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
        Schema::create('curricula', function (Blueprint $table) {
            $table->id();

            $table->foreignId('exam_body_id')
                ->nullable()
                ->constrained('exam_bodies')
                ->nullOnDelete()
                ->cascadeOnUpdate();
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

        if (! Schema::hasTable('exam_bodies') || ! Schema::hasTable('users')) {
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

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curricula');
    }
};
