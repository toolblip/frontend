'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StripeStagingBanner } from '@/components/StripeStagingBanner';
import { useStripeStatus } from '@/lib/stripeStatus';

const AMOUNTS = [5, 10, 25, 50, 100];

export default function DonateClient() {
  const { status, loading } = useStripeStatus();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStaging = status?.staging_mode ?? false;

  async function handleDonate() {
    const amount = selectedAmount ?? parseInt(customAmount);
    if (!amount || amount <= 0) {
      setError('Please select or enter a valid amount');
      return;
    }

    setLoadingCheckout(true);
    setError(null);

    try {
      const res = await fetch('https://api.toolblip.com/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, type: 'donation' }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'STAGING_MODE_BLOCK') {
          setError('Checkout is currently disabled. The team is testing payments.');
        } else {
          setError(data.message || 'Failed to start checkout');
        }
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoadingCheckout(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <StripeStagingBanner />

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-10 text-center">
          <div className="text-5xl mb-4">❤️</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Toolblip</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Help us keep tools free, ad-free, and privacy-respecting. Every contribution counts.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {isStaging && (
          <div className="mb-8 p-4 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-xl text-center">
            <p className="text-amber-800 dark:text-amber-200 font-medium">
              🔒 Test mode — donations are simulated, no real charges
            </p>
          </div>
        )}

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why donate?</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Toolblip is built and maintained by a small team. Your donation helps us cover server costs,
              build new tools, and keep everything free and ad-free. No paywalls, no tracking — just tools.
            </p>
          </section>

          {/* Donation form */}
          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Make a donation</h2>

            {/* Preset amounts */}
            <div className="flex flex-wrap gap-3 mb-4">
              {AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                  className={`px-4 py-2 rounded-lg font-medium border transition-colors ${
                    selectedAmount === amt
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-red-400'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Or enter custom amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                  placeholder="0.00"
                  min="1"
                  className="w-full pl-7 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {error && (
              <p className="mb-4 text-red-600 dark:text-red-400 text-sm">{error}</p>
            )}

            <button
              onClick={handleDonate}
              disabled={loadingCheckout || loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loadingCheckout ? 'Redirecting...' : `Donate ${selectedAmount ? `$${selectedAmount}` : customAmount ? `$${customAmount}` : ''}`}
            </button>

            <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
              Secure payment via Stripe{isStaging ? ' (test mode)' : ''}
            </p>
          </section>

          {/* Alternative support */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Other ways to support</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
                <div className="text-2xl mb-3">🔄</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Monthly support</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Become a recurring supporter and help us plan for the long term.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
                <div className="text-2xl mb-3">📣</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Spread the word</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Share Toolblip with your network. Great tools deserve to be discovered.
                </p>
              </div>
            </div>
          </section>

          {/* Browse tools CTA */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Not ready to donate? No problem — browse our free tools instead!
            </p>
            <Link
              href="/directory"
              className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Browse Free Tools →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
