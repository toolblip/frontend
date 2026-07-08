"use client";

import { useAuth } from "@/app/providers/auth-provider";
import { useSubscription } from "@/lib/hooks/useSubscription";

/**
 * Whether ad slots should render for the current viewer.
 *
 * - Guests (no user) → true
 * - Logged-in free tier → true
 * - Logged-in paid tier (starter/ultra/max, or is_pro) → false
 * - Still loading auth, or subscription not yet known for a logged-in user → false
 *   (default to no ads so paid users never see a flash of an ad)
 */
export function useShowAds(): boolean {
  const { user, loading: authLoading } = useAuth();
  const { subscription } = useSubscription();

  if (authLoading) return false;

  // Guests always see ads.
  if (!user) return true;

  // Logged in: wait until we know the subscription before deciding.
  if (!subscription) return false;

  const tier = subscription.tier ?? "free";
  const isPaid = Boolean(subscription.is_pro) || (tier !== "free" && tier !== "");

  return !isPaid;
}

export default useShowAds;
