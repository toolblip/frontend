'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { IconRefresh, IconX } from '@/components/v2/icons';
import SponsorAvatar, { sponsorFaviconSrc } from '@/components/v2/SponsorAvatar';
import {
  apiPath,
  displayIdentity,
  fetchSponsorsLeaderboard,
  formatBid,
  formatTimeAgo,
  minutesSince,
  pingSponsorClick,
  withSponsorSource,
  type SponsorSlot,
  type SponsorsLeaderboardResponse,
} from '@/lib/sponsors';

// Rank 1-3 get a card treatment that fades by rank (100% / 65% / 42%);
// rank 4+ all render identically as a plain flat list (see the outbid.lol
// reference) — color-mix blends the red accent toward the neutral border/
// tint color by that share, rather than duplicating three near-identical
// color pairs by hand.
const CARD_TINT: Record<number, number> = { 1: 1, 2: 0.65, 3: 0.42 };

// Size hierarchy layered on top of the color hierarchy — rank 1 reads
// biggest, tapering down to the rank 4+ baseline (100%, i.e. unscaled).
// Card padding, avatar, and every card-row font-size below scale by this
// same ratio so the whole row grows/shrinks as one proportional unit
// instead of just the text or just the avatar.
const CARD_SCALE: Record<number, number> = { 1: 1.1, 2: 1.05 };

const BASE_AVATAR_PX = 64;
const BASE_DOMAIN_FONT_PX = 19;
const BASE_TAGLINE_FONT_PX = 13;
const BASE_BALANCE_FONT_PX = 21;
const BASE_CARD_PADDING_Y = 22;
const BASE_CARD_PADDING_X = 26;
const BASE_RANK_PILL_MIN_WIDTH = 30;
const BASE_RANK_PILL_HEIGHT = 26;
const BASE_RANK_PILL_PADDING_X = 8;
const BASE_RANK_PILL_FONT_PX = 12;

function cardRowStyle(rank: number): React.CSSProperties | undefined {
  const t = CARD_TINT[rank];
  if (!t) return undefined;
  const scale = CARD_SCALE[rank] ?? 1;
  return {
    borderColor: `color-mix(in srgb, var(--red) ${t * 100}%, var(--line))`,
    background: `color-mix(in srgb, var(--red-tint) ${t * 100}%, var(--surface))`,
    padding: `${BASE_CARD_PADDING_Y * scale}px ${BASE_CARD_PADDING_X * scale}px`,
  };
}

// The rank number pill is never faded, even on rank 3 — only the card's own
// border/background follow the tint curve (see cardRowStyle above). Its
// size still follows CARD_SCALE, same as the rest of the card.
function cardRankBadgeStyle(rank: number): React.CSSProperties | undefined {
  if (!CARD_TINT[rank]) return undefined;
  const scale = CARD_SCALE[rank] ?? 1;
  return {
    background: 'var(--red)',
    minWidth: `${BASE_RANK_PILL_MIN_WIDTH * scale}px`,
    height: `${BASE_RANK_PILL_HEIGHT * scale}px`,
    padding: `0 ${BASE_RANK_PILL_PADDING_X * scale}px`,
    fontSize: `${BASE_RANK_PILL_FONT_PX * scale}px`,
  };
}

// A flat row (rank 4+) bid within the last 10 minutes gets a light,
// borderless tint so recent activity stands out from the plain list —
// independent of rank, unlike the top-3 card treatment. 10 minutes is a
// best-guess decay window inferred from the outbid.lol reference (a 5-min-old
// bid was still highlighted, an 11-13-min-old one wasn't); tune later if
// Harun wants it tighter/looser.
const RECENT_BID_MINUTES = 10;

function recentBidRowStyle(isRecentBid: boolean): React.CSSProperties | undefined {
  if (!isRecentBid) return undefined;
  return {
    background: 'color-mix(in srgb, var(--red) 12%, var(--surface))',
    borderRadius: 'var(--radius, 14px)',
  };
}

function SponsorRow({
  row,
  onClaim,
  minBidDollars,
}: {
  row: SponsorSlot;
  onClaim: (row: SponsorSlot) => void;
  minBidDollars: number;
}) {
  const isCard = row.rank <= 3;
  const timeAgo = formatTimeAgo(row.last_bid_at);
  const mins = minutesSince(row.last_bid_at);
  const isRecentBid = mins !== null && mins < RECENT_BID_MINUTES;
  const scale = isCard ? CARD_SCALE[row.rank] ?? 1 : 1;
  const claimPriceCents = Math.max(row.balance_cents + 100, minBidDollars * 100);

  return (
    <div
      className={`tb-v2-sponsor-row${isCard ? ' tb-v2-sponsor-row-card' : ' tb-v2-sponsor-row-flat'}`}
      style={isCard ? cardRowStyle(row.rank) : recentBidRowStyle(isRecentBid)}
    >
      <a
        href={withSponsorSource(row.url, 'leaderboard')}
        target="_blank"
        rel="sponsored nofollow noopener"
        onClick={() => pingSponsorClick(row.id)}
        className="tb-v2-sponsor-row-link"
      >
        <span
          className={`tb-v2-sponsor-row-rank${isCard ? ' tb-v2-sponsor-row-rank-card' : ''}`}
          style={isCard ? cardRankBadgeStyle(row.rank) : undefined}
        >
          #{row.rank}
        </span>
        <SponsorAvatar domain={row.domain} name={row.name} sizePx={isCard ? BASE_AVATAR_PX * scale : undefined} />
        <div className="tb-v2-sponsor-row-main">
          <span
            className="tb-v2-sponsor-row-domain"
            style={isCard ? { fontSize: `${BASE_DOMAIN_FONT_PX * scale}px` } : undefined}
          >
            {displayIdentity(row.domain)}
          </span>
          {row.tagline && (
            <span
              className="tb-v2-sponsor-row-tagline"
              style={isCard ? { fontSize: `${BASE_TAGLINE_FONT_PX * scale}px` } : undefined}
            >
              {row.tagline}
            </span>
          )}
          <span className="tb-v2-sponsor-row-meta">
            {timeAgo && (
              <>
                <span style={isRecentBid ? { color: 'var(--red)' } : undefined}>{timeAgo}</span>
                <span className="tb-v2-sponsor-live-dot" aria-hidden="true" />
              </>
            )}
            {row.clicks} clicks
          </span>
        </div>
        <div className="tb-v2-sponsor-row-price-wrap">
          <span
            className="tb-v2-sponsor-row-balance"
            style={isCard ? { fontSize: `${BASE_BALANCE_FONT_PX * scale}px` } : undefined}
          >
            {formatBid(row.balance_cents)}
          </span>
        </div>
      </a>
      <button type="button" className="tb-v2-sponsor-row-claim-badge" onClick={() => onClaim(row)}>
        claim this rank for {formatBid(claimPriceCents)}
      </button>
    </div>
  );
}

/** Prepends https:// to a bare domain (e.g. "crontinel.com") so it survives
 * PHP's FILTER_VALIDATE_URL, which rejects anything without a scheme — a
 * user typing without http(s):// is the common case, not an edge case.
 * Leaves an @handle or an already-schemed URL untouched. */
function normalizeUrlInput(input: string): string {
  const trimmed = input.trim();
  return trimmed.startsWith('@') || /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
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
  const [boardLoading, setBoardLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [url, setUrl] = useState('');
  const previewDomain = useMemo(() => previewDomainFor(url), [url]);
  const [faviconError, setFaviconError] = useState(false);
  useEffect(() => setFaviconError(false), [previewDomain]);
  const [amount, setAmount] = useState('1');
  const [amountTouched, setAmountTouched] = useState(false);
  const amountTouchedRef = useRef(amountTouched);
  useEffect(() => {
    amountTouchedRef.current = amountTouched;
  }, [amountTouched]);
  const [existingMatch, setExistingMatch] = useState<{ balanceCents: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [rulesOpen, setRulesOpen] = useState(false);

  // Shared by the initial mount fetch and the manual Refresh button — always
  // swallows errors the same way: keep any previous board on refresh failure;
  // first-load failure falls through to the empty-board state (never a stuck
  // skeleton or a scary error for a low-stakes background refresh).
  const loadLeaderboard = () =>
    fetchSponsorsLeaderboard()
      .then(setBoard)
      .catch(() => {
        setBoard((prev) =>
          prev ?? {
            period: '',
            period_ends_at: '',
            min_bid_cents: 100,
            page: 1,
            per_page: 50,
            total: 0,
            data: [],
          },
        );
      })
      .finally(() => setBoardLoading(false));

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const refreshLeaderboard = () => {
    setRefreshing(true);
    loadLeaderboard().finally(() => setRefreshing(false));
  };

  // Hard floor of $1 regardless of what the API reports — a $0 bid must
  // never be reachable even if min_bid_cents is ever misconfigured.
  const minBidDollars = Math.max(1, board ? Math.round(board.min_bid_cents / 100) : 1);
  const rows = useMemo(() => board?.data ?? [], [board]);

  // Price to take #1 right now — same framing as the reference: a bid below
  // this still lands you on the board at whatever rank it can reach.
  const topPriceDollars = useMemo(() => {
    const topBalanceCents = rows[0]?.balance_cents ?? 0;
    return Math.max(Math.round(topBalanceCents / 100) + 1, minBidDollars);
  }, [rows, minBidDollars]);

  // Live-computed from the current amount, not a click-set snapshot — the
  // hero rank number recalculates as the user types/steps, showing exactly
  // where this bid would rank right now on the current leaderboard.
  const computedRank = useMemo(() => {
    const amountCents = Math.round((Number(amount) || 0) * 100);
    return rows.filter((r) => r.balance_cents > amountCents).length + 1;
  }, [amount, rows]);

  useEffect(() => {
    if (!amountTouched && !existingMatch) setAmount(String(topPriceDollars));
  }, [topPriceDollars, amountTouched, existingMatch]);

  // Live "you already have a listing" lookup, debounced so it doesn't fire
  // on every keystroke. Only prefills the amount if the user hasn't already
  // manually adjusted it (steppers/claim click) — never fights a deliberate
  // edit, just offers a starting point.
  useEffect(() => {
    const trimmed = url.trim();
    if (!trimmed) {
      setExistingMatch(null);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      fetch(apiPath(`/api/sponsors/lookup?url=${encodeURIComponent(normalizeUrlInput(trimmed))}`))
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (cancelled) return;
          // A $0 balance (e.g. a past winner whose credit was fully consumed
          // at period close) isn't a real "existing listing" from the user's
          // point of view — they're not on the board, so don't claim they
          // are or prefill toward it.
          if (data?.exists && Number.isFinite(data.balance_cents) && data.balance_cents > 0) {
            setExistingMatch({ balanceCents: data.balance_cents });
            if (!amountTouchedRef.current) {
              setAmount(String(Math.max(Math.round(data.balance_cents / 100) + 1, minBidDollars)));
            }
          } else {
            setExistingMatch(null);
          }
        })
        .catch(() => {
          if (!cancelled) setExistingMatch(null);
        });
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [url]);

  const step = (delta: number) => {
    setAmountTouched(true);
    setAmount((prev) => String(Math.max(minBidDollars, (Number(prev) || minBidDollars) + delta)));
  };

  const handleClaim = (slot: SponsorSlot) => {
    setAmountTouched(true);
    setAmount(String(Math.max(Math.round(slot.balance_cents / 100) + 1, minBidDollars)));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    urlInputRef.current?.focus();
    urlInputRef.current?.select();
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
    // A re-bid on an existing listing has a higher floor than the site-wide
    // minimum — the backend rejects anything that doesn't exceed the
    // domain's current balance by at least $1 (SponsorController::checkout).
    const effectiveMinDollars = existingMatch
      ? Math.max(minBidDollars, Math.round(existingMatch.balanceCents / 100) + 1)
      : minBidDollars;
    if (!Number.isFinite(dollars) || Math.round(dollars * 100) < effectiveMinDollars * 100) {
      setFormError(`Minimum bid is $${effectiveMinDollars}.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(apiPath('/api/sponsors/checkout'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: normalizeUrlInput(url),
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
    <div className="tb-v2-sponsor-page">
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
            <div className="tb-v2-kicker" style={{ textAlign: 'center', marginBottom: 8, color: 'var(--fg-3)' }}>
              Sponsor to keep this site running on top.
            </div>
            <div className="tb-v2-sponsor-claim-hero">
              <span>Claim #{computedRank} for</span>
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
                  src={sponsorFaviconSrc(previewDomain, 64)}
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
            {existingMatch && (
              <p style={{ color: 'var(--red)', fontSize: 13 }}>
                You already have a listing at {formatBid(existingMatch.balanceCents)} — bidding
                higher will only charge the difference.
              </p>
            )}
            <p className="tb-v2-sponsor-fineprint">
              Already listed? Enter the same URL or @handle and up your bid to move up.
            </p>
          </form>
        </div>

        <div>
          <h2 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            Leaderboard
          </h2>
          <div className="tb-v2-sponsor-table" aria-busy={boardLoading}>
            {boardLoading && (
              <>
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="tb-v2-sponsor-row-skeleton tb-v2-sponsor-row-skeleton-card"
                    aria-hidden="true"
                  />
                ))}
              </>
            )}
            {!boardLoading && rows.length === 0 && (
              <div className="tb-v2-sponsor-empty-board">
                <p>No bid yet.</p>
                <button type="button" className="tb-v2-btn tb-v2-btn-primary" onClick={focusBidInput}>
                  Bid Now
                </button>
              </div>
            )}
            {!boardLoading &&
              rows
                .filter((r) => r.rank <= 3)
                .map((row) => (
                  <SponsorRow key={row.id} row={row} onClaim={handleClaim} minBidDollars={minBidDollars} />
                ))}
          </div>
          {!boardLoading && rows.some((r) => r.rank > 3) && (
            <div className="tb-v2-sponsor-flat-list">
              {rows.filter((r) => r.rank > 3).map((row) => (
                <SponsorRow key={row.id} row={row} onClaim={handleClaim} minBidDollars={minBidDollars} />
              ))}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button
              type="button"
              className="tb-v2-btn tb-v2-btn-sm tb-v2-sponsor-refresh-btn"
              onClick={refreshLeaderboard}
              disabled={refreshing || boardLoading}
            >
              <IconRefresh className="tb-v2-ic" aria-hidden="true" />
              Refresh
            </button>
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
              top 3 at the instant the month closes — their balance is spent to hold
              that spot and doesn't carry over.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
