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

const FIX_BATCH_112: Record<string, FixBatchEntry> = {
  translate: {
    description: `A phrase that translates literally word for word often loses whatever idiom or cultural reference made it actually mean something in the original language, a gap machine translation handles inconsistently depending on the specific language pair and how commonly that combination gets trained on, which matters more for casual or idiomatic text than for a straightforward technical sentence with little room for ambiguity. This tool translates text between more than a hundred languages, covering language pairs a smaller or a paid-only translation service often doesn't support at all. Useful for translating text into or out of a less commonly supported language a mainstream translation tool might not offer, getting a fast, workable translation for straightforward technical or factual content, or translating a phrase quickly while staying aware that idiomatic or culturally specific wording may need a closer human look afterward.`,
    examples: [
      {
        title: 'Translate into a less common language pair',
        code: `Input: "Where is the nearest pharmacy?" -> Icelandic\nOutput: "Hvar er næsta apótek?"`,
        note: 'Covers pairs a smaller translation service might not offer.',
      },
      {
        title: 'Translate straightforward technical content',
        code: `Input: "Restart the router and wait 30 seconds." -> Spanish\nOutput: "Reinicia el router y espera 30 segundos."`,
        note: 'Handles factual text with little idiomatic ambiguity well.',
      },
    ],
  },

  'tsv-json-express': {
    description: `A comma shows up constantly inside real data, an address, a product description, a number written with a thousands separator, which is exactly why CSV needs quoting rules to avoid breaking on a value that contains one, while a tab almost never appears inside an actual data value, making tab-separated data a naturally safer export format for content that would otherwise need careful escaping. This tool converts tab-separated data into JSON with automatic header row detection and type inference, correctly turning a column of numeric-looking values into actual JSON numbers rather than treating every value as a raw string. Useful for converting a TSV export into JSON without CSV's comma-escaping headaches, getting numeric and boolean columns correctly typed instead of left as strings, or converting tab-separated data copied from a spreadsheet into structured JSON automatically.`,
    examples: [
      {
        title: "Convert a TSV export without comma escaping",
        code: `Input: name\tprice\tin_stock\nWidget\t9.99\ttrue\nOutput: [{"name":"Widget","price":9.99,"in_stock":true}]`,
        note: 'Infers real number and boolean types automatically.',
      },
      {
        title: 'Convert data copied from a spreadsheet',
        code: `Input: [TSV pasted from a spreadsheet selection]\nOutput: JSON array with headers detected automatically`,
        note: 'No manual header mapping or comma escaping needed.',
      },
    ],
  },

  unblur: {
    description: `A simple sharpening filter increases contrast at existing edges without caring what actually caused an image to look soft in the first place, but a photo blurred by camera shake carries a directional streak pattern distinct from one that's merely out of focus, and modeling that specific pattern to reverse it is a more targeted correction than a generic contrast boost applied uniformly across the whole image. This tool fixes blurry photos by sharpening and enhancing low-resolution images, working best on a genuinely blurry photo with a recognizable cause rather than applying the same flat contrast enhancement everywhere. Useful for correcting a photo blurred by camera shake or subject motion, cleaning up a low-resolution image where detail is genuinely degraded rather than just slightly soft, or fixing a blurry shot where a targeted correction actually outperforms a generic sharpening pass.`,
    examples: [
      {
        title: 'Correct a camera-shake blur',
        code: `Input: photo.jpg (directional motion streak)\nOutput: photo-fixed.jpg (streak pattern modeled and reversed)`,
        note: 'Targets the specific blur pattern rather than a flat contrast boost.',
      },
      {
        title: 'Clean up a genuinely low-resolution image',
        code: `Input: old-photo.jpg (degraded detail)\nOutput: old-photo-fixed.jpg`,
        note: 'Works best on real blur, not just slightly soft focus.',
      },
    ],
  },

  upscale: {
    description: `An image that looks sharp on a screen can still fall short of what a large-format print actually needs, since printing at a real physical size requires a specific pixel density, roughly 300 DPI at the final print dimensions, a requirement screen resolution alone says nothing about and a source photo can quietly fail to meet the moment it's meant for a poster or a banner rather than a display. This tool increases image resolution without quality loss using AI-powered enlargement, built for hitting a real print resolution requirement at a larger physical size rather than just making an image look bigger on screen. Useful for boosting a photo's resolution to meet a print shop's DPI requirement before ordering a large poster, preparing an image for a banner print at a size the original wouldn't support, or upscaling an image to satisfy a print requirement rather than a screen display.`,
    examples: [
      {
        title: "Meet a print shop's DPI requirement",
        code: `Input: photo.jpg (1200x800px), target: 24x16in poster at 300 DPI\nOutput: photo-upscaled.jpg (7200x4800px)`,
        note: 'Hits a physical print resolution, not just a bigger screen image.',
      },
      {
        title: 'Prepare an image for a large banner print',
        code: `Input: logo.png (low resolution)\nOutput: logo-upscaled.png (meets banner print DPI requirement)`,
        note: 'Solves a print-specific need screen resolution alone misses.',
      },
    ],
  },

  'uuid-comparator': {
    description: `Two UUIDs generated close together don't reveal which one actually came first just by looking at them, unless the version itself encodes time, v1 built from a timestamp, v7 explicitly time-ordered, in which case comparing them can actually answer a real chronological question rather than just checking whether they match. This tool compares two UUIDs to check equality and sort them chronologically by timestamp, answering a genuinely different question than validating a UUID's format or normalizing its casing. Useful for determining which of two v7 UUIDs was actually generated first when debugging event ordering, confirming a UUID-based ID scheme is producing identifiers in true chronological insertion order, or checking whether two UUID strings that look different actually represent the exact same identifier.`,
    examples: [
      {
        title: 'Determine which v7 UUID was generated first',
        code: `Input: 018f2e3a-..., 018f2e3b-...\nOutput: first UUID generated earlier by 42ms`,
        note: 'Answers a chronological question, not just equality.',
      },
      {
        title: 'Confirm an ID scheme orders correctly',
        code: `Input: [batch of v7 UUIDs from an event log]\nOutput: sorted chronologically, order matches actual event timestamps`,
        note: 'Verifies true insertion order for time-ordered UUID versions.',
      },
    ],
  },

  'uuid-normalizer': {
    description: `A0EEBC99 and a0eebc99 are the exact same UUID value written in different letter casing, both technically valid, but a system doing a plain string comparison instead of a proper UUID-aware one will treat them as two different values entirely, a false mismatch that has nothing to do with the UUIDs actually being different. This tool normalizes UUID formats between v1, v4, and v7 with uppercase or lowercase output, producing consistent casing so a batch of UUIDs compares and deduplicates correctly rather than tripping over a case mismatch. Useful for normalizing a batch of UUIDs to consistent casing before a string-based deduplication pass, preventing a false mismatch in a database lookup caused purely by inconsistent letter case, or standardizing UUID formatting across data pulled from multiple sources that each used different casing conventions.`,
    examples: [
      {
        title: 'Normalize a batch before deduplication',
        code: `Input: A0EEBC99-..., a0eebc99-...\nOutput: both normalized to a0eebc99-... (recognized as identical)`,
        note: 'Prevents a false mismatch from pure case difference.',
      },
      {
        title: 'Standardize casing across merged data sources',
        code: `Input: UUIDs from System A (uppercase) and System B (lowercase)\nOutput: all UUIDs normalized to lowercase`,
        note: 'Fixes inconsistent casing conventions before comparison.',
      },
    ],
  },

  'volume-unit-converter': {
    description: `A US gallon and an imperial gallon aren't actually the same size, roughly 3.785 liters against 4.546 liters, a genuine twenty percent difference that makes converting 'gallons' without specifying which convention a real source of error rather than a rounding nuance, the same gap that shows up between a US and a UK fluid ounce as well. This tool converts between liters, gallons, milliliters, fluid ounces, and cubic centimeters, built around the specific unit conventions a source actually used rather than treating a unit name as universally the same everywhere. Useful for converting a US recipe's gallon or fluid ounce measurements correctly for a metric kitchen, checking whether a UK gallon figure actually matches what a US gallon conversion would produce, or converting a volume measurement while making sure the right regional convention was actually applied.`,
    examples: [
      {
        title: 'Convert a US recipe to metric',
        code: `Input: 1 US gallon\nOutput: 3.785 liters`,
        note: 'Uses the correct regional convention, not a generic gallon.',
      },
      {
        title: 'Compare US and UK gallon figures',
        code: `Input: 1 UK (imperial) gallon\nOutput: 4.546 liters (not the same as a US gallon)`,
        note: 'Catches the ~20% gap between the two gallon conventions.',
      },
    ],
  },

  'vsd-to-docx': {
    description: `A flowchart embedded inside a longer written report or a specification document needs to sit alongside explanatory text that someone can actually keep editing, which is a different requirement than just viewing a diagram or dropping it into a slide, since the diagram has to become part of an editable document's flow rather than a standalone file. This tool converts a Visio VSD diagram into a Word document, letting the surrounding written content get edited in Word without ever needing Visio installed, built for a report or a document context rather than a presentation or a static viewable file. Useful for embedding a converted flowchart inside a written specification document that needs ongoing text edits, adding an org chart to a report where the accompanying explanation still needs writing, or getting a Visio diagram into a document someone can keep editing without owning Visio.`,
    examples: [
      {
        title: 'Embed a flowchart in a specification document',
        code: `Input: process-flow.vsd\nOutput: process-flow.docx (diagram embedded, surrounding text editable)`,
        note: "Becomes part of an editable document's flow, not a static file.",
      },
      {
        title: 'Add an org chart to a report',
        code: `Input: org-chart.vsd\nOutput: org-chart.docx`,
        note: 'Lets the written explanation keep getting edited without Visio.',
      },
    ],
  },

  'vsd-to-pptx': {
    description: `A flowchart headed into a stakeholder presentation or a training deck needs to become an actual slide, with PowerPoint's own layout tools, builds, and presenter view available, a fundamentally different destination than a written report's document flow or a static image dropped somewhere for reference. This tool converts a Visio VSD diagram into a PowerPoint presentation, built specifically for the slide deck context rather than a document or a standalone viewable file. Useful for turning a Visio org chart into an actual slide for a presentation to stakeholders, converting a process flowchart into editable PowerPoint slides for a training deck, or getting a Visio diagram into a presentation format where PowerPoint's own editing tools can actually be used on it.`,
    examples: [
      {
        title: 'Turn an org chart into a presentation slide',
        code: `Input: org-chart.vsd\nOutput: org-chart.pptx (editable slide)`,
        note: 'Built for the slide deck context, not a document.',
      },
      {
        title: 'Convert a flowchart for a training deck',
        code: `Input: onboarding-process.vsd\nOutput: onboarding-process.pptx`,
        note: "Uses PowerPoint's own editing tools, not a static image.",
      },
    ],
  },
};

export default FIX_BATCH_112;
