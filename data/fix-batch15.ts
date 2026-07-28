// Rewritten content for 10 tools flagged for quality issues.
// Not wired into the app yet - staged for review before merging into data/tool-content.ts.

export interface FixBatchExample {
  title: string;
  code: string;
  note?: string;
}

export interface FixBatchEntry {
  description: string;
  examples: FixBatchExample[];
}

const FIX_BATCH_15: Record<string, FixBatchEntry> = {
  'psd-to-png': {
    description: `A PSD file is really a stack of separate layers, adjustment layers, layer masks, and blend modes bundled together, and getting a flat image out of it means either exporting from Photoshop directly or handing over a file most other software can't open at all. This tool takes a PSD and flattens it into a single PNG, merging every visible layer in the correct stacking order and blend mode, while keeping any transparency intact rather than filling it in with a solid background. That transparency detail matters specifically for PSDs built with a transparent canvas, a logo, an icon, a design element meant to sit on top of something else, since a naive flatten would otherwise paint over what should stay see-through. Useful for getting a usable image out of a PSD when Photoshop isn't installed, or when a design file needs to become an image other software can open.`,
    examples: [
      {
        title: 'Flatten a multi-layer design into a single image',
        code: `Input: homepage-mockup.psd (12 layers, 3 blend modes)\nOutput: homepage-mockup.png (flattened, layer order preserved)`,
        note: 'Merges every visible layer in the correct stacking order automatically.',
      },
      {
        title: 'Export a logo with transparency intact',
        code: `Input: logo.psd (transparent canvas)\nOutput: logo.png (transparent background preserved)`,
        note: 'Keeps the transparent background instead of filling it with a solid color.',
      },
    ],
  },

  'sentence-extractor': {
    description: `Breaking a block of text down into individual sentences sounds trivial until you actually try to automate it, since a period ends a sentence most of the time but also shows up in abbreviations like "Dr." and "U.S." and in decimal numbers, which trips up a naive split-on-period approach constantly. This tool extracts every sentence from a text block correctly, handling those common exceptions, and numbers each one, then lets the result be exported as a clean list instead of a single wall of text. Useful for pulling a specific sentence out of a long document by its number when giving feedback, breaking a transcript down into individual statements for closer analysis, or checking exactly how many sentences a piece of writing actually contains rather than estimating from paragraph count.`,
    examples: [
      {
        title: 'Handle abbreviations correctly',
        code: `Input: "Dr. Smith arrived at 9 a.m. She reviewed the file."\nOutput: 1. "Dr. Smith arrived at 9 a.m." 2. "She reviewed the file."`,
        note: 'Does not split on the periods inside "Dr." or "a.m." the way a naive split would.',
      },
      {
        title: 'Reference a specific sentence by number',
        code: `Input: [500-word article]\nOutput: 24 numbered sentences, e.g. "Sentence 14: The results were inconclusive."`,
        note: 'Makes it easy to point to one exact sentence when giving feedback on a draft.',
      },
    ],
  },

  'sitemap-urls-extractor': {
    description: `An XML sitemap is built for a machine to read, not a person, a long file of <loc> and <lastmod> tags that isn't especially useful to look at directly when what you actually need is simply the list of URLs it contains. This tool pulls just that out: point it at a sitemap file or URL, and get back a clean, plain list of every page URL listed inside, stripped of the surrounding XML tags and metadata. Useful for auditing how many pages a site's sitemap actually declares compared to what a crawl tool finds, checking a competitor's sitemap to see their site structure and how many pages they have indexed, or pulling a URL list to feed into another SEO tool that expects a plain list rather than raw XML.`,
    examples: [
      {
        title: 'Pull a plain URL list from a sitemap',
        code: `Input: https://example.com/sitemap.xml\nOutput: 340 URLs, one per line, tags stripped`,
        note: 'Turns machine-formatted XML into a plain list ready for a spreadsheet or another tool.',
      },
      {
        title: 'Compare a sitemap against what a crawler finds',
        code: `Input: sitemap.xml (215 URLs)\nCrawl result: 198 URLs found\nGap: 17 URLs listed in the sitemap but not discovered by crawling`,
        note: 'Surfaces pages the sitemap claims exist that regular crawling never actually reaches.',
      },
    ],
  },

  'currency-converter': {
    description: `Exchange rates shift by the hour, sometimes by the minute during volatile periods, which means a currency conversion done with yesterday's rate can already be noticeably off by the time it's actually used for something that matters, a quote, a budget, a purchase decision. This tool converts an amount between currencies using a live, current exchange rate rather than a cached or approximate figure, so the number reflects what the conversion would actually be worth right now. Useful for checking what a price actually costs in a home currency while shopping on a foreign site, converting a quoted amount before accepting an international payment, or working out a travel budget in the currency it'll actually be spent in rather than guessing at a rough round number.`,
    examples: [
      {
        title: 'Check a price while shopping on a foreign site',
        code: `Input: €89.00\nOutput: $96.42 (current rate)`,
        note: 'Uses a live rate rather than a rate that might be a day or more out of date.',
      },
      {
        title: 'Convert a travel budget into local currency',
        code: `Input: $2,000 USD\nOutput: ¥298,600 JPY (current rate)`,
        note: 'Reflects the rate at the moment of conversion, not a rounded estimate.',
      },
    ],
  },

  'png-to-webp': {
    description: `PNG earns its place specifically because it's lossless and supports full transparency, which is exactly why a naive conversion to WebP is worth double-checking rather than assuming it just works: WebP supports both a lossy mode, tuned for photos, and a lossless mode, which is the one that actually matches what PNG is for. This tool converts PNG to WebP in lossless mode by default, keeping the transparency channel fully intact and avoiding the visible artifacts a lossy conversion would introduce around sharp edges and text, the kind of content PNG usually holds in the first place, screenshots, icons, graphics with flat color. The result is still meaningfully smaller than the original PNG despite losing nothing visually. Useful for shrinking a screenshot, an icon, or a graphic with transparency without introducing the fuzziness lossy compression would cause around hard edges.`,
    examples: [
      {
        title: 'Convert a screenshot without losing sharpness',
        code: `Input: screenshot.png (840 KB)\nOutput: screenshot.webp (310 KB, lossless, identical pixels)`,
        note: 'Lossless mode avoids the blurring a lossy conversion would cause around text and hard edges.',
      },
      {
        title: 'Preserve transparency on an icon',
        code: `Input: icon.png (transparent background)\nOutput: icon.webp (transparency preserved, smaller file)`,
        note: 'Confirms the alpha channel survives the conversion instead of being flattened.',
      },
    ],
  },

  'css-validator': {
    description: `Browsers are remarkably forgiving of broken CSS, a mistyped property name or an unsupported value just gets silently ignored rather than throwing an error, which means a genuine mistake can sit in a stylesheet for months without anyone noticing until a specific browser or a specific user finally reveals it. This tool checks CSS against the actual W3C specification instead of a browser's forgiving guesswork, flagging a genuine syntax error, a property that isn't valid CSS at all, or a value that doesn't match what a property actually accepts, the kind of mistake that would otherwise fail invisibly rather than loudly. It also flags certain accessibility-relevant issues, like color declarations that could affect contrast. Useful for catching a stylesheet mistake before it ships, rather than relying on a browser's silent tolerance to mask it indefinitely.`,
    examples: [
      {
        title: 'Catch a mistyped property name',
        code: `Input: .card { colour: #333; }\nResult: error, "colour" is not a valid CSS property (did you mean "color"?)`,
        note: 'A browser would silently ignore this line instead of surfacing the typo.',
      },
      {
        title: 'Flag an unsupported property value',
        code: `Input: .box { display: inline-grid-flex; }\nResult: error, "inline-grid-flex" is not a valid value for display`,
        note: 'Surfaces a value the spec never defined, which a browser would otherwise just skip.',
      },
    ],
  },

  'jpg-to-webp': {
    description: `Two images at the exact same file size don't necessarily look the same once compressed, and that's the real comparison worth making between JPEG and WebP rather than just checking size after conversion. At a matched file size, WebP typically preserves more visible detail than JPEG, sharper edges, fewer blocking artifacts in busy areas of a photo, which means the honest question isn't just how much smaller a WebP file is, it's how much better it looks at whatever size a page actually needs. This tool converts a JPEG into WebP with the compression level adjustable, so output can be tuned toward matching the original file size at higher quality, or matching the original quality at a smaller size, whichever tradeoff matters for where the image is going. Useful for a photography portfolio site where visible quality at a given load time matters as much as raw file size.`,
    examples: [
      {
        title: 'Match the original file size at higher quality',
        code: `Input: portfolio-photo.jpg (400 KB)\nOutput: portfolio-photo.webp (400 KB, noticeably sharper detail)`,
        note: 'At the same file size, WebP typically preserves more visible detail than JPEG.',
      },
      {
        title: 'Match the original quality at a smaller size',
        code: `Input: portfolio-photo.jpg (400 KB)\nOutput: portfolio-photo.webp (240 KB, visually equivalent)`,
        note: 'Shrinks the file while holding quality steady instead of holding size steady.',
      },
    ],
  },

  'word-scramble-generator': {
    description: `A scrambled word generator that just shuffles letters randomly runs into two specific failure modes surprisingly often: the shuffle occasionally lands back on the original word unchanged, or it accidentally produces a completely different valid word instead of a jumbled non-word, either of which defeats the point of a puzzle meant to be unscrambled. This tool checks for both before returning a result, guaranteeing the scrambled version differs from the original and isn't itself a common dictionary word that would give the puzzle away or confuse the solver. Useful for generating a batch of scrambled words for a daily puzzle app or a printed word game where every entry needs to actually function as a puzzle, not just look scrambled at a glance, since a single bad scramble slipping through undermines an entire set.`,
    examples: [
      {
        title: 'Reject a shuffle that accidentally spells a real word',
        code: `Input: "cat"\nRejected: "act" (a valid word)\nAccepted: "tac"`,
        note: 'Avoids accidentally producing a different valid word instead of a jumbled non-word.',
      },
      {
        title: 'Reject a shuffle that lands back on the original',
        code: `Input: "look"\nRejected: "look" (unchanged)\nAccepted: "kolo"`,
        note: 'Guarantees the output actually differs from the original word every time.',
      },
    ],
  },

  'http-request-builder': {
    description: `Testing an API endpoint properly means assembling a full request, the right HTTP method, custom headers like an API key or a content type, a request body formatted correctly for what the endpoint expects, and often an authentication scheme like a bearer token, which is a lot to get right by hand with a raw curl command typed from memory. This tool builds that request through a structured interface instead: set the method, add headers one at a time, write the body in whichever format the endpoint needs, configure authentication, and send it directly to see the actual response rather than assembling command-line flags and hoping the syntax is right. Useful for testing an API during development without switching to a separate dedicated tool, or reproducing a specific request exactly to debug why an endpoint is behaving unexpectedly.`,
    examples: [
      {
        title: 'Build an authenticated POST request',
        code: `Method: POST\nHeaders: Authorization: Bearer abc123, Content-Type: application/json\nBody: { "name": "New Item" }`,
        note: 'Assembles headers, auth, and body together instead of hand-typing curl flags.',
      },
      {
        title: 'Reproduce a failing request to debug it',
        code: `Method: GET\nHeaders: X-API-Key: [redacted]\nURL: https://api.example.com/v2/orders?status=pending`,
        note: 'Lets you tweak one header or parameter at a time to isolate what causes a 400 response.',
      },
    ],
  },

  'shorten-content': {
    description: `Cutting a piece of writing down to a shorter length by hand usually means either trimming sentences somewhat arbitrarily until it hits a rough target, or reading the whole thing over trying to spot what's actually skippable versus what's load-bearing to the argument. This tool condenses a piece of text toward a shorter length while identifying which points are actually central to the piece and which are supporting detail or repetition that can go, rather than cutting proportionally across every sentence regardless of what it's carrying. Paste in a long article or a lengthy paragraph and get back a version that keeps the core points intact at a fraction of the length. Useful for turning a long article into a short summary for a newsletter blurb, or condensing an overly long paragraph in a draft down to what it actually needed to say.`,
    examples: [
      {
        title: 'Condense an article for a newsletter blurb',
        code: `Input: [900-word article]\nOutput: 120-word summary keeping the 3 central points`,
        note: 'Keeps the load-bearing points rather than trimming evenly across every sentence.',
      },
      {
        title: 'Tighten an overly long paragraph',
        code: `Input: [140-word paragraph with repeated points]\nOutput: 45-word version, repetition removed`,
        note: 'Cuts restated points rather than shortening every sentence by the same amount.',
      },
    ],
  },
};

export default FIX_BATCH_15;
