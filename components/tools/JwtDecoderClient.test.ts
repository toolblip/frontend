import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const harness = vi.hoisted(() => ({
  values: [] as unknown[],
  cursor: 0,
  effects: [] as (() => void)[],
  token: '',
}));

vi.mock('react', async (importOriginal) => ({
  ...await importOriginal<typeof import('react')>(),
  useState: (initial: unknown) => {
    const index = harness.cursor++;
    if (!(index in harness.values)) harness.values[index] = index === 1 ? harness.token : initial;
    return [harness.values[index], (value: unknown) => { harness.values[index] = value; }];
  },
  useEffect: (effect: () => void) => { harness.effects.push(effect); },
  useMemo: (factory: () => unknown) => factory(),
}));
vi.mock('./DeveloperSecurityFrame', () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
  useSecurityTask: () => ({ current: 0 }),
}));

import JwtDecoderClient from './JwtDecoderClient';

function tokenFor(payload: Record<string, unknown>) {
  const segment = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${segment({ alg: 'HS256' })}.${segment(payload)}.${segment({ signed: false })}`;
}

function renderPayload(payload: Record<string, unknown>) {
  harness.token = tokenFor(payload);
  harness.values = [];
  harness.cursor = 0;
  harness.effects = [];
  renderToStaticMarkup(createElement(JwtDecoderClient));
  harness.effects.forEach(effect => effect());
  harness.cursor = 0;
  harness.effects = [];
  return renderToStaticMarkup(createElement(JwtDecoderClient));
}

beforeEach(() => {
  harness.values = [];
  harness.cursor = 0;
  harness.effects = [];
});

describe('JWT standard claims panel', () => {
  it.each([
    ['scalar', 'service-a', 'service-a'],
    ['array', ['service-a', 'service-b'], 'service-a, service-b'],
  ])('renders an %s audience as the only standard claim', (_kind, aud, displayed) => {
    const html = renderPayload({ aud });
    expect(html).toContain('Standard claims');
    expect(html).toContain(`<dt>aud</dt><dd>${displayed}</dd>`);
    expect(html).toContain('This tool only decodes');
  });

  it.each(['iat', 'exp', 'nbf'] as const)('renders %s when its NumericDate is zero', claim => {
    const html = renderPayload({ [claim]: 0 });
    expect(html).toContain('Standard claims');
    expect(html).toMatch(new RegExp(`<dt>${claim}</dt><dd>1970-01-01 00:00:00 UTC`));
    if (claim === 'exp') expect(html).toContain('● Expired');
  });

  it('keeps issuer, subject and positive timestamp claims visible', () => {
    const html = renderPayload({ iss: 'issuer-a', sub: 'subject-a', iat: 1516239022 });
    expect(html).toContain('Standard claims');
    expect(html).toContain('<dt>iss</dt><dd>issuer-a</dd>');
    expect(html).toContain('<dt>sub</dt><dd>subject-a</dd>');
    expect(html).toContain('<dt>iat</dt><dd>2018-01-18 01:30:22 UTC');
  });

  it.each([{}, { name: 'Other data' }])('omits the panel without supported claims', payload => {
    const html = renderPayload(payload);
    expect(html).not.toContain('Standard claims');
    expect(html).toContain('Payload');
    expect(html).toContain('This tool only decodes');
  });
});
