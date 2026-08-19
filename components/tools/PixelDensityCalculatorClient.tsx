'use client';

import { useState, useMemo } from 'react';

type Unit = 'in' | 'cm';

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function qualityNote(ppi: number): { label: string; detail: string } {
  if (ppi >= 300) return { label: 'Excellent — print quality', detail: '300+ PPI is the standard for sharp, professional prints.' };
  if (ppi >= 150) return { label: 'Good — acceptable for most prints', detail: '150–299 PPI looks fine at normal viewing distance.' };
  if (ppi >= 100) return { label: 'Fair — visible softness possible', detail: '100–149 PPI may look slightly soft up close.' };
  return { label: 'Low quality — not recommended for print', detail: 'Below 100 PPI usually looks pixelated when printed.' };
}

export default function PixelDensityCalculatorClient() {
  const [width, setWidth] = useState('3000');
  const [height, setHeight] = useState('2000');
  const [printWidth, setPrintWidth] = useState('10');
  const [printHeight, setPrintHeight] = useState('6.67');
  const [unit, setUnit] = useState<Unit>('in');

  const result = useMemo(() => {
    const w = parseFloat(width);
    const h = parseFloat(height);
    const pw = parseFloat(printWidth);
    const ph = parseFloat(printHeight);
    if (!(w > 0) || !(h > 0) || !(pw > 0) || !(ph > 0)) return null;

    const pwIn = unit === 'cm' ? pw / 2.54 : pw;
    const phIn = unit === 'cm' ? ph / 2.54 : ph;

    const diagonalPixels = Math.sqrt(w * w + h * h);
    const diagonalInches = Math.sqrt(pwIn * pwIn + phIn * phIn);
    const diagonalPPI = diagonalPixels / diagonalInches;
    const horizontalPPI = w / pwIn;
    const verticalPPI = h / phIn;

    return { diagonalPPI, horizontalPPI, verticalPPI };
  }, [width, height, printWidth, printHeight, unit]);

  const quality = result ? qualityNote(result.diagonalPPI) : null;

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Image & Print Dimensions</span>
        <div className="tb-v2-mode-tabs">
          <button type="button" className={`tb-v2-mode-tab ${unit === 'in' ? 'on' : ''}`} onClick={() => setUnit('in')}>Inches</button>
          <button type="button" className={`tb-v2-mode-tab ${unit === 'cm' ? 'on' : ''}`} onClick={() => setUnit('cm')}>Centimeters</button>
        </div>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="tb-v2-grid-2">
          <div style={{ paddingRight: 12 }}>
            <span className="tb-v2-tool-label">Image Width (px)</span>
            <input
              type="number"
              min={1}
              className="tb-v2-input"
              style={{ marginTop: 8, fontFamily: 'var(--f-mono)' }}
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>
          <div style={{ paddingLeft: 12 }}>
            <span className="tb-v2-tool-label">Image Height (px)</span>
            <input
              type="number"
              min={1}
              className="tb-v2-input"
              style={{ marginTop: 8, fontFamily: 'var(--f-mono)' }}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
        </div>
        <div className="tb-v2-grid-2">
          <div style={{ paddingRight: 12 }}>
            <span className="tb-v2-tool-label">Print Width ({unit})</span>
            <input
              type="number"
              min={0.01}
              step="0.01"
              className="tb-v2-input"
              style={{ marginTop: 8, fontFamily: 'var(--f-mono)' }}
              value={printWidth}
              onChange={(e) => setPrintWidth(e.target.value)}
            />
          </div>
          <div style={{ paddingLeft: 12 }}>
            <span className="tb-v2-tool-label">Print Height ({unit})</span>
            <input
              type="number"
              min={0.01}
              step="0.01"
              className="tb-v2-input"
              style={{ marginTop: 8, fontFamily: 'var(--f-mono)' }}
              value={printHeight}
              onChange={(e) => setPrintHeight(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Pixel Density</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {!result || !quality ? (
          <p className="tb-v2-empty">Enter image and print dimensions to calculate PPI/DPI.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="tb-v2-stats-grid" style={{ border: 0, background: 'transparent', padding: 0 }}>
              <div className="tb-v2-stat-pill">
                <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Diagonal PPI</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{round(result.diagonalPPI)}</div>
              </div>
              <div className="tb-v2-stat-pill">
                <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Horizontal PPI</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{round(result.horizontalPPI)}</div>
              </div>
              <div className="tb-v2-stat-pill">
                <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Vertical PPI</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{round(result.verticalPPI)}</div>
              </div>
            </div>
            <div className="tb-v2-banner tb-v2-banner-info">
              <strong>{quality.label}</strong>
              <div style={{ marginTop: 4 }}>{quality.detail}</div>
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--fg-2)' }}>
                Guide: 300 PPI = print quality · 150 PPI = acceptable · below 100 PPI = low quality.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
