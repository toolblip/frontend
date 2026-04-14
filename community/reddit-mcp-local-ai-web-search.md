# Reddit Community Comment Draft

**Platform:** Reddit
**Subreddit:** r/LocalLLaMA
**Thread:** "I made a free local web search/scraping tool using MCP and llama.cpp web UI"
**Original Post Author:** AuthBits
**Post ID:** 1sh1a5p
**Date:** ~April 2026 (found in weekly top posts)

---

Hey, this is a solid setup. A few things that might push it further:

**Parallel extraction.** Your `_fetch_pages` already uses `asyncio.gather`, which is great. But if the user passes multiple URLs to `extract`, you're fetching sequentially in the `else` branch (light fetch). Easy win — just reuse the same `asyncio.gather` pattern for `use_browser=False` too. Should cut extraction time proportionally to URL count.

**Streaming citations.** Your extract tool returns structured data, but the model doesn't know *which* URL the info came from unless the LLM summarises it back. You could prepend `[{url}]` tags to each content block before sending to the LLM, or log them in the returned JSON under a `sources` key. For research workflows, source attribution is half the value.

**Try a two-stage extract.** First pass: cheap 3-4B model extracts a one-line summary + relevance score per URL. Second pass: only the relevant ones go to the full extraction model. Saves a lot of unnecessary Playwright launches for broad queries.

**LLM temperature on extract.** You've set `temperature: 0.1`, which is good. For extraction tasks with a schema, you might want to try `temperature: 0` — deterministic extraction is almost always better when you have a fixed output structure. Noise in the generation only hurts schema conformance.

The observation about quantized models flipping the optimization landscape (draft becomes bottleneck on int4/int8 targets) is sharp — that's a real structural issue with speculative decoding on bandwidth-bound hardware. Good write-up.

What does your Playwright timeout strategy look like for paywalled or JS-heavy sites? Do you fall back to the light fetch automatically, or does the user just get a short result?

---

*Note: This is a draft comment. Do not post if the thread has been removed or the conversation has moved on significantly. The goal is genuine technical help, not promotion.*
