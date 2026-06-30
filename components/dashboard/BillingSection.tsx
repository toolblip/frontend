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
  switchBilling: BillingCycle;
  setSwitchBilling: (v: BillingCycle) => void;
  switchingPlan: boolean;
  switchError: string | null;
  switchSuccess: string | null;
  handleSwitchPlan: (planTier: string, billing: BillingCycle) => Promise<void>;
  pricingPlans: Plan[];
}

const cardClasses =
  "mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/80";

function CancelConfirmDialog({
  open,
  onConfirm,
  onCancel,
  cancelling,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  cancelling: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cancel plan?</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Cancellation isn&apos;t immediate &mdash; you keep access until the end of your billing period.
          After that, your plan will be downgraded to Free and you&apos;ll lose Pro features.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={cancelling}
            className="cursor-pointer rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Keep my plan
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={cancelling}
            className="cursor-pointer rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {cancelling ? "Cancelling..." : "Yes, cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Figure out which plans are upgrades vs downgrades for the current tier. */
function planTypeFromTier(currentTier: string | null | undefined, targetTier: string): "upgrade" | "downgrade" | "same" {
  const order = ["free", "starter", "ultra", "max"];
  const current = order.indexOf(currentTier ?? "free");
  const target = order.indexOf(targetTier);
  if (target === current) return "same";
  return target > current ? "upgrade" : "downgrade";
}

function PlanSwitchModal({
  open,
  onClose,
  subscription,
  orderedPlans,
  switchBilling,
  setSwitchBilling,
  switchingPlan,
  switchError,
  switchSuccess,
  handleSwitchPlan,
}: {
  open: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  orderedPlans: Plan[];
  switchBilling: BillingCycle;
  setSwitchBilling: (v: BillingCycle) => void;
  switchingPlan: boolean;
  switchError: string | null;
  switchSuccess: string | null;
  handleSwitchPlan: (planTier: string, billing: BillingCycle) => Promise<void>;
}) {
  if (!open) return null;

  const currentTier = subscription?.tier;

  // Close modal on successful switch
  React.useEffect(() => {
    if (switchSuccess) {
      const timer = setTimeout(onClose, 1800);
      return () => clearTimeout(timer);
    }
  }, [switchSuccess, onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 pointer-events-none" />
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-10 pb-10 sm:pt-20 pointer-events-none">
        <div className="mx-4 w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900 sm:p-8 pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            {subscription?.is_pro ? "Change your plan" : "Choose your plan"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Billing toggle */}
        <div className="mt-5 flex items-center gap-2">
          <PricingBillingToggle billing={switchBilling} onBillingChange={setSwitchBilling} accent="red" />
        </div>

        {/* Messages */}
        {switchSuccess && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
            {switchSuccess}
          </div>
        )}
        {switchError && (
          <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">{switchError}</p>
        )}

        {/* Plan cards */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orderedPlans
            .filter((p) => p.tier !== "free")
            .map((plan) => {
              const isCurrentPlan = subscription?.tier === plan.tier;
              const priceId = switchBilling === "yearly" ? plan.stripe_yearly_id : plan.stripe_monthly_id;
              const changeType = planTypeFromTier(currentTier, plan.tier);

              let ctaLabel: string;
              if (isCurrentPlan) {
                ctaLabel = "Current plan";
              } else if (subscription?.is_pro && changeType === "upgrade") {
                ctaLabel = "Upgrade";
              } else if (subscription?.is_pro && changeType === "downgrade") {
                ctaLabel = "Downgrade";
              } else {
                ctaLabel = `Switch to ${switchBilling === "yearly" ? "Yearly" : "Monthly"}`;
              }

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
                  accent="red"
                  footer={
                    isCurrentPlan ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                        Current plan
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleSwitchPlan(plan.tier, switchBilling); }}
                        disabled={switchingPlan || !priceId}
                        className={
                          "w-full cursor-pointer rounded-full px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 " +
                          (changeType === "upgrade" && subscription?.is_pro
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200")
                        }
                      >
                        {switchingPlan ? "Processing..." : !priceId ? "Not available" : ctaLabel}
                      </button>
                    )
                  }
                >
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                    {isCurrentPlan ? "Your plan" : changeType === "upgrade" && subscription?.is_pro ? "Upgrade to" : "Switch to"}
                  </div>
                  <ul className="tb-v2-pricing-features">
                    {buildPricingPlanFeatures(plan).map((feature) => (
                      <li key={feature.label} className={feature.included === false ? "text-[color:var(--fg-3)] line-through" : ""}>
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

        {/* Cancel action inside modal */}
        {subscription?.is_pro && (
          <div className="mt-6 border-t border-gray-100 pt-5 text-center dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-sm font-medium text-gray-500 underline underline-offset-4 transition hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              Need to cancel? Go back and click &ldquo;Cancel plan&rdquo;
            </button>
          </div>
        )}

        {/* Close button at bottom */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-sm text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    </>
  );
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
  switchBilling,
  setSwitchBilling,
  switchingPlan,
  switchError,
  switchSuccess,
  handleSwitchPlan,
  pricingPlans,
}: BillingSectionProps) {
  const orderedPlans = sortPricingPlans(pricingPlans);
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);
  const [showPlanModal, setShowPlanModal] = React.useState(false);

  // Determine if current plan can be upgraded
  const currentTier = subscription?.tier;
  const tierOrder = ["free", "starter", "ultra", "max"];
  const currentIdx = tierOrder.indexOf(currentTier ?? "free");
  const isUpgradable = currentIdx < tierOrder.length - 1 && currentTier !== "free";

  function closePlanModal() { setShowPlanModal(false); }

  return (
    <section className={cardClasses}>
      <div className="px-6 py-6 lg:px-8 lg:py-8">
        {/* Red breadcrumb label */}
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
          Subscription
        </p>

        {subscription === null && subscriptionError ? (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-900/50 dark:bg-amber-950/30">
            <p className="font-medium text-amber-800 dark:text-amber-200">Billing status unavailable</p>
            <p className="mt-1 text-amber-700 dark:text-amber-300">We couldn&apos;t load your plan right now.</p>
            <button type="button" onClick={checkSubscription} data-testid="subscription-retry"
              className="cursor-pointer mt-3 rounded-full border border-amber-300 px-4 py-1.5 text-xs font-medium text-amber-800 transition hover:bg-amber-100 dark:border-amber-800 dark:text-amber-200 dark:hover:bg-amber-900/40"
            >Retry</button>
          </div>
        ) : subscription === null ? (
          <div className="mt-5 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-gray-400 animate-pulse" />
            <span className="text-gray-500">Checking subscription...</span>
          </div>
        ) : subscription.is_pro ? (
          <>
            {/* Header row */}
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

            {/* Subtitle row */}
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
              <div data-testid="cancellation-scheduled"
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
              planEndDate && <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Renews on {planEndDate}</p>
            )}

            {/* Action buttons */}
            {portalError && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{portalError}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPlanModal(true)}
                className={
                  "cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 " +
                  (isUpgradable
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800")
                }
              >
                {isUpgradable ? "Upgrade Plan" : "Switch Plan"}
              </button>
              {!planScheduledToCancel && (
                <button type="button" onClick={() => setShowCancelConfirm(true)}
                  disabled={cancellingSubscription}
                  data-testid="cancel-plan"
                  className="cursor-pointer text-sm font-medium text-gray-500 underline underline-offset-4 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-red-400"
                >
                  {cancellingSubscription ? "Cancelling..." : "Cancel plan"}
                </button>
              )}
              <button onClick={openCustomerPortal} disabled={loadingPortal}
                className="cursor-pointer rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                {loadingPortal ? "Opening..." : "Manage Billing"}
              </button>
            </div>
            {cancelSubscriptionError && (
              <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{cancelSubscriptionError}</p>
            )}

            {/* Cancel confirmation dialog */}
            <CancelConfirmDialog
              open={showCancelConfirm}
              onConfirm={() => {
                setShowCancelConfirm(false);
                handleCancelSubscription();
              }}
              onCancel={() => setShowCancelConfirm(false)}
              cancelling={cancellingSubscription}
            />

            {/* Plan switch modal */}
            <PlanSwitchModal
              open={showPlanModal}
              onClose={closePlanModal}
              subscription={subscription}
              orderedPlans={orderedPlans}
              switchBilling={switchBilling}
              setSwitchBilling={setSwitchBilling}
              switchingPlan={switchingPlan}
              switchError={switchError}
              switchSuccess={switchSuccess}
              handleSwitchPlan={handleSwitchPlan}
            />
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
