<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('stripe_id')->unique(); // e.g. STRIPE_STARTER_MONTHLY_PRICE_ID value
            $table->string('tier'); // starter | ultra | max
            $table->string('billing'); // monthly | yearly
            $table->string('name'); // Starter | Ultra | Max
            $table->decimal('price_monthly', 6, 2);
            $table->decimal('price_yearly', 8, 2);
            $table->text('description')->nullable();
            $table->integer('devices')->default(1);
            $table->integer('storage_gb')->default(0);
            $table->integer('max_file_size_mb')->default(0);
            $table->integer('team_seats')->default(0);
            $table->boolean('api_access')->default(false);
            $table->boolean('priority_support')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
