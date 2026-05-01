'use client';

import { useState, useEffect } from 'react';

interface StripeStatus {
  staging_mode: boolean;
}

export function useStripeStatus() {
  const [status, setStatus] = useState<StripeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('https://api.toolblip.com/api/stripe/status');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  return { status, loading, error };
}
