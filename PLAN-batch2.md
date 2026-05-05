# Batch 2 Plan: 29 Tool Components

## Rules
- 'use client' directive
- tb-v2-* design system classes (from CsvToTsvClient.tsx)
- No new npm packages — client-side only
- Components → /Users/ray/Work/toolblip/components/tools/{PascalCase}Client.tsx
- After all: update ToolUI.tsx (imports + case statements, alphabetical)
- Run: npx tsc --noEmit | grep error | head -30

## Skip (already exists)
- AiDetectorClient.tsx ✅

## Simple (text in → text out, no canvas)
1. AiRephraserClient.tsx → slug: ai-rephraser
   - Synonym-swap rephrase, textarea in, textarea out
2. AiTwitterGeneratorClient.tsx → slug: ai-twitter-generator
   - Template: hook + topic + CTA, output tweet drafts
3. ArticleGeneratorClient.tsx → slug: article-generator
   - Topic input → H2 outline + lorem body, markdown output
4. ArticleRewriterClient.tsx → slug: article-rewriter
   - Paragraph rephrase via synonym substitution
5. ArticleTitleGenClient.tsx → slug: article-title-gen
   - Topic → 5 title templates (How to..., X Ways to..., etc.)
6. ArticleTitleGeneratorClient.tsx → slug: article-title-generator
   - Same as above (different slug)
7. ArticleWriterClient.tsx → slug: article-writer
   - Same as article-generator (different slug)
8. ApiAuthHeaderGeneratorClient.tsx → slug: api-auth-header-generator
   - Form: type (Bearer/Basic/API-Key), credentials → Authorization header preview
9. ApiDocGeneratorClient.tsx → slug: api-doc-generator
   - JSON sample → Markdown API docs
10. ApiEndpointDebuggerClient.tsx → slug: api-endpoint-debugger
    - Form: method, URL, headers → curl/fetch snippet preview
11. ApiEndpointDocumenterClient.tsx → slug: api-endpoint-documenter
    - Form: endpoint details → Markdown table
12. ApiEndpointTesterClient.tsx → slug: api-endpoint-tester
    - Same as debugger (different slug name)
13. ApiSpecGeneratorClient.tsx → slug: api-spec-generator
    - JSON sample → minimal OpenAPI 3 YAML
14. AccessibilityCheckerClient.tsx → slug: accessibility-checker
    - Paste HTML → flag missing alt, empty headings, no labels (DOMParser)
15. Argon2HashGeneratorClient.tsx → slug: argon2-hash-generator
    - Password + params → demo hash string (label "demo only, not cryptographically secure")
16. AlgorithmVisualizerClient.tsx → slug: algorithm-visualizer
    - Bubble sort visualization: input array → CSS bar chart steps

## Medium (multi-input, unit converters)
17. AllInOneUnitConverterClient.tsx → slug: all-in-one-unit-converter
    - Categories: length/weight/temp/area/volume/speed. Dropdown + input → output
18. AngleUnitConverterClient.tsx → slug: angle-unit-converter
    - Degrees / radians / gradians / arcminutes
19. AreaConverterClient.tsx → slug: area-converter
    - m², ft², acres, hectares, km², mi²
20. AddPagesClient.tsx → slug: add-pages
    - Input: page count, position → descriptive output (no real PDF)
21. AddTextClient.tsx → slug: add-text
    - Text + canvas mock page → preview overlay
22. AsciiArtGeneratorClient.tsx → slug: ascii-art-generator
    - Text → 5x7 block letter ASCII art

## Hard (Canvas / file / audio)
23. AddImagesClient.tsx → slug: add-images
    - Multi-image upload → canvas composite → PNG download (label "preview only")
24. AddSubtitlesClient.tsx → slug: add-subtitles
    - Video + SRT/VTT upload → subtitles overlay preview
25. AnnotateClient.tsx → slug: annotate
    - Image upload + canvas drawing (rectangles + text) → export PNG
26. AacToFlacClient.tsx → slug: aac-to-flac
    - Audio decode → WAV wrapper (label "FLAC encoding not supported in browser")
27. AacToM4rClient.tsx → slug: aac-to-m4r
    - Rename original AAC bytes to .m4r and re-download
28. AacToMp3Client.tsx → slug: aac-to-mp3
    - Decode → WAV (label "MP3 encoding not supported in browser")
29. AacToMp4Client.tsx → slug: aac-to-mp4
    - Rename original AAC bytes to .mp4 and re-download
30. AacToWavClient.tsx → slug: aac-to-wav
    - TRUE conversion: AudioContext.decodeAudioData → 16-bit PCM → WAV blob → download

## Implementation Order
Batch 1 (1-10): ai-rephraser, ai-twitter-gen, article-gen, article-rewriter, article-title-gen, article-title-generator, article-writer, api-auth-header-gen, api-doc-gen, api-endpoint-debugger
Batch 2 (11-20): api-endpoint-documenter, api-endpoint-tester, api-spec-gen, accessibility-checker, argon2-hash-gen, algorithm-visualizer, all-in-one-unit-converter, angle-unit-converter, area-converter, add-pages
Batch 3 (21-30): add-text, ascii-art-gen, add-images, add-subtitles, annotate, aac-to-flac, aac-to-m4r, aac-to-mp3, aac-to-mp4, aac-to-wav
