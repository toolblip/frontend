import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RelatedBlogPosts, { selectRelatedBlogPosts } from '@/components/tools/RelatedBlogPosts';
import { getBlogPosts, type BlogPost } from '@/lib/blog';
import { getToolBySlug } from '@/data/tools';
import { reviewedToolSlugs } from '@/data/reviewed-tools';

const priorityTutorials: Record<string, string[]> = {
  'jwt-decoder': ['2026-05-12-how-to-decode-jwt-tokens-safely-in-your-browser', 'jwt-decoder-guide', '2026-04-23-debug-jwt-tokens-base64-json-browser'],
  'json-formatter': ['2026-05-11-format-and-validate-json-online-without-uploading', 'json-formatter-guide', 'online-json-formatter-vs-browser-extension-security'],
  'regex-tester': ['2026-05-13-how-to-test-regular-expressions-online-with-sample-text', 'regex-tester-guide', '2026-05-05-regex-lookahead-lookbehind-explained'],
  'url-encode': ['2026-05-21-url-encode-decode-strings-api-testing', '2026-04-25-url-encoding-api-bugs'],
  'base64-encoder-decoder': ['2026-05-16-base64-decode-online-without-uploading', '2026-04-28-base64-encoding-decoding-complete-developer-guide', 'base64-encoding-explained'],
  'password-generator': ['2026-05-18-generate-secure-passwords-in-the-browser'],
  'uuid-generator': ['2026-05-27-uuid-generator-for-api-testing', 'uuid-v4-generator-online', 'uuid-versions-guide'],
  'markdown-to-html': ['2026-07-08-convert-markdown-to-html-online-free', 'markdown-to-html-guide'],
  'case-converter': ['text-utilities-cheatsheet-developers'],
  'word-counter': ['text-utilities-cheatsheet-developers', 'social-media-character-limits'],
  'reading-time-calculator': [],
  'image-resizer': ['2026-08-04-resize-image-for-social-media-dimensions', 'how-to-optimize-images-without-uploading', 'image-conversion-optimization-guide'],
  'qr-code-generator': [],
  'percentage-calculator': [],
  'color-picker': [],
  'character-counter': ['social-media-character-limits', 'text-utilities-cheatsheet-developers'],
  'unit-converter': [],
  'lorem-ipsum-generator': [],
  'image-compressor': ['how-to-optimize-images-without-uploading', 'image-conversion-optimization-guide'],
  'image-cropper': ['2026-08-04-resize-image-for-social-media-dimensions', 'how-to-optimize-images-without-uploading'],
  'code-diff': [],
  'unix-timestamp-converter': ['unix-timestamp-converter'],
  'cron-parser': ['cron-expressions-explained', 'how-to-use-cron-expression-generator'],
  'password-strength-checker': [],
  'random-number-generator': [],
  'age-calculator': [],
  'tip-calculator': [],
  'morse-code-translator': [],
  'roman-numeral-converter': [],
};

function renderToolPosts(slug: string) {
  const tool = getToolBySlug(slug)!;
  return renderToStaticMarkup(createElement(RelatedBlogPosts, {
    toolSlug: tool.slug,
    toolName: tool.name,
    category: tool.category,
    tags: tool.tags,
  }));
}

describe('reviewed tool blog links', () => {
  it('renders only the vetted, published tutorials in order on every priority tool', () => {
    const published = new Set(getBlogPosts().map(post => post.slug));
    expect(Object.keys(priorityTutorials).sort()).toEqual([...reviewedToolSlugs].sort());
    for (const slug of reviewedToolSlugs) {
      const expected = priorityTutorials[slug];
      for (const tutorial of expected) expect(published.has(tutorial), `${tutorial} must be published`).toBe(true);
      const html = renderToolPosts(slug);
      const hrefs = [...html.matchAll(/href="(\/blog\/[^\"]+)"/g)].map(match => match[1]);
      expect(hrefs, slug).toEqual(expected.map(tutorial => `/blog/${tutorial}`));
      expect(new Set(hrefs).size).toBe(hrefs.length);
      expect(hrefs.length).toBeLessThanOrEqual(3);
    }
  });

  it('excludes unrelated category articles and shows a single relevant tutorial', () => {
    const posts = getBlogPosts();
    const password = getToolBySlug('password-generator')!;
    const selected = selectRelatedBlogPosts(posts, {
      toolSlug: password.slug,
      toolName: password.name,
      category: password.category,
      tags: password.tags,
    });
    expect(selected.map(post => post.slug)).toEqual(['2026-05-18-generate-secure-passwords-in-the-browser']);
    expect(renderToolPosts('password-generator')).toContain('href="/blog/2026-05-18-generate-secure-passwords-in-the-browser"');
    expect(renderToolPosts('password-generator')).not.toContain('complementary-and-triadic-color-scheme-generator');
    expect(renderToolPosts('uuid-generator')).not.toContain('complementary-and-triadic-color-scheme-generator');
    expect(renderToolPosts('reading-time-calculator')).toBe('');
  });

  it('skips unpublished entries safely, deduplicates, and caps the output at three', () => {
    const posts = getBlogPosts();
    const json = getToolBySlug('json-formatter')!;
    const selection = (available: BlogPost[]) => selectRelatedBlogPosts(available, {
      toolSlug: json.slug,
      toolName: json.name,
      category: json.category,
      tags: json.tags,
    });
    expect(selection(posts).map(post => post.slug)).toEqual(priorityTutorials['json-formatter']);
    expect(selection(posts.filter(post => post.slug === priorityTutorials['json-formatter'][0])).map(post => post.slug))
      .toEqual([priorityTutorials['json-formatter'][0]]);
    expect(selection([])).toEqual([]);
    expect(selection(posts.filter(post => !priorityTutorials['json-formatter'].includes(post.slug))).map(post => post.slug))
      .toEqual(['2026-05-12-how-to-decode-jwt-tokens-safely-in-your-browser']);
    expect(selection([...posts, ...posts]).map(post => post.slug)).toEqual(priorityTutorials['json-formatter']);
  });

  it('omits category-only matches and still renders one strong title match', () => {
    const tool = getToolBySlug('color-mixer')!;
    const categoryOnly: BlogPost = {
      slug: 'palette-roundup',
      title: 'Palette ideas for interface work',
      description: '',
      date: '2026-08-01T00:00:00.000Z',
      category: tool.category,
      tags: ['design'],
      author: 'Toolblip Team',
      readingTime: '4 min',
      emoji: '🎨',
    };
    const strong: BlogPost = {
      slug: 'how-a-color-mixer-works',
      title: 'How a color mixer blends two hues',
      description: '',
      date: '2026-08-02T00:00:00.000Z',
      category: 'SEO',
      tags: [],
      author: 'Toolblip Team',
      readingTime: '4 min',
      emoji: '🎨',
    };
    const props = {
      toolSlug: tool.slug,
      toolName: tool.name,
      category: tool.category,
      tags: tool.tags,
    };
    expect(selectRelatedBlogPosts([categoryOnly], props)).toEqual([]);
    expect(selectRelatedBlogPosts([categoryOnly, strong], props).map(post => post.slug)).toEqual([strong.slug]);
    const html = renderToStaticMarkup(createElement(RelatedBlogPosts, { ...props, posts: [strong] }));
    expect(html).toContain('href="/blog/how-a-color-mixer-works"');
    expect(html).toContain('Related Blog Posts');
    expect(renderToStaticMarkup(createElement(RelatedBlogPosts, { ...props, posts: [categoryOnly] }))).toBe('');
  });

  it('caps uncurated posts at three and prefers the stronger overlap', () => {
    const tool = getToolBySlug('color-mixer')!;
    const make = (slug: string, title: string, date: string): BlogPost => ({
      slug,
      title,
      description: '',
      date,
      category: 'Color',
      tags: [],
      author: 'Toolblip Team',
      readingTime: '3 min',
      emoji: '🎨',
    });
    const selected = selectRelatedBlogPosts([
      make('weak-older', 'A note about color', '2026-01-01T00:00:00.000Z'),
      make('strong-older', 'Color mixer calibration notes', '2026-02-01T00:00:00.000Z'),
      make('weak-newer', 'Another color swatch', '2026-06-01T00:00:00.000Z'),
      make('strong-newer', 'Color mixer shortcuts', '2026-05-01T00:00:00.000Z'),
    ], {
      toolSlug: tool.slug,
      toolName: tool.name,
      category: tool.category,
      tags: tool.tags,
    });
    expect(selected.map(post => post.slug)).toEqual(['strong-newer', 'strong-older', 'weak-newer']);
  });

  it('ignores generic convert tokens from stuffed tags', () => {
    const selected = selectRelatedBlogPosts([
      {
        slug: 'markdown-convert',
        title: 'Convert Markdown to HTML Online Free in the Browser',
        description: '',
        date: '2026-07-08T00:00:00.000Z',
        category: 'Developer Tools',
        tags: ['markdown to html converter'],
        author: 'Toolblip Team',
        readingTime: '5 min',
        emoji: '📝',
      },
      {
        slug: 'compile-sass',
        title: 'Compile Sass to CSS in the browser',
        description: '',
        date: '2026-06-01T00:00:00.000Z',
        category: 'Developer Tools',
        tags: ['scss'],
        author: 'Toolblip Team',
        readingTime: '5 min',
        emoji: '📝',
      },
    ], {
      toolSlug: 'sass-to-css',
      toolName: 'Sass to CSS',
      category: 'CSS',
      tags: ['convert sass to css', 'sass converter'],
    });
    expect(selected.map(post => post.slug)).toEqual(['compile-sass']);
  });

  it('shows only the published image guide for favicon generator', () => {
    const tool = getToolBySlug('favicon-generator')!;
    const posts = getBlogPosts();
    const guide = 'image-conversion-optimization-guide';
    expect(posts.some(post => post.slug === guide)).toBe(true);
    expect(selectRelatedBlogPosts(posts, {
      toolSlug: tool.slug,
      toolName: tool.name,
      category: tool.category,
      tags: tool.tags,
    }).map(post => post.slug)).toEqual([guide]);
    const html = renderToolPosts(tool.slug);
    expect([...html.matchAll(/href="(\/blog\/[^\"]+)"/g)].map(match => match[1]))
      .toEqual([`/blog/${guide}`]);
  });

  it('omits favicon posts when its guide is unavailable instead of adding category matches', () => {
    const tool = getToolBySlug('favicon-generator')!;
    expect(selectRelatedBlogPosts(getBlogPosts().filter(post => post.slug !== 'image-conversion-optimization-guide'), {
      toolSlug: tool.slug,
      toolName: tool.name,
      category: tool.category,
      tags: tool.tags,
    })).toEqual([]);
  });

  it('omits the SERP preview section when no relevant tutorial is published', () => {
    const tool = getToolBySlug('serp-preview')!;
    expect(selectRelatedBlogPosts(getBlogPosts(), {
      toolSlug: tool.slug,
      toolName: tool.name,
      category: tool.category,
      tags: tool.tags,
    })).toEqual([]);
    expect(renderToolPosts(tool.slug)).toBe('');
  });
});
