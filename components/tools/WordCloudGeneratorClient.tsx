'use client';

import { useState, useRef } from 'react';

const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
  "aren't", 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both',
  'but', 'by', 'can', "can't", 'cannot', 'could', "couldn't", 'did', "didn't", 'do', 'does',
  "doesn't", 'doing', "don't", 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  "hadn't", 'has', "hasn't", 'have', "haven't", 'having', 'he', "he'd", "he'll", "he's", 'her',
  'here', "here's", 'hers', 'herself', 'him', 'himself', 'his', 'how', "how's", 'i', "i'd",
  "i'll", "i'm", "i've", 'if', 'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself',
  "let's", 'me', 'more', 'most', "mustn't", 'my', 'myself', 'no', 'nor', 'not', 'of', 'off',
  'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over',
  'own', 'same', "shan't", 'she', "she'd", "she'll", "she's", 'should', "shouldn't", 'so',
  'some', 'such', 'than', 'that', "that's", 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', "there's", 'these', 'they', "they'd", "they'll", "they're", "they've",
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', "wasn't",
  'we', "we'd", "we'll", "we're", "we've", 'were', "weren't", 'what', "what's", 'when',
  "when's", 'where', "where's", 'which', 'while', 'who', "who's", 'whom', 'why', "why's",
  'with', "won't", 'would', "wouldn't", 'you', "you'd", "you'll", "you're", "you've", 'your',
  'yours', 'yourself', 'yourselves', 'also', 'just', 'like', 'get', 'got', 'one', 'will',
]);

const PALETTES: Record<string, string[]> = {
  Vibrant: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'],
  Ocean: ['#0c4a6e', '#0369a1', '#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#155e75', '#164e63'],
  Sunset: ['#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#f97316', '#fb923c', '#fdba74', '#fde68a'],
};

const SHAPES = {
  Landscape: { w: 760, h: 440 },
  Square: { w: 560, h: 560 },
  Portrait: { w: 440, h: 620 },
};

type ShapeKey = keyof typeof SHAPES;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

function overlaps(a: Box, b: Box): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

interface Placed {
  word: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  angle: number;
}

export default function WordCloudGeneratorClient() {
  const [input, setInput] = useState('');
  const [palette, setPalette] = useState<keyof typeof PALETTES>('Vibrant');
  const [shape, setShape] = useState<ShapeKey>('Landscape');
  const [generated, setGenerated] = useState(false);
  const [stats, setStats] = useState<{ total: number; unique: number; considered: number; placed: number }>({ total: 0, unique: 0, considered: 0, placed: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadExample = () => {
    setInput(
      'JavaScript is a versatile programming language used for web development. Developers use JavaScript to build interactive websites, web apps, and servers with Node.js. JavaScript frameworks like React, Vue, and Angular make building modern web applications easier. Many developers love JavaScript for its flexibility, huge ecosystem, and active community. JavaScript continues to grow every year as one of the most popular programming languages in the world.'
    );
  };

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas || !input.trim()) return;
    const { w, h } = SHAPES[shape];
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // tokenize
    const rawWords = input
      .toLowerCase()
      .split(/[^a-z0-9'-]+/i)
      .map(w => w.replace(/^['-]+|['-]+$/g, ''))
      .filter(w => w.length > 1 && !STOPWORDS.has(w) && !/^\d+$/.test(w));

    const freq = new Map<string, number>();
    rawWords.forEach(w => freq.set(w, (freq.get(w) || 0) + 1));

    const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 60);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    if (sorted.length === 0) {
      setStats({ total: 0, unique: 0, considered: 0, placed: 0 });
      setGenerated(true);
      return;
    }

    const maxCount = sorted[0][1];
    const minCount = sorted[sorted.length - 1][1];
    const colors = PALETTES[palette];
    const centerX = w / 2;
    const centerY = h / 2;
    const placedBoxes: Box[] = [];
    const placedWords: Placed[] = [];

    sorted.forEach(([word, count], idx) => {
      const ratio = maxCount === minCount ? 1 : (count - minCount) / (maxCount - minCount);
      const fontSize = Math.round(16 + ratio * 52);
      ctx.font = `bold ${fontSize}px var(--f-sans, sans-serif)`;
      const metrics = ctx.measureText(word);
      const boxW = metrics.width;
      const boxH = fontSize;

      let placedOk = false;
      let px = centerX;
      let py = centerY;
      const maxAttempts = 300;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const angle = attempt * 0.5;
        const radius = 2.2 * Math.sqrt(attempt);
        const x = centerX + radius * Math.cos(angle) - boxW / 2;
        const y = centerY + radius * Math.sin(angle) - boxH / 2;
        const box: Box = { x: x - 3, y: y - 3, w: boxW + 6, h: boxH + 6 };

        if (box.x < 0 || box.y < 0 || box.x + box.w > w || box.y + box.h > h) continue;

        const collides = placedBoxes.some(b => overlaps(box, b));
        if (!collides) {
          px = x;
          py = y;
          placedBoxes.push(box);
          placedOk = true;
          break;
        }
      }

      if (placedOk) {
        const color = colors[idx % colors.length];
        placedWords.push({ word, x: px, y: py, fontSize, color, angle: 0 });
      }
    });

    placedWords.forEach(pw => {
      ctx.font = `bold ${pw.fontSize}px var(--f-sans, sans-serif)`;
      ctx.fillStyle = pw.color;
      ctx.textBaseline = 'top';
      ctx.fillText(pw.word, pw.x, pw.y);
    });

    setStats({ total: rawWords.length, unique: freq.size, considered: sorted.length, placed: placedWords.length });
    setGenerated(true);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !generated) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'word-cloud.png';
    a.click();
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        className="tb-v2-tool-textarea"
        placeholder="Paste an article, essay, or any text to visualize as a word cloud..."
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={6}
      />

      <div className="tb-v2-section" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>Color Palette</span>
          <select value={palette} onChange={e => setPalette(e.target.value as keyof typeof PALETTES)} className="tb-v2-select">
            {Object.keys(PALETTES).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>Shape</span>
          <select value={shape} onChange={e => setShape(e.target.value as ShapeKey)} className="tb-v2-select">
            {Object.keys(SHAPES).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="tb-v2-section">
        <button
          onClick={generate}
          disabled={!input.trim()}
          className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
        >
          Generate Word Cloud
        </button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Preview</span>
        <button type="button" onClick={download} disabled={!generated} className="tb-v2-copy-btn">
          Download PNG
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!generated && <p className="tb-v2-empty">Enter text and click Generate to build your word cloud.</p>}
        <canvas
          ref={canvasRef}
          style={{
            display: generated ? 'block' : 'none',
            width: '100%',
            height: 'auto',
            border: '1px solid var(--line)',
            borderRadius: 8,
            background: '#fff',
          }}
        />
        {generated && (
          <div className="tb-v2-stats-grid" style={{ marginTop: 12 }}>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{stats.total}</span>
              <span className="tb-v2-stat-pill-lbl">Words Scanned</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{stats.unique}</span>
              <span className="tb-v2-stat-pill-lbl">Unique Words</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{stats.placed}</span>
              <span className="tb-v2-stat-pill-lbl">Words Placed</span>
            </div>
          </div>
        )}
        {generated && stats.unique > stats.considered && (
          <p style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 8 }}>
            Only the {stats.considered} most frequent words are considered for placement.
          </p>
        )}
        {generated && stats.placed < stats.considered && (
          <p style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 4 }}>
            {stats.considered - stats.placed} word{stats.considered - stats.placed === 1 ? '' : 's'} did not fit and were skipped. Try a larger shape or shorter text for full coverage.
          </p>
        )}
      </div>
    </div>
  );
}
