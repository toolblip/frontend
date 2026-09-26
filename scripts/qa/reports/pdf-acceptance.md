pdf: 11 routes

Acceptance incomplete: exact remaining route failures below

Report revision: `52205bc16c923805c065d48f0659a626f04585b6`. Artifacts: `/private/tmp/auto-data-pdf-accepted-c7SPWr`. Each attempt retains its own revision/diff hash.

| Route | Chrome overall / functional | WebKit overall / functional |
|---|---|---|
| add-pages-to-pdf | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-chrome-browser/tools/add-pages-to-pdf.json) | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-webkit-interrupted/tools/add-pages-to-pdf.json) |
| add-watermark-to-pdf | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-chrome-corrected/tools/add-watermark-to-pdf.json) | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-webkit-corrected/tools/add-watermark-to-pdf.json) |
| annotate-pdf | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-chrome-positions/tools/annotate-pdf.json) | [failed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-webkit-positions/tools/annotate-pdf.json) |
| delete-pages-from-pdf | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-chrome-corrected/tools/delete-pages-from-pdf.json) | [failed / failed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-webkit-connection-recovery/tools/delete-pages-from-pdf.json) |
| edit-pdf | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-chrome-positions/tools/edit-pdf.json) | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-webkit-positions/tools/edit-pdf.json) |
| extract-images-from-pdf | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-chrome-browser/tools/extract-images-from-pdf.json) | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-webkit-corrected/tools/extract-images-from-pdf.json) |
| merge-pdfs | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-chrome-browser/tools/merge-pdfs.json) | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-webkit-corrected/tools/merge-pdfs.json) |
| pdf-password-remover | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-chrome-browser/tools/pdf-password-remover.json) | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-webkit/tools/pdf-password-remover.json) |
| pdf-rearrange | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-chrome-corrected/tools/pdf-rearrange.json) | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-webkit-connection-recovery/tools/pdf-rearrange.json) |
| sign-pdf | [failed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-chrome-corrected/tools/sign-pdf.json) | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-webkit-interrupted/tools/sign-pdf.json) |
| unlock-pdf | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-chrome-corrected/tools/unlock-pdf.json) | [passed / passed](/private/tmp/auto-data-pdf-accepted-c7SPWr/pdf-webkit-corrected/tools/unlock-pdf.json) |

Tests: 124 scoped Vitest tests and 15 PDF fixture tests passed; `tsc --noEmit` and scoped `git diff --check` passed.

The JSON report retains every attempt, exact failure messages, runtime errors, run fatal errors, revisions, and artifact paths. Anonymous auth 401s remain recorded nonblocking observations. API CORS/502 errors remain blocking. Browser shutdown timeouts remain run failures even when individual routes passed.
