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

const FIX_BATCH_111: Record<string, FixBatchEntry> = {
  'split-excel': {
    description: `A CSV file is always one flat table, so splitting it just means dividing rows into smaller chunks, but an Excel workbook can carry several sheets bundled into one file, a summary tab, a data tab, a notes tab, which means splitting it can mean pulling each sheet out into its own file just as easily as breaking one large sheet's rows into smaller pieces. This tool splits a large Excel file into smaller spreadsheets, handling the multi-sheet structure Excel actually has rather than assuming a single flat table the way a CSV splitter would. Useful for extracting each sheet from a multi-tab workbook into its own separate file, breaking a single oversized sheet's rows into smaller, more manageable spreadsheets, or splitting a large Excel file down to a size a specific system can actually import.`,
    examples: [
      {
        title: 'Extract each sheet into its own file',
        code: `Input: report.xlsx (sheets: Summary, Data, Notes)\nOutput: Summary.xlsx, Data.xlsx, Notes.xlsx`,
        note: "Handles Excel's multi-sheet structure, not just row splitting.",
      },
      {
        title: "Break an oversized sheet's rows into chunks",
        code: `Input: inventory.xlsx (50,000 rows)\nOutput: inventory-part1.xlsx, inventory-part2.xlsx, ... (5,000 rows each)`,
        note: 'Splits by row count when a single sheet is too large to import.',
      },
    ],
  },

  summarizer: {
    description: `A long report that landed in your inbox, a contract you need to actually understand before signing, an academic paper assigned as reading, these need to actually be understood for your own purposes, not evaluated as competitor research or skimmed to decide whether they're worth reading at all. This tool summarizes any text, article, or document into its main points instantly, built for general comprehension of something you personally need to understand rather than a research workflow evaluating someone else's content. Useful for getting the main points out of a long report before a meeting where it'll actually come up, summarizing a contract's key terms before reading through every clause in full, or condensing an assigned document down to what it actually says without reading every paragraph yourself.`,
    examples: [
      {
        title: 'Get the main points before a meeting',
        code: `Input: [15-page quarterly report]\nOutput: 5 key points covering revenue, headcount, and roadmap changes`,
        note: 'Built for personal comprehension, not evaluating a competitor.',
      },
      {
        title: "Summarize a contract's key terms",
        code: `Input: [8-page service agreement]\nOutput: term length, cancellation policy, and payment terms summarized`,
        note: 'Condenses a document you need to understand yourself.',
      },
    ],
  },

  'svg-favicon-generator': {
    description: `A raster favicon is one fixed image no matter what background it sits against, but an SVG favicon can carry a prefers-color-scheme media query directly inside the file, letting it automatically swap to a different color palette when a visitor's system is set to dark mode, a capability no PNG or ICO favicon format can offer since those are static images with no way to respond to anything. This tool creates SVG-based favicons from text, icons, or vector shapes with customizable colors and sizes, producing a favicon that adapts to a browser tab's light or dark appearance rather than staying fixed. Useful for generating a favicon that switches color scheme to match a visitor's dark mode setting, creating a vector favicon that stays sharp at any size instead of a fixed-resolution image, or building an SVG favicon from a simple vector shape when a static raster icon isn't flexible enough.`,
    examples: [
      {
        title: "Generate a favicon that adapts to dark mode",
        code: `Input: shape: circle, light: #2563EB, dark: #93C5FD\nOutput: favicon.svg (with prefers-color-scheme media query embedded)`,
        note: 'Swaps color automatically, something no PNG favicon can do.',
      },
      {
        title: 'Build a vector favicon from a simple shape',
        code: `Input: vector shape, size: any\nOutput: favicon.svg (stays sharp at every size)`,
        note: 'Stays scalable rather than fixed at one resolution.',
      },
    ],
  },

  'table-to-markdown': {
    description: `An HTML table copied straight off a Wikipedia page or a documentation site, and a CSV file exported from a spreadsheet, are both already tabular by nature, rows and columns already laid out, which is a different starting point than JSON's array of objects that has to be interpreted into row-and-column form before it can become a table at all. This tool converts HTML tables or CSV data into clean Markdown table format, starting from a source that's already structured as rows and columns rather than data that needs interpreting into that shape first. Useful for converting an HTML table copied straight off a webpage into Markdown for a README, turning a CSV export from a spreadsheet into a documentation-ready Markdown table, or cleaning up table markup pulled from a live page into properly formatted Markdown without any JSON conversion step in between.`,
    examples: [
      {
        title: 'Convert an HTML table copied from a webpage',
        code: `Input: <table><tr><th>Name</th></tr><tr><td>Widget</td></tr></table>\nOutput: | Name |\n|------|\n| Widget |`,
        note: 'Starts from markup that is already rows and columns.',
      },
      {
        title: 'Convert a CSV export to Markdown',
        code: `Input: name,price\nWidget,9.99\nOutput: | name | price |\n|------|-------|\n| Widget | 9.99 |`,
        note: 'No JSON interpretation step needed in between.',
      },
    ],
  },

  'text-improver': {
    description: `Silently rewriting a paragraph and handing back a different version leaves the actual reasoning invisible, which word choice felt weak, which sentence dragged on too long, information that matters when the goal is understanding what actually needed fixing rather than just receiving a replacement to accept or reject blindly. This tool rewrites and improves text for clarity, flow, and style with specific suggestions attached to each change, explaining what was adjusted and why rather than delivering a rewritten block with no visible reasoning behind it. Useful for seeing exactly which sentences were flagged as weak and why before accepting a suggested rewrite, learning what specifically makes a piece of writing read more clearly rather than just getting a different version of it, or reviewing suggested style changes individually instead of accepting an entire rewritten paragraph at once.`,
    examples: [
      {
        title: 'See the reasoning behind a suggested change',
        code: `Input: "The reason is due to the fact that sales were down."\nOutput: "Sales were down." | suggestion: "removes redundant phrasing"`,
        note: 'Explains what changed and why, not just a replacement.',
      },
      {
        title: 'Review style suggestions individually',
        code: `Input: [3-sentence paragraph]\nOutput: sentence 2 flagged: "too long, consider splitting" (accept/reject individually)`,
        note: 'Lets each suggestion be reviewed rather than a whole rewrite.',
      },
    ],
  },

  'text-uniqueness-checker': {
    description: `Plagiarizing someone else's work and accidentally publishing several of your own pages that read as near-identical to each other are two completely different problems, the second one a genuine SEO risk since a search engine can flag near-duplicate content across pages on the same site, which has nothing to do with copying from an external source at all. This tool checks text for duplicate and near-duplicate content with a similarity score, built for comparing your own pieces of content against each other rather than checking a single document's internal phrase repetition or scanning against external sources. Useful for checking whether two product descriptions you wrote yourself are too similar to each other for search engines' comfort, scoring how closely two of your own pages actually overlap in wording, or catching self-inflicted duplicate content across a site before it becomes an SEO problem.`,
    examples: [
      {
        title: 'Compare two product descriptions',
        code: `Input: description-a.txt, description-b.txt\nOutput: similarity score: 82% (likely to read as near-duplicate content)`,
        note: 'Compares your own pages, not an external source.',
      },
      {
        title: 'Catch self-inflicted duplicate content',
        code: `Input: 40 category pages on the same site\nOutput: 6 pairs flagged above 75% similarity`,
        note: 'Surfaces an SEO risk distinct from external plagiarism.',
      },
    ],
  },

  'tiff-to-svg': {
    description: `TIFF is usually the highest-resolution version of an image that exists, a professionally scanned logo, an archival print asset saved at full quality rather than compressed for the web, which means a trace starting from a TIFF source generally has more actual detail available to work with than one starting from a smaller, web-optimized file. This tool converts a TIFF bitmap into SVG vector format by tracing and vectorizing it, working from the highest-quality source an image is likely to exist in rather than a downsampled version. Useful for vectorizing a professionally scanned logo saved at full archival resolution, converting a high-DPI print asset into a scalable SVG without starting from a compressed web copy, or tracing artwork from its best available source rather than whatever smaller version happens to be on hand.`,
    examples: [
      {
        title: 'Vectorize a professionally scanned logo',
        code: `Input: logo-scan.tiff (600 DPI archival scan)\nOutput: logo.svg (traced from full-resolution detail)`,
        note: 'Starts from the highest-quality source likely available.',
      },
      {
        title: 'Convert a high-DPI print asset',
        code: `Input: print-artwork.tiff\nOutput: print-artwork.svg`,
        note: 'Avoids tracing from a compressed, web-optimized copy.',
      },
    ],
  },

  'tip-calculator': {
    description: `Splitting a check evenly across five people at a table, tip included, is a genuinely different calculation than working out what fifteen percent of a number is in the abstract, since it means first calculating the tip, adding it to the bill, and then dividing that total by a specific number of people, a multi-step calculation a single-purpose percentage calculator doesn't handle as its actual job. This tool calculates tips and splits bills among multiple people, built specifically for the group dining scenario rather than a general percentage calculation that happens to include tips as one example. Useful for splitting a restaurant bill evenly among a group after the tip gets added, calculating exactly what each person owes at a bar tab split several ways, or working out a fair per-person share for a service bill split unevenly among a group.`,
    examples: [
      {
        title: 'Split a restaurant bill among a group',
        code: `Input: bill: $180, tip: 20%, people: 5\nOutput: total: $216, per person: $43.20`,
        note: 'Handles the full tip-then-split calculation as one job.',
      },
      {
        title: 'Calculate an uneven per-person share',
        code: `Input: bill: $95, tip: 18%, split: 3 people unevenly\nOutput: total: $112.10, split per agreed shares`,
        note: 'Built for the group dining scenario specifically.',
      },
    ],
  },

  'token-builder': {
    description: `Testing how an API actually handles a token with a specific expired timestamp, a missing required claim, or a deliberately invalid signature means having that exact token in hand before running the test, which is a different starting point than inspecting or testing a token some real auth system already issued. This tool builds a custom JWT or bearer token with direct editing of the header, payload, and signature, constructing a token from scratch with whatever specific claims a test actually needs rather than working from one that already exists. Useful for crafting a token with a deliberately expired timestamp to test how an API responds, building a test token missing a required claim to confirm validation actually catches it, or constructing a token with specific custom claims for a test scenario no real auth system would ever issue on its own.`,
    examples: [
      {
        title: 'Craft a deliberately expired token',
        code: `Input: payload: {"exp": 1609459200}\nOutput: JWT with an already-expired timestamp for testing`,
        note: 'Builds the exact test fixture rather than working from a real one.',
      },
      {
        title: 'Build a token missing a required claim',
        code: `Input: payload: {"sub": "user123"} (no "role" claim)\nOutput: JWT ready to confirm validation catches the missing claim`,
        note: "Constructs a token no real auth system would ever issue.",
      },
    ],
  },

  trace: {
    description: `A traced image that comes out as one flattened blob is fine for display but useless the moment a designer actually needs to open it and adjust one specific shape's color or resize a single element independently, which calls for a trace that preserves individual paths as separate, selectable objects rather than one merged vector shape. This tool traces a bitmap logo into vector format, converting a PNG into an SVG built to stay genuinely editable in design software afterward rather than just scalable. Useful for tracing a logo into a vector file a designer can actually open and adjust element by element, converting a bitmap into SVG paths that stay separate and selectable rather than merged into one shape, or getting a traced result ready for further design work rather than just a static scalable image.`,
    examples: [
      {
        title: 'Trace a logo into separately editable paths',
        code: `Input: logo.png\nOutput: logo.svg (each shape a separate, selectable path)`,
        note: 'Stays editable rather than merging into one flattened shape.',
      },
      {
        title: 'Adjust one element after tracing',
        code: `Input: badge.png\nOutput: badge.svg, open in design software and recolor one shape independently`,
        note: 'Built for further design work, not just a static scalable image.',
      },
    ],
  },
};

export default FIX_BATCH_111;
