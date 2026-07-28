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

const FIX_BATCH_41: Record<string, FixBatchEntry> = {
  'gif-to-avif': {
    description: `AVIF compresses more efficiently than WebM or APNG, the two other common GIF replacement formats, since it's built on the same underlying compression as the AV1 video codec, which means the same animation can come out meaningfully smaller in AVIF than in either alternative, at the cost of being the newest of the three and not quite as universally supported yet in every browser or platform. This tool converts an animated GIF into AVIF specifically, trading a bit of compatibility for the smallest practical file size among the modern GIF replacement options. Useful for squeezing the smallest possible file size out of an animation on a site or platform confirmed to support AVIF, converting a GIF where every kilobyte of savings matters more than broad compatibility, or comparing AVIF's result against a GIF's file size before deciding whether the format switch is worth it for a specific use case.`,
    examples: [
      {
        title: 'Get the smallest possible file size',
        code: `Input: animation.gif (4.2 MB)\nOutput: animation.avif (380 KB)`,
        note: 'AVIF typically compresses smaller than WebM or APNG for the same animation.',
      },
      {
        title: 'Compare before committing to the format',
        code: `Input: banner.gif (1.1 MB)\nOutput: banner.avif (95 KB), confirm the target platform supports AVIF playback first`,
        note: "Worth checking support on the destination since AVIF animation isn't as universally supported yet as WebM.",
      },
    ],
  },

  'text-fluency-checker': {
    description: `A readability formula scores vocabulary and sentence length, but it says nothing about whether a text actually flows smoothly from one sentence to the next, five short, choppy sentences back to back can score as perfectly readable by a formula while still reading clunky and disjointed out loud, since fluency is really about rhythm and transition rather than word or sentence complexity in isolation. This tool analyzes how smoothly a text reads based on sentence-to-sentence flow and complexity patterns, catching the kind of choppy, disjointed rhythm a standard readability score doesn't measure at all. Useful for smoothing out a draft that reads fine sentence by sentence but feels stilted read aloud as a whole, checking whether a piece of writing actually flows or just technically parses as simple, or fixing a text that scores well on a standard readability formula yet still reads awkwardly out loud.`,
    examples: [
      {
        title: 'Catch choppy sentence rhythm',
        code: `Input: "The dog ran. It was fast. The park was big. The sun was out."\nResult: flagged, low fluency (repetitive short sentence structure)`,
        note: 'Each sentence is individually simple, but the sequence reads choppy as a whole.',
      },
      {
        title: 'Confirm a paragraph flows well aloud',
        code: `Input: [paragraph with varied sentence length and clear transitions]\nResult: high fluency score`,
        note: 'Rewards natural rhythm and transitions, not just simple vocabulary.',
      },
    ],
  },

  'cooking-unit-converter': {
    description: `A cup of flour and a cup of sugar don't weigh the same amount, which is exactly why converting a recipe's volume measurement straight into grams isn't as simple as applying one universal conversion factor, the actual weight depends on the specific ingredient's density, and a generic volume-to-weight conversion that ignores that will be wrong for most ingredients most of the time. This tool converts between cooking measurements, cups, tablespoons, teaspoons, grams, milliliters, and ounces, accounting for the fact that volume and weight aren't interchangeable without knowing what's actually being measured. Useful for converting a recipe written in cups into grams for a kitchen scale, translating between the small-volume units, teaspoons and tablespoons, that recipes constantly mix, or converting a recipe's units for baking, where weight-based precision genuinely matters more than volume.`,
    examples: [
      {
        title: "Convert a recipe's flour measurement to grams",
        code: `Input: 2 cups all-purpose flour\nOutput: 250 g`,
        note: "Uses flour's actual density, not a generic volume-to-weight factor.",
      },
      {
        title: 'Convert small-volume units',
        code: `Input: 3 tablespoons\nOutput: 9 teaspoons | 44.4 ml`,
        note: 'Handles the small-volume conversions recipes constantly mix between.',
      },
    ],
  },

  'image-dpi-resizer': {
    description: `Knowing the math behind a print resolution requirement is one thing, actually producing a file at that resolution is a separate step, and a tool that only calculates the numbers still leaves the actual DPI change and resizing to be done somewhere else by hand. This tool performs that change directly: it resizes an image and sets its DPI for print, preserving the aspect ratio throughout, so the output file is genuinely ready to send to a print shop rather than a set of numbers describing what still needs to happen to the file. Useful for preparing an image at the exact DPI and dimensions a print job actually requires, converting a web-resolution image into a print-ready file without the aspect ratio shifting in the process, or getting a finished, correctly-specified file instead of a calculation to apply manually.`,
    examples: [
      {
        title: 'Prepare an image for a print shop',
        code: `Input: photo.jpg (72 DPI, 800x600)\nOutput: photo-print.jpg (300 DPI, 800x600, aspect ratio preserved)`,
        note: 'Produces a finished, print-ready file rather than just the target numbers.',
      },
      {
        title: 'Convert a web image to print resolution',
        code: `Input: banner.png (screen resolution)\nOutput: banner-print.png (300 DPI, dimensions scaled proportionally)`,
        note: 'Actually applies the DPI change instead of only calculating what it should be.',
      },
    ],
  },

  'image-blur-hash-generator': {
    description: `A blank space or a spinner while an image loads reads as unfinished, but a full low-resolution thumbnail costs its own network request and adds weight before the real image even starts loading, which is exactly the gap BlurHash fills: a compact string, often under thirty characters, that encodes a blurred approximation of an image directly as text, embeddable right in the page's HTML or an API response with no extra image request at all. This tool generates that BlurHash string from any image, ready to render as an instant blurred placeholder the moment a page loads, before the actual image has downloaded. Useful for showing a smooth blurred preview while a gallery's images lazy-load, embedding a placeholder directly in an API response without an extra image request, or avoiding the blank-space flash that shows before a slow-loading image finally appears.`,
    examples: [
      {
        title: 'Generate a placeholder for a lazy-loaded gallery',
        code: `Input: photo.jpg\nOutput: "LKO2?U%2Tw=w]~RBVZRi};RPxuwH"`,
        note: 'A string this short can be embedded directly in HTML with no extra image request.',
      },
      {
        title: 'Embed a placeholder in an API response',
        code: `Input: product-photo.jpg\nOutput: { "image": "product.jpg", "blurhash": "L6Pj0^jE.AyE_3t7t7R**0o#DgR4" }`,
        note: 'Lets a client render an instant preview before the real image downloads.',
      },
    ],
  },

  'aac-to-mp3': {
    description: `AAC generally sounds a little better than MP3 at the same bitrate, which is exactly why Apple, YouTube, and plenty of streaming platforms default to it, but that quality edge doesn't matter if the destination, an older device, a specific piece of software, a car stereo from a few years back, only actually plays MP3 and has never supported AAC at all. This tool converts an AAC file into MP3, trading AAC's slight efficiency advantage for the near-universal compatibility MP3 still carries. Useful for getting an AAC file playing on an older device or piece of software that never added AAC support, converting a downloaded AAC track for a music player that only recognizes MP3, or standardizing a mixed audio collection on the one format that's guaranteed to open literally anywhere.`,
    examples: [
      {
        title: 'Play an AAC file on an older device',
        code: `Input: song.aac\nOutput: song.mp3`,
        note: 'MP3 support is nearly universal even on devices that never added AAC decoding.',
      },
      {
        title: 'Standardize a mixed audio library',
        code: `Input: 40 AAC files\nOutput: 40 MP3 files`,
        note: 'Puts every track into the one format guaranteed to play on any device.',
      },
    ],
  },

  'automation-wizard': {
    description: `Connecting two apps so that one action automatically triggers another, a new form submission adding a row to a spreadsheet, a new file automatically getting a notification sent about it, is a task a lot of people assume needs writing code, when the actual logic behind most of these automations is simple: when this specific thing happens, do that specific thing in response. This tool builds that kind of trigger-and-action automation visually, connecting apps and defining what should happen automatically without writing a script or hiring someone who can. Useful for automating a repetitive manual task that currently gets done by hand every single time it comes up, connecting two apps that don't otherwise talk to each other directly, or setting up a simple automated workflow without learning to code just for one recurring task.`,
    examples: [
      {
        title: 'Automate a repetitive notification task',
        code: `Trigger: new file uploaded to a folder\nAction: send a notification message\nOutput: automation runs every time a new file appears`,
        note: 'Replaces a manual check-and-notify task done by hand each time.',
      },
      {
        title: 'Connect two apps without writing code',
        code: `Trigger: new form submission\nAction: add a row to a spreadsheet\nOutput: automation created visually, no script written`,
        note: 'Builds a working automation without needing a developer.',
      },
    ],
  },

  'xml-validator': {
    description: `An XML file that looks fine on a quick read can still be malformed somewhere specific, a tag that was never closed, a mismatched namespace prefix, an attribute missing its closing quote, and finding exactly where without a real error message means scanning the whole document line by line hoping to spot the one thing wrong. This tool validates XML syntax and reports exactly where a problem is, the specific line number and a detailed message describing what's actually wrong, rather than a generic pass-or-fail with no indication of where to even start looking. Useful for pinpointing exactly which line an unclosed tag or a malformed attribute is on instead of scanning an entire document by eye, debugging why an XML file a parser rejects looks fine at a glance, or confirming a document is genuinely well-formed before it gets used somewhere that would fail on a syntax error.`,
    examples: [
      {
        title: 'Pinpoint an unclosed tag',
        code: `Input: <user><name>Jane</name><email>jane@example.com</user>\nResult: line 1, column 45 - <email> tag opened but never closed`,
        note: "Points to the exact location instead of a generic 'invalid XML' message.",
      },
      {
        title: 'Catch a mismatched namespace',
        code: `Input: <ns:item></item>\nResult: line 1 - closing tag does not match namespaced opening tag <ns:item>`,
        note: 'Identifies specifically which tag and namespace are mismatched.',
      },
    ],
  },

  'url-parser': {
    description: `A URL is really several distinct pieces stitched together, a protocol, a domain, an optional port, a path, a query string, and a fragment, and while the query parameters get the most attention, a URL debugging session sometimes hinges on a completely different piece, whether a non-standard port is actually specified, or what's sitting in the fragment after the hash symbol that a query-focused tool would never even show. This tool breaks a URL down into every one of those components at once, protocol, domain, port, path, query, and fragment, rather than focusing narrowly on just the query string. Useful for inspecting a URL's full structure when something about it looks unusual, confirming whether a specific port is actually present in a URL rather than assumed by default, or understanding exactly how a complex URL is put together piece by piece rather than treating it as one opaque string.`,
    examples: [
      {
        title: "Break down a URL's full structure",
        code: `Input: https://api.example.com:8443/v2/users?active=true#results\nOutput: protocol: https, domain: api.example.com, port: 8443, path: /v2/users, query: active=true, fragment: results`,
        note: 'Reveals the non-standard port and fragment that a query-only tool would miss entirely.',
      },
      {
        title: 'Inspect an unusual URL at a glance',
        code: `Input: ftp://files.example.com/archive/report.pdf\nOutput: protocol: ftp, domain: files.example.com, path: /archive/report.pdf`,
        note: "Shows the full anatomy of a URL that isn't a typical HTTP link.",
      },
    ],
  },

  'json-to-csv': {
    description: `A JSON array of flat objects maps onto CSV easily enough, but the moment an object has a nested field, an address object inside a user record, an array of tags inside a product, there's no single obvious way to represent that in a format that only understands flat rows and columns, which is a decision this conversion actually has to make rather than something that translates itself automatically. This tool converts JSON into CSV with custom delimiter, header, and quoting options, handling that flattening decision explicitly rather than silently dropping or mangling nested data. Useful for exporting a JSON API response into a CSV a spreadsheet can open cleanly, converting nested JSON data into flat columns with a sensible naming scheme instead of losing the nested fields entirely, or generating a CSV with the exact delimiter and quoting style a specific downstream tool expects.`,
    examples: [
      {
        title: 'Flatten a nested object into columns',
        code: `Input: [{"name":"Alice","address":{"city":"Boston"}}]\nOutput: name,address.city\\nAlice,Boston`,
        note: 'Represents the nested field as a dotted column name instead of dropping it.',
      },
      {
        title: 'Export with a specific delimiter and quoting style',
        code: `Input: [{"name":"Widget, Deluxe","price":19.99}], delimiter: ";"\nOutput: name;price\\n"Widget, Deluxe";19.99`,
        note: 'Matches the exact delimiter and quoting a downstream tool expects.',
      },
    ],
  },
};

export default FIX_BATCH_41;
