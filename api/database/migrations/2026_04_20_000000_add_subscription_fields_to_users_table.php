<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_pro')->default(false)->after('password');
            $table->string('stripe_customer_id')->nullable()->after('is_pro');
            $table->string('subscription_id')->nullable()->after('stripe_customer_id');
            $table->string('subscription_status')->nullable()->after('subscription_id');
            $table->timestamp('plan_ends_at')->nullable()->after('subscription_status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'is_pro',
                'stripe_customer_id',
                'subscription_id',
                'subscription_status',
                'plan_ends_at',
            ]);
        });
    }
};
