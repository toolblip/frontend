import { blogMarkdownUrl, findBlogEntry, renderBlogMarkdown, blogCanonicalUrl } from '@/lib/blog-markdown';
import { getBlogPosts } from '@/lib/blog';

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const entry = findBlogEntry(slug);
  if (!entry) return new Response('Not found', { status: 404 });

  return new Response(renderBlogMarkdown(entry), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex',
      Link: `<${blogCanonicalUrl(entry.slug)}>; rel="canonical", <${blogMarkdownUrl(entry.slug)}>; rel="alternate"; type="text/markdown"`,
    },
  });
}
