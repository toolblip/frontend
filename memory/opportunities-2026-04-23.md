# Opportunity Finder — 2026-04-23

_Research run: 2026-05-11. Existing blog inventory checked in `content/blog/` and `src/content/blog/`; existing tools checked in `data/tools.ts` and `src/data/tools.ts`._

## Questions Found (from Reddit/Stack Overflow/Q&A sites)
| Question | Platform | Tool That Solves It | Content Angle |
|----------|----------|---------------------|---------------|
| “How can I validate and pretty-print JSON in JavaScript?” | Stack Overflow — https://stackoverflow.com/questions/79930276/how-can-i-validate-and-pretty-print-json-in-javascript | `json-formatter` | Existing JSON formatter posts cover basics; add short comparison snippet: “JSON.stringify vs online formatter vs schema validation — when each catches errors.” |
| “Shorthand for querying JSON string inside JSON value” | Stack Overflow — https://stackoverflow.com/questions/79938921/shorthand-for-querying-json-string-inside-json-value | `json-path-tester`, `json-path-evaluator`, `json-editor` | Content gap: nested JSON-inside-JSON debugging workflow; show parse → pretty-print → JSONPath extraction. |
| “How to efficiently query nested JSON relationships (reacts_with, affected_by) without redundancy?” | Stack Overflow — https://stackoverflow.com/questions/79931394/how-to-efficiently-query-nested-json-relationships-reacts-with-affected-by-wi | `json-graph-visualizer`, `json-path-tester` | Existing `visualize-nested-json-relationships` post fits; add internal link/FAQ update around relationship-like keys and graph views. |
| “jq: cannot shorten my convoluted expression” | Stack Overflow — https://stackoverflow.com/questions/79926576/jq-cannot-shorten-my-convoluted-expression | `json-path-tester`, `json-path-evaluator` | Blog idea: “JSONPath vs jq for common extraction tasks — simple recipes before you reach for complex filters.” Existing `jsonpath-vs-jq` post exists; add examples from recent SO patterns. |
| “Why are there empty spaces in the middle of the string returned by re.split()?” | Stack Overflow — https://stackoverflow.com/questions/79928370/why-there-are-empty-spaces-in-the-middle-of-the-string-returned-by-re-split | `regex-tester`, `regex-explainer` | New content angle: “Why regex split returns empty strings — capturing groups, boundaries, and quick tests.” |
| “How to do multi-line matches where some of the later matches are optional?” | Stack Overflow — https://stackoverflow.com/questions/79937314/how-to-do-multi-line-matches-where-some-of-the-later-matches-are-optional | `regex-tester`, `regex-explainer`, `regex-pattern-generator` | Content gap: optional multiline groups with real examples; existing regex cheatsheet does not appear focused on multiline optional blocks. |
| “Print capture groups for every match” | Stack Overflow — https://stackoverflow.com/questions/79938287/print-capture-groups-for-every-match | `regex-tester`, `regex-explainer` | Existing `debug-regex-capture-groups-multiple-matches` post directly matches; use as answer/comment opportunity if appropriate. |
| “How can I write a regex that can find passwords in texts and binary data?” | Stack Overflow — https://stackoverflow.com/questions/79926663/how-can-i-write-a-regex-that-can-find-passwords-in-texts-and-binary-data | `regex-tester`, `text-diff` (partial) | Blog idea: “Don’t use regex alone for secret scanning — safe patterns, false positives, and binary/text caveats.” New tool idea: secret-pattern tester. |
| “REGEX: splitting up bank transaction statements” | Stack Overflow — https://stackoverflow.com/questions/79931400/regex-splitting-up-bank-transaction-statements | `regex-tester`, `regex-pattern-generator` | Blog idea: “Regex recipes for messy bank/export statements — named groups, dates, amounts, and merchant text.” |
| “base64 to hex conversion with spacer in the result” | Stack Overflow — https://stackoverflow.com/questions/79931274/base64-to-hex-conversion-with-spacer-in-the-result | `base64`, `base64-encode`, `base64-image-converter` (partial) | Tool gap: Base64 ↔ hex converter with byte grouping/spacers. Existing Base64 posts do not cover hex output formatting. |
| “BASE64 Encode/Decode?” for filenames to avoid blocked terms | Reddit r/RealDebrid — https://reddit.com/r/RealDebrid/comments/1ta2jy8/base64_encodedecode/ | `base64`, `base64-encode`, `base64-encoder-decoder`, `url-encode` | Content angle: “Base64 for filenames and URLs: padding, URL-safe Base64, and when encoding does not solve policy filters.” |
| “I built a local-first text toolkit for JSON, Markdown, CSV, regex, and cleanup” with comment asking how it differs from VS Code | Reddit r/webdev — https://reddit.com/r/webdev/comments/1t2ypqe/showoff_saturday_i_built_a_localfirst_text/ | `json-formatter`, `regex-tester`, `remove-duplicate-lines`, `text-sorter`, `csv-to-json`, `json-to-csv`, `markdown-to-html` | Existing `toolblip-vs-vscode-extensions` post fits; social angle: privacy/local-first + zero setup vs editor workflows. |
| “Seeking Feedback: 100% client-side, privacy-first developer utilities” | Reddit r/webdev — https://reddit.com/r/webdev/comments/1sp4fib/seeking_feedback_i_built_a_suite_of_100/ | `json-formatter`, `jwt-decoder`, `hash-generator`, `base64`, `url-encode` | Reinforces privacy-first positioning; existing “online formatter vs extension security” and browser-based tools posts can be reused. |
| “A JSON↔XML converter that handles 50GB files from browser” | Reddit r/webdev — https://reddit.com/r/webdev/comments/1schb2k/a_jsonxml_converter_that_handles_50gb_files_from/ | `json-to-xml`, `xml-to-json` (but likely not streaming 50GB) | Content/tool gap: “Large JSON/XML conversion in browser — memory limits, streaming, and when to use CLI.” |
| “Free tool to visualize JSON as a graph instead of reading it” | Reddit r/webdev — https://reddit.com/r/webdev/comments/1s602e4/showoff_saturday_free_tool_to_visualize_json_as_a/ | `json-graph-visualizer` | Existing graph visualizer content matches; engagement opportunity around nested API response exploration and search. |
| “Cropt — a simple image cropper with great UX” | Reddit r/javascript — https://reddit.com/r/javascript/comments/1ta2m0y/cropt_a_simple_image_cropper_with_great_ux/ | `image-cropper`, `square-crop`, `circle-crop`, `image-resizer` | Existing crop privacy post exists; gap is developer-facing “profile picture cropper UX: aspect ratios, scaling quality, and pre-upload privacy.” |

## Content Gaps (questions with no good answer online)
1. Regex `split()` empty strings → blog post idea: “Why regex split returns empty strings — capturing groups, zero-width matches, and how to test fixes visually.”
2. Optional multiline regex groups → blog post idea: “How to debug multiline regex with optional sections using a browser regex tester.”
3. Base64 ↔ hex with spacers → blog post idea: “Convert Base64 to hex bytes with grouping: debugging tokens, hashes, and binary payloads.”
4. JSON string embedded inside JSON → blog post idea: “How to inspect nested JSON strings: parse twice, format, then query with JSONPath.”
5. Secret/password scanning with regex → blog post idea: “Regex for secret detection: useful patterns, dangerous false positives, and safer validation workflows.”
6. Huge JSON/XML conversion in browser → blog post idea: “Can a browser convert 50GB JSON/XML? Streaming, Web Workers, and realistic limits.”
7. Base64 for filenames/URLs → blog post idea: “Base64 vs URL-safe Base64 for filenames: padding, slashes, plus signs, and decoding pitfalls.”

## New Tool Ideas
- Base64 ↔ hex converter with byte grouping — developers debugging binary payloads want hex output with configurable spacers (`AA BB CC`, `AA:BB:CC`, `0xAA`).
- Secret pattern tester / redaction preview — lets users test common API key/password regexes against sample logs and see false positives before shipping scanners.
- Streaming large-file JSON/XML converter — Reddit interest shows demand for browser-side huge file conversion; Toolblip currently has converters but not an explicit large-file streaming UX.
- Regex split debugger — explains delimiters, captured separators, zero-width matches, and empty outputs step-by-step.
- Profile/avatar cropper presets — focused image cropper mode for square/circle avatars, output sizes, retina scaling, and pre-upload privacy.
- JSON string unescaper / parse-nested-JSON helper — one-click detect stringified JSON values inside JSON and open them formatted.

## Reddit/Social Discussions to Engage With
- https://reddit.com/r/webdev/comments/1t2ypqe/showoff_saturday_i_built_a_localfirst_text/ — Local-first JSON/regex/text toolkit; good place to discuss Toolblip’s privacy-first browser tools and VS Code tradeoffs.
- https://reddit.com/r/webdev/comments/1sp4fib/seeking_feedback_i_built_a_suite_of_100/ — Privacy-first developer utilities; comment with constructive positioning around client-side processing.
- https://reddit.com/r/webdev/comments/1schb2k/a_jsonxml_converter_that_handles_50gb_files_from/ — Large JSON/XML conversion; ask about streaming limits and mention Toolblip’s converter roadmap only if relevant.
- https://reddit.com/r/webdev/comments/1s602e4/showoff_saturday_free_tool_to_visualize_json_as_a/ — JSON graph visualization; useful overlap with Toolblip’s `json-graph-visualizer`.
- https://reddit.com/r/RealDebrid/comments/1ta2jy8/base64_encodedecode/ — Base64 filename encoding question; answer educationally about URL-safe Base64 and policy limitations, not promotional.
- https://reddit.com/r/javascript/comments/1ta2m0y/cropt_a_simple_image_cropper_with_great_ux/ — Image cropper UX; useful inspiration for Toolblip image cropper presets and quality notes.

## Research Notes
- Stack Overflow API returned no last-30-day questions with 10+ votes for `[json]`, `[regex]`, `[url-encoding]`, or `[base64]`, so I relaxed the vote threshold to capture actionable recent questions.
- Reddit `r/DeveloperTools` returned 404 via Reddit JSON API, so broader Reddit search and `r/webdev`/`r/programming` were used.
- `findquestions.com` and AnswerThePublic did not expose usable question data through lightweight search/fetch; DuckDuckGo results mainly showed competing tool pages, not real Q&A threads.
