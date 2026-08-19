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
      // Family-verification pass (docs/gsc-recovery-plan.md): all three of
      // these render HttpHeadersViewerClient (fetch a URL, show its
      // response headers) but the tool description promises a static HTTP
      // status code reference table - a genuinely different kind of tool
      // this repo never built. http-status-checker is a real, distinct
      // implementation (bulk status checking for a list of URLs) that's at
      // least topically adjacent, so redirecting there rather than to the
      // header viewer or to a generic hub.
      { source: '/tools/http-status-codes', destination: '/tools/http-status-checker', permanent: true },
      { source: '/tools/http-status-code-lookup', destination: '/tools/http-status-checker', permanent: true },
      { source: '/tools/http-status-ref', destination: '/tools/http-status-checker', permanent: true },
      // Same family, same root cause: both promise sending a real request
      // with a chosen method/body/auth; HttpHeadersViewerClient hardcodes a
      // HEAD fetch with no body or method control. No real request-builder
      // implementation exists elsewhere in the catalog to redirect to.
      { source: '/tools/http-request-builder', destination: '/tools/http-headers-viewer', permanent: true },
      { source: '/tools/http-method-tester', destination: '/tools/http-headers-viewer', permanent: true },

      // "Image Clipper" promised background removal, "Image Orientation
      // Fixer" promised rotate/flip - both rendered the plain image
      // cropper instead. Redirecting to the real, separate tools that
      // actually do what each promised.
      { source: '/tools/image-clipper', destination: '/tools/remove-bg', permanent: true },
      { source: '/tools/image-orientation-fixer', destination: '/tools/rotate', permanent: true },
      // "Text to Image Generator" promised social-graphic creation from
      // text; the page rendered the live-microphone speech-to-text tool.
      // banner-generator does what was actually promised (text -> a real
      // downloadable social/OG image).
      { source: '/tools/text-to-image', destination: '/tools/banner-generator', permanent: true },
      // "Audio to Text Converter" promised transcribing an uploaded MP3/WAV
      // file; the page rendered a live-microphone-only speech recognizer,
      // which can't process an uploaded file (no server-side transcription
      // exists here). speech-to-text is the same underlying capability,
      // just honestly scoped to live mic input rather than file upload.
      { source: '/tools/audio-to-text', destination: '/tools/speech-to-text', permanent: true },

      // Verified functionally broken (family-verification pass): the
      // rendered UI only accepts a file type that doesn't match the slug -
      // AviToMovClient only accepts .avi, AacToWavClient only accepts
      // .aac/.m4a/.mp4. No equivalent tool exists to redirect to (real
      // cross-container video/audio transcoding needs WebCodecs/ffmpeg.wasm,
      // deliberately not built here - see TODO-SERVER-SIDE-TOOLS.md), so
      // these are simply removed from data/tools.ts rather than redirected.
      // A real 410 (rather than the plain 404 dynamicParams=false produces)
      // was attempted via proxy.ts but reverted - see docs/gsc-recovery-plan.md
      // for why (the proxy/middleware layer doesn't execute in this project
      // at all right now, a separate pre-existing bug).

      // Legacy keyword-stuffed slugs ("-express", "-tool", "-new", "-v2", ...)
      // renamed to a clean canonical slug as part of the GSC index-recovery
      // work (see reports on toolblip.com's site-level "Crawled - currently
      // not indexed" verdict). Same tool, same component - only the URL and
      // the canonical slug changed, so this is a pure 301/308, not a removal.
      { source: '/tools/photo-resize-tool', destination: '/tools/photo-resize', permanent: true },
      { source: '/tools/lorem-ipsum-api', destination: '/tools/lorem-ipsum', permanent: true },
      { source: '/tools/color-format-converter-v2', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/keyword-generator-express', destination: '/tools/keyword-generator', permanent: true },
      { source: '/tools/json-path-evaluator-express', destination: '/tools/json-path-evaluator', permanent: true },
      { source: '/tools/curl-gen-express', destination: '/tools/curl-gen', permanent: true },
      { source: '/tools/temp-converter-express', destination: '/tools/temp-converter', permanent: true },
      { source: '/tools/ip-address-info-express', destination: '/tools/ip-address-info', permanent: true },
      { source: '/tools/word-freq-express', destination: '/tools/word-freq', permanent: true },
      { source: '/tools/html-plaintext-express', destination: '/tools/html-plaintext', permanent: true },
      { source: '/tools/tsv-json-express', destination: '/tools/tsv-json', permanent: true },
      { source: '/tools/image-rotate-tool', destination: '/tools/image-rotate', permanent: true },
      { source: '/tools/image-flip-tool', destination: '/tools/image-flip', permanent: true },
      { source: '/tools/html-to-plain-text-tool', destination: '/tools/html-to-plain-text', permanent: true },
      { source: '/tools/spelling-checker-tool', destination: '/tools/spelling-checker', permanent: true },
      // No longer redirected to /tools/favicon-preview: the family-
      // verification pass below removed that slug too (no real ICO/favicon
      // preview implementation exists), so this now 404s directly instead
      // of redirecting into another 404.
      { source: '/tools/jsonpath-query-tool', destination: '/tools/jsonpath-query', permanent: true },
      { source: '/tools/keyword-density-analyzer-new', destination: '/tools/keyword-density-analyzer', permanent: true },
      { source: '/tools/css-units-converter-new', destination: '/tools/css-units-converter', permanent: true },
      { source: '/tools/shell-command-generator-new', destination: '/tools/shell-command-generator', permanent: true },
      { source: '/tools/image-compression-tool', destination: '/tools/image-compression', permanent: true },

      // Verified byte-for-byte duplicate tool pages (identical component
      // rendered under two slugs) - consolidated onto the canonical slug
      // rather than left as unlinked "Duplicate without user-selected
      // canonical" entries in GSC.
      { source: '/tools/sql-to-json-v2', destination: '/tools/sql-to-json', permanent: true },
      { source: '/tools/regex-pattern-generator-v2', destination: '/tools/regex-pattern-generator', permanent: true },
      { source: '/tools/text-statistics-advanced', destination: '/tools/text-statistics', permanent: true },

      // Verified functionally broken: the rendered UI only accepts a file
      // type that doesn't match what the slug promises (e.g. an EPS
      // uploader on a Visio-to-JPG page). No real implementation exists for
      // these formats yet - redirecting to the closest genuine equivalent
      // per the "fix it or remove it, never fabricate" rule already used
      // elsewhere in this file, rather than leaving a mislabeled tool live.
      { source: '/tools/vsd-to-jpg', destination: '/tools/image-format-converter', permanent: true },
      { source: '/tools/vsdx-to-jpg', destination: '/tools/image-format-converter', permanent: true },
      { source: '/tools/vsd-to-pdf', destination: '/tools/excel-to-pdf', permanent: true },
      { source: '/tools/vsdx-to-pdf', destination: '/tools/excel-to-pdf', permanent: true },
      { source: '/tools/mp4-to-avi', destination: '/tools/avi-to-mov', permanent: true },
      { source: '/tools/webp-to-gif', destination: '/tools/image-format-converter', permanent: true },
      { source: '/tools/json-to-tsv', destination: '/tools/json-to-csv', permanent: true },

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
