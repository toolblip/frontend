import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import * as jsxRuntime from 'react/jsx-runtime';
import { Fragment, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import * as security from './developer-security/primitives';
import { matchRegex } from './developer-general/regex';
import { encodeCanvas } from './media-conversion/image';
import { markdownTable } from './media-conversion/data';

// Execute selected component functions and their handlers with deterministic hook state.
// This tests actual UI state transitions without a DOM; browser rendering is a separate check.
function component(name: string, modules: Record<string, unknown> = {}, globals: Record<string, unknown> = {}, props: Record<string, unknown> = {}) {
  const source = readFileSync(new URL(`../components/tools/${name}.tsx`, import.meta.url), 'utf8');
  const states: any[] = []; let cursor = 0; const effects: (() => void)[] = [];
  const hooks = {
    Fragment,
    useState: (initial: any) => { const i = cursor++; if (!(i in states)) states[i] = typeof initial === 'function' ? initial() : initial; return [states[i], (v: any) => { states[i] = typeof v === 'function' ? v(states[i]) : v; }]; },
    useRef: (initial: any) => { const i = cursor++; return states[i] ??= { current: initial }; },
    useMemo: (fn: () => any) => fn(),
    useCallback: (fn: any) => fn,
    useEffect: (fn: () => void, deps: unknown[]) => { const i = cursor++; if (!states[i] || deps.some((d, j) => d !== states[i][j])) { states[i] = deps; effects.push(fn); } },
  };
  const exports: { default?: (props: Record<string, unknown>) => ReactElement } = {};
  runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText, {
    exports, ...globals, setTimeout: () => 0, AbortController,
    require: (id: string) => id === 'react' ? hooks : id === 'react/jsx-runtime' ? jsxRuntime : modules[id] ?? { default: () => null },
  });
  return () => { cursor = 0; let tree = exports.default!(props); if (effects.length) { effects.splice(0).forEach(fn => fn()); cursor = 0; tree = exports.default!(props); } return tree; };
}
type Node = ReactElement<Record<string, any>>;
function nodes(tree: any): Node[] { if (Array.isArray(tree)) return tree.flatMap(nodes); if (!tree || typeof tree !== 'object') return []; return [tree, ...nodes(tree.props?.children)]; }
function text(tree: any): string { if (Array.isArray(tree)) return tree.map(text).join(''); if (tree == null || typeof tree === 'boolean') return ''; if (typeof tree !== 'object') return String(tree); return text(tree.props?.children); }
function field(tree: any, type: string) { return nodes(tree).find(n => n.type === type)!; }
function button(tree: any, label: string) { return nodes(tree).find(n => n.type === 'button' && (text(n) === label || n.props['aria-label'] === label))!; }

describe('selected UI boundary repairs', () => {
  it('rounds total reading seconds before splitting minutes and leaves empty input unestimated', () => {
    const render = component('ReadingTimeCalculatorClient');
    expect(text(render())).toContain('Enter text to calculate reading time');
    for (const [words, expected] of [[199, '1m 0s'], [399, '2m 0s']] as const) {
      field(render(), 'textarea').props.onChange({ target: { value: Array(words).fill('word').join(' ') } });
      expect(text(render())).toContain(expected);
      expect(text(render())).not.toContain('60s');
    }
  });
  it.each(['CaseConverterClient', 'WordCounterClient'])('%s reports clipboard failure and only marks success after resolution', async name => {
    const writeText = vi.fn().mockRejectedValueOnce(new Error('Denied')).mockResolvedValueOnce(undefined);
    const render = component(name, {}, { navigator: { clipboard: { writeText } } });
    field(render(), 'textarea').props.onChange({ target: { value: 'Hello world.' } });
    const label = name === 'CaseConverterClient' ? 'Copy UPPER' : 'Copy';
    await button(render(), label).props.onClick();
    expect(text(render())).toContain('Clipboard access failed');
    expect(text(render())).not.toContain('Copied');
    const pending = button(render(), label).props.onClick();
    expect(text(render())).not.toContain('Copied');
    await pending;
    expect(text(render())).toContain('Copied');
    expect(text(render())).not.toContain('Clipboard access failed');
  });
  it('hydrates Base64 saved decode mode once and switches plaintext examples to encode', () => {
    const render = component('Base64EncoderDecoderClient', {
      '@/lib/developer-security/primitives': security,
      './DeveloperSecurityFrame': { default: () => null, useSecurityTask: () => ({ current: 0 }) },
      '@/components/tools/useToolContext': { useToolContext: () => ({ saved: { mode: 'decode' } }) },
    });
    let tree = render();
    expect(button(tree, 'Decode').props['aria-selected']).toBe(true);
    button(tree, 'More examples').props.onClick();
    button(render(), 'Hello World').props.onClick();
    tree = render();
    expect(button(tree, 'Encode').props['aria-selected']).toBe(true);
    expect(field(tree, 'textarea').props.value).toBe('Hello, World!');
    expect(text(render())).toContain('SGVsbG8sIFdvcmxkIQ==');
  });
  it('uses the matcher bounds in the actual regex input controls', () => {
    const render = component('RegexTesterClient', {
      '@/lib/developer-general/use-safe-regex': { useSafeRegex: () => ({ matches: [], segments: [], error: '', count: 0 }) },
      './RegexExplainerClient': { tokenize: () => [] },
    });
    expect(field(render(), 'input').props.maxLength).toBe(2000);
    expect(field(render(), 'textarea').props.maxLength).toBe(50000);
    expect(matchRegex('a'.repeat(2001), '', '').error).toMatch(/Limit/);
    expect(matchRegex('x', '', 'x'.repeat(50001)).error).toMatch(/Limit/);
  });
  it('applies the clicked grammar suggestion and clears stale offsets', async () => {
    const issue = { message: 'Choose a replacement', rule: { description: 'Test' }, offset: 0, length: 3, replacements: [{ value: 'first' }, { value: 'second' }] };
    const render = component('GrammarCheckerClient', {}, { fetch: async () => ({ ok: true, json: async () => ({ matches: [issue, { ...issue, offset: 4 }] }) }) });
    field(render(), 'textarea').props.onChange({ target: { value: 'bad bad' } });
    await button(render(), 'Check Grammar').props.onClick();
    button(render(), 'second').props.onClick();
    expect(field(render(), 'textarea').props.value).toBe('second bad');
    expect(text(render())).not.toContain('Choose a replacement');
    expect(text(render())).toContain('Click Check Grammar');
  });
  it('ignores grammar responses for text edited while the request was pending', async () => {
    let resolve!: (value: unknown) => void;
    const render = component('GrammarCheckerClient', {}, { fetch: () => new Promise(r => { resolve = r; }) });
    field(render(), 'textarea').props.onChange({ target: { value: 'old text' } });
    const pending = button(render(), 'Check Grammar').props.onClick();
    field(render(), 'textarea').props.onChange({ target: { value: 'new text' } });
    resolve({ ok: true, json: async () => ({ matches: [{ message: 'Stale issue', rule: {}, replacements: [] }] }) });
    await pending;
    expect(text(render())).not.toContain('Stale issue');
  });
  it('counts Unicode letter runs separated by punctuation and never creates empty rows', () => {
    const render = component('WordFrequencyAnalyzerClient');
    field(render(), 'textarea').props.onChange({ target: { value: '  !!! --- ' } });
    expect(nodes(render()).filter(n => n.type === 'td')).toHaveLength(0);
    field(render(), 'textarea').props.onChange({ target: { value: 'the café,café বাংলা' } });
    const rows = nodes(render()).filter(n => n.type === 'tr').slice(1).map(text);
    expect(rows).toEqual(['café266.7%', 'বাংলা133.3%']);
    expect(text(render())).toContain('after the length and common-word filters');
  });
});

describe('shared output engines', () => {
  it('keeps the shared Markdown UI copy and file download capabilities', async () => {
    let prepared: { blob: Blob; name: string } | undefined;
    const writeText = vi.fn().mockResolvedValue(undefined);
    const job = { ready: true, busy: false, error: '', generation: { current: 0 }, cancel: () => {}, run: async (fn: (signal: AbortSignal) => Promise<{ blob: Blob; name: string }>) => { prepared = await fn(new AbortController().signal); } };
    const render = component('media-conversion/DataConverter', {
      '@/lib/media-conversion/data': { markdownTable },
      './useMediaJob': { useMediaJob: () => job },
    }, { Blob, navigator: { clipboard: { writeText } } }, { mode: 'markdown' });
    field(render(), 'textarea').props.onChange({ target: { value: '[{"name":"Ada"},{"later":"café"}]' } });
    const output = text(field(render(), 'pre'));
    expect(output).toContain('| name | later |');
    await button(render(), 'Copy').props.onClick();
    expect(writeText).toHaveBeenCalledWith(output);
    expect(text(render())).toContain('Copied');
    await button(render(), 'Prepare download').props.onClick();
    expect(prepared!.name).toBe('converted.md');
    expect(prepared!.blob.type).toBe('text/markdown');
    expect(await prepared!.blob.text()).toBe(output);
    field(render(), 'textarea').props.onChange({ target: { value: '[{"name":"Ada"},null]' } });
    expect(button(render(), 'Prepare download').props.disabled).toBe(true);
    expect(text(render())).toContain('Provide an object or a nonempty array of objects');
  });

  it('rejects browser MIME fallback instead of labeling PNG as JPEG', async () => {
    const canvas = { toBlob: (cb: (b: Blob) => void) => cb(new Blob(['png'], { type: 'image/png' })) } as HTMLCanvasElement;
    await expect(encodeCanvas(canvas, 'image/jpeg', 0.9, new AbortController().signal)).rejects.toThrow();
  });
  it('retains table columns, nested values and escaping across heterogeneous rows', () => {
    const result = markdownTable(JSON.stringify([{ 'a|b': 'one\ntwo', nested: { a: 1 } }, { later: '<tag>', nested: [1, 2] }]));
    expect(result).toContain('| a\\|b | nested | later |');
    expect(result).toContain('one<br>two');
    expect(result).toContain('{"a":1}');
    expect(result).toContain('[1,2]');
    expect(result).toContain('&lt;tag&gt;');
  });
  it.each(['null', '[]', '[{"x":1},null]', '[{"x":1},2]', '[[]]'])('rejects invalid table rows: %s', value => expect(() => markdownTable(value)).toThrow());
});
