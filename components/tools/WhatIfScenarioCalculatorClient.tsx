'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

interface Variable {
  id: number;
  name: string;
  value: string;
}

// ---- Hand-rolled recursive-descent expression parser (no eval / new Function) ----
// Grammar: expr := term (('+' | '-') term)*
//          term := power (('*' | '/') power)*
//          power := factor ('^' power)?
//          factor := NUMBER | IDENT | '(' expr ')' | ('-' | '+') factor

type Token = { type: 'num'; value: number } | { type: 'ident'; value: string } | { type: 'op'; value: string };

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (/[0-9.]/.test(ch)) {
      let j = i;
      let seenDot = false;
      while (j < src.length && (/[0-9]/.test(src[j]) || (src[j] === '.' && !seenDot))) {
        if (src[j] === '.') seenDot = true;
        j++;
      }
      const numStr = src.slice(i, j);
      if (!/^\d+(\.\d+)?$/.test(numStr)) throw new Error(`Invalid number "${numStr}"`);
      tokens.push({ type: 'num', value: parseFloat(numStr) });
      i = j;
      continue;
    }
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      tokens.push({ type: 'ident', value: src.slice(i, j) });
      i = j;
      continue;
    }
    if ('+-*/()^'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }
    throw new Error(`Unexpected character "${ch}" in formula`);
  }
  return tokens;
}

class Parser {
  tokens: Token[];
  pos = 0;
  vars: Record<string, number>;

  constructor(tokens: Token[], vars: Record<string, number>) {
    this.tokens = tokens;
    this.vars = vars;
  }

  peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  next(): Token | undefined {
    return this.tokens[this.pos++];
  }

  parseExpr(): number {
    let value = this.parseTerm();
    for (;;) {
      const t = this.peek();
      if (t && t.type === 'op' && (t.value === '+' || t.value === '-')) {
        this.next();
        const rhs = this.parseTerm();
        value = t.value === '+' ? value + rhs : value - rhs;
      } else {
        break;
      }
    }
    return value;
  }

  parseTerm(): number {
    let value = this.parsePower();
    for (;;) {
      const t = this.peek();
      if (t && t.type === 'op' && (t.value === '*' || t.value === '/')) {
        this.next();
        const rhs = this.parsePower();
        if (t.value === '/') {
          if (rhs === 0) throw new Error('Division by zero');
          value = value / rhs;
        } else {
          value = value * rhs;
        }
      } else {
        break;
      }
    }
    return value;
  }

  parsePower(): number {
    const value = this.parseFactor();
    const t = this.peek();
    if (t && t.type === 'op' && t.value === '^') {
      this.next();
      return value ** this.parsePower();
    }
    return value;
  }

  parseFactor(): number {
    const t = this.next();
    if (!t) throw new Error('Unexpected end of formula');
    if (t.type === 'op' && t.value === '-') return -this.parseFactor();
    if (t.type === 'op' && t.value === '+') return this.parseFactor();
    if (t.type === 'num') return t.value;
    if (t.type === 'ident') {
      if (!(t.value in this.vars)) throw new Error(`Unknown variable "${t.value}"`);
      return this.vars[t.value];
    }
    if (t.type === 'op' && t.value === '(') {
      const value = this.parseExpr();
      const close = this.next();
      if (!close || close.type !== 'op' || close.value !== ')') throw new Error('Missing closing parenthesis');
      return value;
    }
    throw new Error(`Unexpected token "${t.value}"`);
  }
}

function evaluateFormula(formula: string, vars: Record<string, number>): number {
  const tokens = tokenize(formula);
  if (tokens.length === 0) throw new Error('Formula is empty');
  const parser = new Parser(tokens, vars);
  const result = parser.parseExpr();
  if (parser.pos < tokens.length) {
    const leftover = parser.peek();
    throw new Error(`Unexpected token "${leftover && 'value' in leftover ? leftover.value : ''}"`);
  }
  if (!Number.isFinite(result)) throw new Error('Result is not a finite number');
  return result;
}

let nextId = 1;

export default function WhatIfScenarioCalculatorClient() {
  const [variables, setVariables] = useState<Variable[]>([
    { id: nextId++, name: 'price', value: '25' },
    { id: nextId++, name: 'quantity', value: '120' },
    { id: nextId++, name: 'discount', value: '0.1' },
  ]);
  const [formula, setFormula] = useState('price * quantity * (1 - discount)');
  const [copied, setCopied] = useState(false);

  const varMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const v of variables) {
      const name = v.name.trim();
      if (!name) continue;
      const num = parseFloat(v.value);
      map[name] = isNaN(num) ? 0 : num;
    }
    return map;
  }, [variables]);

  const { result, error } = useMemo(() => {
    if (!formula.trim()) return { result: null, error: '' };
    try {
      return { result: evaluateFormula(formula, varMap), error: '' };
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : 'Invalid formula' };
    }
  }, [formula, varMap]);

  const updateVar = (id: number, field: 'name' | 'value', val: string) => {
    setVariables(vs => vs.map(v => (v.id === id ? { ...v, [field]: val } : v)));
  };

  const removeVar = (id: number) => {
    setVariables(vs => vs.filter(v => v.id !== id));
  };

  const addVar = () => {
    setVariables(vs => [...vs, { id: nextId++, name: `var${vs.length + 1}`, value: '0' }]);
  };

  const loadExample = () => {
    setVariables([
      { id: nextId++, name: 'price', value: '40' },
      { id: nextId++, name: 'volume', value: '500' },
    ]);
    setFormula('price * volume');
    setCopied(false);
  };

  const clear = () => {
    setVariables([]);
    setFormula('');
    setCopied(false);
  };

  const hasInput = variables.length > 0 || Boolean(formula.trim());

  const copyResult = () => {
    if (result === null) return;
    navigator.clipboard.writeText(String(result)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Variables</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <ToolExampleClearActions
            exampleCount={1}
            onExample={loadExample}
            onClear={clear}
            canClear={hasInput}
          />
          <button type="button" onClick={addVar} className="tb-v2-btn-sm">+ Add Variable</button>
        </div>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {variables.map(v => (
          <div key={v.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={v.name}
              onChange={e => updateVar(v.id, 'name', e.target.value)}
              placeholder="name"
              className="tb-v2-input"
              style={{ maxWidth: 140, fontFamily: 'var(--f-mono)' }}
            />
            <input
              type="range"
              min={-1000}
              max={1000}
              step={0.01}
              value={isNaN(parseFloat(v.value)) ? 0 : parseFloat(v.value)}
              onChange={e => updateVar(v.id, 'value', e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              type="number"
              value={v.value}
              onChange={e => updateVar(v.id, 'value', e.target.value)}
              className="tb-v2-input"
              style={{ maxWidth: 110, fontFamily: 'var(--f-mono)' }}
            />
            <button type="button" onClick={() => removeVar(v.id)} className="tb-v2-btn-sm">Remove</button>
          </div>
        ))}
        {variables.length === 0 && <p className="tb-v2-empty">Add a variable to use it in your formula.</p>}
      </div>

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Formula</span>
      </div>
      <div style={{ padding: 20 }}>
        <input
          type="text"
          value={formula}
          onChange={e => setFormula(e.target.value)}
          placeholder="e.g. price * quantity * (1 - discount)"
          className="tb-v2-input"
          style={{ fontFamily: 'var(--f-mono)' }}
        />
        <p style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 6 }}>
           Supports +, -, *, /, ^, and parentheses over your variable names. No code execution, just arithmetic.
        </p>
      </div>

      {error && <div className="tb-v2-error" style={{ margin: '0 20px 20px' }}>{error}</div>}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
        <button type="button" onClick={copyResult} disabled={result === null} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {result === null ? (
          <p className="tb-v2-empty">Fix the formula above to see a live result.</p>
        ) : (
          <div className="tb-v2-stat-pill" style={{ maxWidth: 260 }}>
            <div className="tb-v2-stat-pill-val" style={{ fontSize: 28 }}>
              {result.toLocaleString('en-US', { maximumFractionDigits: 6 })}
            </div>
            <div className="tb-v2-stat-pill-lbl">Formula Result</div>
          </div>
        )}
      </div>
    </div>
  );
}
