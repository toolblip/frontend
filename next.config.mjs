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

      // Port scanning tools removed: real port scanning of arbitrary hosts
      // requires a backend proxy plus abuse-prevention infra we don't have.
      // Backlink checker removed: real backlink/link-index data requires a
      // paid third-party API (Ahrefs/Moz/Majestic) we don't have.
      { source: '/tools/port-scanner-full', destination: '/tools', permanent: true },
      { source: '/tools/network-port-checker', destination: '/tools', permanent: true },
      { source: '/tools/network-port-scanner', destination: '/tools', permanent: true },
      { source: '/tools/mock-port-scanner-full', destination: '/tools', permanent: true },
      { source: '/tools/backlink-checker-express', destination: '/tools', permanent: true },

      // AI content-generation tools removed: need a paid LLM API (OpenAI/Claude)
      // we don't have wired up server-side yet.
      { source: '/tools/instagram-caption-generator', destination: '/tools', permanent: true },
      { source: '/tools/instagram-story-ideas', destination: '/tools', permanent: true },
      { source: '/tools/landing-page-copy', destination: '/tools', permanent: true },
      { source: '/tools/linkedin-post-generator', destination: '/tools', permanent: true },
      { source: '/tools/listicle-writer', destination: '/tools', permanent: true },
      { source: '/tools/paragraph-completer', destination: '/tools', permanent: true },
      { source: '/tools/paragraph-writer', destination: '/tools', permanent: true },
      { source: '/tools/podcast-writer', destination: '/tools', permanent: true },
      { source: '/tools/post-generator', destination: '/tools', permanent: true },
      { source: '/tools/post-ideas', destination: '/tools', permanent: true },
      { source: '/tools/post-rewriter', destination: '/tools', permanent: true },
      { source: '/tools/post-writer', destination: '/tools', permanent: true },
      { source: '/tools/real-estate-description', destination: '/tools', permanent: true },
      { source: '/tools/story-generator', destination: '/tools', permanent: true },
      { source: '/tools/tiktok-script-writer', destination: '/tools', permanent: true },
      { source: '/tools/title-rewriter', destination: '/tools', permanent: true },
      { source: '/tools/tone-of-voice', destination: '/tools', permanent: true },
      { source: '/tools/trivia-generator', destination: '/tools', permanent: true },
      { source: '/tools/youtube-script-writer', destination: '/tools', permanent: true },
      { source: '/tools/readability-improver', destination: '/tools', permanent: true },
      { source: '/tools/text-improver', destination: '/tools', permanent: true },

      // AI image-editing tools removed: real object removal / background
      // removal / upscaling / watermark removal needs an AI inpainting or
      // super-resolution API (e.g. Replicate) we don't have.
      { source: '/tools/make-background-transparent', destination: '/tools', permanent: true },
      { source: '/tools/remove-objects', destination: '/tools', permanent: true },
      { source: '/tools/remove-person', destination: '/tools', permanent: true },
      { source: '/tools/remove-text-photo', destination: '/tools', permanent: true },
      { source: '/tools/remove-watermark', destination: '/tools', permanent: true },
      { source: '/tools/remove-watermark-photo', destination: '/tools', permanent: true },
      { source: '/tools/repair-defects', destination: '/tools', permanent: true },
      { source: '/tools/upscale', destination: '/tools', permanent: true },

      // AI audio/video transcription+summarization tools removed: need a
      // speech-to-text/LLM API and, for mute, ffmpeg we don't have.
      { source: '/tools/summarize-podcast', destination: '/tools', permanent: true },
      { source: '/tools/summarize-youtube', destination: '/tools', permanent: true },
      { source: '/tools/transcribe-podcast', destination: '/tools', permanent: true },
      { source: '/tools/youtube-transcript', destination: '/tools', permanent: true },
      { source: '/tools/mute', destination: '/tools', permanent: true },

      // Misc tools removed: each needs external data/API or a backend proxy
      // we don't have (WHOIS, headless-browser screenshots, PageSpeed
      // Insights API, plagiarism index, IPA pronunciation dictionary,
      // thesaurus data, CORS-blocked header/webhook inspection, PDF AES
      // encryption which pdf-lib doesn't support).
      { source: '/tools/website-age-checker', destination: '/tools', permanent: true },
      { source: '/tools/screenshot-maker', destination: '/tools', permanent: true },
      { source: '/tools/page-speed-preview', destination: '/tools', permanent: true },
      { source: '/tools/pagespeed-preview', destination: '/tools', permanent: true },
      { source: '/tools/plagiarism-checker', destination: '/tools', permanent: true },
      { source: '/tools/ipa-phonetic-finder', destination: '/tools', permanent: true },
      { source: '/tools/synonym-finder', destination: '/tools', permanent: true },
      { source: '/tools/response-header-analyzer', destination: '/tools', permanent: true },
      { source: '/tools/webhook-tester', destination: '/tools', permanent: true },
      { source: '/tools/protect', destination: '/tools', permanent: true },
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
