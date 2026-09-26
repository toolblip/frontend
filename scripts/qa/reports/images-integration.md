# Image browser integration report

Status: **blocked local integration; not a production acceptance**. All counts distinguish a functional pass from a page visit or a pre-hydration failure. Earlier failed attempts remain linked in `images.json`.

## Changes

- Image cases wait for actual React click handlers before uploading; the framework-script check alone allowed uploads before onChange attached. Crop/circle export then passed.
- Image download helper awaits click and download together so a timeout is recorded rather than crashing the process.
- Fetched X posts no longer inherit today's timestamp, custom engagement, or verified badge. Empty fetched text cannot report success.
- Added `helpers/images-real-capabilities.mjs` for actual external X retrieval and local model inference, with no response mocks.

## Counts

| Engine | Assigned | Attempted | Observed full pass | Not accepted |
|---|---:|---:|---:|---:|
| chrome | 24 | 24 | 4 | 20 |
| webkit | 24 | 24 | 8 | 16 |

An observed pass refers to the linked successful attempt, not a clean latest full-suite run. The requested group command also selected 30 historically approved routes without supplied functional fixtures; those were not promoted to passes. Unblur is retired and excluded from the 24 active assignment.

| Route | Chrome | WebKit |
|---|---|---|
| crop | [observed pass](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-hydration-3/tools/crop.json) | [observed pass](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-recovered-4/tools/crop.json) |
| crop-circle | [observed pass](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-hydration-3/tools/crop-circle.json) | [observed pass](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-pending-2/tools/crop-circle.json) |
| detect | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-recovered-6/tools/detect.json) | [observed pass](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-pending-2/tools/detect.json) |
| font-to-png | [observed pass](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-recovered-6/tools/font-to-png.json) | [observed pass](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-pending-2/tools/font-to-png.json) |
| meme-maker | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-recovered-6/tools/meme-maker.json) | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-recovered-4/tools/meme-maker.json) |
| profile-photo | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/profile-photo.json) | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/profile-photo/tools/profile-photo.json) |
| resize | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/resize.json) | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/resize/tools/resize.json) |
| rotate | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/rotate.json) | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/rotate/tools/rotate.json) |
| dpi-ppi-calculator | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/dpi-ppi-calculator.json) | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/dpi-ppi-calculator/tools/dpi-ppi-calculator.json) |
| favicon-from-emoji | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/favicon-from-emoji.json) | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/favicon-from-emoji/tools/favicon-from-emoji.json) |
| image-scale-calculator | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/image-scale-calculator.json) | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/image-scale-calculator/tools/image-scale-calculator.json) |
| image-dimension-checker | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/image-dimension-checker.json) | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/image-dimension-checker/tools/image-dimension-checker.json) |
| image-background-remover | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/image-background-remover.json) | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/image-background-remover/tools/image-background-remover.json) |
| pixel-density-calculator | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/pixel-density-calculator.json) | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/pixel-density-calculator/tools/pixel-density-calculator.json) |
| base64-image-viewer | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/base64-image-viewer.json) | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/base64-image-viewer/tools/base64-image-viewer.json) |
| photo-metadata-remover | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/photo-metadata-remover.json) | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/photo-metadata-remover/tools/photo-metadata-remover.json) |
| image-size-resizer | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/image-size-resizer.json) | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/image-size-resizer/tools/image-size-resizer.json) |
| banner-generator | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/banner-generator.json) | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/banner-generator/tools/banner-generator.json) |
| image-dpi-resizer | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/image-dpi-resizer.json) | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/image-dpi-resizer/tools/image-dpi-resizer.json) |
| batch-image-resizer | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/batch-image-resizer.json) | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/batch-image-resizer/tools/batch-image-resizer.json) |
| browser-image-resizer | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/browser-image-resizer.json) | [observed pass](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/browser-image-resizer/tools/browser-image-resizer.json) |
| favicon-png-maker | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/favicon-png-maker.json) | [observed pass](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/favicon-png-maker/tools/favicon-png-maker.json) |
| favicon-icon-generator | [blocked/failed](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/favicon-icon-generator.json) | [observed pass](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/favicon-icon-generator/tools/favicon-icon-generator.json) |
| tweet-to-image-converter | [observed pass](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-chrome-remaining-5/tools/tweet-to-image-converter.json) | [observed pass](/var/folders/j0/vpq48k1j0dsbwdkv6lpsqzvc0000gn/T/opencode/auto-images-webkit-individual-3/tweet-to-image-converter/tools/tweet-to-image-converter.json) |

## Real capability evidence

- Chrome AI: all recorded self-hosted model requests returned HTTP 200; real inference exported a 640×427 PNG. Original had 273,280 opaque pixels; output alpha spans 0–254 with foreground and transparent regions. Landscape cutout quality is poor, so this is inference/export acceptance only. [Network/UI evidence](/tmp/images-real-probe/chrome-2/ai.json), [PNG](/tmp/images-real-probe/chrome-2/ai-result.png), [screenshot](/tmp/images-real-probe/chrome-2/ai.png).
- WebKit AI: real load failed and hot reload/resource errors followed; 180-second wait produced no output. [Initial failed evidence](/tmp/images-real-probe/webkit-2/ai.json), [latest failed retry](/tmp/images-real-probe/webkit-ai-recovered/ai.json).
- Public X: actual `https://x.com/jack/status/20` redirects through publish.twitter.com to publish.x.com, HTTP 200. Chrome produced text PNG; WebKit produced the actual post and avatar after timestamp correction. [Corrected WebKit PNG](/tmp/images-real-probe/webkit-2/x-result.png), [network evidence](/tmp/images-real-probe/webkit-2/x.json), [original Chrome PNG showing defect](/tmp/images-real-probe/chrome-2/x-result.png). Corrected Chrome acceptance rerun failed before hydration; [initial evidence](/tmp/images-real-probe/chrome-x-final/x.json), [latest retry](/tmp/images-real-probe/chrome-x-recovered/x.json).
- Partial modes: X text is capped at 280 characters; media, threads, private/deleted posts, original publication time and engagement are not verified. Avatar service is optional and can fall back to an initial. AI segmentation quality varies; WebKit is not accepted. Color-key correctness is separate from AI.

## Validation and environment

- Scoped Vitest: 8 files / 72 tests passed, exit 0.
- Initial tsc: exit 2 on concurrent media-worker `pcmMp3` import. After that worker added the export, `tsc --noEmit --incremental false --pretty false` passed, exit 0.
- `node --check` passed for image cases and live capability helper. Image diff whitespace check passed.
- Shared development page JavaScript download failed with curl exit 18, missing 35,420,799 bytes; another response delivered 38,369,926 bytes and parsed. Browser errors include `Unexpected EOF`, `Invalid or unexpected token`, pre-hydration timeouts and resource/hot reload failures. [Headers](/tmp/images-real-probe/chunk-headers.txt).
- WebKit runner aborted on uncaught `stripDevUpgradeCSP` route.fetch timeout/TargetClosedError. Per-route subprocesses preserve evidence for later routes without changing the runner. WebKit removes local-only upgrade-insecure-requests; this is not unchanged production CSP acceptance.
- Anonymous auth 401 observations remain in raw reports; they are the runner's narrow nonblocking auth classification. Shared runtime errors remain blocking.
- Last narrow retries were stopped after renewed pre-hydration failures; all 24 routes already had attempts. Newly successful font/crop results are retained; unvisited retry entries are not counted as passes.
- No server, build, commit, delegation, runner, central metadata, or other-group edits by this worker. Independent outputs were preserved.

## Next owner action

Stabilize the shared development server/bundle and runner interception teardown, then rerun only the routes without accepted evidence and WebKit AI. Parent owns production acceptance.
