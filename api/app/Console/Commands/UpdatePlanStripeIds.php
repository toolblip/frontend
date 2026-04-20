<?php

namespace App\Console\Commands;

use App\Models\Plan;
use Illuminate\Console\Command;

class UpdatePlanStripeIds extends Command
{
    protected $signature = 'plans:stripe-ids
        {starter-monthly : Stripe Price ID for Starter Monthly}
        {starter-yearly : Stripe Price ID for Starter Yearly}
        {ultra-monthly : Stripe Price ID for Ultra Monthly}
        {ultra-yearly : Stripe Price ID for Ultra Yearly}
        {max-monthly : Stripe Price ID for Max Monthly}
        {max-yearly : Stripe Price ID for Max Yearly}';

    protected $description = 'Update Stripe Price IDs on all plan records';

    public function handle(): int
    {
        $mapping = [
            'starter_monthly' => $this->argument('starter-monthly'),
            'starter_yearly'  => $this->argument('starter-yearly'),
            'ultra_monthly'   => $this->argument('ultra-monthly'),
            'ultra_yearly'    => $this->argument('ultra-yearly'),
            'max_monthly'     => $this->argument('max-monthly'),
            'max_yearly'      => $this->argument('max-yearly'),
        ];

        $updated = 0;
        foreach ($mapping as $stripeIdField => $stripePriceId) {
            $plan = Plan::where('stripe_id', $stripeIdField)->first();
            if ($plan) {
                $plan->stripe_id = $stripePriceId;
                $plan->save();
                $this->info("Updated {$stripeIdField} → {$stripePriceId}");
                $updated++;
            } else {
                $this->warn("Plan with stripe_id '{$stripeIdField}' not found, skipping.");
            }
        }

        $this->info("Done. {$updated}/6 plans updated.");
        return 0;
    }
}
