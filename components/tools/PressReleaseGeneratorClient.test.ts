import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import { PDFDocument } from 'pdf-lib';

// Drive the real component's handlers, including ancestor capture handlers.
// Only React scheduling and browser download primitives are replaced.
const hooks = vi.hoisted(() => ({ slots: [] as any[], index: 0, effects: [] as (() => void)[], dirty: false }));
const exportGate = vi.hoisted(() => ({ wait: Promise.resolve() }));
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
  useMemo(factory: () => any, deps: any[]) {
    const index = hooks.index++, prior = hooks.slots[index];
    if (!prior || deps.some((value, i) => !Object.is(value, prior.deps[i]))) hooks.slots[index] = { deps, value: factory() };
    return hooks.slots[index].value;
  },
  useEffect(effect: () => void, deps?: any[]) {
    const index = hooks.index++, prior = hooks.slots[index];
    if (!prior || !deps || deps.some((value, i) => !Object.is(value, prior[i]))) hooks.effects.push(effect);
    hooks.slots[index] = deps;
  },
}));
vi.mock('@/lib/utility-design/document', async original => {
  const actual = await original<typeof import('../../lib/utility-design/document')>();
  return { ...actual, async documentPdf(text: string) {
    const gate = exportGate.wait;
    // Generate/validate the real PDF, retaining real errors. Delay only delivery.
    const outcome = await actual.documentPdf(text).then(bytes => ({ bytes }), error => ({ error }));
    await gate;
    if ('error' in outcome) throw outcome.error;
    return outcome.bytes;
  } };
});
import PressRelease from './PressReleaseGeneratorClient';

type Node = ReactElement<any>;
function paths(value: any, parents: Node[] = []): Node[][] {
  if (Array.isArray(value)) return value.flatMap(child => paths(child, parents));
  if (!value || typeof value !== 'object' || !value.props) return [];
  const path = [...parents, value];
  return [path, ...paths(value.props.children, path)];
}
function text(value: any): string {
  if (Array.isArray(value)) return value.map(text).join('');
  return value?.props ? text(value.props.children) : typeof value === 'string' ? value : '';
}
function mount() {
  let tree: any;
  const flush = () => {
    let count = 0;
    do {
      if (++count > 20) throw Error('Render loop');
      hooks.index = 0; hooks.dirty = false; tree = PressRelease();
      hooks.effects.splice(0).forEach(effect => effect());
    } while (hooks.dirty);
  };
  flush();
  const all = () => paths(tree).map(path => path.at(-1)!);
  return {
    flush,
    change(label: string, value: string) {
      const path = paths(tree).find(path => path.at(-1)!.props['aria-label'] === label);
      if (!path) throw Error(`Missing input ${label}`);
      const event = { target: { value } };
      path.forEach(node => node.props.onChangeCapture?.(event));
      path.at(-1)!.props.onChange(event);
      flush();
    },
    export() { return all().find(node => node.type === 'button' && text(node) === 'Download .pdf')!.props.onClick() as Promise<void>; },
    alerts: () => all().filter(node => node.props.role === 'alert').map(text),
    busy: () => all().some(node => node.props.role === 'status'),
    preview: () => text(all().find(node => node.type === 'pre')),
  };
}
const fields = [
  ['Headline', 'Updated headline'], ['Dateline', 'Dhaka'], ['Date', '2026-10-01'],
  ['Body', 'Updated body'], ['Company Name', 'Updated company'], ['Contact Name', 'Updated contact'],
  ['Contact Email', 'updated@example.com'], ['Contact Phone', '12345'], ['Boilerplate', 'Updated boilerplate'],
];
let downloads: Blob[];
beforeEach(() => {
  hooks.slots = []; hooks.index = 0; hooks.effects = []; hooks.dirty = false;
  exportGate.wait = Promise.resolve(); downloads = [];
  const blobs = new Map<string, Blob>();
  vi.spyOn(URL, 'createObjectURL').mockImplementation(blob => { const url = `blob:test-${blobs.size}`; blobs.set(url, blob as Blob); return url; });
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  vi.stubGlobal('document', { body: { appendChild() {} }, createElement: () => ({ href: '', download: '', click() { downloads.push(blobs.get(this.href)!); }, remove() {} }) });
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });
function holdExport() {
  let release!: () => void;
  exportGate.wait = new Promise<void>(resolve => { release = resolve; });
  return release;
}
describe('press release PDF invalidation', () => {
  it.each(fields)('editing %s discards a pending actual PDF export', async (label, value) => {
    const view = mount(), release = holdExport(), pending = view.export(); view.flush();
    expect(view.busy()).toBe(true);
    view.change(label, value);
    const busyAfterEdit = view.busy();
    release(); await pending; view.flush();
    expect(downloads).toHaveLength(0);
    expect(busyAfterEdit).toBe(false);
    expect(view.alerts()).toEqual([]);
  });
  it.each(fields)('editing %s clears an existing actual PDF encoding error', async (label, value) => {
    const view = mount(); view.change('Headline', 'বাংলা');
    await view.export(); view.flush();
    expect(view.alerts().join(' ')).toContain('Download TXT');
    view.change(label, value);
    expect(view.alerts()).toEqual([]);
  });
  it('ignores a late real encoding error after a body edit', async () => {
    const view = mount(); view.change('Headline', 'বাংলা');
    const release = holdExport(), pending = view.export();
    view.change('Body', 'Revised while exporting');
    release(); await pending; view.flush();
    expect(view.alerts()).toEqual([]); expect(downloads).toHaveLength(0);
  });
  it('allows the current document to export after a stale operation finishes', async () => {
    const view = mount(), release = holdExport(), pending = view.export();
    view.change('Body', 'Current body after revision');
    release(); await pending; view.flush();
    exportGate.wait = Promise.resolve();
    await view.export(); view.flush();
    expect(downloads).toHaveLength(1);
    expect(view.preview()).toContain('Current body after revision');
    const pdf = await PDFDocument.load(await downloads[0].arrayBuffer());
    expect(pdf.getPageCount()).toBeGreaterThan(0);
    expect(view.busy()).toBe(false); expect(view.alerts()).toEqual([]);
  });
});
