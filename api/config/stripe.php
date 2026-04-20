<?php

return [
    'secret_key' => env('STRIPE_SECRET_KEY'),
    'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),

    // Price IDs — create these in Stripe Dashboard
    'prices' => [
        // Starter
        'starter_monthly' => env('STRIPE_STARTER_MONTHLY_PRICE_ID'),
        'starter_yearly' => env('STRIPE_STARTER_YEARLY_PRICE_ID'),
        // Ultra
        'ultra_monthly' => env('STRIPE_ULTRA_MONTHLY_PRICE_ID'),
        'ultra_yearly' => env('STRIPE_ULTRA_YEARLY_PRICE_ID'),
        // Max
        'max_monthly' => env('STRIPE_MAX_MONTHLY_PRICE_ID'),
        'max_yearly' => env('STRIPE_MAX_YEARLY_PRICE_ID'),
    ],

    // Feature limits per price tier
    'tiers' => [
        'starter_monthly' => ['tier' => 'starter', 'billing' => 'monthly', 'devices' => 2, 'storage_gb' => 1, 'max_file_size_mb' => 10],
        'starter_yearly' => ['tier' => 'starter', 'billing' => 'yearly', 'devices' => 2, 'storage_gb' => 1, 'max_file_size_mb' => 10],
        'ultra_monthly' => ['tier' => 'ultra', 'billing' => 'monthly', 'devices' => 5, 'storage_gb' => 10, 'team_seats' => 3, 'max_file_size_mb' => 100],
        'ultra_yearly' => ['tier' => 'ultra', 'billing' => 'yearly', 'devices' => 5, 'storage_gb' => 10, 'team_seats' => 3, 'max_file_size_mb' => 100],
        'max_monthly' => ['tier' => 'max', 'billing' => 'monthly', 'devices' => 10, 'storage_gb' => 50, 'team_seats' => 10, 'api_access' => true, 'priority_support' => true, 'max_file_size_mb' => 500],
        'max_yearly' => ['tier' => 'max', 'billing' => 'yearly', 'devices' => 10, 'storage_gb' => 50, 'team_seats' => 10, 'api_access' => true, 'priority_support' => true, 'max_file_size_mb' => 500],
    ],
];