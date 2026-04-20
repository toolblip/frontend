<?php

return [
    'secret_key' => env('STRIPE_SECRET_KEY'),
    'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    'monthly_price_id' => env('STRIPE_MONTHLY_PRICE_ID'),
    'yearly_price_id' => env('STRIPE_YEARLY_PRICE_ID'),
];
