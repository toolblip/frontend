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

function billingToggleButtonClasses(active: boolean) {
  return [
    'tb-v2-pricing-toggle-btn',
    active ? 'on' : '',
  ].filter(Boolean).join(' ');
}

export function PricingBillingToggle({
  billing,
  onBillingChange,
  label,
  centered = false,
}: {
  billing: BillingCycle;
  onBillingChange: (billing: BillingCycle) => void;
  label?: string;
  centered?: boolean;
}) {
  const toggle = (
    <div className="tb-v2-pricing-toggle" data-testid="pricing-billing-toggle">
      <button
        type="button"
        onClick={() => onBillingChange('monthly')}
        className={billingToggleButtonClasses(billing === 'monthly')}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onBillingChange('yearly')}
        className={billingToggleButtonClasses(billing === 'yearly')}
      >
        Yearly
      </button>
    </div>
  );

  if (label) {
    return (
      <div className={centered ? 'tb-v2-pricing-period-row centered' : 'tb-v2-pricing-period-row'}>
        <span className="tb-v2-pricing-period-label">{label}</span>
        {toggle}
      </div>
    );
  }

  return <div className={centered ? 'flex justify-center' : 'flex justify-center'}>{toggle}</div>;
}

export function PricingPlanCard({
  plan,
  billing,
  highlighted = false,
  selected = false,
  tone = 'default',
  topSlot,
  children,
  footer,
  htmlFor,
  className,
}: {
  plan: PricingPlanLike;
  billing: BillingCycle;
  highlighted?: boolean;
  selected?: boolean;
  tone?: 'default' | 'light' | 'plain';
  topSlot?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  const priceCents = billing === 'yearly' ? plan.priceYearly : plan.priceMonthly;
  const price = formatPricingAmount(priceCents);
  const pricePeriod = priceCents === 0 ? '' : billing === 'yearly' ? '/yr' : '/mo';
  const yearlyEquivalent = billing === 'yearly' && priceCents > 0
    ? `$${(plan.priceYearly / 1200).toFixed(2)}/mo billed annually`
    : null;

  const Wrapper = htmlFor ? 'label' : 'div';
  const wrapperClasses = [
    'tb-v2-pricing-card',
    'h-full',
    'lg:min-h-[440px]',
    tone === 'light' ? 'light' : '',
    tone === 'plain' ? 'plain' : '',
    highlighted && !selected ? 'hot' : '',
    selected ? 'selected' : '',
    htmlFor ? 'cursor-pointer' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <Wrapper
      {...(htmlFor ? { htmlFor } : {})}
      className={wrapperClasses}
      data-testid="pricing-plan-card"
      data-tier={plan.tier}
    >
      {plan.badge ? (
        <span className="absolute right-4 top-4 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white">
          {plan.badge}
        </span>
      ) : null}

      {topSlot ? <div className="mb-4">{topSlot}</div> : null}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="tb-v2-pricing-card-name">{plan.name}</div>
          <div className="tb-v2-pricing-card-price">
            <span className="tb-v2-pricing-card-price-amt">${price}</span>
            {pricePeriod ? <span className="tb-v2-pricing-card-price-period">{pricePeriod}</span> : null}
          </div>
          {yearlyEquivalent ? <div className="tb-v2-pricing-card-sub">{yearlyEquivalent}</div> : null}
        </div>
      </div>

      <div className="tb-v2-pricing-card-desc">{plan.description}</div>

      {children ? <div className="mt-4">{children}</div> : null}

      {footer ? <div className="mt-auto pt-5">{footer}</div> : null}

    </Wrapper>
  );
}
