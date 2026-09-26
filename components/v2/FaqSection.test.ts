import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import FaqSection from './FaqSection';

describe('FAQ structured data serialization', () => {
  it('keeps closing script text inside JSON while preserving the FAQ content', () => {
    const q = 'How do I embed <script> tags?';
    const a = 'Paste <script type="application/ld+json">...</script><script>alert(1)</script>.';
    const html = renderToStaticMarkup(createElement(FaqSection, { toolName: 'Schema', faqs: [{ q, a }], emitSchema: true }));
    expect(html.match(/<script\b/g)).toHaveLength(1);
    expect(html.match(/<\/script>/g)).toHaveLength(1);
    const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1];
    expect(json).not.toContain('<');
    const data = JSON.parse(json);
    expect(data.mainEntity[0].name).toBe(q);
    expect(data.mainEntity[0].acceptedAnswer.text).toBe(a);
  });
  it('does not emit schema for category templates', () => {
    const html = renderToStaticMarkup(createElement(FaqSection, { toolName: 'Example', faqs: [{ q: 'Question', a: 'Answer' }], emitSchema: false }));
    expect(html).not.toContain('<script');
    expect(html).toContain('Answer');
  });
});
