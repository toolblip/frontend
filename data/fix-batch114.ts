// Rewritten content for 5 tools flagged for quality issues.
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

const FIX_BATCH_114: Record<string, FixBatchEntry> = {
  'word-combinations-generator': {
    description: `A business name generator crosses an adjective list against a noun list looking for something a trademark search hasn't claimed, and a keyword tool crosses a modifier list against a product term looking for a search phrase worth targeting, but a band name or a fictional place name comes from the exact same process, pairing a mood word against an imagery word, aimed at a creative project instead of a commercial or an SEO one. This tool generates every two and three-word combination from a list of words for brainstorming, built around exploring creative pairings rather than a commercial naming search or a keyword research pass. Useful for brainstorming a band name by crossing a mood-word list against an imagery-word list, generating fictional place names for a story by pairing descriptive words with location terms, or exploring pairings for a creative project a commercial or SEO-focused naming tool wouldn't target.`,
    examples: [
      {
        title: 'Brainstorm a band name from mood and imagery words',
        code: `Input: moods: [velvet, hollow, wild], imagery: [static, echo, garden]\nOutput: Velvet Static, Hollow Echo, Wild Garden, and every other pairing`,
        note: 'Aimed at a creative project rather than commercial naming.',
      },
      {
        title: 'Generate fictional place names for a story',
        code: `Input: descriptors: [Ashen, Silver], locations: [Hollow, Reach, Vale]\nOutput: Ashen Hollow, Silver Reach, Ashen Vale, and every other pairing`,
        note: 'Explores pairings a keyword or naming tool would never target.',
      },
    ],
  },

  'word-complexity-analyzer': {
    description: `A readability score gives back one number for an entire passage, but it doesn't point at which specific word actually dragged that number down, 'utilize' instead of 'use,' 'facilitate' instead of 'help,' individual multi-syllable words a reader stumbles on even when the surrounding sentence structure is otherwise perfectly fine. This tool analyzes text for average syllable count and suggests simpler word-level alternatives, flagging specific complex words directly rather than only producing a single overall readability score for the whole passage. Useful for finding the exact words dragging a document's readability down rather than just seeing a grade-level number with no clear next step, swapping an unnecessarily complex word for a simpler one a reader won't stumble on, or catching a habit of reaching for inflated vocabulary throughout a draft one flagged word at a time.`,
    examples: [
      {
        title: 'Find the exact words hurting readability',
        code: `Input: "We need to utilize this data to facilitate better decisions."\nOutput: "utilize" -> "use", "facilitate" -> "help"`,
        note: 'Flags specific words rather than one overall score.',
      },
      {
        title: 'Catch a pattern of inflated vocabulary',
        code: `Input: [1,200-word report]\nOutput: 14 complex words flagged with simpler alternatives suggested`,
        note: 'Gives a clear next step instead of just a grade-level number.',
      },
    ],
  },

  'xml-to-csv': {
    description: `Opening a converted file in Excel for a teammate to review is a different destination than feeding it straight into a script, a database import, or another system that expects a plain, universally readable format rather than a spreadsheet's binary file structure that needs a compatible library just to parse it. This tool converts XML data into CSV format, producing a plain, universally importable file built for a script or a database pipeline rather than a spreadsheet meant for a person to open and review. Useful for feeding a converted XML export directly into a script or an import pipeline that expects CSV, getting XML data into a format nearly any system can ingest without a spreadsheet library, or converting structured XML data for a destination that's another program rather than a human opening a spreadsheet.`,
    examples: [
      {
        title: 'Feed converted XML into an import pipeline',
        code: `Input: <records><record><id>1</id><name>Jane</name></record></records>\nOutput: id,name\n1,Jane`,
        note: 'Produces a plain format a script can ingest directly.',
      },
      {
        title: 'Convert XML for a database import',
        code: `Input: product-feed.xml\nOutput: product-feed.csv (ready for a database import job)`,
        note: 'No spreadsheet library needed to parse the result.',
      },
    ],
  },

  'yaml-pretty-print': {
    description: `YAML generated programmatically or written quickly under time pressure is often technically valid, no syntax errors, nothing actually broken, but inconsistently indented in a way that makes it genuinely hard to read and review, two spaces in one block and four in another, which is a formatting problem rather than the kind of error that stops a file from parsing at all. This tool formats and indents YAML with syntax highlighting and configurable spacing, cleaning up already-valid YAML for readability rather than hunting for a syntax error that's actually breaking it. Useful for reformatting a programmatically generated YAML file into consistent, readable indentation, cleaning up a config file that mixes indentation styles before a code review, or applying syntax highlighting and consistent spacing to a YAML file that's already valid but genuinely hard to read as written.`,
    examples: [
      {
        title: 'Reformat programmatically generated YAML',
        code: `Input: [YAML with mixed 2-space and 4-space indentation]\nOutput: [same YAML, consistently indented and highlighted]`,
        note: 'Cleans up formatting rather than fixing a syntax error.',
      },
      {
        title: 'Clean up a config before code review',
        code: `Input: docker-compose.yml (valid but inconsistently spaced)\nOutput: docker-compose.yml, reformatted with configurable spacing`,
        note: 'Improves readability of YAML that already parses correctly.',
      },
    ],
  },

  zip: {
    description: `Sending a batch of different file types, a handful of photos, a spreadsheet, a couple of PDFs, as one attachment instead of five separate ones means bundling them together first, and doing that also shrinks the total transfer size through compression, two benefits a tool built for merging one specific file type, like combining several PDFs into one document, was never built to handle across different file types at once. This tool creates a ZIP archive from multiple files of any type, compressing them into a single shareable file rather than combining same-format documents into one. Useful for bundling a mix of photos, spreadsheets, and documents into a single email attachment instead of sending each one separately, compressing a batch of large files down for a faster upload or transfer, or archiving a folder's worth of mixed file types into one file for easier sharing or storage.`,
    examples: [
      {
        title: 'Bundle mixed file types into one attachment',
        code: `Input: photo.jpg, budget.xlsx, contract.pdf\nOutput: bundle.zip (all three files, compressed)`,
        note: 'Works across different file types, unlike a same-format merge tool.',
      },
      {
        title: 'Compress a batch of large files for transfer',
        code: `Input: 12 large video files (2.1 GB total)\nOutput: videos.zip (1.4 GB, compressed)`,
        note: 'Shrinks total size for a faster upload or transfer.',
      },
    ],
  },
};

export default FIX_BATCH_114;
