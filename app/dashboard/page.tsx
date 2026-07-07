"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers/auth-provider";
import { useRouter } from "next/navigation";
import {
  sortPricingPlans,
  type BillingCycle,
} from "@/components/v2/PricingSection";
import { getRecentTools, type RecentTool } from "@/lib/toolHistory";
import type { FavoriteTool, Plan, OnboardingPlanTier, OnboardingStep, OnboardingStatus } from "@/components/dashboard/types";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { TrialBanner } from "@/components/dashboard/TrialBanner";
import { TabbedTools } from "@/components/dashboard/TabbedTools";
import { TermsOnboarding } from "@/components/dashboard/TermsOnboarding";
import { PlanOnboarding } from "@/components/dashboard/PlanOnboarding";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

const ONBOARDING_STORAGE_VERSION = 4;
const DEFAULT_ONBOARDING_PLAN: OnboardingPlanTier = "ultra";
const DEFAULT_ONBOARDING_BILLING: BillingCycle = "monthly";

function normalizeOnboardingPlan(plan?: string | null): OnboardingPlanTier | null {
  if (plan === "starter") return DEFAULT_ONBOARDING_PLAN;
  if (plan === "free" || plan === "ultra" || plan === "max") return plan;
  return null;
}

function suggestWorkspaceName(name?: string | null) {
  const firstWord = name?.trim().split(/\s+/).find(Boolean);
  return firstWord ? `${firstWord}'s team` : "Toolblip team";
}

const FALLBACK_PLANS: Plan[] = [
  { tier: "free", name: "Free", description: "For anyone getting started", price_monthly: 0, price_yearly: 0, stripe_monthly_id: null, stripe_yearly_id: null, storage_gb: 0, max_file_size_mb: 5, team_seats: 1, api_access: false, priority_support: false, sort_order: 0 },
  { tier: "starter", name: "Starter", description: "For personal use", price_monthly: 499, price_yearly: 4990, stripe_monthly_id: "price_1TOflqHd4AsPgGTOxspjxODX", stripe_yearly_id: "price_1TOflqHd4AsPgGTOOrxqG1kM", storage_gb: 1, max_file_size_mb: 50, team_seats: 1, api_access: false, priority_support: false, sort_order: 1 },
  { tier: "ultra", name: "Pro", description: "For power users", price_monthly: 1999, price_yearly: 19990, stripe_monthly_id: "price_1TOflrHd4AsPgGTOnt9jYhjz", stripe_yearly_id: "price_1TOflsHd4AsPgGTO5ra4mhwt", storage_gb: 10, max_file_size_mb: 500, team_seats: 3, api_access: true, priority_support: false, sort_order: 2 },
  { tier: "max", name: "Max", description: "For teams", price_monthly: 4999, price_yearly: 49990, stripe_monthly_id: "price_1TOflsHd4AsPgGTOG7jeNqLk", stripe_yearly_id: "price_1TOfltHd4AsPgGTOnUHvrbT7", storage_gb: 50, max_file_size_mb: 5000, team_seats: 10, api_access: true, priority_support: true, sort_order: 3 },
];

const ONBOARDING_PLAN_LABELS: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  ultra: "Pro",
  max: "Max",
};

function displayOnboardingPlanName(tier: string | null | undefined) {
  if (!tier) return null;
  return ONBOARDING_PLAN_LABELS[tier as OnboardingPlanTier] ?? tier.charAt(0).toUpperCase() + tier.slice(1);
}

function parseOnboardingPlanParam(plan: string | null): OnboardingPlanTier | null {
  if (plan === "free" || plan === "starter" || plan === "ultra" || plan === "max") return plan;
  return null;
}

function parseBillingCycleParam(billing: string | null): BillingCycle | null {
  if (billing === "monthly" || billing === "yearly") return billing;
  return null;
}

function onboardingStorageKey(userId: number | string) {
  return `toolblip_onboarding_${userId}`;
}

function trialBannerDismissedKey(userId: number | string) {
  return `toolblip_trial_banner_dismissed_${userId}`;
}

function checklistStorageKey(userId: number | string) {
  return `toolblip_checklist_${userId}`;
}

export default function AccountPage() {
  const { user, token, login, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const {
    subscription,
    subscriptionError,
    loadingPortal,
    openCustomerPortal,
    checkingSession,
    tierName,
    isTrialing,
    trialEndsAt,
    trialDaysRemaining,
    trialEndsToday,
  } = useSubscription();

  const [acceptedOnboardingTerms, setAcceptedOnboardingTerms] = useState(false);
  const [acceptingTerms, setAcceptingTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [showPlanOnboarding, setShowPlanOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("welcome");
  const [teamName, setTeamName] = useState("");
  const [selectedOnboardingPlan, setSelectedOnboardingPlan] = useState<OnboardingPlanTier | null>(DEFAULT_ONBOARDING_PLAN);
  const [onboardingBilling, setOnboardingBilling] = useState<BillingCycle>(DEFAULT_ONBOARDING_BILLING);
  const [savingPlanOnboarding, setSavingPlanOnboarding] = useState(false);
  const [planOnboardingError, setPlanOnboardingError] = useState("");
  const [favoriteTools, setFavoriteTools] = useState<FavoriteTool[]>([]);
  const [favoriteToolsLoading, setFavoriteToolsLoading] = useState(false);
  const [apiTeamName, setApiTeamName] = useState<string | null>(null);
  const [recentTools, setRecentTools] = useState<RecentTool[]>([]);
  const [copiedFavoriteSlug, setCopiedFavoriteSlug] = useState<string | null>(null);
  const [pricingPlans, setPricingPlans] = useState<Plan[]>(FALLBACK_PLANS);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [trialCheckoutLoading, setTrialCheckoutLoading] = useState<string | null>(null);
  const [trialBannerDismissed, setTrialBannerDismissed] = useState(false);
  const [checklistDismissed, setChecklistDismissed] = useState(false);

  // Recent tools live in localStorage
  useEffect(() => {
    setRecentTools(getRecentTools());
  }, []);

  // Fetch the actual team name from the API so dashboard header stays in sync with /dashboard/team
  useEffect(() => {
    if (!token || user?.requires_terms_acceptance) return;
    let cancelled = false;
    async function loadTeamName() {
      try {
        const res = await fetch("/api/team", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (data?.team?.name) {
          setApiTeamName(data.team.name);
        }
      } catch {
        // best-effort — fall back to onboarding/local name
      }
    }
    loadTeamName();
    return () => { cancelled = true; };
  }, [token, user?.requires_terms_acceptance]);

  // Hydrate trial banner dismissal
  useEffect(() => {
    if (!user) {
      setTrialBannerDismissed(false);
      return;
    }
    try {
      const stored = window.localStorage.getItem(trialBannerDismissedKey(user.id));
      setTrialBannerDismissed(stored === "1");
    } catch {
      setTrialBannerDismissed(false);
    }
  }, [user]);

  // Hydrate onboarding checklist dismissal
  useEffect(() => {
    if (!user) {
      setChecklistDismissed(false);
      return;
    }
    try {
      const stored = window.localStorage.getItem(checklistStorageKey(user.id));
      setChecklistDismissed(stored ? Boolean(JSON.parse(stored).dismissed) : false);
    } catch {
      setChecklistDismissed(false);
    }
  }, [user]);

  // Auto-clear dismissal when subscription leaves trialing
  useEffect(() => {
    if (!user || !subscription) return;
    if (subscription.subscription_status !== "trialing") {
      setTrialBannerDismissed(false);
      try {
        window.localStorage.removeItem(trialBannerDismissedKey(user.id));
      } catch {
        // localStorage may be unavailable
      }
    }
  }, [user, subscription]);

  useEffect(() => {
    let cancelled = false;
    async function loadPricingPlans() {
      try {
        const response = await fetch(`${API_BASE}/api/plans`);
        const data = response.ok ? await response.json() : null;
        if (cancelled) return;
        if (data?.plans && Array.isArray(data.plans) && data.plans.length > 0) {
          setPricingPlans(data.plans);
          return;
        }
      } catch {
        // keep fallback plans
      }
      if (!cancelled) setPricingPlans(FALLBACK_PLANS);
    }
    loadPricingPlans();
    return () => { cancelled = true; };
  }, []);

  function redirectToLoginPreservingCurrentLocation() {
    const params = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;
    const currentNext = params.get("next");
    const nextPath =
      (currentPath === "/login" || currentPath === "/signup") && currentNext && currentNext.startsWith("/") && !currentNext.startsWith("//")
        ? currentNext
        : `${currentPath}${window.location.search}`;
    router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    async function restoreCookieSessionBeforeRedirect() {
      if (authLoading || token) return;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const res = await fetch("/api/auth/me", { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            if (data.user && data.token) {
              login(data.user, data.token);
              return;
            }
          }
        } catch {
          // retry once
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      redirectToLoginPreservingCurrentLocation();
    }
    restoreCookieSessionBeforeRedirect();
  }, [authLoading, token, login, router]);

  // Onboarding flow initialization
  useEffect(() => {
    if (!user || user.requires_terms_acceptance) {
      setShowPlanOnboarding(false);
      return;
    }

    const suggestedTeamName = suggestWorkspaceName(user.name);
    const params = new URLSearchParams(window.location.search);
    const requestedPlan = parseOnboardingPlanParam(params.get("plan"));
    const requestedBilling = parseBillingCycleParam(params.get("billing"));

    try {
      const stored = window.localStorage.getItem(onboardingStorageKey(user.id));
      if (!stored) {
        const initialSelectedPlan = requestedPlan ?? DEFAULT_ONBOARDING_PLAN;
        const initialBilling = requestedBilling ?? DEFAULT_ONBOARDING_BILLING;
        const initialPayload = {
          version: ONBOARDING_STORAGE_VERSION,
          status: "draft" as OnboardingStatus,
          step: "welcome" as OnboardingStep,
          teamName: suggestedTeamName,
          selectedPlan: initialSelectedPlan,
          billingCycle: initialBilling,
          updatedAt: new Date().toISOString(),
        };
        setTeamName(suggestedTeamName);
        setSelectedOnboardingPlan(initialSelectedPlan);
        setOnboardingBilling(initialBilling);
        setOnboardingStep("welcome");
        setShowPlanOnboarding(true);
        window.localStorage.setItem(onboardingStorageKey(user.id), JSON.stringify(initialPayload));
        return;
      }

      const parsed = JSON.parse(stored) as {
        version?: number;
        status?: OnboardingStatus;
        selectedPlan?: OnboardingPlanTier;
        step?: OnboardingStep;
        teamName?: string;
        billingCycle?: BillingCycle;
      };
      const restoredTeamName = parsed.teamName?.trim() ? parsed.teamName : suggestedTeamName;
      const restoredBilling = requestedBilling ?? parsed.billingCycle ?? DEFAULT_ONBOARDING_BILLING;
      const storedSelectedPlan = normalizeOnboardingPlan(parsed.selectedPlan);

      if (parsed.version !== ONBOARDING_STORAGE_VERSION) {
        const initialSelectedPlan = requestedPlan ?? storedSelectedPlan;
        const initialStep = parsed.step === "pricing" || (!initialSelectedPlan && parsed.status === "completed") ? "pricing" : "welcome";
        const initialPayload = {
          version: ONBOARDING_STORAGE_VERSION,
          status: "draft" as OnboardingStatus,
          step: initialStep,
          teamName: restoredTeamName,
          selectedPlan: initialSelectedPlan,
          billingCycle: restoredBilling,
          updatedAt: new Date().toISOString(),
        };
        setTeamName(initialPayload.teamName);
        setSelectedOnboardingPlan(initialSelectedPlan);
        setOnboardingBilling(initialPayload.billingCycle);
        setOnboardingStep(initialStep);
        setShowPlanOnboarding(true);
        window.localStorage.setItem(onboardingStorageKey(user.id), JSON.stringify(initialPayload));
        return;
      }

      if ((parsed.status === "completed" || parsed.status === "skipped") && !requestedPlan && !requestedBilling) {
        if (storedSelectedPlan) {
          setShowPlanOnboarding(false);
          return;
        }
        const pricingPayload = {
          version: ONBOARDING_STORAGE_VERSION,
          status: "draft" as OnboardingStatus,
          step: "pricing" as OnboardingStep,
          teamName: restoredTeamName,
          selectedPlan: null,
          billingCycle: restoredBilling,
          updatedAt: new Date().toISOString(),
        };
        setTeamName(pricingPayload.teamName);
        setSelectedOnboardingPlan(null);
        setOnboardingBilling(pricingPayload.billingCycle);
        setOnboardingStep("pricing");
        setShowPlanOnboarding(true);
        window.localStorage.setItem(onboardingStorageKey(user.id), JSON.stringify(pricingPayload));
        return;
      }

      const restoredSelectedPlan = requestedPlan ?? storedSelectedPlan;
      const restoredStep = parsed.step ?? (restoredSelectedPlan ? "pricing" : "welcome");
      const restoredPayload = {
        version: ONBOARDING_STORAGE_VERSION,
        status: parsed.status ?? "draft",
        step: restoredStep,
        teamName: restoredTeamName,
        selectedPlan: restoredSelectedPlan,
        billingCycle: restoredBilling,
        updatedAt: new Date().toISOString(),
      };
      setTeamName(restoredPayload.teamName);
      setSelectedOnboardingPlan(restoredSelectedPlan);
      setOnboardingBilling(restoredBilling);
      setOnboardingStep(restoredStep);
      setShowPlanOnboarding(true);
      window.localStorage.setItem(onboardingStorageKey(user.id), JSON.stringify(restoredPayload));
      return;
    } catch {
      setTeamName(suggestedTeamName);
      setSelectedOnboardingPlan(DEFAULT_ONBOARDING_PLAN);
      setOnboardingBilling(DEFAULT_ONBOARDING_BILLING);
      setOnboardingStep("welcome");
      setShowPlanOnboarding(true);
      return;
    }
  }, [user]);

  useEffect(() => {
    loadFavoriteTools();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadFavoriteTools() {
    if (!token) return;
    setFavoriteToolsLoading(true);
    try {
      const res = await fetch("/api/tools/favorites", { credentials: "include", headers: { Accept: "application/json" } });
      if (res.ok) {
        const data = await res.json();
        setFavoriteTools(Array.isArray(data.data) ? data.data : []);
      }
    } catch {
      // ignore
    } finally {
      setFavoriteToolsLoading(false);
    }
  }

  async function shareFavorite(slug: string) {
    const base = process.env.NEXT_PUBLIC_APP_URL || "https://toolblip.com";
    const url = `${base}/tools/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      try { document.execCommand("copy"); } catch { /* best-effort */ }
      document.body.removeChild(textarea);
    }
    setCopiedFavoriteSlug(slug);
    window.setTimeout(() => setCopiedFavoriteSlug((current) => (current === slug ? null : current)), 1500);
  }

  function dismissTrialBanner() {
    if (!user) return;
    setTrialBannerDismissed(true);
    try {
      window.localStorage.setItem(trialBannerDismissedKey(user.id), "1");
    } catch {
      // localStorage may be unavailable
    }
  }

  async function handleAcceptTerms() {
    setTermsError("");
    if (!acceptedOnboardingTerms) {
      setTermsError("Please accept the Terms and Conditions and Privacy Policy to continue.");
      return;
    }
    setAcceptingTerms(true);
    try {
      const res = await fetch("/api/auth/accept-terms", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify({ accepted_terms: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || (data.errors ? Object.values(data.errors).flat().join(", ") : "Could not accept terms."));
      if (data.user && token) login(data.user, token);
    } catch (error) {
      setTermsError(error instanceof Error ? error.message : "Could not accept terms.");
    } finally {
      setAcceptingTerms(false);
    }
  }

  async function handlePaidPlanCheckout(planTier: string, billing: BillingCycle) {
    setPlanOnboardingError("");
    setCheckoutLoading(planTier);
    try {
      const plan = pricingPlans.find((p) => p.tier === planTier);
      if (!plan) throw new Error("Plan not found");
      const priceId = billing === "yearly" ? plan.stripe_yearly_id : plan.stripe_monthly_id;
      if (!priceId) throw new Error("No Stripe price ID configured for this plan");
      const res = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify({ price_id: priceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create checkout session");
      completePlanOnboarding(planTier as OnboardingPlanTier, billing);
      window.location.href = data.url;
    } catch (error) {
      setPlanOnboardingError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setCheckoutLoading(null);
    }
  }

  async function handleStartTrial(planTier: string, billing: BillingCycle) {
    setPlanOnboardingError("");
    setTrialCheckoutLoading(planTier);
    try {
      const plan = pricingPlans.find((p) => p.tier === planTier);
      if (!plan) throw new Error("Plan not found");
      const priceId = billing === "yearly" ? plan.stripe_yearly_id : plan.stripe_monthly_id;
      if (!priceId) throw new Error("No Stripe price ID configured for this plan");
      const res = await fetch("/api/subscription/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify({ price_id: priceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start free trial");
      completePlanOnboarding(planTier as OnboardingPlanTier, billing);
      window.location.href = "/dashboard";
    } catch (error) {
      setPlanOnboardingError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setTrialCheckoutLoading(null);
    }
  }

  function writePlanOnboarding(
    status: string,
    step: string,
    selectedPlan: OnboardingPlanTier | null,
    billingCycle: BillingCycle,
    teamNameValue?: string,
  ) {
    if (!user || !selectedPlan) return false;
    window.localStorage.setItem(
      onboardingStorageKey(user.id),
      JSON.stringify({
        version: ONBOARDING_STORAGE_VERSION,
        status,
        step,
        teamName: teamNameValue ?? teamName.trim(),
        selectedPlan,
        billingCycle,
        updatedAt: new Date().toISOString(),
      })
    );
    return true;
  }

  function persistPlanOnboarding(
    status: OnboardingStatus,
    step: OnboardingStep = onboardingStep,
    selectedPlan: OnboardingPlanTier | null = selectedOnboardingPlan,
    billingCycle: BillingCycle = onboardingBilling,
    teamNameValue: string = teamName.trim(),
  ) {
    if (!writePlanOnboarding(status, step, selectedPlan, billingCycle, teamNameValue)) return false;
    setShowPlanOnboarding(false);
    return true;
  }

  function completePlanOnboarding(selectedPlan: OnboardingPlanTier | null, billingCycle: BillingCycle) {
    setSelectedOnboardingPlan(selectedPlan);
    setOnboardingBilling(billingCycle);
    setPlanOnboardingError("");
    persistPlanOnboarding("completed", "pricing", selectedPlan, billingCycle);
  }

  async function handleNextPlanOnboarding() {
    if (!user || !teamName.trim() || savingPlanOnboarding) return;
    setPlanOnboardingError("");
    setSavingPlanOnboarding(true);
    try {
      if (onboardingStep === "welcome") {
        setOnboardingStep("pricing");
        writePlanOnboarding("draft", "pricing", selectedOnboardingPlan, onboardingBilling);
        return;
      }
      completePlanOnboarding(selectedOnboardingPlan, onboardingBilling);
    } catch (error) {
      setPlanOnboardingError(error instanceof Error ? error.message : "Could not save onboarding progress.");
    } finally {
      setSavingPlanOnboarding(false);
    }
  }

  if (authLoading || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const favoriteCount = favoriteTools.length;
  const showTermsOnboarding = Boolean(user.requires_terms_acceptance);
  const orderedPlans = sortPricingPlans(pricingPlans);
  const recentToolsCount = recentTools.length;

  const showTrialBanner = isTrialing && !trialBannerDismissed && trialDaysRemaining !== null;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-16">
      {showTrialBanner && trialDaysRemaining !== null && (
        <TrialBanner
          trialEndsToday={trialEndsToday}
          trialDaysRemaining={trialDaysRemaining}
          tierName={tierName}
          trialEndsAt={trialEndsAt}
          loadingPortal={loadingPortal}
          openCustomerPortal={openCustomerPortal}
          dismissTrialBanner={dismissTrialBanner}
        />
      )}

      {showTermsOnboarding && (
        <TermsOnboarding
          acceptedOnboardingTerms={acceptedOnboardingTerms}
          setAcceptedOnboardingTerms={setAcceptedOnboardingTerms}
          termsError={termsError}
          acceptingTerms={acceptingTerms}
          handleAcceptTerms={handleAcceptTerms}
        />
      )}

      {!showTermsOnboarding && showPlanOnboarding && (
        <PlanOnboarding
          onboardingStep={onboardingStep}
          teamName={teamName}
          setTeamName={setTeamName}
          selectedOnboardingPlan={selectedOnboardingPlan}
          setSelectedOnboardingPlan={setSelectedOnboardingPlan}
          onboardingBilling={onboardingBilling}
          setOnboardingBilling={setOnboardingBilling}
          savingPlanOnboarding={savingPlanOnboarding}
          planOnboardingError={planOnboardingError}
          handleNextPlanOnboarding={handleNextPlanOnboarding}
          handleStartTrial={handleStartTrial}
          handlePaidPlanCheckout={handlePaidPlanCheckout}
          completePlanOnboarding={completePlanOnboarding}
          writePlanOnboarding={writePlanOnboarding}
          checkoutLoading={checkoutLoading}
          trialCheckoutLoading={trialCheckoutLoading}
          orderedPlans={orderedPlans}
        />
      )}

      <DashboardHeader
        subscription={subscription}
        subscriptionError={subscriptionError}
        checkingSession={checkingSession}
        favoriteCount={favoriteCount}
        favoriteToolsLoading={favoriteToolsLoading}
        tierName={tierName}
        teamName={apiTeamName || teamName || suggestWorkspaceName(user.name) || "My workspace"}
      />

      {!showTermsOnboarding && !showPlanOnboarding && !checklistDismissed && (
        <div className="mb-6">
          <OnboardingChecklist
            userId={user.id}
            hasFavorites={favoriteCount > 0}
            onDismiss={() => setChecklistDismissed(true)}
          />
        </div>
      )}

      <TabbedTools
        favoriteTools={favoriteTools}
        favoriteToolsLoading={favoriteToolsLoading}
        favoriteCount={favoriteCount}
        copiedFavoriteSlug={copiedFavoriteSlug}
        shareFavorite={shareFavorite}
        recentTools={recentTools}
        recentToolsCount={recentToolsCount}
      />

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="cursor-pointer text-sm text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
