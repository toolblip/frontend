'use client';
import DeveloperGeneralFrame from './DeveloperGeneralFrame';

import { cssSyntax } from '@/lib/developer-general/code';
import ToolExampleClearActions from './ToolExampleClearActions';
import { useState, useMemo } from 'react';

const EXAMPLE = `.card {
  padding: 16px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.primary-button {
  background: #7c3aed;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}

nav {
  display: flex;
  gap: 12px;
}`;

interface Rule {
  selector: string;
  body: string;
}

function parseRules(css: string): Rule[] {
  const rules: Rule[] = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    rules.push({ selector: m[1].trim(), body: m[2].trim() });
  }
  return rules;
}

function selectorToComponentName(selector: string): string {
  const first = selector.split(/\s+/)[0].split(':')[0];
  const bare = first.replace(/^[.#]/, '');
  const words = bare.split(/[-_]+/).filter(Boolean);
  const name = words.map(w => w[0].toUpperCase() + w.slice(1)).join('');
  return name || 'StyledComponent';
}

function selectorToTag(selector: string): string {
  const first = selector.split(/\s+/)[0].split(':')[0];
  return /^[a-zA-Z][\w-]*$/.test(first) ? first : 'div';
}

export function cssToStyledComponents(css: string): string {
 if(!css.trim())return '';
 const root=cssSyntax(css);const seen=new Set<string>();const output:string[]=[];
 root.each(rule=>{
  if(rule.type==='comment')return;
  if(rule.type!=='rule'||! /^[.#]?[a-zA-Z][\w-]*$/.test(rule.selector))throw new Error('Use simple single class, ID or element selectors. Complex selectors and at-rules require manual conversion.');
  const name=selectorToComponentName(rule.selector);if(seen.has(name))throw new Error('Selectors produce duplicate component names');seen.add(name);
  const tag=selectorToTag(rule.selector);
  const body=rule.nodes.map(n=>n.toString()).join(';\n').replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\$\{/g,'\\${');
  output.push(`const ${name} = styled(${JSON.stringify(tag)})\`\n${body}\n\`;`);
 });
 return 'import styled from "styled-components";\n\n'+output.join('\n\n');
}

export default function CssToStyledComponentsClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [copied, setCopied] = useState(false);

  const {result,error} = useMemo(() => {try{return {result:cssToStyledComponents(input),error:''};}catch(e){return {result:'',error:(e as Error).message};}}, [input]);

  const loadExample = () => setInput(EXAMPLE);

  const copy = () => {
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <DeveloperGeneralFrame><div>
      <ToolExampleClearActions onExample={() => {loadExample();}} onClear={() => {setInput('');setCopied(false);}} />
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">CSS Input</span>

      </div>
      <textarea aria-label="Input" maxLength={100000}
        value={input}
        onChange={e => setInput(e.target.value)}
        spellCheck={false}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', minHeight: 200 }}
      />
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">styled-components Output</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <p role="alert" className="tb-v2-error">{error}</p><pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{result || ' - '}</pre>
      </div>
    </div></DeveloperGeneralFrame>
  );
}
