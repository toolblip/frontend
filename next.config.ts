import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Vercel handles output mode automatically
  // No output: 'export' — keeps ISR/SSR capabilities on Vercel

  images: {
    // Allow images from any domain for tool screenshots etc.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  // Security headers applied by Vercel edge
  headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
