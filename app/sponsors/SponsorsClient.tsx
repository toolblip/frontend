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

  const handleClaim = (slot: SponsorSlot) => {
    setAmount(String(Math.round(slot.balance_cents / 100) + 1));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const dollars = Number(amount);
    if (!url.trim() || !name.trim()) {
      setFormError('URL and name are required.');
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
          name: name.trim(),
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

  const rows = useMemo(() => board?.data ?? [], [board]);

  return (
    <div className="tb-v2-container" style={{ paddingTop: 40, paddingBottom: 64 }}>
      <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
        Sponsors
      </h1>
      <p style={{ color: 'var(--fg-2)', maxWidth: 640, marginBottom: 8 }}>
        Bid for a spot in the top-3 sponsor strip shown on every Toolblip page. Rank is
        decided purely by bid amount — anyone can be outbid at any time.
      </p>
      <p style={{ color: 'var(--fg-3)', fontSize: 13, maxWidth: 640, marginBottom: 28 }}>
        The top 3 reset to $0 on the 1st of every month — they got their placement.
        Everyone else&apos;s credit rolls over as next month&apos;s starting balance, so a
        near-miss this month is a head start next month.
        {countdown && <> Next reset in <strong>{countdown}</strong>.</>}
      </p>

      {checkoutStatus === 'success' && (
        <div className="tb-v2-sponsor-banner tb-v2-sponsor-banner-ok">
          Payment received — your bid is live on the leaderboard below.
        </div>
      )}
      {checkoutStatus === 'cancelled' && (
        <div className="tb-v2-sponsor-banner">Checkout cancelled — no charge was made.</div>
      )}

      <div className="tb-v2-sponsor-layout">
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Leaderboard</h2>
          {loadError && <p style={{ color: 'var(--fg-3)' }}>Couldn&apos;t load the leaderboard. Try refreshing.</p>}
          {!loadError && rows.length === 0 && (
            <p style={{ color: 'var(--fg-3)' }}>No sponsors yet — be the first.</p>
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

        <div ref={formRef}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Bid Yours</h2>
          <form onSubmit={handleSubmit} className="tb-v2-sponsor-form">
            <label>
              URL
              <input
                className="tb-v2-input"
                type="url"
                required
                placeholder="https://yourproduct.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </label>
            <label>
              Name
              <input
                className="tb-v2-input"
                type="text"
                required
                maxLength={80}
                placeholder="Your Product"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Tagline <span style={{ color: 'var(--fg-3)', fontWeight: 400 }}>(optional, 60 chars)</span>
              <input
                className="tb-v2-input"
                type="text"
                maxLength={60}
                placeholder="Ship faster with…"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </label>
            <label>
              Amount (USD)
              <input
                className="tb-v2-input"
                type="number"
                min={minBidDollars}
                step={1}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            {formError && <p style={{ color: 'var(--red)', fontSize: 13 }}>{formError}</p>}
            <button type="submit" className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg" disabled={submitting}>
              {submitting ? 'Starting checkout…' : 'Sponsor Toolblip'}
            </button>
            <p style={{ color: 'var(--fg-3)', fontSize: 12 }}>
              You&apos;ll pay via Stripe Checkout. No account needed — we&apos;ll email you a link
              to manage your listing.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
