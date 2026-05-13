/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '@/app/providers/auth-provider';

type BackgroundMode = 'solid' | 'gradient' | 'dotted-frame';
type BannerStyle = 'dotted-frame' | 'solid-frame' | 'double-frame' | 'dash-frame' | 'corner-accent' | 'shadow-card';

type DirectionValue = '0' | '45' | '90' | '135' | '140' | '180' | '225' | '270' | '315';
type TextAlign = 'left' | 'center' | 'right';
type PatternOverlay = 'none' | 'dots' | 'diagonal-lines' | 'grid' | 'zigzag' | 'crosses' | 'triangles';
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
  { value: '0', label: '← Left', icon: '←' },
  { value: '45', label: '↘ Diagonal', icon: '↘' },
  { value: '90', label: '↑ Top', icon: '↑' },
  { value: '135', label: '↗ Diagonal', icon: '↗' },
  { value: '140', label: '→ Right', icon: '→' },
  { value: '180', label: '↓ Bottom', icon: '↓' },
  { value: '225', label: '↙ Diagonal', icon: '↙' },
  { value: '270', label: '← Left', icon: '←' },
  { value: '315', label: '↗ Diagonal', icon: '↗' },
];

const PATTERN_OVERLAYS = [
  { value: 'none', label: 'None' },
  { value: 'dots', label: 'Dots' },
  { value: 'diagonal-lines', label: 'Diagonal Lines' },
  { value: 'grid', label: 'Grid' },
  { value: 'zigzag', label: 'Zigzag' },
  { value: 'crosses', label: 'Crosses' },
  { value: 'triangles', label: 'Triangles' },
];

const BANNER_STYLES = [
  { value: 'dotted-frame', label: 'Dotted Border' },
  { value: 'solid-frame', label: 'Solid Border' },
  { value: 'double-frame', label: 'Double Border' },
  { value: 'dash-frame', label: 'Dash Border' },
  { value: 'corner-accent', label: 'Corner Accent' },
  { value: 'shadow-card', label: 'Shadow Card' },
];

function SliderLabel({ value, children }: { value: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{children}</span>
      <span className="text-xs text-gray-400">{value}px</span>
    </div>
  );
}

export default function OgImageGeneratorClient() {
  const [title, setTitle] = useState('Building Better Software With Modern Tools');
  const [subtitle, setSubtitle] = useState('An in-depth guide to scaling your dev workflow with modern browser tools.');
  const [presetName, setPresetName] = useState<PresetName | null>('Teal Midnight');
  const [footer, setFooter] = useState('toolblip.com');
  const [footerLogo, setFooterLogo] = useState<string | null>(null);
  const [bannerStyle, setBannerStyle] = useState<BannerStyle>('dotted-frame');
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('gradient');
  const [fromColor, setFromColor] = useState('#4CC8C8');
  const [toColor, setToColor] = useState('#202033');
  const [direction, setDirection] = useState<DirectionValue>('140');
  const [titleFontSize, setTitleFontSize] = useState(44);
  const [subtitleFontSize, setSubtitleFontSize] = useState(20);
  const [alignment, setAlignment] = useState<TextAlign>('left');
  const [patternOverlay, setPatternOverlay] = useState<PatternOverlay>('dots');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['CONTENT']));
  const [resolution, setResolution] = useState<'1200x630' | '1200x400' | '800x400' | 'custom'>('1200x630');
  const [customWidth, setCustomWidth] = useState(1200);
  const [customHeight, setCustomHeight] = useState(630);
  const { user } = useAuth();
  const isFreeUser = !user || user.plan === 'free';

  const RESOLUTIONS: Record<string, { label: string; width: number; height: number }> = {
    '1200x630': { label: '1200×630 (Open Graph)', width: 1200, height: 630 },
    '1200x400': { label: '1200×400 (Wide Banner)', width: 1200, height: 400 },
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

      const canvas = document.querySelector('canvas[data-testid="article-banner-preview"]') as HTMLCanvasElement | null;
      if (!canvas || cancelled) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isHorizontal = ['0', '45', '135', '140', '180', '225', '270', '315'].includes(direction);

      // ===== BANNER STYLE RENDERING =====
      // All styles: gradient background → decoration → white card → text

      // 1. Gradient background (all styles)
      const angle = parseInt(direction, 10);
      const angleRad = (angle * Math.PI) / 180;
      const cos = Math.cos(angleRad);
      const sin = Math.sin(angleRad);
      const x1 = isHorizontal
        ? cos < 0 ? WIDTH : 0
        : (WIDTH - (WIDTH * Math.abs(cos))) / 2 + (cos > 0 ? WIDTH * Math.abs(cos) : 0);
      const y1 = isHorizontal
        ? sin < 0 ? HEIGHT : 0
        : (HEIGHT - (HEIGHT * Math.abs(sin))) / 2 - (sin < 0 ? HEIGHT * Math.abs(sin) : 0);
      const x2 = WIDTH - x1;
      const y2 = HEIGHT - y1;
      const bgGrad = ctx.createLinearGradient(x1, y1, x2, y2);
      bgGrad.addColorStop(0, fromColor);
      bgGrad.addColorStop(1, toColor);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // 2. Dots pattern on background
      if (patternOverlay === 'dots' || patternOverlay === 'none') {
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = '#ffffff';
        const dotStep = 28;
        const dotRadius = Math.max(2, Math.min(WIDTH, HEIGHT) * 0.004);
        for (let x = dotStep / 2; x < WIDTH; x += dotStep) {
          for (let y = dotStep / 2; y < HEIGHT; y += dotStep) {
            ctx.beginPath();
            ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }

      // 3. White card (all styles)
      const cardMargin = Math.min(WIDTH, HEIGHT) * 0.065;
      const cardRadius = Math.min(WIDTH, HEIGHT) * 0.025;
      const cardX = cardMargin;
      const cardY = cardMargin;
      const cardW = WIDTH - cardMargin * 2;
      const cardH = HEIGHT - cardMargin * 2;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Shadow for shadow-card style
      if (bannerStyle === 'shadow-card') {
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 8;
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
      ctx.restore();

      // 4. Border decorations (outside the white card, on gradient)
      const borderPadding = cardMargin * 0.55;
      const borderLineWidth = Math.max(2, Math.min(WIDTH, HEIGHT) * 0.0045);

      if (bannerStyle === 'dotted-frame') {
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = borderLineWidth;
        ctx.setLineDash([borderLineWidth * 2, borderLineWidth * 2.5]);
        ctx.lineCap = 'round';
        ctx.strokeRect(borderPadding, borderPadding, WIDTH - borderPadding * 2, HEIGHT - borderPadding * 2);
        ctx.setLineDash([]);
      } else if (bannerStyle === 'solid-frame') {
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = borderLineWidth;
        ctx.strokeRect(borderPadding, borderPadding, WIDTH - borderPadding * 2, HEIGHT - borderPadding * 2);
      } else if (bannerStyle === 'double-frame') {
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.lineWidth = borderLineWidth;
        const gap = borderLineWidth * 2;
        ctx.strokeRect(borderPadding, borderPadding, WIDTH - borderPadding * 2, HEIGHT - borderPadding * 2);
        ctx.strokeRect(borderPadding + gap, borderPadding + gap, WIDTH - borderPadding * 2 - gap * 2, HEIGHT - borderPadding * 2 - gap * 2);
      } else if (bannerStyle === 'dash-frame') {
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = borderLineWidth;
        ctx.setLineDash([borderLineWidth * 4, borderLineWidth * 3]);
        ctx.lineCap = 'butt';
        ctx.strokeRect(borderPadding, borderPadding, WIDTH - borderPadding * 2, HEIGHT - borderPadding * 2);
        ctx.setLineDash([]);
      } else if (bannerStyle === 'corner-accent') {
        const cornerSize = Math.min(WIDTH, HEIGHT) * 0.04;
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = borderLineWidth;
        // Top-left
        ctx.beginPath(); ctx.moveTo(borderPadding, borderPadding + cornerSize); ctx.lineTo(borderPadding, borderPadding); ctx.lineTo(borderPadding + cornerSize, borderPadding); ctx.stroke();
        // Top-right
        ctx.beginPath(); ctx.moveTo(WIDTH - borderPadding - cornerSize, borderPadding); ctx.lineTo(WIDTH - borderPadding, borderPadding); ctx.lineTo(WIDTH - borderPadding, borderPadding + cornerSize); ctx.stroke();
        // Bottom-left
        ctx.beginPath(); ctx.moveTo(borderPadding, HEIGHT - borderPadding - cornerSize); ctx.lineTo(borderPadding, HEIGHT - borderPadding); ctx.lineTo(borderPadding + cornerSize, HEIGHT - borderPadding); ctx.stroke();
        // Bottom-right
        ctx.beginPath(); ctx.moveTo(WIDTH - borderPadding - cornerSize, HEIGHT - borderPadding); ctx.lineTo(WIDTH - borderPadding, HEIGHT - borderPadding); ctx.lineTo(WIDTH - borderPadding, HEIGHT - borderPadding - cornerSize); ctx.stroke();
      }
      // shadow-card has no border decoration

      if (patternOverlay !== 'none') {
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = '#ffffff';
        const step = 30;
        if (patternOverlay === 'dots') {
          for (let x = 0; x < WIDTH; x += step) {
            for (let y = 0; y < HEIGHT; y += step) {
              ctx.beginPath();
              ctx.arc(x, y, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        } else if (patternOverlay === 'diagonal-lines') {
          for (let i = -HEIGHT; i < WIDTH + HEIGHT; i += step) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i + HEIGHT, HEIGHT);
            ctx.stroke();
          }
        } else if (patternOverlay === 'grid') {
          for (let x = 0; x <= WIDTH; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, HEIGHT);
            ctx.stroke();
          }
          for (let y = 0; y <= HEIGHT; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(WIDTH, y);
            ctx.stroke();
          }
        } else if (patternOverlay === 'zigzag') {
          ctx.beginPath();
          for (let y = 0; y < HEIGHT + step; y += step) {
            for (let x = 0; x < WIDTH + step * 4; x += step * 4) {
              ctx.moveTo(x, y);
              ctx.lineTo(x + step * 2, y + step / 2);
              ctx.lineTo(x + step * 4, y);
            }
          }
          ctx.stroke();
        } else if (patternOverlay === 'crosses') {
          for (let x = step / 2; x < WIDTH; x += step) {
            for (let y = step / 2; y < HEIGHT; y += step) {
              ctx.beginPath();
              ctx.moveTo(x - 5, y);
              ctx.lineTo(x + 5, y);
              ctx.moveTo(x, y - 5);
              ctx.lineTo(x, y + 5);
              ctx.stroke();
            }
          }
        } else if (patternOverlay === 'triangles') {
          for (let row = 0; row * step < HEIGHT + step; row++) {
            const offset = row % 2 === 0 ? 0 : step / 2;
            for (let col = -1; col * step < WIDTH + step; col++) {
              const cx2 = col * step + step / 2 + offset;
              const cy2 = row * step;
              ctx.beginPath();
              ctx.moveTo(cx2, cy2 + step);
              ctx.lineTo(cx2 + step / 2, cy2);
              ctx.lineTo(cx2 + step, cy2 + step);
              ctx.closePath();
              ctx.fill();
            }
          }
        }
        ctx.globalAlpha = 1;
      }

      // Text rendering inside white card
      const cardMargin = Math.min(WIDTH, HEIGHT) * 0.065;
      const textPaddingX = cardMargin + WIDTH * 0.05;
      const textPaddingY = cardMargin + HEIGHT * 0.03;
      const maxTextWidth = WIDTH - textPaddingX * 2;

      // All styles have white card = dark text
      const textColor = '#1a1a2e';
      const subColor = 'rgba(26,26,46,0.55)';
      const footerColor = 'rgba(26,26,46,0.35)';

      ctx.textBaseline = 'middle';

      let textX = textPaddingX;
      if (alignment === 'center') {
        ctx.textAlign = 'center';
        textX = WIDTH / 2;
      } else if (alignment === 'right') {
        ctx.textAlign = 'right';
        textX = WIDTH - textPaddingX;
      } else {
        ctx.textAlign = 'left';
      }

      // Vertically center text within the white card
      const titleLineHeight = titleFontSize * 1.15;
      const subLineHeight = subtitleFontSize * 1.3;
      const gapBetween = titleFontSize * 0.5;
      const blockHeight = titleLineHeight + gapBetween + subLineHeight;
      const cardTop = cardMargin;
      const cardBottom = HEIGHT - cardMargin;
      const titleY = cardTop + (cardBottom - cardTop - blockHeight) / 2 + titleLineHeight / 2;

      // Title
      ctx.fillStyle = textColor;
      ctx.font = `700 ${titleFontSize}px Inter, Arial, sans-serif`;
      ctx.fillText(title, textX, titleY, maxTextWidth);

      // Subtitle
      ctx.font = `400 ${subtitleFontSize}px Inter, Arial, sans-serif`;
      ctx.fillStyle = subColor;
      const subY = titleY + titleLineHeight / 2 + gapBetween + subLineHeight / 2;
      ctx.fillText(subtitle, textX, subY, maxTextWidth);

      // Footer
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.font = '500 22px Inter, Arial, sans-serif';
      ctx.fillStyle = footerColor;
      const footerY = cardBottom - 20;
      const footerText = footer || 'toolblip.com';

      if (footerLogo) {
        const logoImg = new Image();
        logoImg.src = footerLogo;
        const logoW = 44;
        const logoH = (logoImg.height / logoImg.width) * logoW || 24;
        let footerX = paddingX;
        if (alignment === 'center') footerX = WIDTH / 2 - logoW - 8;
        else if (alignment === 'right') footerX = WIDTH - paddingX - logoW - 8 - ctx.measureText(footerText).width;
        ctx.drawImage(logoImg, footerX, footerY - 18, logoW, Math.min(logoH, 22));
        ctx.fillText(footerText, footerX + logoW + 8, footerY);
      } else {
        let footerX = paddingX;
        if (alignment === 'center') footerX = WIDTH / 2;
        else if (alignment === 'right') footerX = WIDTH - paddingX;
        ctx.fillText(footerText, footerX, footerY);
      }

      if (isFreeUser) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.font = '400 16px Inter, Arial, sans-serif';
        ctx.fillStyle = 'rgba(26,26,46,0.25)';
        ctx.textAlign = 'right';
        ctx.fillText('Generated by toolblip.com', WIDTH - cardMargin - 16, HEIGHT - cardMargin - 14);
        ctx.restore();
      }

      setDownloadUrl(canvas.toDataURL('image/png'));
    };

    drawBanner();
    return () => { cancelled = true; };
  }, [title, subtitle, footer, footerLogo, bannerStyle, backgroundMode, fromColor, toColor, direction, titleFontSize, subtitleFontSize, alignment, patternOverlay, preset, WIDTH, HEIGHT, isFreeUser]);

  const updateFromColor = (value: string) => setFromColor(value.startsWith('#') ? value : `#${value}`);
  const updateToColor = (value: string) => setToColor(value.startsWith('#') ? value : `#${value}`);
  const normalizeHex = (value: string, fallback: string) => /^#[0-9A-Fa-f]{6}$/.test(value) ? value : fallback;

  const choosePreset = (item: Preset) => {
    setPresetName(item.name);
    setFromColor(item.from);
    setToColor(item.to);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="text-base font-semibold text-gray-900 dark:text-white">Customize your banner</div>
        {downloadUrl && (
          <a
            href={downloadUrl}
            download="banner-generator.png"
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13.25m0 0l-4.5-4.5m4.5 4.5l4.5-4.5M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5" />
            </svg>
            Download
          </a>
        )}
      </div>

      <div className="grid gap-3 lg:grid-cols-[320px_1fr]">
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
                    {['1200x630', '1200x400', '800x400'].map((key) => (
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
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Color preset</span>
                  <div className="grid grid-cols-4 gap-2" role="group" aria-label="Color presets">
                    {PRESETS.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => choosePreset(item)}
                        className={`h-10 w-full rounded-xl border-2 transition ${
                          presetName === item.name
                            ? 'border-violet-500 ring-2 ring-violet-200'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                        }`}
                        style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to})` }}
                        aria-label={item.name}
                        aria-pressed={presetName === item.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Direction buttons — only for gradient-classic */}
                {bannerStyle === 'gradient-classic' && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Direction</span>
                    <div className="grid grid-cols-4 gap-2" role="group" aria-label="Gradient direction">
                      {DIRECTIONS.map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setDirection(d.value)}
                          aria-label={d.label}
                          aria-pressed={direction === d.value}
                          className={`flex items-center justify-center rounded-xl border-2 py-2 text-xs font-semibold transition ${
                            direction === d.value
                              ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-200'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700'
                          }`}
                        >
                          {d.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* From / To colors stacked */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">From</span>
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
                      <input
                        aria-label="From color picker"
                        type="color"
                        value={normalizeHex(fromColor, preset.from)}
                        onChange={(event) => updateFromColor(event.target.value)}
                        className="h-7 w-7 cursor-pointer rounded border-0 p-0"
                      />
                      <input
                        aria-label="From color hex"
                        value={fromColor}
                        onChange={(event) => updateFromColor(event.target.value)}
                        onBlur={() => setFromColor((value) => normalizeHex(value, preset.from))}
                        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none dark:text-white"
                      />
                    </div>
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">To</span>
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
                      <input
                        aria-label="To color picker"
                        type="color"
                        value={normalizeHex(toColor, preset.to)}
                        onChange={(event) => updateToColor(event.target.value)}
                        disabled={bannerStyle === 'dotted-frame' || bannerStyle === 'minimal-line'}
                        className="h-7 w-7 cursor-pointer rounded border-0 p-0 disabled:opacity-40"
                      />
                      <input
                        aria-label="To color hex"
                        value={toColor}
                        onChange={(event) => updateToColor(event.target.value)}
                        onBlur={() => setToColor((value) => normalizeHex(value, preset.to))}
                        disabled={bannerStyle === 'dotted-frame' || bannerStyle === 'minimal-line'}
                        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none dark:text-white disabled:opacity-40"
                      />
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* GRAPHICS */}
          <div className="space-y-5 border-b border-gray-100 p-5 dark:border-gray-800">
            <button
              type="button"
              onClick={() => toggleSection('GRAPHICS')}
              className="flex w-full items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 cursor-pointer"
              aria-expanded={openSections.has('GRAPHICS')}
            >
              <span className="text-base text-violet-500" aria-hidden="true">▦</span>
              <span>GRAPHICS</span>
              <svg className={`ml-auto h-4 w-4 transition-transform ${openSections.has('GRAPHICS') ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openSections.has('GRAPHICS') && (
              <div>
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
              </div>
            )}
          </div>

          {/* TYPOGRAPHY */}
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

          {/* Download button at bottom of config */}
          {downloadUrl && (
            <div className="p-5">
              <a
                href={downloadUrl}
                download="banner-generator.png"
                className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                Download PNG
              </a>
            </div>
          )}
        </div>

        {/* Right preview panel */}
        <div className="relative">
          <div className="relative">
            <canvas
              ref={undefined}
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