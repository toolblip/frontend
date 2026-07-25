'use client';

import { useEffect, useRef, useState } from 'react';
import ShareCard, { type ShareChannelLink } from './ShareCard';
import { XIcon, FacebookIcon, WhatsAppIcon, SOCIAL_COLORS } from './shareIcons';

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
  const [expanded, setExpanded] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Generate short URL
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setCopied(false);
    setQrDataUrl('');

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

  // Generate QR code once the short link is ready
  useEffect(() => {
    if (!open || !shortUrl) return;
    let cancelled = false;
    import('@/lib/qr').then(({ generateQRCode }) => {
      generateQRCode(shortUrl, 400).then((qrUrl) => {
        if (!cancelled && qrUrl) setQrDataUrl(qrUrl);
      });
    });
    return () => { cancelled = true; };
  }, [open, shortUrl]);

  // Reset expand state each time the panel closes
  useEffect(() => {
    if (!open) setExpanded(false);
  }, [open]);

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

  const channels: ShareChannelLink[] = [
    {
      label: 'X',
      href: `https://x.com/intent/tweet?${new URLSearchParams({ text: shareText, url: shortUrl }).toString()}`,
      icon: <XIcon className="h-full w-full text-white" />,
      color: SOCIAL_COLORS.x,
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: shortUrl }).toString()}`,
      icon: <FacebookIcon className="h-full w-full text-white" />,
      color: SOCIAL_COLORS.facebook,
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/?${new URLSearchParams({ text: `${shareText} ${shortUrl}` }).toString()}`,
      icon: <WhatsAppIcon className="h-full w-full text-white" />,
      color: SOCIAL_COLORS.whatsapp,
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
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title ? `Share ${title}` : 'Share'}
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <ShareCard
        channels={channels}
        qrDataUrl={qrDataUrl}
        copied={copied}
        loading={loading}
        expanded={expanded}
        title={title}
        standalone={false}
        onToggleExpand={() => setExpanded((v) => !v)}
        onClose={onClose}
        onCopy={handleCopy}
      />
    </div>
  );
}
