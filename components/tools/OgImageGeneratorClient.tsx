'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const PRESETS = [
  { name: 'Midnight', from: '#0f172a', to: '#1e293b', accent: '#38bdf8' },
  { name: 'Indigo Violet', from: '#4f46e5', to: '#7c3aed', accent: '#facc15' },
  { name: 'Sky Cyan', from: '#0284c7', to: '#06b6d4', accent: '#ffffff' },
  { name: 'Amber Fire', from: '#f97316', to: '#dc2626', accent: '#fff7ed' },
  { name: 'Emerald Teal', from: '#059669', to: '#0f766e', accent: '#d1fae5' },
  { name: 'Rose Pink', from: '#e11d48', to: '#db2777', accent: '#ffe4e6' },
] as const;

const WIDTH = 1200;
const HEIGHT = 630;

type PresetName = (typeof PRESETS)[number]['name'];

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
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
  return lines.slice(0, 3);
}

export default function OgImageGeneratorClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [title, setTitle] = useState('Building Better Software With Modern Tools');
  const [subtitle, setSubtitle] = useState('Create polished blog covers, social cards, and Open Graph images in your browser.');
  const [presetName, setPresetName] = useState<PresetName>('Midnight');
  const [footer, setFooter] = useState('toolblip.com');
  const [downloadUrl, setDownloadUrl] = useState('');

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

      const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
      gradient.addColorStop(0, preset.from);
      gradient.addColorStop(1, preset.to);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.globalAlpha = 0.16;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      for (let x = -HEIGHT; x < WIDTH; x += 72) {
        ctx.beginPath();
        ctx.moveTo(x, HEIGHT);
        ctx.lineTo(x + HEIGHT, 0);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.arc(1000, 120, 180, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(1040, 520, 260, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = preset.accent;
      ctx.font = '700 34px Inter, Arial, sans-serif';
      ctx.fillText('ARTICLE BANNER', 88, 100);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 78px Inter, Arial, sans-serif';
      ctx.textBaseline = 'top';
      const titleLines = wrapText(ctx, title || 'Untitled Article', 980);
      titleLines.forEach((line, index) => ctx.fillText(line, 88, 170 + index * 88));

      const subtitleTop = 170 + titleLines.length * 88 + 18;
      ctx.fillStyle = 'rgba(255,255,255,0.86)';
      ctx.font = '400 36px Inter, Arial, sans-serif';
      const subtitleLines = wrapText(ctx, subtitle, 940).slice(0, 2);
      subtitleLines.forEach((line, index) => ctx.fillText(line, 88, subtitleTop + index * 46));

      ctx.fillStyle = 'rgba(255,255,255,0.78)';
      ctx.font = '600 28px Inter, Arial, sans-serif';
      ctx.fillText(footer || 'toolblip.com', 88, 552);

      setDownloadUrl(canvas.toDataURL('image/png'));
    };

    const timeout = window.setTimeout(() => {
      void drawBanner();
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [footer, preset, subtitle, title]);

  return (
    <div className="space-y-6" data-testid="article-banner-generator">
      <div className="space-y-2">
        <div className="text-base font-semibold text-gray-900 dark:text-white">Customize your banner</div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create 1200×630 blog cover and Open Graph images with editable copy, polished gradients, and one-click PNG download.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Banner title</span>
            <textarea
              aria-label="Banner title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Banner subtitle</span>
            <textarea
              aria-label="Banner subtitle"
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Footer text</span>
            <input
              aria-label="Footer text"
              value={footer}
              onChange={(event) => setFooter(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </label>

          <div className="space-y-2" role="group" aria-label="Gradient preset">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Gradient preset</div>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setPresetName(item.name)}
                  className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${presetName === item.name ? 'border-red-500 ring-2 ring-red-100 dark:ring-red-950' : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'}`}
                  aria-pressed={presetName === item.name}
                  style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to})`, color: '#fff' }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download="article-banner.png"
              className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              Download PNG
            </a>
          )}
        </div>

        <div className="space-y-3">
          <div
            data-testid="article-banner-preview"
            aria-label="Banner preview"
            className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-gray-800"
          >
            <div
              className="aspect-[1200/630] p-[7%] text-white"
              style={{ background: `linear-gradient(135deg, ${preset.from}, ${preset.to})` }}
            >
              <div className="text-xs font-bold uppercase tracking-[0.24em]" style={{ color: preset.accent }}>
                Article Banner
              </div>
              <div className="mt-[8%] max-w-[86%] text-[clamp(1.4rem,4.6vw,3.9rem)] font-black leading-[1.05] tracking-[-0.04em]">
                {title || 'Untitled Article'}
              </div>
              <div className="mt-4 max-w-[78%] text-[clamp(0.8rem,1.6vw,1.45rem)] leading-snug text-white/85">
                {subtitle}
              </div>
              <div className="mt-[8%] text-sm font-semibold text-white/75">{footer || 'toolblip.com'}</div>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
