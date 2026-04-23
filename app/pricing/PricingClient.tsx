'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.toolblip.com';

interface Plan {
  tier: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number;
  stripe_monthly_id: string | null;
  stripe_yearly_id: string | null;
  devices: number;
  storage_gb: number;
  max_file_size_mb: number;
  team_seats: number;
  api_access: boolean;
  priority_support: boolean;
  sort_order: number;
}

type BillingCycle = 'monthly' | 'yearly';

const HIGHLIGHT_TIER = 'ultra'; // which tier gets the "Most Popular" badge

function formatStorage(gb: number): string {
  if (gb === 0) return '';
  if (gb < 1) return `${gb * 1000} MB`;
  return `${gb} GB`;
}

function formatFileSize(mb: number): string {
  if (mb === 0) return '';
  if (mb >= 1000) return `${mb / 1000} GB`;
  return `${mb} MB`;
}

export default function PricingClient() {
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/plans`)
      .then((r) => r.json())
      .then((data) => {
        setPlans(data.plans || []);
        setPlansLoading(false);
      })
      .catch(() => setPlansLoading(false));
  }, []);

  async function handleUpgrade(plan: Plan) {
    setError(null);
    const token = localStorage.getItem('toolblip_token');

    if (!token) {
      window.location.href = `/login?next=/pricing`;
      return;
    }

    const stripePriceId =
      billing === 'yearly' ? plan.stripe_yearly_id : plan.stripe_monthly_id;

    if (!stripePriceId) {
      setError('This plan is not available yet.');
      return;
    }

    setLoading(plan.tier);

    try {
      const res = await fetch(`${API_BASE}/api/subscription/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price_id: stripePriceId }),
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

  if (plansLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="animate-pulse text-gray-400">Loading plans...</div>
      </div>
    );
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
            <span className="ml-1.5 text-xs text-red-600 dark:text-red-400 font-semibold">
              2 months free
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {plans.map((plan) => {
          const isLoading = loading === plan.tier;
          const price =
            billing === 'yearly' ? plan.price_yearly : plan.price_monthly;
          const isHighlighted = plan.tier === HIGHLIGHT_TIER;
          const isFree = plan.tier === 'free';

          // Build feature list dynamically from plan data
          const features: string[] = [];

          if (!isFree) {
            features.push('Everything in Free');
            features.push('No ads');
          } else {
            features.push('All tools available');
            features.push('Client-side processing');
          }

          if (plan.devices > 0)
            features.push(
              `${plan.devices} device${plan.devices > 1 ? 's' : ''}`
            );
          if (plan.storage_gb > 0)
            features.push(`${formatStorage(plan.storage_gb)} cloud storage`);
          if (plan.max_file_size_mb > 0)
            features.push(
              `Up to ${formatFileSize(plan.max_file_size_mb)} file processing`
            );
          if (plan.team_seats > 0)
            features.push(
              `${plan.team_seats} team seat${plan.team_seats > 1 ? 's' : ''}`
            );
          if (plan.api_access) features.push('API access');
          if (plan.priority_support) features.push('Priority support');

          return (
            <div
              key={plan.tier}
              className={[
                'relative rounded-2xl border p-5 flex flex-col',
                isHighlighted
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/10 shadow-lg ring-2 ring-red-500/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900',
              ].join(' ')}
            >
              {isHighlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  Most Popular
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
                    {price === 0
                      ? ''
                      : billing === 'yearly'
                        ? '/yr'
                        : '/mo'}
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
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <svg
                      className="w-4 h-4 text-red-500 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {isFree ? (
                <Link
                  href="/signup"
                  className="w-full block text-center px-4 py-2.5 rounded-lg font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  Get Started
                </Link>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan)}
                  disabled={isLoading}
                  className={[
                    'w-full px-4 py-2.5 rounded-lg font-medium transition-colors text-sm',
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : isHighlighted
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900',
                  ].join(' ')}
                >
                  {isLoading ? 'Redirecting...' : `Get ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center text-sm text-gray-400 dark:text-gray-500">
        <p>
          All prices in USD. Cancel anytime.{' '}
          <Link
            href="/terms"
            className="underline hover:text-gray-600 dark:hover:text-gray-300"
          >
            Terms of Service
          </Link>
          {' '}
          ·{' '}
          <Link
            href="/privacy"
            className="underline hover:text-gray-600 dark:hover:text-gray-300"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
