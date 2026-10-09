import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RelatedTools, { selectRelatedTools } from '@/components/tools/RelatedTools';
import { getToolBySlug, tools, type Tool } from '@/data/tools';
import { reviewedRelatedTools } from '@/data/reviewed-tools';
import { getToolPath } from '@/lib/tool-path';

function fixture(slug: string, category: string, tags?: string[]): Tool {
  return { name: slug, slug, description: '', emoji: '🔧', category, tags };
}

describe('related tool selection', () => {
  it('keeps each curated list and ignores tag neighbors', () => {
    for (const [slug, targets] of Object.entries(reviewedRelatedTools)) {
      const tool = getToolBySlug(slug)!;
      const selected = selectRelatedTools(tools, { slug, category: tool.category });
      expect(selected.map(item => item.slug)).toEqual([...targets]);
      const html = renderToStaticMarkup(createElement(RelatedTools, { slug, category: tool.category }));
      for (const target of targets) {
        expect(html).toContain(`href="${getToolPath(getToolBySlug(target)!)}"`);
      }
    }
  });

  it('renders nothing when the tool has no tags to share', () => {
    const tool = getToolBySlug('punctuation-fixer')!;
    expect(tool.tags ?? []).toEqual([]);
    expect(selectRelatedTools(tools, { slug: tool.slug, category: tool.category })).toEqual([]);
    expect(renderToStaticMarkup(createElement(RelatedTools, { slug: tool.slug, category: tool.category }))).toBe('');
  });

  it('ranks shared tags, caps at three, and can cross categories', () => {
    const catalog = [
      fixture('cropper', 'Image', ['crop', 'png', 'photo']),
      fixture('trimmer', 'Image', ['crop', 'png', 'photo']),
      fixture('eraser', 'Image', ['png']),
      fixture('remover', 'Photo', ['png', 'photo']),
      fixture('border', 'Image', ['crop']),
      fixture('unrelated', 'Image', ['audio']),
      fixture('tagless', 'Image'),
    ];
    expect(selectRelatedTools(catalog, { slug: 'cropper', category: 'Image' }).map(tool => tool.slug))
      .toEqual(['trimmer', 'remover', 'border']);
  });

  it('links the sass converters by shared tags even though their categories differ', () => {
    const sass = getToolBySlug('sass-to-css')!;
    const selected = selectRelatedTools(tools, { slug: sass.slug, category: sass.category });
    expect(selected.map(tool => tool.slug)).toEqual(['css-to-scss']);
    const html = renderToStaticMarkup(createElement(RelatedTools, { slug: sass.slug, category: sass.category }));
    expect(html).toContain(`href="${getToolPath(getToolBySlug('css-to-scss')!)}"`);
    expect(html).toContain('Related tools');
    expect(html).not.toContain(`Related ${sass.category} tools`);
  });
});
