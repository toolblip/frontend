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

const FIX_BATCH_98: Record<string, FixBatchEntry> = {
  'encodings-reference': {
    description: `A character that shows up as three garbled symbols instead of one accented letter is usually a UTF-8 byte sequence read as something else entirely, and tracking that down means understanding several encoding layers at once, how a character maps to raw bytes, how those bytes might get represented as Base64, how a reserved character gets percent-encoded in a URL, rather than consulting a separate page for each one. This tool provides reference tables covering ASCII, UTF-8, HTML entities, URL encoding, Base64, and more, built as a single cross-reference rather than several separate lookup pages. Useful for tracking down an encoding mismatch bug by checking how a character is represented across several layers at once, looking up a Base64 or percent-encoded value's meaning without switching between reference sites, or understanding how a character moves from its raw byte representation through to a URL-safe or HTML-safe form.`,
    examples: [
      {
        title: 'Trace a character through UTF-8 and Base64',
        code: `Character: é\nUTF-8 bytes: 0xC3 0xA9\nBase64 (of "é"): w6k=`,
        note: 'Shows the same character across multiple encoding layers at once.',
      },
      {
        title: 'Look up a percent-encoded URL character',
        code: `Character: &\nURL encoding: %26\nHTML entity: &amp;`,
        note: 'Cross-references URL and HTML encoding for the same character.',
      },
    ],
  },

  'env-parser': {
    description: `A value containing an unquoted # gets misread as the start of a comment rather than part of the actual value, a value with a space in it gets silently truncated at that space without quotes around it, and a multi-line value needs its own specific escape handling, mistakes that are easy to introduce and don't announce themselves until an application reads a config value that's quietly wrong or missing. This tool parses and validates .env files, extracting every key and value while flagging syntax errors these specific mistakes actually produce. Useful for catching a value truncated by an unquoted space before it silently breaks a running application, spotting a # character accidentally treated as a comment marker inside an unquoted value, or validating a .env file's syntax before it gets deployed somewhere the mistake would actually matter.`,
    examples: [
      {
        title: 'Catch a value truncated by an unquoted space',
        code: `Input: API_KEY=abc 123\nOutput: warning - value truncated at space, wrap in quotes: API_KEY="abc 123"`,
        note: 'Flags a silent truncation before it reaches a running application.',
      },
      {
        title: 'Spot a # misread as a comment',
        code: `Input: PASSWORD=hunter#2\nOutput: warning - "#2" may be read as a comment, quote the value`,
        note: 'Catches a character that changes meaning depending on quoting.',
      },
    ],
  },

  'eps-to-jpg': {
    description: `A vector logo destined for a catalog thumbnail or a quick web preview doesn't need transparency preserved, it needs a small, flattened file that loads fast, which makes JPEG's lossy compression and lack of an alpha channel a reasonable tradeoff specifically when the background is going to be solid anyway and file size matters more than a see-through edge. This tool converts EPS vector files into JPG, producing a flattened, compressed raster image built for a solid-background context rather than one needing transparency. Useful for generating a small, fast-loading thumbnail preview of vector artwork for a catalog or a gallery, converting EPS artwork into a compressed raster image when transparency was never actually needed, or producing a lightweight JPG version of vector art for a web page where file size matters more than perfect edge quality.`,
    examples: [
      {
        title: 'Generate a fast-loading catalog thumbnail',
        code: `Input: product-logo.eps\nOutput: product-logo-thumb.jpg (flattened, compressed)`,
        note: 'Produces a small file for a solid-background preview context.',
      },
      {
        title: 'Convert vector art for a web gallery',
        code: `Input: illustration.eps\nOutput: illustration.jpg`,
        note: 'Trades transparency for a smaller, faster-loading file.',
      },
    ],
  },

  'eps-to-png': {
    description: `A logo that needs to sit over a colored background, a photo, or anything other than solid white can't afford to lose its transparency the way a flattened JPEG export would, which is exactly the case a PNG output is actually built for, preserving the see-through areas an EPS file's vector paths defined rather than filling them in with an assumed background color. This tool converts EPS vector files into PNG, keeping transparency intact rather than flattening it the way a JPEG conversion would. Useful for converting a logo into a PNG that still sits transparently over any background color or image, preserving an EPS file's transparent areas when the destination isn't a solid background, or producing a raster version of vector artwork that keeps its see-through edges intact.`,
    examples: [
      {
        title: 'Keep a logo transparent over any background',
        code: `Input: logo.eps\nOutput: logo.png (transparent background preserved)`,
        note: "Doesn't fill transparent areas with an assumed background color.",
      },
      {
        title: 'Convert artwork meant for a colored page',
        code: `Input: icon.eps\nOutput: icon.png`,
        note: 'Preserves see-through edges a JPEG export would flatten.',
      },
    ],
  },

  'excel-to-csv': {
    description: `A workbook with several tabs, a summary sheet, a data sheet, a notes sheet, doesn't map cleanly onto CSV at all, since CSV is fundamentally a single flat table with no concept of multiple sheets, which means exporting a multi-sheet workbook means picking one sheet at a time or ending up with a separate CSV file for each, not one file somehow representing the whole structure. This tool converts an Excel spreadsheet into CSV, exporting sheet data cleanly into the single flat structure CSV actually supports. Useful for exporting one specific sheet from a multi-tab workbook without the other sheets coming along, converting Excel data into CSV for a system that only accepts a flat, single-table format, or extracting a spreadsheet's data cleanly when only one sheet's worth of information is actually needed.`,
    examples: [
      {
        title: 'Export one sheet from a multi-tab workbook',
        code: `Input: report.xlsx (sheets: Summary, Data, Notes), export: "Data"\nOutput: data.csv`,
        note: 'Exports the selected sheet without the others coming along.',
      },
      {
        title: 'Convert Excel data for a flat-format system',
        code: `Input: inventory.xlsx\nOutput: inventory.csv`,
        note: 'Produces the single flat table CSV actually supports.',
      },
    ],
  },

  'excel-to-xml': {
    description: `A spreadsheet with columns for a customer's name, an order ID, and an item purchased isn't just a flat table when the actual relationships matter, it's really a customer containing orders containing items, a hierarchy CSV has no way to express but XML can represent directly by nesting elements to match how those columns actually relate to each other rather than just mirroring rows and columns flatly. This tool converts Excel data into XML, mapping cells to elements in a way that can reflect real structure between columns rather than a flat row-by-row export. Useful for converting spreadsheet data into a properly nested XML structure that reflects real relationships between columns, mapping cells to XML elements for a system that expects hierarchical rather than flat data, or exporting Excel data into XML when the relationships between columns actually matter to how it's represented.`,
    examples: [
      {
        title: 'Map related columns into nested elements',
        code: `Input columns: customer_name, order_id, item\nOutput: <customer><name>Jane</name><order><id>4821</id><item>Widget</item></order></customer>`,
        note: 'Reflects the real relationship between columns rather than a flat row.',
      },
      {
        title: 'Export for a system expecting hierarchical data',
        code: `Input: orders.xlsx\nOutput: orders.xml (nested structure)`,
        note: 'Produces structure a flat CSV export could never represent.',
      },
    ],
  },

  'extract-audio': {
    description: `Pulling audio out of one specific format, a WebM screen recording, an MKV movie file, an MP4 phone video, each has its own dedicated single-purpose tool, but a general extraction tool that accepts virtually any video container and lets the output format be chosen, MP3 for something portable, WAV for something meant for further editing, skips needing a different tool for every source format that shows up. This tool extracts audio tracks from video files in a range of formats, saving the result as MP3, WAV, or another chosen format rather than being locked to one source-to-target pairing. Useful for pulling audio out of whatever video format happens to be on hand without hunting for a matching single-purpose tool, choosing MP3 for a portable file or WAV for further editing from the same source video, or extracting audio from an uncommon video format a dedicated single-pair tool might not support.`,
    examples: [
      {
        title: 'Pull audio from an uncommon video format',
        code: `Input: recording.3gp\nOutput: recording.mp3`,
        note: 'Accepts a format a single-pair extraction tool might not support.',
      },
      {
        title: 'Choose WAV for further editing',
        code: `Input: interview.mov, format: WAV\nOutput: interview.wav`,
        note: 'Lets the output format be chosen rather than fixed to one pairing.',
      },
    ],
  },

  'fake-data-generator': {
    description: `A test database table populated with rows where the name, the email, and the address all belong to the same coherent fictional person looks like real data in a way that assembling those fields separately and stitching them together by hand never quite manages, especially across dozens of rows at once. This tool generates complete fake records, names, emails, addresses, and other fields together as internally consistent data, rather than producing just one field type at a time. Useful for populating a test database with rows that look like real user records rather than mismatched fields, generating a demo dataset of coherent fake people for a prototype, or seeding multiple realistic, consistent test records at once instead of assembling each field separately by hand.`,
    examples: [
      {
        title: 'Generate coherent fake user records',
        code: `Output: { "name": "Jane Morales", "email": "jane.morales83@example.com", "address": "412 Oak St, Denver, CO" }`,
        note: 'Produces fields that belong to the same consistent fictional person.',
      },
      {
        title: 'Seed a test database with multiple records',
        code: `Input: count: 50\nOutput: 50 complete, internally consistent fake records`,
        note: 'Generates a batch of realistic rows rather than one field at a time.',
      },
    ],
  },

  'faq-generator': {
    description: `The way someone actually types a search query, "is X safe for kids" or "how does X actually work," reads nothing like the statement-style phrasing ordinary page content targets, and answering those exact question forms directly is both what an FAQ section is naturally built for and what makes it eligible for Google's FAQ rich snippet, a structured search result regular body text doesn't qualify for at all. This tool generates FAQ sections built around real question-phrased search queries, producing question-and-answer pairs shaped for that specific kind of search intent rather than general topic content. Useful for generating question-and-answer pairs that directly match how people actually phrase a search query, building an FAQ section structured to qualify for a rich snippet in search results, or covering the specific questions a topic's audience is actually searching for rather than a general overview of it.`,
    examples: [
      {
        title: 'Target real question-phrased search queries',
        code: `Input: topic: "meal prep containers"\nOutput: "Are meal prep containers microwave safe?", "How long do meal prep containers keep food fresh?"`,
        note: 'Matches how people actually phrase a search query.',
      },
      {
        title: 'Structure content for a rich snippet',
        code: `Input: topic: "car insurance for teens"\nOutput: 6 Q&A pairs formatted for FAQ structured data`,
        note: "Qualifies for Google's FAQ rich snippet in search results.",
      },
    ],
  },

  'favicon-icon-generator': {
    description: `Not having a logo yet doesn't have to stop a favicon from getting made, typing a couple of initials or picking an emoji works as a starting point just as well as uploading an actual image does, and getting ICO, PNG, and SVG output together in one pass covers older browsers, modern ones, and scalable dark-mode-aware favicons without running the same source through three separate single-format tools. This tool generates favicon icons from text, emoji, or an uploaded image, producing ICO, PNG, and SVG output together from whichever starting point is actually available. Useful for generating a quick favicon from typed initials or an emoji when no logo exists yet, producing all three common favicon formats from one image in a single pass, or covering older and modern browser favicon requirements together instead of running separate tools for each format.`,
    examples: [
      {
        title: 'Generate a favicon from initials, no logo needed',
        code: `Input: text: "TB", background: #2563EB\nOutput: favicon.ico, favicon.png, favicon.svg`,
        note: 'Starts from typed text rather than requiring an existing image.',
      },
      {
        title: 'Cover every favicon format from one image',
        code: `Input: logo.png\nOutput: favicon.ico (legacy), favicon.png (modern), favicon.svg (scalable)`,
        note: 'Produces all three common formats in a single pass.',
      },
    ],
  },
};

export default FIX_BATCH_98;
