# Media conversion integration

Real MP3, all eight mappings, AAC-LC fallback, WebP fallback, WebKit video timing, hydration readiness, and owned mobile grid fixes are implemented. No shared runner or protected components were edited.

Supplemental raw results and runnable diagnostic scripts: `/private/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/media-supplemental-proof`.

Latest per-route integrated statuses (Chrome full run 3 plus reruns 4/5; WebKit full run 4 plus reruns 5/6) are below; isolated component proof passes all 36 in both browsers across the initial run and affected-route rechecks. Integrated failures are retained and do not count as acceptance.

| Route | Chrome | WebKit | Isolated Chrome/WebKit |
|---|---|---|---|
| sql-to-json | passed | passed | passed/passed |
| binary-decimal-hex-converter | passed | passed | passed/passed |
| temperature-unit-converter | passed | passed | passed/passed |
| base-number-converter | passed | passed | passed/passed |
| aac-to-wav | failed | failed | passed/passed |
| add-subtitles | failed | failed | passed/passed |
| csv-to-excel | passed | passed | passed/passed |
| csv-to-xml | passed | passed | passed/passed |
| cutter | failed | failed | passed/passed |
| excel-to-csv | passed | passed | passed/passed |
| excel-to-pdf | passed | passed | passed/passed |
| excel-to-xml | passed | passed | passed/passed |
| extract-audio | failed | failed | passed/passed |
| gif-to-apng | passed | passed | passed/passed |
| gif-to-jpg | passed | passed | passed/passed |
| gif-to-png | passed | passed | passed/passed |
| heic-to-jpg | passed | passed | passed/passed |
| heic-to-png | passed | passed | passed/passed |
| jpg-to-png | passed | passed | passed/passed |
| jpg-to-webp | passed | failed | passed/passed |
| m4a-to-wav | failed | failed | passed/passed |
| mkv-to-mp3 | failed | failed | passed/passed |
| mp4-to-mp3 | failed | failed | passed/passed |
| mp4-to-wav | failed | failed | passed/passed |
| png-to-webp | passed | failed | passed/passed |
| svg-to-png | passed | passed | passed/passed |
| svg-to-jpg | passed | passed | passed/passed |
| svg-to-webp | passed | failed | passed/passed |
| trace | passed | passed | passed/passed |
| webp-to-jpg | passed | failed | passed/passed |
| webp-to-png | passed | failed | passed/passed |
| base64-image-decoder | passed | passed | passed/passed |
| all-in-one-unit-converter | passed | passed | passed/passed |
| markdown-table-from-json | passed | passed | passed/passed |
| general-unit-converter | passed | passed | passed/passed |
| bin-hex-dec-converter | passed | passed | passed/passed |

Central blocker: effective CSP must permit `media-src 'self' blob:`. Other observed failures include transient PDF conflict compilation, HMR reloads, hydration and engagement fetch errors. Exact per-route errors and artifacts are in `media-conversion.json`.

Validation: 60 scoped tests pass; scoped TypeScript passes. No build/commit/server was started.

Central copy: describe real 128 kbps mono/stereo LAME MP3, the 20 MB/120-second audio limit, AAC-LC-only demux fallback, bundled local WebP fallback, and the 30 MB/120-source-second/60-export-second video limit with a browser-decodable audio track. Do not claim universal codec support.
