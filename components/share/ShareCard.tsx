'use client';

import type { ReactNode } from 'react';
import { CheckIcon, CloseIcon, CollapseIcon, CopyIcon, ExpandIcon, ShareGlyphIcon } from './shareIcons';

export type ShareChannelLink = {
  label: string;
  href: string;
  icon: ReactNode;
  onClick?: () => void;
};

type ShareCardProps = {
  channels: ShareChannelLink[];
  qrDataUrl: string;
  copied: boolean;
  loading: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
  onCopy: () => void;
  onNativeShare: () => void;
  /** Tool or page title shown under the "Share" label. Falls back to "Toolblip". */
  title?: string;
  /**
   * When true (default), expanding the card wraps it in its own centered,
   * full-screen backdrop overlay — for callers (like the anchored share
   * popover on tool pages) that don't already render a modal backdrop.
   * SharePanel already renders its own backdrop, so it passes `false` to
   * avoid stacking two overlays.
   */
  standalone?: boolean;
};

export default function ShareCard({
  channels,
  qrDataUrl,
  copied,
  loading,
  expanded,
  onToggleExpand,
  onClose,
  onCopy,
  onNativeShare,
  title,
  standalone = true,
}: ShareCardProps) {
  const qrSize = expanded ? 400 : 280;
  const displayTitle = title || 'Toolblip';

  const card = (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-2xl transition-[width] duration-300 ease-out dark:border-white/10 dark:bg-[#1a1a2e] dark:text-white ${
        expanded ? 'w-[640px]' : 'w-[420px]'
      } max-w-[92vw]`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-white/10">
        <div className="min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-white/40">Share</div>
          <div className="truncate text-sm font-bold text-gray-900 dark:text-white">{displayTitle}</div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleExpand}
            aria-label={expanded ? 'Collapse panel' : 'Expand panel'}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white cursor-pointer"
          >
            {expanded ? <CollapseIcon className="h-4 w-4" /> : <ExpandIcon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white cursor-pointer"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* QR code */}
      <div className="flex flex-col items-center gap-5 px-6 py-6">
        <div
          className="flex shrink-0 items-center justify-center rounded-2xl bg-gray-100 p-4 shadow-lg transition-all duration-300 dark:bg-white"
        >
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt="QR code"
              style={{ width: qrSize, height: qrSize }}
              className="transition-all duration-300"
            />
          ) : (
            <div style={{ width: qrSize, height: qrSize }} className="flex items-center justify-center transition-all duration-300">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-red-500 dark:border-gray-200" />
            </div>
          )}
        </div>

        {/* Social share row */}
        <div className="flex items-center justify-center gap-3">
          {channels.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              onClick={link.onClick}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:-translate-y-0.5 hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 cursor-pointer"
            >
              <span className="h-5 w-5">{link.icon}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex gap-2 border-t border-gray-200 p-4 dark:border-white/10">
        <button
          type="button"
          onClick={onNativeShare}
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShareGlyphIcon className="h-4 w-4" />
          Share
        </button>
        <button
          type="button"
          onClick={onCopy}
          disabled={loading}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
            copied ? 'bg-emerald-500 hover:bg-emerald-500' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </div>
  );

  if (!expanded || !standalone) {
    return card;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Share ${displayTitle}`}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {card}
    </div>
  );
}
