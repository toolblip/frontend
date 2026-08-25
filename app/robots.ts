import { MetadataRoute } from 'next';

// Child sitemaps live at sitemap-core/tools/blog.xml (for GSC per-corpus
// counts). robots.txt only declares the sitemap index so Google discovers
// children once via the index — see docs/gsc-recovery-plan.md.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://toolblip.com/sitemap.xml',
  };
}
