/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '@/app/providers/auth-provider';

type BackgroundMode = 'solid' | 'gradient' | 'dotted-frame';
type PatternOverlay = 'none' | 'diagonal-lines' | 'dots' | 'grid' | 'zigzag' | 'crosses' | 'triangles';
type BannerStyle = 'dotted-frame' | 'solid-frame' | 'double-frame' | 'dash-frame' | 'corner-accent' | 'shadow-card';

type DirectionValue = '0' | '45' | '90' | '135' | '140' | '180' | '225' | '270' | '315';
type TextAlign = 'left' | 'center' | 'right';
type PresetName = 'Teal Midnight' | 'Indigo Violet' | 'Sky Cyan' | 'Amber Fire' | 'Mint Teal' | 'Rose Pink' | 'Deep Ocean' | 'Sunset Punch' | 'Purple Blue' | 'Green Glow' | 'Slate Night' | 'Pink Purple';

interface Preset {
  name: PresetName;
  from: string;
  to: string;
}

interface Direction {
  value: DirectionValue;
  label: string;
  icon: string;
}

const PRESETS: Preset[] = [
  { name: 'Teal Midnight', from: '#4CC8C8', to: '#202033' },
  { name: 'Indigo Violet', from: '#6366F1', to: '#8B5CF6' },
  { name: 'Sky Cyan', from: '#38BDF8', to: '#0EA5E9' },
  { name: 'Amber Fire', from: '#F59E0B', to: '#EF4444' },
  { name: 'Mint Teal', from: '#10B981', to: '#14B8A6' },
  { name: 'Rose Pink', from: '#EC4899', to: '#F472B6' },
  { name: 'Deep Ocean', from: '#1E3A5F', to: '#0F2744' },
  { name: 'Sunset Punch', from: '#F97316', to: '#DC2626' },
  { name: 'Purple Blue', from: '#8B5CF6', to: '#2563EB' },
  { name: 'Green Glow', from: '#22C55E', to: '#16A34A' },
  { name: 'Slate Night', from: '#334155', to: '#0F172A' },
  { name: 'Pink Purple', from: '#DB2777', to: '#9333EA' },
];

const DIRECTIONS: Direction[] = [
  { value: '0', label: 'Left → Right', icon: '←' },
  { value: '90', label: 'Top → Bottom', icon: '↑' },
  { value: '45', label: 'Diagonal ↘', icon: '↘' },
  { value: '135', label: 'Diagonal ↗', icon: '↗' },
  { value: '140', label: '140° Angle', icon: '→' },
  { value: '180', label: 'Bottom → Top', icon: '↓' },
  { value: '225', label: 'Diagonal ↙', icon: '↙' },
  { value: '270', label: 'Right → Left', icon: '←' },
  { value: '315', label: 'Diagonal ↗', icon: '↗' },
];


const BANNER_STYLES = [
  { value: 'dotted-frame', label: 'Dotted Border' },
  { value: 'solid-frame', label: 'Solid Border' },
  { value: 'double-frame', label: 'Double Border' },
  { value: 'dash-frame', label: 'Dash Border' },
  { value: 'corner-accent', label: 'Corner Accent' },
  { value: 'shadow-card', label: 'Shadow Card' },
];

const PATTERN_OVERLAYS: Array<{ value: PatternOverlay; label: string }> = [
  { value: 'none', label: 'None' },
  { value: 'diagonal-lines', label: 'Diagonal Lines' },
  { value: 'dots', label: 'Dots' },
  { value: 'grid', label: 'Grid' },
  { value: 'zigzag', label: 'Zigzag' },
  { value: 'crosses', label: 'Crosses' },
  { value: 'triangles', label: 'Triangles' },
];

function createDirectionalGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  direction: DirectionValue,
  from: string,
  to: string,
) {
  const horizontal = ['0', '45', '135', '140', '180', '225', '270', '315'].includes(direction);
  const angle = parseInt(direction, 10);
  const angleRad = (angle * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  const x1 = horizontal
    ? cos < 0 ? width : 0
    : (width - (width * Math.abs(cos))) / 2 + (cos > 0 ? width * Math.abs(cos) : 0);
  const y1 = horizontal
    ? sin < 0 ? height : 0
    : (height - (height * Math.abs(sin))) / 2 - (sin < 0 ? height * Math.abs(sin) : 0);
  const x2 = width - x1;
  const y2 = height - y1;
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, from);
  gradient.addColorStop(1, to);
  return gradient;
}

function SliderLabel({ value, children }: { value: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{children}</span>
      <span className="text-xs text-gray-400">{value}px</span>
    </div>
  );
}

export default function OgImageGeneratorClient() {
  const [title, setTitle] = useState('Building Better Software\nWith Modern Tools');
  const [subtitle, setSubtitle] = useState('An in-depth guide to scaling your development workflow');
  const [foregroundPresetName, setForegroundPresetName] = useState<PresetName | null>('Teal Midnight');
  const [backgroundPresetName, setBackgroundPresetName] = useState<PresetName | null>('Teal Midnight');
  const [footer, setFooter] = useState('');
  const [footerLogo, setFooterLogo] = useState<string | null>(null);
  const [bannerStyle, setBannerStyle] = useState<BannerStyle>('dotted-frame');
  const [patternOverlay, setPatternOverlay] = useState<PatternOverlay>('dots');
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('gradient');
  const [foregroundFromColor, setForegroundFromColor] = useState('#4CC8C8');
  const [foregroundToColor, setForegroundToColor] = useState('#202033');
  const [foregroundDirection, setForegroundDirection] = useState<DirectionValue>('140');
  const [backgroundFromColor, setBackgroundFromColor] = useState('#4CC8C8');
  const [backgroundToColor, setBackgroundToColor] = useState('#202033');
  const [backgroundDirection, setBackgroundDirection] = useState<DirectionValue>('140');
  const [titleFontSize, setTitleFontSize] = useState(44);
  const [subtitleFontSize, setSubtitleFontSize] = useState(20);
  const [alignment, setAlignment] = useState<TextAlign>('center');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['CONTENT', 'BACKGROUND']));
  const [resolution, setResolution] = useState<'1200x630' | '1200x400' | '800x420' | '800x400' | 'custom'>('1200x630');
  const [customWidth, setCustomWidth] = useState(1200);
  const [customHeight, setCustomHeight] = useState(630);
  const { user } = useAuth();
  const isFreeUser = !user || user.plan === 'free';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const RESOLUTIONS: Record<string, { label: string; width: number; height: number }> = {
    '1200x630': { label: '1200×630 (Open Graph)', width: 1200, height: 630 },
    '1200x400': { label: '1200×400 (Wide Banner)', width: 1200, height: 400 },
    '800x420': { label: '800×420 (Article Banner)', width: 800, height: 420 },
    '800x400': { label: '800×400 (Small Banner)', width: 800, height: 400 },
    'custom': { label: 'Custom', width: customWidth, height: customHeight },
  };

  const currentRes = RESOLUTIONS[resolution];
  const effectiveWidth = resolution === 'custom' ? customWidth : currentRes.width;
  const effectiveHeight = resolution === 'custom' ? customHeight : currentRes.height;
  const WIDTH = effectiveWidth;
  const HEIGHT = effectiveHeight;

  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const foregroundPreset = useMemo(
    () => PRESETS.find((item) => item.name === foregroundPresetName) ?? PRESETS[0],
    [foregroundPresetName],
  );
  const backgroundPreset = useMemo(
    () => PRESETS.find((item) => item.name === backgroundPresetName) ?? PRESETS[0],
    [backgroundPresetName],
  );

  useEffect(() => {
    let cancelled = false;

    const drawBanner = async () => {
      if (typeof document !== 'undefined' && 'fonts' in document) {
        await document.fonts.ready;
      }

      const canvas = canvasRef.current;
      if (!canvas || cancelled) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // ===== BANNER STYLE RENDERING =====
      // All styles: gradient background → white card → text

      // 1. Background (all styles)
      const bgGrad = createDirectionalGradient(
        ctx,
        WIDTH,
        HEIGHT,
        backgroundDirection,
        backgroundFromColor,
        backgroundToColor,
      );
      ctx.fillStyle = backgroundMode === 'solid' ? backgroundFromColor : bgGrad;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const drawPatternOverlay = () => {
        if (patternOverlay === 'none') return;

        const patternColor = backgroundMode === 'solid' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.14)';
        const accentColor = 'rgba(17,24,39,0.08)';
        const useAccent = backgroundMode === 'solid' && backgroundFromColor.toLowerCase() === '#ffffff';
        const strokeColor = useAccent ? accentColor : patternColor;
        const spacing = Math.max(18, Math.round(Math.min(WIDTH, HEIGHT) / 22));
        const size = Math.max(2, Math.round(Math.min(WIDTH, HEIGHT) / 220));

        ctx.save();
        ctx.globalAlpha = 1;
        ctx.lineWidth = size;
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = strokeColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        switch (patternOverlay) {
          case 'diagonal-lines': {
            for (let x = -HEIGHT; x < WIDTH + HEIGHT; x += spacing) {
              ctx.beginPath();
              ctx.moveTo(x, 0);
              ctx.lineTo(x + HEIGHT, HEIGHT);
              ctx.stroke();
            }
            break;
          }
          case 'dots': {
            const dot = Math.max(1.5, size * 0.75);
            for (let y = spacing / 2; y < HEIGHT; y += spacing) {
              for (let x = spacing / 2; x < WIDTH; x += spacing) {
                ctx.beginPath();
                ctx.arc(x, y, dot, 0, Math.PI * 2);
                ctx.fill();
              }
            }
            break;
          }
          case 'grid': {
            ctx.lineWidth = Math.max(1, size);
            for (let x = 0; x <= WIDTH; x += spacing) {
              ctx.beginPath();
              ctx.moveTo(x, 0);
              ctx.lineTo(x, HEIGHT);
              ctx.stroke();
            }
            for (let y = 0; y <= HEIGHT; y += spacing) {
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(WIDTH, y);
              ctx.stroke();
            }
            break;
          }
          case 'zigzag': {
            const step = spacing;
            const amp = Math.max(6, Math.round(step / 2.2));
            for (let y = -amp; y < HEIGHT + amp; y += step * 1.8) {
              ctx.beginPath();
              for (let x = -step; x <= WIDTH + step; x += step) {
                const idx = Math.round((x + step) / step);
                const py = y + (idx % 2 === 0 ? -amp : amp);
                if (x === -step) ctx.moveTo(x, py);
                else ctx.lineTo(x, py);
              }
              ctx.stroke();
            }
            break;
          }
          case 'crosses': {
            const cross = Math.max(5, Math.round(spacing / 3.5));
            for (let y = spacing / 2; y < HEIGHT; y += spacing) {
              for (let x = spacing / 2; x < WIDTH; x += spacing) {
                ctx.beginPath();
                ctx.moveTo(x - cross, y - cross);
                ctx.lineTo(x + cross, y + cross);
                ctx.moveTo(x + cross, y - cross);
                ctx.lineTo(x - cross, y + cross);
                ctx.stroke();
              }
            }
            break;
          }
          case 'triangles': {
            const tri = Math.max(6, Math.round(spacing / 2.6));
            for (let y = spacing / 2; y < HEIGHT; y += spacing) {
              for (let x = spacing / 2; x < WIDTH; x += spacing) {
                ctx.beginPath();
                ctx.moveTo(x, y - tri);
                ctx.lineTo(x + tri, y + tri);
                ctx.lineTo(x - tri, y + tri);
                ctx.closePath();
                ctx.stroke();
              }
            }
            break;
          }
        }

        ctx.restore();
      };

      drawPatternOverlay();

      // 2. White card (all styles)  -  scale with the selected resolution
      const tallBanner = HEIGHT >= 600;
      const compactBanner = HEIGHT <= 440;
      const cardW = Math.round(WIDTH * (tallBanner ? 0.9 : compactBanner ? 0.89 : 0.875));
      const cardH = Math.round(HEIGHT * (tallBanner ? 0.68 : compactBanner ? 0.77 : 0.81));
      const cardX = Math.round((WIDTH - cardW) / 2);
      const cardY = Math.round((HEIGHT - cardH) / 2);
      const cardRadius = Math.round(Math.max(10, Math.min(cardW, cardH) * 0.03));
      const cardPadX = Math.round(cardW * 0.065);
      const cardPadY = Math.round(cardH * (tallBanner ? 0.09 : compactBanner ? 0.1 : 0.12));

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
      ctx.clip();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = createDirectionalGradient(
        ctx,
        cardW,
        cardH,
        foregroundDirection,
        foregroundFromColor,
        foregroundToColor,
      );
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.restore();

      const drawFrame = () => {
        const inset = Math.max(6, Math.round(Math.min(cardW, cardH) * 0.015));
        const frameX = cardX + inset / 2;
        const frameY = cardY + inset / 2;
        const frameW = cardW - inset;
        const frameH = cardH - inset;
        const frameRadius = Math.max(8, cardRadius - inset / 2);

        ctx.save();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = createDirectionalGradient(
          ctx,
          cardW,
          cardH,
          foregroundDirection,
          foregroundFromColor,
          foregroundToColor,
        );

        switch (bannerStyle) {
          case 'dotted-frame':
            ctx.lineWidth = 4;
            ctx.setLineDash([1, 8]);
            ctx.beginPath();
            ctx.roundRect(frameX, frameY, frameW, frameH, frameRadius);
            ctx.stroke();
            break;
          case 'dash-frame':
            ctx.lineWidth = 4;
            ctx.setLineDash([12, 8]);
            ctx.beginPath();
            ctx.roundRect(frameX, frameY, frameW, frameH, frameRadius);
            ctx.stroke();
            break;
          case 'solid-frame':
            ctx.lineWidth = 4;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.roundRect(frameX, frameY, frameW, frameH, frameRadius);
            ctx.stroke();
            break;
          case 'double-frame': {
            ctx.lineWidth = 3;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.roundRect(frameX, frameY, frameW, frameH, frameRadius);
            ctx.stroke();
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(frameX + 8, frameY + 8, frameW - 16, frameH - 16, Math.max(6, frameRadius - 8));
            ctx.stroke();
            break;
          }
          case 'corner-accent': {
            ctx.lineWidth = 5;
            ctx.setLineDash([]);
            const corner = Math.max(22, Math.round(Math.min(cardW, cardH) * 0.055));
            const x1 = cardX + inset;
            const y1 = cardY + inset;
            const x2 = cardX + cardW - inset;
            const y2 = cardY + cardH - inset;
            ctx.beginPath();
            // top-left
            ctx.moveTo(x1, y1 + corner);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x1 + corner, y1);
            // top-right
            ctx.moveTo(x2 - corner, y1);
            ctx.lineTo(x2, y1);
            ctx.lineTo(x2, y1 + corner);
            // bottom-right
            ctx.moveTo(x2, y2 - corner);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x2 - corner, y2);
            // bottom-left
            ctx.moveTo(x1 + corner, y2);
            ctx.lineTo(x1, y2);
            ctx.lineTo(x1, y2 - corner);
            ctx.stroke();
            break;
          }
          case 'shadow-card':
            ctx.shadowColor = 'rgba(0,0,0,0.18)';
            ctx.shadowBlur = 18;
            ctx.shadowOffsetY = 6;
            ctx.lineWidth = 2;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.roundRect(frameX, frameY, frameW, frameH, frameRadius);
            ctx.stroke();
            break;
        }

        ctx.restore();
      };

      drawFrame();

      // Text rendering inside white card
      const textPadX = cardX + cardPadX;
      const maxTextWidth = WIDTH - textPadX * 2;
      const innerTop = cardY + cardPadY;
      const innerBottom = cardY + cardH - cardPadY;
      const innerHeight = innerBottom - innerTop;

      // Match reference colors exactly
      const textColor = '#111827';
      const subColor = '#6b7280';
      const footerColor = 'rgba(17,24,39,0.35)';

      const titleLines = title.split('\n').filter(Boolean);
      const fitFontSize = (lines: string[], weight: number, startSize: number, minSize: number) => {
        let size = startSize;
        while (size > minSize) {
          ctx.font = `${weight} ${size}px Inter, Arial, sans-serif`;
          const widestLine = Math.max(...lines.map((line) => ctx.measureText(line).width));
          if (widestLine <= maxTextWidth) return size;
          size -= 1;
        }
        return minSize;
      };

      const minTitleSize = titleLines.length > 1 ? 28 : 30;
      const minSubtitleSize = 13;
      let titleSize = fitFontSize(titleLines, 800, titleFontSize, minTitleSize);
      let subtitleSize = fitFontSize([subtitle], 400, subtitleFontSize, minSubtitleSize);
      let titleLineHeight = titleSize * 1.12;
      let titleGap = Math.max(8, titleSize * 0.16);
      let subtitleGap = Math.max(14, titleSize * 0.28);
      let subLineHeight = subtitleSize * 1.38;
      const recalcBlockHeight = () => {
        const titleBlockHeight = titleLines.length * titleLineHeight + Math.max(0, titleLines.length - 1) * titleGap;
        return titleBlockHeight + subtitleGap + subLineHeight;
      };
      let blockHeight = recalcBlockHeight();

      // If the content is still too tall, shrink both title and subtitle together until it fits.
      let attempts = 0;
      while (blockHeight > innerHeight && attempts < 12) {
        const shrink = Math.min(0.98, Math.max(0.82, innerHeight / blockHeight));
        const nextTitleSize = Math.max(minTitleSize, Math.floor(titleSize * shrink));
        const nextSubtitleSize = Math.max(minSubtitleSize, Math.floor(subtitleSize * shrink));

        if (nextTitleSize === titleSize && nextSubtitleSize === subtitleSize) {
          break;
        }

        titleSize = nextTitleSize;
        subtitleSize = nextSubtitleSize;
        titleLineHeight = titleSize * 1.12;
        titleGap = Math.max(8, titleSize * 0.16);
        subtitleGap = Math.max(14, titleSize * 0.28);
        subLineHeight = subtitleSize * 1.38;
        blockHeight = recalcBlockHeight();
        attempts += 1;
      }

      const extraSpace = Math.max(0, innerHeight - blockHeight);
      const textStartY = innerTop + extraSpace * 0.5;
      const titleBlockHeight = blockHeight - subtitleGap - subLineHeight;

      let textX = textPadX;
      if (alignment === 'center') {
        ctx.textAlign = 'center';
        textX = WIDTH / 2;
      } else if (alignment === 'right') {
        ctx.textAlign = 'right';
        textX = WIDTH - textPadX;
      } else {
        ctx.textAlign = 'left';
      }
      ctx.textBaseline = 'top';

      // Title  -  match reference: strong, centered, and spaced away from subtitle
      ctx.fillStyle = textColor;
      ctx.font = `800 ${titleSize}px Inter, Arial, sans-serif`;
      titleLines.forEach((line, index) => {
        const y = textStartY + index * (titleLineHeight + titleGap);
        ctx.fillText(line, textX, y, maxTextWidth);
      });

      // Subtitle  -  smaller and clearly separated from the title block
      ctx.font = `400 ${subtitleSize}px Inter, Arial, sans-serif`;
      ctx.fillStyle = subColor;
      const subY = textStartY + titleBlockHeight + subtitleGap;
      ctx.fillText(subtitle, textX, subY, maxTextWidth);

      // Footer (only if user sets one, no default)
      if (footer && footer.trim()) {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.font = '500 22px Inter, Arial, sans-serif';
        ctx.fillStyle = footerColor;
        const cardBottom = cardY + cardH;
        const footerY = cardBottom - 20;

        if (footerLogo) {
          const logoImg = new Image();
          logoImg.src = footerLogo;
          const logoW = 44;
          const logoH = (logoImg.height / logoImg.width) * logoW || 24;
          let footerX = textPadX;
          if (alignment === 'center') footerX = WIDTH / 2 - logoW - 8;
          else if (alignment === 'right') footerX = WIDTH - textPadX - logoW - 8 - ctx.measureText(footer).width;
          ctx.drawImage(logoImg, footerX, footerY - 18, logoW, Math.min(logoH, 22));
          ctx.fillText(footer, footerX + logoW + 8, footerY);
        } else {
          let footerX = textPadX;
          if (alignment === 'center') footerX = WIDTH / 2;
          else if (alignment === 'right') footerX = WIDTH - textPadX;
          ctx.fillText(footer, footerX, footerY);
        }
      }

      setDownloadUrl(canvas.toDataURL('image/png'));
    };

    drawBanner();
    return () => { cancelled = true; };
  }, [
    title,
    subtitle,
    footer,
    footerLogo,
    bannerStyle,
    patternOverlay,
    backgroundMode,
    foregroundFromColor,
    foregroundToColor,
    foregroundDirection,
    backgroundFromColor,
    backgroundToColor,
    backgroundDirection,
    titleFontSize,
    subtitleFontSize,
    alignment,
    foregroundPreset,
    backgroundPreset,
    WIDTH,
    HEIGHT,
  ]);

  const updateForegroundFromColor = (value: string) => setForegroundFromColor(value.startsWith('#') ? value : `#${value}`);
  const updateForegroundToColor = (value: string) => setForegroundToColor(value.startsWith('#') ? value : `#${value}`);
  const updateBackgroundFromColor = (value: string) => setBackgroundFromColor(value.startsWith('#') ? value : `#${value}`);
  const updateBackgroundToColor = (value: string) => setBackgroundToColor(value.startsWith('#') ? value : `#${value}`);
  const normalizeHex = (value: string, fallback: string) => /^#[0-9A-Fa-f]{6}$/.test(value) ? value : fallback;

  const chooseForegroundPreset = (item: Preset) => {
    setForegroundPresetName(item.name);
    setForegroundFromColor(item.from);
    setForegroundToColor(item.to);
  };

  const chooseBackgroundPreset = (item: Preset) => {
    setBackgroundPresetName(item.name);
    setBackgroundFromColor(item.from);
    setBackgroundToColor(item.to);
    setBackgroundMode('gradient');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-base font-semibold text-gray-900 dark:text-white">Customize your banner</div>

      <div className="grid gap-3 lg:grid-cols-[320px_1fr] items-start">
        {/* Left config panel */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">

          {/* CONTENT */}
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
              <div>
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
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Resolution</span>
                  <div className="grid grid-cols-2 gap-2" role="group" aria-label="Resolution">
                    {['1200x630', '1200x400', '800x420', '800x400'].map((key) => (
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
                        {RESOLUTIONS[key].label.split(' ')[0]}
                      </button>
                    ))}
                    <button
                      type="button"
                      aria-pressed={resolution === 'custom'}
                      onClick={() => setResolution('custom')}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        resolution === 'custom'
                          ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Current canvas: {effectiveWidth} × {effectiveHeight}
                  </div>
                  {resolution === 'custom' && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        aria-label="Custom width"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                        className="w-20 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        min={100}
                        max={4000}
                      />
                      <span className="text-gray-400">×</span>
                      <input
                        type="number"
                        aria-label="Custom height"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Number(e.target.value))}
                        className="w-20 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        min={100}
                        max={4000}
                      />
                    </div>
                  )}
                </label>
              </div>
            )}
          </div>

          {/* BANNER STYLE */}
          <div className="space-y-5 border-b border-gray-100 p-5 dark:border-gray-800">
            <button
              type="button"
              onClick={() => toggleSection('BANNER_STYLE')}
              className="flex w-full items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 cursor-pointer"
              aria-expanded={openSections.has('BANNER_STYLE')}
            >
              <span className="text-base text-violet-500" aria-hidden="true">🎨</span>
              <span>BANNER STYLE</span>
              <svg className={`ml-auto h-4 w-4 transition-transform ${openSections.has('BANNER_STYLE') ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openSections.has('BANNER_STYLE') && (
              <div className="space-y-4">
                {/* Banner style selector */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Style</span>
                  <div className="grid grid-cols-3 gap-2" role="group" aria-label="Banner style">
                    {BANNER_STYLES.map((style) => (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() => setBannerStyle(style.value as BannerStyle)}
                        className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${
                          bannerStyle === style.value
                            ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                        }`}
                        aria-pressed={bannerStyle === style.value}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Presets */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Foreground preset</span>
                  <div className="grid grid-cols-4 gap-2" role="group" aria-label="Foreground presets">
                    {PRESETS.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => chooseForegroundPreset(item)}
                        className={`h-10 w-full rounded-xl border-2 transition ${
                          foregroundPresetName === item.name
                            ? 'border-violet-500 ring-2 ring-violet-200'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                        }`}
                        style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to})` }}
                        aria-label={item.name}
                        aria-pressed={foregroundPresetName === item.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Direction buttons */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Foreground direction</span>
                  <div className="grid grid-cols-4 gap-2" role="group" aria-label="Foreground direction">
                    {DIRECTIONS.map((d) => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => setForegroundDirection(d.value)}
                        aria-label={d.label}
                        aria-pressed={foregroundDirection === d.value}
                        className={`flex items-center justify-center rounded-xl border-2 py-2 text-xs font-semibold transition ${
                          foregroundDirection === d.value
                            ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        {d.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* From / To colors stacked */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Foreground from</span>
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
                      <input
                        aria-label="Foreground from color picker"
                        type="color"
                        value={normalizeHex(foregroundFromColor, foregroundPreset.from)}
                        onChange={(event) => updateForegroundFromColor(event.target.value)}
                        className="h-7 w-7 cursor-pointer rounded border-0 p-0"
                      />
                      <input
                        aria-label="Foreground from color hex"
                        value={foregroundFromColor}
                        onChange={(event) => updateForegroundFromColor(event.target.value)}
                        onBlur={() => setForegroundFromColor((value) => normalizeHex(value, foregroundPreset.from))}
                        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none dark:text-white"
                      />
                    </div>
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Foreground to</span>
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
                      <input
                        aria-label="Foreground to color picker"
                        type="color"
                        value={normalizeHex(foregroundToColor, foregroundPreset.to)}
                        onChange={(event) => updateForegroundToColor(event.target.value)}
                        className="h-7 w-7 cursor-pointer rounded border-0 p-0"
                      />
                      <input
                        aria-label="Foreground to color hex"
                        value={foregroundToColor}
                        onChange={(event) => updateForegroundToColor(event.target.value)}
                        onBlur={() => setForegroundToColor((value) => normalizeHex(value, foregroundPreset.to))}
                        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none dark:text-white"
                      />
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* BACKGROUND */}
          <div className="space-y-5 border-b border-gray-100 p-5 dark:border-gray-800">
            <button
              type="button"
              onClick={() => toggleSection('BACKGROUND')}
              className="flex w-full items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 cursor-pointer"
              aria-expanded={openSections.has('BACKGROUND')}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-violet-500 dark:border-violet-900 dark:bg-violet-950/30" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a9 9 0 1 0 9 9" />
                  <path d="M7 10.5a5 5 0 0 1 10 0" />
                  <path d="M12 12v6" />
                  <path d="M9 15h6" />
                </svg>
              </span>
              <span>BACKGROUND</span>
              <svg className={`ml-auto h-4 w-4 transition-transform ${openSections.has('BACKGROUND') ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openSections.has('BACKGROUND') && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 rounded-2xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900" role="tablist" aria-label="Background mode">
                  {([
                    ['solid', 'Solid'],
                    ['gradient', 'Gradient'],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      role="tab"
                      aria-selected={backgroundMode === value}
                      onClick={() => setBackgroundMode(value)}
                      className={`rounded-[14px] px-4 py-3 text-sm font-semibold transition ${
                        backgroundMode === value
                          ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-white'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <span className="text-[15px] font-medium text-gray-700 dark:text-gray-300">Background preset</span>
                  <div className="grid grid-cols-4 gap-3 sm:grid-cols-8" role="group" aria-label="Background presets">
                    {PRESETS.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => chooseBackgroundPreset(item)}
                        className={`h-12 w-full rounded-[12px] border transition sm:h-12 ${
                          backgroundPresetName === item.name
                            ? 'border-violet-500 ring-2 ring-violet-200'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                        }`}
                        style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to})` }}
                        aria-label={item.name}
                        aria-pressed={backgroundPresetName === item.name}
                      />
                    ))}
                  </div>
                </div>

                {backgroundMode === 'gradient' ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="block space-y-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Background from</span>
                        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                          <input
                            aria-label="Background from color picker"
                            type="color"
                            value={normalizeHex(backgroundFromColor, backgroundPreset.from)}
                            onChange={(event) => updateBackgroundFromColor(event.target.value)}
                            className="h-8 w-8 cursor-pointer rounded-lg border border-gray-200 p-0"
                          />
                          <input
                            aria-label="Background from color hex"
                            value={backgroundFromColor}
                            onChange={(event) => updateBackgroundFromColor(event.target.value)}
                            onBlur={() => setBackgroundFromColor((value) => normalizeHex(value, backgroundPreset.from))}
                            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none dark:text-white"
                          />
                        </div>
                      </label>

                      <label className="block space-y-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Background to</span>
                        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                          <input
                            aria-label="Background to color picker"
                            type="color"
                            value={normalizeHex(backgroundToColor, backgroundPreset.to)}
                            onChange={(event) => updateBackgroundToColor(event.target.value)}
                            className="h-8 w-8 cursor-pointer rounded-lg border border-gray-200 p-0"
                          />
                          <input
                            aria-label="Background to color hex"
                            value={backgroundToColor}
                            onChange={(event) => updateBackgroundToColor(event.target.value)}
                            onBlur={() => setBackgroundToColor((value) => normalizeHex(value, backgroundPreset.to))}
                            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none dark:text-white"
                          />
                        </div>
                      </label>
                    </div>

                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Background direction</span>
                      <select
                        aria-label="Background direction"
                        value={backgroundDirection}
                        onChange={(event) => setBackgroundDirection(event.target.value as DirectionValue)}
                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      >
                        {DIRECTIONS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </>
                ) : (
                  <label className="block space-y-2">
                    <span className="text-[15px] font-medium text-gray-700 dark:text-gray-300">Custom Background Color</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                      <input
                        aria-label="Solid background color picker"
                        type="color"
                        value={normalizeHex(backgroundFromColor, backgroundPreset.from)}
                        onChange={(event) => updateBackgroundFromColor(event.target.value)}
                        className="h-14 w-14 shrink-0 cursor-pointer rounded-xl border border-gray-200 p-0"
                      />
                      <input
                        aria-label="Solid background color hex"
                        value={backgroundFromColor}
                        onChange={(event) => updateBackgroundFromColor(event.target.value)}
                        onBlur={() => setBackgroundFromColor((value) => normalizeHex(value, backgroundPreset.from))}
                        className="min-w-0 flex-1 rounded-xl border border-transparent bg-transparent px-2 py-3 text-base font-medium text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                      />
                    </div>
                  </label>
                )}

                <div className="space-y-2">
                  <span className="text-[15px] font-medium text-gray-700 dark:text-gray-300">Pattern overlay</span>
                  <div className="space-y-2">
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overlay</span>
                      <select
                        aria-label="Pattern overlay"
                        value={patternOverlay}
                        onChange={(event) => setPatternOverlay(event.target.value as PatternOverlay)}
                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      >
                        {PATTERN_OVERLAYS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
                      Adds a subtle repeating pattern on top of the background and behind the banner card.
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>

          <div className="space-y-5 border-b border-gray-100 p-5 dark:border-gray-800">
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
              <div>
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
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="space-y-5 border-b border-gray-100 p-5 dark:border-gray-800">
            <button
              type="button"
              onClick={() => toggleSection('FOOTER')}
              className="flex w-full items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 cursor-pointer"
              aria-expanded={openSections.has('FOOTER')}
            >
              <span className="text-base text-violet-500" aria-hidden="true">↓</span>
              <span>FOOTER</span>
              <svg className={`ml-auto h-4 w-4 transition-transform ${openSections.has('FOOTER') ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openSections.has('FOOTER') && (
              <div className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Footer text</span>
                  <input
                    aria-label="Footer text"
                    value={footer}
                    onChange={(event) => setFooter(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </label>

                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Logo (optional)</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:border-violet-400 cursor-pointer transition dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      Upload logo
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => setFooterLogo(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    {footerLogo && (
                      <div className="flex items-center gap-2">
                        <img src={footerLogo} alt="Footer logo preview" className="h-8 w-auto rounded" />
                        <button
                          type="button"
                          onClick={() => setFooterLogo(null)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right preview panel */}
        <div className="space-y-3">
          {downloadUrl && (
            <div className="flex justify-end">
              <a
                href={downloadUrl}
                download="banner-generator.png"
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13.25m0 0l-4.5-4.5m4.5 4.5l4.5-4.5M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5" />
                </svg>
                Download PNG
              </a>
            </div>
          )}
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            data-testid="article-banner-preview"
            aria-label="Banner preview"
            className="h-auto w-full rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}