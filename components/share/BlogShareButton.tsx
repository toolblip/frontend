'use client';

import { useState } from 'react';
import SharePanel from '@/components/share/SharePanel';

type BlogShareButtonProps = {
  url: string;
  title: string;
};

export default function BlogShareButton({ url, title }: BlogShareButtonProps) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShareOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium transition hover:border-[var(--red)] hover:text-[var(--red)] cursor-pointer"
        style={{ color: 'var(--fg-2)', fontFamily: 'var(--f-mono)' }}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.6 13.6 15.4 17M15.4 7 8.6 10.4" />
          <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth={2} />
          <circle cx="18" cy="5.5" r="3" stroke="currentColor" strokeWidth={2} />
          <circle cx="18" cy="18.5" r="3" stroke="currentColor" strokeWidth={2} />
        </svg>
        Share
      </button>
      <SharePanel open={shareOpen} onClose={() => setShareOpen(false)} url={url} title={title} />
    </>
  );
}
