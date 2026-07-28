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

const FIX_BATCH_103: Record<string, FixBatchEntry> = {
  'lorem-ipsum-bytes': {
    description: `Most placeholder text generators think in words or paragraphs, a semantic unit of content, but testing a database column's maximum length, an API payload size limit, or how text wraps right at a specific byte boundary calls for something else entirely, an exact byte count, which gets trickier once multi-byte UTF-8 characters are involved since word count and actual byte size don't track each other in any predictable way. This tool generates lorem ipsum controlled by byte size directly, alongside HTML tags and a customizable paragraph count, built for a size-in-bytes requirement rather than a word or paragraph target. Useful for generating placeholder text that fits an exact byte limit for testing a database field's maximum length, producing a payload of a specific byte size to test an API's size restrictions, or checking how text truncates right at a defined byte boundary rather than a character or word count.`,
    examples: [
      {
        title: "Test a database field's byte limit",
        code: `Input: byte size: 255\nOutput: lorem ipsum text totaling exactly 255 bytes`,
        note: 'Targets an exact byte count rather than a word or paragraph target.',
      },
      {
        title: "Generate a payload for an API's size limit",
        code: `Input: byte size: 1024, format: HTML\nOutput: <p>...</p> totaling 1024 bytes`,
        note: 'Accounts for multi-byte characters diverging from word count.',
      },
    ],
  },

  'lorem-ipsum-generator-pro': {
    description: `Needing an exact word count on one project, a byte-size limit on another, and HTML-wrapped paragraphs on a third means either switching between several single-purpose lorem ipsum tools as the requirement shifts, or reaching for one that already covers every mode without abandoning it the moment the need changes mid-project. This tool generates lorem ipsum text with byte-size, word count, paragraph, and HTML tag options together in one place, built around switching modes as the actual requirement shifts rather than committing to one fixed output style. Useful for generating placeholder text by word count for one mockup and switching to byte-size mode for a different task without changing tools, wrapping generated paragraphs in HTML tags for a CMS preview, or covering whatever specific lorem ipsum format a project happens to need next without hunting for a different generator each time.`,
    examples: [
      {
        title: 'Switch between word count and byte-size mode',
        code: `Mode: word count, target: 50\nMode: byte size, target: 512\nOutput: both handled by the same tool without switching`,
        note: 'Covers multiple modes rather than one fixed output style.',
      },
      {
        title: 'Generate HTML-wrapped paragraphs for a CMS preview',
        code: `Input: paragraphs: 3, HTML tags: true\nOutput: <p>Lorem ipsum...</p><p>Dolor sit...</p><p>Amet...</p>`,
        note: 'Adds HTML wrapping as one of several selectable options.',
      },
    ],
  },

  'lorem-ipsum-paragraphs': {
    description: `A full page mockup, a blog article layout, a terms-of-service page, needs placeholder text that actually reads like real prose, proper sentence boundaries and a realistic paragraph structure, not just a block of words cut off wherever a target count happens to land, which is a meaningfully different visual result than a word-count generator produces. This tool generates multiple paragraphs of lorem ipsum with custom word and sentence options, controlling structure at the sentence level so the result actually looks like real paragraph-based content rather than truncated filler. Useful for mocking up a full article or page layout that needs to look like genuine paragraph-based prose, controlling sentence length so a design mockup's text block reads at a realistic rhythm, or generating enough structured paragraphs to test how a long-form layout actually handles real content flow.`,
    examples: [
      {
        title: 'Mock up a full article layout',
        code: `Input: paragraphs: 5, sentences per paragraph: 4\nOutput: 5 paragraphs of realistic, sentence-structured placeholder text`,
        note: 'Reads like genuine prose rather than a word-count-truncated block.',
      },
      {
        title: 'Test a long-form layout with realistic flow',
        code: `Input: paragraphs: 8, avg sentence length: 15 words\nOutput: structured paragraphs matching a realistic reading rhythm`,
        note: 'Controls structure at the sentence level, not just total word count.',
      },
    ],
  },

  'lorem-ipsum-words': {
    description: `A button label, a card headline, a short bio field, these spots need placeholder text sized to exactly what fits there, a specific handful of words, not a full paragraph that would overflow a small text box or make a compact mockup element look broken before any real content even gets written. This tool generates a specific number of lorem ipsum words for placeholder content in design mockups, sized precisely to a small UI element rather than a paragraph generator's larger output. Useful for filling a button or a headline with exactly the right amount of placeholder text to preview how it actually fits, testing whether a compact UI element handles a specific word count without overflowing, or generating a short placeholder phrase for a form field without a full paragraph's worth of unnecessary text.`,
    examples: [
      {
        title: 'Fill a button label with exact word count',
        code: `Input: words: 3\nOutput: "Lorem ipsum dolor"`,
        note: 'Sized to a small UI element rather than a full paragraph.',
      },
      {
        title: 'Preview a headline at a specific length',
        code: `Input: words: 6\nOutput: "Lorem ipsum dolor sit amet consectetur"`,
        note: 'Avoids overflow in a compact mockup element.',
      },
    ],
  },

  'm4a-to-wav': {
    description: `An M4A file's AAC compression has already discarded some of the original audio data permanently by the time it's sitting on disk, and converting to WAV doesn't recover what's gone, but it does stop losing anything further, since a digital audio workstation editing and re-exporting a compressed file over and over compounds that loss with every pass, while uncompressed WAV editing doesn't. This tool converts M4A audio into WAV format, producing the lossless, uncompressed file most audio editing software actually expects rather than working directly with a compressed source. Useful for converting an M4A recording into WAV before importing it into a digital audio workstation for editing, avoiding repeated compression artifacts from re-exporting a compressed file multiple times during an edit, or getting audio into the uncompressed format a specific plugin or editing tool requires as input.`,
    examples: [
      {
        title: 'Convert before importing into a DAW',
        code: `Input: voice-memo.m4a\nOutput: voice-memo.wav (uncompressed, editing-ready)`,
        note: 'Stops further compression loss during repeated editing passes.',
      },
      {
        title: 'Prepare audio for a plugin requiring WAV input',
        code: `Input: podcast-segment.m4a\nOutput: podcast-segment.wav`,
        note: 'Matches the uncompressed format many editing tools expect.',
      },
    ],
  },

  'make-background-transparent': {
    description: `Removing a background isn't usually the actual end goal, it's a step toward something else, dropping an isolated product photo into a catalog listing, layering a subject over a different design, compositing an image into a poster or a thumbnail, which means what actually matters afterward is a clean transparent PNG ready to drop directly into that next composition rather than the removal step itself. This tool removes the background from any image, producing a clean cutout of the subject with a transparent alpha channel meant for reuse in a larger composition. Useful for isolating a product photo for an e-commerce listing that needs a transparent background, cutting a subject out of one photo to layer it into a different design, or producing a reusable transparent asset from a photo instead of a background-removed image meant to stand alone.`,
    examples: [
      {
        title: 'Isolate a product photo for a catalog listing',
        code: `Input: product-shot.jpg\nOutput: product-shot-cutout.png (transparent background)`,
        note: 'Produces an asset ready to drop into a listing template.',
      },
      {
        title: 'Layer a subject into a different design',
        code: `Input: portrait.jpg\nOutput: portrait-cutout.png`,
        note: 'Built for reuse in a composition, not to stand alone.',
      },
    ],
  },

  'markdown-table-from-json': {
    description: `A JSON key like user_id or created_at reads fine in code but looks unpolished sitting as a raw column header in a table meant for a report or a stakeholder-facing document, where a reader expects something closer to 'User ID' or 'Created At' rather than a literal camelCase or snake_case field name copied straight from the data. This tool generates Markdown tables from JSON arrays with customizable alignment and header formatting, letting a raw JSON key get renamed into a readable header rather than appearing in the table exactly as it's written in the data. Useful for turning technical JSON field names into readable headers for a table meant for a non-technical audience, choosing per-column alignment for a table headed into a formatted report, or generating a polished Markdown table from an API response without raw key names showing through into the final document.`,
    examples: [
      {
        title: 'Rename a raw JSON key into a readable header',
        code: `Input: [{"user_id": 1, "created_at": "2026-01-01"}]\nOutput:\n| User ID | Created At |\n|:--------|:-----------|\n| 1       | 2026-01-01 |`,
        note: 'Formats headers for a reader rather than copying raw field names.',
      },
      {
        title: 'Choose per-column alignment for a report',
        code: `Input: [{"item":"Widget","price":9.99}]\nOutput:\n| Item | Price |\n|:-----|------:|\n| Widget | 9.99 |`,
        note: 'Aligns text and numeric columns differently for readability.',
      },
    ],
  },

  'markdown-to-pdf': {
    description: `A Markdown file with code blocks and a table renders fine in an editor's preview pane, but getting that same document into something that can actually be shared, printed, or attached to an email means turning it into a PDF, and doing that entirely client-side matters when the document contains anything that shouldn't be uploaded to a server just to get converted. This tool converts Markdown into a professional PDF instantly, supporting tables, code blocks, and custom themes, with the entire conversion happening client-side rather than through a server upload. Useful for turning a Markdown README or a set of notes into a shareable, printable PDF without uploading the file anywhere, converting a Markdown document containing code blocks into a PDF that preserves their formatting, or generating a themed PDF from Markdown content that shouldn't leave the local machine during conversion.`,
    examples: [
      {
        title: 'Convert a README into a shareable PDF',
        code: `Input: README.md (with tables and code blocks)\nOutput: README.pdf (formatting preserved, converted client-side)`,
        note: 'Never uploads the file to a server during conversion.',
      },
      {
        title: 'Generate a themed PDF from private notes',
        code: `Input: meeting-notes.md, theme: minimal\nOutput: meeting-notes.pdf`,
        note: "Keeps content that shouldn't leave the local machine off any server.",
      },
    ],
  },

  'markup-calculator': {
    description: `A fifty percent markup and a fifty percent margin sound like the same thing but actually aren't, markup is calculated on cost while margin is calculated on the selling price itself, so a hundred-dollar cost with a fifty percent markup produces a hundred-and-fifty-dollar price, which actually works out to a thirty-three percent margin, not fifty, a mix-up that leads directly to under-pricing something based on a profitability assumption that was never actually correct. This tool calculates a selling price from cost and markup percentage, or derives markup from a known cost and price, keeping the calculation anchored correctly to cost rather than conflating it with margin. Useful for pricing a product correctly from its cost and an intended markup percentage, checking what markup percentage is actually being applied to a product given its current cost and selling price, or avoiding a markup-versus-margin mix-up that quietly under-prices something.`,
    examples: [
      {
        title: 'Calculate a selling price from cost and markup',
        code: `Input: cost: $100, markup: 50%\nOutput: price: $150 (margin works out to 33%, not 50%)`,
        note: 'Anchors the calculation to cost rather than selling price.',
      },
      {
        title: 'Derive markup from a known cost and price',
        code: `Input: cost: $80, price: $120\nOutput: markup: 50%`,
        note: 'Works backward from an existing price to its actual markup.',
      },
    ],
  },

  merge: {
    description: `Combining several PDFs into one document by hand usually means opening each file separately and manually copying pages across, an error-prone process for anything beyond two or three short files, especially once the pages need to end up in a specific order pulled from multiple different sources rather than just appended one after another. This tool merges multiple PDF files into a single document, combining pages from different sources in whatever order they're actually needed rather than a fixed append-only sequence. Useful for combining several scanned documents into one PDF for a single submission, merging a cover letter, a resume, and a portfolio into one file for a job application, or assembling pages pulled from multiple source PDFs into one document in a specific intended order.`,
    examples: [
      {
        title: 'Combine scanned documents for one submission',
        code: `Input: page1.pdf, page2.pdf, page3.pdf\nOutput: submission-combined.pdf`,
        note: 'Merges several files into one without manual page copying.',
      },
      {
        title: 'Assemble an application packet in a specific order',
        code: `Input: cover-letter.pdf, resume.pdf, portfolio.pdf\nOutput: application-packet.pdf (in that order)`,
        note: 'Preserves an intended order pulled from multiple sources.',
      },
    ],
  },
};

export default FIX_BATCH_103;
