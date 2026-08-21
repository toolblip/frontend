'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { IconX } from '@/components/v2/icons';
import {
  apiPath,
  fetchSponsorsLeaderboard,
  formatBid,
  formatTimeAgo,
  type SponsorSlot,
  type SponsorsLeaderboardResponse,
} from '@/lib/sponsors';

const AVATAR_COLORS = ['#d93030', '#a855f7', '#0ea5e9', '#16a34a', '#f59e0b', '#ec4899'];

function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function SponsorAvatar({ domain, name }: { domain: string; name: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <span
        className="tb-v2-sponsor-row-avatar"
        style={{ background: avatarColor(domain) }}
        aria-hidden="true"
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={`https://unavatar.io/${domain}`}
      alt=""
      className="tb-v2-sponsor-row-avatar"
      onError={() => setError(true)}
    />
  );
}

/** The hostname to fetch a favicon preview for, or '' if the input isn't a
 * recognizable domain yet (empty, an @handle, or still mid-typing). */
function previewDomainFor(input: string): string {
  const trimmed = input.trim();
  if (trimmed === '' || trimmed.startsWith('@')) return '';
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const host = new URL(withScheme).hostname.toLowerCase().replace(/^www\./, '');
    return host.includes('.') ? host : '';
  } catch {
    return '';
  }
}

export default function SponsorsClient() {
  const searchParams = useSearchParams();
  const checkoutStatus = searchParams.get('checkout');

  const [board, setBoard] = useState<SponsorsLeaderboardResponse | null>(null);

  const [url, setUrl] = useState('');
  const previewDomain = useMemo(() => previewDomainFor(url), [url]);
  const [faviconError, setFaviconError] = useState(false);
  useEffect(() => setFaviconError(false), [previewDomain]);
  const [amount, setAmount] = useState('1');
  const [amountTouched, setAmountTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [rulesOpen, setRulesOpen] = useState(false);

  useEffect(() => {
    fetchSponsorsLeaderboard()
      .then(setBoard)
      .catch(() => {
        // Leave board null — the empty leaderboard state ("No bid yet.")
        // covers a fetch failure the same as a genuinely empty board.
      });
  }, []);

  const minBidDollars = board ? Math.round(board.min_bid_cents / 100) : 1;
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

  const focusBidInput = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    urlInputRef.current?.focus();
    urlInputRef.current?.select();
  };

  useEffect(() => {
    if (!rulesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setRulesOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [rulesOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const dollars = Number(amount);
    if (!url.trim()) {
      setFormError('A URL is required.');
      return;
    }
    if (!Number.isFinite(dollars) || Math.round(dollars * 100) < (board?.min_bid_cents ?? 100)) {
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
    <div className="tb-v2-container" style={{ position: 'relative', paddingTop: 40, paddingBottom: 64 }}>
      <h1 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        Sponsors
      </h1>

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
              {url.trim().startsWith('@') ? (
                <IconX className="tb-v2-ic tb-v2-sponsor-bid-icon" aria-hidden="true" />
              ) : previewDomain && !faviconError ? (
                <img
                  src={`https://unavatar.io/${previewDomain}`}
                  alt=""
                  className="tb-v2-sponsor-bid-favicon"
                  onError={() => setFaviconError(true)}
                />
              ) : (
                <span className="tb-v2-sponsor-bid-icon" aria-hidden="true">🌐</span>
              )}
              <input
                ref={urlInputRef}
                className="tb-v2-sponsor-bid-input"
                type="text"
                required
                placeholder="Your product URL or @handle"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button type="submit" className="tb-v2-btn tb-v2-btn-primary tb-v2-sponsor-bid-cta" disabled={submitting}>
                {submitting ? '…' : 'Outbid'}
              </button>
            </div>
            {formError && <p style={{ color: 'var(--red)', fontSize: 13 }}>{formError}</p>}
            <p className="tb-v2-sponsor-fineprint">
              Already listed? Enter the same URL or @handle and up your bid to move up.
            </p>
          </form>
        </div>

        <div>
          <h2 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            Leaderboard
          </h2>
          <div className="tb-v2-sponsor-table">
            {rows.length === 0 && (
              <div className="tb-v2-sponsor-empty-board">
                <p>No bid yet.</p>
                <button type="button" className="tb-v2-btn tb-v2-btn-primary" onClick={focusBidInput}>
                  Bid Now
                </button>
              </div>
            )}
            {rows.map((row) => {
              const isTop = row.rank === 1;
              const timeAgo = formatTimeAgo(row.last_bid_at);
              return (
                <div key={row.id} className={`tb-v2-sponsor-row${isTop ? ' tb-v2-sponsor-row-top' : ''}`}>
                  {isTop && (
                    <button
                      type="button"
                      className="tb-v2-sponsor-row-claim-badge"
                      onClick={() => handleClaim(row)}
                    >
                      Claim this rank for {formatBid(row.balance_cents + 100)}
                    </button>
                  )}
                  <span className="tb-v2-sponsor-row-rank">#{row.rank}</span>
                  <SponsorAvatar domain={row.domain} name={row.name} />
                  <div className="tb-v2-sponsor-row-main">
                    <a href={row.url} target="_blank" rel="sponsored nofollow noopener">
                      {row.name}
                    </a>
                    {row.tagline && <span className="tb-v2-sponsor-row-tagline">{row.tagline}</span>}
                    <span className="tb-v2-sponsor-row-meta">
                      {timeAgo}{timeAgo ? ' · ' : ''}{row.clicks} clicks
                    </span>
                  </div>
                  <span className="tb-v2-sponsor-row-balance">{formatBid(row.balance_cents)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, marginTop: 40, marginBottom: 4 }}>
        <button
          type="button"
          onClick={() => setRulesOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            font: 'inherit',
            color: 'var(--fg-2)',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          Rules
        </button>
      </p>
      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--fg-3)' }}>
        Inspired by{' '}
        <a href="https://outbid.lol/" target="_blank" rel="noopener noreferrer">
          outbid.lol
        </a>
      </p>

      {rulesOpen && (
        <div
          className="tb-v2-sponsor-rules-backdrop"
          onClick={() => setRulesOpen(false)}
          role="presentation"
        >
          <div
            className="tb-v2-sponsor-rules-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Sponsors rules"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="tb-v2-sponsor-rules-close"
              onClick={() => setRulesOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
              Rules
            </h2>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              Credit rolls over automatically every month, except for whoever is in the
              top 3 when the month closes, and anyone who has held a top-3 spot for at
              least an hour during the month.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
