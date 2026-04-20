<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\JsonResponse;

class PlanController extends Controller
{
    /**
     * GET /api/plans — returns all active plans grouped by tier.
     * Frontend uses this to render the pricing page dynamically.
     */
    public function index(): JsonResponse
    {
        $plans = Plan::active()->get();

        // Group by tier
        $tiers = $plans->groupBy('tier')->map(function ($tierPlans) {
            $monthly = $tierPlans->firstWhere('billing', 'monthly');
            $yearly = $tierPlans->firstWhere('billing', 'yearly');
            $base = $monthly ?? $yearly;

            return [
                'tier' => $base->tier,
                'name' => $base->name,
                'description' => $base->description,
                'price_monthly' => (float) $base->price_monthly,
                'price_yearly' => (float) ($yearly?->price_yearly ?? $base->price_yearly),
                'stripe_monthly_id' => $monthly?->stripe_id,
                'stripe_yearly_id' => $yearly?->stripe_id,
                'devices' => $base->devices,
                'storage_gb' => $base->storage_gb,
                'max_file_size_mb' => $base->max_file_size_mb,
                'team_seats' => $base->team_seats,
                'api_access' => $base->api_access,
                'priority_support' => $base->priority_support,
                'sort_order' => $base->sort_order,
            ];
        })->values();

        // Prepend free tier (no DB row needed — it's always $0)
        $free = [
            'tier' => 'free',
            'name' => 'Free',
            'description' => 'Get started with the basics.',
            'price_monthly' => 0,
            'price_yearly' => 0,
            'stripe_monthly_id' => null,
            'stripe_yearly_id' => null,
            'devices' => 1,
            'storage_gb' => 0,
            'max_file_size_mb' => 0,
            'team_seats' => 0,
            'api_access' => false,
            'priority_support' => false,
            'sort_order' => 0,
        ];

        return response()->json([
            'plans' => collect([$free])->merge($tiers)->values(),
        ]);
    }
}
