import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getBlogPosts } from '@/lib/blog';
import { getToolBySlug } from '@/data/tools';
import { getToolPathBySlug } from '@/lib/tool-path';

const root = process.cwd();
const blogSlugs = new Set(getBlogPosts().map((post) => post.slug));

function markdownFiles(directory: string): string[] {
  return fs.readdirSync(path.join(root, directory))
    .filter((name) => /\.mdx?$/.test(name))
    .map((name) => path.join(directory, name));
}

function linkErrors(file: string): string[] {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const errors: string[] = [];
  const links = /\]\(((?:https:\/\/toolblip\.com)?\/(?:blog|tools)\/[a-z0-9/-]+)(?:[?#][^)]*)?\)/g;
  for (const match of source.matchAll(links)) {
    const pathname = new URL(match[1], 'https://toolblip.com').pathname;
    const line = source.slice(0, match.index).split('\n').length;
    if (pathname.startsWith('/blog/')) {
      if (!blogSlugs.has(pathname.slice('/blog/'.length))) errors.push(`${file}:${line} ${pathname}`);
    } else if (pathname !== '/tools/images') {
      const slug = pathname.split('/').at(-1)!;
      const tool = getToolBySlug(slug);
      if (!tool || getToolPathBySlug(tool.slug) !== pathname) errors.push(`${file}:${line} ${pathname}`);
    }
  }
  return errors;
}

describe('published article links', () => {
  it('links directly to existing canonical blog and tool pages', () => {
    const files = [
      ...markdownFiles('content/blog'),
      ...markdownFiles('src/content/blog'),
    ];
    expect(files.flatMap(linkErrors)).toEqual([]);
  });

  it('uses canonical blog URLs in the homepage, blog index, SEO hub, and related reading', () => {
    const files = [
      'app/page.tsx',
      'app/blog/page.tsx',
      'app/seo/page.tsx',
      'app/blog/[slug]/page.tsx',
    ];
    const errors = files.flatMap((file) => {
      const source = fs.readFileSync(path.join(root, file), 'utf8');
      return [...source.matchAll(/\/blog\/([a-z0-9-]+)/g)]
        .filter((match) => !blogSlugs.has(match[1]))
        .map((match) => `${file} /blog/${match[1]}`);
    });
    expect(errors).toEqual([]);
  });
});
