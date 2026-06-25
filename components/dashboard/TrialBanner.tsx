"use client";

import React from "react";

interface TrialBannerProps {
  trialEndsToday: boolean;
  trialDaysRemaining: number;
  tierName: string | null;
  trialEndsAt: Date | null;
  loadingPortal: boolean;
  openCustomerPortal: () => void;
  dismissTrialBanner: () => void;
}

export function TrialBanner({
  trialEndsToday,
  trialDaysRemaining,
  tierName,
  trialEndsAt,
  loadingPortal,
  openCustomerPortal,
  dismissTrialBanner,
}: TrialBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="trial-banner"
      className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100"
    >
      <div>
        <p className="font-semibold">
          {trialEndsToday
            ? "Your free trial ends today."
            : trialDaysRemaining === 1
              ? "1 day left in your free trial."
              : `${trialDaysRemaining} days left in your free trial.`}
        </p>
        <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">
          Add a payment method to keep your {tierName ?? "plan"} after the trial ends
          {trialEndsAt
            ? ` on ${trialEndsAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
            : ""}
          .
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          data-testid="trial-banner-cta"
          onClick={openCustomerPortal}
          disabled={loadingPortal}
          className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingPortal ? "Opening..." : "Add payment method"}
        </button>
        <button
          type="button"
          data-testid="trial-banner-dismiss"
          onClick={dismissTrialBanner}
          aria-label="Dismiss trial banner"
          className="rounded-lg px-2 py-2 text-amber-800 transition-colors hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-amber-900/40"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  );
}
