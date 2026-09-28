import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';

// Minimal hook driver: exercises the real component handlers/effects without a browser.
// DOM rendering/decoder integration is covered by the supplemental browser regressions.
const hooks = vi.hoisted(() => ({ slots: [] as any[], index: 0, effects: [] as (() => void)[], dirty: false }));
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useMemo: (fn: () => any) => fn(),
  useCallback: (fn: any) => fn,
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
  vi.unstubAllGlobals();
  vi.stubGlobal('window',{innerWidth:1000,innerHeight:800});
});

import Pressure from './PressureConverterClient';
import Metric from './MetricImperialConverterClient';
import Morse from './MorseCodeTranslatorClient';
import Hex from './HexToDecimalConverterClient';
import Paragraph from './RandomParagraphGeneratorClient';
import Currency from './CurrencyConverterClient';
import GrammarPro from './GrammarCheckerProClient';
import GrammarV2 from './GrammarCheckerV2Client';
const field = (v: ReturnType<typeof mount>, label: string, value: string) => { v.find(n=>n.props['aria-label']===label).props.onChange({target:{value}}); v.flush(); };
const button = (v: ReturnType<typeof mount>, name: string) => { v.find(n=>n.type==='button' && text(n).trim()===name).props.onClick(); v.flush(); };
it('pressure swap preserves 101325 rather than localized 101,325',()=>{const v=mount(Pressure);field(v,'Pressure value','1');button(v,'⇄');expect(v.find(n=>n.props['aria-label']==='Pressure value').props.value).toBe('101325');});
it('metric swap preserves 1000 rather than localized 1,000',()=>{const v=mount(Metric);field(v,'Value','1');field(v,'From unit','km');field(v,'To unit','m');button(v,'⇄');expect(v.find(n=>n.props['aria-label']==='Value').props.value).toBe('1000');});
it('Morse preserves words and rejects unknown tokens',()=>{const v=mount(Morse);field(v,'Text input','SOS HELP');expect(v.find(n=>n.props['aria-label']==='Morse code input').props.value).toBe('... --- ... / .... . .-.. .--.');field(v,'Morse code input','... --- ... / .... . .-.. .--.');expect(v.find(n=>n.props['aria-label']==='Text input').props.value).toBe('SOS HELP');field(v,'Morse code input','.......');expect(v.all().some(n=>n.props.role==='alert')).toBe(true);});
it('hex conversion preserves integers above safe Number range',()=>{const v=mount(Hex);field(v,'Hexadecimal','20000000000001');expect(v.find(n=>n.props['aria-label']==='Decimal').props.value).toBe('9007199254740993');field(v,'Decimal','9007199254740993');expect(v.find(n=>n.props['aria-label']==='Hexadecimal').props.value).toBe('20000000000001');});
it('paragraph templates replace all placeholders',()=>{vi.spyOn(Math,'random').mockReturnValue(0.25);const v=mount(Paragraph);button(v,'Generate Paragraphs');expect(v.all().filter(n=>n.type==='p').map(text).join(' ')).not.toMatch(/\{(?:noun|adj|verb)\}/);vi.restoreAllMocks();});
it('currency unit rates agree with conversion direction',()=>{const v=mount(Currency);expect(v.all().map(text).join(' ')).toContain('1 USD = 0.9200 EUR');expect(v.all().map(text).join(' ')).toContain('1 EUR = 1.0870 USD');});
const issue={message:'Use an alternative',context:{text:'bad word',offset:0,length:3},offset:0,length:3,replacements:[{value:'first'},{value:'second'}],rule:{category:{name:'Style'}}};
it('grammar Pro applies the selected alternative and invalidates other offsets',async()=>{vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,json:async()=>({matches:[issue]})})));const v=mount(GrammarPro);v.find(n=>n.type==='textarea').props.onChange({target:{value:'bad word'}});v.flush();await v.find(n=>n.type==='button'&&text(n).includes('Check Grammar')).props.onClick();v.flush();button(v,'second');expect(v.find(n=>n.type==='textarea').props.value).toBe('second word');expect(v.all().some(n=>n.type==='button'&&text(n)==='first')).toBe(false);});
it('grammar Pro invalidates old offsets when text is edited',async()=>{vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,json:async()=>({matches:[issue]})})));const v=mount(GrammarPro);v.find(n=>n.type==='textarea').props.onChange({target:{value:'bad word'}});v.flush();await v.find(n=>n.type==='button'&&text(n).includes('Check Grammar')).props.onClick();v.flush();expect(v.all().some(n=>n.type==='button'&&text(n)==='first')).toBe(true);v.find(n=>n.type==='textarea').props.onChange({target:{value:'new bad word'}});v.flush();expect(v.all().some(n=>n.type==='button'&&text(n)==='first')).toBe(false);});
for(const [name,component] of [['Pro',GrammarPro],['V2',GrammarV2]] as const)it(`grammar ${name} ignores a response after Clear`,async()=>{let resolve!:(v:any)=>void;vi.stubGlobal('fetch',vi.fn(()=>new Promise(r=>resolve=r)));const v=mount(component);v.find(n=>n.type==='textarea').props.onChange({target:{value:'bad word'}});v.flush();const pending=v.find(n=>n.type==='button'&&text(n).includes('Check Grammar')).props.onClick();v.flush();v.find(n=>typeof n.props.onClear==='function').props.onClear();v.flush();resolve({ok:true,json:async()=>({matches:[issue]})});await pending;v.flush();expect(v.find(n=>n.type==='textarea').props.value).toBe('');expect(v.all().map(text).join(' ')).not.toContain('Use an alternative');});

import Shuffler from './TextSentenceShufflerClient';
it('shuffling a terminal sentence to the middle retains word separators',()=>{vi.spyOn(Math,'random').mockReturnValue(0);const v=mount(Shuffler);v.find(n=>n.type==='textarea'&&!n.props.readOnly).props.onChange({target:{value:'One. Two. Three.'}});v.flush();button(v,'Shuffle');expect(v.find(n=>n.type==='textarea'&&n.props.readOnly).props.value).toBe('Two. Three. One.');vi.restoreAllMocks();});
