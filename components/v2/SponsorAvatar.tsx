'use client';

import { useState } from 'react';

const AVATAR_COLORS = ['#d93030', '#a855f7', '#0ea5e9', '#16a34a', '#f59e0b', '#ec4899'];

function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** Google's favicon proxy — bigger and more reliable than unavatar for a
 * plain site icon. Not used for X handles, which have no real "favicon";
 * unavatar's per-profile image is the only sensible source there. */
function faviconUrl(domain: string, size = 128): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
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
  const isHandle = domain.startsWith('x.com/');
  const sizeStyle: React.CSSProperties | undefined = sizePx ? { width: sizePx, height: sizePx } : undefined;

  if (error) {
    return (
      <span className={className} style={{ background: avatarColor(domain), ...sizeStyle }} aria-hidden="true">
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={isHandle ? `https://unavatar.io/${domain}` : faviconUrl(domain)}
      alt=""
      className={className}
      style={sizeStyle}
      onError={() => setError(true)}
    />
  );
}
