'use client';

import { useMemo, useState } from 'react';

const POOL = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');

const CLASSIC_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,';

function randomWord(): string {
  return POOL[Math.floor(Math.random() * POOL.length)];
}

function makeSentence(minWords = 6, maxWords = 16): string {
  const len = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words = Array.from({ length: len }, randomWord);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function makeParagraph(): string {
  const sentences = Math.floor(Math.random() * 4) + 4;
  return Array.from({ length: sentences }, () => makeSentence()).join(' ');
}

function generate(count: number, classicStart: boolean, wrapTags: boolean): string {
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    let p = makeParagraph();
    if (i === 0 && classicStart) {
      p = CLASSIC_START + ' ' + p.charAt(0).toLowerCase() + p.slice(1);
    }
    paragraphs.push(p);
  }
  if (wrapTags) {
    return paragraphs.map((p) => `<p>${p}</p>`).join('\n');
  }
  return paragraphs.join('\n\n');
}

export default function LoremIpsumGeneratorClient() {
  const [count, setCount] = useState(3);
  const [classicStart, setClassicStart] = useState(true);
  const [wrapTags, setWrapTags] = useState(false);
  const [seed, setSeed] = useState(0);
  const [copied, setCopied] = useState(false);

  const output = useMemo(
    () => generate(count, classicStart, wrapTags),
    // seed is used to force regeneration
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, classicStart, wrapTags, seed]
  );

  const regenerate = () => setSeed((s) => s + 1);
  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Options</span>
        <button
          type="button"
          onClick={regenerate}
          className="tb-v2-copy-btn"
          aria-label="Regenerate"
        >
          Regenerate
        </button>
      </div>

      <div className="tb-v2-tool-output-body">
        <div className="tb-v2-lorem-controls">
          <div className="tb-v2-lorem-count">
            <label htmlFor="lorem-count" className="tb-v2-tool-label">Paragraphs: {count}</label>
            <input
              id="lorem-count"
              type="range"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="tb-v2-pw-slider"
            />
          </div>
          <div className="tb-v2-mode-tabs">
            <button
              type="button"
              onClick={() => setClassicStart((v) => !v)}
              className={`tb-v2-mode-tab ${classicStart ? 'on' : ''}`}
              aria-pressed={classicStart}
            >
              Lorem ipsum start
            </button>
            <button
              type="button"
              onClick={() => setWrapTags((v) => !v)}
              className={`tb-v2-mode-tab ${wrapTags ? 'on' : ''}`}
              aria-pressed={wrapTags}
            >
              &lt;p&gt; tags
            </button>
          </div>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Output</span>
        <button
          type="button"
          onClick={copy}
          disabled={!output}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre className="tb-v2-tool-pre" style={{ maxHeight: 360 }}>{output || '—'}</pre>
      </div>
    </div>
  );
}
