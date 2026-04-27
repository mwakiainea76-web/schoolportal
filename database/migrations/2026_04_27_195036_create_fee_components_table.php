<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('fee_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fee_template_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('name');
            $table->string('type');
            $table->decimal('amount', 12, 2);
            $table->enum('frequency', ['admission', 'always', 'session', 'year'])->default('session');
            $table->boolean('is_optional')->default(false);
            $table->integer('sort_order')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fee_components');
    }
};
