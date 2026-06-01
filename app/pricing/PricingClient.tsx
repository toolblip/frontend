'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PricingBillingToggle,
  PricingPlanCard,
  buildPricingPlanFeatures,
  sortPricingPlans,
  type BillingCycle,
  type PricingPlanLike,
} from '@/components/v2/PricingSection';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.toolblip.com';

const FALLBACK_PLANS: Plan[] = [
  { tier: 'free', name: 'Free', description: 'For anyone getting started', price_monthly: 0, price_yearly: 0, stripe_monthly_id: null, stripe_yearly_id: null, storage_gb: 0, max_file_size_mb: 5, team_seats: 1, api_access: false, priority_support: false, sort_order: 0 },
  { tier: 'starter', name: 'Starter', description: 'For personal use', price_monthly: 499, price_yearly: 4799, stripe_monthly_id: 'price_1TOflqHd4AsPgGTOxspjxODX', stripe_yearly_id: 'price_1TOflqHd4AsPgGTOOrxqG1kM', storage_gb: 1, max_file_size_mb: 50, team_seats: 1, api_access: false, priority_support: false, sort_order: 1 },
  { tier: 'ultra', name: 'Pro', description: 'For power users', price_monthly: 1999, price_yearly: 19199, stripe_monthly_id: 'price_1TOflrHd4AsPgGTOnt9jYhjz', stripe_yearly_id: 'price_1TOflsHd4AsPgGTO5ra4mhwt', storage_gb: 10, max_file_size_mb: 500, team_seats: 3, api_access: true, priority_support: false, sort_order: 2 },
  { tier: 'max', name: 'Max', description: 'For teams', price_monthly: 4999, price_yearly: 47999, stripe_monthly_id: 'price_1TOflsHd4AsPgGTOG7jeNqLk', stripe_yearly_id: 'price_1TOfltHd4AsPgGTOnUHvrbT7', storage_gb: 50, max_file_size_mb: 5000, team_seats: 10, api_access: true, priority_support: true, sort_order: 3 },
];

interface Plan {
  tier: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number;
  stripe_monthly_id: string | null;
  stripe_yearly_id: string | null;
  storage_gb: number;
  max_file_size_mb: number;
  team_seats: number;
  api_access: boolean;
  priority_support: boolean;
  sort_order: number;
}

interface PlanFeature {
  label: string;
  included?: boolean;
}

const DISPLAY_PLAN_NAMES: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  ultra: 'Pro',
  max: 'Max',
};

function displayPlanName(plan: Plan) {
  return DISPLAY_PLAN_NAMES[plan.tier] ?? plan.name;
}

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

function buildPlanFeatures(plan: Plan): PlanFeature[] {
  const features: PlanFeature[] = [];

  if (plan.tier === 'free') {
    features.push({ label: 'All tools available' });
    features.push({ label: 'Client-side processing' });
    return features;
  }

  features.push({ label: 'Everything in Free' });
  features.push({ label: 'No ads' });

  if (plan.storage_gb > 0) {
    features.push({ label: `${formatStorage(plan.storage_gb)} cloud storage` });
  }
  if (plan.max_file_size_mb > 0) {
    features.push({ label: `Up to ${formatFileSize(plan.max_file_size_mb)} file processing` });
  }
  if (plan.team_seats > 0) {
    features.push({
      label: `${plan.team_seats} team seat${plan.team_seats > 1 ? 's' : ''}`,
    });
  }

  if (plan.tier === 'starter') {
    features.push({ label: 'API access', included: false });
    features.push({ label: 'Basic support' });
  } else if (plan.tier === 'ultra') {
    features.push({ label: 'API access' });
    features.push({ label: 'Standard support' });
  } else if (plan.tier === 'max') {
    features.push({ label: 'API access' });
    features.push({ label: 'Priority support' });
  }

  return features;
}

export default function PricingClient() {
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userIsPro, setUserIsPro] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/plans`)
      .then((r) => r.json())
      .then((data) => {
        setPlans((data.plans && data.plans.length > 0) ? data.plans : FALLBACK_PLANS);
        setPlansLoading(false);
      })
      .catch(() => {
        setPlans(FALLBACK_PLANS);
        setPlansLoading(false);
      });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (new URLSearchParams(window.location.search).has('session_id')) {
      setShowSuccess(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('toolblip_token');
    if (!token) return;
    fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.is_pro) setUserIsPro(true);
      })
      .catch(() => {});
  }, []);

  async function handleUpgrade(plan: Plan) {
    setError(null);
    const token = localStorage.getItem('toolblip_token');
    const onboardingNext = `/dashboard?plan=${plan.tier}&billing=${billing}`;

    if (!token) {
      window.location.href = `/login?next=${encodeURIComponent(onboardingNext)}`;
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

  const orderedPlans = sortPricingPlans(plans);
  const pricingPlans: PricingPlanLike[] = orderedPlans.map((plan) => ({
    tier: plan.tier,
    name: displayPlanName(plan),
    description: plan.description,
    priceMonthly: plan.price_monthly,
    priceYearly: plan.price_yearly,
    badge: plan.tier === HIGHLIGHT_TIER ? 'Popular' : null,
  }));
  const highlightPlan = orderedPlans.find((p) => p.tier === HIGHLIGHT_TIER);
  const stickyPriceCents = highlightPlan
    ? billing === 'yearly'
      ? highlightPlan.price_yearly
      : highlightPlan.price_monthly
    : 0;
  const stickyPrice = stickyPriceCents / 100;

  return (
    <div className="tb-v2-pricing">
      <div className="tb-v2-container">
        {showSuccess && (
          <div className="tb-v2-pricing-success" role="status">
            <strong>Subscription activated!</strong> Your plan is now active. Welcome to Toolblip.
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="tb-v2-pricing-success-close"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}
        {userIsPro && !showSuccess && (
          <div className="tb-v2-pricing-active-sub" role="status">
            You have an active subscription. Manage it from your account.
          </div>
        )}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="tb-v2-kicker">Pricing</div>
          <h1 className="tb-v2-page-title" style={{ fontSize: '36px' }}>Simple, transparent pricing</h1>
          <p className="tb-v2-page-sub">All tools are free to use. Upgrade for an uninterrupted experience.</p>
        </div>

        <PricingBillingToggle billing={billing} onBillingChange={setBilling} centered />

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {pricingPlans
            .filter((plan) => plan.tier !== 'free')
            .map((plan) => {
              const isHighlighted = plan.tier === HIGHLIGHT_TIER;
              const sourcePlan = orderedPlans.find((item) => item.tier === plan.tier)!;
              const features = buildPricingPlanFeatures(sourcePlan);

              return (
                <PricingPlanCard
                  key={plan.tier}
                  plan={plan}
                  billing={billing}
                  highlighted={isHighlighted}
                  selected={isHighlighted}
                  footer={
                    <button
                      onClick={() => handleUpgrade(sourcePlan)}
                      disabled={loading === sourcePlan.tier}
                      className={`tb-v2-btn tb-v2-pricing-btn ${isHighlighted ? 'inverse' : 'tb-v2-btn-primary'}`}
                      style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                    >
                      {loading === sourcePlan.tier ? 'Redirecting...' : `Get ${plan.name}`}
                    </button>
                  }
                >
                  <ul className="tb-v2-pricing-features">
                    {features.map((feature) => (
                      <li
                        key={feature.label}
                        className={feature.included === false ? 'text-[color:var(--fg-3)] line-through' : ''}
                      >
                        <span className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center text-[11px] font-bold leading-none text-red-500">
                          {feature.included === false ? '×' : '✓'}
                        </span>
                        {feature.label}
                      </li>
                    ))}
                  </ul>
                </PricingPlanCard>
              );
            })}

          {pricingPlans
            .filter((plan) => plan.tier === 'free')
            .map((plan) => {
              const sourcePlan = orderedPlans.find((item) => item.tier === plan.tier)!;
              const features = buildPricingPlanFeatures(sourcePlan);

              return (
                <div key={plan.tier} className="lg:col-span-3">
                  <PricingPlanCard
                    plan={plan}
                    billing={billing}
                    tone="light"
                    className="free-row"
                    compactHeader
                    headerRightSlot={
                      <Link
                        href={`/signup?next=${encodeURIComponent('/dashboard?plan=free')}`}
                        className="tb-v2-pricing-inline-link"
                      >
                        Get Free Plan
                      </Link>
                    }
                  >
                    <ul className="tb-v2-pricing-features">
                      {features.map((feature) => (
                        <li
                          key={feature.label}
                          className={feature.included === false ? 'text-[color:var(--fg-3)] line-through' : ''}
                        >
                          <span className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center text-[11px] font-bold leading-none text-red-500">
                            {feature.included === false ? '×' : '✓'}
                          </span>
                          {feature.label}
                        </li>
                      ))}
                    </ul>
                  </PricingPlanCard>
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

      {highlightPlan && !userIsPro && (
        <div className="tb-v2-pricing-sticky-mobile" role="region" aria-label="Recommended plan">
          <div className="tb-v2-pricing-sticky-info">
            <span className="tb-v2-pricing-sticky-name">{displayPlanName(highlightPlan)}</span>
            <span className="tb-v2-pricing-sticky-price">
              ${stickyPrice % 1 === 0 ? stickyPrice : stickyPrice.toFixed(2)}
              <span className="tb-v2-pricing-sticky-period">
                {billing === 'yearly' ? '/yr' : '/mo'}
              </span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleUpgrade(highlightPlan)}
            disabled={loading === highlightPlan.tier}
            className="tb-v2-btn tb-v2-btn-primary tb-v2-pricing-sticky-btn"
          >
            {loading === highlightPlan.tier ? '…' : `Get ${displayPlanName(highlightPlan)}`}
          </button>
        </div>
      )}
    </div>
  );
}
