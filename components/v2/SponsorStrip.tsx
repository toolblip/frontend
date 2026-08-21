'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import useShowAds from '@/hooks/useShowAds';
import {
  fetchSponsorsTop,
  formatBid,
  pingSponsorClick,
  readSponsorsTopCache,
  writeSponsorsTopCache,
  type SponsorSlot,
} from '@/lib/sponsors';

// Suppressed inside logged-in app surfaces — a sponsor strip above an admin
// screen or the dashboard reads as a bug, not a feature.
const SUPPRESSED_PREFIXES = ['/dashboard', '/account', '/admin'];

export default function SponsorStrip() {
  const pathname = usePathname();
  const showAds = useShowAds();
  const [slots, setSlots] = useState<SponsorSlot[] | null>(() => readSponsorsTopCache()?.slots ?? null);

  useEffect(() => {
    let cancelled = false;
    fetchSponsorsTop()
      .then((data) => {
        if (cancelled) return;
        writeSponsorsTopCache(data);
        setSlots(data.slots);
      })
      .catch(() => {
        // Leave any cached slots in place; an empty strip on fetch failure
        // is preferable to an error state on every page.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (SUPPRESSED_PREFIXES.some((p) => pathname?.startsWith(p))) return null;
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
          <SlotCard rank={2} slot={second} loading={loading} className="tb-v2-sponsor-slot-2" />
          <SlotCard rank={1} slot={first} loading={loading} className="tb-v2-sponsor-slot-1" primary />
          <SlotCard rank={3} slot={third} loading={loading} className="tb-v2-sponsor-slot-3" />
          {!loading && (
            <div className="tb-v2-sponsor-bidyours">
              <Link href="/sponsors">Bid Yours →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SlotCard({
  rank,
  slot,
  loading,
  className,
  primary,
}: {
  rank: number;
  slot?: SponsorSlot;
  loading: boolean;
  className: string;
  primary?: boolean;
}) {
  if (loading) {
    return <div className={`tb-v2-sponsor-card tb-v2-sponsor-card-skeleton ${className}`} aria-hidden="true" />;
  }

  if (!slot) {
    return (
      <Link href="/sponsors" className={`tb-v2-sponsor-card tb-v2-sponsor-card-empty ${className}`}>
        <span className="tb-v2-sponsor-empty-label">Your spot</span>
        <span className="tb-v2-sponsor-empty-cta">Bid from $10</span>
      </Link>
    );
  }

  return (
    <a
      href={slot.url}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={() => pingSponsorClick(slot.id)}
      className={`tb-v2-sponsor-card ${className}`}
      data-testid={primary ? 'sponsor-strip-primary' : 'sponsor-strip-slot'}
    >
      <span className="tb-v2-sponsor-rank">#{rank}</span>
      <span className="tb-v2-sponsor-name">{slot.name}</span>
      {slot.tagline && <span className="tb-v2-sponsor-tagline">{slot.tagline}</span>}
      <span className="tb-v2-sponsor-meta">{formatBid(slot.balance_cents)} · {slot.clicks} clicks</span>
    </a>
  );
}
