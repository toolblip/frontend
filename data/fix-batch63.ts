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

const FIX_BATCH_63: Record<string, FixBatchEntry> = {
  'url-parser': {
    description: `A URL bundles a protocol, a domain, sometimes a port, a path, a query string, and a fragment all into one string, and debugging a routing issue or reconstructing a modified version of that URL first requires actually knowing where one part ends and the next begins rather than treating the whole thing as one opaque block of text. This tool parses a URL into its individual components, protocol, domain, port, path, query, and fragment, breaking it apart into pieces that can each be inspected or changed on their own. Useful for understanding exactly which part of a URL counts as the domain versus the path while debugging a routing problem, extracting a specific port number from a URL that specifies a non-standard one, or pulling a URL apart into its pieces to reconstruct a modified version programmatically.`,
    examples: [
      {
        title: 'Break a URL into its components',
        code: `Input: https://api.example.com:8443/v1/users?active=true#results\nOutput: protocol: https, domain: api.example.com, port: 8443, path: /v1/users, query: active=true, fragment: results`,
        note: 'Separates every part of the URL for individual inspection.',
      },
      {
        title: 'Extract just the port number',
        code: `Input: https://internal-tool.example.com:9090/dashboard\nOutput: port: 9090`,
        note: 'Pulls out a single component instead of parsing the whole URL by eye.',
      },
    ],
  },

  'text-to-slug': {
    description: `A blog post titled with capital letters, punctuation, and spaces doesn't work directly as a URL, it needs converting into something lowercase, hyphenated, and stripped of anything a browser would need to escape, a conversion simple enough in concept but tedious to do consistently by hand across dozens of titles. This tool converts any phrase or title into a clean, URL-friendly slug with a customizable separator, hyphen or underscore, handling that stripping and formatting automatically rather than requiring it typed out by hand each time. Useful for generating a blog post's URL slug automatically from its title, creating a consistent file-naming convention from a list of article titles, or converting a product name into a clean URL path segment for an online store listing.`,
    examples: [
      {
        title: 'Generate a slug from a blog title',
        code: `Input: "10 Tips for Better Sleep!"\nOutput: 10-tips-for-better-sleep`,
        note: 'Strips punctuation and converts spaces into hyphens automatically.',
      },
      {
        title: 'Use a custom separator',
        code: `Input: "Q3 Financial Report", separator: underscore\nOutput: q3_financial_report`,
        note: 'Matches a specific file-naming convention instead of the default hyphen.',
      },
    ],
  },

  'binary-to-text': {
    description: `A binary string treated as one giant number is a completely different problem than the same string read as a message, where every eight digits actually represents one ASCII character rather than the whole sequence being one value, the difference between converting a number and decoding a sentence spelled out in binary. This tool converts a binary string into ASCII text and back, reading it eight bits at a time as a sequence of characters rather than as a single number. Useful for decoding a binary message puzzle where a string like 01001000 01101001 actually spells out a word, converting a sentence into its binary representation for a lesson on character encoding, or translating a binary string found in a riddle or a puzzle back into readable text.`,
    examples: [
      {
        title: 'Decode a binary message',
        code: `Input: 01001000 01101001\nOutput: "Hi"`,
        note: 'Reads each 8-bit group as one character instead of one large number.',
      },
      {
        title: 'Convert text into binary',
        code: `Input: "Hello"\nOutput: 01001000 01100101 01101100 01101100 01101111`,
        note: 'Shows the binary representation of each character in sequence.',
      },
    ],
  },

  'html-to-markdown': {
    description: `A web article copied straight into a note-taking app or a Markdown-based blog usually arrives full of HTML tags that don't belong there, and simply stripping every tag out loses the actual links and images embedded in the content along with the clutter, rather than converting the markup into Markdown's own equivalent syntax. This tool converts HTML into Markdown with options to preserve links, images, and code blocks specifically, keeping what actually matters in the content rather than discarding it along with the tags. Useful for converting a scraped or copied web article into clean Markdown for a note-taking app, migrating an old HTML blog post into a Markdown-based platform without losing its links, or archiving a web page as readable Markdown while keeping its embedded images and code blocks intact.`,
    examples: [
      {
        title: 'Convert an article while keeping its links',
        code: `Input: <p>Read the <a href="https://example.com">full guide</a>.</p>\nOutput: "Read the [full guide](https://example.com)."`,
        note: 'Preserves the link instead of stripping it out along with the tags.',
      },
      {
        title: 'Preserve a code block',
        code: `Input: <pre><code>const x = 1;</code></pre>\nOutput:\n\`\`\`\nconst x = 1;\n\`\`\``,
        note: 'Keeps a code block formatted correctly instead of flattening it into plain text.',
      },
    ],
  },

  'xml-to-json': {
    description: `XML doesn't mark anything as an array the way JSON does, so several repeated sibling elements need to actually be detected and folded into a JSON array rather than staying as separate identical keys, and an XML attribute needs its own decision too, whether it becomes a distinct field or gets merged in alongside the element's other properties. This tool converts XML into JSON with configurable attribute handling and array options, making those structural decisions explicit rather than guessing at a single fixed default. Useful for converting an XML response from a legacy SOAP service into JSON for a modern frontend to consume, choosing whether repeated XML elements collapse into a JSON array or stay as individual keys, or deciding whether an XML attribute becomes its own JSON field or merges with the element it belongs to.`,
    examples: [
      {
        title: 'Collapse repeated elements into an array',
        code: `Input: <items><item>A</item><item>B</item></items>\nOutput: { "items": { "item": ["A", "B"] } }`,
        note: 'Detects repeated sibling elements and turns them into a JSON array.',
      },
      {
        title: 'Handle an XML attribute',
        code: `Input: <product id="5">Widget</product>\nOutput: { "product": { "@id": "5", "#text": "Widget" } }`,
        note: "Keeps the attribute distinct from the element's text content.",
      },
    ],
  },

  'quote-of-the-day': {
    description: `A daily newsletter, an app's home screen, or a presentation's opening slide often wants a quote to set the tone, but curating a fresh one by hand every single day eventually runs out of material or just stops happening consistently. This tool returns an inspiring or a random quote of the day complete with author attribution, giving a ready quote without requiring one manually sourced and typed in each time. Useful for a daily newsletter that needs a fresh quote without manual curation every morning, opening a presentation or a slide deck with a relevant quote on a specific theme, or keeping a website widget feeling alive with rotating quoted content instead of the same static line.`,
    examples: [
      {
        title: "Get today's quote",
        code: `Output: "The best time to plant a tree was 20 years ago. The second best time is now." - Chinese Proverb`,
        note: 'Returns a ready quote with attribution for a newsletter or a homepage.',
      },
      {
        title: 'Get a random quote',
        code: `Output: "Simplicity is the ultimate sophistication." - Leonardo da Vinci`,
        note: 'Gives a fresh quote on demand instead of the same daily rotation.',
      },
    ],
  },

  'time-zone-converter': {
    description: `Scheduling a call across three offices in three different time zones means checking more than one converted time at once, and daylight saving further complicates it since a meeting time correct in March can shift by an hour once one region's clocks change on a different date than another's. This tool converts times across multiple time zones simultaneously, accounting for daylight saving and showing the current time in each one rather than converting just a single pair at a time. Useful for scheduling a call across several offices' time zones at once without checking each pair separately, confirming whether a specific date falls during a daylight saving transition that would shift the correct meeting time, or checking the current time in a few cities together to know when it's actually reasonable to call someone.`,
    examples: [
      {
        title: 'Schedule a call across three offices',
        code: `Input: 2:00 PM in New York\nOutput: 7:00 PM in London, 11:00 PM in Dubai, 3:00 AM (+1 day) in Tokyo`,
        note: 'Converts to several time zones at once instead of one pair at a time.',
      },
      {
        title: 'Check a daylight saving transition',
        code: `Input: meeting time on March 9, 2025, New York to London\nOutput: offset is 5 hours (UK has not yet shifted to BST)`,
        note: 'Flags a date where daylight saving timing differs between regions.',
      },
    ],
  },

  'base64-image-converter': {
    description: `A tiny icon embedded directly into a CSS file as Base64 text skips an entire separate HTTP request a browser would otherwise have to make just to fetch a small image file, and an email's HTML body that can't reliably load external images at all needs that same image data embedded directly inline instead. This tool converts an image into a Base64 data URL or decodes one back into an actual image file, moving in either direction between the two. Useful for embedding a small icon directly into a CSS file as a data URL to avoid an extra network request, converting an image into Base64 to paste into an email's HTML body where external images might get blocked, or decoding a Base64 data URL found in a webpage's source back into a downloadable image file.`,
    examples: [
      {
        title: 'Embed an icon in CSS',
        code: `Input: icon.png\nOutput: background-image: url(data:image/png;base64,iVBORw0KGgo...);`,
        note: 'Avoids a separate HTTP request for a small icon.',
      },
      {
        title: 'Decode a data URL back into a file',
        code: `Input: data:image/png;base64,iVBORw0KGgo...\nOutput: image.png`,
        note: 'Recovers an actual image file from an embedded data URL.',
      },
    ],
  },

  'image-metadata-viewer': {
    description: `A photo shared online can unknowingly reveal the exact GPS coordinates it was taken at, embedded quietly in its EXIF metadata alongside the camera model, the exposure settings, and the timestamp, none of which shows up just looking at the picture itself. This tool extracts and displays EXIF, IPTC, and XMP metadata from JPEG, PNG, and WebP images, surfacing exactly what's embedded in a file beyond what the image itself shows. Useful for checking whether a photo about to be shared publicly contains GPS coordinates that should be stripped first for privacy, reviewing a photo's camera settings like aperture and shutter speed to learn from how a shot was actually taken, or confirming a stock photo's copyright and attribution metadata before using it somewhere.`,
    examples: [
      {
        title: 'Check for embedded GPS coordinates',
        code: `Input: vacation-photo.jpg\nOutput: GPS: 40.7484° N, 73.9857° W, captured: 2024-06-12 14:32`,
        note: 'Reveals a location a photo would otherwise share silently.',
      },
      {
        title: 'Review camera settings',
        code: `Input: landscape-shot.jpg\nOutput: camera: Canon EOS R5, aperture: f/8, ISO: 100, shutter speed: 1/250s`,
        note: 'Shows the exact settings used to capture a shot.',
      },
    ],
  },

  'unicode-character-inspector': {
    description: `Typing an em dash, a proper curly quote, or a trademark symbol reliably in a design tool or a CMS field usually means knowing its exact code point first, since a keyboard shortcut that works in one piece of software often does nothing in another, and guessing at the right character by eye doesn't confirm it's actually correct. This tool inspects any Unicode character and shows its code point, UTF-8 bytes, and HTML entity, giving the precise identifier needed to insert a specific typographic character correctly wherever it's actually needed. Useful for looking up an em dash or a curly quote's exact code point before inserting it into a design tool that doesn't accept a direct keyboard shortcut, finding the HTML entity for a trademark or a copyright symbol, or confirming a special character pasted from another source is actually correct and not a visually similar lookalike.`,
    examples: [
      {
        title: "Look up an em dash's code point",
        code: `Input: —\nOutput: U+2014 EM DASH, UTF-8: E2 80 94, HTML entity: &mdash;`,
        note: 'Gives the exact identifier needed to insert the character reliably elsewhere.',
      },
      {
        title: 'Confirm a pasted quote character is correct',
        code: `Input: "\nOutput: U+201C LEFT DOUBLE QUOTATION MARK (not a straight quote)`,
        note: 'Confirms a character is the intended curly quote and not a lookalike.',
      },
    ],
  },
};

export default FIX_BATCH_63;
