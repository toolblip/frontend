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

const FIX_BATCH_43: Record<string, FixBatchEntry> = {
  'psd-to-jpg': {
    description: `A PSD built from a retouched photograph, a wedding shot with color grading and skin retouching layered on top, doesn't need transparency preserved the way a logo composite would, which means JPG's lossy compression is actually the right tradeoff rather than a limitation, a smaller, faster-to-share file with no visible quality cost on photographic content that was never going to need a transparent background in the first place. This tool flattens a PSD and exports it directly as JPEG, merging every visible layer into one compressed image sized for fast sharing rather than lossless archival. Useful for exporting a retouched photo composite as a small, easy-to-share JPEG, quickly flattening a multi-layer PSD into one image for a client preview, or getting a photographic PSD into the one format that's small enough to email or upload without a second thought.`,
    examples: [
      {
        title: 'Export a retouched photo composite quickly',
        code: `Input: wedding-photo-final.psd (12 layers, retouching + color grade)\nOutput: wedding-photo-final.jpg (flattened, 1.8 MB)`,
        note: 'Compresses to a small, easy-to-share file since no transparency needs preserving.',
      },
      {
        title: 'Flatten a PSD for a client preview',
        code: `Input: campaign-mockup.psd\nOutput: campaign-mockup.jpg`,
        note: 'Produces a quick, shareable image rather than a lossless archival format.',
      },
    ],
  },

  'pdf-password-remover': {
    description: `A password on a PDF usually exists because the contents are actually sensitive, which makes uploading that same protected file to a server just to strip the password a strange contradiction, sending something you specifically locked down to a third party purely to unlock it. This tool removes password protection entirely inside the browser, so a genuinely sensitive document never actually leaves your device during the process that's supposed to make it more accessible, not less secure. Useful for removing a password from a document you'd rather not upload anywhere even for a moment, unlocking a sensitive file without contradicting the exact reason it was password-protected in the first place, or processing a batch of protected documents without any of them touching a server.`,
    examples: [
      {
        title: 'Remove a password without uploading the file',
        code: `Input: tax-return.pdf (password protected), password: [known]\nOutput: tax-return.pdf (unlocked, processed entirely in-browser)`,
        note: 'Never sends the sensitive document to a server during the process.',
      },
      {
        title: 'Process a batch of protected documents privately',
        code: `Input: 5 password-protected contracts\nOutput: 5 unlocked PDFs, none uploaded anywhere`,
        note: 'Keeps sensitive files local throughout the entire batch.',
      },
    ],
  },

  'favicon-from-emoji': {
    description: `A real logo file and a design pass aren't always available for a quick side project or a prototype that needs a favicon today rather than after commissioning actual branding, and an emoji, already drawn, already recognizable, already sitting on every keyboard, solves that specific problem faster than anything else could. This tool turns any emoji directly into a favicon PNG, skipping the need for an actual image file or any design work at all, and exports it in the multiple sizes a favicon slot typically expects. Useful for giving a weekend project or a quick prototype a passable favicon in seconds, picking a recognizable emoji as a placeholder icon before real branding exists, or generating a lighthearted favicon for a personal project that doesn't call for an actual logo.`,
    examples: [
      {
        title: 'Turn an emoji into a favicon in seconds',
        code: `Input: 🚀\nOutput: favicon.png (32x32, 64x64, 128x128)`,
        note: 'Skips needing an actual logo file or design work entirely.',
      },
      {
        title: 'Set a placeholder icon for a weekend project',
        code: `Input: 🐙\nOutput: favicon.png, ready to drop into the site's head tag`,
        note: 'Gets a passable icon in place before any real branding exists.',
      },
    ],
  },

  'google-serp-preview': {
    description: `A rough mockup of a search result gets the general idea across, but Google's actual results use a specific font, a specific size, and a truncation point measured in rendered pixel width rather than a flat character count, which means an approximate preview can look close enough while still being wrong about exactly where a title actually gets cut off. This tool renders a title and description matching Google's actual visual presentation as closely as possible, pixel-width truncation included, rather than an approximate mockup styled to generally resemble a search result. Useful for confirming exactly where a title will actually truncate rather than guessing from a character count, checking a real preview before publishing a page's title and description, or catching a title that looks fine at a glance but would genuinely get cut off mid-word once Google actually renders it.`,
    examples: [
      {
        title: 'Check exact pixel-width truncation',
        code: `Input: title: "The Complete Guide to Home Coffee Roasting for Beginners"\nOutput: truncates after "Home Coffee Roasting..." based on rendered pixel width`,
        note: 'Matches where Google actually cuts off a title, not an estimate from character count.',
      },
      {
        title: "Confirm a description won't get cut off",
        code: `Input: [155-character meta description]\nOutput: renders in full without truncation`,
        note: "Verifies against Google's actual rendering rather than a generic length guideline.",
      },
    ],
  },

  'sql-to-json-v2': {
    description: `SQL's NULL doesn't have one obvious JSON equivalent, some downstream code expects a missing field to actually be JSON null, while other consumers expect the key to be omitted from the object entirely rather than present with a null value, and a naive SQL-to-JSON conversion that picks one behavior without asking can quietly break whichever consumer expected the other. This tool converts a SQL query's results into a formatted JSON array with that NULL handling made explicit and configurable, rather than a fixed behavior that happens to work for some consumers and not others. Useful for converting a query result into JSON formatted the way a specific downstream API or script actually expects nulls handled, avoiding a subtle bug where a missing value shows up differently than a consuming application assumed it would, or generating JSON test fixtures from real query results with predictable, consistent null handling.`,
    examples: [
      {
        title: 'Convert NULL as an explicit JSON null',
        code: `Input: SELECT id, middle_name FROM users;\nResult: (1, NULL)\nOutput: [{"id": 1, "middle_name": null}]`,
        note: 'Keeps the key present with an explicit null value for a consumer that expects that.',
      },
      {
        title: 'Omit NULL fields entirely',
        code: `Input: same query, null handling: omit\nOutput: [{"id": 1}]`,
        note: 'Drops the key entirely for a consumer that expects missing fields rather than null values.',
      },
    ],
  },

  'frequency-converter': {
    description: `Hertz and RPM measure the same underlying idea, cycles happening per unit of time, applied to two different physical phenomena, an electrical signal oscillating versus a motor shaft physically spinning, which is exactly why an AC motor's rotational speed and the electrical frequency powering it are mathematically linked rather than unrelated numbers that happen to share a conversion tool by coincidence. This tool converts between hertz, kilohertz, megahertz, gigahertz, and RPM directly, bridging the electrical and mechanical sides of the same core concept. Useful for converting a motor's RPM specification into the hertz value relevant to the electrical supply driving it, translating a processor or radio frequency spec between hertz and its larger prefixed units, or working out the relationship between a rotational speed and an underlying electrical frequency in the same calculation.`,
    examples: [
      {
        title: "Convert a motor's RPM to hertz",
        code: `Input: 3600 RPM\nOutput: 60 Hz`,
        note: "Reflects the direct relationship between a motor's rotational speed and its electrical supply frequency.",
      },
      {
        title: 'Convert a radio frequency to its larger unit',
        code: `Input: 2400000000 Hz\nOutput: 2.4 GHz`,
        note: 'Handles the prefixed units that scale from raw hertz up to gigahertz.',
      },
    ],
  },

  'yaml-to-json': {
    description: `A Kubernetes manifest, a GitHub Actions workflow, a Docker Compose file, all get authored in YAML because it's genuinely easier for a person to read and write, but the moment that same configuration needs to be consumed programmatically, a script parsing it, an API accepting it as a payload, JSON is usually the format actually expected, since virtually every language parses it natively while YAML often needs an extra library just to read. This tool converts YAML into JSON instantly, with pretty-print or compact output and custom indentation, bridging human-authored config into the format code actually consumes directly. Useful for converting a YAML config file into JSON for a script that only parses JSON natively, feeding a YAML-authored configuration into an API that expects a JSON payload, or checking exactly how a YAML structure actually translates into JSON's stricter, more explicit format.`,
    examples: [
      {
        title: 'Convert a Kubernetes manifest for a script',
        code: `Input YAML:\nname: my-app\nreplicas: 3\nOutput JSON:\n{ "name": "my-app", "replicas": 3 }`,
        note: 'Produces the format most scripting languages parse natively without an extra library.',
      },
      {
        title: 'Feed a YAML config into a JSON-only API',
        code: `Input YAML: timeout: 30\nretries: 3\nOutput JSON: { "timeout": 30, "retries": 3 }`,
        note: 'Bridges human-authored YAML into the payload format an API actually expects.',
      },
    ],
  },

  'xml-sitemap-parser': {
    description: `A URL list pulled from a sitemap tells you which pages exist, but the priority, changefreq, and lastmod fields sitting alongside each URL tell a different story: whether a site is actually using those signals meaningfully, or whether every single URL was left at the same default priority and changefreq, values so uniform they end up telling a crawler nothing useful at all. This tool parses an XML sitemap and extracts not just the URLs but the priority, changefreq, and lastmod data attached to each one, surfacing whether those fields carry genuine signal or were never actually configured with any thought. Useful for auditing whether a sitemap's priority values are actually differentiated or uniformly meaningless, checking whether lastmod dates are accurate or quietly stale, or analyzing a sitemap's full metadata rather than just the bare list of URLs it contains.`,
    examples: [
      {
        title: 'Check if priority values carry real signal',
        code: `Input: sitemap.xml (200 URLs)\nOutput: 198 URLs at priority 0.5, 2 URLs at 0.8`,
        note: 'Reveals that priority values are almost uniformly default and provide little useful signal to crawlers.',
      },
      {
        title: 'Audit lastmod accuracy',
        code: `Input: sitemap.xml\nOutput: 40 URLs show lastmod dates unchanged for over 2 years`,
        note: 'Surfaces sitemap entries that may no longer reflect actual page update history.',
      },
    ],
  },

  'color-name-finder': {
    description: `Describing a color out loud in a design review works a lot better with an actual name, that reddish-orange, a dusty sage green, than reciting a hex code nobody in the room can visualize just from hearing six characters read aloud, which is exactly the gap between a numeric color value and something a person can actually picture and remember. This tool takes a hex, RGB, or HSL value and finds the nearest named color from established color name databases, translating a numeric value into something memorable and speakable. Useful for describing a specific color verbally during a design discussion instead of reciting a hex code, giving a memorable name to a brand color for documentation, or figuring out what an unfamiliar color value actually looks like by checking its nearest named equivalent.`,
    examples: [
      {
        title: 'Find a memorable name for a hex value',
        code: `Input: #E9967A\nOutput: "Dark Salmon"`,
        note: 'Turns a hex code into a name people can actually picture and remember.',
      },
      {
        title: 'Name a brand color for documentation',
        code: `Input: #708238\nOutput: "Olive Drab"`,
        note: 'Gives a brand color a speakable name instead of only a hex reference.',
      },
    ],
  },

  'color-luminance-checker': {
    description: `Relative luminance isn't the same thing as how bright a color looks at a glance, it's a specifically weighted calculation where green contributes far more to the perceived brightness value than blue does, which is exactly why a pure, vivid blue can have surprisingly low luminance despite looking bold and eye-catching, a mismatch that trips people up guessing at contrast by eye rather than calculating it. This tool calculates a single color's relative luminance directly, predicting how it will read against both light and dark backgrounds before a second color even gets chosen. Useful for checking whether a specific color leans toward working better on a light or dark background before building a contrast pair around it, understanding why a vivid color reads as darker than expected in an actual contrast calculation, or getting a single color's luminance value to reason about ahead of picking what to pair it with.`,
    examples: [
      {
        title: 'Check why a vivid blue reads as darker than expected',
        code: `Input: #0000FF\nOutput: relative luminance: 0.072 (very low despite looking vivid)`,
        note: 'Shows how little blue contributes to perceived brightness compared to green.',
      },
      {
        title: 'Predict which background suits a color before pairing it',
        code: `Input: #F5F5DC\nOutput: relative luminance: 0.86 (high, better suited to a dark background for contrast)`,
        note: 'Assesses one color on its own before a second color is even chosen.',
      },
    ],
  },
};

export default FIX_BATCH_43;
