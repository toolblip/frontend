<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Customer;
use Stripe\Subscription;
use Stripe\Exception\SignatureVerificationException;

class SubscriptionController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('stripe.secret_key'));
    }

    public function createCheckoutSession(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'price_id' => ['required', 'string'],
            'success_url' => ['nullable', 'url'],
            'cancel_url' => ['nullable', 'url'],
        ]);

        $priceId = $validated['price_id'];
        $priceConfig = config("stripe.prices.{$priceId}");

        if (!$priceConfig) {
            return response()->json(['error' => 'Invalid price ID'], 400);
        }

        /** @var User $user */
        $user = Auth::user();

        if ($user->isSubscribed()) {
            return response()->json(['error' => 'Already subscribed. Manage in your account.'], 400);
        }

        $baseUrl = config('app.url');
        $successUrl = $validated['success_url']
            ?? ($baseUrl . '/account?session_id={CHECKOUT_SESSION_ID}');
        $cancelUrl = $validated['cancel_url']
            ?? ($baseUrl . '/pricing?cancelled=1');

        // Create or retrieve Stripe customer
        $customerId = $user->stripe_customer_id;
        if (!$customerId) {
            $customer = Customer::create([
                'email' => $user->email,
                'name' => $user->name,
                'metadata' => ['user_id' => $user->id],
            ]);
            $customerId = $customer->id;
            $user->update(['stripe_customer_id' => $customerId]);
        }

        $session = StripeSession::create([
            'customer' => $customerId,
            'payment_method_types' => ['card'],
            'line_items' => [
                [
                    'price' => $priceId,
                    'quantity' => 1,
                ],
            ],
            'mode' => 'subscription',
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
            'subscription_data' => [
                'metadata' => [
                    'user_id' => $user->id,
                    'price_id' => $priceId,
                ],
            ],
            'metadata' => [
                'user_id' => $user->id,
                'price_id' => $priceId,
            ],
        ]);

        return response()->json(['url' => $session->url]);
    }

    public function customerPortal(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        if (!$user->stripe_customer_id) {
            return response()->json(['error' => 'No billing account found'], 400);
        }

        $returnUrl = config('app.url') . '/account';

        try {
            $session = \Stripe\BillingPortal\Session::create([
                'customer' => $user->stripe_customer_id,
                'return_url' => $returnUrl,
            ]);
            return response()->json(['url' => $session->url]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getSubscription(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $tierConfig = null;
        if ($user->subscription_id) {
            // Look up the price_id from subscription metadata
            try {
                $subscription = \Stripe\Subscription::retrieve($user->subscription_id);
                $priceId = $subscription->items->data[0]->price->id ?? null;
                if ($priceId) {
                    $tierConfig = config("stripe.tiers.{$priceId}");
                }
            } catch (\Exception $e) {
                // ignore
            }
        }

        return response()->json([
            'is_pro' => $user->isSubscribed(),
            'tier' => $tierConfig['tier'] ?? $user->subscription_tier ?? null,
            'devices' => $tierConfig['devices'] ?? null,
            'storage_gb' => $tierConfig['storage_gb'] ?? null,
            'team_seats' => $tierConfig['team_seats'] ?? null,
            'max_file_size_mb' => $tierConfig['max_file_size_mb'] ?? null,
            'api_access' => $tierConfig['api_access'] ?? false,
            'priority_support' => $tierConfig['priority_support'] ?? false,
            'plan_ends_at' => $user->plan_ends_at?->toIso8601String(),
            'subscription_status' => $user->subscription_status,
        ]);
    }

    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = config('stripe.webhook_secret');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sigHeader,
                $endpointSecret
            );
        } catch (SignatureVerificationException $e) {
            Log::error('Stripe webhook signature verification failed', [
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        switch ($event->type) {
            case 'checkout.session.completed': {
                $session = $event->data->object;
                $userId = $session->metadata['user_id'] ?? null;
                $priceId = $session->metadata['price_id'] ?? null;
                if ($userId && $session->subscription) {
                    $this->activateSubscription($userId, $session->subscription, $priceId);
                }
                break;
            }

            case 'customer.subscription.updated': {
                $subscription = $event->data->object;
                $this->updateSubscription($subscription);
                break;
            }

            case 'customer.subscription.deleted': {
                $subscription = $event->data->object;
                $this->cancelSubscription($subscription);
                break;
            }

            case 'invoice.payment_failed': {
                $invoice = $event->data->object;
                $this->handlePaymentFailure($invoice);
                break;
            }
        }

        return response()->json(['received' => true]);
    }

    private function activateSubscription(int $userId, string $subscriptionId, ?string $priceId): void
    {
        $user = User::find($userId);
        if (!$user) {
            Log::warning("Stripe webhook: user {$userId} not found");
            return;
        }

        $subscription = \Stripe\Subscription::retrieve($subscriptionId);
        $priceId = $priceId ?: ($subscription->items->data[0]->price->id ?? null);

        $tierConfig = $priceId ? config("stripe.tiers.{$priceId}") : null;

        $interval = $subscription->items->data[0]->price->recurring->interval ?? 'month';
        $planEnd = $interval === 'year'
            ? now()->addYear()
            : now()->addMonth();

        $user->update([
            'is_pro' => true,
            'subscription_id' => $subscriptionId,
            'subscription_status' => $subscription->status,
            'subscription_tier' => $tierConfig['tier'] ?? 'pro',
            'plan_ends_at' => $planEnd,
        ]);

        Log::info("Activated {$tierConfig['tier']} plan for user {$userId} via price {$priceId}");
    }

    private function updateSubscription(object $subscription): void
    {
        $user = User::where('subscription_id', $subscription->id)->first();
        if (!$user) {
            return;
        }

        $priceId = $subscription->items->data[0]->price->id ?? null;
        $tierConfig = $priceId ? config("stripe.tiers.{$priceId}") : null;

        $interval = $subscription->items->data[0]->price->recurring->interval ?? 'month';
        $planEnd = $interval === 'year' ? now()->addYear() : now()->addMonth();

        $user->update([
            'subscription_status' => $subscription->status,
            'subscription_tier' => $tierConfig['tier'] ?? $user->subscription_tier,
            'plan_ends_at' => $planEnd,
            'is_pro' => in_array($subscription->status, ['active', 'trialing']),
        ]);
    }

    private function cancelSubscription(object $subscription): void
    {
        $user = User::where('subscription_id', $subscription->id)->first();
        if (!$user) {
            return;
        }

        $user->update([
            'is_pro' => false,
            'subscription_status' => 'cancelled',
            'subscription_tier' => null,
            'plan_ends_at' => null,
        ]);

        Log::info("Cancelled subscription for user {$user->id}");
    }

    private function handlePaymentFailure(object $invoice): void
    {
        $user = User::where('stripe_customer_id', $invoice->customer)->first();
        if (!$user) {
            return;
        }

        $user->update(['subscription_status' => 'past_due']);
    }
}