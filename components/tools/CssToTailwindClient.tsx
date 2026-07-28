"use client";
import { useState, useMemo } from 'react';

const CSS_TO_TW: Record<string, string> = {
  'display: flex': 'flex', 'display: block': 'block', 'display: inline-block': 'inline-block',
  'display: grid': 'grid', 'display: none': 'hidden',
  'justify-content: center': 'justify-center', 'justify-content: flex-start': 'justify-start',
  'justify-content: flex-end': 'justify-end', 'justify-content: space-between': 'justify-between',
  'align-items: center': 'items-center', 'align-items: flex-start': 'items-start',
  'align-items: flex-end': 'items-end', 'align-items: stretch': 'items-stretch',
  'flex-direction: column': 'flex-col', 'flex-direction: row': 'flex-row',
  'flex-wrap: wrap': 'flex-wrap', 'flex-wrap: nowrap': 'flex-nowrap',
  'gap: 4px': 'gap-1', 'gap: 8px': 'gap-2', 'gap: 12px': 'gap-3',
  'gap: 16px': 'gap-4', 'gap: 24px': 'gap-6', 'gap: 32px': 'gap-8',
  'padding: 8px': 'p-2', 'padding: 16px': 'p-4', 'padding: 24px': 'p-6',
  'padding: 32px': 'p-8',
  'margin: 8px': 'm-2', 'margin: 16px': 'm-4', 'margin: 24px': 'm-6',
  'text-align: center': 'text-center', 'text-align: left': 'text-left', 'text-align: right': 'text-right',
  'font-weight: bold': 'font-bold', 'font-weight: normal': 'font-normal',
  'font-weight: 600': 'font-semibold', 'font-weight: 300': 'font-light',
  'text-decoration: underline': 'underline', 'text-decoration: line-through': 'line-through',
  'font-size: 12px': 'text-xs', 'font-size: 14px': 'text-sm', 'font-size: 16px': 'text-base',
  'font-size: 18px': 'text-lg', 'font-size: 24px': 'text-xl', 'font-size: 30px': 'text-2xl',
  'border-radius: 4px': 'rounded', 'border-radius: 8px': 'rounded-lg',
  'border-radius: 9999px': 'rounded-full', 'border-radius: 0': 'rounded-none',
  'width: 100%': 'w-full', 'height: 100%': 'h-full',
  'overflow: hidden': 'overflow-hidden', 'overflow: auto': 'overflow-auto',
  'position: relative': 'relative', 'position: absolute': 'absolute',
  'position: fixed': 'fixed', 'position: sticky': 'sticky',
  'opacity: 0': 'opacity-0', 'opacity: 50': 'opacity-50', 'opacity: 100': 'opacity-100',
  'cursor: pointer': 'cursor-pointer', 'cursor: not-allowed': 'cursor-not-allowed',
  'white-space: nowrap': 'whitespace-nowrap',
  'text-transform: uppercase': 'uppercase', 'text-transform: lowercase': 'lowercase',
  'text-transform: capitalize': 'capitalize',
};

function convertToTailwind(css: string): string {
  const lines = css.split('\n');
  const result: string[] = [];
  let inBlock = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.endsWith('{')) { inBlock = true; continue; }
    if (trimmed === '}') { inBlock = false; continue; }
    if (!inBlock) { result.push(line); continue; }
    const matched = Object.entries(CSS_TO_TW).find(([k]) => trimmed === k);
    if (matched) { result.push(`  ${matched[1]}`); }
    else { result.push(`  /* ${trimmed} */`); }
  }
  return result.join('\n');
}

export default function CssToTailwindClient() {
  const [input, setInput] = useState(
`.card {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  gap: 16px;
  border-radius: 8px;
  text-align: center;
  font-size: 18px;
}`
  );
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => convertToTailwind(input), [input]);

  const copy = () => {
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSS Input</span>
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} spellCheck={false}
        className="tb-v2-tool-textarea" style={{ fontFamily: 'monospace', fontSize: '0.875rem', minHeight: '200px' }} />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '1rem' }}>
        <span className="tb-v2-tool-label">Tailwind Output</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ background: '#1a1a2e', color: '#a5f3fc', padding: '1rem', borderRadius: '8px',
        fontFamily: 'monospace', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{result}</pre>
    </div>
  );
}
