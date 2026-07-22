'use client';

import { useState } from 'react';
import SharePanel from '@/components/share/SharePanel';

export default function HomeShareButton() {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShareOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.6 13.6 15.4 17M15.4 7 8.6 10.4" />
          <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth={2} />
          <circle cx="18" cy="5.5" r="3" stroke="currentColor" strokeWidth={2} />
          <circle cx="18" cy="18.5" r="3" stroke="currentColor" strokeWidth={2} />
        </svg>
        Share Toolblip
      </button>
      <SharePanel open={shareOpen} onClose={() => setShareOpen(false)} url="https://toolblip.com" title="Toolblip - Free Online Developer Tools" />
    </>
  );
}
