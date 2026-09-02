'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SponsorAvatar from '@/components/v2/SponsorAvatar';
import {
  displayIdentity,
  fetchSponsorsArchive,
  formatBid,
  pingSponsorClick,
  withSponsorSource,
  type SponsorSlot,
  type SponsorsArchivePeriod,
} from '@/lib/sponsors';

function formatPeriod(period: string): string {
  const parsed = new Date(`${period}-01T00:00:00Z`);
  return Number.isNaN(parsed.getTime())
    ? period
    : new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(parsed);
}

function formatClosedAt(closedAt: string): string {
  const parsed = new Date(closedAt);
  return Number.isNaN(parsed.getTime())
    ? closedAt
    : new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(parsed);
}

function ArchiveRow({ row }: { row: SponsorSlot }) {
  const displayDomain = row.domain || 'Available spot';
  const content = (
    <>
      <span className="tb-v2-sponsor-row-rank">#{row.rank}</span>
      {row.placeholder ? (
        <span className="tb-v2-sponsor-row-avatar" aria-hidden="true">—</span>
      ) : (
        <SponsorAvatar domain={row.domain} name={row.name} />
      )}
      <span className="tb-v2-sponsor-archive-copy">
        <span className="tb-v2-sponsor-row-domain">{displayIdentity(displayDomain)}</span>
        {row.tagline && <span className="tb-v2-sponsor-row-tagline">{row.tagline}</span>}
      </span>
      <span className="tb-v2-sponsor-row-balance">{formatBid(row.balance_cents)}</span>
    </>
  );

  if (row.placeholder || !row.url) {
    return <div className="tb-v2-sponsor-archive-row tb-v2-sponsor-archive-row-placeholder">{content}</div>;
  }

  return (
    <a
      href={withSponsorSource(row.url, 'archive')}
      target="_blank"
      rel="sponsored nofollow noopener"
      className="tb-v2-sponsor-archive-row"
      onClick={() => pingSponsorClick(row.id)}
    >
      {content}
    </a>
  );
}

function ArchiveMonth({ month }: { month: SponsorsArchivePeriod }) {
  return (
    <section className="tb-v2-sponsor-archive-month" aria-labelledby={`archive-${month.period}`}>
      <div className="tb-v2-sponsor-archive-heading">
        <h2 id={`archive-${month.period}`}>{formatPeriod(month.period)}</h2>
        {month.closed_at && <time dateTime={month.closed_at}>Closed {formatClosedAt(month.closed_at)}</time>}
      </div>
      <div className="tb-v2-sponsor-archive-list">
        {month.slots.map((row, index) => <ArchiveRow key={`${month.period}-${row.id}-${index}`} row={row} />)}
      </div>
    </section>
  );
}

export default function ArchiveClient() {
  const [archive, setArchive] = useState<SponsorsArchivePeriod[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchSponsorsArchive()
      .then((response) => {
        if (!cancelled) setArchive(response.data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="tb-v2-sponsor-page tb-v2-sponsor-archive-page">
      <Link href="/sponsors" className="tb-v2-sponsor-archive-back">← Current sponsors</Link>
      <div className="tb-v2-kicker">Sponsor history</div>
      <h1 className="tb-v2-sponsor-archive-title">Monthly archive</h1>
      <p className="tb-v2-sponsor-archive-intro">A record of the sponsors who held each monthly placement.</p>

      {archive === null && !error && (
        <div className="tb-v2-sponsor-archive-state" aria-busy="true">Loading archive…</div>
      )}
      {error && (
        <div className="tb-v2-sponsor-archive-state">Couldn&apos;t load the sponsor archive. Please try again later.</div>
      )}
      {archive?.length === 0 && (
        <div className="tb-v2-sponsor-archive-state">No archived sponsor months yet.</div>
      )}
      {archive && archive.length > 0 && archive.map((month) => <ArchiveMonth key={month.period} month={month} />)}
    </div>
  );
}
