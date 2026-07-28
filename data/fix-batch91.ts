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

const FIX_BATCH_91: Record<string, FixBatchEntry> = {
  'remove-extra-spaces': {
    description: `Text copied from a PDF, a formatted Word document, or a webpage often brings invisible passengers along with it, a double space left over from an old typing convention, a tab character used for alignment that means nothing once pasted somewhere else, three or four blank lines sitting where only one was ever intended, whitespace that's invisible until it starts causing visibly uneven spacing. This tool collapses multiple spaces, tabs, and stray line breaks down to a single space or line break, a narrow, mechanical whitespace cleanup rather than a broader text reformatting pass. Useful for cleaning up text copied from a PDF that brought along inconsistent spacing, collapsing several blank lines left behind after pasting from a formatted document, or normalizing tab characters that only made sense in their original layout.`,
    examples: [
      {
        title: 'Clean up text pasted from a PDF',
        code: `Input: "This   is    a  sentence."\nOutput: "This is a sentence."`,
        note: 'Collapses inconsistent multiple spaces down to one.',
      },
      {
        title: 'Collapse extra blank lines',
        code: `Input: "Paragraph one.\n\n\n\nParagraph two."\nOutput: "Paragraph one.\n\nParagraph two."`,
        note: 'Reduces several stray blank lines down to a single line break.',
      },
    ],
  },

  'text-case-converter': {
    description: `A variable name written in camelCase for a JavaScript file needs to become snake_case the moment it crosses into a Python script or a database column, and a class name needs PascalCase specifically for a C# codebase, conventions that aren't just stylistic preference but the expected convention in each specific ecosystem a piece of code or data happens to move between. This tool converts text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and other case formats, built around translating an identifier's naming convention as code or data moves between different ecosystems. Useful for converting a JavaScript variable name into the snake_case a Python script or a database column expects, translating a property name into PascalCase for a C# class, or converting a batch of field names between naming conventions when porting data between systems with different expectations.`,
    examples: [
      {
        title: 'Convert a JS variable name to snake_case',
        code: `Input: firstName (camelCase)\nOutput: first_name (snake_case)`,
        note: 'Translates a naming convention for a Python script or database column.',
      },
      {
        title: 'Convert a property name to PascalCase',
        code: `Input: user_id (snake_case)\nOutput: UserId (PascalCase)`,
        note: 'Matches the naming convention a C# class expects.',
      },
    ],
  },

  'csv-to-excel': {
    description: `Double-clicking a CSV file open directly in Excel invites Excel's own aggressive auto-detection to guess at what each value actually is, stripping the leading zeros off a code like "007" because it decided that's a number, or silently reformatting "2024-03" into a locale-specific date nobody asked for, mangling data that was never meant to be reinterpreted at all. This tool converts CSV into a properly formatted Excel file, preserving values like leading zeros and specific text patterns instead of letting Excel's own naive auto-import guess wrong. Useful for converting a CSV of product codes into Excel without leading zeros getting silently stripped, turning CSV data into a properly formatted .xlsx file without a date-like string getting reformatted unexpectedly, or preparing a CSV export for Excel in a way that keeps every value exactly as intended.`,
    examples: [
      {
        title: 'Preserve leading zeros in product codes',
        code: `Input CSV: code\n007\nOutput Excel: "007" (kept as text, not converted to 7)`,
        note: "Avoids Excel's own auto-import stripping the leading zeros.",
      },
      {
        title: 'Prevent an unwanted date reformat',
        code: `Input CSV: label\n2024-03\nOutput Excel: "2024-03" (kept as entered, not reformatted as a date)`,
        note: 'Preserves a value Excel would otherwise reinterpret as a date.',
      },
    ],
  },

  'mobi-to-azw3': {
    description: `An ebook that's sat in MOBI format for years, maybe downloaded long before AZW3 existed, renders on a modern Kindle Fire with whatever basic formatting MOBI supports, embedded fonts and more elaborate layouts left on the table simply because the file happens to still be in an older format rather than because the device can't do better. This tool converts a MOBI ebook into AZW3, upgrading it to take advantage of richer formatting a newer Kindle actually supports rather than settling for MOBI's more limited rendering. Useful for converting an older ebook into AZW3 so its formatting renders properly on a current Kindle Fire or newer device, updating a personal ebook library into the format modern Kindle hardware is actually built around, or getting better formatting fidelity out of a book that's simply been sitting in an outdated format.`,
    examples: [
      {
        title: 'Upgrade an old ebook for a modern Kindle',
        code: `Input: classic-novel.mobi\nOutput: classic-novel.azw3`,
        note: 'Enables richer formatting a newer Kindle Fire actually supports.',
      },
      {
        title: 'Update a personal library to the newer format',
        code: `Input: [collection of .mobi files]\nOutput: matching .azw3 files`,
        note: 'Takes advantage of formatting MOBI never supported.',
      },
    ],
  },

  'text-combinations-generator': {
    description: `Combining a list of modifier words like "best" or "affordable" with a list of head terms like "running shoes" or "laptops" into every possible pairing is a genuinely practical keyword research task, generating page title and content variations at once, a different use case from a general combinatorics operation applied to a single list of words with no modifier-and-head-term structure behind it. This tool generates every two-word and three-word combination across lists of words, built around pairing modifiers with head terms for keyword and content variation rather than combining one flat list against itself. Useful for generating a full matrix of long-tail keyword phrases from a list of modifiers and a list of product terms, producing page title variations for programmatic SEO content, or combining two distinct word lists into every practical pairing rather than permuting a single list.`,
    examples: [
      {
        title: 'Generate long-tail keyword variations',
        code: `Modifiers: ["best", "cheap", "affordable"]\nHead terms: ["running shoes", "laptops"]\nOutput: "best running shoes", "cheap running shoes", "affordable laptops", ...`,
        note: 'Pairs a modifier list against a head-term list for keyword research.',
      },
      {
        title: 'Produce page title variations',
        code: `Modifiers: ["ultimate", "complete"]\nHead terms: ["guide to SEO"]\nOutput: "ultimate guide to SEO", "complete guide to SEO"`,
        note: 'Generates practical title variants for programmatic content.',
      },
    ],
  },

  'css-border-radius-generator': {
    description: `Border-radius syntax actually supports four independent corner values, and even elliptical corners with separate horizontal and vertical radii per corner using a slash, a speech bubble shape or a card with only its top corners rounded is entirely achievable in CSS, but typing out an eight-value slash syntax by hand and imagining what it renders as is genuinely hard to do accurately. This tool generates CSS border-radius values with independent per-corner controls and a live preview, making an asymmetric or elliptical corner shape achievable by direct visual manipulation rather than guessing at slash-separated numbers. Useful for shaping a speech-bubble-style corner by adjusting each corner independently while watching it render live, rounding only a card's top two corners without touching the bottom ones, or fine-tuning an elliptical corner radius visually instead of calculating the slash syntax by hand.`,
    examples: [
      {
        title: 'Round only the top two corners',
        code: `Output: border-radius: 12px 12px 0 0;`,
        note: 'Adjusts each corner independently rather than one uniform value.',
      },
      {
        title: 'Shape an elliptical speech-bubble corner',
        code: `Output: border-radius: 30px 10px 30px 10px / 50px 15px 50px 15px;`,
        note: 'Achieves an elliptical per-corner shape through visual manipulation instead of hand-calculated syntax.',
      },
    ],
  },

  'api-endpoint-tester': {
    description: `Building a request with the correct auth headers assembled just right is one part of testing an API, but once that request actually gets sent, the more immediate need is usually seeing the response back in a form that's actually readable, pretty-printed JSON, a raw view, whichever format makes the returned data easiest to check right now. This tool sends a request to any API endpoint and displays the response with selectable format options, focused on making the response itself easy to inspect rather than on assembling a complex, reusable request definition. Useful for sending a quick request to an endpoint and viewing the response formatted as readable JSON, switching between a raw and a formatted view of the same response to check something specific, or testing an endpoint fast without first building out a saved, reusable request.`,
    examples: [
      {
        title: 'View a response as formatted JSON',
        code: `Input: GET https://api.example.com/users\nOutput (formatted): { "users": [ { "id": 1, "name": "Jane" } ] }`,
        note: 'Displays the response in a readable format rather than raw text.',
      },
      {
        title: 'Switch between raw and formatted views',
        code: `Input: same response\nRaw: {"users":[{"id":1,"name":"Jane"}]}\nFormatted: pretty-printed with indentation`,
        note: 'Toggles the display format to check something specific quickly.',
      },
    ],
  },

  'http-headers-viewer': {
    description: `Sometimes the actual need is just seeing what headers a URL is currently sending, a fast look rather than a scored security assessment or a detailed analysis flagging what falls short of best practice, closer to glancing at a list than running a full audit. This tool displays request and response headers for any URL along with a timing breakdown, organized by caching, CORS, and security categories for a quick, readable view rather than a deeper analytical pass. Useful for quickly checking what headers a page is currently sending without running a full security audit, glancing at a URL's caching and CORS headers during a fast debugging session, or getting an immediate, readable view of headers before deciding whether a deeper analysis is actually needed.`,
    examples: [
      {
        title: 'Get a quick look at current headers',
        code: `Input: https://example.com\nOutput: Cache-Control: max-age=3600, Access-Control-Allow-Origin: *`,
        note: 'A fast view rather than a scored security audit.',
      },
      {
        title: 'Check timing during a quick debug session',
        code: `Input: https://example.com\nOutput: DNS: 10ms, Connect: 25ms, Total: 180ms`,
        note: 'Gives an immediate read before deciding whether deeper analysis is needed.',
      },
    ],
  },

  'image-clipper': {
    description: `Fine-tuning a cutout's edges manually makes sense for one important photo, but processing a batch of product images or quickly pulling a subject out of a casual photo doesn't call for that level of manual control, it calls for clicking once and getting a reasonable result immediately rather than adjusting settings for every single image. This tool removes an image's background and cuts out its subject with a single click, prioritizing speed over manual edge refinement. Useful for quickly extracting a subject from a batch of product photos without adjusting settings on each one, pulling a person out of a casual photo in one click for a quick edit, or getting a fast background removal when precise manual refinement isn't actually necessary.`,
    examples: [
      {
        title: 'Extract subjects from a batch of product photos',
        code: `Input: product-1.jpg, product-2.jpg, product-3.jpg\nOutput: 3 images, backgrounds removed in one click each`,
        note: 'Processes each photo instantly without per-image adjustment.',
      },
      {
        title: 'Pull a person out of a casual photo',
        code: `Input: photo.jpg\nOutput: photo-cutout.png (subject isolated, transparent background)`,
        note: 'Prioritizes a fast result over manual edge refinement.',
      },
    ],
  },

  'azw3-to-epub': {
    description: `A book purchased or downloaded in Amazon's own AZW3 format is stuck there the moment it needs to open on a Kobo, a Nook, an iPad's Books app, or any Android e-reader that doesn't recognize Amazon's proprietary Kindle formats at all, while EPUB, the open standard nearly every e-reader outside Kindle actually supports, opens everywhere else without issue. This tool converts an AZW3 ebook into EPUB, moving it out of Amazon's closed format into the one standard almost every non-Kindle device and app actually reads. Useful for reading a Kindle-formatted book on a Kobo or another dedicated e-reader that doesn't support AZW3, opening an AZW3 file in a tablet's or phone's e-reader app outside the Kindle ecosystem, or converting a personal ebook library into the one format that works across nearly every reading device except Kindle itself.`,
    examples: [
      {
        title: 'Read a Kindle book on a Kobo',
        code: `Input: novel.azw3\nOutput: novel.epub`,
        note: 'Converts into the open format non-Kindle e-readers actually support.',
      },
      {
        title: "Open an AZW3 file in a tablet's reading app",
        code: `Input: guidebook.azw3\nOutput: guidebook.epub`,
        note: 'Moves the book out of Kindle-only format into universal EPUB.',
      },
    ],
  },
};

export default FIX_BATCH_91;
