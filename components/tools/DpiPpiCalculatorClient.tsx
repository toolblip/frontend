'use client';

import { useState } from 'react';

type Mode = 'print' | 'screen';
type Unit = 'in' | 'cm';

const CM_PER_IN = 2.54;

const QUALITY_TIERS = [
  { label: 'Draft', dpi: 150 },
  { label: 'Good', dpi: 200 },
  { label: 'Photo Quality', dpi: 300 },
  { label: 'Fine Art', dpi: 600 },
];

export default function DpiPpiCalculatorClient() {
  const [mode, setMode] = useState<Mode>('print');
  const [unit, setUnit] = useState<Unit>('in');

  const [pxWidth, setPxWidth] = useState('3000');
  const [pxHeight, setPxHeight] = useState('2000');
  const [printWidth, setPrintWidth] = useState('10');
  const [printHeight, setPrintHeight] = useState('6.67');

  const [screenWidth, setScreenWidth] = useState('1920');
  const [screenHeight, setScreenHeight] = useState('1080');
  const [diagonal, setDiagonal] = useState('15.6');

  const loadExample = () => {
    setMode('print');
    setUnit('in');
    setPxWidth('3000');
    setPxHeight('2000');
    setPrintWidth('10');
    setPrintHeight('6.67');
  };

  const wPx = parseFloat(pxWidth) || 0;
  const hPx = parseFloat(pxHeight) || 0;
  const wPhysIn = unit === 'in' ? parseFloat(printWidth) || 0 : (parseFloat(printWidth) || 0) / CM_PER_IN;
  const hPhysIn = unit === 'in' ? parseFloat(printHeight) || 0 : (parseFloat(printHeight) || 0) / CM_PER_IN;

  const horizontalDpi = wPhysIn > 0 ? wPx / wPhysIn : 0;
  const verticalDpi = hPhysIn > 0 ? hPx / hPhysIn : 0;

  const sWPx = parseFloat(screenWidth) || 0;
  const sHPx = parseFloat(screenHeight) || 0;
  const diagIn = parseFloat(diagonal) || 0;
  const screenPpi = diagIn > 0 ? Math.sqrt(sWPx * sWPx + sHPx * sHPx) / diagIn : 0;

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">DPI / PPI Calculator</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <div style={{ padding: 20 }} className="flex flex-col gap-4">
        <div className="tb-v2-mode-tabs" role="group">
          <button type="button" onClick={() => setMode('print')} className={`tb-v2-mode-tab ${mode === 'print' ? 'on' : ''}`}>Print Size</button>
          <button type="button" onClick={() => setMode('screen')} className={`tb-v2-mode-tab ${mode === 'screen' ? 'on' : ''}`}>Screen PPI</button>
        </div>

        {mode === 'print' ? (
          <>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="flex flex-col gap-1" style={{ flex: 1 }}>
                <label className="tb-v2-tool-label">Image Width (px)</label>
                <input type="number" value={pxWidth} onChange={e => setPxWidth(e.target.value)} className="tb-v2-input" min="0" />
              </div>
              <div className="flex flex-col gap-1" style={{ flex: 1 }}>
                <label className="tb-v2-tool-label">Image Height (px)</label>
                <input type="number" value={pxHeight} onChange={e => setPxHeight(e.target.value)} className="tb-v2-input" min="0" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <div className="flex flex-col gap-1" style={{ flex: 1 }}>
                <label className="tb-v2-tool-label">Print Width ({unit})</label>
                <input type="number" value={printWidth} onChange={e => setPrintWidth(e.target.value)} className="tb-v2-input" min="0" step="0.01" />
              </div>
              <div className="flex flex-col gap-1" style={{ flex: 1 }}>
                <label className="tb-v2-tool-label">Print Height ({unit})</label>
                <input type="number" value={printHeight} onChange={e => setPrintHeight(e.target.value)} className="tb-v2-input" min="0" step="0.01" />
              </div>
              <div className="tb-v2-mode-tabs" role="group">
                <button type="button" onClick={() => setUnit('in')} className={`tb-v2-mode-tab ${unit === 'in' ? 'on' : ''}`}>in</button>
                <button type="button" onClick={() => setUnit('cm')} className={`tb-v2-mode-tab ${unit === 'cm' ? 'on' : ''}`}>cm</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="flex flex-col gap-1" style={{ flex: 1 }}>
                <label className="tb-v2-tool-label">Horizontal Resolution (px)</label>
                <input type="number" value={screenWidth} onChange={e => setScreenWidth(e.target.value)} className="tb-v2-input" min="0" />
              </div>
              <div className="flex flex-col gap-1" style={{ flex: 1 }}>
                <label className="tb-v2-tool-label">Vertical Resolution (px)</label>
                <input type="number" value={screenHeight} onChange={e => setScreenHeight(e.target.value)} className="tb-v2-input" min="0" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="tb-v2-tool-label">Diagonal Screen Size (in)</label>
              <input type="number" value={diagonal} onChange={e => setDiagonal(e.target.value)} className="tb-v2-input" min="0" step="0.1" />
            </div>
          </>
        )}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {mode === 'print' ? (
          wPx > 0 && hPx > 0 && wPhysIn > 0 && hPhysIn > 0 ? (
            <div className="flex flex-col gap-3">
              <div className="tb-v2-stats-grid">
                <div className="tb-v2-stat-pill">
                  <span className="tb-v2-stat-pill-val">{Math.round(horizontalDpi)}</span>
                  <span className="tb-v2-stat-pill-lbl">Horizontal DPI</span>
                </div>
                <div className="tb-v2-stat-pill">
                  <span className="tb-v2-stat-pill-val">{Math.round(verticalDpi)}</span>
                  <span className="tb-v2-stat-pill-lbl">Vertical DPI</span>
                </div>
              </div>
              <div>
                <span className="tb-v2-tool-label">Max Print Size at Quality Tier</span>
                <div className="flex flex-col gap-1" style={{ marginTop: 8 }}>
                  {QUALITY_TIERS.map(tier => {
                    const w = (wPx / tier.dpi);
                    const h = (hPx / tier.dpi);
                    const wOut = unit === 'in' ? w : w * CM_PER_IN;
                    const hOut = unit === 'in' ? h : h * CM_PER_IN;
                    return (
                      <div key={tier.label} className="flex justify-between" style={{ padding: '4px 0', borderBottom: '1px solid var(--line)' }}>
                        <span>{tier.label} ({tier.dpi} DPI)</span>
                        <span style={{ fontFamily: 'var(--f-mono)' }}>{wOut.toFixed(1)} &times; {hOut.toFixed(1)} {unit}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <p className="tb-v2-empty">Enter image pixel dimensions and a print size to calculate DPI.</p>
          )
        ) : sWPx > 0 && sHPx > 0 && diagIn > 0 ? (
          <div className="tb-v2-stats-grid">
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{Math.round(screenPpi)}</span>
              <span className="tb-v2-stat-pill-lbl">Pixels Per Inch (PPI)</span>
            </div>
          </div>
        ) : (
          <p className="tb-v2-empty">Enter a resolution and diagonal size to calculate screen PPI.</p>
        )}
      </div>
    </div>
  );
}
