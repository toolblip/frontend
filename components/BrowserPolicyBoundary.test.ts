import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

const state = vi.hoisted(() => ({ pathname: '/tools', refs: [] as { current: unknown }[], cursor: 0, effects: [] as (() => void)[] }));
vi.mock('next/navigation', () => ({ usePathname: () => state.pathname }));
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useRef: (value: unknown) => {
    const index = state.cursor++;
    return state.refs[index] ??= { current: value };
  },
  useEffect: (effect: () => void) => state.effects.push(effect),
}));
import BrowserPolicyBoundary from './BrowserPolicyBoundary';

function render(path: string) {
  state.pathname = path;
  state.cursor = 0;
  return BrowserPolicyBoundary({ children: createElement('div', null, 'tool markup') });
}

beforeEach(() => {
  state.refs = []; state.effects = []; state.cursor = 0;
  vi.stubGlobal('window', { location: { href: 'https://toolblip.com/tools/dns-lookup?q=test#result', replace: vi.fn() } });
});

describe('persistent document policy boundary', () => {
  it('preserves SSR and first client render for direct links under every scope', () => {
    for (const path of ['/tools', '/tools/dns-lookup', '/tools/html-live-preview', '/tools/speech-to-text']) {
      state.refs = [];
      expect(renderToString(render(path)!)).toBe('<div>tool markup</div>');
      expect(renderToString(render(path)!)).toBe('<div>tool markup</div>');
    }
    expect(window.location.replace).not.toHaveBeenCalled();
  });

  it('withholds new children before effects and replaces the full URL once', () => {
    render('/tools');
    expect(render('/tools/dns-lookup')).toBeNull();
    expect(window.location.replace).not.toHaveBeenCalled();
    state.effects.forEach(effect => effect());
    state.effects.forEach(effect => effect());
    expect(window.location.replace).toHaveBeenCalledExactlyOnceWith(window.location.href);
  });

  it('withholds children between differing relaxed scopes and returning to baseline', () => {
    for (const [from, to] of [
      ['/tools/dns-lookup', '/tools/html-live-preview'],
      ['/tools/html-live-preview', '/tools/speech-to-text'],
      ['/tools/speech-to-text', '/tools/word-counter'],
      ['/tools/dns-lookup', '/tools/domain-age-checker'],
    ]) {
      state.refs = [];
      render(from);
      expect(render(to)).toBeNull();
    }
  });

  it('retains client navigation within the original policy, including query/hash', () => {
    render('/tools/dns-lookup');
    expect(render('/tools/ping-test')).not.toBeNull();
    expect(render('/tools/ping-test?q=test#result')).not.toBeNull();
    expect(render('/tools/dns-lookup')).not.toBeNull();
    state.effects.forEach(effect => effect());
    expect(window.location.replace).not.toHaveBeenCalled();
  });
});
