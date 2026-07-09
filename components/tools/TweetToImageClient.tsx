'use client';

import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react';

type ThemeKey = 'light' | 'dim' | 'dark';
type BackgroundMode = 'gradient' | 'solid' | 'transparent';
type AspectRatioKey = 'card' | 'square' | 'og';
type FontSizeKey = 'small' | 'medium' | 'large';
type InputMode = 'url' | 'custom';
type FetchStatus = 'idle' | 'loading' | 'error' | 'success';

interface ThemeSpec {
  label: string;
  cardBg: string;
  text: string;
  subtext: string;
  border: string;
}

const THEMES: Record<ThemeKey, ThemeSpec> = {
  light: { label: 'Light', cardBg: '#ffffff', text: '#0f1419', subtext: '#536471', border: '#eff3f4' },
  dim: { label: 'Dim', cardBg: '#15202b', text: '#f7f9f9', subtext: '#8b98a5', border: '#38444d' },
  dark: { label: 'Lights out', cardBg: '#000000', text: '#e7e9ea', subtext: '#71767b', border: '#2f3336' },
};

const BACKGROUND_PRESETS = [
  { name: 'Sky Blue', from: '#38bdf8', to: '#0c4a6e' },
  { name: 'Sunset', from: '#f97316', to: '#db2777' },
  { name: 'Violet Dusk', from: '#8b5cf6', to: '#1e1b4b' },
  { name: 'Mint Fresh', from: '#34d399', to: '#0f766e' },
  { name: 'Rose Glow', from: '#fb7185', to: '#7c2d12' },
  { name: 'Midnight', from: '#334155', to: '#020617' },
] as const;

const FONT_SIZE_SCALE: Record<FontSizeKey, number> = { small: 0.86, medium: 1, large: 1.16 };
const FONT_SIZE_LABELS: Record<FontSizeKey, string> = { small: 'Small', medium: 'Medium', large: 'Large' };

const AVATAR_COLORS = ['#F43F5E', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'];

const RENDER_SCALE = 2;
const CARD_WIDTH = 560;
const TWEET_URL_PATTERN = /^https?:\/\/(www\.)?(twitter|x)\.com\/[A-Za-z0-9_]{1,15}\/status\/\d+/i;

const INPUT_CLASS =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white';

interface TweetOEmbedResponse {
  author_name?: string;
  author_url?: string;
  html?: string;
}

function normalizeHex(value: string, fallback: string) {
  const trimmed = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed.toUpperCase();
  return fallback;
}

function normalizeHandle(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '@username';
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function formatCount(value: number): string {
  if (!Number.isFinite(value) || value < 0) return '0';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return `${Math.round(value)}`;
}

function formatTimestamp(date: Date): string {
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${time} · ${day}`;
}

function extractHandle(authorUrl?: string): string {
  if (!authorUrl) return '';
  const match = authorUrl.match(/(?:twitter|x)\.com\/([^/?#]+)/i);
  return match ? `@${match[1]}` : '';
}

function parseOEmbedHtml(html: string): string {
  if (typeof window === 'undefined' || !html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const paragraph = doc.querySelector('p');
  if (!paragraph) return '';
  paragraph.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
  return (paragraph.textContent || '').trim();
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    if (paragraph === '') {
      lines.push('');
      continue;
    }
    const words = paragraph.split(' ');
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width <= maxWidth || !current) {
        current = test;
      } else {
        lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
  }

  if (lines.length > maxLines) {
    const truncated = lines.slice(0, maxLines);
    let last = truncated[truncated.length - 1] ?? '';
    while (last.length > 0 && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1);
    }
    truncated[truncated.length - 1] = `${last}…`;
    return truncated;
  }

  return lines;
}

function truncateToWidth(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let result = text;
  while (result.length > 1 && ctx.measureText(`${result}…`).width > maxWidth) {
    result = result.slice(0, -1);
  }
  return `${result}…`;
}

function drawRoundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

function drawVerifiedBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.save();
  ctx.fillStyle = '#1d9bf0';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = radius * 0.28;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - radius * 0.5, cy);
  ctx.lineTo(cx - radius * 0.12, cy + radius * 0.38);
  ctx.lineTo(cx + radius * 0.55, cy - radius * 0.35);
  ctx.stroke();
  ctx.restore();
}

function drawFallbackAvatar(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, letter: string, colorIndex: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${Math.round(radius * 1.1)}px Inter, Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, cx, cy + radius * 0.05);
  ctx.restore();
}

function drawImageAvatar(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cx: number, cy: number, radius: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  const size = radius * 2;
  const ratio = img.width / img.height || 1;
  let drawW = size;
  let drawH = size;
  let offsetX = 0;
  let offsetY = 0;
  if (ratio > 1) {
    drawH = size;
    drawW = size * ratio;
    offsetX = -(drawW - size) / 2;
  } else {
    drawW = size;
    drawH = size / ratio;
    offsetY = -(drawH - size) / 2;
  }
  ctx.drawImage(img, cx - radius + offsetX, cy - radius + offsetY, drawW, drawH);
  ctx.restore();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image-load-failed'));
    img.src = src;
  });
}

function SliderLabel({ children, value }: { children: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
      <span>{children}</span>
      <span className="text-gray-500 dark:text-gray-400">{value}px</span>
    </div>
  );
}

function DownloadButton({ downloadUrl, placement }: { downloadUrl: string; placement: 'top' | 'bottom' }) {
  if (!downloadUrl) return null;

  return (
    <a
      href={downloadUrl}
      download="tweet-image.png"
      className={
        placement === 'top'
          ? 'inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700'
          : 'inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700'
      }
    >
      Download PNG
    </a>
  );
}

function CollapsibleSection({
  children,
  icon,
  isOpen,
  onToggle,
  title,
}: {
  children: ReactNode;
  icon: string;
  isOpen: boolean;
  onToggle: () => void;
  title: string;
}) {
  const sectionId = `${title.toLowerCase().replace(/\s+/g, '-')}-controls`;

  return (
    <div className="border-b border-gray-100 dark:border-gray-800">
      <button
        type="button"
        aria-controls={sectionId}
        aria-expanded={isOpen}
        aria-label={`${title} controls`}
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 text-left transition hover:bg-gray-50 dark:hover:bg-gray-900/60"
      >
        <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
          <span className="text-base text-violet-500" aria-hidden="true">{icon}</span>
          <span>{title.toUpperCase()}</span>
        </span>
        <span aria-hidden="true" className={`text-xl text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
      </button>
      {isOpen && (
        <div id={sectionId} className="space-y-5 px-5 pb-5">
          {children}
        </div>
      )}
    </div>
  );
}

export default function TweetToImageClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mode, setMode] = useState<InputMode>('url');
  const [tweetUrl, setTweetUrl] = useState('');
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('idle');
  const [fetchError, setFetchError] = useState('');

  const [authorName, setAuthorName] = useState('Your Name');
  const [handle, setHandle] = useState('@username');
  const [tweetText, setTweetText] = useState(
    'This is what your tweet will look like! Edit the text, pick a theme, and download a polished PNG in seconds.',
  );
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  const [timestampLabel, setTimestampLabel] = useState(() => formatTimestamp(new Date()));
  const [replies, setReplies] = useState(48);
  const [retweets, setRetweets] = useState(312);
  const [likes, setLikes] = useState(2140);

  const [themeKey, setThemeKey] = useState<ThemeKey>('light');
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('gradient');
  const [presetIndex, setPresetIndex] = useState(0);
  const [solidColor, setSolidColor] = useState('#1D9BF0');
  const [padding, setPadding] = useState(40);
  const [rounded, setRounded] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioKey>('card');
  const [showMetrics, setShowMetrics] = useState(true);
  const [showVerified, setShowVerified] = useState(true);
  const [fontSize, setFontSize] = useState<FontSizeKey>('medium');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [renderedSize, setRenderedSize] = useState({ width: 0, height: 0 });

  const [appearanceOpen, setAppearanceOpen] = useState(true);
  const [backgroundOpen, setBackgroundOpen] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [metricsOpen, setMetricsOpen] = useState(false);

  const handleFetchTweet = async () => {
    const trimmed = tweetUrl.trim();
    if (!TWEET_URL_PATTERN.test(trimmed)) {
      setFetchStatus('error');
      setFetchError('Enter a valid tweet URL, e.g. https://x.com/user/status/123456789');
      return;
    }

    setFetchStatus('loading');
    setFetchError('');

    try {
      const endpoint = `https://publish.twitter.com/oembed?url=${encodeURIComponent(trimmed)}&omit_script=true`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('tweet-fetch-failed');
      const data = (await res.json()) as TweetOEmbedResponse;
      const parsedText = parseOEmbedHtml(data.html || '');

      setAuthorName(data.author_name || 'Unknown');
      setHandle(extractHandle(data.author_url) || '@unknown');
      setTweetText((parsedText || '').slice(0, 280));
      setFetchStatus('success');
    } catch {
      setFetchStatus('error');
      setFetchError("Couldn't load that tweet. It may be private, deleted, or the URL is invalid. Try Custom text mode instead.");
    }
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarDataUrl(typeof reader.result === 'string' ? reader.result : null);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      if (typeof document !== 'undefined' && 'fonts' in document) {
        await document.fonts.ready;
      }
      if (cancelled) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let avatarImg: HTMLImageElement | null = null;
      if (avatarDataUrl) {
        try {
          avatarImg = await loadImage(avatarDataUrl);
        } catch {
          avatarImg = null;
        }
      }
      if (cancelled) return;

      const theme = THEMES[themeKey];
      const scale = FONT_SIZE_SCALE[fontSize];

      const avatarSize = Math.round(48 * scale);
      const nameFontPx = Math.round(15 * scale);
      const handleFontPx = Math.round(15 * scale);
      const textFontPx = Math.round(17 * scale);
      const metaFontPx = Math.round(13 * scale);
      const statFontPx = Math.round(13 * scale);

      const cardPaddingX = 16;
      const cardPaddingTop = 14;
      const cardPaddingBottom = 14;
      const gapAvatarToText = 12;
      const gapAfterHeader = 12;
      const textLineHeight = Math.round(textFontPx * 1.35);
      const gapAfterText = 12;
      const gapAfterTimestamp = 14;
      const dividerGap = 12;
      const statRowHeight = Math.round(statFontPx * 1.6);

      const maxTextWidth = CARD_WIDTH - cardPaddingX * 2;

      const measureCanvas = document.createElement('canvas');
      const measureCtx = measureCanvas.getContext('2d');
      if (!measureCtx) return;

      measureCtx.font = `400 ${textFontPx}px Inter, Arial, sans-serif`;
      const maxLines = aspectRatio === 'card' ? Infinity : 8;
      const textLines = wrapLines(measureCtx, tweetText || ' ', maxTextWidth, maxLines);

      measureCtx.font = `700 ${nameFontPx}px Inter, Arial, sans-serif`;
      const badgeSpace = showVerified ? nameFontPx * 0.52 * 2 + 8 : 0;
      const maxNameWidth = CARD_WIDTH - cardPaddingX * 2 - avatarSize - gapAvatarToText - badgeSpace;
      const displayName = truncateToWidth(measureCtx, authorName || 'Your Name', maxNameWidth);
      const nameWidth = measureCtx.measureText(displayName).width;

      measureCtx.font = `400 ${handleFontPx}px Inter, Arial, sans-serif`;
      const maxHandleWidth = CARD_WIDTH - cardPaddingX * 2 - avatarSize - gapAvatarToText;
      const displayHandle = truncateToWidth(measureCtx, handle || '@username', maxHandleWidth);

      const headerTextHeight = nameFontPx + 6 + handleFontPx;
      const headerHeight = Math.max(avatarSize, headerTextHeight);

      let cardHeight =
        cardPaddingTop +
        headerHeight +
        gapAfterHeader +
        textLines.length * textLineHeight +
        gapAfterText +
        metaFontPx +
        cardPaddingBottom;

      if (showMetrics) {
        cardHeight += gapAfterTimestamp + 1 + dividerGap + statRowHeight;
      }

      let outerWidth: number;
      let outerHeight: number;
      let cardX: number;
      let cardY: number;

      if (aspectRatio === 'card') {
        outerWidth = CARD_WIDTH + padding * 2;
        outerHeight = cardHeight + padding * 2;
        cardX = padding;
        cardY = padding;
      } else {
        outerWidth = aspectRatio === 'square' ? 1080 : 1200;
        outerHeight = aspectRatio === 'square' ? 1080 : 630;
        cardX = (outerWidth - CARD_WIDTH) / 2;
        cardY = Math.max(padding, (outerHeight - cardHeight) / 2);
      }

      canvas.width = Math.round(outerWidth * RENDER_SCALE);
      canvas.height = Math.round(outerHeight * RENDER_SCALE);
      ctx.setTransform(RENDER_SCALE, 0, 0, RENDER_SCALE, 0, 0);
      ctx.clearRect(0, 0, outerWidth, outerHeight);

      if (backgroundMode === 'gradient') {
        const preset = BACKGROUND_PRESETS[presetIndex] ?? BACKGROUND_PRESETS[0];
        const gradient = ctx.createLinearGradient(0, 0, outerWidth, outerHeight);
        gradient.addColorStop(0, preset.from);
        gradient.addColorStop(1, preset.to);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, outerWidth, outerHeight);
      } else if (backgroundMode === 'solid') {
        ctx.fillStyle = normalizeHex(solidColor, '#1D9BF0');
        ctx.fillRect(0, 0, outerWidth, outerHeight);
      }

      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.25)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 8;
      drawRoundedRectPath(ctx, cardX, cardY, CARD_WIDTH, cardHeight, rounded ? 16 : 0);
      ctx.fillStyle = theme.cardBg;
      ctx.fill();
      ctx.restore();

      const headerTop = cardY + cardPaddingTop;
      const avatarCx = cardX + cardPaddingX + avatarSize / 2;
      const avatarCy = headerTop + avatarSize / 2;

      if (avatarImg) {
        drawImageAvatar(ctx, avatarImg, avatarCx, avatarCy, avatarSize / 2);
      } else {
        const letter = (authorName || 'Y').trim().charAt(0).toUpperCase() || 'Y';
        drawFallbackAvatar(ctx, avatarCx, avatarCy, avatarSize / 2, letter, hashString(authorName || 'anon'));
      }

      const textX = cardX + cardPaddingX + avatarSize + gapAvatarToText;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      const nameBaselineY = headerTop + nameFontPx * 0.85;
      ctx.font = `700 ${nameFontPx}px Inter, Arial, sans-serif`;
      ctx.fillStyle = theme.text;
      ctx.fillText(displayName, textX, nameBaselineY);

      if (showVerified) {
        const badgeRadius = nameFontPx * 0.52;
        const badgeCx = textX + nameWidth + 8 + badgeRadius;
        const badgeCy = nameBaselineY - nameFontPx * 0.36;
        drawVerifiedBadge(ctx, badgeCx, badgeCy, badgeRadius);
      }

      const handleBaselineY = nameBaselineY + handleFontPx + 6;
      ctx.font = `400 ${handleFontPx}px Inter, Arial, sans-serif`;
      ctx.fillStyle = theme.subtext;
      ctx.fillText(displayHandle, textX, handleBaselineY);

      let cursorY = cardY + cardPaddingTop + headerHeight + gapAfterHeader;

      ctx.font = `400 ${textFontPx}px Inter, Arial, sans-serif`;
      ctx.fillStyle = theme.text;
      textLines.forEach((line, index) => {
        ctx.fillText(line, cardX + cardPaddingX, cursorY + index * textLineHeight + textFontPx * 0.9);
      });
      cursorY += textLines.length * textLineHeight + gapAfterText;

      ctx.font = `400 ${metaFontPx}px Inter, Arial, sans-serif`;
      ctx.fillStyle = theme.subtext;
      ctx.fillText(timestampLabel || '', cardX + cardPaddingX, cursorY + metaFontPx * 0.9);
      cursorY += metaFontPx;

      if (showMetrics) {
        cursorY += gapAfterTimestamp;
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cardX + cardPaddingX, cursorY);
        ctx.lineTo(cardX + CARD_WIDTH - cardPaddingX, cursorY);
        ctx.stroke();
        cursorY += dividerGap;

        const stats: Array<[string, number]> = [
          ['💬', replies],
          ['🔁', retweets],
          ['❤️', likes],
        ];
        ctx.font = `400 ${statFontPx}px Inter, Arial, sans-serif`;
        let statX = cardX + cardPaddingX;
        stats.forEach(([icon, count]) => {
          const label = `${icon} ${formatCount(count)}`;
          ctx.fillStyle = theme.subtext;
          ctx.fillText(label, statX, cursorY + statFontPx * 0.9);
          statX += ctx.measureText(label).width + 28 * scale;
        });
      }

      setDownloadUrl(canvas.toDataURL('image/png'));
      setRenderedSize({ width: Math.round(outerWidth), height: Math.round(outerHeight) });
    };

    const timeout = window.setTimeout(() => {
      void render();
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [
    authorName,
    avatarDataUrl,
    aspectRatio,
    backgroundMode,
    fontSize,
    handle,
    likes,
    padding,
    presetIndex,
    replies,
    retweets,
    rounded,
    showMetrics,
    showVerified,
    solidColor,
    themeKey,
    timestampLabel,
    tweetText,
  ]);

  const transparentPreviewStyle =
    backgroundMode === 'transparent'
      ? {
          backgroundImage: 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%)',
          backgroundSize: '20px 20px',
        }
      : undefined;

  return (
    <div className="space-y-6" data-testid="tweet-to-image-generator">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="text-base font-semibold text-gray-900 dark:text-white">Customize your tweet image</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Paste a tweet URL or write your own content, then style it with themes, backgrounds, and layout controls before downloading a PNG.
          </p>
        </div>
        <div className="hidden shrink-0 sm:block">
          <DownloadButton downloadUrl={downloadUrl} placement="top" />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="space-y-5 border-b border-gray-100 p-5 dark:border-gray-800">
            <div className="grid grid-cols-2 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-900" role="group" aria-label="Input mode">
              {([
                ['url', 'Tweet URL'],
                ['custom', 'Custom text'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  aria-pressed={mode === value}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    mode === value
                      ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-800 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {mode === 'url' ? (
              <form
                className="space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleFetchTweet();
                }}
              >
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tweet URL</span>
                  <input
                    aria-label="Tweet URL"
                    value={tweetUrl}
                    onChange={(event) => setTweetUrl(event.target.value)}
                    placeholder="https://x.com/user/status/1234567890"
                    className={INPUT_CLASS}
                  />
                </label>
                <button
                  type="submit"
                  disabled={fetchStatus === 'loading'}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                  {fetchStatus === 'loading' ? 'Fetching…' : 'Fetch tweet'}
                </button>
                {fetchStatus === 'error' && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{fetchError}</p>
                )}
                {fetchStatus === 'success' && (
                  <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
                    Tweet loaded — you can still edit the text or picture below.
                  </p>
                )}
              </form>
            ) : (
              <div className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Author name</span>
                  <input
                    aria-label="Author name"
                    value={authorName}
                    onChange={(event) => setAuthorName(event.target.value)}
                    className={INPUT_CLASS}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">@handle</span>
                  <input
                    aria-label="Handle"
                    value={handle}
                    onChange={(event) => setHandle(event.target.value)}
                    onBlur={() => setHandle((value) => normalizeHandle(value))}
                    className={INPUT_CLASS}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tweet text</span>
                  <textarea
                    aria-label="Tweet text"
                    value={tweetText}
                    onChange={(event) => setTweetText(event.target.value)}
                    rows={4}
                    className={INPUT_CLASS}
                  />
                </label>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-sm font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                aria-hidden="true"
              >
                {avatarDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarDataUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  (authorName || 'Y').trim().charAt(0).toUpperCase() || 'Y'
                )}
              </div>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900">
                Upload picture
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} aria-label="Upload profile picture" />
              </label>
              {avatarDataUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarDataUrl(null)}
                  className="text-sm font-medium text-gray-500 underline-offset-2 hover:underline dark:text-gray-400"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <CollapsibleSection icon="◐" isOpen={appearanceOpen} onToggle={() => setAppearanceOpen((open) => !open)} title="Theme">
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Theme">
              {(Object.entries(THEMES) as Array<[ThemeKey, ThemeSpec]>).map(([key, spec]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setThemeKey(key)}
                  aria-pressed={themeKey === key}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                    themeKey === key
                      ? 'border-violet-500 ring-2 ring-violet-300'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                  }`}
                  style={{ backgroundColor: spec.cardBg, color: themeKey === key ? spec.text : undefined }}
                >
                  {spec.label}
                </button>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection icon="🎨" isOpen={backgroundOpen} onToggle={() => setBackgroundOpen((open) => !open)} title="Background">
            <div className="grid grid-cols-3 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-900" role="group" aria-label="Background mode">
              {([
                ['gradient', 'Gradient'],
                ['solid', 'Solid'],
                ['transparent', 'Transparent'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setBackgroundMode(value)}
                  aria-pressed={backgroundMode === value}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    backgroundMode === value
                      ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-800 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {backgroundMode === 'gradient' && (
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Gradient presets">
                {BACKGROUND_PRESETS.map((preset, index) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setPresetIndex(index)}
                    className={`h-11 rounded-lg border transition ${presetIndex === index ? 'border-violet-500 ring-2 ring-violet-300' : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'}`}
                    aria-label={preset.name}
                    aria-pressed={presetIndex === index}
                    style={{ background: `linear-gradient(135deg, ${preset.from}, ${preset.to})` }}
                  />
                ))}
              </div>
            )}

            {backgroundMode === 'solid' && (
              <label className="block space-y-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Color</span>
                <div className="flex gap-2">
                  <input
                    aria-label="Background color picker"
                    type="color"
                    value={normalizeHex(solidColor, '#1D9BF0')}
                    onChange={(event) => setSolidColor(event.target.value.toUpperCase())}
                    className="h-12 w-14 rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                  />
                  <input
                    aria-label="Background color hex"
                    value={solidColor}
                    onChange={(event) => setSolidColor(event.target.value.toUpperCase())}
                    onBlur={() => setSolidColor((value) => normalizeHex(value, '#1D9BF0'))}
                    className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </label>
            )}
          </CollapsibleSection>

          <CollapsibleSection icon="▦" isOpen={layoutOpen} onToggle={() => setLayoutOpen((open) => !open)} title="Layout">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aspect ratio</span>
              <select
                aria-label="Aspect ratio"
                value={aspectRatio}
                onChange={(event) => setAspectRatio(event.target.value as AspectRatioKey)}
                className={INPUT_CLASS}
              >
                <option value="card">Tweet card only</option>
                <option value="square">Square (1:1)</option>
                <option value="og">Open Graph (1200×630)</option>
              </select>
            </label>

            <label className="block space-y-2">
              <SliderLabel value={padding}>Padding</SliderLabel>
              <input
                aria-label="Padding"
                type="range"
                min="0"
                max="60"
                value={padding}
                onChange={(event) => setPadding(Number(event.target.value))}
                className="w-full accent-violet-600"
              />
            </label>

            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Corner radius">
              {([
                [true, 'Rounded'],
                [false, 'Square'],
              ] as const).map(([value, label]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setRounded(value)}
                  aria-pressed={rounded === value}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    rounded === value
                      ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Font size</span>
              <select
                aria-label="Font size"
                value={fontSize}
                onChange={(event) => setFontSize(event.target.value as FontSizeKey)}
                className={INPUT_CLASS}
              >
                {(Object.keys(FONT_SIZE_LABELS) as FontSizeKey[]).map((key) => (
                  <option key={key} value={key}>
                    {FONT_SIZE_LABELS[key]}
                  </option>
                ))}
              </select>
            </label>
          </CollapsibleSection>

          <CollapsibleSection icon="♥" isOpen={metricsOpen} onToggle={() => setMetricsOpen((open) => !open)} title="Badge & stats">
            <label className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Verified badge</span>
              <button
                type="button"
                role="switch"
                aria-checked={showVerified}
                onClick={() => setShowVerified((value) => !value)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${showVerified ? 'bg-violet-600' : 'bg-gray-300 dark:bg-gray-700'}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${showVerified ? 'left-5' : 'left-0.5'}`} />
              </button>
            </label>

            <label className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show engagement stats</span>
              <button
                type="button"
                role="switch"
                aria-checked={showMetrics}
                onClick={() => setShowMetrics((value) => !value)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${showMetrics ? 'bg-violet-600' : 'bg-gray-300 dark:bg-gray-700'}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${showMetrics ? 'left-5' : 'left-0.5'}`} />
              </button>
            </label>

            {showMetrics && (
              <div className="grid grid-cols-3 gap-2">
                <label className="block space-y-2">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Replies</span>
                  <input
                    aria-label="Reply count"
                    type="number"
                    min={0}
                    value={replies}
                    onChange={(event) => setReplies(Number(event.target.value))}
                    className={INPUT_CLASS}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Reposts</span>
                  <input
                    aria-label="Repost count"
                    type="number"
                    min={0}
                    value={retweets}
                    onChange={(event) => setRetweets(Number(event.target.value))}
                    className={INPUT_CLASS}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Likes</span>
                  <input
                    aria-label="Like count"
                    type="number"
                    min={0}
                    value={likes}
                    onChange={(event) => setLikes(Number(event.target.value))}
                    className={INPUT_CLASS}
                  />
                </label>
              </div>
            )}

            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Timestamp</span>
              <input
                aria-label="Timestamp"
                value={timestampLabel}
                onChange={(event) => setTimestampLabel(event.target.value)}
                className={INPUT_CLASS}
              />
            </label>
          </CollapsibleSection>

          <div className="p-5">
            <DownloadButton downloadUrl={downloadUrl} placement="bottom" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              Preview {renderedSize.width} × {renderedSize.height} px
            </div>
            <div className="sm:hidden">
              <DownloadButton downloadUrl={downloadUrl} placement="top" />
            </div>
          </div>
          <div
            className="flex items-center justify-center rounded-2xl border border-gray-200 p-4 shadow-sm dark:border-gray-800"
            style={transparentPreviewStyle}
          >
            <canvas ref={canvasRef} data-testid="tweet-to-image-preview" aria-label="Tweet image preview" className="h-auto w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
