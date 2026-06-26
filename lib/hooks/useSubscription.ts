"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import {
  sortPricingPlans,
  type BillingCycle,
} from "@/components/v2/PricingSection";
import type { Subscription, Plan } from "@/components/dashboard/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

const FALLBACK_PLANS: Plan[] = [
  {
    tier: "free",
    name: "Free",
    description: "For anyone getting started",
    price_monthly: 0,
    price_yearly: 0,
    stripe_monthly_id: null,
    stripe_yearly_id: null,
    storage_gb: 0,
    max_file_size_mb: 5,
    team_seats: 1,
    api_access: false,
    priority_support: false,
    sort_order: 0,
  },
  {
    tier: "starter",
    name: "Starter",
    description: "For personal use",
    price_monthly: 499,
    price_yearly: 4990,
    stripe_monthly_id: "price_1TOflqHd4AsPgGTOxspjxODX",
    stripe_yearly_id: "price_1TOflqHd4AsPgGTOOrxqG1kM",
    storage_gb: 1,
    max_file_size_mb: 50,
    team_seats: 1,
    api_access: false,
    priority_support: false,
    sort_order: 1,
  },
  {
    tier: "ultra",
    name: "Pro",
    description: "For power users",
    price_monthly: 1999,
    price_yearly: 19990,
    stripe_monthly_id: "price_1TOflrHd4AsPgGTOnt9jYhjz",
    stripe_yearly_id: "price_1TOflsHd4AsPgGTO5ra4mhwt",
    storage_gb: 10,
    max_file_size_mb: 500,
    team_seats: 3,
    api_access: true,
    priority_support: false,
    sort_order: 2,
  },
  {
    tier: "max",
    name: "Max",
    description: "For teams",
    price_monthly: 4999,
    price_yearly: 49990,
    stripe_monthly_id: "price_1TOflsHd4AsPgGTOG7jeNqLk",
    stripe_yearly_id: "price_1TOfltHd4AsPgGTOnUHvrbT7",
    storage_gb: 50,
    max_file_size_mb: 5000,
    team_seats: 10,
    api_access: true,
    priority_support: true,
    sort_order: 3,
  },
];

function displayOnboardingPlanName(tier: string | null | undefined) {
  if (!tier) return null;
  const ONBOARDING_PLAN_LABELS: Record<string, string> = {
    free: "Free",
    starter: "Starter",
    ultra: "Pro",
    max: "Max",
  };
  return (
    ONBOARDING_PLAN_LABELS[tier] ??
    tier.charAt(0).toUpperCase() + tier.slice(1)
  );
}

export function useSubscription() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionError, setSubscriptionError] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const [cancelSubscriptionError, setCancelSubscriptionError] = useState<
    string | null
  >(null);
  const [checkingSession, setCheckingSession] = useState(false);
  const [switchMode, setSwitchMode] = useState(false);
  const [switchPlanTier, setSwitchPlanTier] = useState<string | null>(null);
  const [switchBilling, setSwitchBilling] = useState<BillingCycle>("monthly");
  const [switchingPlan, setSwitchingPlan] = useState(false);
  const [switchError, setSwitchError] = useState<string | null>(null);
  const [switchSuccess, setSwitchSuccess] = useState<string | null>(null);
  const [pricingPlans, setPricingPlans] = useState<Plan[]>(FALLBACK_PLANS);

  // Pricing plans
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
    return () => {
      cancelled = true;
    };
  }, []);

  const redirectToLoginPreservingCurrentLocation = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;
    const currentNext = params.get("next");
    const nextPath =
      (currentPath === "/login" || currentPath === "/signup") &&
      currentNext &&
      currentNext.startsWith("/") &&
      !currentNext.startsWith("//")
        ? currentNext
        : `${currentPath}${window.location.search}`;
    router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
  }, [router]);

  const checkSubscription = useCallback(async () => {
    if (!token) return;
    setSubscriptionError(false);
    try {
      const res = await fetch(`/api/subscription`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      } else if (res.status === 404) {
        setSubscription({
          is_pro: false,
          tier: "free",
          devices: null,
          storage_gb: 0,
          team_seats: 1,
          max_file_size_mb: 5,
          api_access: false,
          priority_support: false,
          plan_ends_at: null,
          subscription_status: "active",
        });
      } else {
        setSubscriptionError(true);
      }
    } catch {
      setSubscriptionError(true);
    }
  }, [token]);

  // Check subscription on mount / session_id
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("session_id")) {
      setCheckingSession(true);
      checkSubscription();
    } else {
      checkSubscription();
    }
  }, [checkSubscription]);

  const openCustomerPortal = useCallback(async () => {
    setPortalError(null);
    if (!token) {
      redirectToLoginPreservingCurrentLocation();
      return;
    }
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/subscription/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to open billing portal");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setPortalError(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setLoadingPortal(false);
    }
  }, [token, redirectToLoginPreservingCurrentLocation]);

  const handleCancelSubscription = useCallback(async () => {
    setCancelSubscriptionError(null);
    if (!token) {
      redirectToLoginPreservingCurrentLocation();
      return;
    }
    setCancellingSubscription(true);
    try {
      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel subscription");
      await checkSubscription();
    } catch (err) {
      setCancelSubscriptionError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setCancellingSubscription(false);
    }
  }, [token, redirectToLoginPreservingCurrentLocation, checkSubscription]);

  const handleSwitchPlan = useCallback(
    async (planTier: string, billing: BillingCycle) => {
      setSwitchError(null);
      setSwitchSuccess(null);
      if (!token) {
        redirectToLoginPreservingCurrentLocation();
        return;
      }
      setSwitchingPlan(true);
      try {
        const res = await fetch("/api/subscription/switch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plan_tier: planTier, billing }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to switch plan");
        setSwitchSuccess(data.message || "Plan changed successfully.");
        setSwitchMode(false);
        await checkSubscription();
      } catch (err) {
        setSwitchError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setSwitchingPlan(false);
      }
    },
    [token, redirectToLoginPreservingCurrentLocation, checkSubscription]
  );

  // Derived values shared across pages
  const planEndDate = subscription?.plan_ends_at
    ? new Date(subscription.plan_ends_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const tierName = displayOnboardingPlanName(subscription?.tier);
  const planScheduledToCancel =
    Boolean(subscription?.is_pro) &&
    subscription?.subscription_status !== "active";

  const isTrialing = subscription?.subscription_status === "trialing";
  const trialEndsAt =
    isTrialing && subscription?.plan_ends_at
      ? new Date(subscription.plan_ends_at)
      : null;
  const trialDaysRemaining = trialEndsAt
    ? Math.max(
        0,
        Math.ceil(
          (trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      )
    : null;
  const trialEndsToday = trialEndsAt
    ? (() => {
        const now = new Date();
        return (
          trialEndsAt.getFullYear() === now.getFullYear() &&
          trialEndsAt.getMonth() === now.getMonth() &&
          trialEndsAt.getDate() === now.getDate()
        );
      })()
    : false;

  const orderedPlans = sortPricingPlans(pricingPlans);

  return {
    // State
    subscription,
    subscriptionError,
    loadingPortal,
    portalError,
    cancellingSubscription,
    cancelSubscriptionError,
    checkingSession,
    switchMode,
    setSwitchMode,
    switchPlanTier,
    setSwitchPlanTier,
    switchBilling,
    setSwitchBilling,
    switchingPlan,
    switchError,
    switchSuccess,
    pricingPlans,
    orderedPlans,

    // Functions
    checkSubscription,
    openCustomerPortal,
    handleCancelSubscription,
    handleSwitchPlan,

    // Derived
    planEndDate,
    tierName,
    planScheduledToCancel,
    isTrialing,
    trialEndsAt,
    trialDaysRemaining,
    trialEndsToday,
  };
}
