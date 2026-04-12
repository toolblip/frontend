import type { NextConfig } from 'next';

const sitemap = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://toolblip.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/', '/admin/'] },
    ],
  },
  changefreq: 'weekly',
  priority: 0.7,
};

export default sitemap;
