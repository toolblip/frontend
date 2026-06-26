"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useAuth } from "@/app/providers/auth-provider";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { BillingSection } from "@/components/dashboard/BillingSection";

export default function SubscriptionPage() {
  const { user, loading: authLoading } = useAuth();
  const {
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
  } = useSubscription();

  if (authLoading || !user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <BillingSection
          subscription={subscription}
          subscriptionError={subscriptionError}
          checkSubscription={checkSubscription}
          planEndDate={planEndDate}
          planScheduledToCancel={planScheduledToCancel}
          tierName={tierName}
          loadingPortal={loadingPortal}
          portalError={portalError}
          openCustomerPortal={openCustomerPortal}
          cancellingSubscription={cancellingSubscription}
          cancelSubscriptionError={cancelSubscriptionError}
          handleCancelSubscription={handleCancelSubscription}
          switchMode={switchMode}
          setSwitchMode={setSwitchMode}
          switchPlanTier={switchPlanTier}
          setSwitchPlanTier={setSwitchPlanTier}
          switchBilling={switchBilling}
          setSwitchBilling={setSwitchBilling}
          switchingPlan={switchingPlan}
          switchError={switchError}
          switchSuccess={switchSuccess}
          handleSwitchPlan={handleSwitchPlan}
          pricingPlans={pricingPlans}
        />
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
