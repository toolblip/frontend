"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { BillingSection } from "@/components/dashboard/BillingSection";
import { InvoicesSection } from "@/components/dashboard/InvoicesSection";

export default function SubscriptionPage() {
  const { user, loading: authLoading } = useRequireAuth();
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
    <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-16">
      <div className="space-y-8">
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
          switchBilling={switchBilling}
          setSwitchBilling={setSwitchBilling}
          switchingPlan={switchingPlan}
          switchError={switchError}
          switchSuccess={switchSuccess}
          handleSwitchPlan={handleSwitchPlan}
          pricingPlans={pricingPlans}
        />

        {subscription?.is_pro && (
          <InvoicesSection />
        )}

        <div className="text-center">
          <Link
            href="/dashboard"
            className="cursor-pointer text-sm text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
