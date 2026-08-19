import { MetadataRoute } from 'next';

// Split into three sitemaps (core/tools/blog) instead of one combined
// sitemap.xml so Search Console's per-sitemap indexed/discovered counts
// show whether the tool corpus or the blog is recovering independently —
// see the GSC index-recovery plan for why that split matters here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      'https://toolblip.com/sitemap-core.xml',
      'https://toolblip.com/sitemap-tools.xml',
      'https://toolblip.com/sitemap-blog.xml',
    ],
  };
}