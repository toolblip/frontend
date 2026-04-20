'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://toolblip-api-production.up.railway.app';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'All core tools, with ads.',
    features: [
      'All 36+ tools',
      'Client-side processing',
      'No account required',
      'Ads displayed',
    ],
    cta: 'Get Started',
    ctaHref: '/signup',
    highlighted: false,
  },
  {
    id: 'monthly',
    name: 'Pro',
    price: '$4.99',
    period: '/month',
    description: 'No ads. No captchas. Just tools.',
    features: [
      'Everything in Free',
      'No ads',
      'No captchas',
      'Early access to new tools',
      'Priority support',
    ],
    cta: 'Get Pro',
    ctaHref: '/signup?plan=monthly',
    highlighted: true,
    badge: null,
  },
  {
    id: 'yearly',
    name: 'Pro Yearly',
    price: '$49.99',
    period: '/year',
    description: 'Two months free. Billed annually.',
    features: [
      'Everything in Pro Monthly',
      'Save 16% vs monthly',
      '2 months free',
      'Priority support',
    ],
    cta: 'Get Pro Yearly',
    ctaHref: '/signup?plan=yearly',
    highlighted: true,
    badge: 'Save 16%',
  },
];

export default function PricingClient() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string; is_pro: boolean } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('toolblip_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw) as { name: string; email: string; is_pro: boolean });
      } catch {
        // ignore
      }
    }
  }, []);

  async function handleUpgrade(plan: 'monthly' | 'yearly') {
    setError(null);
    const token = localStorage.getItem('toolblip_token');

    if (!token) {
      window.location.href = `/login?next=/pricing`;
      return;
    }

    setLoading(plan);

    try {
      const res = await fetch(`${API_BASE}/api/subscription/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          All tools are free to use. Upgrade for an uninterrupted experience.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {PLANS.map((plan) => {
          const isLoading = loading === plan.id;

          return (
            <div
              key={plan.id}
              className={[
                'relative rounded-2xl border p-6 flex flex-col',
                plan.highlighted
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/10 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900',
              ].join(' ')}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {plan.name}
                </h2>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.id === 'free' ? (
                <Link
                  href={plan.ctaHref}
                  className="w-full block text-center px-4 py-2.5 rounded-lg font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.id as 'monthly' | 'yearly')}
                  disabled={isLoading}
                  className={[
                    'w-full px-4 py-2.5 rounded-lg font-medium transition-colors',
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : plan.highlighted
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900',
                  ].join(' ')}
                >
                  {isLoading ? 'Redirecting...' : plan.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center text-sm text-gray-400 dark:text-gray-500">
        <p>
          All prices in USD. Cancel anytime.{' '}
          <Link href="/terms" className="underline hover:text-gray-600 dark:hover:text-gray-300">
            Terms of Service
          </Link>
          {' '}·{' '}
          <Link href="/privacy" className="underline hover:text-gray-600 dark:hover:text-gray-300">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
