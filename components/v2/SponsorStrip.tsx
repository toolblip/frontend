'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useShowAdsState } from '@/hooks/useShowAds';
import SponsorAvatar from '@/components/v2/SponsorAvatar';
import {
  applySponsorClick,
  applySponsorViews,
  displayIdentity,
  fetchSponsorsTop,
  formatBid,
  formatCompactCount,
  formatSponsorStat,
  mergeSponsorCounts,
  pingSponsorClick,
  pingSponsorViews,
  readSponsorsTopCache,
  shouldRecordSponsorViews,
  withSponsorSource,
  writeSponsorsTopCache,
  type SponsorSlot,
} from '@/lib/sponsors';

// Suppressed inside logged-in app surfaces (a sponsor strip above an admin
// screen or the dashboard reads as a bug, not a feature), on /sponsors itself
// (the whole page is already about sponsors), and on /pricing (undercuts the
// "no ads" pitch for Pro). Shown on every other page.
const SUPPRESSED_PREFIXES = ['/dashboard', '/account', '/admin', '/sponsors', '/pricing'];

export default function SponsorStrip() {
  const pathname = usePathname();
  const suppressed = SUPPRESSED_PREFIXES.some((p) => pathname === p || pathname?.startsWith(`${p}/`));
  const { showAds, loading: eligibilityLoading } = useShowAdsState();
  const [slots, setSlots] = useState<SponsorSlot[] | null>(() => readSponsorsTopCache()?.slots ?? null);
  const [minBidCents, setMinBidCents] = useState(() => Math.max(100, readSponsorsTopCache()?.min_bid_cents ?? 100));

  const handleClick = (slot: SponsorSlot) => {
    void pingSponsorClick(slot).then(result => {
      if (result) setSlots(current => current && applySponsorClick(current, slot, result));
    });
  };

  useEffect(() => {
    if (suppressed) return;

    let cancelled = false;
    fetchSponsorsTop()
      .then((data) => {
        if (cancelled) return;
        setSlots((current) => {
          const next = mergeSponsorCounts(current, data.slots);
          writeSponsorsTopCache({ ...data, slots: next });
          return next;
        });
        setMinBidCents(Math.max(100, data.min_bid_cents));
      })
      .catch(() => {
        // Leave any cached slots in place; an empty strip on fetch failure
        // is preferable to an error state on every page.
      });
    return () => {
      cancelled = true;
    };
  }, [suppressed]);

  useEffect(() => {
    if (suppressed || eligibilityLoading || !showAds || !slots?.length) return;
    if (!shouldRecordSponsorViews('strip', pathname ?? '/', slots)) return;
    const targets = slots;
    void pingSponsorViews(targets).then((ok) => {
      if (ok) setSlots((current) => current && applySponsorViews(current, targets));
    });
  }, [suppressed, eligibilityLoading, showAds, slots, pathname]);

  if (suppressed) return null;
  if (!eligibilityLoading && !showAds) return null;

  const bySlot = (rank: number): SponsorSlot | undefined => slots?.find((s) => s.rank === rank);
  const first = bySlot(1);
  const second = bySlot(2);
  const third = bySlot(3);
  const loading = eligibilityLoading || slots === null;

  return (
    <div className="tb-v2-sponsor-strip" aria-busy={loading}>
      <div className="tb-v2-container">
        <div className="tb-v2-sponsor-grid">
          <SlotCard slot={second} loading={loading} minBidCents={minBidCents} className="tb-v2-sponsor-slot-2" onSponsorClick={handleClick} />
          <SlotCard slot={first} loading={loading} minBidCents={minBidCents} className="tb-v2-sponsor-slot-1" onSponsorClick={handleClick} primary />
          <SlotCard slot={third} loading={loading} minBidCents={minBidCents} className="tb-v2-sponsor-slot-3" onSponsorClick={handleClick} />
          <div className="tb-v2-sponsor-bidyours-wrap">
            <Link
              href="/sponsors"
              className="tb-v2-sponsor-bidyours tb-v2-btn tb-v2-btn-primary"
              style={eligibilityLoading ? { visibility: 'hidden' } : undefined}
              tabIndex={eligibilityLoading ? -1 : undefined}
              aria-hidden={eligibilityLoading || undefined}
            >
              <span>Outbid</span>
              <span>Now →</span>
            </Link>
            <span
              className="tb-v2-sponsor-disclosure"
              style={eligibilityLoading ? { visibility: 'hidden' } : undefined}
              aria-hidden={eligibilityLoading || undefined}
            >
              Sponsored
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlotCard({
  slot,
  loading,
  minBidCents,
  className,
  primary,
  onSponsorClick,
}: {
  slot?: SponsorSlot;
  loading: boolean;
  minBidCents: number;
  className: string;
  primary?: boolean;
  onSponsorClick: (slot: SponsorSlot) => void;
}) {
  if (loading) {
    return <div className={`tb-v2-sponsor-card tb-v2-sponsor-card-skeleton ${className}`} aria-hidden="true" />;
  }

  if (!slot) {
    return (
      <Link href="/sponsors" className={`tb-v2-sponsor-card tb-v2-sponsor-card-empty ${className}`}>
        <span className="tb-v2-sponsor-empty-label">Bid Now</span>
      </Link>
    );
  }

  // Same floor as /sponsors: current balance + $1, never below the site minimum.
  const claimPriceCents = Math.max(slot.balance_cents + 100, minBidCents);

  return (
    <div className={`tb-v2-sponsor-card-wrap ${className}`}>
      <a
        href={withSponsorSource(slot.url, 'strip')}
        target="_blank"
        rel="sponsored nofollow noopener"
        onClick={() => onSponsorClick(slot)}
        className="tb-v2-sponsor-card"
        data-testid={primary ? 'sponsor-strip-primary' : 'sponsor-strip-slot'}
      >
        <SponsorAvatar domain={slot.domain} name={slot.name} className="tb-v2-sponsor-card-avatar" />
        <div className="tb-v2-sponsor-card-copy">
          <span className="tb-v2-sponsor-name">{displayIdentity(slot.domain)}</span>
          {slot.tagline && <span className="tb-v2-sponsor-tagline">{slot.tagline}</span>}
          <span className="tb-v2-sponsor-meta">
            {formatBid(slot.balance_cents)}
            <span className="tb-v2-sponsor-live-dot" aria-hidden="true" />
            <SponsorStat icon={<EyeIcon />} count={slot.views} singular="view" plural="views" />
            <SponsorStat icon={<ClickIcon />} count={slot.clicks} singular="click" plural="clicks" />
          </span>
        </div>
      </a>
      <Link href="/sponsors" className="tb-v2-sponsor-card-claim" data-testid="sponsor-strip-claim">
        claim this rank for {formatBid(claimPriceCents)}
      </Link>
    </div>
  );
}

function SponsorStat({
  icon,
  count,
  singular,
  plural,
}: {
  icon: ReactNode;
  count: number;
  singular: string;
  plural: string;
}) {
  return (
    <span className="tb-v2-sponsor-stat" aria-label={formatSponsorStat(count, singular, plural)}>
      {icon}
      <span>{formatCompactCount(count)}</span>
    </span>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ClickIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4l7 16 2.5-6.5L20 11 4 4z" />
    </svg>
  );
}
