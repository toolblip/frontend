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

interface Invoice {
  id: string;
  number: string | null;
  amount_due: number;
  amount_paid: number;
  currency: string;
  status: string;
  created: number;
  invoice_pdf: string | null;
  hosted_invoice_url: string | null;
  period_start: number;
  period_end: number;
}

function FeaturePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
      {children}
    </span>
  );
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

const cardClasses =
  "mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/80";

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
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

  // Invoices state
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [invoicesLoading, setInvoicesLoading] = React.useState(false);
  const [invoicesError, setInvoicesError] = React.useState(false);

  React.useEffect(() => {
    if (!subscription) return;
    let cancelled = false;
    async function loadInvoices() {
      setInvoicesLoading(true);
      setInvoicesError(false);
      try {
        const res = await fetch("/api/subscription/invoices", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load invoices");
        const data = await res.json();
        if (cancelled) return;
        setInvoices(data.invoices ?? []);
      } catch {
        if (!cancelled) setInvoicesError(true);
      } finally {
        if (!cancelled) setInvoicesLoading(false);
      }
    }
    loadInvoices();
    return () => { cancelled = true; };
  }, [subscription]);

  const renderFeaturePills = () => {
    if (!subscription) return null;
    const pills: React.ReactNode[] = [];
    if ((subscription.storage_gb ?? 0) > 0) {
      pills.push(
        <FeaturePill key="storage">
          <StorageIcon />
          {subscription.storage_gb}GB storage
        </FeaturePill>,
      );
    }
    if ((subscription.max_file_size_mb ?? 0) > 0) {
      const mb = subscription.max_file_size_mb as number;
      pills.push(
        <FeaturePill key="file">
          <FileIcon />
          Max {mb >= 1000 ? `${mb / 1000}GB` : `${mb}MB`} file
        </FeaturePill>,
      );
    }
    if ((subscription.team_seats ?? 0) > 0) {
      pills.push(
        <FeaturePill key="seats">
          <UsersIcon />
          {subscription.team_seats} team seat{subscription.team_seats !== 1 ? "s" : ""}
        </FeaturePill>,
      );
    }
    return pills.length > 0 ? (
      <div className="flex flex-wrap gap-2">{pills}</div>
    ) : null;
  };

  return (
    <div className={cardClasses}>
      <div className="px-6 py-6 lg:px-8 lg:py-8">
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
          <div className="mt-5 space-y-5">
            {/* Status */}
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

            {/* Feature pills */}
            {renderFeaturePills()}

            {/* Action buttons */}
            {portalError && (
              <p className="text-sm text-red-600 dark:text-red-400">{portalError}</p>
            )}
            <div className="flex flex-wrap items-center gap-3">
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
            </div>

            {/* Cancel plan */}
            {!planScheduledToCancel && (
              <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
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
            <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
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
          /* Free plan */
          <div className="mt-5">
            <FreePlanCard ctaLabel="View plans" ctaHref="/pricing" />
          </div>
        )}

        {/* Invoices section (only show for Pro users) */}
        {subscription?.is_pro && (
          <div className="mt-8 border-t border-gray-100 pt-6 dark:border-gray-800">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Invoices
            </h3>

            {invoicesLoading ? (
              <p className="mt-3 text-sm text-gray-500">Loading invoices...</p>
            ) : invoicesError ? (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                Could not load invoices.
              </p>
            ) : invoices.length === 0 ? (
              <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
                No invoices yet.
              </p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {invoices.map((inv) => (
                      <tr
                        key={inv.id}
                        className="transition hover:bg-gray-50 dark:hover:bg-gray-900/50"
                      >
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {formatDate(inv.created)}
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">
                          {formatCurrency(inv.amount_paid > 0 ? inv.amount_paid : inv.amount_due, inv.currency)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${STATUS_COLORS[inv.status] ?? "text-gray-500"}`}>
                            {STATUS_LABELS[inv.status] ?? inv.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {inv.invoice_pdf ? (
                            <a
                              href={inv.invoice_pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-white"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              PDF
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
