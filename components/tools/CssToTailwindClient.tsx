'use client';

import { useState, useMemo } from 'react';

const EXAMPLE = `display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding: 16px;
gap: 8px;
border-radius: 8px;
font-size: 14px;
font-weight: 600;
background-color: #7c3aed;
color: #ffffff;`;

const FONT_SIZE_MAP: Record<string, string> = {
  '12px': 'xs', '14px': 'sm', '16px': 'base', '18px': 'lg', '20px': 'xl',
  '24px': '2xl', '30px': '3xl', '36px': '4xl', '48px': '5xl',
};

const FONT_WEIGHT_MAP: Record<string, string> = {
  '100': 'thin', '200': 'extralight', '300': 'light', '400': 'normal', 'normal': 'normal',
  '500': 'medium', '600': 'semibold', '700': 'bold', 'bold': 'bold', '800': 'extrabold', '900': 'black',
};

const RADIUS_MAP: [number, string][] = [[2, 'sm'], [4, ''], [6, 'md'], [8, 'lg'], [12, 'xl'], [16, '2xl'], [24, '3xl']];

function parsePx(value: string): number | null {
  const m = value.match(/^(-?\d+(?:\.\d+)?)px$/);
  return m ? parseFloat(m[1]) : null;
}

function pxToSpacing(px: number): string {
  const n = px / 4;
  return Number.isInteger(n) ? String(n) : `[${px}px]`;
}

function convertDeclaration(prop: string, value: string): string {
  switch (prop) {
    case 'display': {
      const map: Record<string, string> = { flex: 'flex', block: 'block', inline: 'inline', 'inline-block': 'inline-block', grid: 'grid', none: 'hidden', 'inline-flex': 'inline-flex' };
      return map[value] ?? `[display:${value}]`;
    }
    case 'flex-direction': {
      const map: Record<string, string> = { row: 'flex-row', column: 'flex-col', 'row-reverse': 'flex-row-reverse', 'column-reverse': 'flex-col-reverse' };
      return map[value] ?? `[flex-direction:${value}]`;
    }
    case 'justify-content': {
      const map: Record<string, string> = { 'flex-start': 'justify-start', 'flex-end': 'justify-end', center: 'justify-center', 'space-between': 'justify-between', 'space-around': 'justify-around', 'space-evenly': 'justify-evenly' };
      return map[value] ?? `[justify-content:${value}]`;
    }
    case 'align-items': {
      const map: Record<string, string> = { 'flex-start': 'items-start', 'flex-end': 'items-end', center: 'items-center', stretch: 'items-stretch', baseline: 'items-baseline' };
      return map[value] ?? `[align-items:${value}]`;
    }
    case 'position':
      return ['relative', 'absolute', 'fixed', 'sticky', 'static'].includes(value) ? value : `[position:${value}]`;
    case 'text-align': {
      const map: Record<string, string> = { left: 'text-left', center: 'text-center', right: 'text-right', justify: 'text-justify' };
      return map[value] ?? `[text-align:${value}]`;
    }
    case 'font-weight':
      return FONT_WEIGHT_MAP[value] ? `font-${FONT_WEIGHT_MAP[value]}` : `[font-weight:${value}]`;
    case 'font-size':
      return FONT_SIZE_MAP[value] ? `text-${FONT_SIZE_MAP[value]}` : `text-[${value}]`;
    case 'width':
    case 'height': {
      const prefix = prop === 'width' ? 'w' : 'h';
      if (value === '100%') return `${prefix}-full`;
      if (value === 'auto') return `${prefix}-auto`;
      const px = parsePx(value);
      return px !== null ? `${prefix}-${pxToSpacing(px)}` : `${prefix}-[${value}]`;
    }
    case 'gap':
    case 'row-gap':
    case 'column-gap': {
      const prefix = prop === 'row-gap' ? 'gap-y' : prop === 'column-gap' ? 'gap-x' : 'gap';
      const px = parsePx(value);
      return px !== null ? `${prefix}-${pxToSpacing(px)}` : `${prefix}-[${value}]`;
    }
    case 'padding': case 'padding-top': case 'padding-right': case 'padding-bottom': case 'padding-left': {
      const sideMap: Record<string, string> = { padding: 'p', 'padding-top': 'pt', 'padding-right': 'pr', 'padding-bottom': 'pb', 'padding-left': 'pl' };
      const px = parsePx(value);
      return px !== null ? `${sideMap[prop]}-${pxToSpacing(px)}` : `${sideMap[prop]}-[${value}]`;
    }
    case 'margin': case 'margin-top': case 'margin-right': case 'margin-bottom': case 'margin-left': {
      const sideMap: Record<string, string> = { margin: 'm', 'margin-top': 'mt', 'margin-right': 'mr', 'margin-bottom': 'mb', 'margin-left': 'ml' };
      const px = parsePx(value);
      return px !== null ? `${sideMap[prop]}-${pxToSpacing(px)}` : `${sideMap[prop]}-[${value}]`;
    }
    case 'border-radius': {
      const px = parsePx(value);
      if (px === null) return `rounded-[${value}]`;
      const found = RADIUS_MAP.find(([v]) => v === px);
      return found ? (found[1] ? `rounded-${found[1]}` : 'rounded') : `rounded-[${value}]`;
    }
    case 'color':
      return `text-[${value}]`;
    case 'background-color':
    case 'background':
      return `bg-[${value}]`;
    case 'cursor':
      return `cursor-${value}`;
    case 'overflow':
      return ['hidden', 'auto', 'visible', 'scroll'].includes(value) ? `overflow-${value}` : `[overflow:${value}]`;
    default:
      return `[${prop}:${value}]`;
  }
}

function parseDeclarations(css: string): { prop: string; value: string }[] {
  const inner = css.includes('{') ? css.slice(css.indexOf('{') + 1, css.lastIndexOf('}')) : css;
  return inner
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      const idx = s.indexOf(':');
      if (idx === -1) return null;
      return { prop: s.slice(0, idx).trim(), value: s.slice(idx + 1).trim() };
    })
    .filter((d): d is { prop: string; value: string } => d !== null);
}

function cssToTailwind(css: string): string {
  return parseDeclarations(css)
    .map(({ prop, value }) => convertDeclaration(prop, value))
    .join(' ');
}

export default function CssToTailwindClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => cssToTailwind(input), [input]);

  const loadExample = () => setInput(EXAMPLE);

  const copy = () => {
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSS Declarations</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        spellCheck={false}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', minHeight: 200 }}
      />
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Tailwind Classes</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{result || ' - '}</pre>
      </div>
    </div>
  );
}
