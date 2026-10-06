import { BLOG_LLMS_PATH, renderBlogLlmsTxt } from '@/lib/blog-markdown';
import { SITE_ORIGIN } from '@/lib/ai-crawlers';

export const dynamic = 'force-static';

export function GET() {
  return new Response(renderBlogLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      Link: `<${SITE_ORIGIN}${BLOG_LLMS_PATH}>; rel="describedby"`,
    },
  });
}
