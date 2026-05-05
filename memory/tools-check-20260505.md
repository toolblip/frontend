# Toolblip Tools Audit — 2025-05-05

## Baseline
- Total tools in data/tools.ts: 1563
- Switch cases in ToolUI.tsx: 1630
- Component files: 898

## Status: 159 slugs missing

### Batch 1: Route only (131 slugs) — IN PROGRESS
- Just need switch case additions to ToolUI.tsx
- Components already exist with fuzzy matches
- Example: `keyword-generator-v2` → `KeywordGenerator`

### Batch 2: New component + route (28 slugs) — PENDING
- `jwt-tester`, `ua-parser-express`, `word-freq-express`, `meta-tags-tool`
- `unit-conversion-tool`, `text-sort-tool`, `regex-explainer`, `pressure-converter`
- `keyword-difficulty-tool`, `make-background-transparent`, `nda-generator`
- `paragraph-rewriter`, `podcast-writer`, `remove-text-photo`, `remove-watermark-photo`
- `repair-defects`, `shorten-content`, `trivia-generator`
- `regex-toolblip`, `jwt-toolblip`, `port-toolblip`, `meta-toolblip`, `serp-toolblip`
- `sitemap-urls-extractor`, `seo-meta-builder`, `mock-port-check`, `serp-quick`, `sitemap-html-new`

## Full 159 missing slugs (JSON)
["slug-permalink-checker","slideshow-generator","quote-of-the-day","twitter-card-preview","plagiarism-checker","shell-command-reference","keyword-generator","physics-constants-reference","websocket-tester","ipa-phonetic-finder","regex-pattern-generator","svg-minifier","image-to-base64","keyword-extractor","mime-types-reference","json-editor","json-tree-view","word-cloud-generator","svg-optimizer","text-highlighter","word-combinations-generator","sentiment-analyzer","keyword-generator-v2","rot13-cipher-v2","json-to-url-encoded-v2","ssh-key-generator","word-alphabetizer","screenshot-maker","page-speed-preview","readability-improver","jwt-tester","network-port-checker","photo-resize-tool","metric-imperial-converter","regex-pattern-generator-v2","jwt-token-tester","regex-description-generator","serp-rank-tracker","reading-level-estimator","jsonpath-query-tester","image-square-fit","ua-parser-express","word-freq-express","meta-tags-tool","unit-conversion-tool","text-sort-tool","regex-explainer","text-line-deduplicator","word-scramble-generator","uuid-normalizer","page-title-checker","pressure-converter","keyword-difficulty-tool","instagram-caption-generator","instagram-story-ideas","landing-page-copy","linkedin-post-generator","listicle-writer","m4a-to-mp3","m4a-to-mp4","make-background-transparent","mp4-to-mp3","mp4-to-ogg","mute","nda-generator","ogg-to-mp3","paragraph-completer","paragraph-rewriter","paragraph-writer","podcast-writer","poll-generator","post-generator","post-ideas","post-rewriter","post-writer","press-release-generator","privacy-policy-generator","profile-photo","protect","purchase-agreement-generator","real-estate-description","rearrange","remove-objects","remove-person","remove-text-photo","remove-watermark-photo","repair-defects","resize","rotate","shorten-content","sign","split","split-csv","split-excel","story-generator","summarize-podcast","summarize-youtube","tiktok-script-writer","title-rewriter","tone-of-voice","trace","transcribe-podcast","trivia-generator","unblur","unlock","upscale","watermark","youtube-script-writer","youtube-transcript","unicode-escape-encoder","punycode-encoder","remove-extra-spaces","random-choice-wheel","word-count-from-url","yaml-pretty-print","kubernetes-yaml-generator","uuid-comparator","regex-toolblip","jwt-toolblip","port-toolblip","meta-toolblip","serp-toolblip","token-builder","image-scale-calculator","sitemap-urls-extractor","seo-meta-builder","serp-snippet-viewer","text-structure-validator","uuid-compare","timestamp-diff-calculator","pixel-density-calculator","text-complexity-analyzer","text-deduplicator","photo-metadata-remover","seo-title-analyzer","slug-health-checker","screen-density-simulator","text-sentence-shuffler","mock-port-check","serp-quick","regex-pattern-builder","response-header-analyzer","webhook-tester","scientific-notation-converter","jsonpath-query-tool","svg-compressor","sitemap-html-new","random-choice-picker","list-difference-finder","regex-escape","what-if-scenario-calculator","word-finder","text-improver","sentence-extractor","synonym-finder","pagespeed-preview","jwt-token-inspector","ipynb-formatter","jupyter-cleaner"]

## Route mapping for 131 route-only slugs
slug -> component mapping saved separately in scripts/route-only-mapping.json
