import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';

// Minimal hook driver: exercises the real component handlers/effects without a browser.
// DOM rendering/decoder integration is covered by the supplemental browser regressions.
const hooks = vi.hoisted(() => ({ slots: [] as any[], index: 0, effects: [] as (() => void)[], dirty: false }));
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useState: (initial: any) => {
    const index = hooks.index++;
    if (!(index in hooks.slots)) hooks.slots[index] = typeof initial === 'function' ? initial() : initial;
    return [hooks.slots[index], (value: any) => {
      const next = typeof value === 'function' ? value(hooks.slots[index]) : value;
      if (!Object.is(next, hooks.slots[index])) { hooks.slots[index] = next; hooks.dirty = true; }
    }];
  },
  useRef: (initial: any) => { const index = hooks.index++; return hooks.slots[index] ??= { current: initial }; },
  useEffect: (effect: () => void, deps?: any[]) => {
    const index = hooks.index++, prior = hooks.slots[index];
    if (!prior || !deps || deps.some((value, i) => !Object.is(value, prior[i]))) hooks.effects.push(effect);
    hooks.slots[index] = deps;
  },
}));
const image = vi.hoisted(() => ({ read: vi.fn() }));
vi.mock('@/lib/images-qa', async original => ({ ...await original<typeof import('../../lib/images-qa')>(), readImage: image.read }));
vi.mock('esbuild-wasm', async () => ({ initialize: async () => {}, transform: (await import('esbuild')).transform }));
vi.mock('@/lib/developer-general/script-formatter-browser', () => ({ loadScriptFormatter: () => import('typescript') }));
import StickyNotes from './StickyNotesClient';
import DpiResizer from './ImageDpiResizerClient';
import Htaccess from './HtaccessRedirectGeneratorClient';
import Beautifier from './CodeBeautifierClient';

type Node = ReactElement<any>;
function nodes(value: any): Node[] {
  if (Array.isArray(value)) return value.flatMap(nodes);
  if (!value || typeof value !== 'object' || !value.props) return [];
  return [value, ...nodes(value.props.children)];
}
function text(value: any): string {
  if (Array.isArray(value)) return value.map(text).join('');
  return value?.props ? text(value.props.children) : typeof value === 'string' || typeof value === 'number' ? String(value) : '';
}
function mount(component: () => any) {
  let tree: any;
  const flush = () => {
    let count = 0;
    do {
      if (++count > 20) throw Error('Render loop');
      hooks.index = 0; hooks.dirty = false; tree = component();
      hooks.effects.splice(0).forEach(effect => effect());
    } while (hooks.dirty);
  };
  flush();
  return { flush, all: () => nodes(tree), find: (predicate: (n: Node) => boolean) => {
    const node = nodes(tree).find(predicate); if (!node) throw Error('Missing element'); return node;
  } };
}
beforeEach(() => {
  hooks.slots = []; hooks.effects = []; hooks.index = 0; hooks.dirty = false;
  image.read.mockReset(); vi.unstubAllGlobals();
  vi.stubGlobal('window',{innerWidth:1000,innerHeight:800});
});
describe('review component state regressions', () => {
  it('preserves all 101 stored notes and legacy fields until explicit deletion', () => {
    const notes = Array.from({length:101}, (_,i) => ({id:String(i),content:`Note ${i}`,color:'bg-yellow-200',createdAt:123,position:{x:i,y:20},legacy:{pinned:true}}));
    let stored = JSON.stringify(notes);
    vi.stubGlobal('localStorage', { getItem: () => stored, setItem: (_: string, value: string) => { stored = value; } });
    const view = mount(StickyNotes);
    expect(JSON.parse(stored)).toEqual(notes);
    view.find(n => n.type === 'button' && text(n) === 'Add Note').props.onClick(); view.flush();
    expect(JSON.parse(stored)).toEqual(notes);
    view.find(n => typeof n.props.onExample === 'function').props.onExample(); view.flush();
    expect(JSON.parse(stored)).toEqual(notes);
    view.find(n => n.type === 'button' && text(n) === '✕').props.onClick(); view.flush();
    expect(JSON.parse(stored)).toEqual(notes.slice(1));
  });
  it('does not overwrite unreadable saved data on mount or Add', () => {
    let stored = '[broken';
    vi.stubGlobal('localStorage', {getItem: () => stored, setItem: (_:string,v:string) => {stored=v;}});
    const view=mount(StickyNotes);
    view.find(n=>n.type==='button' && text(n)==='Add Note').props.onClick(); view.flush();
    expect(stored).toBe('[broken');
  });
  it('keeps a held source decode alive across DPI settings changes', async () => {
    let resolve!: (s:any) => void;
    image.read.mockReturnValue(new Promise(r=>{resolve=r;}));
    const view=mount(DpiResizer);
    const loading=view.find(n=>n.props.type==='file').props.onChange({target:{files:[{}]}}); view.flush();
    view.all().filter(n=>n.props.type==='number')[0].props.onChange({target:{value:'100'}}); view.flush();
    view.all().filter(n=>n.props.type==='number')[1].props.onChange({target:{value:'200'}}); view.flush();
    expect(view.all().some(n=>n.props.role==='status' && text(n)==='Processing…')).toBe(true);
    resolve({img:{naturalWidth:80,naturalHeight:40}}); await loading; view.flush();
    expect(view.all().some(n=>n.props.role==='status' && text(n)==='160 × 80 pixels · 200 DPI')).toBe(true);
    expect(view.find(n=>n.type==='button' && text(n)==='Download PNG').props.disabled).toBe(false);
  });
  it('Clear still cancels a held source decode', async () => {
    let resolve!: (s:any) => void; image.read.mockReturnValue(new Promise(r=>{resolve=r;}));
    const view=mount(DpiResizer);
    const loading=view.find(n=>n.props.type==='file').props.onChange({target:{files:[{}]}}); view.flush();
    view.find(n=>typeof n.props.onClear==='function').props.onClear(); view.flush();
    resolve({img:{naturalWidth:80,naturalHeight:40}}); await loading; view.flush();
    expect(view.all().some(n=>n.type==='button' && text(n)==='Download PNG')).toBe(false);
  });
  it.each(['add','remove'])('preserves HTTP and HTTPS for www %s without forcing HTTPS', mode => {
    const form = (Htaccess().props.children as Node).type as () => Node;
    const view=mount(form);
    view.find(n=>n.props.id==='htaccess-base-domain').props.onChange({target:{value:'example.com'}}); view.flush();
    view.find(n=>n.props.id==='htaccess-www-mode').props.onChange({target:{value:mode}}); view.flush();
    const rules=view.find(n=>n.props.id==='htaccess-output').props.value;
    // Resolve just the generated scheme/host substitution for both independent inputs.
    const substitution=rules.match(/RewriteRule \^ (\S+) \[L,R=301\]/)[1];
    for (const scheme of ['http','https']) {
      expect(substitution.replace('%{REQUEST_SCHEME}',scheme).replace('%{REQUEST_URI}','/a')).toBe(`${scheme}://${mode==='add'?'www.':''}example.com/a`);
    }
    view.find(n=>n.props.type==='checkbox').props.onChange({target:{checked:true}}); view.flush();
    expect(view.find(n=>n.props.id==='htaccess-output').props.value).not.toContain('http://');
  });
  it('formats and downloads TypeScript declarations and interfaces intact', async () => {
    const blobs: Blob[]=[]; const anchor={download:'',href:'',click:vi.fn()};
    vi.spyOn(URL,'createObjectURL').mockImplementation(blob=>{blobs.push(blob as Blob);return 'blob:test';});
    vi.spyOn(URL,'revokeObjectURL').mockImplementation(()=>{});
    vi.stubGlobal('document',{createElement:()=>anchor});
    const view=mount(Beautifier);
    view.find(n=>n.props['aria-label']==='Language').props.onChange({target:{value:'typescript'}}); view.flush();
    view.find(n=>n.props['aria-label']==='Code').props.onChange({target:{value:'export type UserId = string; export interface User { id: UserId; }'}}); view.flush();
    await view.find(n=>n.type==='button' && text(n)==='Beautify').props.onClick(); view.flush();
    const result=view.find(n=>n.props['aria-label']==='Beautified Code').props.value;
    expect(result).toContain('export type UserId = string;'); expect(result).toContain('export interface User');
    view.find(n=>n.type==='button' && text(n)==='Download').props.onClick();
    expect(anchor.download).toBe('beautified.ts'); expect(await blobs[0].text()).toBe(result);
    vi.restoreAllMocks();
  });
});
