'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  apiPath,
  fetchSponsorsLeaderboard,
  formatBid,
  type SponsorSlot,
  type SponsorsLeaderboardResponse,
} from '@/lib/sponsors';

function useCountdown(periodEndsAt: string | null): string {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!periodEndsAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [periodEndsAt]);

  if (!periodEndsAt) return '';
  const diffMs = new Date(periodEndsAt).getTime() - now;
  if (diffMs <= 0) return 'resetting…';

  const days = Math.floor(diffMs / 86_400_000);
  const hours = Math.floor((diffMs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diffMs % 3_600_000) / 60_000);
  return `${days}d ${hours}h ${minutes}m`;
}

export default function SponsorsClient() {
  const searchParams = useSearchParams();
  const checkoutStatus = searchParams.get('checkout');

  const [board, setBoard] = useState<SponsorsLeaderboardResponse | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [amount, setAmount] = useState('10');
  const [amountTouched, setAmountTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSponsorsLeaderboard()
      .then(setBoard)
      .catch(() => setLoadError(true));
  }, []);

  const countdown = useCountdown(board?.period_ends_at ?? null);
  const minBidDollars = board ? Math.round(board.min_bid_cents / 100) : 10;
  const rows = useMemo(() => board?.data ?? [], [board]);

  // Price to take #1 right now — same framing as the reference: a bid below
  // this still lands you on the board at whatever rank it can reach.
  const topPriceDollars = useMemo(() => {
    const topBalanceCents = rows[0]?.balance_cents ?? 0;
    return Math.max(Math.round(topBalanceCents / 100) + 1, minBidDollars);
  }, [rows, minBidDollars]);

  useEffect(() => {
    if (!amountTouched) setAmount(String(topPriceDollars));
  }, [topPriceDollars, amountTouched]);

  const step = (delta: number) => {
    setAmountTouched(true);
    setAmount((prev) => String(Math.max(minBidDollars, (Number(prev) || minBidDollars) + delta)));
  };

  const handleClaim = (slot: SponsorSlot) => {
    setAmountTouched(true);
    setAmount(String(Math.round(slot.balance_cents / 100) + 1));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const dollars = Number(amount);
    if (!url.trim()) {
      setFormError('A URL is required.');
      return;
    }
    if (!Number.isFinite(dollars) || Math.round(dollars * 100) < (board?.min_bid_cents ?? 1000)) {
      setFormError(`Minimum bid is $${minBidDollars}.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(apiPath('/api/sponsors/checkout'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          name: name.trim() || undefined,
          tagline: tagline.trim() || undefined,
          amount_cents: Math.round(dollars * 100),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data?.message || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setFormError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="tb-v2-container" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
        Sponsors
      </h1>
      <p style={{ color: 'var(--fg-2)', maxWidth: 640, marginBottom: 28 }}>
        Top 3 bids get a spot on every page. Resets monthly, others roll over.
        {countdown && <> Next reset: <strong>{countdown}</strong>.</>}
      </p>

      {checkoutStatus === 'success' && (
        <div className="tb-v2-sponsor-banner tb-v2-sponsor-banner-ok">
          Payment received. Your bid is live below.
        </div>
      )}
      {checkoutStatus === 'cancelled' && (
        <div className="tb-v2-sponsor-banner">Checkout cancelled.</div>
      )}

      <div className="tb-v2-sponsor-layout">
        <div ref={formRef}>
          <form onSubmit={handleSubmit} className="tb-v2-sponsor-form">
            <div className="tb-v2-sponsor-claim-hero">
              <span>Claim #1 for</span>
              <button type="button" className="tb-v2-sponsor-stepper" onClick={() => step(-1)} aria-label="Decrease bid">−</button>
              <span className="tb-v2-sponsor-claim-price">${Number(amount || 0).toLocaleString('en-US')}</span>
              <button type="button" className="tb-v2-sponsor-stepper" onClick={() => step(1)} aria-label="Increase bid">+</button>
            </div>
            <p className="tb-v2-sponsor-explainer">
              <strong>New spots start at ${minBidDollars}.</strong> Bidding less than the #1
              price still puts you on the board at whatever rank it can take.
            </p>

            <div className="tb-v2-sponsor-bid-row">
              <span className="tb-v2-sponsor-bid-icon" aria-hidden="true">🌐</span>
              <input
                className="tb-v2-sponsor-bid-input"
                type="url"
                required
                placeholder="Your product URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button type="submit" className="tb-v2-btn tb-v2-btn-primary tb-v2-sponsor-bid-cta" disabled={submitting}>
                {submitting ? '…' : 'Outbid'}
              </button>
            </div>
            {formError && <p style={{ color: 'var(--red)', fontSize: 13 }}>{formError}</p>}
            <p className="tb-v2-sponsor-fineprint">
              Already listed? Enter the same URL and up your bid to move up.
            </p>

            <div className="tb-v2-sponsor-secondary-fields">
              <input
                className="tb-v2-input"
                type="text"
                maxLength={80}
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="tb-v2-input"
                type="text"
                maxLength={60}
                placeholder="Tagline (optional)"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>
            <p style={{ color: 'var(--fg-3)', fontSize: 12 }}>
              Paid via Stripe Checkout. No account needed.
            </p>
          </form>
        </div>

        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Leaderboard</h2>
          {loadError && <p style={{ color: 'var(--fg-3)' }}>Couldn&apos;t load the leaderboard. Try refreshing.</p>}
          {!loadError && rows.length === 0 && (
            <p style={{ color: 'var(--fg-3)' }}>No sponsors yet.</p>
          )}
          <div className="tb-v2-sponsor-table">
            {rows.map((row) => (
              <div key={row.id} className="tb-v2-sponsor-row">
                <span className="tb-v2-sponsor-row-rank">#{row.rank}</span>
                <div className="tb-v2-sponsor-row-main">
                  <a href={row.url} target="_blank" rel="sponsored nofollow noopener">
                    {row.name}
                  </a>
                  {row.tagline && <span className="tb-v2-sponsor-row-tagline">{row.tagline}</span>}
                </div>
                <span className="tb-v2-sponsor-row-meta">{row.clicks} clicks</span>
                <span className="tb-v2-sponsor-row-balance">{formatBid(row.balance_cents)}</span>
                <button
                  type="button"
                  className="tb-v2-btn tb-v2-btn-sm"
                  onClick={() => handleClaim(row)}
                >
                  Claim for {formatBid(row.balance_cents + 100)}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
