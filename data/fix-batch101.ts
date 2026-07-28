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

const FIX_BATCH_101: Record<string, FixBatchEntry> = {
  'image-dimension-checker': {
    description: `A file's actual width, height, and size aren't always what the filename or a quick glance suggests, and finding out usually means either opening it in an editor or uploading it somewhere just to see the properties reported back, an unnecessary round trip when the only real need is a quick number check before deciding whether an image actually fits a specific requirement. This tool reads an image's width, height, and file size directly, without uploading it anywhere, supporting JPEG, PNG, and WebP files checked entirely on the local machine. Useful for confirming an image meets a minimum required dimension before submitting it to an upload form, checking a file's exact size before attaching it somewhere with a strict limit, or verifying an image's actual pixel dimensions without opening a full editor or sending the file anywhere first.`,
    examples: [
      {
        title: 'Check dimensions before an upload form',
        code: `Input: photo.jpg\nOutput: 3024x4032px, 2.1 MB (checked without uploading)`,
        note: 'Reads the file locally rather than sending it to a server first.',
      },
      {
        title: 'Verify a size limit before attaching a file',
        code: `Input: banner.png\nOutput: width: 1920px, height: 1080px, size: 840 KB`,
        note: 'Confirms dimensions and size together in one local check.',
      },
    ],
  },

  'image-shadow-generator': {
    description: `A drop shadow sits outside an element's edges while an inner shadow sits inside it instead, creating a recessed, pressed-in look, two visually opposite effects controlled by a single easy-to-miss keyword, inset, buried among several numeric values, offset, blur radius, spread radius, and a color, that are hard to reason about correctly just by typing them in blind. This tool generates CSS box-shadow code for drop shadows, inner shadows, and colored shadows, with a live preview showing exactly how each numeric value and the inset keyword actually change the result. Useful for previewing the difference between a raised drop shadow and a recessed inner shadow before committing to either one, dialing in an exact blur and spread combination visually rather than guessing at pixel values, or generating a colored shadow that matches a design's specific palette rather than a default gray.`,
    examples: [
      {
        title: 'Preview a drop shadow vs an inner shadow',
        code: `Output A: box-shadow: 4px 4px 8px rgba(0,0,0,0.3);\nOutput B: box-shadow: inset 4px 4px 8px rgba(0,0,0,0.3);`,
        note: 'Shows the opposite visual effect the inset keyword produces.',
      },
      {
        title: 'Generate a colored shadow matching a palette',
        code: `Selected: color: #2563EB, blur: 12px, spread: 2px\nOutput: box-shadow: 0 4px 12px 2px #2563EB;`,
        note: 'Dials in blur and spread visually rather than guessing values.',
      },
    ],
  },

  'image-size-resizer': {
    description: `A named platform preset works when the destination is Instagram or a LinkedIn banner, but sometimes the actual requirement is a specific pixel width and height typed in directly, decided by a form's upload rules or a design spec rather than any named platform, and applied across a whole batch of files at once rather than one image at a time. This tool resizes images to exact pixel dimensions with an aspect ratio lock and batch support, built around typed-in target dimensions applied to many files together rather than a single platform preset. Useful for resizing a whole batch of product photos to one exact required pixel size at once, locking the aspect ratio so a resize stays proportional instead of distorting, or hitting a precise width and height dictated by an upload form's rules rather than any named social platform.`,
    examples: [
      {
        title: 'Resize a batch to one exact pixel size',
        code: `Input: 40 product photos, target: 800x800px, lock ratio: true\nOutput: 40 images resized to 800x800px`,
        note: 'Applies one typed-in target size across a whole batch.',
      },
      {
        title: 'Hit a form-specified width and height',
        code: `Input: headshot.jpg, target: 400x400px\nOutput: headshot-resized.jpg (exact dimensions, not a named preset)`,
        note: 'Matches a spec-dictated size rather than a platform preset.',
      },
    ],
  },

  'image-to-base64': {
    description: `Encoding a single local image into a Base64 string to paste into one specific place, a JSON config's icon field, an inline data attribute, doesn't call for a bidirectional tool built around switching between encoding and decoding, especially when the image never needs to leave the local machine at any point in the process. This tool converts any image into a Base64 data URL entirely in the browser, reading the file locally with no upload step involved, focused on the single encode direction rather than a two-way conversion tool. Useful for embedding a personal or an internal screenshot into code as a data URL without it ever touching a server, converting a local icon file into a Base64 string for a JSON config or an inline attribute, or generating a data URL from an image file that should stay entirely on the local machine throughout.`,
    examples: [
      {
        title: 'Embed a local icon without a server round trip',
        code: `Input: icon.png (local file)\nOutput: data:image/png;base64,iVBORw0KGgoAAAANSU...`,
        note: 'Reads and encodes the file entirely in the browser.',
      },
      {
        title: 'Convert a private screenshot for a config file',
        code: `Input: internal-screenshot.png\nOutput: "icon": "data:image/png;base64,iVBORw0KG..."`,
        note: 'The image never touches a server during encoding.',
      },
    ],
  },

  'instagram-story-ideas': {
    description: `A Story disappears after twenty-four hours and has no caption that gets judged on its opening line the way a permanent feed post does, it's a full-screen slot meant to be filled daily with something, a poll, a countdown, a quick behind-the-scenes moment, which makes the real challenge running out of fresh ideas to post consistently rather than crafting one line that has to work perfectly on its own. This tool generates creative Instagram Story ideas meant to engage followers daily, built around a steady stream of postable daily prompts rather than a single optimized caption. Useful for keeping a daily Story habit going without running out of ideas after the first few days, finding a fresh interactive prompt, a poll or a quiz concept, for an ephemeral slot rather than a permanent post, or generating a batch of Story ideas to plan out a week of posting at once.`,
    examples: [
      {
        title: 'Get a week of daily Story prompts',
        code: `Input: niche: "home baking"\nOutput: Day 1: poll "sweet or savory?", Day 2: countdown to next bake, Day 3: behind-the-scenes mixing`,
        note: 'Fills a daily ephemeral slot rather than optimizing one caption.',
      },
      {
        title: 'Find an interactive prompt idea',
        code: `Input: topic: "fitness coaching"\nOutput: "Quiz: guess today's workout from 3 emoji clues"`,
        note: 'Suggests a poll or quiz format Stories are actually built for.',
      },
    ],
  },

  'ipv6-generator': {
    description: `The same IPv6 address can be written three genuinely different ways, fully expanded with all eight groups spelled out, compressed with a double colon collapsing a run of consecutive zero groups, or derived through EUI-64, an algorithm that builds an address directly from a MAC address's bits for automatic network configuration, and a parser or a test suite that only handles one of those forms will fail the moment real-world data shows up in another. This tool generates random IPv6 addresses in full, compressed, or EUI-64 format, covering all three representations a real address might actually take. Useful for generating test data in every valid textual form an IPv6 parser might actually encounter, checking that a validation function handles compressed notation and not just the fully expanded form, or creating an EUI-64 address to test MAC-based autoconfiguration logic specifically.`,
    examples: [
      {
        title: 'Generate a compressed-notation test address',
        code: `Output: 2001:db8::ff00:42:8329`,
        note: 'Collapses a run of zero groups the way real addresses often appear.',
      },
      {
        title: 'Generate an EUI-64 address from MAC bits',
        code: `Input: format: EUI-64\nOutput: 2001:db8::0212:34ff:fe56:7890`,
        note: 'Tests autoconfiguration logic derived from MAC-based addressing.',
      },
    ],
  },

  'jpg-to-tiff': {
    description: `A JPEG re-saved and re-edited over and over accumulates compression artifacts with every single pass, since each save recompresses the image and throws away a little more detail permanently, a cumulative quality loss that print shops and long-term archives specifically avoid by converting to TIFF, a lossless format that stops that degradation the moment a file gets converted into it. This tool converts JPEG images into TIFF format, producing a high-quality file built for printing and archiving rather than further lossy compression. Useful for converting a JPEG into a lossless format before it enters a print shop's prepress workflow, archiving a photo in a format that won't degrade further no matter how many times it gets reopened and resaved, or preparing an image for professional printing where TIFF is the expected, uncompressed standard.`,
    examples: [
      {
        title: 'Convert a photo before prepress editing',
        code: `Input: cover-photo.jpg\nOutput: cover-photo.tiff (lossless, no further compression)`,
        note: 'Stops cumulative JPEG artifact buildup at the point of conversion.',
      },
      {
        title: 'Archive a photo in a non-degrading format',
        code: `Input: family-photo.jpg\nOutput: family-photo.tiff`,
        note: "Won't lose additional detail no matter how many times it's reopened.",
      },
    ],
  },

  'js-minifier': {
    description: `CSS minification mostly means shortening declared values, a color code, a unit, a shorthand property, but JavaScript actually has logic behind it, variables, functions, branches that never execute, which means real JS minification means renaming local variables down to single letters since a descriptive name and a single character run identically, and stripping out code that can never actually be reached. This tool minifies JavaScript by removing whitespace and comments while applying these logic-aware optimizations, built for a language with actual control flow rather than CSS's flatter set of declared values. Useful for shrinking a production JavaScript bundle beyond what basic whitespace stripping alone achieves, renaming verbose local variable names automatically without touching a function's actual public API, or stripping genuinely unreachable code out of a file before it ships.`,
    examples: [
      {
        title: 'Rename local variables automatically',
        code: `Input: function calculateTotal(price, quantity) { return price * quantity; }\nOutput: function a(b,c){return b*c}`,
        note: "Mangles local names without touching the function's public signature.",
      },
      {
        title: 'Strip unreachable code before shipping',
        code: `Input: function f(){ return 1; console.log("never runs"); }\nOutput: function f(){return 1}`,
        note: 'Removes dead code a whitespace-only stripper would leave in.',
      },
    ],
  },

  'json-path-tester': {
    description: `Confirming that a JSONPath expression's syntax is actually correct, whether a wildcard behaves the way documentation claims, whether bracket notation and dot notation for the same key really are interchangeable, is a different, more foundational question than iterating on candidate expressions or digging one specific value out of a huge nested response, closer to checking an assumption than solving a particular extraction problem. This tool tests a JSONPath expression against real JSON data and highlights every matched result directly within the full structure instantly, showing exactly where in the tree a given path actually points rather than only listing extracted values separately. Useful for confirming a piece of JSONPath syntax actually behaves the way it's documented to, seeing exactly where a wildcard or a filter condition matches within the full JSON structure, or verifying dot notation and bracket notation produce the identical result for the same key.`,
    examples: [
      {
        title: 'Confirm wildcard syntax behaves as documented',
        code: `Input data: {"items":[{"id":1},{"id":2}]}\nExpression: $.items[*].id\nOutput: matches highlighted directly in the tree: 1, 2`,
        note: 'Shows exactly where in the structure the path points.',
      },
      {
        title: 'Check dot vs bracket notation produce the same result',
        code: `Expression A: $.store.book\nExpression B: $["store"]["book"]\nOutput: identical matches highlighted for both`,
        note: 'Verifies two equivalent syntaxes really match the same nodes.',
      },
    ],
  },

  'json-schema-editor': {
    description: `Hand-typing a JSON schema means nesting type, properties, and required fields correctly by hand, matching every brace and comma exactly, a verbose, error-prone process for something that's ultimately just describing a handful of fields and their constraints, a task a form with add-property and pick-a-type controls handles far more reliably than typing raw JSON from scratch. This tool creates and validates JSON schemas through visual controls, generating the underlying schema structure rather than requiring it typed out by hand, useful directly for API development, data validation, and documentation together. Useful for building an API's request schema visually without hand-nesting JSON syntax, validating actual data against a schema built through form controls rather than a hand-written one, or generating schema documentation for an API without maintaining the raw JSON structure separately by hand.`,
    examples: [
      {
        title: 'Build an API request schema visually',
        code: `Added: property "email" (string, required), property "age" (number)\nOutput: { "type": "object", "properties": { "email": {"type":"string"}, "age": {"type":"number"} }, "required": ["email"] }`,
        note: 'Generates the nested structure from form controls, not hand-typed JSON.',
      },
      {
        title: 'Validate data against a visually built schema',
        code: `Input data: { "email": "test@example.com" }\nOutput: valid - matches required schema fields`,
        note: 'Uses the same schema for validation and documentation together.',
      },
    ],
  },
};

export default FIX_BATCH_101;
