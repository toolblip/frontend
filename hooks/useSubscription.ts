'use client';

import { useEffect, useState } from 'react';
import { getToken } from '@/lib/auth';
import { getSubscription } from '@/lib/api';

export function useSubscription() {
  const [tier, setTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    getSubscription(token)
      .then((sub) => {
        setTier(sub.subscription_tier ?? sub.is_pro ? 'pro' : 'free');
      })
      .catch(() => {
        setTier('free');
      })
      .finally(() => setLoading(false));
  }, []);

  return { tier, loading };
}
