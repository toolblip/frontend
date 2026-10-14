# SEO index prune, 2026-10-14

Shrinks the indexable tool set from 437 to 178 KEEP. The other 262 tools are HOLD: they stay live and linked, but serve `noindex, follow` and drop out of `sitemap-tools.xml`, `llms.txt` and `llms-full.txt`. No page is removed or redirected. Mechanism: `TOOL_INDEXING_DECISIONS` in `data/tool-indexing-policy.ts`, read by `isToolIndexable()`.

Trigger: Search Console (2026-10-12) shows 368 of 437 sitemap tools as "Crawled - currently not indexed".

## Criteria

A tool is KEEP when all of these hold:

1. **Working tool.** Its slug has a `case` in `app/tools/[slug]/ToolUI.tsx` that renders a component, and that component file exists. All 440 catalog slugs pass. Component files were scanned for placeholder markers.
2. **Substantive content.** Its `getToolContent()` entry has a description unique to that tool and at least one task example, plus either a unique features list or a hand-written FAQ override (`hasFaqOverride`). The shared "Clean interface / Fast processing" features template does not pass alone. FAQ presence alone does not pass either.
3. **No duplicate family.** Where tools do the same job, one is kept (the richer page, or the one named in a keyword row) and the rest are held. Families were grouped by shared UI engine, shared purpose, and near-identical descriptions.

Overrides, applied before the criteria:

- **Priority cohort** (12 tools) and the **user keyword rows** (24 more slugs in the brief): always KEEP, even where the content gate fails (for example `binary-to-text`, `xml-formatter`, `contrast-checker`). Their content is being edited in a parallel PR.
- **Seed keyword rows** from `seo/data-for-seo/seeds/*.json`: each keyword maps to a catalog slug by exact slug, alias resolution, or a manual map. Those slugs are KEEP even where the content gate fails.

FAQ content never grants or removes eligibility on its own.

## Counts

| Basis | KEEP |
| --- | ---: |
| Priority cohort and user keyword rows | 36 |
| Additional seed keyword rows | 54 |
| Content gate and family rules only | 88 |
| **Total KEEP** | **178** |

82 KEEP tools were already `reviewed` in the 2026-09-26 and 2026-09-28 reviews and keep their original decision. The other 96 are new `reviewed` decisions dated 2026-10-14. Each carries a one-line evidence string: the UI component, FAQ status, example count and description uniqueness.

## Flags for review

- **KEEP is above the 100-150 estimate (178).** Most of the excess is seed keyword rows the content gate would otherwise hold. The brief said to keep them.
- **`gradient-generator` and `slug-generator`** had prior holds for consolidation with `css-gradient-generator` and `url-slug-generator`. The seed keyword rule overrides those holds here. Revert if the consolidation decision should win.
- **`currency-converter`** is a seed row, so it is KEEP. Its page says it uses fixed demonstration rates, not live ones. The copy is honest, but the page may not meet the working-tool bar.
- **`temp-converter`** is held as a duplicate of `temperature-unit-converter`, a keyword row. The keyword `temperature converter` maps to the kept slug.
- **Not checked:** no browser QA on the held pages, and no read of the HOLD copy for the user.

## HOLD reasons

| Slug | Reason |
| --- | --- |
| `aac-to-wav` | no task examples in tool content. |
| `accessibility-checker` | no task examples in tool content. |
| `add-subtitles` | no task examples in tool content. |
| `algorithm-visualizer` | no task examples in tool content. |
| `all-in-one-unit-converter` | no task examples in tool content. |
| `anagram-generator` | no task examples in tool content. |
| `angle-unit-converter` | no task examples in tool content. |
| `api-auth-header-generator` | no task examples in tool content. |
| `api-doc-generator` | no task examples in tool content. |
| `api-endpoint-debugger` | no task examples in tool content. |
| `api-endpoint-documenter` | no task examples in tool content. |
| `api-spec-generator` | no task examples in tool content. |
| `area-converter` | no task examples in tool content. |
| `article-title-generator` | no task examples in tool content. |
| `ascii-art-generator` | no task examples in tool content. |
| `backslash-escape-unescape` | no task examples in tool content. |
| `banner-generator` | no task examples in tool content. |
| `base-number-converter` | no task examples in tool content. |
| `base64-file-encoder` | no task examples in tool content. |
| `base64-image-decoder` | no task examples in tool content. |
| `base64-image-viewer` | no task examples in tool content. |
| `batch-favicon-downloader` | no task examples in tool content. |
| `batch-image-resizer` | no task examples in tool content. |
| `bill-sale-generator` | no task examples in tool content. |
| `bin-hex-dec-converter` | no task examples in tool content; description shared with 1 other tool(s). |
| `binary-decimal-hex-converter` | no task examples in tool content; description shared with 1 other tool(s). |
| `binary-to-decimal` | no task examples in tool content. |
| `border` | no task examples in tool content. |
| `broken-link-checker` | no task examples in tool content. |
| `browser-image-resizer` | no task examples in tool content. |
| `byte-converter` | no task examples in tool content. |
| `canonical-url-generator` | no task examples in tool content. |
| `character-frequency-counter` | no task examples in tool content. |
| `character-variety-checker` | no task examples in tool content. |
| `chart-maker` | no task examples in tool content. |
| `cidr-calculator` | no task examples in tool content. |
| `circle-crop` | no task examples in tool content. |
| `code-beautifier` | no task examples in tool content. |
| `code-to-diagram-generator` | no task examples in tool content. |
| `collage-maker` | no task examples in tool content. |
| `collocations-checker` | no task examples in tool content. |
| `color-blindness-simulator` | no task examples in tool content. |
| `color-contrast-auditor` | no task examples in tool content. |
| `color-contrast-matrix` | no task examples in tool content. |
| `color-contrast-ratio-checker` | no task examples in tool content. |
| `color-harmony-generator` | no task examples in tool content. |
| `color-luminance-calculator` | no task examples in tool content. |
| `color-luminance-checker` | no task examples in tool content. |
| `color-mixer` | no task examples in tool content. |
| `color-name-finder` | no task examples in tool content. |
| `color-opacity-generator` | no task examples in tool content. |
| `color-palette-extractor` | no task examples in tool content. |
| `color-palette-from-image` | no task examples in tool content. |
| `color-picker-wheel` | no task examples in tool content. |
| `color-saturation-adjuster` | no task examples in tool content. |
| `color-shade-gen` | no task examples in tool content. |
| `color-shade-tints` | no task examples in tool content. |
| `color-temperature-adjuster` | no task examples in tool content. |
| `color-tint-generator` | no task examples in tool content. |
| `color-tone-generator` | no task examples in tool content. |
| `combine-images` | no task examples in tool content. |
| `cooking-unit-converter` | no task examples in tool content. |
| `cors-header-generator` | no task examples in tool content. |
| `credit-card-validator` | no task examples in tool content. |
| `cron-generator-dg` | no task examples in tool content. |
| `cron-human-readable` | no task examples in tool content. |
| `cron-schedule-explainer` | no task examples in tool content. |
| `cron-schedule-generator` | no task examples in tool content. |
| `cron-schedule-validator` | no task examples in tool content. |
| `cron-validator` | no task examples in tool content. |
| `crop-circle` | no task examples in tool content. |
| `css-border-radius-generator` | no task examples in tool content. |
| `css-class-generator` | no task examples in tool content. |
| `css-flexbox-generator` | no task examples in tool content. |
| `css-gradient-generator` | no task examples in tool content. |
| `css-to-scss` | no task examples in tool content. |
| `css-to-styled-components` | no task examples in tool content. |
| `css-to-tailwind` | no task examples in tool content. |
| `css-validator` | no task examples in tool content. |
| `csv-generator` | no task examples in tool content. |
| `csv-to-excel` | no task examples in tool content. |
| `csv-to-xml` | no task examples in tool content. |
| `csv-tsv-converter` | no task examples in tool content. |
| `curl-command-builder` | no task examples in tool content. |
| `curl-to-javascript` | no task examples in tool content. |
| `curl-to-python` | no task examples in tool content. |
| `cutter` | no task examples in tool content. |
| `data-size-converter` | no task examples in tool content. |
| `data-uri-generator` | no task examples in tool content. |
| `db-query-formatter` | no task examples in tool content; description shared with 2 other tool(s). |
| `decimal-to-binary` | no task examples in tool content. |
| `decimal-to-hex-converter` | no task examples in tool content. |
| `detect` | no task examples in tool content. |
| `dns-lookup` | no task examples in tool content. |
| `dns-lookup-tool` | no task examples in tool content. |
| `docker-command-generator` | no task examples in tool content. |
| `docker-compose-generator` | no task examples in tool content. |
| `domain-age-checker` | no task examples in tool content. |
| `dominant-color-extractor` | no task examples in tool content. |
| `dpi-ppi-calculator` | no task examples in tool content. |
| `dummy-text-detector` | no task examples in tool content. |
| `duplicate-line-finder` | no task examples in tool content. |
| `duplicate-phrase-detector` | no task examples in tool content. |
| `duplicate-url-detector` | no task examples in tool content. |
| `email-generator` | no task examples in tool content. |
| `encodings-reference` | no task examples in tool content. |
| `english-collocations-checker` | no task examples in tool content. |
| `english-dictionary` | no task examples in tool content. |
| `english-grammar-checker` | no task examples in tool content. |
| `env-parser` | no task examples in tool content. |
| `excel-to-csv` | no task examples in tool content. |
| `excel-to-pdf` | no task examples in tool content. |
| `excel-to-xml` | no task examples in tool content. |
| `exif-remover` | no task examples in tool content. |
| `extract-audio` | no task examples in tool content. |
| `fake-address-generator` | no task examples in tool content. |
| `fake-text-generator` | no task examples in tool content. |
| `favicon-from-emoji` | no task examples in tool content. |
| `filler-word-counter` | no task examples in tool content. |
| `flesch-kincaid-calculator` | no task examples in tool content. |
| `fraction-to-decimal` | no task examples in tool content. |
| `gif-to-apng` | no task examples in tool content. |
| `gif-to-jpg` | no task examples in tool content. |
| `gif-to-png` | no task examples in tool content. |
| `google-algorithm-tracker` | no task examples in tool content. |
| `grammar-checker-pro` | wraps the same grammar service as grammar-checker (keyword row) |
| `grammar-checker-v2` | wraps the same grammar service as grammar-checker (keyword row) |
| `grammar-score-checker` | local grammar heuristics overlap grammar-checker (keyword row) and passive-voice-detector |
| `grayscale` | no task examples in tool content. |
| `hash-collision-finder` | no task examples in tool content. |
| `hash-identifier` | no task examples in tool content. |
| `heading-tag-analyzer` | no task examples in tool content. |
| `heic-to-jpg` | no task examples in tool content. |
| `heic-to-png` | no task examples in tool content. |
| `homoglyph-detector` | no task examples in tool content. |
| `homophone-checker` | no task examples in tool content. |
| `hreflang-tag-generator` | no task examples in tool content. |
| `html-attribute-encoder` | no task examples in tool content. |
| `html-encoder-decoder` | no task examples in tool content. |
| `html-live-preview` | no task examples in tool content. |
| `html-table-to-json` | no task examples in tool content. |
| `html-to-jsx` | no task examples in tool content. |
| `html-validator` | no task examples in tool content. |
| `image-dpi-resizer` | no task examples in tool content. |
| `image-flip` | no task examples in tool content. |
| `image-optimizer` | resize, compress and convert overlap image-compressor and webp-converter (keyword rows) |
| `image-rotate` | no task examples in tool content. |
| `image-scale-calculator` | dimension math overlaps image-aspect-ratio-calculator and image-resizer (priority/keyword rows) |
| `image-square-fit` | no task examples in tool content. |
| `ip-range-calculator` | no task examples in tool content. |
| `ipv6-generator` | no task examples in tool content. |
| `jpg-to-png` | no task examples in tool content. |
| `jpg-to-webp` | no task examples in tool content. |
| `json-editor` | tree-plus-format editing overlaps json-tree-view and json-formatter (priority cohort) |
| `json-graph-visualizer` | no task examples in tool content. |
| `json-ld-generator` | no task examples in tool content. |
| `json-path-tester` | no task examples in tool content. |
| `json-schema-validator` | no task examples in tool content. |
| `json-toml-converter` | no task examples in tool content. |
| `jupyter-cleaner` | no task examples in tool content. |
| `jwt-token-inspector` | claim decoding duplicates jwt-decoder (priority cohort) |
| `keyword-extractor` | no task examples in tool content. |
| `keyword-generator` | no task examples in tool content. |
| `line-counter` | no task examples in tool content. |
| `list-randomizer` | no task examples in tool content. |
| `m4a-to-wav` | no task examples in tool content. |
| `mac-address-generator` | no task examples in tool content. |
| `markdown-to-pdf` | no task examples in tool content. |
| `meta-description-checker` | no task examples in tool content. |
| `metric-imperial-converter` | length, mass and temperature conversion overlaps unit-converter (keyword row) |
| `mkv-to-mp3` | no task examples in tool content. |
| `mp4-to-mp3` | no task examples in tool content. |
| `mp4-to-wav` | no task examples in tool content. |
| `nda-generator` | no task examples in tool content. |
| `notebook-to-html` | no task examples in tool content. |
| `number-base-converter` | no task examples in tool content. |
| `number-to-words` | no task examples in tool content. |
| `octal-to-decimal` | no task examples in tool content. |
| `og-tag-debugger` | no task examples in tool content. |
| `open-graph-generator` | no task examples in tool content. |
| `open-graph-preview` | no task examples in tool content. |
| `page-title-checker` | no task examples in tool content; description shared with 1 other tool(s). |
| `palindrome-checker` | no task examples in tool content. |
| `paragraph-counter` | no task examples in tool content. |
| `paragraph-generator` | placeholder-paragraph generation overlaps lorem-ipsum-generator (keyword row) |
| `percentage-difference` | no task examples in tool content. |
| `photo-metadata-remover` | no task examples in tool content. |
| `photo-resize` | no task examples in tool content. |
| `ping-test` | no task examples in tool content. |
| `pixelate` | no task examples in tool content. |
| `plain-text-counter` | no task examples in tool content. |
| `png-to-jpg` | no task examples in tool content. |
| `png-to-webp` | no task examples in tool content. |
| `poll-generator` | no task examples in tool content. |
| `privacy-policy-generator` | no task examples in tool content. |
| `profile-photo` | no task examples in tool content. |
| `purchase-agreement-generator` | no task examples in tool content. |
| `random-choice-wheel` | same choose-from-a-list job as random-choice-picker; visual wheel only |
| `random-fraction-generator` | no task examples in tool content. |
| `random-id-generator` | identifier generation overlaps random-string-generator (keyword row) |
| `random-ip-address` | no task examples in tool content. |
| `random-sentence-generator` | no task examples in tool content. |
| `random-uuid-v7` | no task examples in tool content. |
| `reading-level-estimator` | Overlaps readability-score; scoring presentation differs, so consolidation requires a separate decision. |
| `regex-match-visualizer` | no task examples in tool content. |
| `regex-pattern-generator` | predefined-pattern lookup overlaps regex-pattern-builder and regex-tester (priority cohort) |
| `robots-txt-checker` | no task examples in tool content. |
| `rot13-express` | no task examples in tool content. |
| `rot47-cipher` | no task examples in tool content. |
| `sass-to-css` | no task examples in tool content. |
| `screen-density-simulator` | no task examples in tool content. |
| `screen-resolution-tester` | no task examples in tool content. |
| `security-headers-generator` | no task examples in tool content. |
| `semver-checker` | no task examples in tool content. |
| `sentence-counter` | no task examples in tool content. |
| `seo-meta-tag-analyzer` | no task examples in tool content. |
| `seo-title-analyzer` | no task examples in tool content; description shared with 1 other tool(s). |
| `sha-256-hash` | no task examples in tool content. |
| `sha1-hash-generator` | no task examples in tool content. |
| `sharpen` | no task examples in tool content. |
| `sitemap-analyzer` | no task examples in tool content. |
| `slug-permalink-checker` | slug formatting checks overlap slug-health-checker |
| `split-excel` | no task examples in tool content. |
| `sql-to-json` | no task examples in tool content. |
| `square-crop` | crop-to-square overlaps image-cropper (keyword row) |
| `ssh-key-generator` | no task examples in tool content. |
| `sticky-notes` | no task examples in tool content. |
| `svg-to-jpg` | no task examples in tool content. |
| `svg-to-webp` | no task examples in tool content. |
| `syllable-counter` | no task examples in tool content. |
| `temp-converter` | duplicate of temperature-unit-converter (keyword row) with the same Celsius/Fahrenheit/Kelvin job |
| `text-complexity-analyzer` | sentence and syllable metrics overlap readability-score |
| `text-deduplicator` | duplicate-line removal overlaps remove-duplicate-lines (keyword row) |
| `text-permutation-generator` | no task examples in tool content. |
| `text-redundancy-checker` | no task examples in tool content. |
| `text-reverser` | no task examples in tool content. |
| `text-statistics` | no task examples in tool content. |
| `text-to-handwriting` | no task examples in tool content. |
| `text-to-slug` | no task examples in tool content. |
| `text-uniqueness-checker` | no task examples in tool content. |
| `trace` | no task examples in tool content. |
| `tweet-to-image-converter` | no task examples in tool content. |
| `typo-checker` | no task examples in tool content. |
| `ulid-generator` | no task examples in tool content. |
| `unicode-character-inspector` | no task examples in tool content. |
| `uptime-calculator` | no task examples in tool content. |
| `url-parameter-extractor` | no task examples in tool content. |
| `url-parser` | no task examples in tool content. |
| `url-redirect-checker` | no task examples in tool content. |
| `url-slug-generator` | no task examples in tool content. |
| `user-agent-parser` | no task examples in tool content. |
| `uuid-compare` | duplicate of uuid-comparator, which also decodes fields and timestamps |
| `uuid-v1-generator` | no task examples in tool content. |
| `uuid-validator` | no task examples in tool content. |
| `wcag-contrast-auditor` | no task examples in tool content. |
| `wcag-contrast-checker` | no task examples in tool content. |
| `webp-to-jpg` | no task examples in tool content. |
| `webp-to-png` | no task examples in tool content. |
| `word-freq` | overlaps word-frequency-counter (keyword row); top-word counting is the same job |
| `word-frequency-table` | overlaps word-frequency-counter (keyword row); same letter-run frequency count |
| `xml-validator` | no task examples in tool content. |
| `zip` | no task examples in tool content. |
