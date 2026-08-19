'use client';
import { useState } from 'react';

type Template = {
  needsBenefit: boolean;
  build: (product: string, benefit: string) => string;
};

const FALLBACK_BENEFIT = 'the best experience';

const TEMPLATES: Template[] = [
  { needsBenefit: true, build: (p, b) => `${b} — Try ${p} Today` },
  { needsBenefit: true, build: (p, b) => `The #1 Way to Get ${b}` },
  { needsBenefit: true, build: (p, b) => `${p}: ${b}, Guaranteed` },
  { needsBenefit: false, build: (p) => `Stop Wasting Time — ${p} Makes It Easy` },
  { needsBenefit: false, build: (p) => `Why Everyone's Switching to ${p}` },
  { needsBenefit: true, build: (p, b) => `${p} — ${b} in Minutes` },
  { needsBenefit: false, build: (p) => `Meet ${p}: The Smarter Way to Get Things Done` },
  { needsBenefit: true, build: (p, b) => `Ready for ${b}? Meet ${p}.` },
  { needsBenefit: false, build: (p) => `New: ${p} Is Here` },
  { needsBenefit: true, build: (p, b) => `Finally, ${b} — Without the Hassle` },
  { needsBenefit: true, build: (p, b) => `3 Reasons People Love ${p} for ${b}` },
  { needsBenefit: false, build: (p) => `${p} Just Got a Whole Lot Better` },
  { needsBenefit: true, build: (p, b) => `Get ${b} — Starting Today` },
  { needsBenefit: false, build: (p) => `Still Doing It the Hard Way? Try ${p}` },
  { needsBenefit: true, build: (p, b) => `${p} Makes ${b} Simple` },
  { needsBenefit: false, build: (p) => `The Secret More People Are Discovering: ${p}` },
  { needsBenefit: true, build: (p, b) => `Tired of Settling for Less? ${b} Starts Here.` },
  { needsBenefit: false, build: (p) => `Say Hello to ${p}` },
  { needsBenefit: true, build: (p, b) => `Everything You Need for ${b}, in One Place: ${p}` },
  { needsBenefit: false, build: (p) => `Join the People Already Using ${p}` },
  { needsBenefit: true, build: (p, b) => `${p}: Because You Deserve ${b}` },
  { needsBenefit: false, build: (p) => `Curious About ${p}? Here's Why People Try It.` },
];

const SHOWN_COUNT = 12;

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function FacebookAdHeadlinesClient() {
  const [product, setProduct] = useState('');
  const [benefit, setBenefit] = useState('');
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const canGenerate = product.trim().length > 0;

  const buildHeadlines = () => {
    const trimmedProduct = product.trim();
    const trimmedBenefit = benefit.trim();
    const effectiveBenefit = trimmedBenefit || FALLBACK_BENEFIT;

    const filled = TEMPLATES.map(t => t.build(trimmedProduct, effectiveBenefit));

    const picked = shuffleArray(filled).slice(0, Math.min(SHOWN_COUNT, filled.length));
    setHeadlines(picked);
    setCopiedIndex(null);
  };

  const copyOne = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(prev => (prev === index ? null : prev)), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="mb-4">
        <label className="tb-v2-tool-label block mb-1">Product / Service name *</label>
        <input
          type="text"
          value={product}
          onChange={e => setProduct(e.target.value)}
          className="tb-v2-input"
          placeholder="e.g. Toolblip"
        />
      </div>

      <div className="mb-4">
        <label className="tb-v2-tool-label block mb-1">Key benefit or offer (optional)</label>
        <input
          type="text"
          value={benefit}
          onChange={e => setBenefit(e.target.value)}
          className="tb-v2-input"
          placeholder="e.g. 50% off, saves you time"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={buildHeadlines}
          disabled={!canGenerate}
          className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate
        </button>
        {headlines.length > 0 && (
          <button
            onClick={buildHeadlines}
            className="tb-v2-btn tb-v2-btn-lg"
          >
            Shuffle
          </button>
        )}
      </div>

      {headlines.length > 0 && (
        <div className="tb-v2-tool-output-body mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="tb-v2-tool-label">
              Headlines ({headlines.length})
            </span>
          </div>
          <ul className="flex flex-col gap-2">
            {headlines.map((headline, index) => (
              <li
                key={index}
                className="flex justify-between items-center gap-3 py-1"
              >
                <span>{headline}</span>
                <button
                  onClick={() => copyOne(headline, index)}
                  className="tb-v2-copy-btn shrink-0"
                >
                  {copiedIndex === index ? 'Copied' : 'Copy'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
