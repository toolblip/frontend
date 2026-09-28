import { withSerwist } from '@serwist/turbopack';

import { baseCsp, basePermissions, browserPolicyHeaders } from './lib/browser-policy.mjs';

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
      // Consolidate older articles that cover the same topic under one URL.
      { source: '/blog/optimize-images-without-uploading', destination: '/blog/how-to-optimize-images-without-uploading', permanent: true },
      { source: '/blog/top-5-developer-tools-should-bookmark', destination: '/blog/top-5-developer-tools-you-should-bookmark', permanent: true },
      { source: '/tools/markdown-table-from-json', destination: '/tools/json-to-markdown-table', permanent: true },
      // Stage-1 exact shared-engine consolidations; query parameters are preserved.
      { source: '/tools/hash-from-text', destination: '/tools/sha256-hash-generator', permanent: true },
      { source: '/tools/regex-description-generator', destination: '/tools/regex-explainer', permanent: true },
      { source: '/tools/google-serp-preview', destination: '/tools/serp-preview', permanent: true },
      { source: '/tools/google-serp-simulator', destination: '/tools/serp-preview', permanent: true },
      // Reviewed same-behavior aliases (2026-09-26); Next preserves query parameters.
      { source: '/tools/image-to-base64', destination: '/tools/images/base64-image-converter', permanent: true },
      { source: '/tools/images/image-to-base64', destination: '/tools/images/base64-image-converter', permanent: true },
      { source: '/tools/text-sorter', destination: '/tools/text-line-sorter', permanent: true },
      { source: '/tools/smart-text-sorter', destination: '/tools/text-line-sorter', permanent: true },
      { source: '/tools/serp-simulator', destination: '/tools/serp-preview', permanent: true },
      { source: '/tools/serp-snippet-preview', destination: '/tools/serp-preview', permanent: true },
      { source: '/tools/readability-score-calculator', destination: '/tools/readability-score', permanent: true },
      { source: '/tools/image-size-resizer', destination: '/tools/images/image-resizer', permanent: true },
      { source: '/tools/images/image-size-resizer', destination: '/tools/images/image-resizer', permanent: true },
      { source: '/tools/resize', destination: '/tools/images/image-resizer', permanent: true },
      { source: '/tools/images/resize', destination: '/tools/images/image-resizer', permanent: true },
      { source: '/tools/spelling-checker', destination: '/tools/grammar-checker', permanent: true },
      { source: '/tools/favicon-png-maker', destination: '/tools/images/favicon-generator', permanent: true },
      { source: '/tools/images/favicon-png-maker', destination: '/tools/images/favicon-generator', permanent: true },
      { source: '/tools/favicon-icon-generator', destination: '/tools/images/favicon-generator', permanent: true },
      { source: '/tools/images/favicon-icon-generator', destination: '/tools/images/favicon-generator', permanent: true },
      { source: '/tools/favicon-grabber', destination: '/tools/batch-favicon-downloader', permanent: true },
      { source: '/tools/images/favicon-grabber', destination: '/tools/batch-favicon-downloader', permanent: true },
      { source: '/tools/json-path-evaluator', destination: '/tools/json-path-tester', permanent: true },
      { source: '/tools/json-to-typescript-interface', destination: '/tools/json-to-typescript', permanent: true },
      { source: '/tools/json-to-typescript-types', destination: '/tools/json-to-typescript', permanent: true },
      { source: '/tools/keyword-density-analyzer', destination: '/tools/keyword-density-checker', permanent: true },
      { source: '/tools/random-mac-generator', destination: '/tools/mac-address-generator', permanent: true },
      { source: '/tools/json-escape-unescape', destination: '/tools/backslash-escape-unescape', permanent: true },
      { source: '/tools/image-dimension-checker', destination: '/tools/images/detect', permanent: true },
      { source: '/tools/images/image-dimension-checker', destination: '/tools/images/detect', permanent: true },
      { source: '/tools/rotate', destination: '/tools/images/image-rotate', permanent: true },
      { source: '/tools/images/rotate', destination: '/tools/images/image-rotate', permanent: true },
      { source: '/tools/robots-txt-editor', destination: '/tools/robots-txt-checker', permanent: true },
      { source: '/tools/robots-txt-validator', destination: '/tools/robots-txt-checker', permanent: true },
      { source: '/tools/robots-txt-analyzer', destination: '/tools/robots-txt-checker', permanent: true },
      { source: '/tools/sitemap-extractor', destination: '/tools/sitemap-analyzer', permanent: true },
      { source: '/tools/word-density-analyzer', destination: '/tools/word-frequency-table', permanent: true },
      { source: '/tools/unlock-pdf', destination: '/tools/pdf-password-remover', permanent: true },
      { source: '/tools/pdf/unlock-pdf', destination: '/tools/pdf-password-remover', permanent: true },
      { source: '/tools/jwt-tester', destination: '/tools/jwt-token-tester', permanent: true },
      { source: '/tools/word-combinations', destination: '/tools/word-combinations-generator', permanent: true },
      // Same component and behavior: retire duplicate pages with an HTTP 308.
      { source: '/tools/text-case-converter', destination: '/tools/case-converter', permanent: true },
      { source: '/tools/title-case-converter', destination: '/tools/case-converter', permanent: true },
      { source: '/tools/url-encoder', destination: '/tools/url-encode', permanent: true },
      { source: '/tools/regex-match-tester', destination: '/tools/regex-tester', permanent: true },
      { source: '/tools/regex-pattern-tester', destination: '/tools/regex-tester', permanent: true },
      { source: '/tools/random-password-generator', destination: '/tools/password-generator', permanent: true },
      { source: '/tools/markdown-preview', destination: '/tools/markdown-to-html', permanent: true },
      { source: '/tools/markdown-editor', destination: '/tools/markdown-to-html', permanent: true },
      { source: '/tools/lorem-ipsum-words', destination: '/tools/lorem-ipsum-generator', permanent: true },
      { source: '/tools/jwt-inspector', destination: '/tools/jwt-decoder', permanent: true },
      { source: '/tools/jwt-token-decoder', destination: '/tools/jwt-decoder', permanent: true },
      { source: '/tools/read-time-calculator', destination: '/tools/reading-time-calculator', permanent: true },
      { source: '/tools/reading-pace-calculator', destination: '/tools/reading-time-calculator', permanent: true },
      { source: '/tools/reading-time-estimator', destination: '/tools/reading-time-calculator', permanent: true },
      { source: '/tools/text-statistics-calculator', destination: '/tools/text-statistics', permanent: true },
      { source: '/tools/sla-uptime-calculator', destination: '/tools/uptime-calculator', permanent: true },
      { source: '/tools/general-unit-converter', destination: '/tools/all-in-one-unit-converter', permanent: true },

      { source: '/tools/unblur', destination: '/tools/images/sharpen', permanent: true },
      { source: '/tools/images/unblur', destination: '/tools/images/sharpen', permanent: true },
      { source: '/tools/image-border-adder', destination: '/tools/images/border', permanent: true },
      { source: '/tools/images/image-border-adder', destination: '/tools/images/border', permanent: true },
      // /advertise (the old house-ad media kit) was replaced by the
      // pay-to-rank Sponsors leaderboard. Never listed in a sitemap, so
      // no other reference needs updating.
      { source: '/advertise', destination: '/sponsors', permanent: true },
      // Retired HTTP status reference URLs have no equivalent here:
      // http-status-checker checks URLs, not status-code definitions.

      { source: '/tools/image-orientation-fixer', destination: '/tools/images/image-rotate', permanent: true },
      // "Text to Image Generator" promised social-graphic creation from
      // text; the page rendered the live-microphone speech-to-text tool.
      // banner-generator does what was actually promised (text -> a real
      // downloadable social/OG image).
      { source: '/tools/text-to-image', destination: '/tools/images/banner-generator', permanent: true },
      // The retired audio-to-text page promised uploaded-file transcription;
      // speech-to-text only accepts live microphone input.

      // Second family-verification pass (docs/gsc-recovery-plan.md): these
      // slugs rendered components that did not match their descriptions.
      // json-schema-generator and json-patch-generator rendered JSON-LD
      // markup; neither JSON-LD nor the validator can generate a JSON Schema
      // or JSON Patch. json-schema-viewer and json-schema-editor do render
      // the real JsonSchemaValidatorClient, so those redirects remain.
      // ImageMetadataRemoverClient
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
      // favicon-checker promised checks across six platforms; downloading
      // favicon files does not perform those checks.
      { source: '/tools/json-schema-viewer', destination: '/tools/json-schema-validator', permanent: true },
      { source: '/tools/json-schema-editor', destination: '/tools/json-schema-validator', permanent: true },
      { source: '/tools/image-metadata-remover', destination: '/tools/images/exif-remover', permanent: true },
      { source: '/tools/text-difference-checker', destination: '/tools/code-diff', permanent: true },
      { source: '/tools/text-fluency-checker', destination: '/tools/readability-score', permanent: true },
      { source: '/tools/word-complexity-analyzer', destination: '/tools/readability-score', permanent: true },
      { source: '/tools/sitemap-xml-validator', destination: '/tools/xml-validator', permanent: true },

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
      // microphone recognizer with no video/URL input path. The retired
      // youtube-to-text URL has no matching destination.
      { source: '/tools/text-combinations-generator', destination: '/tools/word-combinations-generator', permanent: true },
      { source: '/tools/length-weight-converter', destination: '/tools/all-in-one-unit-converter', permanent: true },
      // Color format family → one hub (color-format-converter). Pairwise
      // converters and format pickers were the same product under many URLs.
      { source: '/tools/rgb-to-hex-express', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/rgb-to-hex-new', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/rgb-to-hex', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/hex-to-rgb-express', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/hex-to-rgb-new', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/hex-to-rgb', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/hex-to-rgba', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/hex-to-hsl', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/hsl-to-hex', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/hsl-to-rgb', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/hsl-to-rgb-express', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/hsl-to-rgb-new', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/hex-to-hsv', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/hsv-to-hex', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/hex-to-cmyk', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/cmyk-to-rgb', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/cmyk-to-rgb-tool', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/rgba-to-hsl', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/rgba-to-hsl-converter', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/color-format-picker', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/rgb-hsl-color-picker', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/hex-color-picker', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/rgba-color-picker', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/hex-rgb-hsl-color-picker', destination: '/tools/color-format-converter', permanent: true },

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
      { source: '/tools/photo-resize-tool', destination: '/tools/images/photo-resize', permanent: true },
      { source: '/tools/lorem-ipsum-api', destination: '/tools/lorem-ipsum-generator', permanent: true },
      // Catalog duplicates of LoremIpsumGeneratorClient — one canonical tool.
      { source: '/tools/lorem-ipsum', destination: '/tools/lorem-ipsum-generator', permanent: true },
      { source: '/tools/lorem-ipsum-paragraphs', destination: '/tools/lorem-ipsum-generator', permanent: true },
      { source: '/tools/paragraph-lorem-ipsum', destination: '/tools/lorem-ipsum-generator', permanent: true },
      { source: '/tools/sentence-lorem-ipsum', destination: '/tools/lorem-ipsum-generator', permanent: true },
      { source: '/tools/lorem-ipsum-bytes', destination: '/tools/lorem-ipsum-generator', permanent: true },
      { source: '/tools/lorem-ipsum-generator-pro', destination: '/tools/lorem-ipsum-generator', permanent: true },
      { source: '/tools/text-line-deduplicator', destination: '/tools/text-deduplicator', permanent: true },
      { source: '/tools/color-format-converter-v2', destination: '/tools/color-format-converter', permanent: true },
      { source: '/tools/keyword-generator-express', destination: '/tools/keyword-generator', permanent: true },
      { source: '/tools/json-path-evaluator-express', destination: '/tools/json-path-tester', permanent: true },
      { source: '/tools/curl-gen-express', destination: '/tools/curl-gen', permanent: true },
      { source: '/tools/temp-converter-express', destination: '/tools/temp-converter', permanent: true },
      { source: '/tools/word-freq-express', destination: '/tools/word-freq', permanent: true },
      { source: '/tools/html-plaintext-express', destination: '/tools/html-to-plain-text', permanent: true },
      { source: '/tools/html-plaintext', destination: '/tools/html-to-plain-text', permanent: true },
      { source: '/tools/html-to-plain-text-v2', destination: '/tools/html-to-plain-text', permanent: true },
      { source: '/tools/tsv-json-express', destination: '/tools/json-csv-converter', permanent: true },
      { source: '/tools/json-to-yaml', destination: '/tools/json-yaml-converter', permanent: true },
      { source: '/tools/yaml-to-json', destination: '/tools/json-yaml-converter', permanent: true },
      { source: '/tools/yaml-to-json-v2', destination: '/tools/json-yaml-converter', permanent: true },
      { source: '/tools/yaml-json-express', destination: '/tools/json-yaml-converter', permanent: true },
      { source: '/tools/json-to-yaml-v2', destination: '/tools/json-yaml-converter', permanent: true },
      { source: '/tools/json-yaml-express', destination: '/tools/json-yaml-converter', permanent: true },
      { source: '/tools/hex-to-named-color', destination: '/tools/hex-named-color-converter', permanent: true },
      { source: '/tools/named-to-hex', destination: '/tools/hex-named-color-converter', permanent: true },
      { source: '/tools/named-hex-color', destination: '/tools/hex-named-color-converter', permanent: true },
      { source: '/tools/json-to-xml', destination: '/tools/json-xml-converter', permanent: true },
      { source: '/tools/xml-to-json', destination: '/tools/json-xml-converter', permanent: true },
      { source: '/tools/xml-to-json-v2', destination: '/tools/json-xml-converter', permanent: true },
      { source: '/tools/xml-json-express', destination: '/tools/json-xml-converter', permanent: true },
      { source: '/tools/json-to-xml-v2', destination: '/tools/json-xml-converter', permanent: true },
      { source: '/tools/json-xml-express', destination: '/tools/json-xml-converter', permanent: true },
      { source: '/tools/json-to-csv', destination: '/tools/json-csv-converter', permanent: true },
      { source: '/tools/csv-to-json', destination: '/tools/json-csv-converter', permanent: true },
      { source: '/tools/csv-to-json-v2', destination: '/tools/json-csv-converter', permanent: true },
      { source: '/tools/csv-json-express', destination: '/tools/json-csv-converter', permanent: true },
      { source: '/tools/json-to-csv-v2', destination: '/tools/json-csv-converter', permanent: true },
      { source: '/tools/json-csv-express', destination: '/tools/json-csv-converter', permanent: true },
      { source: '/tools/tsv-json', destination: '/tools/json-csv-converter', permanent: true },
      { source: '/tools/tsv-to-json', destination: '/tools/json-csv-converter', permanent: true },
      { source: '/tools/tsv-to-json-v2', destination: '/tools/json-csv-converter', permanent: true },
      { source: '/tools/json-to-tsv', destination: '/tools/json-csv-converter', permanent: true },
      { source: '/tools/csv-to-tsv', destination: '/tools/csv-tsv-converter', permanent: true },
      { source: '/tools/tsv-to-csv', destination: '/tools/csv-tsv-converter', permanent: true },
      { source: '/tools/tsv-to-csv-v2', destination: '/tools/csv-tsv-converter', permanent: true },
      { source: '/tools/csv-to-tsv-v2', destination: '/tools/csv-tsv-converter', permanent: true },
      { source: '/tools/json-to-toml', destination: '/tools/json-toml-converter', permanent: true },
      { source: '/tools/toml-to-json', destination: '/tools/json-toml-converter', permanent: true },
      { source: '/tools/toml-to-json-v2', destination: '/tools/json-toml-converter', permanent: true },
      { source: '/tools/toml-json-converter', destination: '/tools/json-toml-converter', permanent: true },
      { source: '/tools/toml-to-json-converter', destination: '/tools/json-toml-converter', permanent: true },
      { source: '/tools/json-to-toml-converter', destination: '/tools/json-toml-converter', permanent: true },
      { source: '/tools/image-rotate-tool', destination: '/tools/images/image-rotate', permanent: true },
      { source: '/tools/image-flip-tool', destination: '/tools/images/image-flip', permanent: true },
      { source: '/tools/html-to-plain-text-tool', destination: '/tools/html-to-plain-text', permanent: true },
      { source: '/tools/spelling-checker-tool', destination: '/tools/grammar-checker', permanent: true },
      { source: '/tools/keyword-density-analyzer-new', destination: '/tools/keyword-density-checker', permanent: true },
      { source: '/tools/shell-command-generator-new', destination: '/tools/shell-command-generator', permanent: true },
      // image-compression itself is gone (family-verification pass -
      // ImageFlipToolClient flips images, it doesn't compress); redirecting
      // to the real, working image-compressor instead of a bare 404.
      { source: '/tools/image-compression-tool', destination: '/tools/images/image-compressor', permanent: true },

      // Verified byte-for-byte duplicate tool pages (identical component
      // rendered under two slugs) - consolidated onto the canonical slug
      // rather than left as unlinked "Duplicate without user-selected
      // canonical" entries in GSC.
      { source: '/tools/sql-to-json-v2', destination: '/tools/sql-to-json', permanent: true },
      { source: '/tools/regex-pattern-generator-v2', destination: '/tools/regex-pattern-generator', permanent: true },
      { source: '/tools/text-statistics-advanced', destination: '/tools/text-statistics', permanent: true },

      // Retired Visio, GIF/video, HEIC/AVIF, and rank-tracking URLs have
      // no destinations that can perform the named conversions or checks.
      // webp-to-gif also has no match: image-format-converter cannot emit GIF.
      // These two old names match live tools: background removal and domain
      // registration age. The remaining retired names have no close match.
      { source: '/tools/make-background-transparent', destination: '/tools/images/image-background-remover', permanent: true },
      { source: '/tools/website-age-checker', destination: '/tools/domain-age-checker', permanent: true },

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
      { source: '/tools/image-metadata-viewer', destination: '/tools/images/exif-remover', permanent: true },
      { source: '/tools/metadata', destination: '/tools/images/exif-remover', permanent: true },
      // SyllableCounterClient counts syllables per word only - no
      // Flesch-Kincaid/grade-level calculation despite "estimate reading
      // level" promising one; readability-score-calculator is real.
      { source: '/tools/syllable-word-counter', destination: '/tools/readability-score', permanent: true },
      // RandomParagraphGeneratorClient generates templated tech-jargon
      // mad-libs sentences with zero actual Latin lorem ipsum text, despite
      // the slug's own description explicitly promising "lorem ipsum text".
      { source: '/tools/random-paragraph-generator', destination: '/tools/lorem-ipsum-generator', permanent: true },
      // SeoMetaTagAnalyzerClient inspected a URL's existing tags.
      // meta-tag-generator creates tags, so it cannot replace that analysis.

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
        // Service worker + its map must revalidate every time. Long CDN
        // caches (s-maxage) leave browsers on a broken SW after deploys —
        // e.g. sponsor favicon NetworkOnly rules never reached clients.
        source: '/serwist/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
          { key: 'Cloudflare-CDN-Cache-Control', value: 'no-store' },
        ],
      },
      {
        // The AI Remove model files (see MODEL_PUBLIC_PATH in
        // ImageBackgroundRemoverClient.tsx) are content-addressed -
        // hash-named, tied to a specific @imgly/background-removal
        // version - so they never change under this path and are safe
        // to cache forever.
        source: '/models/imgly-bg-removal/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
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
            value: basePermissions,
          },
          {
            key: 'Content-Security-Policy',
            value: baseCsp,
          },
        ],
      },
      ...browserPolicyHeaders,
    ];
  },
};

export default withSerwist(nextConfig);
