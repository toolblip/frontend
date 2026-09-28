import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import data from '@/lib/utility-design/fixtures/dictionary-eloquent.json';

const hooks = vi.hoisted(() => ({ slots: [] as any[], index: 0, effects: [] as (() => void | (() => void))[], dirty: false }));
vi.mock('react', async original => ({
  ...await original<typeof import('react')>(),
  useState(initial: any) {
    const index = hooks.index++;
    if (!(index in hooks.slots)) hooks.slots[index] = typeof initial === 'function' ? initial() : initial;
    return [hooks.slots[index], (value: any) => {
      const next = typeof value === 'function' ? value(hooks.slots[index]) : value;
      if (!Object.is(next, hooks.slots[index])) { hooks.slots[index] = next; hooks.dirty = true; }
    }];
  },
  useRef(initial: any) { const index = hooks.index++; return hooks.slots[index] ??= { current: initial }; },
  useEffect(effect: () => void | (() => void), deps?: any[]) {
    const index = hooks.index++, prior = hooks.slots[index];
    if (!prior || !deps || deps.some((value, i) => !Object.is(value, prior[i]))) hooks.effects.push(effect);
    hooks.slots[index] = deps;
  },
}));
import Dictionary from './EnglishDictionaryClient';
type Node = ReactElement<any>;
function nodes(value: any): Node[] {
  if (Array.isArray(value)) return value.flatMap(nodes);
  if (!value || typeof value !== 'object' || !value.props) return [];
  return [value, ...nodes(value.props.children)];
}
function text(value: any): string {
  if (Array.isArray(value)) return value.map(text).join('');
  return value?.props ? text(value.props.children) : typeof value === 'string' ? value : '';
}
function mount() {
  let tree: any;
  const cleanups: (() => void)[] = [];
  const flush = () => {
    let count = 0;
    do {
      if (++count > 20) throw Error('Render loop');
      hooks.index = 0; hooks.dirty = false; tree = Dictionary();
      hooks.effects.splice(0).forEach(effect => { const cleanup = effect(); if (cleanup) cleanups.push(cleanup); });
    } while (hooks.dirty);
  };
  const find = (predicate: (node: Node) => boolean) => { const node = nodes(tree).find(predicate); if (!node) throw Error('Missing control'); return node; };
  flush();
  return {
    flush,
    change(value: string) { find(n => n.props['aria-label'] === 'Word').props.onChange({ target: { value } }); flush(); },
    lookup() { const result = find(n => n.type === 'button' && /Look/.test(text(n))).props.onClick() as Promise<void>; flush(); return result; },
    clear() { find(n => typeof n.props.onClear === 'function').props.onClear(); flush(); },
    word: () => find(n => n.props['aria-label'] === 'Word').props.value,
    output: () => text(find(n => n.props.className === 'tb-v2-tool-output-body')),
    busy: () => nodes(tree).some(n => n.type === 'button' && text(n) === 'Looking up...'),
    unmount() { cleanups.forEach(cleanup => cleanup()); },
  };
}
const response = () => new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } });
function delayedFetch(milliseconds: number) {
  let signal!: AbortSignal;
  vi.stubGlobal('fetch', vi.fn((_url: string, options: RequestInit) => new Promise((resolve, reject) => {
    signal = options.signal!;
    const abort = () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(response()); }, milliseconds);
    signal.addEventListener('abort', abort, { once: true });
  })));
  return () => signal;
}
beforeEach(() => { hooks.slots = []; hooks.index = 0; hooks.effects = []; hooks.dirty = false; vi.useFakeTimers(); });
afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('dictionary bounded requests', () => {
  it('accepts a valid provider response arriving after 20.09 seconds', async () => {
    const signal = delayedFetch(20090), view = mount(); view.change('eloquent');
    const pending = view.lookup();
    await vi.advanceTimersByTimeAsync(15001); view.flush();
    expect(signal().aborted).toBe(false); expect(view.busy()).toBe(true);
    await vi.advanceTimersByTimeAsync(5089); await pending; view.flush();
    expect(view.output()).toContain('Fluently persuasive and articulate.');
    expect(view.output()).not.toContain('timed out'); expect(view.busy()).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('aborts at 30 seconds, shows a bounded timeout error, and releases loading state', async () => {
    const signal = delayedFetch(60000), view = mount(); view.change('eloquent');
    const pending = view.lookup();
    await vi.advanceTimersByTimeAsync(29999); view.flush();
    expect(signal().aborted).toBe(false); expect(view.busy()).toBe(true);
    await vi.advanceTimersByTimeAsync(1); await pending; view.flush();
    expect(signal().aborted).toBe(true); expect(view.busy()).toBe(false);
    expect(view.output()).toContain('Lookup unavailable or timed out. Try again.');
    expect(vi.getTimerCount()).toBe(0);
  });
  it('Clear aborts a delayed request and leaves no stale error, result, or timer', async () => {
    const signal = delayedFetch(20090), view = mount(); view.change('eloquent');
    const pending = view.lookup(); await vi.advanceTimersByTimeAsync(4000);
    view.clear(); await pending; view.flush();
    expect(signal().aborted).toBe(true); expect(view.word()).toBe(''); expect(view.busy()).toBe(false);
    expect(view.output()).toContain('Look up a word'); expect(view.output()).not.toContain('unavailable');
    expect(vi.getTimerCount()).toBe(0);
  });
  it('editing the word cancels a delayed request without overwriting the new input', async () => {
    const signal = delayedFetch(20090), view = mount(); view.change('eloquent');
    const pending = view.lookup(); await vi.advanceTimersByTimeAsync(4000);
    view.change('different'); await pending; view.flush();
    expect(signal().aborted).toBe(true); expect(view.word()).toBe('different'); expect(view.busy()).toBe(false);
    expect(view.output()).not.toContain('Fluently persuasive and articulate.'); expect(view.output()).not.toContain('unavailable');
    expect(vi.getTimerCount()).toBe(0);
  });
  it('ignores a response body that finishes after Clear', async () => {
    let finish!: () => void;
    // Deliberately ignore transport abort: even a body that finishes later must
    // not publish stale definitions or errors after Clear.
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        finish = () => { controller.enqueue(new TextEncoder().encode(JSON.stringify(data))); controller.close(); };
      },
    });
    vi.stubGlobal('fetch', vi.fn(async () => new Response(body)));
    const view = mount(); view.change('eloquent'); const pending = view.lookup();
    await vi.advanceTimersByTimeAsync(0); expect(body.locked).toBe(true);
    view.clear(); finish(); await pending; view.flush();
    expect(body.locked).toBe(false);
    expect(view.output()).toContain('Look up a word'); expect(view.output()).not.toContain('Fluently persuasive and articulate.');
    expect(view.busy()).toBe(false); expect(vi.getTimerCount()).toBe(0);
  });
  it('unmount aborts the pending network request and clears its deadline', async () => {
    const signal = delayedFetch(20090), view = mount(); view.change('eloquent'); const pending = view.lookup();
    view.unmount(); await pending;
    expect(signal().aborted).toBe(true); expect(vi.getTimerCount()).toBe(0);
  });
});
