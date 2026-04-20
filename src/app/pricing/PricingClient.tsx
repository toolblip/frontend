'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://toolblip-api-production.up.railway.app';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    description: 'Get started with the basics.',
    features: ['All tools available', '1 device', 'Client-side processing'],
    cta: 'Get Started',
    ctaHref: '/signup',
    highlighted: false,
    badge: null,
  },
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 4.99,
    priceYearly: 49.99,
    description: 'For power users who want more.',
    features: [
      'Everything in Free',
      'No ads',
      '2 devices',
      '500 MB cloud storage',
    ],
    cta: 'Get Starter',
    ctaHref: '/signup?plan=starter_monthly',
    highlighted: false,
    badge: null,
  },
  {
    id: 'ultra',
    name: 'Ultra',
    priceMonthly: 19.99,
    priceYearly: 199.99,
    description: 'Most popular for individuals.',
    features: [
      'Everything in Starter',
      '5 devices',
      '10 GB cloud storage',
      '3 team seats',
    ],
    cta: 'Get Ultra',
    ctaHref: '/signup?plan=ultra_monthly',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: 'max',
    name: 'Max',
    priceMonthly: 49.99,
    priceYearly: 499.99,
    description: 'For teams and power users.',
    features: [
      'Everything in Ultra',
      '10 devices',
      '50 GB cloud storage',
      '10 team seats',
      'API access',
      'Priority support',
    ],
    cta: 'Get Max',
    ctaHref: '/signup?plan=max_monthly',
    highlighted: false,
    badge: null,
  },
];

type BillingCycle = 'monthly' | 'yearly';

export default function PricingClient() {
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('toolblip_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw) as { name: string; email: string });
      } catch {
        // ignore
      }
    }
  }, []);

  async function handleUpgrade(planId: string, priceId: string) {
    setError(null);
    const token = localStorage.getItem('toolblip_token');

    if (!token) {
      window.location.href = `/login?next=/pricing`;
      return;
    }

    setLoading(planId);

    try {
      const res = await fetch(`${API_BASE}/api/subscription/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ price_id: priceId }),
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          All tools are free to use. Upgrade for an uninterrupted experience.
        </p>

        {/* Billing toggle */}
        <div className="mt-6 inline-flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              billing === 'monthly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              billing === 'yearly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Yearly
            <span className="ml-1.5 text-xs text-green-600 dark:text-green-400 font-semibold">2 months free</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {PLANS.map((plan) => {
          const isLoading = loading === plan.id;
          const price = billing === 'yearly' ? plan.priceYearly : plan.priceMonthly;
          const priceId =
            billing === 'yearly'
              ? `${plan.id}_yearly`
              : `${plan.id}_monthly`;

          return (
            <div
              key={plan.id}
              className={[
                'relative rounded-2xl border p-5 flex flex-col',
                plan.highlighted
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/10 shadow-lg ring-2 ring-green-500/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900',
              ].join(' ')}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </span>
              )}

              <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  {plan.name}
                </h2>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${price % 1 === 0 ? price : price.toFixed(2)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {price === 0 ? '' : billing === 'yearly' ? '/yr' : '/mo'}
                  </span>
                </div>
                {billing === 'yearly' && price > 0 && (
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    ${(price / 12).toFixed(2)}/mo billed annually
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-2.5 mb-5 flex-1">
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
                  className="w-full block text-center px-4 py-2.5 rounded-lg font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.id, priceId)}
                  disabled={isLoading}
                  className={[
                    'w-full px-4 py-2.5 rounded-lg font-medium transition-colors text-sm',
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