'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

const PRESETS = [
  { name: 'Teal Midnight', from: '#4CC8C8', to: '#202033', accent: '#F8FAFC' },
  { name: 'Indigo Violet', from: '#4f46e5', to: '#7c3aed', accent: '#facc15' },
  { name: 'Sky Cyan', from: '#0284c7', to: '#06b6d4', accent: '#ffffff' },
  { name: 'Amber Fire', from: '#f59e0b', to: '#f97316', accent: '#fff7ed' },
  { name: 'Mint Teal', from: '#10b981', to: '#0f766e', accent: '#d1fae5' },
  { name: 'Rose Pink', from: '#f43f5e', to: '#db2777', accent: '#ffe4e6' },
  { name: 'Deep Ocean', from: '#312e81', to: '#111827', accent: '#c4b5fd' },
  { name: 'Sunset Punch', from: '#ef4444', to: '#f97316', accent: '#ffedd5' },
  { name: 'Purple Blue', from: '#a855f7', to: '#3b82f6', accent: '#f5f3ff' },
  { name: 'Green Glow', from: '#16a34a', to: '#15803d', accent: '#dcfce7' },
  { name: 'Slate Night', from: '#475569', to: '#0f172a', accent: '#cbd5e1' },
  { name: 'Pink Purple', from: '#db2777', to: '#9333ea', accent: '#fce7f3' },
] as const;

const DIRECTIONS = [
  { label: 'Left → Right', value: 'left-right' },
  { label: 'Top → Bottom', value: 'top-bottom' },
  { label: 'Diagonal ↘', value: 'diagonal-down' },
  { label: 'Diagonal ↗', value: 'diagonal-up' },
  { label: '45° Angle', value: '45' },
  { label: '135° Angle', value: '135' },
  { label: '140° Angle', value: '140' },
] as const;

const PATTERN_OVERLAYS = [
  { label: 'None', value: 'none' },
  { label: 'Diagonal Lines', value: 'diagonal-lines' },
  { label: 'Dots', value: 'dots' },
  { label: 'Grid', value: 'grid' },
  { label: 'Zigzag', value: 'zigzag' },
  { label: 'Crosses', value: 'crosses' },
  { label: 'Triangles', value: 'triangles' },
] as const;

const DEFAULT_SIZE = { width: 1200, height: 630 } as const;

const RESOLUTION_OPTIONS = [
  { label: '1200 × 630 px', value: '1200x630', width: 1200, height: 630, ratio: '1200x630' },
  { label: '800 × 420 px', value: '800x420', width: 800, height: 420, ratio: 'custom' },
  { label: '1080 × 1080 px', value: '1080x1080', width: 1080, height: 1080, ratio: 'square' },
  { label: '1600 × 900 px', value: '1600x900', width: 1600, height: 900, ratio: 'wide' },
  { label: '1080 × 1920 px', value: '1080x1920', width: 1080, height: 1920, ratio: 'story' },
] as const;

const RATIO_OPTIONS = [
  { label: 'Open Graph 1.91:1', value: '1200x630', resolution: '1200x630' },
  { label: 'Square 1:1', value: 'square', resolution: '1080x1080' },
  { label: 'Wide 16:9', value: 'wide', resolution: '1600x900' },
  { label: 'Story 9:16', value: 'story', resolution: '1080x1920' },
  { label: 'Custom', value: 'custom', resolution: null },
] as const;

type PresetName = (typeof PRESETS)[number]['name'];
type BackgroundMode = 'solid' | 'gradient';
type TextAlign = 'left' | 'center' | 'right';
type DirectionValue = (typeof DIRECTIONS)[number]['value'];
type PatternOverlay = (typeof PATTERN_OVERLAYS)[number]['value'];
type RatioValue = (typeof RATIO_OPTIONS)[number]['value'];
type ResolutionValue = (typeof RESOLUTION_OPTIONS)[number]['value'];
type Dimensions = { width: number; height: number };

function normalizeHex(value: string, fallback: string) {
  const trimmed = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed.toUpperCase();
  return fallback;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines = 3) {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const lines: string[] = [];
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
  return lines.slice(0, maxLines);
}

function gradientPoints(direction: DirectionValue, width: number, height: number) {
  if (direction === 'left-right') return [0, 0, width, 0] as const;
  if (direction === 'top-bottom') return [0, 0, 0, height] as const;
  if (direction === 'diagonal-down') return [0, 0, width, height] as const;
  if (direction === 'diagonal-up') return [0, height, width, 0] as const;

  const angle = (Number(direction) * Math.PI) / 180;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.sqrt(width * width + height * height) / 2;
  const dx = Math.cos(angle) * radius;
  const dy = Math.sin(angle) * radius;

  return [centerX - dx, centerY - dy, centerX + dx, centerY + dy] as const;
}

function textPosition(align: TextAlign, width: number, scale: number) {
  const margin = Math.max(44, 88 * scale);
  if (align === 'center') return { x: width / 2, canvasAlign: 'center' as CanvasTextAlign, maxWidth: width - margin * 2 };
  if (align === 'right') return { x: width - margin, canvasAlign: 'right' as CanvasTextAlign, maxWidth: width - margin * 2 };
  return { x: margin, canvasAlign: 'left' as CanvasTextAlign, maxWidth: width - margin * 2 };
}

function drawPatternOverlay(ctx: CanvasRenderingContext2D, pattern: PatternOverlay, width: number, height: number, scale: number) {
  if (pattern === 'none') return;

  const step = Math.max(36, 72 * scale);

  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.lineWidth = Math.max(1, 2 * scale);
  ctx.globalAlpha = 0.14;

  if (pattern === 'diagonal-lines') {
    for (let x = -height; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.lineTo(x + height, 0);
      ctx.stroke();
    }
  }

  if (pattern === 'dots') {
    ctx.globalAlpha = 0.18;
    for (let y = 54 * scale; y < height; y += step) {
      for (let x = 54 * scale; x < width; x += step) {
        ctx.beginPath();
        ctx.arc(x, y, Math.max(2, 4 * scale), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  if (pattern === 'grid') {
    for (let x = 0; x <= width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  if (pattern === 'zigzag') {
    const amplitude = Math.max(9, 18 * scale);
    for (let y = 52 * scale; y < height; y += Math.max(43, 86 * scale)) {
      ctx.beginPath();
      for (let x = -40 * scale; x <= width + 40 * scale; x += Math.max(20, 40 * scale)) {
        const pointY = y + (Math.floor((x + 40 * scale) / Math.max(20, 40 * scale)) % 2 === 0 ? amplitude : -amplitude);
        if (x <= -40 * scale) ctx.moveTo(x, pointY);
        else ctx.lineTo(x, pointY);
      }
      ctx.stroke();
    }
  }

  if (pattern === 'crosses') {
    ctx.globalAlpha = 0.16;
    for (let y = 58 * scale; y < height; y += Math.max(44, 88 * scale)) {
      for (let x = 58 * scale; x < width; x += Math.max(44, 88 * scale)) {
        const arm = Math.max(5, 10 * scale);
        ctx.beginPath();
        ctx.moveTo(x - arm, y - arm);
        ctx.lineTo(x + arm, y + arm);
        ctx.moveTo(x + arm, y - arm);
        ctx.lineTo(x - arm, y + arm);
        ctx.stroke();
      }
    }
  }

  if (pattern === 'triangles') {
    ctx.globalAlpha = 0.13;
    for (let y = 64 * scale; y < height; y += Math.max(46, 92 * scale)) {
      for (let x = 64 * scale; x < width; x += Math.max(46, 92 * scale)) {
        const size = Math.max(7, 14 * scale);
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y + size * 0.85);
        ctx.lineTo(x - size, y + size * 0.85);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  ctx.restore();
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
      download="banner-generator.png"
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

export default function OgImageGeneratorClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [title, setTitle] = useState('Building Better Software With Modern Tools');
  const [subtitle, setSubtitle] = useState('An in-depth guide to scaling your dev workflow with modern browser tools.');
  const [presetName, setPresetName] = useState<PresetName | null>('Teal Midnight');
  const [footer, setFooter] = useState('toolblip.com');
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('gradient');
  const [fromColor, setFromColor] = useState('#4CC8C8');
  const [toColor, setToColor] = useState('#202033');
  const [direction, setDirection] = useState<DirectionValue>('140');
  const [titleFontSize, setTitleFontSize] = useState(44);
  const [subtitleFontSize, setSubtitleFontSize] = useState(20);
  const [alignment, setAlignment] = useState<TextAlign>('left');
  const [patternOverlay, setPatternOverlay] = useState<PatternOverlay>('dots');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [ratio, setRatio] = useState<RatioValue>('1200x630');
  const [resolution, setResolution] = useState<ResolutionValue>('1200x630');
  const [dimensions, setDimensions] = useState<Dimensions>(DEFAULT_SIZE);
  const [backgroundOpen, setBackgroundOpen] = useState(false);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [patternOpen, setPatternOpen] = useState(false);
  const [footerOpen, setFooterOpen] = useState(false);

  const preset = useMemo(
    () => PRESETS.find((item) => item.name === presetName) ?? PRESETS[0],
    [presetName],
  );

  useEffect(() => {
    let cancelled = false;

    const drawBanner = async () => {
      if (typeof document !== 'undefined' && 'fonts' in document) {
        await document.fonts.ready;
      }

      if (cancelled) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const { width, height } = dimensions;
      const scale = Math.min(width / DEFAULT_SIZE.width, height / DEFAULT_SIZE.height);
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const safeFrom = normalizeHex(fromColor, preset.from);
      const safeTo = normalizeHex(toColor, preset.to);

      if (backgroundMode === 'solid') {
        ctx.fillStyle = safeFrom;
      } else {
        const [x0, y0, x1, y1] = gradientPoints(direction, width, height);
        const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        gradient.addColorStop(0, safeFrom);
        gradient.addColorStop(1, safeTo);
        ctx.fillStyle = gradient;
      }
      ctx.fillRect(0, 0, width, height);

      drawPatternOverlay(ctx, patternOverlay, width, height, scale);

      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.arc(width * 0.83, height * 0.19, 180 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(width * 0.87, height * 0.83, 260 * scale, 0, Math.PI * 2);
      ctx.fill();

      const { x, canvasAlign, maxWidth } = textPosition(alignment, width, scale);
      const titleCanvasSize = Math.round(titleFontSize * 1.72 * scale);
      const subtitleCanvasSize = Math.round(subtitleFontSize * 1.75 * scale);
      const titleLineHeight = Math.round(titleCanvasSize * 1.14);
      const subtitleLineHeight = Math.round(subtitleCanvasSize * 1.28);

      ctx.textAlign = canvasAlign;
      ctx.textBaseline = 'top';

      ctx.fillStyle = preset.accent;
      ctx.font = `700 ${Math.round(34 * scale)}px Inter, Arial, sans-serif`;
      ctx.fillText('BANNER GENERATOR', x, 100 * scale);

      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${titleCanvasSize}px Inter, Arial, sans-serif`;
      const footerY = height - 78 * scale;
      const subtitleGap = 18 * scale;
      const safeContentBottom = footerY - 24 * scale;
      const titleTop = 170 * scale;
      let titleLines = wrapText(ctx, title || 'Untitled Article', maxWidth, 3);
      while (
        titleLines.length > 1 &&
        titleTop + titleLines.length * titleLineHeight + subtitleGap + subtitleLineHeight > safeContentBottom
      ) {
        titleLines = titleLines.slice(0, -1);
      }
      titleLines.forEach((line, index) => ctx.fillText(line, x, titleTop + index * titleLineHeight));

      const subtitleTop = titleTop + titleLines.length * titleLineHeight + subtitleGap;
      ctx.fillStyle = 'rgba(255,255,255,0.86)';
      ctx.font = `400 ${subtitleCanvasSize}px Inter, Arial, sans-serif`;
      let subtitleLines = wrapText(ctx, subtitle, Math.min(maxWidth, width - 120 * scale), 2);
      while (subtitleLines.length > 0 && subtitleTop + subtitleLines.length * subtitleLineHeight > safeContentBottom) {
        subtitleLines = subtitleLines.slice(0, -1);
      }
      subtitleLines.forEach((line, index) => ctx.fillText(line, x, subtitleTop + index * subtitleLineHeight));

      ctx.fillStyle = 'rgba(255,255,255,0.78)';
      ctx.font = `600 ${Math.round(28 * scale)}px Inter, Arial, sans-serif`;
      ctx.fillText(footer || 'toolblip.com', x, footerY);

      setDownloadUrl(canvas.toDataURL('image/png'));
    };

    const timeout = window.setTimeout(() => {
      void drawBanner();
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [
    alignment,
    backgroundMode,
    dimensions,
    direction,
    footer,
    fromColor,
    patternOverlay,
    preset,
    subtitle,
    subtitleFontSize,
    title,
    titleFontSize,
    toColor,
  ]);

  const choosePreset = (item: (typeof PRESETS)[number]) => {
    setPresetName(item.name);
    setFromColor(item.from.toUpperCase());
    setToColor(item.to.toUpperCase());
    setBackgroundMode('gradient');
  };

  const chooseRatio = (value: RatioValue) => {
    setRatio(value);
    const option = RATIO_OPTIONS.find((item) => item.value === value);
    if (!option?.resolution) return;

    const size = RESOLUTION_OPTIONS.find((item) => item.value === option.resolution);
    if (!size) return;

    setResolution(size.value);
    setDimensions({ width: size.width, height: size.height });
  };

  const chooseResolution = (value: ResolutionValue) => {
    const size = RESOLUTION_OPTIONS.find((item) => item.value === value);
    if (!size) return;

    setResolution(size.value);
    setRatio(size.ratio as RatioValue);
    setDimensions({ width: size.width, height: size.height });
  };

  const updateFromColor = (value: string) => {
    setPresetName(null);
    setFromColor(value.toUpperCase());
  };

  const updateToColor = (value: string) => {
    setPresetName(null);
    setToColor(value.toUpperCase());
  };

  return (
    <div className="space-y-6" data-testid="article-banner-generator">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="text-base font-semibold text-gray-900 dark:text-white">Customize your banner</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create configurable blog cover, banner, and Open Graph images with editable copy, polished gradients, typography controls, and one-click PNG download.
          </p>
        </div>
        <div className="hidden shrink-0 sm:block">
          <DownloadButton downloadUrl={downloadUrl} placement="top" />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="space-y-5 border-b border-gray-100 p-5 dark:border-gray-800">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              <span className="text-lg text-violet-500" aria-hidden="true">T</span>
              <span>CONTENT</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ratio</span>
                <select
                  aria-label="Banner ratio"
                  value={ratio}
                  onChange={(event) => chooseRatio(event.target.value as RatioValue)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  {RATIO_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Resolution</span>
                <select
                  aria-label="Banner resolution"
                  value={resolution}
                  onChange={(event) => chooseResolution(event.target.value as ResolutionValue)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  {RESOLUTION_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</span>
              <textarea
                aria-label="Banner title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                rows={2}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base font-semibold text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Subtitle</span>
              <textarea
                aria-label="Banner subtitle"
                value={subtitle}
                onChange={(event) => setSubtitle(event.target.value)}
                rows={2}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </label>
          </div>

          <CollapsibleSection
            icon="🎨"
            isOpen={backgroundOpen}
            onToggle={() => setBackgroundOpen((open) => !open)}
            title="Background"
          >
            <div className="grid grid-cols-2 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-900" role="group" aria-label="Background mode">
              {(['solid', 'gradient'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setBackgroundMode(mode)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    backgroundMode === mode
                      ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-800 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                  aria-pressed={backgroundMode === mode}
                >
                  {mode === 'solid' ? 'Solid' : 'Gradient'}
                </button>
              ))}
            </div>

            <div className="space-y-2" role="group" aria-label="Background presets">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Presets</div>
              <div className="grid grid-cols-4 gap-2">
                {PRESETS.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => choosePreset(item)}
                    className={`h-11 rounded-lg border transition ${presetName === item.name ? 'border-violet-500 ring-2 ring-violet-300' : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'}`}
                    aria-label={item.name}
                    aria-pressed={presetName === item.name}
                    style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to})` }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">From</span>
                <div className="flex gap-2">
                  <input
                    aria-label="From color picker"
                    type="color"
                    value={normalizeHex(fromColor, preset.from)}
                    onChange={(event) => updateFromColor(event.target.value)}
                    className="h-12 w-14 rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                  />
                  <input
                    aria-label="From color hex"
                    value={fromColor}
                    onChange={(event) => updateFromColor(event.target.value)}
                    onBlur={() => setFromColor((value) => normalizeHex(value, preset.from))}
                    className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">To</span>
                <div className="flex gap-2">
                  <input
                    aria-label="To color picker"
                    type="color"
                    value={normalizeHex(toColor, preset.to)}
                    onChange={(event) => updateToColor(event.target.value)}
                    disabled={backgroundMode === 'solid'}
                    className="h-12 w-14 rounded-lg border border-gray-200 bg-white p-1 shadow-sm disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900"
                  />
                  <input
                    aria-label="To color hex"
                    value={toColor}
                    onChange={(event) => updateToColor(event.target.value)}
                    onBlur={() => setToColor((value) => normalizeHex(value, preset.to))}
                    disabled={backgroundMode === 'solid'}
                    className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Direction</span>
              <select
                aria-label="Gradient direction"
                value={direction}
                onChange={(event) => setDirection(event.target.value as DirectionValue)}
                disabled={backgroundMode === 'solid'}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                {DIRECTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </CollapsibleSection>

          <CollapsibleSection
            icon="Aa"
            isOpen={typographyOpen}
            onToggle={() => setTypographyOpen((open) => !open)}
            title="Typography"
          >
            <label className="block space-y-2">
              <SliderLabel value={titleFontSize}>Title size</SliderLabel>
              <input
                aria-label="Title font size"
                type="range"
                min="28"
                max="72"
                value={titleFontSize}
                onChange={(event) => setTitleFontSize(Number(event.target.value))}
                className="w-full accent-violet-600"
              />
            </label>

            <label className="block space-y-2">
              <SliderLabel value={subtitleFontSize}>Subtitle size</SliderLabel>
              <input
                aria-label="Subtitle font size"
                type="range"
                min="14"
                max="36"
                value={subtitleFontSize}
                onChange={(event) => setSubtitleFontSize(Number(event.target.value))}
                className="w-full accent-violet-600"
              />
            </label>

            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Text alignment">
              {([
                ['left', 'Align left', '☰'],
                ['center', 'Align center', '≡'],
                ['right', 'Align right', '☷'],
              ] as const).map(([value, label, icon]) => (
                <button
                  key={value}
                  type="button"
                  aria-label={label}
                  aria-pressed={alignment === value}
                  onClick={() => setAlignment(value)}
                  className={`rounded-xl border px-4 py-3 text-lg transition ${
                    alignment === value
                      ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            icon="▦"
            isOpen={patternOpen}
            onToggle={() => setPatternOpen((open) => !open)}
            title="Pattern overlay"
          >
            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pattern</span>
              <select
                aria-label="Pattern overlay"
                value={patternOverlay}
                onChange={(event) => setPatternOverlay(event.target.value as PatternOverlay)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                {PATTERN_OVERLAYS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </CollapsibleSection>

          <CollapsibleSection
            icon="▣"
            isOpen={footerOpen}
            onToggle={() => setFooterOpen((open) => !open)}
            title="Footer"
          >
            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Footer text</span>
              <input
                aria-label="Footer text"
                value={footer}
                onChange={(event) => setFooter(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
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
              Preview {dimensions.width} × {dimensions.height} px
            </div>
            <div className="sm:hidden">
              <DownloadButton downloadUrl={downloadUrl} placement="top" />
            </div>
          </div>
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            data-testid="article-banner-preview"
            aria-label="Banner preview"
            className="h-auto w-full rounded-2xl border border-gray-200 shadow-sm dark:border-gray-800"
          />
        </div>
      </div>
    </div>
  );
}
