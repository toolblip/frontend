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

const FIX_BATCH_32: Record<string, FixBatchEntry> = {
  'hex-to-decimal-converter': {
    description: `Converting hex to decimal by hand means multiplying each digit by its positional power of 16 and adding the results together, which is straightforward in principle but genuinely easy to make an arithmetic slip on once a hex value runs more than two or three digits long. This tool converts a hex value into decimal and binary together, showing the actual step-by-step positional breakdown, each digit's value multiplied by its power of 16, rather than just returning a final number with no way to verify how it was reached. Useful for a student learning how positional number systems actually work and wanting to see the calculation laid out, double-checking a hex-to-decimal conversion done by hand, or converting a hex value from a color code or memory address into decimal with the working shown alongside the answer.`,
    examples: [
      {
        title: 'See the step-by-step conversion',
        code: `Input: 1F4\nBreakdown: (1×256) + (15×16) + (4×1) = 256 + 240 + 4\nOutput: 500`,
        note: 'Shows each digit multiplied by its positional power of 16 instead of just the final answer.',
      },
      {
        title: 'Convert a hex value to binary as well',
        code: `Input: 2A\nOutput: decimal: 42 | binary: 00101010`,
        note: 'Produces both conversions from the same input at once.',
      },
    ],
  },

  'json-to-php-array': {
    description: `PHP doesn't parse JSON directly into the language's native array syntax without an explicit decode step, and getting a JSON object into a hand-written PHP array literal, the kind you'd paste into a config file or a test fixture, means manually rewriting every key and value into PHP's array syntax, including correctly nesting an object's keys as PHP's associative array format rather than a plain indexed list. This tool converts JSON data directly into PHP array syntax, preserving nested objects as associative arrays with their keys intact rather than flattening the structure. Useful for turning a JSON API response into a hand-editable PHP config array, converting sample JSON into a PHP test fixture without manually retyping every key, or pasting external JSON data directly into PHP code as a literal array rather than decoding it at runtime.`,
    examples: [
      {
        title: 'Convert a JSON object into a PHP associative array',
        code: `Input: {"name": "Widget", "price": 19.99}\nOutput: [\n  'name' => 'Widget',\n  'price' => 19.99,\n]`,
        note: 'Preserves keys as an associative array instead of a plain indexed list.',
      },
      {
        title: 'Convert nested JSON into nested PHP arrays',
        code: `Input: {"user": {"id": 1, "roles": ["admin", "editor"]}}\nOutput: [\n  'user' => [\n    'id' => 1,\n    'roles' => ['admin', 'editor'],\n  ],\n]`,
        note: 'Keeps the nested structure intact rather than flattening it.',
      },
    ],
  },

  'keyword-density-analyzer-new': {
    description: `A keyword sitting in a page's title tag or an H1 heading carries more SEO weight than the same keyword repeated in a paragraph deep in the body text, which means a flat percentage of how often a keyword appears misses something a placement-aware analysis actually catches, whether the keyword shows up in the specific structural locations that matter most. This tool analyzes keyword density in text or raw HTML, weighing where in the structure each occurrence actually falls, title, headings, body, alt text, rather than treating every occurrence as equally significant regardless of position. Useful for confirming a target keyword isn't just present somewhere on a page but actually appears in the specific tags search engines weight most heavily, or auditing a page's HTML to see whether keyword placement matches where it would actually help most.`,
    examples: [
      {
        title: 'Check keyword placement, not just frequency',
        code: `Input: keyword "meal prep" appears in title, H1, and 8 times in body\nOutput: high-weight placements: title, H1 | body density: 1.8%`,
        note: 'Distinguishes high-value placements from raw body-text repetition.',
      },
      {
        title: 'Audit HTML for missing high-weight placement',
        code: `Input: keyword appears 14 times in body, 0 times in title or headings\nResult: flagged, keyword absent from title and heading tags`,
        note: 'Surfaces a page that repeats a keyword in body text but never in the tags that matter most.',
      },
    ],
  },

  'mime-types-reference': {
    description: `A file upload handler that only allows image/jpeg will reject a perfectly valid JPEG sent with a slightly different or missing MIME type, and knowing the exact string a server or an HTTP header actually expects, not just roughly what kind of file it is, matters the moment a content-type mismatch starts silently breaking an upload or a download. This tool is a searchable reference for MIME types, covering the standard type string for common file formats and how to set the matching Content-Type header correctly. Useful for looking up the exact MIME type string a specific file extension expects before writing an upload validation rule, confirming a Content-Type header matches what a file actually is, or checking which MIME type covers a less common file format that doesn't have an obvious one-word answer.`,
    examples: [
      {
        title: 'Look up the MIME type for a file extension',
        code: `Search: .svg\nOutput: image/svg+xml`,
        note: 'Gives the exact string an upload validator or HTTP header needs.',
      },
      {
        title: 'Confirm a Content-Type header matches a file',
        code: `File: report.pdf\nExpected Content-Type: application/pdf`,
        note: 'Confirms the header a server should send actually matches the file type.',
      },
    ],
  },

  'webm-to-mp4': {
    description: `WebM plays fine in most modern browsers, but plenty of older devices, some social platforms, and software that was never updated to handle newer web codecs specifically expect MP4, the format with the broadest possible support across hardware and software built over the last decade. This tool converts a WebM file into MP4, trading WebM's typically smaller file size for compatibility with essentially anything that plays video at all. Useful for converting a browser-recorded WebM screencast so it plays on a device or app that's never heard of the format, preparing a WebM video for a platform that specifically requires MP4 uploads, or standardizing a mixed video collection on the one format most likely to open anywhere.`,
    examples: [
      {
        title: 'Make a browser recording play everywhere',
        code: `Input: screen-recording.webm\nOutput: screen-recording.mp4`,
        note: 'Converts to the format with the broadest device and software support.',
      },
      {
        title: 'Meet a platform upload requirement',
        code: `Input: demo-clip.webm\nOutput: demo-clip.mp4`,
        note: 'Satisfies a platform that specifically requires MP4 uploads.',
      },
    ],
  },

  'serp-simulator': {
    description: `A page that's already live has an actual current search appearance, whatever Google is presently rendering for its title and description, which is a different thing to check than testing a new title and description before anything gets published, since a live page's actual metadata might have drifted or been overwritten since it first went up without anyone noticing. This tool pulls a real, already-published URL's current title and meta description and renders exactly how it appears in search results right now, rather than requiring the values to be typed in manually. Useful for auditing how an existing, live page actually appears in search today, catching a metadata mismatch that crept in after a page was updated without anyone touching the SEO fields, or checking a competitor's actual current search appearance.`,
    examples: [
      {
        title: "Check a live page's current search appearance",
        code: `Input: https://example.com/product\nOutput: current title and description as Google renders them today`,
        note: "Pulls the page's actual live metadata rather than typed-in values.",
      },
      {
        title: 'Catch metadata drift on an existing page',
        code: `Input: https://example.com/about (updated 6 months ago)\nOutput: meta description no longer matches the current page content`,
        note: 'Reveals a mismatch that crept in after the page changed without the SEO fields being updated.',
      },
    ],
  },

  'text-to-handwriting': {
    description: `Typed text reads as obviously typed no matter how carefully a font is chosen, which matters for a document specifically meant to feel personal or hand-written, a greeting card message, a signature-styled note, an assignment formatted to look like it was actually written by hand rather than printed. This tool renders plain text using a handwriting-style font, cursive or a more casual print style, producing an image that reads as genuinely hand-written rather than a typed document trying to imitate one. Useful for creating a handwritten-looking note or card message without actually writing it by hand, formatting a document to have a personal, informal handwritten feel, or generating handwriting-styled text for a design project that calls for that specific look.`,
    examples: [
      {
        title: 'Create a handwritten-looking card message',
        code: `Input: "Happy Birthday, hope your day is wonderful!"\nStyle: cursive\nOutput: card-message.png (handwriting-style image)`,
        note: 'Reads as genuinely hand-written rather than an obviously typed font.',
      },
      {
        title: 'Generate handwriting-styled text for a design',
        code: `Input: "Thank you for shopping with us"\nStyle: casual print\nOutput: thank-you-note.png`,
        note: 'Produces an image suited to a design project needing a personal, informal look.',
      },
    ],
  },

  'case-converter': {
    description: `A React component needs PascalCase, the variable inside it needs camelCase, and a CSS class or a URL slug referencing the same concept needs kebab-case, which means the same underlying name has to exist in several different capitalization conventions depending on exactly where in a codebase it's actually being used. This tool converts a name or a batch of names between all of those conventions at once, UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and PascalCase, so naming a concept once translates cleanly into whichever convention a specific language or context actually requires. Useful for converting a component name into its camelCase variable equivalent, generating a matching kebab-case slug or CSS class from the same base name, or converting a whole list of identifiers between conventions at once instead of retyping each one by hand.`,
    examples: [
      {
        title: 'Convert a component name into related identifiers',
        code: `Input: "user profile card"\nOutput: PascalCase: UserProfileCard, camelCase: userProfileCard, kebab-case: user-profile-card`,
        note: 'Generates the matching name for a component, its internal variable, and a CSS class from one base name.',
      },
      {
        title: 'Convert a batch of identifiers at once',
        code: `Input: "first name", "last name", "email address"\nOutput: firstName, lastName, emailAddress`,
        note: 'Converts an entire list in one pass instead of one name at a time.',
      },
    ],
  },

  'random-ip-address': {
    description: `Testing code that parses, validates, or routes based on an IP address needs a realistic-looking address to test against, but a real IP belongs to an actual device somewhere, which makes reaching for one from a live system a bad habit even in a test environment, and IPv4 and IPv6 addresses have different structures entirely, so a generator needs to actually produce each format correctly rather than treating them as interchangeable. This tool generates random IPv4 or IPv6 addresses on demand, correctly formatted for whichever version is needed, without referencing any real device's actual address. Useful for populating test data for an application that validates or displays IP addresses, mocking network responses during development without touching a real address, or generating a batch of addresses to test how a system handles IPv6 specifically alongside the more familiar IPv4 format.`,
    examples: [
      {
        title: 'Generate an IPv4 address for test data',
        code: `Format: IPv4\nOutput: 203.0.113.47`,
        note: 'Produces a realistic-looking address without referencing a real device.',
      },
      {
        title: 'Generate an IPv6 address for protocol testing',
        code: `Format: IPv6\nOutput: 2001:0db8:85a3:0000:0000:8a2e:0370:7334`,
        note: 'Correctly formatted for IPv6 rather than treating it as an extended IPv4 address.',
      },
    ],
  },

  'gif-to-apng': {
    description: `GIF caps out at 256 colors per frame, which is exactly why an animated GIF with any real gradient or photographic content often looks banded or noisy, colors forced into the nearest of a limited palette rather than rendered accurately, a limitation APNG doesn't share since it supports full 24-bit color and real alpha transparency per frame. This tool converts an animated GIF into APNG, keeping the same animation while removing GIF's color palette ceiling, often producing a smaller file with visibly cleaner color and transparency in the process. Useful for improving the visual quality of an animation with gradients or photographic content that GIF's limited palette handles poorly, or converting an animated GIF into a format that supports genuine transparency instead of GIF's all-or-nothing transparent pixels.`,
    examples: [
      {
        title: 'Fix banding in a gradient animation',
        code: `Input: gradient-loop.gif (256-color palette, visible banding)\nOutput: gradient-loop.apng (full 24-bit color, smooth gradient)`,
        note: "Removes the color banding GIF's limited palette causes on gradients.",
      },
      {
        title: 'Add real transparency to an animation',
        code: `Input: overlay-animation.gif (hard-edged transparency)\nOutput: overlay-animation.apng (smooth alpha transparency)`,
        note: "Supports genuine partial transparency that GIF's all-or-nothing pixels can't provide.",
      },
    ],
  },
};

export default FIX_BATCH_32;
