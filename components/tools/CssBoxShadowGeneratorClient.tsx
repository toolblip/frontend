'use client';

import { useState, useCallback } from 'react';

interface ShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
}

let _nextId = 0;
const mkId = () => `shadow-${++_nextId}`;

function defaultLayer(): ShadowLayer {
  return { id: mkId(), x: 0, y: 4, blur: 12, spread: 0, color: '#00000040', inset: false };
}

function buildShadowValue(l: ShadowLayer): string {
  return `${l.inset ? 'inset ' : ''}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`;
}

function buildCss(layers: ShadowLayer[]): string {
  return `box-shadow: ${layers.map(buildShadowValue).join(',\n            ')};`;
}

export default function CssBoxShadowGeneratorClient() {
  const [layers, setLayers] = useState<ShadowLayer[]>([defaultLayer()]);
  const [copied, setCopied] = useState(false);

  const css = buildCss(layers);
  const previewValue = layers.map(buildShadowValue).join(', ');

  const updateLayer = useCallback((id: string, patch: Partial<ShadowLayer>) => {
    setLayers(prev => prev.map(l => (l.id === id ? { ...l, ...patch } : l)));
  }, []);

  const addLayer = useCallback(() => {
    setLayers(prev => [...prev, defaultLayer()]);
  }, []);

  const removeLayer = useCallback((id: string) => {
    setLayers(prev => (prev.length > 1 ? prev.filter(l => l.id !== id) : prev));
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(css).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Shadow Layers</span>
        <button type="button" onClick={addLayer} className="tb-v2-btn-sm">+ Add Layer</button>
      </div>

      <div className="flex flex-col gap-4">
        {layers.map((l, i) => (
          <div key={l.id} className="flex flex-col gap-2 bg-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="tb-v2-tool-label">Layer {i + 1}</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 text-sm">
                  <input type="checkbox" checked={l.inset} onChange={e => updateLayer(l.id, { inset: e.target.checked })} />
                  Inset
                </label>
                <input
                  type="color"
                  value={l.color.slice(0, 7)}
                  onChange={e => updateLayer(l.id, { color: e.target.value })}
                  style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--line)' }}
                />
                <button
                  type="button"
                  onClick={() => removeLayer(l.id)}
                  disabled={layers.length <= 1}
                  className="text-gray-500 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-xl leading-none"
                  aria-label="Remove layer"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="tb-v2-range-row">
              <label className="tb-v2-tool-label">X Offset</label>
              <input type="range" min={-50} max={50} value={l.x} onChange={e => updateLayer(l.id, { x: Number(e.target.value) })} className="tb-v2-range" />
              <span className="tb-v2-range-val">{l.x}px</span>
            </div>
            <div className="tb-v2-range-row">
              <label className="tb-v2-tool-label">Y Offset</label>
              <input type="range" min={-50} max={50} value={l.y} onChange={e => updateLayer(l.id, { y: Number(e.target.value) })} className="tb-v2-range" />
              <span className="tb-v2-range-val">{l.y}px</span>
            </div>
            <div className="tb-v2-range-row">
              <label className="tb-v2-tool-label">Blur</label>
              <input type="range" min={0} max={100} value={l.blur} onChange={e => updateLayer(l.id, { blur: Number(e.target.value) })} className="tb-v2-range" />
              <span className="tb-v2-range-val">{l.blur}px</span>
            </div>
            <div className="tb-v2-range-row">
              <label className="tb-v2-tool-label">Spread</label>
              <input type="range" min={-50} max={50} value={l.spread} onChange={e => updateLayer(l.id, { spread: Number(e.target.value) })} className="tb-v2-range" />
              <span className="tb-v2-range-val">{l.spread}px</span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Live Preview</div>
        <div className="flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden" style={{ height: 180 }}>
          <div className="bg-white rounded-xl" style={{ width: 100, height: 100, boxShadow: previewValue }} />
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">CSS Output</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{css}</pre>
      </div>
    </div>
  );
}
