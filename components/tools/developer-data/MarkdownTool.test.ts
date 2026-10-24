// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import MarkdownTool from './MarkdownTool';

describe('MarkdownTool server render', () => {
  it('renders without a DOMParser error so hydration matches', () => {
    const html = renderToString(createElement(MarkdownTool));
    expect(html).not.toContain('DOMParser');
    expect(html).not.toContain('tb-v2-error');
  });
});
