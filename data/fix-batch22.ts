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

const FIX_BATCH_22: Record<string, FixBatchEntry> = {
  'purchase-agreement-generator': {
    description: `A purchase agreement isn't just a description of what's being sold, it's a contract that needs specific standard clauses to actually hold up if something goes wrong: who the parties are, exactly what's being bought and at what price, payment terms, any contingencies the sale depends on, a closing or delivery date, and signature lines for both sides. This tool builds that structure from the actual details of a specific sale, a vehicle, a piece of property, an item between two private parties, arranging them into the standard sections a purchase agreement is expected to include rather than a generic sales description with no legal structure behind it. It's a solid starting draft, not a substitute for legal review on anything high-value or complicated; useful for a straightforward private sale that needs real documentation, or as a base to bring to an actual lawyer for anything more significant.`,
    examples: [
      {
        title: 'Draft a private vehicle sale agreement',
        code: `Input: 2019 Honda Civic, price: $14,500, "as-is" condition\nOutput: agreement with parties, price, condition disclosure, and signature lines`,
        note: 'Includes the condition disclosure clause that protects both sides in an as-is private sale.',
      },
      {
        title: 'Include a contingency clause',
        code: `Input: property sale, contingency: "subject to buyer securing financing by [date]"\nOutput: agreement with a financing contingency clause and a specific deadline`,
        note: 'Makes the sale conditional rather than binding regardless of whether financing comes through.',
      },
    ],
  },

  'text-highlighter': {
    description: `Scanning a long document to notice every place a specific term shows up is exactly the kind of task that's easy to miss instances in, especially past the first page or two, when the same word blends back into the surrounding text after the first couple of times it registers. This tool highlights every occurrence of a chosen word or phrase throughout a text automatically, with the highlight color and style customizable so different terms can be marked distinctly from each other in the same pass. Useful for marking every instance of a specific term before a close read, checking how often and where in a document a particular phrase actually shows up, or preparing a document to hand to someone else with the relevant terms already visually flagged instead of asking them to find it themselves.`,
    examples: [
      {
        title: 'Highlight every mention of a keyword',
        code: `Input: [10-page report], term: "risk"\nOutput: every instance of "risk" highlighted in yellow throughout the document`,
        note: 'Makes every occurrence visible at a glance instead of scanning manually.',
      },
      {
        title: 'Mark two different terms in distinct colors',
        code: `Terms: "revenue" (green), "expenses" (red)\nOutput: both terms highlighted in their assigned colors throughout the text`,
        note: 'Distinguishes between two tracked terms in the same pass over the document.',
      },
    ],
  },

  'svg-to-png': {
    description: `An SVG has no fixed pixel dimensions of its own, which is exactly its strength as a scalable vector, but plenty of destinations, an older email client, a CMS's image upload field, a favicon slot, a social platform's image requirements, only accept a raster format at an explicit pixel size, not a vector that scales infinitely. This tool rasterizes an SVG into PNG at whatever size is actually specified, rather than picking an arbitrary default and hoping it's close enough. Useful for exporting the same source icon at 32x32 for a favicon and 512x512 for an app icon without maintaining two separate files, or converting a vector logo into PNG for a platform that simply doesn't accept SVG uploads at all.`,
    examples: [
      {
        title: 'Export a favicon and an app icon from one source',
        code: `Input: logo.svg\nOutput: favicon.png (32x32), app-icon.png (512x512)`,
        note: 'Rasterizes the same vector source at two different explicit sizes.',
      },
      {
        title: 'Convert a logo for a platform that rejects SVG uploads',
        code: `Input: logo.svg\nOutput: logo.png (800x800)`,
        note: "Produces a raster file for an upload field that doesn't accept vector formats.",
      },
    ],
  },

  crop: {
    description: `Sometimes a crop isn't about reframing a photo to a different composition, it's about cutting away something specific that shouldn't be there at all: a timestamp burned into the corner, a stray edge of another person who wasn't meant to be in the shot, a border or watermark strip that came baked into the original file. This tool crops to any size and aspect ratio, positioned to remove exactly the part of the image that needs to go rather than being locked into a preset shape. Useful for trimming an unwanted timestamp off an old photo before sharing it, cutting a distracting edge out of an otherwise good shot, or removing a strip along one side that was never meant to be part of the final image.`,
    examples: [
      {
        title: 'Remove a timestamp from an old photo',
        code: `Input: vacation.jpg (timestamp in bottom corner)\nOutput: vacation-cropped.jpg (timestamp cropped out of frame)`,
        note: 'Cuts away the specific corner containing the unwanted timestamp.',
      },
      {
        title: 'Trim a distracting edge out of a shot',
        code: `Input: group-photo.jpg (stranger at the left edge)\nOutput: group-photo-cropped.jpg`,
        note: 'Removes the unwanted edge of the frame rather than reframing the whole composition.',
      },
    ],
  },

  'azw3-to-mobi': {
    description: `AZW3 is the newer Kindle format, but plenty of older Kindle devices and some third-party ereader apps built around Amazon's ecosystem were designed before AZW3 existed and only recognize the older MOBI format, which means a book that only exists as AZW3 simply won't open on some hardware still in active use. This tool converts an AZW3 file into MOBI, trading AZW3's more advanced typography and layout features for compatibility with devices and software that never learned to read the newer format. Useful for keeping an older Kindle or ereader app able to open a book that was only distributed in AZW3, or standardizing a personal ebook library on one older format that every device in the house can actually open.`,
    examples: [
      {
        title: 'Open a newer ebook on an older Kindle',
        code: `Input: novel.azw3\nOutput: novel.mobi (opens on older Kindle hardware)`,
        note: 'Older Kindle devices were built before AZW3 existed and only read MOBI.',
      },
      {
        title: 'Standardize a library on one older format',
        code: `Input: 20 AZW3 files\nOutput: 20 MOBI files`,
        note: 'Keeps an entire library openable on devices that never supported AZW3.',
      },
    ],
  },

  'add-pages-to-pdf': {
    description: `Building a finished PDF sometimes means combining pieces that started as separate documents entirely: inserting a blank page for handwritten notes into a form, merging a signed signature page from one file into the main contract, or reordering pages after realizing the appendix should come before the summary instead of after it. This tool works at the page level rather than editing content within a page: add blank pages at a specific position, insert existing pages pulled from another PDF, and rearrange the resulting order until the document reads the way it's supposed to. Useful for assembling a multi-part document from pieces that started as separate files, inserting a blank page into a form that needs space for handwritten additions, or fixing a PDF whose pages ended up in the wrong order after scanning.`,
    examples: [
      {
        title: 'Insert a blank page for handwritten notes',
        code: `Input: form.pdf, insert: 1 blank page after page 2\nOutput: form-updated.pdf (4 pages, blank page inserted)`,
        note: 'Adds space for handwritten additions without needing to redesign the form.',
      },
      {
        title: 'Merge a signature page from another file',
        code: `Input: contract.pdf (5 pages), signature-page.pdf (1 page)\nOutput: contract-signed.pdf (6 pages, signature page appended)`,
        note: 'Combines pages from two separate PDFs into one final document.',
      },
    ],
  },

  'duplicate-line-finder': {
    description: `Not every duplicate line in a document is actually a mistake, a repeated line in a script or a poem might be entirely intentional, which is exactly why blindly removing every repeat isn't always the right move and a review step first matters. This tool finds duplicate lines and highlights them directly in place, each one numbered so its exact position in the document is clear, rather than deleting anything automatically before a person gets a chance to look at what would actually be removed. Only after reviewing which highlighted lines are genuine mistakes does the one-click removal option come in, applied selectively rather than as a blanket deduplication pass. Useful for reviewing a document where some repetition is deliberate, or double-checking exactly which lines would be removed before committing to a full deduplication.`,
    examples: [
      {
        title: 'Review duplicates before removing anything',
        code: `Input:\n1: "Welcome"\n2: "Please wait"\n3: "Welcome"\nFlagged: line 3 duplicates line 1`,
        note: 'Highlights the duplicate with its line number instead of deleting it automatically.',
      },
      {
        title: 'Keep an intentional repeated line',
        code: `Input: song lyrics with a repeated chorus line\nFlagged: chorus line duplicated 3 times\nAction: reviewed and kept, since the repetition is intentional`,
        note: 'Lets a person decide the repetition is deliberate rather than removing it automatically.',
      },
    ],
  },

  'youtube-script-writer': {
    description: `A YouTube video lives or dies on its first few seconds in a way a blog post's opening paragraph doesn't; the platform itself weighs early retention heavily, so a video that opens slowly loses viewers before the actual content even starts, which means a script needs a specific, fast hook up front that a written article can ease into more gradually. This tool writes video scripts around exactly that structure: an opening hook built to earn the first ten seconds, the main content paced for spoken delivery rather than reading, and a call-to-action placed where it'll actually land, not just tacked onto the very end after most viewers have already left. Useful for planning a new video's structure before filming, or writing a script that accounts for retention mechanics a plain outline wouldn't consider.`,
    examples: [
      {
        title: 'Write an opening hook for a tutorial video',
        code: `Input: topic: "how to fix a leaky faucet"\nOutput: "Your faucet is dripping right now, and it's costing you more than you think. Here's the five-minute fix."`,
        note: 'Built to earn attention in the first few seconds rather than easing into the topic.',
      },
      {
        title: 'Place a call-to-action mid-video instead of only at the end',
        code: `Script structure: hook (0:00-0:15), main content (0:15-6:00), CTA (6:00), remaining content (6:00-8:00)`,
        note: 'Places the subscribe prompt before viewer drop-off typically peaks, not only in a closing card most viewers never see.',
      },
    ],
  },

  'psd-to-svg': {
    description: `Vectorizing a PSD works well specifically when the file is actually built from vector material, shape layers, text, paths drawn with Photoshop's vector tools, and works badly the moment it's mostly photographic content, since a photo traced into vector shapes turns into a bloated mess of paths trying to approximate something that was never geometric to begin with. This tool converts a PSD into SVG by preserving the shape and text layers as genuine vector paths, which is the right fit for a logo or icon mockup built in Photoshop using its vector tools rather than a photo composite. Useful for exporting a logo designed in Photoshop into a scalable SVG for web use, or getting a PSD-based icon mockup into a format that stays sharp in print at any size.`,
    examples: [
      {
        title: 'Export a logo built from vector shape layers',
        code: `Input: logo-mockup.psd (shape layers + text, no photos)\nOutput: logo.svg (clean vector paths)`,
        note: 'Works well because the source is built from shapes and text rather than photographic content.',
      },
      {
        title: 'See why a photo-heavy PSD traces poorly',
        code: `Input: photo-collage.psd (mostly photographic layers)\nOutput: photo-collage.svg (thousands of paths, large file, poor visual match)`,
        note: 'Photographic content has no clean geometric shapes for a vector trace to follow.',
      },
    ],
  },

  'json-schema-generator': {
    description: `A single example API response shows you one snapshot of a shape; a JSON Schema is a formal, machine-checkable description of that shape that an actual validation library can run against every future response to confirm it still matches, catching the moment an API silently changes something rather than finding out from a downstream error much later. This tool infers a JSON Schema directly from sample data, with strictness and which fields count as required both adjustable, since a schema generated from one example is often stricter than reality actually calls for until those settings get tuned. Useful for generating a starting schema from a real API response to validate future responses against, or documenting the exact shape a piece of JSON data is expected to have in a way tooling can actually enforce rather than just describe in prose.`,
    examples: [
      {
        title: 'Generate a schema from a sample API response',
        code: `Input: {"id": 42, "name": "Widget", "inStock": true}\nOutput: { "type": "object", "properties": { "id": {"type": "integer"}, "name": {"type": "string"}, "inStock": {"type": "boolean"} }, "required": ["id", "name", "inStock"] }`,
        note: 'Produces a schema a validation library can run against every future response.',
      },
      {
        title: 'Loosen strictness for optional fields',
        code: `Input: sample with an occasionally-missing "discount" field, strictness: relaxed\nOutput: schema with "discount" excluded from required`,
        note: 'Prevents an occasionally-absent field from being wrongly marked as always required.',
      },
    ],
  },
};

export default FIX_BATCH_22;
