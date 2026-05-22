'use client';

import type { ReactNode } from 'react';

export type BillingCycle = 'monthly' | 'yearly';

export interface PricingPlanLike {
  tier: string;
  name: string;
  description: string | null;
  priceMonthly: number;
  priceYearly: number;
  badge?: string | null;
}

export interface PricingPlanCardContext {
  billing: BillingCycle;
  isHighlighted: boolean;
  isFree: boolean;
  isSelected: boolean;
  priceCents: number;
  price: string;
  pricePeriod: string;
  yearlyEquivalent: string | null;
}

export function sortPricingPlans<T extends { tier: string; sortOrder?: number; sort_order?: number }>(plans: T[]): T[] {
  return [...plans].sort((a, b) => {
    const aFree = a.tier === 'free' ? 1 : 0;
    const bFree = b.tier === 'free' ? 1 : 0;
    if (aFree !== bFree) return aFree - bFree;

    const aOrder = a.sortOrder ?? a.sort_order ?? 0;
    const bOrder = b.sortOrder ?? b.sort_order ?? 0;
    return aOrder - bOrder;
  });
}

export function formatPricingAmount(cents: number): string {
  const amount = cents / 100;
  return amount % 1 === 0 ? String(amount) : amount.toFixed(2);
}

function cardStateClasses(highlighted: boolean, selected?: boolean) {
  if (selected) {
    return 'border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-950/30';
  }

  if (highlighted) {
    return 'border-red-300 bg-white shadow-md shadow-red-950/5 dark:border-red-800 dark:bg-gray-950';
  }

  return 'border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-950 dark:hover:border-gray-600';
}

export function PricingBillingToggle({
  billing,
  onBillingChange,
  label,
}: {
  billing: BillingCycle;
  onBillingChange: (billing: BillingCycle) => void;
  label?: string;
}) {
  return (
    <div className="flex justify-center" data-testid="pricing-billing-toggle">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950/60">
        {label ? (
          <div className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {label}
          </div>
        ) : null}
        <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-900">
          <button
            type="button"
            onClick={() => onBillingChange('monthly')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              billing === 'monthly'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => onBillingChange('yearly')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              billing === 'yearly'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>
    </div>
  );
}

export function PricingPlanCard({
  plan,
  billing,
  highlighted = false,
  selected = false,
  topSlot,
  children,
  footer,
  htmlFor,
}: {
  plan: PricingPlanLike;
  billing: BillingCycle;
  highlighted?: boolean;
  selected?: boolean;
  topSlot?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  htmlFor?: string;
}) {
  const priceCents = billing === 'yearly' ? plan.priceYearly : plan.priceMonthly;
  const price = formatPricingAmount(priceCents);
  const pricePeriod = priceCents === 0 ? '' : billing === 'yearly' ? '/yr' : '/mo';
  const yearlyEquivalent = billing === 'yearly' && priceCents > 0
    ? `$${(plan.priceYearly / 1200).toFixed(2)}/mo billed annually`
    : null;

  const Wrapper = htmlFor ? 'label' : 'div';

  return (
    <Wrapper
      {...(htmlFor ? { htmlFor } : {})}
      className={`relative block rounded-xl border p-4 transition-colors ${htmlFor ? 'cursor-pointer' : ''} ${cardStateClasses(highlighted, selected)}`}
      data-testid="pricing-plan-card"
      data-tier={plan.tier}
    >
      {highlighted && !selected ? (
        <span className="absolute right-4 top-4 rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
          Most Popular
        </span>
      ) : null}

      {topSlot}

      <div className="flex items-start justify-between gap-3">
        <span>
          <span className="block font-semibold text-gray-900 dark:text-white">{plan.name}</span>
          <span className="mt-1 block text-sm font-medium text-red-600 dark:text-red-400">
            ${price}{pricePeriod}
          </span>
        </span>
        {plan.badge ? (
          <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">{plan.badge}</span>
        ) : null}
      </div>

      {yearlyEquivalent ? (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{yearlyEquivalent}</p>
      ) : null}

      <span className="mt-3 block text-sm text-gray-600 dark:text-gray-300">{plan.description}</span>

      {children ? <div className="mt-4">{children}</div> : null}

      {footer ? <div className="mt-4">{footer}</div> : null}

      {selected ? (
        <span className="mt-4 block text-xs font-semibold text-red-600 dark:text-red-400">Selected plan</span>
      ) : null}
    </Wrapper>
  );
}
