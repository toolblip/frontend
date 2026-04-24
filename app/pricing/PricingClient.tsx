'use client';

import { useState, useEffect } from 'react';
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

const HIGHLIGHT_TIER = 'ultra';

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
      <div className="tb-v2-pricing">
        <div className="tb-v2-container">
          <div className="tb-v2-pricing-loader">Loading plans...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="tb-v2-pricing">
      <div className="tb-v2-container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="tb-v2-kicker">Pricing</div>
          <h1 className="tb-v2-page-title" style={{ fontSize: '36px' }}>Simple, transparent pricing</h1>
          <p className="tb-v2-page-sub">All tools are free to use. Upgrade for an uninterrupted experience.</p>

          <div className="tb-v2-pricing-toggle" style={{ marginTop: '24px' }}>
            <button
              onClick={() => setBilling('monthly')}
              className={`tb-v2-pricing-toggle-btn${billing === 'monthly' ? ' on' : ''}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`tb-v2-pricing-toggle-btn${billing === 'yearly' ? ' on' : ''}`}
            >
              Yearly
              <span className="tb-v2-pricing-toggle-badge">2 months free</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="tb-v2-pricing-error">{error}</div>
        )}

        <div className="tb-v2-pricing-grid">
          {plans.map((plan) => {
            const isLoading = loading === plan.tier;
            const price =
              billing === 'yearly' ? plan.price_yearly : plan.price_monthly;
            const isHighlighted = plan.tier === HIGHLIGHT_TIER;
            const isFree = plan.tier === 'free';

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
                className={`tb-v2-pricing-card${isHighlighted ? ' hot' : ''}`}
              >
                {isHighlighted && (
                  <span className="tb-v2-pricing-card-badge">Most Popular</span>
                )}

                <div className="tb-v2-pricing-card-name">{plan.name}</div>
                <div className="tb-v2-pricing-card-price">
                  <span className="tb-v2-pricing-card-price-amt">
                    ${price % 1 === 0 ? price : price.toFixed(2)}
                  </span>
                  <span className="tb-v2-pricing-card-price-period">
                    {price === 0
                      ? ''
                      : billing === 'yearly'
                        ? '/yr'
                        : '/mo'}
                  </span>
                </div>
                {billing === 'yearly' && price > 0 && (
                  <p className="tb-v2-pricing-card-sub">
                    ${(price / 12).toFixed(2)}/mo billed annually
                  </p>
                )}
                <p className="tb-v2-pricing-card-desc">{plan.description}</p>

                <ul className="tb-v2-pricing-features">
                  {features.map((feature) => (
                    <li key={feature}>
                      <svg className="tb-v2-pricing-check" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {isFree ? (
                  <Link
                    href="/signup"
                    className="tb-v2-btn tb-v2-btn-primary tb-v2-pricing-btn"
                    style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                  >
                    Get Started
                  </Link>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan)}
                    disabled={isLoading}
                    className="tb-v2-btn tb-v2-btn-primary tb-v2-pricing-btn"
                    style={{ background: isHighlighted ? 'var(--fg-0)' : undefined, borderColor: isHighlighted ? 'var(--fg-0)' : undefined }}
                  >
                    {isLoading ? 'Redirecting...' : `Get ${plan.name}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="tb-v2-pricing-footer">
          <p>
            All prices in USD. Cancel anytime.{' '}
            <Link href="/terms" style={{ color: 'var(--fg-2)' }}>Terms of Service</Link>
            {' · '}
            <Link href="/privacy" style={{ color: 'var(--fg-2)' }}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
