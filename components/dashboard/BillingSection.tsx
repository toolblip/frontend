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
    <div
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
      id="billing"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Subscription
      </h2>

      {subscription === null && subscriptionError ? (
        <div
          data-testid="subscription-error"
          className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-900/50 dark:bg-amber-950/30"
        >
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
        <div className="mt-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="font-medium text-red-700 dark:text-red-400">
              {tierName} plan active
            </span>
          </div>

          {planScheduledToCancel ? (
            <div
              data-testid="cancellation-scheduled"
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200"
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
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Renews on {planEndDate}
              </p>
            )
          )}

          {(subscription.storage_gb ?? 0) > 0 ||
          (subscription.max_file_size_mb ?? 0) > 0 ? (
            <div className="flex flex-wrap gap-2">
              {(subscription.storage_gb ?? 0) > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z"
                    />
                  </svg>
                  {subscription.storage_gb}GB storage
                </span>
              )}
              {(subscription.max_file_size_mb ?? 0) > 0 &&
                (() => {
                  const mb = subscription.max_file_size_mb as number;
                  return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Max {mb >= 1000 ? `${mb / 1000}GB` : `${mb}MB`} file
                    </span>
                  );
                })()}
              {(subscription.team_seats ?? 0) > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {subscription.team_seats} team seat
                  {subscription.team_seats !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          ) : null}

          {portalError && (
            <p className="text-sm text-red-600 dark:text-red-400">{portalError}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={openCustomerPortal}
              disabled={loadingPortal}
              className="cursor-pointer rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              {loadingPortal ? "Opening..." : "Manage Billing"}
            </button>
            <Link
              href="/pricing"
              data-testid="dashboard-change-plan"
              className="cursor-pointer rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
            >
              Upgrade or change plan
            </Link>
          </div>

          <div className="mt-5">
            <FreePlanCard ctaLabel="Downgrade to Free" onCtaClick={openCustomerPortal} />
          </div>

          {!planScheduledToCancel && (
            <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
              {cancelSubscriptionError && (
                <p role="alert" className="mb-3 text-sm text-red-600 dark:text-red-400">
                  {cancelSubscriptionError}
                </p>
              )}
              <button
                type="button"
                onClick={handleCancelSubscription}
                disabled={cancellingSubscription}
                data-testid="cancel-plan"
                className="cursor-pointer text-sm font-medium text-gray-500 underline underline-offset-4 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-red-400"
              >
                {cancellingSubscription ? "Cancelling..." : "Cancel plan"}
              </button>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Cancellation isn&apos;t immediate - you keep access until the end of
                your billing period.
              </p>
            </div>
          )}

          {/* Plan switching UI */}
          <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-800">
            <button
              type="button"
              onClick={() => {
                setSwitchMode(!switchMode);
              }}
              className="cursor-pointer inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition hover:text-red-600 dark:text-white dark:hover:text-red-400"
            >
              <svg
                className={`h-4 w-4 transition-transform ${switchMode ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              {switchMode ? "Hide plan options" : "Change plan"}
            </button>

            {switchSuccess && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
                {switchSuccess}
              </div>
            )}

            {switchError && (
              <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
                {switchError}
              </p>
            )}

            {switchMode && (
              <div className="mt-4 space-y-4">
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
                            {isCurrentPlan
                              ? "Your plan"
                              : "Switch to this plan"}
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
        </div>
      ) : (
        <div className="mt-5">
          <FreePlanCard ctaLabel="View plans" ctaHref="/pricing" />
        </div>
      )}
    </div>
  );
}
