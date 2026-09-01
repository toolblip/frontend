'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import useShowAds from '@/hooks/useShowAds';
import SponsorAvatar from '@/components/v2/SponsorAvatar';
import {
  displayIdentity,
  fetchSponsorsTop,
  formatBid,
  pingSponsorClick,
  readSponsorsTopCache,
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
  const showAds = useShowAds();
  const [slots, setSlots] = useState<SponsorSlot[] | null>(() => readSponsorsTopCache()?.slots ?? null);
  const [minBidCents, setMinBidCents] = useState(() => Math.max(100, readSponsorsTopCache()?.min_bid_cents ?? 100));

  useEffect(() => {
    let cancelled = false;
    fetchSponsorsTop()
      .then((data) => {
        if (cancelled) return;
        writeSponsorsTopCache(data);
        setSlots(data.slots);
        setMinBidCents(Math.max(100, data.min_bid_cents));
      })
      .catch(() => {
        // Leave any cached slots in place; an empty strip on fetch failure
        // is preferable to an error state on every page.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (SUPPRESSED_PREFIXES.some((p) => pathname === p || pathname?.startsWith(`${p}/`))) return null;
  if (!showAds) return null;

  const bySlot = (rank: number): SponsorSlot | undefined => slots?.find((s) => s.rank === rank);
  const first = bySlot(1);
  const second = bySlot(2);
  const third = bySlot(3);
  const loading = slots === null;

  return (
    <div className="tb-v2-sponsor-strip">
      <div className="tb-v2-container">
        <div className="tb-v2-sponsor-grid">
          <SlotCard rank={2} slot={second} loading={loading} minBidCents={minBidCents} className="tb-v2-sponsor-slot-2" />
          <SlotCard rank={1} slot={first} loading={loading} minBidCents={minBidCents} className="tb-v2-sponsor-slot-1" primary />
          <SlotCard rank={3} slot={third} loading={loading} minBidCents={minBidCents} className="tb-v2-sponsor-slot-3" />
          <div className="tb-v2-sponsor-bidyours-wrap">
            <Link href="/sponsors" className="tb-v2-sponsor-bidyours tb-v2-btn tb-v2-btn-primary">
              <span>Outbid</span>
              <span>Now →</span>
            </Link>
            <span className="tb-v2-sponsor-disclosure">Sponsored</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlotCard({
  rank,
  slot,
  loading,
  minBidCents,
  className,
  primary,
}: {
  rank: number;
  slot?: SponsorSlot;
  loading: boolean;
  minBidCents: number;
  className: string;
  primary?: boolean;
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
        onClick={() => {
          if (!slot.placeholder) pingSponsorClick(slot.id);
        }}
        className="tb-v2-sponsor-card"
        data-testid={primary ? 'sponsor-strip-primary' : 'sponsor-strip-slot'}
      >
        <span className="tb-v2-sponsor-rank">#{rank}</span>
        <SponsorAvatar domain={slot.domain} name={slot.name} className="tb-v2-sponsor-card-avatar" />
        <div className="tb-v2-sponsor-card-copy">
          <span className="tb-v2-sponsor-name">{displayIdentity(slot.domain)}</span>
          {slot.tagline && <span className="tb-v2-sponsor-tagline">{slot.tagline}</span>}
          <span className="tb-v2-sponsor-meta">
            {formatBid(slot.balance_cents)}
            <span className="tb-v2-sponsor-live-dot" aria-hidden="true" />
            {slot.clicks} clicks
          </span>
        </div>
      </a>
      <Link href="/sponsors" className="tb-v2-sponsor-card-claim" data-testid="sponsor-strip-claim">
        claim this rank for {formatBid(claimPriceCents)}
      </Link>
    </div>
  );
}
