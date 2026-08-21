/** @type {import('next').NextConfig} */
const nextConfig = {
  // '127.0.0.1' covers plain localhost dev; the Tailscale hostname/wildcard
  // covers the toolblip-preview tooling's path-mounted worktree URLs. Without
  // this, Next's dev server refuses the cross-origin HMR websocket handshake
  // (a 502 through nginx) and Turbopack's dev client never completes its
  // bootstrap — the whole app silently never hydrates, not just one component.
  allowedDevOrigins: ['127.0.0.1', 'mx.ewe-ulmer.ts.net', '*.ts.net'],
  // Set only by the local Tailscale-preview tooling (toolblip-workspace's
  // scripts/tailscale-dev), which path-mounts a worktree's dev server at
  // /{slug}/toolblip. No-op — and unset — for every other run (local dev,
  // CI, Railway). Next.js only rewrites next/link, next/router, next/image,
  // and its own generated asset URLs under a basePath; plain fetch() calls
  // to hardcoded absolute paths are not rewritten automatically, which is
  // why lib/sponsors.ts's requests are prefixed with the same public env
  // var below rather than relying on this alone.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
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
      // /advertise (the old house-ad media kit) was replaced by the
      // pay-to-rank Sponsors leaderboard. Never listed in a sitemap, so
      // no other reference needs updating.
      { source: '/advertise', destination: '/sponsors', permanent: true },
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

      // Second family-verification pass (docs/gsc-recovery-plan.md): these
      // slugs all render a component that doesn't do what the slug's own
      // description promises, and in each case a real, different tool
      // elsewhere in the catalog does. json-schema-generator and
      // json-patch-generator both actually render JsonLdGeneratorClient -
      // a byte-for-byte duplicate of the live json-ld-generator page, not a
      // schema/patch tool at all - so both point straight at json-ld-generator
      // rather than at json-schema-validator/json-diff (self-review caught
      // this: an earlier version of this comment sourced its component
      // claims from an orphaned, unimported file instead of the live
      // ToolUI.tsx routing table). json-schema-viewer and json-schema-editor
      // do render the real JsonSchemaValidatorClient, so those two keep
      // json-schema-validator as their target. ImageMetadataRemoverClient
      // just re-downloads the uploaded image unchanged (no EXIF stripping);
      // exif-remover is the real implementation of the exact same feature.
      // TextDifferenceCheckerClient, TextFluencyCheckerClient, and
      // WordComplexityAnalyzerClient are all the generic echo stub.
      // text-difference-checker redirects to code-diff (a real LCS-based
      // line-by-line added/removed/context diff) rather than text-diff,
      // since text-diff's own TextDiffClient only computes a Levenshtein
      // similarity score/edit count with no line highlighting - not what
      // "difference checker" promises either (text-diff's own description
      // mismatch predates this PR and is flagged as follow-up in the docs,
      // not fixed here). text-fluency-checker and word-complexity-analyzer
      // go to readability-score, the real, topically closest tool.
      // favicon-checker promises checking 6 platforms (favicon.ico, Apple
      // Touch, Google SERP, Android manifest, Open Graph) but has no
      // dedicated component at all - it silently fell back to
      // BatchFaviconDownloaderClient; favicon-grabber is the closest real
      // function that component actually has.
      { source: '/tools/json-schema-generator', destination: '/tools/json-ld-generator', permanent: true },
      { source: '/tools/json-schema-viewer', destination: '/tools/json-schema-validator', permanent: true },
      { source: '/tools/json-schema-editor', destination: '/tools/json-schema-validator', permanent: true },
      { source: '/tools/json-patch-generator', destination: '/tools/json-ld-generator', permanent: true },
      { source: '/tools/image-metadata-remover', destination: '/tools/exif-remover', permanent: true },
      { source: '/tools/text-difference-checker', destination: '/tools/code-diff', permanent: true },
      { source: '/tools/text-fluency-checker', destination: '/tools/readability-score', permanent: true },
      { source: '/tools/word-complexity-analyzer', destination: '/tools/readability-score', permanent: true },
      { source: '/tools/favicon-checker', destination: '/tools/favicon-grabber', permanent: true },
      { source: '/tools/sitemap-xml-validator', destination: '/tools/xml-validator', permanent: true },
      // MOBI to AZW3 needed a .mobi upload; Azw3ToMobiClient only accepts
      // .azw3 (it only ever did the reverse direction). No MOBI-accepting
      // ebook converter exists elsewhere to redirect to more precisely.
      { source: '/tools/mobi-to-azw3', destination: '/tools/azw3-to-mobi', permanent: true },

      // Same pass, more real-destination redirects: FakeTextGeneratorClient
      // has no word-combination logic (word-combinations does, and is a
      // real, separate, correctly-working tool). LengthConverterClient only
      // handles length units despite the "length-weight-converter" name
      // promising weight too - all-in-one-unit-converter actually has a
      // weight category. HexToRgbExpressClient/HexToRgbNewClient are both
      // hex-to-rgb only (no reverse direction at all, confirmed by reading
      // the source - neither has an rgbToHex function), so the two
      // "rgb-to-hex-*" aliases pointing at them never worked; rgb-to-hex is
      // the real, dedicated RgbToHexClient. AudioToTextClient is a live-
      // microphone recognizer with no video/URL input path - same as the
      // audio-to-text fix above, redirecting to speech-to-text rather than
      // to a YouTube-transcription feature nothing in the catalog has.
      { source: '/tools/text-combinations-generator', destination: '/tools/word-combinations', permanent: true },
      { source: '/tools/length-weight-converter', destination: '/tools/all-in-one-unit-converter', permanent: true },
      { source: '/tools/rgb-to-hex-express', destination: '/tools/rgb-to-hex', permanent: true },
      { source: '/tools/rgb-to-hex-new', destination: '/tools/rgb-to-hex', permanent: true },
      { source: '/tools/youtube-to-text', destination: '/tools/speech-to-text', permanent: true },

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
      // ip-address-info itself is gone (family-verification pass -
      // RandomIpAddressClient generates addresses, it doesn't look up real
      // geolocation/ISP data, which would need a paid API this project
      // deliberately hasn't integrated). No real lookup tool to redirect
      // to, so this 404s directly instead of chaining through a removed
      // slug.
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
      // css-units-converter itself is gone (family-verification pass -
      // CssValidatorClient validates syntax, it has no px/rem/em unit
      // conversion at all despite the slug's own description promising
      // it, and no real unit-converting component exists to redirect to).
      { source: '/tools/shell-command-generator-new', destination: '/tools/shell-command-generator', permanent: true },
      // image-compression itself is gone (family-verification pass -
      // ImageFlipToolClient flips images, it doesn't compress); redirecting
      // to the real, working image-compressor instead of a bare 404.
      { source: '/tools/image-compression-tool', destination: '/tools/image-compressor', permanent: true },

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

      // Round 4 family-verification pass (docs/gsc-recovery-plan.md): the
      // remaining ~54 shared-component families, all size <=7. Same rule as
      // every prior round - redirect to a real matching tool where one
      // exists, 404 outright where none does.
      // PercentageCalculatorClient has no discount-specific mode at all;
      // discount-calculator is a separate, real, already-correct component
      // - this was a pure duplicate-routing bug, not a missing feature.
      { source: '/tools/percentage-off-calculator', destination: '/tools/discount-calculator', permanent: true },
      // UnitConverterClient only implements length/weight/temperature -
      // volume and speed conversion don't exist in it at all.
      // all-in-one-unit-converter genuinely has both categories.
      { source: '/tools/volume-unit-converter', destination: '/tools/all-in-one-unit-converter', permanent: true },
      { source: '/tools/speed-converter', destination: '/tools/all-in-one-unit-converter', permanent: true },
      { source: '/tools/unit-measurement-converter', destination: '/tools/all-in-one-unit-converter', permanent: true },
      // TextDiffClient only computes a Levenshtein similarity score/edit
      // count - no line highlighting, no JSON-structural comparison, despite
      // both text-diff and json-diff promising exactly that (this was
      // flagged as follow-up work in round 3's own self-review). code-diff
      // is a real LCS-based line-by-line added/removed/context diff -
      // already the established destination for the same mismatch on
      // text-difference-checker in round 3.
      { source: '/tools/text-diff', destination: '/tools/code-diff', permanent: true },
      { source: '/tools/json-diff', destination: '/tools/code-diff', permanent: true },
      // ImageMetadataViewerClient only reads basic File API properties
      // (name/size/type/dimensions) - zero EXIF/IPTC/XMP parsing despite
      // both slugs promising it. exif-remover has a real hand-rolled
      // JPEG/TIFF EXIF tag parser that displays the real tags before
      // stripping them - the closest genuine match in the catalog.
      { source: '/tools/image-metadata-viewer', destination: '/tools/exif-remover', permanent: true },
      { source: '/tools/metadata', destination: '/tools/exif-remover', permanent: true },
      // SyllableCounterClient counts syllables per word only - no
      // Flesch-Kincaid/grade-level calculation despite "estimate reading
      // level" promising one; readability-score-calculator is real.
      { source: '/tools/syllable-word-counter', destination: '/tools/readability-score-calculator', permanent: true },
      // RandomParagraphGeneratorClient generates templated tech-jargon
      // mad-libs sentences with zero actual Latin lorem ipsum text, despite
      // the slug's own description explicitly promising "lorem ipsum text".
      { source: '/tools/random-paragraph-generator', destination: '/tools/lorem-ipsum-paragraphs', permanent: true },
      // SeoMetaTagAnalyzerClient only fetches a URL and scores its existing
      // tags - no generation UI at all, despite "Analyze and generate...
      // with preview" promising one; meta-tag-generator is the real,
      // separate tool that actually does what this slug claims.
      { source: '/tools/seo-tag-analyzer', destination: '/tools/meta-tag-generator', permanent: true },

      // Round 4: verified functionally broken, no real alternative anywhere
      // in the catalog - removed from data/tools.ts with no entry here, so
      // dynamicParams=false 404s them directly (per the plan's own rule:
      // mass redirects to a generic hub read as soft-404s to Google, so a
      // real 404 is the honest signal when nothing real exists to point to).
      // CsvToJsonClient only ever does CSV->JSON regardless of slug; the
      // orphaned candidates for each of these (JsonToGoStructClient,
      // SrtToJsonClient, JsonToPhpArrayClient, JSONToURLEncodedV2Client)
      // were all individually checked and are themselves JSON.parse ->
      // pretty-print stubs, not real implementations.
      // MarkupCalculatorClient/ScryptHashGeneratorClient/
      // WifiQrCodeGeneratorClient/VcardQrGeneratorClient/
      // RegexCheatsheetClient: same pattern, orphaned stub with no real
      // logic for the promised feature (markup pricing math, Scrypt KDF,
      // structured WiFi/vCard payload encoding, static reference content).
      // RobotsTxtEditorClient has no per-URL "is this allowed for Googlebot"
      // testing logic at all - robots-txt-tester and robots-txt-simulator
      // both promise it, nothing in the catalog implements it.
      // AviToGifClient/GifMakerClient: no real animated-GIF encoder exists
      // anywhere in this codebase - GifMakerClient's own canvas.toDataURL(
      // 'image/gif') call is a spec no-op that silently falls back to PNG
      // (the Canvas spec only guarantees image/png support), so even the
      // one dedicated "GIF Maker" tool never actually produced a GIF.
      // AiRephraserClient (ai-rephraser, humanizer-ai) is a hardcoded
      // ~80-word synonym-substitution table with zero API calls anywhere in
      // the codebase - no tone change, no rewriting, and "bypass AI
      // detection" is a flatly false claim, not just an overclaim.
      // ContentSummarizerClient (content-summarizer, summarizer) is
      // trimmed.slice(0, limit) character truncation behind a fake 1s
      // loading spinner - no key-point extraction of any kind.
      // VsdxToDocxClient/VsdxToPptxClient: handleProcess is setOutput(
      // input) - a literal unchanged echo - behind an unfilled placeholder
      // template and a dead "// Visio to Word conversion logic here"
      // comment; no real Visio parser exists anywhere in the codebase.
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://staticimgly.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' blob: https://toolblip-api-production.up.railway.app https://api.toolblip.com https://*.railway.app https://publish.twitter.com https://publish.x.com https://unavatar.io https://staticimgly.com",
              "worker-src 'self' blob: https://staticimgly.com",
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
