'use client';

import { useState } from 'react';

const EXAMPLE_DOMAIN = 'google.com';

interface RdapEvent {
  eventAction: string;
  eventDate: string;
}

interface RdapNameserver {
  ldhName?: string;
}

interface RdapResponse {
  events?: RdapEvent[];
  nameservers?: RdapNameserver[];
  status?: string[];
}

interface DomainInfo {
  registered?: string;
  expires?: string;
  lastChanged?: string;
  ageText: string;
  expiryText: string;
  nameservers: string[];
  status: string[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function relativeYearsDays(from: Date, to: Date): string {
  const ms = Math.abs(to.getTime() - from.getTime());
  const totalDays = Math.floor(ms / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365);
  const days = totalDays % 365;
  if (years === 0) return `${totalDays} day${totalDays === 1 ? '' : 's'}`;
  return `${years} year${years === 1 ? '' : 's'}, ${days} day${days === 1 ? '' : 's'}`;
}

function parseRdap(data: RdapResponse): DomainInfo {
  const events = data.events || [];
  const registration = events.find(e => e.eventAction === 'registration')?.eventDate;
  const expiration = events.find(e => e.eventAction === 'expiration')?.eventDate;
  const lastChanged = events.find(e => e.eventAction === 'last changed')?.eventDate;
  const now = new Date();

  return {
    registered: registration ? formatDate(registration) : undefined,
    expires: expiration ? formatDate(expiration) : undefined,
    lastChanged: lastChanged ? formatDate(lastChanged) : undefined,
    ageText: registration ? relativeYearsDays(new Date(registration), now) : 'Unknown',
    expiryText: expiration
      ? (new Date(expiration) > now
        ? `Expires in ${relativeYearsDays(now, new Date(expiration))}`
        : `Expired ${relativeYearsDays(new Date(expiration), now)} ago`)
      : 'Unknown',
    nameservers: (data.nameservers || []).map(n => n.ldhName || '').filter(Boolean),
    status: data.status || [],
  };
}

export default function DomainAgeCheckerClient() {
  const [domain, setDomain] = useState('');
  const [info, setInfo] = useState<DomainInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadExample = () => setDomain(EXAMPLE_DOMAIN);

  const check = async () => {
    const target = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!target) return;
    setLoading(true);
    setError('');
    setInfo(null);
    try {
      const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(target)}`);
      if (res.status === 404) {
        setError(`No registration record found for ${target}. It may be unregistered or use a registry without public RDAP data.`);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error('RDAP lookup failed');
      const data: RdapResponse = await res.json();
      setInfo(parseRdap(data));
    } catch {
      setError('Domain lookup failed. Check the domain name and your connection, then try again.');
    }
    setLoading(false);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Domain</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <div style={{ padding: 20, display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="example.com"
          className="tb-v2-input"
          style={{ flex: 1 }}
          onKeyDown={e => e.key === 'Enter' && check()}
        />
        <button onClick={check} disabled={loading || !domain.trim()} className="tb-v2-btn tb-v2-btn-primary" style={{ minWidth: 90 }}>
          {loading ? '...' : 'Check'}
        </button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Registration Info</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <div className="tb-v2-banner tb-v2-banner-err">{error}</div>
        ) : !info ? (
          <p className="tb-v2-empty">Enter a domain above to check its registration age and expiry date via public RDAP records.</p>
        ) : (
          <div className="tb-v2-stats-grid">
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val" style={{ fontSize: 18 }}>{info.ageText}</span>
              <span className="tb-v2-stat-pill-lbl">Domain Age</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val" style={{ fontSize: 18 }}>{info.expiryText}</span>
              <span className="tb-v2-stat-pill-lbl">Expiry Status</span>
            </div>
            {info.registered && (
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val" style={{ fontSize: 14 }}>{info.registered}</span>
                <span className="tb-v2-stat-pill-lbl">Registered On</span>
              </div>
            )}
            {info.expires && (
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val" style={{ fontSize: 14 }}>{info.expires}</span>
                <span className="tb-v2-stat-pill-lbl">Expires On</span>
              </div>
            )}
            {info.nameservers.length > 0 && (
              <div className="tb-v2-stat-pill" style={{ gridColumn: '1 / -1' }}>
                <span className="tb-v2-stat-pill-val" style={{ fontSize: 13 }}>{info.nameservers.join(', ')}</span>
                <span className="tb-v2-stat-pill-lbl">Nameservers</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
