"use client";

import React from "react";
import {
  PricingBillingToggle,
  PricingPlanCard,
  buildPricingPlanFeatures,
  sortPricingPlans,
} from "@/components/v2/PricingSection";
import type { Plan, BillingCycle, OnboardingPlanTier, OnboardingStep } from "./types";

const ONBOARDING_PLAN_LABELS: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  ultra: "Pro",
  max: "Max",
};

interface PlanOnboardingProps {
  onboardingStep: OnboardingStep;
  teamName: string;
  setTeamName: (v: string) => void;
  selectedOnboardingPlan: OnboardingPlanTier | null;
  setSelectedOnboardingPlan: (v: OnboardingPlanTier | null) => void;
  onboardingBilling: BillingCycle;
  setOnboardingBilling: (v: BillingCycle) => void;
  savingPlanOnboarding: boolean;
  planOnboardingError: string;
  handleNextPlanOnboarding: () => Promise<void>;
  handleStartTrial: (planTier: string, billing: BillingCycle) => Promise<void>;
  handlePaidPlanCheckout: (planTier: string, billing: BillingCycle) => Promise<void>;
  completePlanOnboarding: (planTier: OnboardingPlanTier | null, billing: BillingCycle) => void;
  writePlanOnboarding: (
    status: string,
    step: string,
    selectedPlan: OnboardingPlanTier | null,
    billingCycle: BillingCycle,
    teamNameValue?: string,
  ) => boolean;
  checkoutLoading: string | null;
  trialCheckoutLoading: string | null;
  orderedPlans: Plan[];
}

export function PlanOnboarding({
  onboardingStep,
  teamName,
  setTeamName,
  selectedOnboardingPlan,
  onboardingBilling,
  setOnboardingBilling,
  savingPlanOnboarding,
  planOnboardingError,
  handleNextPlanOnboarding,
  handleStartTrial,
  handlePaidPlanCheckout,
  completePlanOnboarding,
  writePlanOnboarding,
  checkoutLoading,
  trialCheckoutLoading,
  orderedPlans,
}: PlanOnboardingProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-onboarding-title"
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-red-200 bg-gradient-to-br from-red-50 via-white to-gray-50 p-5 shadow-2xl dark:border-red-900/50 dark:from-red-950/30 dark:via-gray-900 dark:to-gray-950"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
              Welcome to Toolblip
            </p>
            {onboardingStep === "welcome" ? (
              <div>
                <h2
                  id="plan-onboarding-title"
                  className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl"
                >
                  Set up your workspace
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 sm:text-sm">
                  Name your team to get started.
                </p>
              </div>
            ) : null}
            <div className="inline-flex items-center rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-700 shadow-sm dark:border-red-900/60 dark:bg-gray-900 dark:text-red-300">
              {onboardingStep === "welcome" ? "Step 1 of 2" : "Step 2 of 2"}
            </div>
            {planOnboardingError && (
              <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                {planOnboardingError}
              </p>
            )}
          </div>
        </div>

        {onboardingStep === "welcome" ? (
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <label
                htmlFor="team-name"
                className="block text-sm font-semibold text-gray-900 dark:text-white"
              >
                Team name
              </label>
              <input
                id="team-name"
                type="text"
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
                className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                placeholder="Toolblip Team"
                required
              />
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                This will prefill your workspace name. You can change it later in
                your account settings.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-950/60">
              <p className="font-semibold text-gray-900 dark:text-white">
                Setup checklist
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                <li>• Name your team</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="rounded-[32px] border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/90 sm:p-6">
              <div className="space-y-2">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                  Pricing
                </div>
                <h3 className="text-xl font-bold leading-tight text-gray-900 dark:text-white sm:text-2xl">
                  Simple, transparent pricing
                </h3>
                <p className="max-w-2xl text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                  Compare the plans and pick the one that fits how you use Toolblip.
                </p>
              </div>
              <div className="mt-4">
                <PricingBillingToggle
                  billing={onboardingBilling}
                  onBillingChange={(nextBilling) => {
                    setOnboardingBilling(nextBilling);
                    writePlanOnboarding(
                      "draft",
                      "pricing",
                      selectedOnboardingPlan,
                      nextBilling,
                    );
                  }}
                  centered
                  accent="red"
                />
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              {orderedPlans
                .filter((plan) => plan.tier !== "free")
                .map((plan) => {
                  const selected = selectedOnboardingPlan === plan.tier;
                  const planTier = plan.tier as OnboardingPlanTier;
                  const displayName =
                    ONBOARDING_PLAN_LABELS[planTier] ?? plan.name;
                  const sourcePlan = orderedPlans.find(
                    (item) => item.tier === plan.tier,
                  )!;
                  const features = buildPricingPlanFeatures(sourcePlan);

                  return (
                    <PricingPlanCard
                      key={plan.tier}
                      plan={{
                        tier: plan.tier,
                        name: displayName,
                        description: null,
                        priceMonthly: plan.price_monthly,
                        priceYearly: plan.price_yearly,
                        badge: plan.tier === "ultra" ? "Most Popular" : null,
                      }}
                      billing={onboardingBilling}
                      highlighted={plan.tier === "ultra"}
                      selected={selected}
                      accent="red"
                      footer={
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleStartTrial(planTier, onboardingBilling)
                            }
                            disabled={
                              trialCheckoutLoading !== null ||
                              checkoutLoading !== null
                            }
                            className={`tb-v2-btn tb-v2-pricing-btn ${selected ? "selected" : "tb-v2-btn-primary"}`}
                          >
                            {trialCheckoutLoading === planTier
                              ? "Starting..."
                              : "Start free trial"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handlePaidPlanCheckout(planTier, onboardingBilling)
                            }
                            disabled={
                              checkoutLoading !== null ||
                              trialCheckoutLoading !== null
                            }
                            className="text-center text-xs text-[color:var(--fg-3)] underline-offset-2 hover:text-[color:var(--fg-1)] hover:underline"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "2px 0",
                            }}
                          >
                            {checkoutLoading === planTier
                              ? "Redirecting..."
                              : "Skip trial - Subscribe now"}
                          </button>
                        </div>
                      }
                    >
                      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                        Plan includes
                      </div>
                      <ul className="tb-v2-pricing-features">
                        {features.map((feature) => (
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

              {orderedPlans
                .filter((plan) => plan.tier === "free")
                .map((plan) => {
                  const selected = selectedOnboardingPlan === plan.tier;
                  const planTier = plan.tier as OnboardingPlanTier;
                  const displayName =
                    ONBOARDING_PLAN_LABELS[planTier] ?? plan.name;
                  const sourcePlan = orderedPlans.find(
                    (item) => item.tier === plan.tier,
                  )!;
                  const features = buildPricingPlanFeatures(sourcePlan);

                  return (
                    <div key={plan.tier} className="lg:col-span-3">
                      <PricingPlanCard
                        plan={{
                          tier: plan.tier,
                          name: displayName,
                          description: null,
                          priceMonthly: plan.price_monthly,
                          priceYearly: plan.price_yearly,
                          badge: null,
                        }}
                        billing={onboardingBilling}
                        tone="light"
                        className="free-row"
                        compactHeader
                        selected={selected}
                        accent="red"
                        headerRightSlot={
                          <button
                            type="button"
                            onClick={() =>
                              completePlanOnboarding(planTier, onboardingBilling)
                            }
                            className="tb-v2-pricing-inline-link"
                          >
                            Keep free plan
                          </button>
                        }
                      >
                        <ul className="tb-v2-pricing-features">
                          {features.map((feature) => (
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
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {onboardingStep === "welcome" && (
          <div className="mt-6">
            <button
              type="button"
              onClick={handleNextPlanOnboarding}
              disabled={!teamName.trim() || savingPlanOnboarding}
              className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingPlanOnboarding ? "Saving..." : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
