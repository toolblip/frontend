# Toolblip TODO

## In Progress

### Tool Content Quality
**Progress: 790 / 790 tools have unique content (6 handcrafted + 784 generated)**

**Phase 1: Initial Generation (Complete)**
- [x] Generate unique descriptions for all 790 tools
- [x] Add code examples (2-3 per tool)
- [x] Add key features (4 per tool)
- [x] Create collapsible "More about {toolName}" section
- [x] Deploy to production

**Phase 2: Quality Review (In Progress)**
- [ ] Review generated content quality (spot-check tools)
- [ ] Improve descriptions for high-traffic tools
- [ ] Add more specific code examples for popular tools

**Handcrafted Tools (6/790):**
1. json-formatter ✅ (handcrafted)
2. json-validator ✅ (handcrafted)
3. base64-encoder-decoder ✅ (handcrafted)
4. color-picker ✅ (handcrafted)
5. password-generator ✅ (handcrafted)
6. markdown-preview ✅ (handcrafted)

### Google Search Console Indexing
- [x] Add unique content to all 790 tools (descriptions, code examples, features)
- [x] Create collapsible "More about {toolName}" section on every tool page
- [x] Deploy to production
- [x] Resubmit 100 URLs via IndexNow
- [ ] Wait 1-2 weeks for Google to re-crawl updated pages
- [ ] Check GSC again to see if indexing improves
- [ ] Fix remaining IndexNow submissions (rate-limited)

### Directory Submissions
- [ ] SourceForge registration (user manual - browser issues)
- [ ] Submit to BetaList
- [ ] Submit to Crunchbase
- [ ] Submit to LinkedIn
- [ ] Submit to Pinterest
- [ ] Submit to Dev.to
- [ ] Submit to other platforms

### Product Hunt Launch Prep
- [ ] Prepare Product Hunt page
- [ ] Create launch assets (screenshots, logo, tagline)
- [ ] Schedule launch date
- [ ] Prepare maker comment

## Completed

- [x] Stripe production switch (live payments)
- [x] Blog pipeline (2x/week, Tue & Thu)
- [x] OG images for all blog posts
- [x] Favicon fix
- [x] Status page (/frontend-health)
- [x] API Keys dashboard
- [x] Subscription modal redesign
- [x] Share panel redesign (9 icons, QR code)
- [x] QR code caching (localStorage)
- [x] E2E tests (28/28 passing)
- [x] Branch cleanup (35 stale branches deleted)
- [x] Unique content for all 790 tools

## Notes

- GSC credentials in project `.env` (not in `~/.openclaw/secrets/tb.env`)
- IndexNow key: `toolblip-indexnow-key-2024`
- Railway token in `.secrets/tb.env`
- All coding through Claude Code via `./claude.sh` in tmux
