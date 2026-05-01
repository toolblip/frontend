'use client';

import { useState } from 'react';
import { useStripeStatus } from '@/lib/stripeStatus';

export function StripeStagingBanner() {
  const { status, loading, error } = useStripeStatus();
  const [dismissed, setDismissed] = useState(false);

  if (loading || error || !status || !status.staging_mode || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-50 dark:bg-amber-950 border-t-2 border-amber-400 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-200">
              Stripe Test Mode Active
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Payments are simulated — no real charges will be made.
            </p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 text-2xl leading-none px-2"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
