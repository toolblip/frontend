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

const FIX_BATCH_84: Record<string, FixBatchEntry> = {
  'purchase-agreement-generator': {
    description: `A bill of sale is the simple receipt that changes hands once a sale is already agreed on, but getting to that point usually needs something more substantial first, a negotiated contract laying out a financing contingency, an inspection period, an earnest money deposit, and the specific conditions that have to be met before the sale actually closes. This tool generates a purchase agreement covering those negotiated terms and closing conditions, built for the negotiation stage a sale goes through before it's actually final rather than the simple transfer document that follows once it is. Useful for drafting a purchase agreement with a financing or inspection contingency before a deal is finalized, laying out an earnest money deposit and the conditions attached to it, or documenting the negotiated terms both parties agreed to before closing on a sale.`,
    examples: [
      {
        title: 'Draft a financing contingency',
        code: `Input: purchase price: $450,000, contingency: financing within 30 days\nOutput: agreement clause specifying the financing contingency and deadline`,
        note: 'Documents a negotiated condition the sale depends on.',
      },
      {
        title: 'Specify an earnest money deposit',
        code: `Input: earnest money: $5,000, held by: escrow agent\nOutput: agreement section covering deposit amount and conditions`,
        note: 'Covers a negotiated term a simple bill of sale never includes.',
      },
    ],
  },

  'text-highlighter': {
    description: `Manually selecting and coloring one instance of a term at a time works fine for a short passage, but scanning a long document for every place a specific keyword or phrase actually shows up and highlighting each one individually is a slow, error-prone way to review something a pattern match handles instantly and consistently across the whole text. This tool automatically finds and highlights every occurrence of a keyword or phrase throughout a document, applying a chosen color and background style consistently rather than one manual selection at a time. Useful for seeing every place a specific term appears across a long contract or report at a glance, highlighting a product name consistently throughout a long piece of marketing copy, or reviewing how often and where a particular phrase shows up in a document before editing it.`,
    examples: [
      {
        title: 'Highlight a term across a long document',
        code: `Input: [50-page contract], term: "indemnification"\nOutput: every occurrence highlighted in yellow`,
        note: 'Finds every instance at once instead of one manual selection at a time.',
      },
      {
        title: 'Highlight a product name in marketing copy',
        code: `Input: [product page text], term: "EcoFlow Pro"\nOutput: every mention highlighted with a consistent background color`,
        note: 'Applies the same style to every occurrence automatically.',
      },
    ],
  },

  'svg-to-png': {
    description: `An SVG file never has to decide its own resolution, since it's defined mathematically and scales to any size without ever looking pixelated, but a PNG is a fixed grid of pixels that has to commit to actual dimensions the moment it's rendered, and choosing too low a resolution up front is how a crisp vector graphic turns into a blurry PNG the instant it's displayed larger than that chosen size. This tool rasterizes an SVG into PNG at a specified resolution, including higher multiples for retina and high-DPI displays rather than a single fixed export size. Useful for exporting an SVG icon at 2x or 3x resolution so it stays sharp on a high-DPI screen, converting a vector logo into PNG at the exact pixel dimensions a specific platform requires, or rasterizing an SVG graphic for a context that doesn't support vector formats at all.`,
    examples: [
      {
        title: 'Export an icon for a high-DPI display',
        code: `Input: icon.svg, scale: 3x, base size: 48px\nOutput: icon.png (144x144px)`,
        note: 'Renders at a resolution that stays sharp on retina displays.',
      },
      {
        title: 'Rasterize a logo at exact pixel dimensions',
        code: `Input: logo.svg\nOutput: logo.png (800x400px)`,
        note: 'Converts to the fixed pixel dimensions a specific platform requires.',
      },
    ],
  },

  'azw3-to-mobi': {
    description: `AZW3 carries formatting an older Kindle simply can't read at all, an embedded font, a fixed layout for something like a graphic novel, more elaborate styling, and while that richer format looks great on a modern Kindle app, an original Kindle or an older Kindle Keyboard only understands the earlier MOBI format and won't open an AZW3 file no matter how the formatting inside it is arranged. This tool converts an AZW3 ebook into MOBI, trading its more advanced formatting for compatibility with legacy Kindle hardware that never supported the newer format. Useful for converting an AZW3 book so it actually opens on an original Kindle or an older Kindle Keyboard, keeping an ebook library readable across both older and newer Kindle devices, or downgrading a book's format specifically for a device that predates AZW3 support.`,
    examples: [
      {
        title: 'Open a book on an original Kindle',
        code: `Input: novel.azw3\nOutput: novel.mobi`,
        note: 'Converts to the format a legacy Kindle without AZW3 support can actually open.',
      },
      {
        title: 'Keep a library compatible across devices',
        code: `Input: [collection of .azw3 files]\nOutput: matching .mobi files for older devices`,
        note: 'Trades richer formatting for compatibility with older Kindle hardware.',
      },
    ],
  },

  'add-pages-to-pdf': {
    description: `Reordering pages that already exist in a document and inserting brand new content into it are two genuinely different operations, dragging page 6 ahead of page 4 doesn't add anything new to the file, while dropping in a blank page for handwritten notes or copying in a page from an entirely different PDF does, and a tool built for one doesn't necessarily handle the other well. This tool adds blank pages or pages copied from another PDF at a specific position within an existing document, leaving the existing pages in their original order. Useful for inserting a blank page for notes between two existing pages in a report, copying a signature page from one PDF into a specific spot in another, or adding several new pages to a document without rebuilding the whole file from scratch.`,
    examples: [
      {
        title: 'Insert a blank notes page',
        code: `Input: report.pdf, insert blank page after page 4\nOutput: report.pdf (now 11 pages, blank page at position 5)`,
        note: 'Adds new content at a specific position rather than reordering existing pages.',
      },
      {
        title: 'Copy a page from another PDF',
        code: `Input: contract.pdf, insert page 3 of signatures.pdf at the end\nOutput: contract.pdf with the signature page appended`,
        note: 'Brings in content from a separate file rather than just rearranging one.',
      },
    ],
  },

  'duplicate-line-finder': {
    description: `Automatically stripping every duplicate line out of a list is the right move some of the time, but not always, since a repeated line might actually be a meaningful coincidence worth a second look rather than an error to silently delete, which means seeing exactly where each duplicate sits, at which line number, before deciding anything is often more useful than an automatic cleanup. This tool finds duplicate lines and highlights each one in place with its line number, offering one-click removal only once they've actually been reviewed rather than stripping them automatically. Useful for reviewing exactly where duplicate lines sit in a long list before deciding whether removing them is actually correct, spotting a duplicate that's meaningful rather than accidental before deleting it, or auditing a document for repeated lines with their exact position shown rather than an automatic silent cleanup.`,
    examples: [
      {
        title: 'Review duplicates before removing them',
        code: `Input: [500-line list]\nOutput: "widget-42" duplicated at lines 12 and 289`,
        note: 'Shows exact line numbers so a duplicate can be reviewed before deletion.',
      },
      {
        title: 'Spot a meaningful repeat versus an error',
        code: `Input: [log file]\nOutput: "connection timeout" repeated at lines 44, 45, 46`,
        note: 'Surfaces the pattern in context rather than silently stripping it.',
      },
    ],
  },

  'youtube-script-writer': {
    description: `A podcast listener has already committed by pressing play and often keeps listening passively in the background, but a YouTube viewer decides within the first few seconds whether to keep watching at all, which is exactly why a YouTube script needs a punchy hook before the video even properly starts, a structural requirement a podcast script simply doesn't carry the same pressure to meet. This tool generates a YouTube video script with a front-loaded hook, a structured content section, and a call-to-action, built around the platform's specific retention pressure rather than a general script format. Useful for drafting an opening hook designed to stop a viewer from clicking away in the first few seconds, structuring a video's content section to keep prompting someone to keep watching, or writing a call-to-action suited to YouTube's specific viewer behavior rather than a generic closing line.`,
    examples: [
      {
        title: 'Write a front-loaded hook',
        code: `Input: topic: "why your smoothies taste bad"\nOutput: "If your smoothie tastes like a sad vegetable, you're making one of these three mistakes."`,
        note: 'Front-loads the hook before the video properly starts, unlike a podcast intro.',
      },
      {
        title: 'Structure content to hold retention',
        code: `Input: topic: "5 budgeting mistakes"\nOutput: hook, mistake previews, detailed breakdown, CTA to subscribe`,
        note: "Paces content around YouTube's retention-driven viewer behavior.",
      },
    ],
  },

  'psd-to-svg': {
    description: `A Photoshop file's actual vector shape layers, if it has any, translate cleanly into real SVG paths that scale infinitely just like they did in Photoshop, but a painted brush layer or a photo layer was never vector data to begin with, so that content has to be traced and approximated into vector shapes rather than converted directly, meaning how well a specific PSD converts depends entirely on what's actually inside it. This tool converts a PSD file into SVG, translating genuine vector shape layers directly and tracing raster content into vector paths where no real vector data exists. Useful for converting a PSD's vector shape layers, like a logo built from paths, directly into clean, scalable SVG, tracing a flattened raster PSD into an approximate vector version, or exporting a design file into a format that scales for both web and print use.`,
    examples: [
      {
        title: 'Convert a vector logo layer directly',
        code: `Input: logo.psd (vector shape layer)\nOutput: logo.svg (true scalable paths)`,
        note: 'Translates genuine vector data directly rather than tracing it.',
      },
      {
        title: 'Trace a flattened raster design',
        code: `Input: poster.psd (painted/raster layers only)\nOutput: poster.svg (traced, approximate vector shapes)`,
        note: 'Approximates vector shapes since no real vector data existed to begin with.',
      },
    ],
  },

  'json-schema-generator': {
    description: `Having a handful of real API response examples but no actual schema documentation is a common starting point, and writing a formal JSON Schema by hand from those examples means manually working out every field's type, which ones are actually required across all the samples, and how nested structures should be validated, tedious to do by hand and easy to get subtly wrong. This tool infers a JSON Schema directly from sample JSON data, working backward from real examples rather than requiring a schema to already be specified. Useful for generating a validation schema from an API's actual example responses when no formal documentation exists, checking which fields are consistently required across several sample payloads, or producing a starting schema from real data that can be tightened up manually afterward.`,
    examples: [
      {
        title: 'Infer a schema from an API response',
        code: `Input: { "id": 1, "name": "Jane", "tags": ["admin"] }\nOutput: schema requiring id (number), name (string), tags (array of strings)`,
        note: 'Builds a schema by working backward from a real example.',
      },
      {
        title: 'Check required fields across samples',
        code: `Input: [3 example payloads, one missing "email"]\nOutput: "email" marked optional since it's not present in every sample`,
        note: 'Determines required fields based on what actually appears consistently.',
      },
    ],
  },

  'text-to-speech': {
    description: `A cloud text-to-speech service can sound remarkably natural, but it also means sending text to a third-party server and often paying for the privilege, while a browser's own built-in speech synthesis handles the same basic task for free, instantly, and entirely on-device, with nothing ever leaving the browser, a real tradeoff of voice quality against cost and privacy. This tool converts text to speech using the browser's native speech synthesis, with adjustable voice, speed, and pitch, rather than routing text through an external service. Useful for having a document read aloud without any text leaving the browser or an account being created, adjusting speech speed and pitch for a more comfortable listening pace, or getting quick, free text-to-speech for a task that doesn't need premium voice quality.`,
    examples: [
      {
        title: 'Read a document aloud privately',
        code: `Input: [pasted article text]\nOutput: audio played back in the browser, nothing sent to a server`,
        note: 'Keeps the text entirely on-device rather than sending it to an external API.',
      },
      {
        title: 'Adjust speed and pitch for comfort',
        code: `Input: [text], speed: 0.85x, pitch: -2\nOutput: slower, lower-pitched playback`,
        note: 'Tunes playback without needing a premium cloud voice service.',
      },
    ],
  },
};

export default FIX_BATCH_84;
