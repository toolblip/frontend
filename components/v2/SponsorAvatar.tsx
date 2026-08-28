'use client';

import { useState } from 'react';

const AVATAR_COLORS = ['#d93030', '#a855f7', '#0ea5e9', '#16a34a', '#f59e0b', '#ec4899'];

function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** Same-origin proxy — see app/api/favicon/route.ts. Avoids Serwist breaking
 * Google/unavatar cross-origin image redirects for returning PWA clients. */
export function sponsorFaviconSrc(domain: string, size = 128): string {
  return `/api/favicon?domain=${encodeURIComponent(domain)}&sz=${size}`;
}

export default function SponsorAvatar({
  domain,
  name,
  sizePx,
  className = 'tb-v2-sponsor-row-avatar',
}: {
  domain: string;
  name: string;
  sizePx?: number;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const sizeStyle: React.CSSProperties | undefined = sizePx ? { width: sizePx, height: sizePx } : undefined;
  const fetchSize = sizePx ? Math.min(256, Math.max(64, Math.round(sizePx * 2))) : 128;

  if (error) {
    return (
      <span className={className} style={{ background: avatarColor(domain), ...sizeStyle }} aria-hidden="true">
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={sponsorFaviconSrc(domain, fetchSize)}
      alt=""
      className={className}
      style={sizeStyle}
      onError={() => setError(true)}
    />
  );
}
