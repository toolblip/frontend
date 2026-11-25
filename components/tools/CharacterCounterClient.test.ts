import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import CharacterCounterClient from './CharacterCounterClient';

describe('CharacterCounterClient', () => {
  it('renders the four X presets, none selected, and no limit status by default', () => {
    const html = renderToStaticMarkup(createElement(CharacterCounterClient));
    for (const label of ['X post (280)', 'X bio (160)', 'X display name (50)', 'X username (15)']) {
      expect(html).toContain(label);
    }
    expect(html).not.toContain('aria-pressed="true"');
    expect(html).not.toContain('role="status"');
  });
});
