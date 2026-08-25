import { MetadataRoute } from 'next';

// Split into three sitemaps (core/tools/blog) instead of one combined
// sitemap.xml so Search Console's per-sitemap indexed/discovered counts
// show whether the tool corpus or the blog is recovering independently —
// see the GSC index-recovery plan for why that split matters here.
// Declare the sitemap index only. Google fetches child sitemaps from the
// index; listing both the index and the children duplicates the same URL
// sets and muddies per-sitemap indexed/discovered counts in Search Console.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://toolblip.com/sitemap.xml',
  };
}