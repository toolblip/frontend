<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            // Starter
            [
                'stripe_id' => env('STRIPE_STARTER_MONTHLY_PRICE_ID', 'starter_monthly'),
                'tier' => 'starter',
                'billing' => 'monthly',
                'name' => 'Starter',
                'price_monthly' => 4.99,
                'price_yearly' => 49.99,
                'description' => 'For power users who want more.',
                'devices' => 2,
                'storage_gb' => 1,
                'max_file_size_mb' => 10,
                'team_seats' => 0,
                'api_access' => false,
                'priority_support' => false,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'stripe_id' => env('STRIPE_STARTER_YEARLY_PRICE_ID', 'starter_yearly'),
                'tier' => 'starter',
                'billing' => 'yearly',
                'name' => 'Starter',
                'price_monthly' => 4.99,
                'price_yearly' => 49.99,
                'description' => 'For power users who want more.',
                'devices' => 2,
                'storage_gb' => 1,
                'max_file_size_mb' => 10,
                'team_seats' => 0,
                'api_access' => false,
                'priority_support' => false,
                'is_active' => true,
                'sort_order' => 1,
            ],
            // Ultra
            [
                'stripe_id' => env('STRIPE_ULTRA_MONTHLY_PRICE_ID', 'ultra_monthly'),
                'tier' => 'ultra',
                'billing' => 'monthly',
                'name' => 'Ultra',
                'price_monthly' => 19.99,
                'price_yearly' => 199.99,
                'description' => 'Most popular for individuals.',
                'devices' => 5,
                'storage_gb' => 10,
                'max_file_size_mb' => 100,
                'team_seats' => 3,
                'api_access' => false,
                'priority_support' => false,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'stripe_id' => env('STRIPE_ULTRA_YEARLY_PRICE_ID', 'ultra_yearly'),
                'tier' => 'ultra',
                'billing' => 'yearly',
                'name' => 'Ultra',
                'price_monthly' => 19.99,
                'price_yearly' => 199.99,
                'description' => 'Most popular for individuals.',
                'devices' => 5,
                'storage_gb' => 10,
                'max_file_size_mb' => 100,
                'team_seats' => 3,
                'api_access' => false,
                'priority_support' => false,
                'is_active' => true,
                'sort_order' => 2,
            ],
            // Max
            [
                'stripe_id' => env('STRIPE_MAX_MONTHLY_PRICE_ID', 'max_monthly'),
                'tier' => 'max',
                'billing' => 'monthly',
                'name' => 'Max',
                'price_monthly' => 49.99,
                'price_yearly' => 499.99,
                'description' => 'For teams and power users.',
                'devices' => 10,
                'storage_gb' => 50,
                'max_file_size_mb' => 500,
                'team_seats' => 10,
                'api_access' => true,
                'priority_support' => true,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'stripe_id' => env('STRIPE_MAX_YEARLY_PRICE_ID', 'max_yearly'),
                'tier' => 'max',
                'billing' => 'yearly',
                'name' => 'Max',
                'price_monthly' => 49.99,
                'price_yearly' => 499.99,
                'description' => 'For teams and power users.',
                'devices' => 10,
                'storage_gb' => 50,
                'max_file_size_mb' => 500,
                'team_seats' => 10,
                'api_access' => true,
                'priority_support' => true,
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(
                ['stripe_id' => $plan['stripe_id']],
                $plan
            );
        }
    }
}
