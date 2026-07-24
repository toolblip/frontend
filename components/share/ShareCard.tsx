'use client';

import type { ReactNode } from 'react';
import { CloseIcon, CollapseIcon, ExpandIcon, ShareGlyphIcon, SOCIAL_COLORS } from './shareIcons';

export type ShareChannelLink = {
  /** Short platform name shown under the icon, e.g. "WhatsApp". */
  label: string;
  href: string;
  icon: ReactNode;
  /** Brand color for the circular icon background. */
  color: string;
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
  onNativeShare: () => void;
  /** Tool or page title shown under the "SHARE LINK" label. Falls back to "Toolblip". */
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
  onNativeShare,
  title,
  standalone = true,
}: ShareCardProps) {
  const qrSize = expanded ? 400 : 240;
  const tileSize = expanded ? 'h-14 w-14' : 'h-11 w-11';
  const tileIconSize = expanded ? 'h-6 w-6' : 'h-5 w-5';
  const tileLabelSize = expanded ? 'text-xs' : 'text-[10px]';
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
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-white/40">Share link</div>
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
      <div className="flex flex-col items-center gap-6 px-6 py-6">
        <div className="flex shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300">
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
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-red-500" />
            </div>
          )}
        </div>

        {/* Social share row */}
        <div className="flex items-center justify-center gap-4">
          {channels.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share via ${link.label}`}
              onClick={link.onClick}
              className="group flex flex-col items-center gap-1.5"
            >
              <span
                className={`flex ${tileSize} items-center justify-center rounded-full text-white shadow-sm transition group-hover:-translate-y-0.5`}
                style={{ background: link.color }}
              >
                <span className={tileIconSize}>{link.icon}</span>
              </span>
              <span className={`${tileLabelSize} font-medium text-gray-600 dark:text-white/60`}>{link.label}</span>
            </a>
          ))}

          <button
            type="button"
            onClick={onNativeShare}
            disabled={loading}
            aria-label="More share options"
            className="group flex flex-col items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              className={`flex ${tileSize} items-center justify-center rounded-full text-white shadow-sm transition group-hover:-translate-y-0.5`}
              style={{ background: SOCIAL_COLORS.more }}
            >
              <ShareGlyphIcon className={tileIconSize} />
            </span>
            <span className={`${tileLabelSize} font-medium text-gray-600 dark:text-white/60`}>{copied ? 'Copied!' : 'More'}</span>
          </button>
        </div>
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
