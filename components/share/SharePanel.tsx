'use client';

import { useEffect, useRef, useState } from 'react';

type SharePanelProps = {
  open: boolean;
  onClose: () => void;
  url: string;
  title?: string;
};

function copyTextFallback(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  try {
    return document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}

export default function SharePanel({ open, onClose, url, title }: SharePanelProps) {
  const [shortUrl, setShortUrl] = useState(url);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showQr, setShowQr] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Generate short URL
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setCopied(false);
    setQrDataUrl('');
    setShowQr(false);

    fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ url }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.short_url) {
          setShortUrl(data.short_url);
        }
      })
      .catch(() => {
        if (!cancelled) setShortUrl(url);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [open, url]);

  // Generate QR code when shown
  useEffect(() => {
    if (!showQr || !shortUrl) return;
    let cancelled = false;
    import('@/lib/qr').then(({ generateQRCode }) => {
      generateQRCode(shortUrl).then((qrUrl) => {
        if (!cancelled && qrUrl) setQrDataUrl(qrUrl);
      });
    });
    return () => { cancelled = true; };
  }, [showQr, shortUrl]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const shareText = title ? `Check out ${title} on Toolblip` : 'Check out Toolblip';

  const socialLinks = [
    {
      label: 'X',
      href: `https://x.com/intent/tweet?${new URLSearchParams({ text: shareText, url: shortUrl }).toString()}`,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url: shortUrl }).toString()}`,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: shortUrl }).toString()}`,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      label: 'Reddit',
      href: `https://reddit.com/submit?${new URLSearchParams({ url: shortUrl, title: shareText }).toString()}`,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      ),
    },
    {
      label: 'HN',
      href: `https://news.ycombinator.com/submitlink?${new URLSearchParams({ u: shortUrl, t: title || 'Toolblip' }).toString()}`,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0v24h24V0H0zm12.7 13.5v6.3h-1.5v-6.3L7.4 6h1.7l3 5.5L15.1 6h1.7l-4.1 7.5z" />
        </svg>
      ),
    },
  ];

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shortUrl);
      } else if (!copyTextFallback(shortUrl)) {
        return;
      }
    } catch {
      if (!copyTextFallback(shortUrl)) return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true" aria-label={title ? `Share ${title}` : 'Share'} ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">Share</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 cursor-pointer dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Social sharing icons */}
        <div className="flex gap-2 p-3">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${link.label}`}
              className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-xl border border-gray-200/80 bg-white px-2 py-3 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg cursor-pointer dark:border-gray-700 dark:bg-slate-900/80 dark:hover:border-gray-600"
            >
              <span className="text-gray-700 dark:text-gray-300">{link.icon}</span>
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{link.label}</span>
            </a>
          ))}
        </div>

        {/* Copy link */}
        <div className="border-t border-gray-100 px-3 pb-3 pt-2 dark:border-gray-800">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
            <input
              type="text"
              readOnly
              value={loading ? 'Generating short link...' : shortUrl}
              aria-label="Share link"
              className="min-w-0 flex-1 truncate bg-transparent text-sm text-gray-500 outline-none dark:text-gray-400"
            />
            <button
              type="button"
              onClick={handleCopy}
              disabled={loading}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer disabled:opacity-50 ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
              aria-label="Copy link"
            >
              {copied ? (
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </span>
              )}
            </button>
          </div>

          {/* QR Code toggle */}
          <button
            type="button"
            onClick={() => setShowQr(!showQr)}
            className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 cursor-pointer dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            {showQr ? 'Hide QR Code' : 'Show QR Code'}
          </button>

          {/* QR Code display */}
          {showQr && (
            <div className="mt-3 flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrDataUrl} alt="QR Code" className="h-[200px] w-[200px] rounded-lg" style={{ imageRendering: 'pixelated' }} />
              ) : (
                <div className="h-[200px] w-[200px] flex items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-red-500" />
                </div>
              )}
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">Scan to open link</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
