'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

export const toolMeta = {
  name: 'Screen Resolution Tester',
  description:
    'Test and preview any screen resolution or viewport size. Choose from device presets, set custom dimensions, and preview a page inside a scaled iframe. Displays live screen info including devicePixelRatio. 100% client-side.',
  category: 'developer',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface DevicePreset {
  label: string;
  width: number;
  height: number;
  category: 'mobile' | 'tablet' | 'desktop';
}

interface ScreenInfo {
  screenWidth: number;
  screenHeight: number;
  availWidth: number;
  availHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  colorDepth: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEVICE_PRESETS: DevicePreset[] = [
  { label: 'iPhone 15', width: 390, height: 844, category: 'mobile' },
  { label: 'iPhone 15 Pro Max', width: 430, height: 932, category: 'mobile' },
  { label: 'Pixel 8', width: 412, height: 915, category: 'mobile' },
  { label: 'Samsung Galaxy S24', width: 360, height: 780, category: 'mobile' },
  { label: 'iPad Air', width: 820, height: 1180, category: 'tablet' },
  { label: 'iPad Pro 12.9"', width: 1024, height: 1366, category: 'tablet' },
  { label: 'Desktop 1280×720', width: 1280, height: 720, category: 'desktop' },
  { label: 'Desktop 1440×900', width: 1440, height: 900, category: 'desktop' },
  { label: 'Desktop 1920×1080', width: 1920, height: 1080, category: 'desktop' },
  { label: '4K 3840×2160', width: 3840, height: 2160, category: 'desktop' },
];

const CATEGORY_ORDER: DevicePreset['category'][] = ['mobile', 'tablet', 'desktop'];

const CATEGORY_LABELS: Record<DevicePreset['category'], string> = {
  mobile: 'Mobile',
  tablet: 'Tablet',
  desktop: 'Desktop',
};

const TEST_PAGE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Viewport Test Page</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, -apple-system, sans-serif;
    background: #0f172a;
    color: #e2e8f0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px;
    gap: 16px;
  }
  h1 { font-size: clamp(1.1rem, 4vw, 2rem); font-weight: 700; color: #4ade80; text-align: center; }
  .card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 16px 20px;
    width: 100%;
    max-width: 480px;
  }
  .card h2 { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 12px; }
  .row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #1e293b; font-size: 0.85rem; }
  .row:last-child { border-bottom: none; }
  .label { color: #94a3b8; }
  .value { color: #f1f5f9; font-family: monospace; font-weight: 600; }
  .accent { color: #4ade80; }
  .grid-demo {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(60px, 100%), 1fr));
    gap: 6px;
    width: 100%;
    max-width: 480px;
  }
  .grid-cell {
    height: 36px;
    border-radius: 6px;
    background: linear-gradient(135deg, #1d4ed8, #7c3aed);
    opacity: 0.7;
  }
  .bp { font-size: 0.75rem; color: #64748b; text-align: center; }
</style>
</head>
<body>
<h1>Viewport Test Page</h1>
<div class="card">
  <h2>Window</h2>
  <div class="row"><span class="label">innerWidth</span><span class="value accent" id="iw">—</span></div>
  <div class="row"><span class="label">innerHeight</span><span class="value accent" id="ih">—</span></div>
  <div class="row"><span class="label">devicePixelRatio</span><span class="value" id="dpr">—</span></div>
</div>
<div class="card">
  <h2>Screen</h2>
  <div class="row"><span class="label">screen.width</span><span class="value" id="sw">—</span></div>
  <div class="row"><span class="label">screen.height</span><span class="value" id="sh">—</span></div>
  <div class="row"><span class="label">availWidth</span><span class="value" id="aw">—</span></div>
  <div class="row"><span class="label">availHeight</span><span class="value" id="ah">—</span></div>
</div>
<div class="card">
  <h2>Grid fill test</h2>
  <div class="grid-demo" id="grid"></div>
  <p class="bp" style="margin-top:8px" id="bp"></p>
</div>
<script>
  function update() {
    document.getElementById('iw').textContent = window.innerWidth + 'px';
    document.getElementById('ih').textContent = window.innerHeight + 'px';
    document.getElementById('dpr').textContent = window.devicePixelRatio;
    document.getElementById('sw').textContent = screen.width + 'px';
    document.getElementById('sh').textContent = screen.height + 'px';
    document.getElementById('aw').textContent = screen.availWidth + 'px';
    document.getElementById('ah').textContent = screen.availHeight + 'px';
    var g = document.getElementById('grid');
    g.innerHTML = '';
    var n = Math.max(4, Math.floor(window.innerWidth / 70));
    for (var i = 0; i < n; i++) { var d = document.createElement('div'); d.className = 'grid-cell'; g.appendChild(d); }
    var bp = window.innerWidth < 480 ? 'xs (<480px)' : window.innerWidth < 768 ? 'sm (480–767px)' : window.innerWidth < 1024 ? 'md (768–1023px)' : window.innerWidth < 1280 ? 'lg (1024–1279px)' : 'xl (≥1280px)';
    document.getElementById('bp').textContent = 'Tailwind breakpoint: ' + bp;
  }
  update();
  window.addEventListener('resize', update);
</script>
</body>
</html>`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getScreenInfo(): ScreenInfo {
  if (typeof window === 'undefined') {
    return {
      screenWidth: 0,
      screenHeight: 0,
      availWidth: 0,
      availHeight: 0,
      viewportWidth: 0,
      viewportHeight: 0,
      devicePixelRatio: 1,
      colorDepth: 24,
    };
  }
  return {
    screenWidth: screen.width,
    screenHeight: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio ?? 1,
    colorDepth: screen.colorDepth,
  };
}

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800 last:border-b-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-sm font-mono font-semibold ${accent ? 'text-green-400' : 'text-gray-200'}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ScreenResolutionTesterPage() {
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [widthInput, setWidthInput] = useState('1280');
  const [heightInput, setHeightInput] = useState('720');
  const [isLandscape, setIsLandscape] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>('Desktop 1280×720');
  const [iframeKey, setIframeKey] = useState(0);
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>(getScreenInfo);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(600);

  // Update screen info on mount and resize
  useEffect(() => {
    const update = () => setScreenInfo(getScreenInfo());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Measure preview container width
  useEffect(() => {
    if (!previewRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setPreviewWidth(entry.contentRect.width);
    });
    ro.observe(previewRef.current);
    return () => ro.disconnect();
  }, []);

  // Write test page into iframe
  const loadIframe = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(TEST_PAGE_HTML);
    doc.close();
  }, []);

  useEffect(() => {
    loadIframe();
  }, [iframeKey, loadIframe, width, height]);

  const effectiveWidth = isLandscape ? height : width;
  const effectiveHeight = isLandscape ? width : height;

  const scale = clamp(previewWidth / effectiveWidth, 0.05, 1);
  const scaledHeight = effectiveHeight * scale;

  function applyPreset(preset: DevicePreset) {
    const w = preset.width;
    const h = preset.height;
    setWidth(w);
    setHeight(h);
    setWidthInput(String(w));
    setHeightInput(String(h));
    setActivePreset(preset.label);
    setIsLandscape(false);
    setIframeKey((k) => k + 1);
  }

  function applyCustom() {
    const w = parseInt(widthInput);
    const h = parseInt(heightInput);
    if (!isNaN(w) && w > 0) setWidth(w);
    if (!isNaN(h) && h > 0) setHeight(h);
    setActivePreset(null);
    setIframeKey((k) => k + 1);
  }

  function handleWidthChange(val: string) {
    setWidthInput(val);
    const n = parseInt(val);
    if (!isNaN(n) && n > 0) {
      setWidth(n);
      setActivePreset(null);
    }
  }

  function handleHeightChange(val: string) {
    setHeightInput(val);
    const n = parseInt(val);
    if (!isNaN(n) && n > 0) {
      setHeight(n);
      setActivePreset(null);
    }
  }

  const isMobilePreset =
    activePreset !== null &&
    DEVICE_PRESETS.find((p) => p.label === activePreset)?.category === 'mobile';

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-gray-800 bg-gray-900/40">
        <div className="max-w-7xl mx-auto px-4 py-2 text-sm text-gray-500 flex gap-2">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-gray-300 transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-gray-300" aria-current="page">Screen Resolution Tester</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🖥️</span>
            <h1 className="text-2xl font-bold text-white">Screen Resolution Tester</h1>
          </div>
          <p className="text-gray-400">{toolMeta.description}</p>
          <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
            Developer
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* ── Left panel ── */}
          <div className="xl:col-span-1 space-y-4">
            {/* Live screen info */}
            <section aria-label="Your screen info" className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Your Screen</h2>
              <InfoRow label="Screen width" value={`${screenInfo.screenWidth}px`} accent />
              <InfoRow label="Screen height" value={`${screenInfo.screenHeight}px`} accent />
              <InfoRow label="Viewport width" value={`${screenInfo.viewportWidth}px`} />
              <InfoRow label="Viewport height" value={`${screenInfo.viewportHeight}px`} />
              <InfoRow label="availWidth" value={`${screenInfo.availWidth}px`} />
              <InfoRow label="availHeight" value={`${screenInfo.availHeight}px`} />
              <InfoRow label="devicePixelRatio" value={screenInfo.devicePixelRatio} />
              <InfoRow label="colorDepth" value={`${screenInfo.colorDepth}-bit`} />
            </section>

            {/* Custom dimensions */}
            <section aria-label="Custom dimensions" className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-4">Custom Size</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1" htmlFor="custom-width">Width (px)</label>
                  <input
                    id="custom-width"
                    type="number"
                    min={1}
                    max={7680}
                    value={widthInput}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm font-mono focus:outline-none focus:border-green-500"
                    aria-label="Custom viewport width"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1" htmlFor="custom-height">Height (px)</label>
                  <input
                    id="custom-height"
                    type="number"
                    min={1}
                    max={4320}
                    value={heightInput}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm font-mono focus:outline-none focus:border-green-500"
                    aria-label="Custom viewport height"
                  />
                </div>
                <button
                  onClick={applyCustom}
                  className="w-full bg-green-600 hover:bg-green-500 text-black text-sm font-semibold py-2 rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
            </section>

            {/* Device presets */}
            <section aria-label="Device presets" className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Device Presets</h2>
              <div className="space-y-4">
                {CATEGORY_ORDER.map((cat) => (
                  <div key={cat}>
                    <div className="text-xs text-gray-600 mb-2">{CATEGORY_LABELS[cat]}</div>
                    <div className="space-y-1">
                      {DEVICE_PRESETS.filter((p) => p.category === cat).map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => applyPreset(preset)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            activePreset === preset.label
                              ? 'bg-green-600/20 border border-green-700/50 text-green-400'
                              : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white'
                          }`}
                          aria-pressed={activePreset === preset.label}
                        >
                          <div className="font-medium leading-tight">{preset.label}</div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">
                            {preset.width} × {preset.height}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Right panel: preview ── */}
          <div className="xl:col-span-3 space-y-4">
            {/* Toolbar */}
            <section aria-label="Preview toolbar" className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Dimension badge */}
                <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 font-mono text-sm">
                  <span className="text-green-400 font-bold">{effectiveWidth}</span>
                  <span className="text-gray-500">×</span>
                  <span className="text-green-400 font-bold">{effectiveHeight}</span>
                  <span className="text-gray-500 text-xs ml-1">px</span>
                </div>

                {/* Scale badge */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-400 font-mono">
                  scale: {(scale * 100).toFixed(0)}%
                </div>

                {/* Orientation toggle — only for mobile presets */}
                {isMobilePreset && (
                  <button
                    onClick={() => {
                      setIsLandscape((v) => !v);
                      setIframeKey((k) => k + 1);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border ${
                      isLandscape
                        ? 'bg-green-600/20 border-green-700/50 text-green-400'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white'
                    }`}
                    aria-pressed={isLandscape}
                    aria-label="Toggle orientation"
                  >
                    <span className="text-base leading-none">{isLandscape ? '⟺' : '⟳'}</span>
                    <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
                  </button>
                )}

                <div className="flex-1" />

                {/* Refresh */}
                <button
                  onClick={() => setIframeKey((k) => k + 1)}
                  className="flex items-center gap-2 bg-gray-800 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  aria-label="Refresh preview"
                >
                  <span className="text-base leading-none">↺</span>
                  <span>Refresh</span>
                </button>
              </div>
            </section>

            {/* Preview iframe */}
            <section
              aria-label="Viewport preview"
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Preview</span>
                <span className="text-xs text-gray-600 font-mono">
                  rendered at {Math.round(effectiveWidth * scale)} × {Math.round(effectiveHeight * scale)}px
                </span>
              </div>

              {/* Scrollable wrapper */}
              <div
                ref={previewRef}
                className="w-full overflow-hidden bg-gray-950 border border-gray-700 rounded-lg"
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 border-b border-gray-700">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  <div className="flex-1 mx-3 bg-gray-700 rounded text-xs text-gray-500 px-3 py-0.5 text-center truncate">
                    viewport-test — {effectiveWidth} × {effectiveHeight}
                  </div>
                </div>

                {/* Scaled iframe container */}
                <div
                  className="relative overflow-hidden"
                  style={{ height: `${scaledHeight}px` }}
                >
                  <div
                    style={{
                      width: `${effectiveWidth}px`,
                      height: `${effectiveHeight}px`,
                      transform: `scale(${scale})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    <iframe
                      key={iframeKey}
                      ref={iframeRef}
                      title="Viewport preview"
                      width={effectiveWidth}
                      height={effectiveHeight}
                      className="border-0"
                      sandbox="allow-scripts"
                      onLoad={loadIframe}
                    />
                  </div>
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-600 text-center">
                The iframe is scaled to fit this container. Actual dimensions: {effectiveWidth} × {effectiveHeight}px.
              </p>
            </section>

            {/* Common breakpoints reference */}
            <section aria-label="Breakpoints reference" className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-4">Tailwind Breakpoints</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { label: 'xs', range: '< 480px', color: 'border-blue-800/50 text-blue-400' },
                  { label: 'sm', range: '480–767px', color: 'border-purple-800/50 text-purple-400' },
                  { label: 'md', range: '768–1023px', color: 'border-yellow-800/50 text-yellow-400' },
                  { label: 'lg', range: '1024–1279px', color: 'border-orange-800/50 text-orange-400' },
                  { label: 'xl', range: '≥ 1280px', color: 'border-green-800/50 text-green-400' },
                ].map(({ label, range, color }) => {
                  const [minStr, maxStr] = range.includes('–') ? range.split('–') : [null, null];
                  const min = minStr ? parseInt(minStr.replace(/[^0-9]/g, '')) : 0;
                  const max = maxStr ? parseInt(maxStr.replace(/[^0-9]/g, '')) : Infinity;
                  const active = effectiveWidth >= min && effectiveWidth <= max;
                  return (
                    <div
                      key={label}
                      className={`border rounded-lg px-3 py-2 text-center transition-colors ${
                        active
                          ? `${color} bg-gray-800`
                          : 'border-gray-800 text-gray-600 bg-gray-900/50'
                      }`}
                    >
                      <div className="text-sm font-semibold font-mono">{label}</div>
                      <div className="text-xs mt-0.5 opacity-80">{range}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-600 text-center">
          🔒 100% client-side — your data never leaves your browser
        </p>
      </div>
    </>
  );
}
