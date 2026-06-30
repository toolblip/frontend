"use client";

import Link from "next/link";
import React from "react";
import {
  PricingBillingToggle,
  PricingPlanCard,
  buildPricingPlanFeatures,
  sortPricingPlans,
} from "@/components/v2/PricingSection";
import type { Subscription, Plan, BillingCycle } from "./types";
import { FreePlanCard } from "./FreePlanCard";

interface BillingSectionProps {
  subscription: Subscription | null;
  subscriptionError: boolean;
  checkSubscription: () => Promise<void>;
  planEndDate: string | null;
  planScheduledToCancel: boolean;
  tierName: string | null;
  loadingPortal: boolean;
  portalError: string | null;
  openCustomerPortal: () => Promise<void>;
  cancellingSubscription: boolean;
  cancelSubscriptionError: string | null;
  handleCancelSubscription: () => Promise<void>;
  switchMode: boolean;
  setSwitchMode: (v: boolean) => void;
  switchPlanTier: string | null;
  setSwitchPlanTier: (v: string | null) => void;
  switchBilling: BillingCycle;
  setSwitchBilling: (v: BillingCycle) => void;
  switchingPlan: boolean;
  switchError: string | null;
  switchSuccess: string | null;
  handleSwitchPlan: (planTier: string, billing: BillingCycle) => Promise<void>;
  pricingPlans: Plan[];
}

function StorageIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const STATUS_LABELS: Record<string, string> = {
  paid: "Paid",
  open: "Open",
  uncollectible: "Uncollectible",
  void: "Void",
  draft: "Draft",
};

const STATUS_COLORS: Record<string, string> = {
  paid: "text-emerald-600 dark:text-emerald-400",
  open: "text-amber-600 dark:text-amber-400",
  uncollectible: "text-red-600 dark:text-red-400",
  void: "text-gray-400 dark:text-gray-500",
  draft: "text-gray-500 dark:text-gray-400",
};

const cardClasses =
  "mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/80";

export function BillingSection({
  subscription,
  subscriptionError,
  checkSubscription,
  planEndDate,
  planScheduledToCancel,
  tierName,
  loadingPortal,
  portalError,
  openCustomerPortal,
  cancellingSubscription,
  cancelSubscriptionError,
  handleCancelSubscription,
  switchMode,
  setSwitchMode,
  switchPlanTier,
  setSwitchPlanTier,
  switchBilling,
  setSwitchBilling,
  switchingPlan,
  switchError,
  switchSuccess,
  handleSwitchPlan,
  pricingPlans,
}: BillingSectionProps) {
  const orderedPlans = sortPricingPlans(pricingPlans);

  return (
    <section className={cardClasses}>
      <div className="px-6 py-6 lg:px-8 lg:py-8">
        {/* Red breadcrumb label — matches DashboardHeader */}
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
          Subscription
        </p>

        {subscription === null && subscriptionError ? (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-900/50 dark:bg-amber-950/30">
            <p className="font-medium text-amber-800 dark:text-amber-200">
              Billing status unavailable
            </p>
            <p className="mt-1 text-amber-700 dark:text-amber-300">
              We couldn&apos;t load your plan right now.
            </p>
            <button
              type="button"
              onClick={checkSubscription}
              data-testid="subscription-retry"
              className="cursor-pointer mt-3 rounded-full border border-amber-300 px-4 py-1.5 text-xs font-medium text-amber-800 transition hover:bg-amber-100 dark:border-amber-800 dark:text-amber-200 dark:hover:bg-amber-900/40"
            >
              Retry
            </button>
          </div>
        ) : subscription === null ? (
          <div className="mt-5 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-gray-400 animate-pulse" />
            <span className="text-gray-500">Checking subscription...</span>
          </div>
        ) : subscription.is_pro ? (
          <>
            {/* Header row: big bold title + inline badges — matches DashboardHeader */}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                {tierName} plan active
              </h1>
              {planScheduledToCancel && (
                <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                  Cancelling
                </span>
              )}
            </div>

            {/* Subtitle row — matches DashboardHeader layout */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-base leading-7 text-gray-600 dark:text-gray-300">
                {(subscription.storage_gb ?? 0) > 0 ? `${subscription.storage_gb}GB storage` : ""}
                {(subscription.storage_gb ?? 0) > 0 && (subscription.team_seats ?? 0) > 0 ? " · " : ""}
                {(subscription.team_seats ?? 0) > 0 ? `${subscription.team_seats} team seat${subscription.team_seats !== 1 ? "s" : ""}` : ""}
                {(subscription.storage_gb ?? 0) > 0 || (subscription.team_seats ?? 0) > 0 ? " · " : ""}
                Max {(subscription.max_file_size_mb ?? 0) >= 1000 ? `${(subscription.max_file_size_mb ?? 0) / 1000}GB` : `${subscription.max_file_size_mb ?? 0}MB`} file
              </p>
            </div>

            {/* Renew / cancellation banner */}
            {planScheduledToCancel ? (
              <div
                data-testid="cancellation-scheduled"
                className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200"
              >
                <p className="font-medium">Cancellation scheduled</p>
                <p className="mt-1">
                  {planEndDate
                    ? `You'll keep ${tierName ?? "your"} plan access until ${planEndDate}.`
                    : `You'll keep ${tierName ?? "your"} plan access until the end of your billing period.`}
                </p>
              </div>
            ) : (
              planEndDate && (
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Renews on {planEndDate}
                </p>
              )
            )}

            {/* Action pills row */}
            {portalError && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400">{portalError}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={openCustomerPortal}
                disabled={loadingPortal}
                className="cursor-pointer rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                {loadingPortal ? "Opening..." : "Manage Billing"}
              </button>
              <button
                type="button"
                onClick={() => setSwitchMode(!switchMode)}
                className="cursor-pointer rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                {switchMode ? "Hide plan options" : "Change Plan"}
              </button>
              {!planScheduledToCancel && (
                <button
                  type="button"
                  onClick={handleCancelSubscription}
                  disabled={cancellingSubscription}
                  data-testid="cancel-plan"
                  className="cursor-pointer text-sm font-medium text-gray-500 underline underline-offset-4 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-red-400"
                >
                  {cancellingSubscription ? "Cancelling..." : "Cancel plan"}
                </button>
              )}
            </div>
            {cancelSubscriptionError && (
              <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
                {cancelSubscriptionError}
              </p>
            )}
            {!planScheduledToCancel && (
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Cancellation isn&apos;t immediate - you keep access until the end of your billing period.
              </p>
            )}

            {/* Plan switching UI */}
            <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-800">
              {switchSuccess && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
                  {switchSuccess}
                </div>
              )}
              {switchError && (
                <p role="alert" className="mb-4 text-sm text-red-600 dark:text-red-400">
                  {switchError}
                </p>
              )}
              {switchMode && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <PricingBillingToggle
                      billing={switchBilling}
                      onBillingChange={setSwitchBilling}
                      accent="red"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {orderedPlans
                      .filter((p) => p.tier !== "free")
                      .map((plan) => {
                        const isCurrentPlan = subscription?.tier === plan.tier;
                        const priceId =
                          switchBilling === "yearly"
                            ? plan.stripe_yearly_id
                            : plan.stripe_monthly_id;
                        return (
                          <PricingPlanCard
                            key={plan.tier}
                            plan={{
                              tier: plan.tier,
                              name: plan.tier === "ultra" ? "Pro" : plan.name,
                              description: null,
                              priceMonthly: plan.price_monthly,
                              priceYearly: plan.price_yearly,
                              badge: plan.tier === "ultra" ? "Most Popular" : null,
                            }}
                            billing={switchBilling}
                            highlighted={plan.tier === "ultra"}
                            selected={switchPlanTier === plan.tier}
                            accent="red"
                            onClick={() =>
                              setSwitchPlanTier(
                                switchPlanTier === plan.tier ? null : plan.tier,
                              )
                            }
                            footer={
                              isCurrentPlan ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                  Current plan
                                </span>
                              ) : switchPlanTier === plan.tier ? (
                                <button
                                  type="button"
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    handleSwitchPlan(plan.tier, switchBilling);
                                  }}
                                  disabled={switchingPlan || !priceId}
                                  className={`tb-v2-btn tb-v2-pricing-btn selected tb-v2-btn-primary ${switchingPlan ? "opacity-50" : ""}`}
                                >
                                  {switchingPlan
                                    ? "Switching..."
                                    : priceId
                                      ? `Switch to ${switchBilling === "yearly" ? "Yearly" : "Monthly"}`
                                      : "Not available"}
                                </button>
                              ) : null
                            }
                          >
                            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                              {isCurrentPlan ? "Your plan" : "Switch to this plan"}
                            </div>
                            <ul className="tb-v2-pricing-features">
                              {buildPricingPlanFeatures(plan).map((feature) => (
                                <li
                                  key={feature.label}
                                  className={
                                    feature.included === false
                                      ? "text-[color:var(--fg-3)] line-through"
                                      : ""
                                  }
                                >
                                  <span className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center text-[11px] font-bold leading-none text-red-500">
                                    {feature.included === false ? "\u00d7" : "\u2713"}
                                  </span>
                                  {feature.label}
                                </li>
                              ))}
                            </ul>
                          </PricingPlanCard>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Free plan */
          <div className="mt-5">
            <FreePlanCard ctaLabel="View plans" ctaHref="/pricing" />
          </div>
        )}
      </div>
    </section>
  );
}
