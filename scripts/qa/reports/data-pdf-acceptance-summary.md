Local data + PDF acceptance remains incomplete.

- Developer data: 27/27 route passes in Chrome and 27/27 in WebKit.
- PDF: Chrome 10/11 route passes (11/11 functional); WebKit 9/11 route passes (10/11 latest functional).
- All 38 routes were exercised in both engines. Across recorded attempts every route/engine completed its functional case, but this does not override later failures. Latest overall result: 73/76 route-engine passes.
- Remaining: Chrome `sign-pdf` and WebKit `annotate-pdf` retain blocking API CORS/502 errors despite complete functional passes. WebKit `delete-pages-from-pdf` latest attempt failed waiting for `Page 4, kept` during an observed same-route navigation; an earlier complete functional pass was followed by a detached-DOM layout failure. Neither attempt is accepted.
- Chrome placement and final two data-route runs recorded `Browser server close timeout after 5000ms`. Their route passes remain evidence, but the command exits remain nonzero.

Reusable regressions are wired into existing cases with 38 unique slugs. XML errors now recognize Chromium/WebKit's XHTML parser-error namespace. Cleaner metadata, SQL mode, bounded regex outcomes, PDF pointer coordinates/Remove mode, pixel sampling, and download rejection handling were corrected. PDF.js rendered downloaded annotation, edit and signature exports for 0/90/180/270 degrees with square and rectangular CropBoxes in both engines. Image extraction checked real PNG RGBA pixels and original JPEG bytes. No fixture budget increase was needed; unsupported decode/predictor paths remain explicitly skipped without downloads.

Validation: 124 scoped tests, 15 PDF fixture tests, TypeScript and scoped diff checks passed. Browser notebook regressions exercise 150 KB paste/upload and downloaded embedded PNG decoding; the 10 MiB budget is also covered by scoped library tests. This is local HTTP acceptance with the requested WebKit CSP override, not production acceptance. No new server/build, commit, delegation, harness/config/ToolUI edit, or deployment was performed.

Revision at report: `52205bc16c923805c065d48f0659a626f04585b6`. Initial revision was `7c3134eb1d5c189ea7c16c837abd46cbbf66b667`; concurrent workers advanced HEAD. Every run's metadata retains its own revision, working diff hash, fixture hashes, inventory hash and options.

- [Data route matrix](developer-data-acceptance.md), [full data report](developer-data.json)
- [PDF route matrix](pdf-acceptance.md), [full PDF report](pdf.json)
- [Artifact directory](/private/tmp/auto-data-pdf-accepted-c7SPWr) includes original failures, targeted reruns, downloads, PDF.js renders, screenshots and test logs.

Parent follow-up: stabilize development reloads and the shared API CORS/502 responses, then rerun only the three blocked route-engine pairs. Resolve browser shutdown failure separately; do not reinterpret it as a clean command exit. Production deployment and automatic approval remain with the parent.
