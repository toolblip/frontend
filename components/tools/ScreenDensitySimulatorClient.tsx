'use client';

import { useMemo, useState } from 'react';

const RATIOS = [1, 1.5, 2, 3, 4] as const;
const WIDTHS: { label: string; width: number; height: number }[] = [
  { label: 'Mobile (360×640)', width: 360, height: 640 },
  { label: 'Tablet (768×1024)', width: 768, height: 1024 },
  { label: 'Laptop (1440×900)', width: 1440, height: 900 },
  { label: 'Desktop (1920×1080)', width: 1920, height: 1080 },
];

export default function ScreenDensitySimulatorClient() {
  const [url, setUrl] = useState('');
  const [ratio, setRatio] = useState<number>(2);
  const [presetIndex, setPresetIndex] = useState(0);

  const preset = WIDTHS[presetIndex];

  // The iframe is rendered at devicePixelRatio-scaled physical resolution,
  // then visually scaled back down by 1/ratio so it occupies the same CSS-pixel
  // footprint while the content inside renders as if the device had that DPR.
  const physicalWidth = Math.round(preset.width * ratio);
  const physicalHeight = Math.round(preset.height * ratio);

  const loadUrl = useMemo(() => {
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }, [url]);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">URL to Preview</span>
      </div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="e.g. example.com"
        className="tb-v2-input"
      />

      <div className="tb-v2-section">
        <span className="tb-v2-tool-label">Screen Width Preset</span>
        <div className="tb-v2-mode-tabs" role="group" aria-label="Screen width preset" style={{ marginTop: 8 }}>
          {WIDTHS.map((w, i) => (
            <button
              key={w.label}
              type="button"
              onClick={() => setPresetIndex(i)}
              className={`tb-v2-mode-tab ${presetIndex === i ? 'on' : ''}`}
              aria-pressed={presetIndex === i}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tb-v2-section">
        <span className="tb-v2-tool-label">Device Pixel Ratio</span>
        <div className="tb-v2-mode-tabs" role="group" aria-label="Device pixel ratio" style={{ marginTop: 8 }}>
          {RATIOS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRatio(r)}
              className={`tb-v2-mode-tab ${ratio === r ? 'on' : ''}`}
              aria-pressed={ratio === r}
            >
              {r}x{r === 2 ? ' (Retina)' : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="tb-v2-banner tb-v2-banner-warn" style={{ margin: '16px 20px' }}>
        Some sites block embedding — if the preview is blank, that site doesn&apos;t allow iframes.
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Simulated Preview</span>
        <span className="tb-v2-tool-label" style={{ fontWeight: 400 }}>
          CSS pixels: {preset.width}×{preset.height} @ {ratio}x DPR (physical {physicalWidth}×{physicalHeight})
        </span>
      </div>
      <div className="tb-v2-tool-output-body">
        {!loadUrl ? (
          <p className="tb-v2-empty">Enter a URL above to preview it at the selected screen density.</p>
        ) : (
          <div
            style={{
              width: preset.width,
              height: preset.height,
              overflow: 'hidden',
              border: '1px solid var(--line)',
              borderRadius: 8,
              maxWidth: '100%',
            }}
          >
            <div
              style={{
                width: physicalWidth,
                height: physicalHeight,
                transform: `scale(${1 / ratio})`,
                transformOrigin: 'top left',
              }}
            >
              <iframe
                src={loadUrl}
                width={physicalWidth}
                height={physicalHeight}
                style={{ border: 'none', display: 'block' }}
                title="Screen density preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
