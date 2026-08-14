'use client';

import { useState } from 'react';

interface Slide {
  id: number;
  title: string;
  body: string;
  bgColor: string;
}

let nextId = 1;

function newSlide(): Slide {
  return { id: nextId++, title: `Slide ${nextId - 1}`, body: '', bgColor: '#111827' };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildStandaloneHtml(slides: Slide[]): string {
  const slideDivs = slides
    .map((s, i) => `
    <section class="slide" data-index="${i}" style="background:${escapeHtml(s.bgColor)};${i === 0 ? '' : 'display:none;'}">
      <h1>${escapeHtml(s.title)}</h1>
      <p>${escapeHtml(s.body).replace(/\n/g, '<br>')}</p>
    </section>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Slideshow</title>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; height: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  body { display: flex; flex-direction: column; background: #000; }
  .slide { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #fff; padding: 40px; }
  .slide h1 { font-size: 2.5rem; margin-bottom: 1rem; }
  .slide p { font-size: 1.25rem; max-width: 800px; line-height: 1.6; opacity: 0.9; }
  .controls { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 16px; background: #0a0a0a; }
  .controls button { background: #222; color: #fff; border: 1px solid #444; border-radius: 8px; padding: 8px 18px; font-size: 14px; cursor: pointer; }
  .controls button:hover { background: #333; }
  .controls span { color: #999; font-size: 13px; font-variant-numeric: tabular-nums; }
</style>
</head>
<body>
${slideDivs}
<div class="controls">
  <button id="prevBtn" type="button">&larr; Prev</button>
  <span id="counter"></span>
  <button id="nextBtn" type="button">Next &rarr;</button>
</div>
<script>
(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var counter = document.getElementById('counter');
  var current = 0;

  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach(function (el, idx) {
      el.style.display = idx === current ? 'flex' : 'none';
    });
    counter.textContent = (current + 1) + ' / ' + slides.length;
  }

  document.getElementById('prevBtn').addEventListener('click', function () { show(current - 1); });
  document.getElementById('nextBtn').addEventListener('click', function () { show(current + 1); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  show(0);
})();
</script>
</body>
</html>
`;
}

export default function SlideshowGeneratorClient() {
  const [slides, setSlides] = useState<Slide[]>([newSlide(), newSlide()]);
  const [activeId, setActiveId] = useState<number>(slides[0].id);
  const [previewIndex, setPreviewIndex] = useState(0);

  const active = slides.find(s => s.id === activeId) ?? slides[0];

  const updateActive = (field: 'title' | 'body' | 'bgColor', value: string) => {
    setSlides(ss => ss.map(s => (s.id === active.id ? { ...s, [field]: value } : s)));
  };

  const addSlide = () => {
    const s = newSlide();
    setSlides(ss => [...ss, s]);
    setActiveId(s.id);
  };

  const removeSlide = (id: number) => {
    setSlides(ss => {
      const filtered = ss.filter(s => s.id !== id);
      if (filtered.length === 0) return ss;
      if (id === activeId) setActiveId(filtered[0].id);
      return filtered;
    });
    setPreviewIndex(i => Math.min(i, slides.length - 2));
  };

  const moveSlide = (id: number, dir: -1 | 1) => {
    setSlides(ss => {
      const idx = ss.findIndex(s => s.id === id);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= ss.length) return ss;
      const copy = [...ss];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  };

  const downloadHtml = () => {
    const html = buildStandaloneHtml(slides);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slideshow.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const previewSlide = slides[Math.min(previewIndex, slides.length - 1)];

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Slides ({slides.length})</span>
        <button type="button" onClick={addSlide} className="tb-v2-btn-sm">+ Add Slide</button>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {slides.map((s, i) => (
          <div
            key={s.id}
            onClick={() => setActiveId(s.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
              border: `1px solid ${s.id === active.id ? 'var(--red)' : 'var(--line)'}`,
              background: s.id === active.id ? 'var(--surface-2)' : 'transparent',
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 3, background: s.bgColor, flexShrink: 0 }} />
            <span style={{ fontSize: 13.5, flex: 1, fontWeight: s.id === active.id ? 600 : 400 }}>
              {i + 1}. {s.title || 'Untitled slide'}
            </span>
            <button type="button" onClick={e => { e.stopPropagation(); moveSlide(s.id, -1); }} disabled={i === 0} className="tb-v2-btn-sm">↑</button>
            <button type="button" onClick={e => { e.stopPropagation(); moveSlide(s.id, 1); }} disabled={i === slides.length - 1} className="tb-v2-btn-sm">↓</button>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); removeSlide(s.id); }}
              disabled={slides.length <= 1}
              className="tb-v2-btn-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Edit Slide</span>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <span className="tb-v2-tool-label">Title</span>
          <input
            type="text"
            value={active.title}
            onChange={e => updateActive('title', e.target.value)}
            className="tb-v2-input"
          />
        </div>
        <div>
          <span className="tb-v2-tool-label">Body Text</span>
          <textarea
            value={active.body}
            onChange={e => updateActive('body', e.target.value)}
            className="tb-v2-input"
            style={{ minHeight: 100 }}
            placeholder="Slide content..."
          />
        </div>
        <div>
          <span className="tb-v2-tool-label">Background Color</span>
          <input
            type="color"
            value={active.bgColor}
            onChange={e => updateActive('bgColor', e.target.value)}
            className="tb-v2-input"
            style={{ width: 80 }}
          />
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Live Preview</span>
      </div>
      <div className="tb-v2-tool-output-body">
        <div
          style={{
            background: previewSlide.bgColor, color: '#fff', borderRadius: 10,
            padding: 32, minHeight: 220, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 24 }}>{previewSlide.title || 'Untitled slide'}</h2>
          <p style={{ margin: 0, opacity: 0.9, whiteSpace: 'pre-wrap' }}>{previewSlide.body}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 12 }}>
          <button
            type="button"
            onClick={() => setPreviewIndex(i => (i - 1 + slides.length) % slides.length)}
            className="tb-v2-btn"
          >
            ← Prev
          </button>
          <span style={{ fontSize: 12.5, color: 'var(--fg-2)' }}>{previewIndex + 1} / {slides.length}</span>
          <button
            type="button"
            onClick={() => setPreviewIndex(i => (i + 1) % slides.length)}
            className="tb-v2-btn"
          >
            Next →
          </button>
        </div>

        <button type="button" onClick={downloadHtml} className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg" style={{ marginTop: 16, width: '100%' }}>
          Download as HTML
        </button>
      </div>
    </div>
  );
}
