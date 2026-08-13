/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      // These tool pages were removed: they only shipped as non-functional
      // stubs or fabricated-data placeholders and would need paid third-party
      // APIs (WHOIS, backlink/rank data) or heavy video-codec infra (ffmpeg.wasm,
      // requiring site-wide COOP/COEP headers) to become real. Redirecting to a
      // working equivalent (or the directory) rather than 404ing.
      { source: '/tools/gif-to-avif', destination: '/tools/gif-to-png', permanent: true },
      { source: '/tools/gif-to-mov', destination: '/tools/gif-to-png', permanent: true },
      { source: '/tools/gif-to-webm', destination: '/tools/gif-to-png', permanent: true },
      { source: '/tools/gif-to-mp4', destination: '/tools/gif-to-png', permanent: true },
      { source: '/tools/heic-to-avif', destination: '/tools/heic-to-jpg', permanent: true },
      { source: '/tools/google-rank-checker', destination: '/tools/google-serp-simulator', permanent: true },
      { source: '/tools/whois-lookup', destination: '/tools', permanent: true },
      { source: '/tools/whois-lookup-v2', destination: '/tools', permanent: true },
      { source: '/tools/backlink-analyzer', destination: '/tools', permanent: true },
      { source: '/tools/serp-rank-tracker', destination: '/tools/google-serp-simulator', permanent: true },
      { source: '/tools/keyword-position-checker', destination: '/tools/google-serp-simulator', permanent: true },
      { source: '/tools/compress-avi', destination: '/tools', permanent: true },
      { source: '/tools/compress-mkv', destination: '/tools', permanent: true },
      { source: '/tools/compress-mov', destination: '/tools', permanent: true },
      { source: '/tools/mkv-to-avi', destination: '/tools', permanent: true },
      { source: '/tools/mkv-to-mov', destination: '/tools', permanent: true },
      { source: '/tools/mkv-to-mp4', destination: '/tools', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/dashboard',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://toolblip-api-production.up.railway.app https://api.toolblip.com https://*.railway.app https://publish.twitter.com https://publish.x.com https://unavatar.io",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
