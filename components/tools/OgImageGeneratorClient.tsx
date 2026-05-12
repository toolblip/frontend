'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

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

const WIDTH = 1200;
const HEIGHT = 630;

type PresetName = (typeof PRESETS)[number]['name'];
type BackgroundMode = 'solid' | 'gradient';
type TextAlign = 'left' | 'center' | 'right';
type DirectionValue = (typeof DIRECTIONS)[number]['value'];
type PatternOverlay = (typeof PATTERN_OVERLAYS)[number]['value'];

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

function gradientPoints(direction: DirectionValue) {
  if (direction === 'left-right') return [0, 0, WIDTH, 0] as const;
  if (direction === 'top-bottom') return [0, 0, 0, HEIGHT] as const;
  if (direction === 'diagonal-down') return [0, 0, WIDTH, HEIGHT] as const;
  if (direction === 'diagonal-up') return [0, HEIGHT, WIDTH, 0] as const;

  const angle = (Number(direction) * Math.PI) / 180;
  const centerX = WIDTH / 2;
  const centerY = HEIGHT / 2;
  const radius = Math.sqrt(WIDTH * WIDTH + HEIGHT * HEIGHT) / 2;
  const dx = Math.cos(angle) * radius;
  const dy = Math.sin(angle) * radius;

  return [centerX - dx, centerY - dy, centerX + dx, centerY + dy] as const;
}

function textPosition(align: TextAlign) {
  if (align === 'center') return { x: WIDTH / 2, canvasAlign: 'center' as CanvasTextAlign, maxWidth: 960 };
  if (align === 'right') return { x: WIDTH - 88, canvasAlign: 'right' as CanvasTextAlign, maxWidth: 940 };
  return { x: 88, canvasAlign: 'left' as CanvasTextAlign, maxWidth: 980 };
}

function drawPatternOverlay(ctx: CanvasRenderingContext2D, pattern: PatternOverlay) {
  if (pattern === 'none') return;

  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.14;

  if (pattern === 'diagonal-lines') {
    for (let x = -HEIGHT; x < WIDTH; x += 72) {
      ctx.beginPath();
      ctx.moveTo(x, HEIGHT);
      ctx.lineTo(x + HEIGHT, 0);
      ctx.stroke();
    }
  }

  if (pattern === 'dots') {
    ctx.globalAlpha = 0.18;
    for (let y = 54; y < HEIGHT; y += 72) {
      for (let x = 54; x < WIDTH; x += 72) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  if (pattern === 'grid') {
    for (let x = 0; x <= WIDTH; x += 72) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= HEIGHT; y += 72) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(WIDTH, y);
      ctx.stroke();
    }
  }

  if (pattern === 'zigzag') {
    for (let y = 52; y < HEIGHT; y += 86) {
      ctx.beginPath();
      for (let x = -40; x <= WIDTH + 40; x += 40) {
        const pointY = y + (Math.floor((x + 40) / 40) % 2 === 0 ? 18 : -18);
        if (x === -40) ctx.moveTo(x, pointY);
        else ctx.lineTo(x, pointY);
      }
      ctx.stroke();
    }
  }

  if (pattern === 'crosses') {
    ctx.globalAlpha = 0.16;
    for (let y = 58; y < HEIGHT; y += 88) {
      for (let x = 58; x < WIDTH; x += 88) {
        ctx.beginPath();
        ctx.moveTo(x - 10, y - 10);
        ctx.lineTo(x + 10, y + 10);
        ctx.moveTo(x + 10, y - 10);
        ctx.lineTo(x - 10, y + 10);
        ctx.stroke();
      }
    }
  }

  if (pattern === 'triangles') {
    ctx.globalAlpha = 0.13;
    for (let y = 64; y < HEIGHT; y += 92) {
      for (let x = 64; x < WIDTH; x += 92) {
        ctx.beginPath();
        ctx.moveTo(x, y - 14);
        ctx.lineTo(x + 14, y + 12);
        ctx.lineTo(x - 14, y + 12);
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
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['CONTENT', 'BACKGROUND', 'TYPOGRAPHY', 'PATTERN OVERLAY']));
  const [resolution, setResolution] = useState<'1200x630' | '1200x400' | '800x400'>('1200x630');

  const RESOLUTIONS: Record<string, { label: string; width: number; height: number }> = {
    '1200x630': { label: '1200×630 (Open Graph)', width: 1200, height: 630 },
    '1200x400': { label: '1200×400 (Wide Banner)', width: 1200, height: 400 },
    '800x400': { label: '800×400 (Small Banner)', width: 800, height: 400 },
  };

  const currentRes = RESOLUTIONS[resolution];
  const WIDTH = currentRes.width;
  const HEIGHT = currentRes.height;

  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

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

      canvas.width = WIDTH;
      canvas.height = HEIGHT;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const safeFrom = normalizeHex(fromColor, preset.from);
      const safeTo = normalizeHex(toColor, preset.to);

      if (backgroundMode === 'solid') {
        ctx.fillStyle = safeFrom;
      } else {
        const [x0, y0, x1, y1] = gradientPoints(direction);
        const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        gradient.addColorStop(0, safeFrom);
        gradient.addColorStop(1, safeTo);
        ctx.fillStyle = gradient;
      }
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      drawPatternOverlay(ctx, patternOverlay);

      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.arc(1000, 120, 180, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(1040, 520, 260, 0, Math.PI * 2);
      ctx.fill();

      const { x, canvasAlign, maxWidth } = textPosition(alignment);
      const titleCanvasSize = Math.round(titleFontSize * 1.72);
      const subtitleCanvasSize = Math.round(subtitleFontSize * 1.75);
      const titleLineHeight = Math.round(titleCanvasSize * 1.14);
      const subtitleLineHeight = Math.round(subtitleCanvasSize * 1.28);

      ctx.textAlign = canvasAlign;
      ctx.textBaseline = 'top';

      ctx.fillStyle = preset.accent;
      ctx.font = '700 34px Inter, Arial, sans-serif';
      ctx.fillText('BANNER GENERATOR', x, 100);

      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${titleCanvasSize}px Inter, Arial, sans-serif`;
      const footerY = 552;
      const subtitleGap = 18;
      const safeContentBottom = footerY - 24;
      let titleLines = wrapText(ctx, title || 'Untitled Article', maxWidth, 3);
      while (
        titleLines.length > 1 &&
        170 + titleLines.length * titleLineHeight + subtitleGap + subtitleLineHeight > safeContentBottom
      ) {
        titleLines = titleLines.slice(0, -1);
      }
      titleLines.forEach((line, index) => ctx.fillText(line, x, 170 + index * titleLineHeight));

      const subtitleTop = 170 + titleLines.length * titleLineHeight + subtitleGap;
      ctx.fillStyle = 'rgba(255,255,255,0.86)';
      ctx.font = `400 ${subtitleCanvasSize}px Inter, Arial, sans-serif`;
      let subtitleLines = wrapText(ctx, subtitle, Math.min(maxWidth, 940), 2);
      while (subtitleLines.length > 0 && subtitleTop + subtitleLines.length * subtitleLineHeight > safeContentBottom) {
        subtitleLines = subtitleLines.slice(0, -1);
      }
      subtitleLines.forEach((line, index) => ctx.fillText(line, x, subtitleTop + index * subtitleLineHeight));

      ctx.fillStyle = 'rgba(255,255,255,0.78)';
      ctx.font = '600 28px Inter, Arial, sans-serif';
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
      <div className="space-y-2">
        <div className="text-base font-semibold text-gray-900 dark:text-white">Customize your banner</div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create 1200×630 blog cover and Open Graph images with editable copy, polished gradients, typography controls, and one-click PNG download.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="space-y-5 border-b border-gray-100 p-5 dark:border-gray-800">
            <button
              type="button"
              onClick={() => toggleSection('CONTENT')}
              className="flex w-full items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 cursor-pointer"
              aria-expanded={openSections.has('CONTENT')}
            >
              <span className="text-lg text-violet-500" aria-hidden="true">T</span>
              <span>CONTENT</span>
              <svg className={`ml-auto h-4 w-4 transition-transform ${openSections.has('CONTENT') ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openSections.has('CONTENT') && (
              <>
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

            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Footer text</span>
              <input
                aria-label="Footer text"
                value={footer}
                onChange={(event) => setFooter(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Resolution</span>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Resolution">
                {Object.entries(RESOLUTIONS).map(([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={resolution === key}
                    onClick={() => setResolution(key as typeof resolution)}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                      resolution === key
                        ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {val.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </label>
              </>
            )}
          </div>

          <div className="space-y-5 border-b border-gray-100 p-5 dark:border-gray-800">
            <button
              type="button"
              onClick={() => toggleSection('BACKGROUND')}
              className="flex w-full items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 cursor-pointer"
              aria-expanded={openSections.has('BACKGROUND')}
            >
              <span className="text-base text-violet-500" aria-hidden="true">🎨</span>
              <span>BACKGROUND</span>
              <svg className={`ml-auto h-4 w-4 transition-transform ${openSections.has('BACKGROUND') ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openSections.has('BACKGROUND') && (
              <>
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
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Gradient direction</span>
              <select
                aria-label="Gradient direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value as DirectionValue)}
                disabled={backgroundMode === 'solid'}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                {DIRECTIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </label>
            </>
          )}
        </div>

        <div className="space-y-5 p-5">
          <button
            type="button"
            onClick={() => toggleSection('TYPOGRAPHY')}
            className="flex w-full items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 cursor-pointer"
            aria-expanded={openSections.has('TYPOGRAPHY')}
          >
            <span className="text-base text-violet-500" aria-hidden="true">Aa</span>
            <span>TYPOGRAPHY</span>
            <svg className={`ml-auto h-4 w-4 transition-transform ${openSections.has('TYPOGRAPHY') ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openSections.has('TYPOGRAPHY') && (
            <>
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
            </>
          )}

          <div className="space-y-4 border-t border-gray-100 pt-5 dark:border-gray-800">
            <button
              type="button"
              onClick={() => toggleSection('PATTERN OVERLAY')}
              className="flex w-full items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 cursor-pointer"
              aria-expanded={openSections.has('PATTERN OVERLAY')}
            >
              <span className="text-base text-violet-500" aria-hidden="true">▦</span>
              <span>PATTERN OVERLAY</span>
              <svg className={`ml-auto h-4 w-4 transition-transform ${openSections.has('PATTERN OVERLAY') ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openSections.has('PATTERN OVERLAY') && (
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
            )}
          </div>

          {downloadUrl && (
              <a
                href={downloadUrl}
                download="banner-generator.png"
                className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                Download PNG
              </a>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            {downloadUrl && (
              <a
                href={downloadUrl}
                download="banner-generator.png"
                className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-red-700"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75v6.75m0-6.75L12 18m0 0l3.75 3.75M12 18l-3.75-3.75" />
                </svg>
                Download
              </a>
            )}
            <canvas
              ref={canvasRef}
              width={WIDTH}
              height={HEIGHT}
              data-testid="article-banner-preview"
              aria-label="Banner preview"
              className="h-auto w-full rounded-2xl border border-gray-200 shadow-sm dark:border-gray-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
