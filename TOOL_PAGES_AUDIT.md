# Toolblip Tool Pages SEO & Content Audit

**Date:** 2026-04-09
**Scope:** 10 tool pages in `src/pages/tools/`

---

## Audit Table

| Tool | Title OK | Meta OK | Description OK | FAQ OK | Internal Links | Issues |
|------|----------|---------|----------------|--------|----------------|--------|
| **base64** | ✅ | ✅ | ✅ | ❌ | ✅ (2) | No FAQ, minimal description depth |
| **case-converter** | ✅ | ✅ | ✅ | ❌ | ✅ (2) | No FAQ, single paragraph description |
| **character-counter** | ✅ | ✅ | ✅ | ❌ | ✅ (2) | No FAQ, minimal description |
| **image-cropper** | ✅ | ✅ | ✅ | ❌ | ⚠️ (1) | Only 1 internal link, no FAQ |
| **json-formatter** | ✅ | ✅ | ✅✅ | ✅✅ (8 Qs) | ✅ (3+) | Best-in-class; has all features |
| **markdown-to-html** | ✅ | ✅ | ✅ | ❌ | ✅ (2) | No FAQ, minimal description |
| **remove-duplicate-lines** | ✅ | ✅ | ✅ | ❌ | ✅ (2) | No FAQ, minimal description |
| **url-encode** | ✅ | ✅ | ✅ | ❌ | ✅ (2) | No FAQ, brief description |
| **uuid-generator** | ✅ | ✅ | ✅ | ❌ | ✅ (2) | No FAQ, minimal description |
| **word-counter** | ✅ | ✅ | ✅✅ | ✅✅ (8 Qs) | ✅ (4) | Best-in-class; comprehensive |

**Summary:** All 10 titles and meta descriptions pass. Only 2 of 10 have FAQ sections. Only 2 of 10 have multi-paragraph descriptions and How-to sections.

---

## Top 5 Highest-Impact Improvements

### 1. Add FAQ sections to 8 tools (CRITICAL)
- **Impact:** Rich snippet eligibility, higher CTR, answers user intent
- **Current state:** Only `json-formatter` and `word-counter` have FAQPage schema
- **Action:** Add 5-8 unique questions per tool — use `json-formatter` as the template
- **Effort:** ~2 hours (reusable patterns)
- **SEO benefit:** FAQ rich snippets, increased SERP real estate

### 2. Expand tool descriptions to 3+ paragraphs (HIGH)
- **Current state:** 8 of 10 tools have a single paragraph; `json-formatter` and `word-counter` are the model
- **Action:** Add use cases, key features, privacy notes, and alternatives comparison
- **Effort:** ~1.5 hours
- **SEO benefit:** Keyword density, dwell time, topical authority

### 3. Add "How to Use" sections to 8 tools (HIGH)
- **Current state:** `slot="how-to-use"` exists in ToolLayout but unused on 8 tools
- **Action:** Add 3-5 numbered steps per tool — use `word-counter` as the template
- **Effort:** ~1 hour
- **SEO benefit:** Informational intent coverage, accessibility, content length

### 4. Standardize and expand internal linking (MEDIUM)
- **Current state:** Most tools link to 2 tools; `image-cropper` links to only 1; no cross-category discovery
- **Action:** Every tool should link to 3-5 tools; add bidirectional links; include cross-category suggestions
- **Effort:** ~30 minutes (once ToolLayout updated)
- **SEO benefit:** PageRank distribution, crawlability, internal click-through

### 5. Add SoftwareApplication schema to all tools (MEDIUM)
- **Current state:** `json-formatter` has SoftwareApplication + FAQPage schema; most others only have BreadcrumbList (from ToolLayout)
- **Action:** Move schema generation into ToolLayout so all tools inherit it
- **Effort:** ~45 minutes
- **SEO benefit:** Rich snippet eligibility, app-specific SERP features

---

## Secondary Observations

- **OG images:** No tool page sets `ogImage` — prop exists in BaseLayout but unused. Generic social previews are a missed CTR opportunity.
- **Slot usage:** `slot="description"` and `slot="related"` — used by all 10. `slot="how-to-use"` and `slot="faq"` — used by only 2.
- **Ad slots:** Both sponsor placeholders in ToolLayout are present and styled correctly — ready for AdSense/affiliate integration.
- **Title quality:** All 10 are keyword-rich, unique, action-oriented (40-80 chars) — no changes needed.
- **Meta description quality:** All present, 98-133 chars, descriptive — no changes needed.

---

## Overlap with Existing PRD / TASKS

### Already Captured in LAUNCH_PLAN.md
- FAQ sections missing (0/10 → 2/10 done) — confirmed by this audit
- How-to sections missing (0/10 → 2/10 done) — confirmed by this audit
- LAUNCH_PLAN targets "4 flagship tools" in Days 4-7; this audit recommends expanding to all 10

### Already Captured in INFORMATION_ARCHITECTURE.md
- Centralizing tool registry to `src/data/tools.ts` with `relatedSlugs[]` will automate related-tool linking
- This audit's improvement #4 aligns directly — manual linking is inconsistent today

### Not Yet Planned (New Gaps)
- Description expansion (improvement #2) — not mentioned in launch docs
- SoftwareApplication schema on all tools (improvement #5) — only `json-formatter` has it

---

## Overall Grade: B+

**Strengths:** All titles/metas are high quality. ToolLayout provides excellent slot infrastructure. Two flagship tools demonstrate best-in-class content. All tools functional with basic internal linking and BreadcrumbList schema.

**Path to A:** Complete improvements 1-5 above (~5-6 hours). This maps cleanly onto the Days 4-7 SEO hardening phase in LAUNCH_PLAN.md.
