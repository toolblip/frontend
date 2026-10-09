// Explicit reviewed tools for public discovery, independent of GSC measurements.
export const reviewedToolSlugs = [
  "jwt-decoder",
  "json-formatter",
  "regex-tester",
  "url-encode",
  "base64-encoder-decoder",
  "password-generator",
  "uuid-generator",
  "markdown-to-html",
  "case-converter",
  "word-counter",
  "reading-time-calculator",
  "image-resizer",
  // Wave 2 high-volume cohort (DataForSEO 2026-10-09).
  "qr-code-generator",
  "percentage-calculator",
  "color-picker",
  "character-counter",
  "unit-converter",
  "lorem-ipsum-generator",
  "image-compressor",
  "image-cropper",
  // Wave 2 leftovers + next volume cohort (DataForSEO 2026-10-09).
  "code-diff",
  "unix-timestamp-converter",
  "cron-parser",
  "password-strength-checker",
] as const;
export type ReviewedToolSlug = typeof reviewedToolSlugs[number];
export const reviewedRelatedTools: Record<ReviewedToolSlug, readonly string[]> = {
  "jwt-decoder": [
    "json-formatter",
    "base64-encoder-decoder",
    "url-encode"
  ],
  "json-formatter": [
    "json-tree-view",
    "jwt-decoder",
    "base64-encoder-decoder"
  ],
  "regex-tester": [
    "json-formatter",
    "case-converter",
    "url-encode"
  ],
  "url-encode": [
    "base64-encoder-decoder",
    "jwt-decoder",
    "json-formatter"
  ],
  "base64-encoder-decoder": [
    "jwt-decoder",
    "url-encode",
    "base64-image-converter"
  ],
  "password-generator": [
    "password-strength-checker",
    "uuid-generator"
  ],
  "uuid-generator": [
    "password-generator",
    "jwt-decoder",
    "json-formatter"
  ],
  "markdown-to-html": [
    "word-counter",
    "reading-time-calculator",
    "json-formatter"
  ],
  "case-converter": [
    "word-counter",
    "character-counter",
    "regex-tester"
  ],
  "word-counter": [
    "reading-time-calculator",
    "character-counter",
    "case-converter"
  ],
  "reading-time-calculator": [
    "word-counter",
    "case-converter"
  ],
  "image-resizer": [
    "batch-image-resizer",
    "image-cropper",
    "image-compressor"
  ],
  "qr-code-generator": [
    "image-compressor",
    "image-cropper",
    "image-resizer"
  ],
  "percentage-calculator": [
    "percentage-difference",
    "percentage-change-calc",
    "unit-converter"
  ],
  "color-picker": [
    "contrast-checker",
    "color-palette-generator",
    "color-harmony-generator"
  ],
  "character-counter": [
    "word-counter",
    "case-converter",
    "lorem-ipsum-generator"
  ],
  "unit-converter": [
    "percentage-calculator",
    "byte-converter",
    "unix-timestamp-converter"
  ],
  "lorem-ipsum-generator": [
    "character-counter",
    "word-counter",
    "case-converter"
  ],
  "image-compressor": [
    "image-resizer",
    "image-cropper",
    "image-format-converter"
  ],
  "image-cropper": [
    "image-resizer",
    "image-compressor",
    "batch-image-resizer"
  ],
  "code-diff": [
    "json-formatter",
    "regex-tester",
    "case-converter"
  ],
  "unix-timestamp-converter": [
    "time-zone-converter",
    "unit-converter",
    "cron-parser"
  ],
  "cron-parser": [
    "cron-generator",
    "unix-timestamp-converter",
    "regex-tester"
  ],
  "password-strength-checker": [
    "password-generator",
    "hash-identifier",
    "uuid-generator"
  ]
};
export const publishedTutorialTools = {
  "2026-05-12-how-to-decode-jwt-tokens-safely-in-your-browser": [
    "jwt-decoder",
    "json-formatter"
  ],
  "2026-05-11-format-and-validate-json-online-without-uploading": [
    "json-formatter"
  ],
  "2026-05-16-base64-decode-online-without-uploading": [
    "base64-encoder-decoder"
  ],
  "2026-05-18-generate-secure-passwords-in-the-browser": [
    "password-generator"
  ],
  "2026-05-27-uuid-generator-for-api-testing": [
    "uuid-generator"
  ],
  "2026-07-08-convert-markdown-to-html-online-free": [
    "markdown-to-html"
  ],
  "2026-05-05-regex-lookahead-lookbehind-explained": [
    "regex-tester"
  ]
} as const satisfies Record<string, readonly ReviewedToolSlug[]>;
export type PublishedTutorialSlug = keyof typeof publishedTutorialTools;
