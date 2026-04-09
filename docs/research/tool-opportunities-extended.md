# Tool Opportunities Extended  -  April 2026
*Research compiled: April 7, 2026. Builds on market-analysis-2026.md, build-plan-2026.md, competitor-deep-dive-2026.md.*

All tools listed here are 100% client-side  -  no server required. Estimated search volumes are global monthly figures from Semrush/Ahrefs data as of early 2026. KD = Keyword Difficulty (0-100 scale). Tools already in the launch set (first 10) are marked accordingly.

---

## How to Read This Document

- **KD 0-20** = Low competition. New domain can rank in 3-6 months with good on-page SEO.
- **KD 21-40** = Medium competition. Rankable in 6-12 months with topical authority built up.
- **KD 41+** = High competition. Requires strong domain authority or a long-tail angle. Build for completeness and cross-linking, not primary acquisition.
- **Browser API / Library** = the primary implementation method.

---

## SECTION 1  -  LOW COMPETITION (KD 0-20)

### 1A. Image Tools  -  Low Competition

| # | Tool Name | URL Slug | Est. Monthly Searches | KD | Client-Side Only | Browser API / Library |
|---|---|---|---|---|---|---|
| 1 | Convert WebP to JPG | `/tools/webp-to-jpg` | 200K-400K | 18 | Yes | Canvas API (`drawImage` + `toBlob('image/jpeg')`) |
| 2 | Convert HEIC to JPG | `/tools/heic-to-jpg` | 300K-600K | 20 | Yes | `heic2any` JS library (pure JS, no WASM required for most files) |
| 3 | Convert SVG to PNG | `/tools/svg-to-png` | 150K-300K | 14 | Yes | Canvas API (`drawImage` on SVG `Image` element) |
| 4 | Add Watermark to Image | `/tools/add-watermark-to-image` | 80K-150K | 12 | Yes | Canvas API (`fillText` or `drawImage` overlay) |
| 5 | Rotate Image Online | `/tools/rotate-image` | 100K-200K | 10 | Yes | Canvas API (transform + rotate matrix) |
| 6 | Flip Image Online | `/tools/flip-image` | 60K-120K | 9 | Yes | Canvas API (`scale(-1, 1)` or `scale(1, -1)`) |
| 7 | Image to Base64 | `/tools/image-to-base64` | 100K-200K | 14 | Yes | `FileReader.readAsDataURL()` |
| 8 | Convert PNG to WebP | `/tools/png-to-webp` | 80K-150K | 16 | Yes | Canvas API (`toBlob('image/webp')`) |
| 9 | Add Border to Image | `/tools/add-border-to-image` | 40K-80K | 8 | Yes | Canvas API (draw rect border around image) |
| 10 | Round Image Corners | `/tools/round-image-corners` | 30K-60K | 7 | Yes | Canvas API (`clip()` with rounded `rect` path) |
| 11 | Convert Image to Grayscale | `/tools/image-to-grayscale` | 50K-100K | 9 | Yes | Canvas API (`getImageData` + desaturate pixels) |
| 12 | Extract Colors from Image | `/tools/extract-colors-from-image` | 40K-80K | 10 | Yes | Canvas API `getImageData` + color quantization (color-thief.js) |
| 13 | Passport / Visa Photo Crop | `/tools/passport-photo-maker` | 90K-180K | 16 | Yes | Canvas API + Cropper.js with preset aspect ratios |
| 14 | Remove Image Background | `/tools/remove-background` | 600K-1.2M | 20 | Yes | `@imgly/background-removal` (WASM + ONNX ML model, fully browser-side) |
| 15 | Image Compress Online | `/tools/compress-image` | 800K-1.5M | 20 | Yes | `browser-image-compression` (pure JS); Squoosh WASM codecs for better quality |

### 1B. PDF Tools  -  Low Competition

| # | Tool Name | URL Slug | Est. Monthly Searches | KD | Client-Side Only | Browser API / Library |
|---|---|---|---|---|---|---|
| 16 | Rotate PDF | `/tools/rotate-pdf` | 200K-400K | 20 | Yes | `pdf-lib` (pure JS) |
| 17 | Add Page Numbers to PDF | `/tools/add-page-numbers-to-pdf` | 50K-100K | 10 | Yes | `pdf-lib` |
| 18 | PDF to Image (PNG/JPG) | `/tools/pdf-to-image` | 400K-800K | 20 | Yes | `PDF.js` (`renderPage` to Canvas, then `toBlob`) |
| 19 | Image to PDF | `/tools/image-to-pdf` | 300K-600K | 18 | Yes | `pdf-lib` (`embedJpg` / `embedPng`, create page sized to image) |
| 20 | Extract Text from PDF | `/tools/extract-text-from-pdf` | 80K-150K | 14 | Yes | `PDF.js` (text layer extraction) |
| 21 | PDF to Grayscale | `/tools/pdf-to-grayscale` | 20K-40K | 8 | Yes | `pdf-lib` + `PDF.js` render-to-canvas → desaturate → re-embed |

### 1C. Text Tools  -  Low Competition

| # | Tool Name | URL Slug | Est. Monthly Searches | KD | Client-Side Only | Browser API / Library |
|---|---|---|---|---|---|---|
| 22 | Remove Duplicate Lines | `/tools/remove-duplicate-lines` | 80K-150K | 10 | Yes | Pure JS (`Set`, `Map`) |
| 23 | Sort Lines | `/tools/sort-lines` | 50K-100K | 8 | Yes | Pure JS (`.sort()`) |
| 24 | Reverse Text | `/tools/reverse-text` | 60K-120K | 9 | Yes | Pure JS (`.split('').reverse().join('')`) |
| 25 | Case Converter | `/tools/case-converter` | 200K-400K | 15 | Yes | Pure JS (string manipulation) |
| 26 | Slug Generator | `/tools/slug-generator` | 40K-80K | 10 | Yes | Pure JS (`replace` + `toLowerCase`) |
| 27 | Remove Extra Spaces (Whitespace Remover) | `/tools/remove-extra-spaces` | 50K-100K | 8 | Yes | Pure JS (`.replace(/\s+/g, ' ').trim()`) |
| 28 | Line Count Tool | `/tools/line-counter` | 30K-60K | 7 | Yes | Pure JS (`.split('\n').length`) |
| 29 | Lorem Ipsum Generator | `/tools/lorem-ipsum-generator` | 300K-600K | 15 | Yes | Pure JS (static word bank, randomized paragraphs) |
| 30 | Find and Replace Online | `/tools/find-and-replace` | 60K-120K | 12 | Yes | Pure JS (`str.replaceAll()` or regex `replace`) |
| 31 | Text Diff / Compare Text | `/tools/text-diff` | 150K-300K | 15 | Yes | `diff` npm library (Myers diff algorithm, pure JS) |
| 32 | Markdown to HTML | `/tools/markdown-to-html` | 100K-200K | 15 | Yes | `marked` npm library + `DOMPurify` for XSS sanitization |

### 1D. Developer Tools  -  Low Competition

| # | Tool Name | URL Slug | Est. Monthly Searches | KD | Client-Side Only | Browser API / Library |
|---|---|---|---|---|---|---|
| 33 | Base64 Encode / Decode | `/tools/base64` | 700K-1.4M | 15 | Yes | `btoa()` / `atob()` for text; `FileReader.readAsDataURL()` for files |
| 34 | URL Encode / Decode | `/tools/url-encode-decode` | 600K combined | 18 | Yes | `encodeURIComponent()` / `decodeURIComponent()` |
| 35 | UUID Generator | `/tools/uuid-generator` | 200K-400K | 15 | Yes | `crypto.randomUUID()` (Web Crypto API) |
| 36 | JWT Decoder | `/tools/jwt-decoder` | 100K-200K | 14 | Yes | Pure JS (base64url decode of header + payload segments) |
| 37 | Cron Expression Explainer | `/tools/cron-parser` | 80K-150K | 12 | Yes | `cronstrue` npm library (pure JS) |
| 38 | Hash Generator (MD5/SHA) | `/tools/hash-generator` | 150K-300K | 14 | Yes | Web Crypto API (`crypto.subtle.digest('SHA-256', ...)`) for SHA; `spark-md5` for MD5 |
| 39 | Unix Timestamp Converter | `/tools/unix-timestamp-converter` | 100K-200K | 12 | Yes | Pure JS (`new Date(ts * 1000).toISOString()`) |
| 40 | CSV to JSON | `/tools/csv-to-json` | 150K-300K | 14 | Yes | Pure JS or `papaparse` npm library |
| 41 | JSON to CSV | `/tools/json-to-csv` | 100K-200K | 13 | Yes | Pure JS or `papaparse` |
| 42 | YAML to JSON | `/tools/yaml-to-json` | 50K-100K | 12 | Yes | `js-yaml` npm library (pure JS) |
| 43 | JSON to YAML | `/tools/json-to-yaml` | 40K-80K | 11 | Yes | `js-yaml` |
| 44 | HTML to Markdown | `/tools/html-to-markdown` | 60K-120K | 12 | Yes | `turndown` npm library (pure JS) |
| 45 | Htpasswd Generator | `/tools/htpasswd-generator` | 30K-60K | 8 | Yes | Web Crypto API (bcrypt via `bcryptjs` pure-JS port) |
| 46 | Color Hex to RGB / HSL | `/tools/hex-to-rgb` | 150K-300K | 14 | Yes | Pure JS (bitwise extraction from hex string) |
| 47 | Contrast Checker (WCAG) | `/tools/contrast-checker` | 60K-120K | 12 | Yes | Pure JS (WCAG relative luminance formula) |
| 48 | HTML Entities Encode / Decode | `/tools/html-entities` | 50K-100K | 10 | Yes | Pure JS (`DOMParser` or manual entity map) |
| 49 | XML to JSON | `/tools/xml-to-json` | 80K-150K | 14 | Yes | `fast-xml-parser` npm library (pure JS) |
| 50 | Morse Code Translator | `/tools/morse-code` | 60K-120K | 9 | Yes | Pure JS (static lookup map) |

### 1E. Math / Number Tools  -  Low Competition

| # | Tool Name | URL Slug | Est. Monthly Searches | KD | Client-Side Only | Browser API / Library |
|---|---|---|---|---|---|---|
| 51 | Percentage Calculator | `/tools/percentage-calculator` | 800K-1.5M | 18 | Yes | Pure JS |
| 52 | Age Calculator | `/tools/age-calculator` | 600K-1.2M | 18 | Yes | Pure JS (`Date` arithmetic) |
| 53 | Date Difference Calculator | `/tools/date-difference-calculator` | 200K-400K | 16 | Yes | Pure JS (`Date` arithmetic + day/month/year breakdown) |
| 54 | Roman Numeral Converter | `/tools/roman-numerals` | 100K-200K | 12 | Yes | Pure JS (lookup table with subtraction rules) |
| 55 | Binary / Hex / Decimal Converter | `/tools/number-base-converter` | 150K-300K | 14 | Yes | Pure JS (`parseInt(n, base).toString(targetBase)`) |
| 56 | Random Number Generator | `/tools/random-number-generator` | 200K-400K | 15 | Yes | `crypto.getRandomValues()` for cryptographic randomness |
| 57 | Unit Converter (Length / Weight / Temp / Speed) | `/tools/unit-converter` | 500K-1M | 20 | Yes | Pure JS (conversion factor tables) |

### 1F. File Tools  -  Low Competition

| # | Tool Name | URL Slug | Est. Monthly Searches | KD | Client-Side Only | Browser API / Library |
|---|---|---|---|---|---|---|
| 58 | File Hash Calculator (SHA256/MD5) | `/tools/file-hash-calculator` | 40K-80K | 10 | Yes | Web Crypto API (`crypto.subtle.digest`) + `FileReader.readAsArrayBuffer()` |
| 59 | ZIP File Extractor | `/tools/zip-extractor` | 60K-120K | 12 | Yes | `JSZip` npm library (pure JS) |
| 60 | File Size Converter | `/tools/file-size-converter` | 30K-60K | 8 | Yes | Pure JS (multiply/divide by 1024 for KB/MB/GB/TB) |

---

## SECTION 2  -  MEDIUM COMPETITION (KD 21-40)

### 2A. Image Tools  -  Medium Competition

| # | Tool Name | URL Slug | Est. Monthly Searches | KD | Client-Side Only | Browser API / Library |
|---|---|---|---|---|---|---|
| 61 | Resize Image Online | `/tools/resize-image` | 1M-2M | 35 | Yes | Canvas API (`drawImage` to new canvas dimensions) |
| 62 | Crop Image Online | `/tools/crop-image` | 400K-800K | 28 | Yes | Canvas API + `Cropper.js` |
| 63 | Convert JPG to PNG | `/tools/jpg-to-png` | 600K-1M | 30 | Yes | Canvas API (`toBlob('image/png')`) |
| 64 | Convert PNG to JPG | `/tools/png-to-jpg` | 500K-900K | 28 | Yes | Canvas API (`toBlob('image/jpeg')`) |
| 65 | Convert Image to WebP | `/tools/image-to-webp` | 200K-400K | 22 | Yes | Canvas API (`toBlob('image/webp')`) |
| 66 | Color Palette Generator from Image | `/tools/color-palette-generator` | 80K-150K | 22 | Yes | Canvas `getImageData` + `color-thief.js` |
| 67 | Social Media Image Resizer | `/tools/social-media-image-resizer` | 150K-300K | 25 | Yes | Canvas API with preset sizes (1080x1080, 1200x630, 1280x720, etc.) |
| 68 | YouTube Thumbnail Maker / Resizer | `/tools/youtube-thumbnail-resizer` | 200K-400K | 28 | Yes | Canvas API (resize to 1280x720) |

### 2B. PDF Tools  -  Medium Competition

| # | Tool Name | URL Slug | Est. Monthly Searches | KD | Client-Side Only | Browser API / Library |
|---|---|---|---|---|---|---|
| 69 | Merge PDF | `/tools/merge-pdf` | 3M-5M | 40 | Yes | `pdf-lib` (`PDFDocument.copyPages`) |
| 70 | Split PDF | `/tools/split-pdf` | 800K-1.5M | 35 | Yes | `pdf-lib` (create new doc per page range) |
| 71 | Compress PDF | `/tools/compress-pdf` | 4M-6M | 38 | Mostly | `pdf-lib` for basic; WASM-based for better compression ratio |
| 72 | Remove Pages from PDF | `/tools/remove-pages-from-pdf` | 300K-600K | 22 | Yes | `pdf-lib` |

### 2C. Text Tools  -  Medium Competition

| # | Tool Name | URL Slug | Est. Monthly Searches | KD | Client-Side Only | Browser API / Library |
|---|---|---|---|---|---|---|
| 73 | Word Counter | `/tools/word-counter` | 2M-3M | 30 | Yes | Pure JS (`.split(/\s+/).filter(Boolean).length`) |
| 74 | Character Counter | `/tools/character-counter` | 600K-1M | 22 | Yes | Pure JS (`.length`) |

### 2D. Developer Tools  -  Medium Competition

| # | Tool Name | URL Slug | Est. Monthly Searches | KD | Client-Side Only | Browser API / Library |
|---|---|---|---|---|---|---|
| 75 | JSON Formatter / Validator | `/tools/json-formatter` | 800K-1.5M | 25 | Yes | Pure JS (`JSON.parse` + `JSON.stringify(null, 2)`) + Prism.js syntax highlighting |
| 76 | Regex Tester | `/tools/regex-tester` | 400K-800K | 25 | Yes | Pure JS (native `RegExp` object + match highlighting) |
| 77 | CSS Minifier | `/tools/css-minifier` | 80K-150K | 22 | Yes | `clean-css` (pure JS npm library) |
| 78 | HTML Minifier | `/tools/html-minifier` | 60K-120K | 22 | Yes | `html-minifier-terser` (pure JS) |
| 79 | JavaScript Minifier | `/tools/js-minifier` | 150K-300K | 25 | Yes | `terser` (pure JS via WASM build available for browser) |
| 80 | Color Picker | `/tools/color-picker` | 200K-400K | 22 | Yes | `<input type="color">` + `EyeDropper API` (Chrome 95+) |
| 81 | Gradient Generator | `/tools/gradient-generator` | 150K-300K | 28 | Yes | Pure JS (generate CSS `linear-gradient` string from user inputs) |
| 82 | Favicon Generator | `/tools/favicon-generator` | 100K-200K | 25 | Yes | Canvas API (render image at 16x16, 32x32, 48x48 + ICO packaging via pure JS) |
| 83 | Markdown to PDF | `/tools/markdown-to-pdf` | 80K-150K | 22 | Yes | `marked` + `html2canvas` + `jsPDF` (all pure JS) |

### 2E. Color Tools  -  Medium Competition

| # | Tool Name | URL Slug | Est. Monthly Searches | KD | Client-Side Only | Browser API / Library |
|---|---|---|---|---|---|---|
| 84 | Color Blindness Simulator | `/tools/color-blindness-simulator` | 30K-60K | 22 | Yes | Canvas `getImageData` + color matrix transformations (pure JS) |
| 85 | Color Name Finder | `/tools/color-name-finder` | 50K-100K | 21 | Yes | Pure JS (nearest-neighbor search against `color-name` npm dataset) |

### 2F. Math / Number Tools  -  Medium Competition

| # | Tool Name | URL Slug | Est. Monthly Searches | KD | Client-Side Only | Browser API / Library |
|---|---|---|---|---|---|---|
| 86 | Scientific Calculator | `/tools/scientific-calculator` | 400K-800K | 35 | Yes | Pure JS (`Math` API) |
| 87 | Loan / Mortgage Calculator | `/tools/loan-calculator` | 600K-1.2M | 38 | Yes | Pure JS (compound interest formula) |

### 2G. Social Media Tools  -  Medium Competition

| # | Tool Name | URL Slug | Est. Monthly Searches | KD | Client-Side Only | Browser API / Library |
|---|---|---|---|---|---|---|
| 88 | Instagram Post Resizer | `/tools/instagram-image-resizer` | 100K-200K | 28 | Yes | Canvas API (1080x1080 square, 1080x1350 portrait, 1080x608 landscape) |
| 89 | Twitter / X Card Image Resizer | `/tools/twitter-image-resizer` | 60K-120K | 24 | Yes | Canvas API (1200x628 for cards, 400x400 for profile) |
| 90 | LinkedIn Post Image Resizer | `/tools/linkedin-image-resizer` | 50K-100K | 22 | Yes | Canvas API (1200x627 recommended) |
| 91 | OG Image / Meta Image Generator | `/tools/og-image-generator` | 80K-150K | 28 | Yes | Canvas API (1200x630, text overlay, background color/gradient) |

---

## SECTION 3  -  HIGH COMPETITION (KD 41+)

*Build these for completeness, internal linking, and long-tail variants  -  not as primary acquisition drivers at launch. The volume is too large to ignore, but a new domain will not rank for the head terms. Target secondary keyword angles (e.g., "compress pdf without quality loss", "merge pdf offline browser").*

| # | Tool Name | URL Slug | Est. Monthly Searches | KD | Client-Side Only | Browser API / Library |
|---|---|---|---|---|---|---|
| 92 | Compress PDF (head term) | `/tools/compress-pdf` | 4M-6M | 55 | Mostly | `pdf-lib` + WASM codecs |
| 93 | Merge PDF (head term) | `/tools/merge-pdf` | 3M-5M | 52 | Yes | `pdf-lib` |
| 94 | PDF to Word | `/tools/pdf-to-word` | 2M-4M | 65 | No* | Requires server-side OCR; WASM partial (Tesseract.js for text-layer PDFs only) |
| 95 | Convert PDF to JPG | `/tools/pdf-to-jpg` | 1M-2M | 48 | Yes | `PDF.js` + Canvas |
| 96 | QR Code Generator | `/tools/qr-code-generator` | 1M-2M | 45 | Yes | `qrcode` npm library + Canvas API |
| 97 | Resize Image (head term) | `/tools/resize-image` | 1M-2M | 42 | Yes | Canvas API |
| 98 | Compress Image (head term) | `/tools/compress-image` | 800K-1.5M | 45 | Yes | `browser-image-compression` + Squoosh WASM codecs |
| 99 | Remove Background from Image | `/tools/remove-background` | 600K-1.2M | 50 | Yes | `@imgly/background-removal` (WASM ML model) |
| 100 | Word Counter (head term) | `/tools/word-counter` | 2M-3M | 44 | Yes | Pure JS |

*PDF to Word is the only tool in this entire list that cannot truly be done 100% client-side for scanned PDFs. Text-layer PDFs (non-scanned) can be extracted client-side with PDF.js, but OCR-quality DOCX output requires a server. Flag this as "text PDFs only, no OCR" to set user expectations.

---

## SUMMARY STATISTICS

| Competition Band | Tool Count | Avg. KD | Avg. Monthly Searches (mid) |
|---|---|---|---|
| Low (KD 0-20) | 60 tools | ~12 | ~160K |
| Medium (KD 21-40) | 31 tools | ~28 | ~400K |
| High (KD 41+) | 9 tools | ~50 | ~2M |

**Total unique opportunities catalogued: 100 tools**

---

## HIGHEST-PRIORITY BUILDS (Not in current launch set)

These are the tools NOT already in the first 10 that offer the best traffic-per-build-effort ratio:

### Tier A: Build immediately after launch (Weeks 2-4)
1. **HEIC to JPG**  -  300-600K/month, KD 20, 4 hours to build (heic2any.js)
2. **WebP to JPG**  -  200-400K/month, KD 18, 2 hours (Canvas API)
3. **Rotate PDF**  -  200-400K/month, KD 20, 3 hours (pdf-lib)
4. **Lorem Ipsum Generator**  -  300-600K/month, KD 15, 2 hours (pure JS)
5. **Percentage Calculator**  -  800K-1.5M/month, KD 18, 3 hours (pure JS)
6. **Age Calculator**  -  600K-1.2M/month, KD 18, 3 hours (pure JS)
7. **Unit Converter**  -  500K-1M/month, KD 20, 5 hours (pure JS, multiple units)
8. **Base64 image support**  -  extend existing base64 tool, add image-to-base64 separately

### Tier B: Build in first 60 days
9. **Image to PDF**  -  300-600K/month, KD 18, 3 hours (pdf-lib)
10. **PDF to Image**  -  400-800K/month, KD 20, 4 hours (PDF.js + Canvas)
11. **Resize Image**  -  1-2M/month, KD 35, 4 hours (Canvas API; target long-tail: "resize image to 1mb")
12. **Compress Image**  -  800K-1.5M/month, KD 20, 4 hours (browser-image-compression)
13. **Crop Image**  -  400-800K/month, KD 28, already have Cropper.js from image cropper
14. **Hash Generator**  -  150-300K/month, KD 14, 2 hours (Web Crypto API)
15. **Text Diff**  -  150-300K/month, KD 15, 3 hours (diff npm lib)
16. **Unix Timestamp Converter**  -  100-200K/month, KD 12, 2 hours (pure JS)
17. **JWT Decoder**  -  100-200K/month, KD 14, 2 hours (pure JS, no library needed)
18. **CSV to JSON / JSON to CSV**  -  250-500K/month combined, KD 14, 3 hours (papaparse)

### Tier C: 60-90 days (completes category coverage)
19. **Remove image background**  -  600K-1.2M/month, KD 20, 6 hours (@imgly/background-removal WASM)
20. **Social media image resizer**  -  bundle: Instagram/Twitter/LinkedIn/YouTube in one tool
21. **Cron parser**  -  80-150K/month, KD 12, 2 hours (cronstrue)  -  on-brand with Crontinel
22. **Regex tester**  -  400-800K/month, KD 25, 4 hours (pure JS)
23. **YAML to JSON / JSON to YAML**  -  90-180K/month combined, KD 12, 2 hours (js-yaml)
24. **SVG to PNG**  -  150-300K/month, KD 14, 2 hours (Canvas API)
25. **Color Palette Generator**  -  80-150K/month, KD 22, 3 hours (color-thief.js)

---

## IMPLEMENTATION NOTES

### Libraries Required (Beyond Launch Set)

| Library | npm Package | Bundle Size (gzip) | Tools Using It |
|---|---|---|---|
| heic2any | `heic2any` | ~120KB | HEIC to JPG |
| pdf-lib | `pdf-lib` | ~300KB | Rotate PDF, Image to PDF, Merge PDF, Split PDF, Add Page Numbers |
| PDF.js | `pdfjs-dist` | ~400KB | PDF to Image, Extract Text from PDF |
| browser-image-compression | `browser-image-compression` | ~30KB | Compress Image |
| @imgly/background-removal | `@imgly/background-removal` | ~6MB (WASM model) | Remove Background |
| diff | `diff` | ~12KB | Text Diff |
| js-yaml | `js-yaml` | ~40KB | YAML to JSON, JSON to YAML |
| papaparse | `papaparse` | ~25KB | CSV to JSON, JSON to CSV |
| fast-xml-parser | `fast-xml-parser` | ~30KB | XML to JSON |
| cronstrue | `cronstrue` | ~15KB | Cron Parser |
| color-thief.js | `colorthief` | ~8KB | Extract Colors, Color Palette Generator |
| JSZip | `jszip` | ~40KB | ZIP Extractor |
| jsPDF | `jspdf` | ~120KB | Markdown to PDF |
| terser | `terser` | ~180KB | JS Minifier |
| clean-css | `clean-css` | ~60KB | CSS Minifier |
| html-minifier-terser | `html-minifier-terser` | ~50KB | HTML Minifier |
| turndown | `turndown` | ~15KB | HTML to Markdown |
| bcryptjs | `bcryptjs` | ~20KB | Htpasswd Generator |
| spark-md5 | `spark-md5` | ~8KB | MD5 Hash (SHA-256 uses native Web Crypto API) |

**Key note on @imgly/background-removal:** The WASM model is ~6MB but loads lazily (only when user triggers the tool). It runs a real ML segmentation model (ONNX Runtime) entirely in the browser with no server call. This is the strongest differentiator in the image category  -  competitors like remove.bg and Adobe Firefly require cloud APIs.

### Tools That Cannot Be 100% Client-Side (Exceptions)

Only one tool in the entire catalogue has a hard server dependency:
- **PDF to Word (scanned PDFs):** Real OCR that produces DOCX output requires a server-side process (Tesseract.js in the browser works for basic extraction, but quality is far below cloud OCR for scanned documents). Workaround: offer the tool for text-layer PDFs only and clearly label it "Works for text PDFs  -  not scanned documents." This covers ~60% of use cases and is still valuable.

Everything else listed in this document is genuinely 100% client-side.

### SEO Quick-Win Stack Ranking

Sorted by (search volume × (1 - KD/100))  -  a proxy for "traffic opportunity score" weighted for achievability:

1. Percentage Calculator  -  score: 1.23M (800K × 0.82)
2. Age Calculator  -  score: 0.98M (600K × 0.82)
3. Unit Converter  -  score: 0.60M (500K × 0.80)
4. HEIC to JPG  -  score: 0.56M (350K × 0.80)
5. Lorem Ipsum Generator  -  score: 0.51M (450K × 0.85)
6. WebP to JPG  -  score: 0.49M (300K × 0.82)
7. Remove Duplicate Lines  -  score: 0.27M (150K × 0.90)  -  already in launch set
8. Rotate PDF  -  score: 0.24M (300K × 0.80)
9. Image to PDF  -  score: 0.41M (450K × 0.82)
10. PDF to Image  -  score: 0.48M (600K × 0.80)

---

*Research compiled: April 7, 2026. Based on existing Tinytools research and extended category analysis.*
