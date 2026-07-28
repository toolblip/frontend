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

const FIX_BATCH_58: Record<string, FixBatchEntry> = {
  'facebook-ad-headlines': {
    description: `A Facebook ad headline competes for attention in a feed scrolling past dozens of other ads a second, and it lives under a specific character constraint the platform actually enforces, which means a headline written for a blog post or an email subject line doesn't necessarily translate into something that performs the same way inside an actual ad unit. This tool generates Facebook ad headlines built for click-through rate specifically, producing several fresh variations to test against each other in an actual ad campaign rather than one single guess. Useful for generating a batch of headline variations to A/B test inside a live Facebook ad campaign, writing a headline that fits the platform's specific character constraint without getting cut off, or refreshing ad copy that's started underperforming after running for a while.`,
    examples: [
      {
        title: 'Generate ad headline variations to test',
        code: `Input: product: "ergonomic office chair"\nOutput:\n"Stop Slouching: The Chair Your Back Actually Wants"\n"5-Star Rated Office Chair, Now 20% Off"`,
        note: 'Produces several variations ready for an A/B test inside a live campaign.',
      },
      {
        title: 'Refresh underperforming ad copy',
        code: `Input: current headline: "Buy Our Chair Today"\nOutput: "The Last Office Chair You'll Ever Need to Buy"`,
        note: 'Generates a fresh angle for an ad that has started losing clicks.',
      },
    ],
  },

  'word-freq-express': {
    description: `A target keyword needs to show up often enough across a full article for a search engine to register what it's actually about, but not so often that it reads like it was stuffed in artificially, and eyeballing that balance across several paragraphs of a longer piece is nearly impossible without actually counting. This tool analyzes word and phrase frequency across an entire piece of text, surfacing SEO and content optimization insights rather than counting occurrences in just a headline or a single sentence. Useful for confirming a target keyword appears often enough across a full article without looking artificially stuffed, discovering which phrases actually recur most throughout a longer document to understand its real thematic focus, or auditing an article's keyword balance before it gets published.`,
    examples: [
      {
        title: 'Check keyword density across an article',
        code: `Input: [1,800-word article], target keyword: "home office setup"\nOutput: "home office setup" appears 6 times (0.33% density)`,
        note: 'Confirms a keyword shows up enough without reading as stuffed.',
      },
      {
        title: 'Discover the most repeated phrases',
        code: `Input: [product review article]\nOutput: top phrases: "battery life" (9), "build quality" (7), "value for money" (5)`,
        note: "Reveals a document's actual thematic focus from its most frequent terms.",
      },
    ],
  },

  'html-live-preview': {
    description: `Testing how a specific HTML tag or attribute actually renders usually means saving a file and opening it in a browser just to check one small thing, a slow round trip for something that should be nearly instant, especially when prototyping a page's structure before it's wired into an actual project. This tool renders HTML live, side by side with the markup as it's typed, so a change shows up in real time rather than after a save-and-reload cycle. Useful for checking exactly how a specific HTML tag or attribute renders without saving a separate file, prototyping a page's layout structure quickly before building it into a real project, or testing a snippet copied from documentation to see how it actually behaves in a live browser context.`,
    examples: [
      {
        title: 'Test how a tag renders instantly',
        code: `Input: <details><summary>Click to expand</summary>Hidden content</details>\nPreview: renders as a collapsible section immediately`,
        note: 'Shows real rendering behavior without saving a separate file.',
      },
      {
        title: 'Prototype a page structure',
        code: `Input: <header>...</header><main>...</main><footer>...</footer>\nPreview: full page layout rendered live as each section is typed`,
        note: "Lets a layout be checked before it's wired into a real project.",
      },
    ],
  },

  'url-redirect-checker': {
    description: `A single click can quietly pass through three or four redirects before landing on its final destination, each hop adding its own delay and each one a place where a redirect chain could loop back on itself or point somewhere unintended, none of which shows up just by checking the final status code alone. This tool follows a URL's entire redirect chain and shows the full sequence of HTTP status codes at every hop, rather than only reporting where the chain eventually ends up. Useful for diagnosing a redirect loop that never actually resolves to a final page, finding an unnecessarily long redirect chain that's quietly slowing a page down, or confirming a specific URL redirects through exactly the hops it's supposed to after a domain or a URL structure change.`,
    examples: [
      {
        title: 'Follow a full redirect chain',
        code: `Input: example.com/old-page\nOutput:\n1. example.com/old-page -> 301 -> example.com/new-page\n2. example.com/new-page -> 301 -> example.com/new-page/\n3. example.com/new-page/ -> 200 OK`,
        note: 'Shows every hop instead of only the final destination.',
      },
      {
        title: 'Diagnose a redirect loop',
        code: `Input: example.com/loop-test\nOutput: example.com/a -> example.com/b -> example.com/a (loop detected, never resolves)`,
        note: 'Flags a chain that never actually reaches a final page.',
      },
    ],
  },

  'json-patch-generator': {
    description: `Comparing two versions of a JSON document visually is useful for a person reading the diff, but a system that needs to actually apply that change programmatically needs something more structured than a colored line-by-line comparison, a formal set of add, remove, and replace operations it can execute directly. This tool generates a JSON Patch in the RFC 6902 standard format from two JSON documents automatically, producing an actual applicable patch rather than just a human-readable diff. Useful for generating a patch to send to an API that specifically accepts RFC 6902 formatted updates, creating a minimal, precise change-set between two versions of a config file for a system built to apply patches, or producing a structured diff a script can actually execute instead of one meant only for reading.`,
    examples: [
      {
        title: 'Generate a patch between two versions',
        code: `Before: { "name": "Widget", "price": 9.99 }\nAfter: { "name": "Widget", "price": 12.99 }\nOutput: [{ "op": "replace", "path": "/price", "value": 12.99 }]`,
        note: 'Produces an RFC 6902 patch a system can apply directly.',
      },
      {
        title: 'Generate a patch for an added field',
        code: `Before: { "id": 1 }\nAfter: { "id": 1, "status": "active" }\nOutput: [{ "op": "add", "path": "/status", "value": "active" }]`,
        note: 'Captures a minimal change-set instead of the whole document.',
      },
    ],
  },

  'json-validator': {
    description: `A syntax error somewhere in a long JSON file, a missing comma, an unclosed bracket, is easy enough to describe in the abstract but genuinely hard to locate inside several hundred lines without being told exactly where it is. This tool validates JSON syntax and checks schema compliance while reporting the specific line number an error actually occurs on, rather than a generic parse failure with no location attached. Useful for finding exactly which line broke a large JSON file's syntax instead of scanning the whole thing manually, confirming a document is both syntactically valid and schema-compliant in the same pass, or catching a structural mistake immediately after editing a config file by hand.`,
    examples: [
      {
        title: 'Find a syntax error by line number',
        code: `Input: { "name": "Widget",\n  "price": 9.99\n} extra\nOutput: error on line 3 - unexpected token after closing brace`,
        note: 'Points directly to the line the syntax broke on.',
      },
      {
        title: 'Check schema compliance',
        code: `Input: { "age": "twenty" }\nSchema: { "age": { "type": "integer" } }\nOutput: valid syntax, schema violation - "age" must be an integer`,
        note: 'Confirms both syntax validity and schema compliance in one pass.',
      },
    ],
  },

  'timestamp-converter': {
    description: `A Unix timestamp is just a count of seconds since a fixed point with no timezone attached to it at all, which is exactly why the same epoch value renders as a completely different local time depending on which timezone it's actually being viewed in, a detail that trips people up comparing a log entry generated on a server in one timezone against a reader sitting in another. This tool converts between Unix timestamps, ISO 8601, and human-readable dates with timezone support built in, showing the same instant correctly across whichever timezone actually matters. Useful for converting a raw timestamp found in a log file into an actual readable date and time, checking what a specific epoch value means in a different timezone than the one it was generated in, or converting a date into the Unix timestamp format an API expects.`,
    examples: [
      {
        title: 'Convert a Unix timestamp to a readable date',
        code: `Input: 1735689600\nOutput: 2025-01-01T00:00:00Z (UTC)`,
        note: 'Turns a raw epoch value into an actual calendar date and time.',
      },
      {
        title: 'View the same timestamp in a different timezone',
        code: `Input: 1735689600, timezone: America/New_York\nOutput: 2024-12-31 19:00:00 EST`,
        note: 'Shows how the same instant renders differently depending on timezone.',
      },
    ],
  },

  'html-encoder-decoder': {
    description: `A literal less-than sign or an ampersand dropped directly into HTML content doesn't stay literal text, it gets read as the start of a tag or an entity reference instead, which is exactly why displaying a code snippet or a comparison symbol inside a webpage safely requires escaping it as an HTML entity first rather than typing the character directly. This tool encodes special characters into HTML entities and decodes them back into readable text, moving in either direction between the raw character and its safe entity representation. Useful for safely displaying a literal angle bracket or an ampersand inside a webpage without it breaking the surrounding markup, decoding HTML entities found in a scraped page's source back into plain readable text, or preparing a code snippet to be embedded in HTML without its symbols being misread as actual tags.`,
    examples: [
      {
        title: 'Encode a code snippet for safe display',
        code: `Input: if (a < b && b > 0) { return true; }\nOutput: if (a &lt; b &amp;&amp; b &gt; 0) { return true; }`,
        note: 'Keeps the comparison symbols from being read as actual HTML tags.',
      },
      {
        title: 'Decode entities from scraped HTML',
        code: `Input: "Caf&eacute; &amp; Bistro"\nOutput: "Café & Bistro"`,
        note: 'Converts entities back into plain readable text.',
      },
    ],
  },

  'rgb-hsl-color-picker': {
    description: `Transparency changes the math a plain RGB or HSL value doesn't need to account for, and switching a picked color between RGB, RGBA, HSL, and HSLA means keeping the same underlying hue consistent while the alpha channel gets added or dropped depending on whether the color actually needs to be semi-transparent. This tool picks a color visually and switches instantly between HEX, RGB, RGBA, HSL, and HSLA, keeping every format synced to the same picked shade including its alpha value. Useful for picking a semi-transparent color visually and seeing it expressed correctly in RGBA or HSLA, switching between formats to match whichever convention a specific stylesheet actually uses, or confirming a picked color's alpha value carries over correctly across every format it gets converted into.`,
    examples: [
      {
        title: 'Pick a semi-transparent color',
        code: `Picked visually: light blue at 60% opacity\nOutput: RGBA: rgba(147, 197, 253, 0.6), HSLA: hsla(213, 94%, 78%, 0.6)`,
        note: 'Keeps the alpha value consistent across both transparent formats.',
      },
      {
        title: 'Switch between formats',
        code: `Input: HEX #10B981\nOutput: RGB: rgb(16, 185, 129), HSL: hsl(160, 84%, 39%)`,
        note: 'Converts the same picked shade across every format instantly.',
      },
    ],
  },

  'whois-lookup': {
    description: `Domain age and an expiry date only tell part of the story, the fuller record, who actually holds the registration, and which name servers a domain currently points to, matters just as much when investigating a domain before making an offer to buy it or checking whether its DNS is actually configured the way it's supposed to be. This tool looks up a domain's full registration details, owner information, expiry date, and name servers together in a single lookup. Useful for identifying who actually owns a domain before reaching out to negotiate buying it, investigating a suspicious domain's registrant details during a security check, or confirming a domain's name servers actually point where they're supposed to after a DNS change.`,
    examples: [
      {
        title: "Look up a domain's owner and name servers",
        code: `Input: example-domain.com\nOutput: registrant: Example Holdings LLC, name servers: ns1.example-registrar.com, ns2.example-registrar.com`,
        note: 'Reveals who holds a domain before reaching out about buying it.',
      },
      {
        title: 'Confirm DNS points where expected',
        code: `Input: mysite.com\nOutput: name servers: ns1.hostingprovider.com, ns2.hostingprovider.com`,
        note: "Confirms a domain's DNS is actually configured as intended after a change.",
      },
    ],
  },
};

export default FIX_BATCH_58;
