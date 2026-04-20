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
use Illuminate\Support\Facades\URL;

class SubscriptionController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('stripe.secret_key'));
    }

    public function createCheckoutSession(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'plan' => ['required', 'in:monthly,yearly'],
            'success_url' => ['nullable', 'url'],
            'cancel_url' => ['nullable', 'url'],
        ]);

        /** @var User $user */
        $user = Auth::user();

        if ($user->isSubscribed()) {
            return response()->json(['error' => 'Already subscribed'], 400);
        }

        $priceId = $validated['plan'] === 'yearly'
            ? config('stripe.yearly_price_id')
            : config('stripe.monthly_price_id');

        if (!$priceId) {
            return response()->json(['error' => 'Price not configured'], 500);
        }

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

        $baseUrl = config('app.url');
        $successUrl = $validated['success_url']
            ?? ($baseUrl . '/account?session_id={CHECKOUT_SESSION_ID}');
        $cancelUrl = $validated['cancel_url']
            ?? ($baseUrl . '/pricing?cancelled=1');

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
                'metadata' => ['user_id' => $user->id],
            ],
            'metadata' => [
                'user_id' => $user->id,
                'plan' => $validated['plan'],
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

        return response()->json([
            'is_pro' => $user->isSubscribed(),
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
                if ($userId && $session->subscription) {
                    $this->activateSubscription($userId, $session->subscription);
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

    private function activateSubscription(int $userId, string $subscriptionId): void
    {
        $user = User::find($userId);
        if (!$user) {
            Log::warning("Stripe webhook: user {$userId} not found");
            return;
        }

        $subscription = Subscription::retrieve($subscriptionId);
        $planEnd = now()->addSeconds($subscription->items->data[0]->price->recurring->interval === 'year' ? 365 * 86400 : 30 * 86400);

        $user->update([
            'is_pro' => true,
            'subscription_id' => $subscriptionId,
            'subscription_status' => $subscription->status,
            'plan_ends_at' => $planEnd,
        ]);

        Log::info("Activated pro plan for user {$userId}");
    }

    private function updateSubscription(object $subscription): void
    {
        $user = User::where('subscription_id', $subscription->id)->first();
        if (!$user) {
            return;
        }

        $interval = $subscription->items->data[0]->price->recurring->interval ?? 'month';
        $planEnd = $interval === 'year'
            ? now()->addYear()
            : now()->addMonth();

        $user->update([
            'subscription_status' => $subscription->status,
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
