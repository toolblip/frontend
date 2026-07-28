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

const FIX_BATCH_61: Record<string, FixBatchEntry> = {
  'mkv-to-gif': {
    description: `A funny few-second moment buried inside a long downloaded video, a gaming highlight, a reaction from a stream, a specific movie scene, is worth sharing on its own far more than the whole file it came from, and a GIF is the format that actually works for that, looping automatically and playable anywhere without a video player. This tool creates an animated GIF from an MKV video, pulling out a short clip rather than requiring the entire file kept and shared just to pass along a few seconds of it. Useful for turning a funny moment from a downloaded video into a reaction GIF for a messaging app, creating a short looping clip from a longer recording to post on social media, or pulling a specific highlight out of a gameplay recording without keeping the full video around.`,
    examples: [
      {
        title: 'Create a reaction GIF from a clip',
        code: `Input: stream-clip.mkv, start: 0:42, end: 0:45\nOutput: reaction.gif`,
        note: 'Pulls a few seconds out instead of sharing the whole video file.',
      },
      {
        title: 'Turn a gameplay highlight into a GIF',
        code: `Input: gameplay-recording.mkv, start: 12:03, end: 12:08\nOutput: highlight.gif (looping)`,
        note: 'Extracts one memorable moment from a much longer recording.',
      },
    ],
  },

  'csv-to-tsv': {
    description: `A CSV field containing its own comma, an address like '123 Main St, Apt 4', needs quoting to stay one field instead of splitting into two, and not every parser downstream actually handles that quoting consistently, which is exactly the ambiguity TSV sidesteps since a tab character almost never shows up naturally inside an actual data value. This tool converts a CSV file into TSV by replacing commas with tab characters, producing a format less prone to that specific parsing ambiguity. Useful for converting a CSV file whose own field values contain commas into a format that won't get misread downstream, preparing data for a tool or a database that specifically expects tab-delimited input, or avoiding a broken import caused by a comma sitting inside a quoted field that a parser mishandled.`,
    examples: [
      {
        title: 'Convert a CSV with commas in its values',
        code: `Input: name,address\n"Jane Doe","123 Main St, Apt 4"\nOutput: name\\taddress\\nJane Doe\\t123 Main St, Apt 4`,
        note: 'Avoids the quoting ambiguity a comma inside a field value creates.',
      },
      {
        title: 'Prepare data for a tab-delimited import',
        code: `Input: id,name,price\n1,Widget,9.99\nOutput: id\\tname\\tprice\\n1\\tWidget\\t9.99`,
        note: 'Matches the format a tool expecting tab-delimited input actually requires.',
      },
    ],
  },

  'text-sentence-shuffler': {
    description: `A paragraph handed to a student with its sentences scrambled out of order is a genuinely useful comprehension exercise, since putting it back into a logical sequence actually tests whether the underlying structure was understood, and shuffling a piece of writing can just as easily reveal whether its sentences were ever in a necessary order to begin with. This tool shuffles sentences within a paragraph or across an entire piece of text randomly, reordering what's already written rather than generating anything new. Useful for building a reading comprehension exercise where a student reorders scrambled sentences back into a logical sequence, testing whether a paragraph's sentence order is actually load-bearing or just habitual, or shuffling a piece of writing as a creative prompt to see what a different sentence order actually reveals.`,
    examples: [
      {
        title: 'Build a comprehension exercise',
        code: `Input: "First, gather the ingredients. Then preheat the oven. Finally, bake for 20 minutes."\nOutput (shuffled): "Finally, bake for 20 minutes. First, gather the ingredients. Then preheat the oven."`,
        note: 'Gives a student a scrambled paragraph to reorder back into a logical sequence.',
      },
      {
        title: 'Shuffle sentences across a whole text',
        code: `Input: [5-paragraph essay]\nOutput: all sentences from every paragraph shuffled into a new random order`,
        note: "Tests whether the writing's structure actually depended on that specific order.",
      },
    ],
  },

  'yaml-validator': {
    description: `YAML's indentation-based structure is notoriously easy to break in a way that fails silently or confusingly, a single tab character where only spaces are allowed, a block indented one space off from its parent, and a Kubernetes manifest or a CI pipeline config built on that fragile structure can fail in a genuinely confusing way that has nothing to do with the actual settings inside it. This tool validates YAML syntax and catches an error with its specific line number and a helpful explanation of what actually broke, rather than a cryptic parser failure with no clear location. Useful for finding exactly which line a stray tab character snuck into where only spaces are allowed, catching a misaligned indentation block before a Kubernetes or a CI config fails to apply, or validating a docker-compose file's syntax before committing it.`,
    examples: [
      {
        title: 'Find a stray tab character',
        code: `Input: services:\n  web:\n\t  image: nginx\nOutput: error on line 3 - tabs are not allowed for indentation, use spaces`,
        note: 'Points to the exact line a tab snuck in where only spaces are allowed.',
      },
      {
        title: 'Catch a misaligned indentation block',
        code: `Input: jobs:\n  build:\n   steps:\nOutput: error on line 3 - inconsistent indentation (expected 4 spaces, found 3)`,
        note: 'Flags a config file before it fails to apply in CI.',
      },
    ],
  },

  'json-to-xml': {
    description: `JSON has no concept of a root element or an attribute the way XML does, so converting one into the other means actually deciding things a JSON structure never specifies on its own, what the outer element should be named, and whether a given property becomes a nested child element or an XML attribute instead. This tool converts JSON into XML with a configurable root element, attribute prefixes, and indentation, making those structural decisions explicit rather than guessing at a fixed, one-size-fits-all default. Useful for converting a JSON API response into XML for an older SOAP-based system that only accepts that format, choosing whether a specific property becomes an XML attribute instead of a nested element to match a particular schema, or naming a custom root element to match exactly what a receiving system expects.`,
    examples: [
      {
        title: 'Convert JSON with a custom root element',
        code: `Input: { "name": "Widget", "price": 9.99 }, root: "product"\nOutput: <product><name>Widget</name><price>9.99</price></product>`,
        note: 'Names the root element to match what a receiving system expects.',
      },
      {
        title: 'Convert a property into an XML attribute',
        code: `Input: { "id": 5, "name": "Widget" }, attribute: "id"\nOutput: <product id="5"><name>Widget</name></product>`,
        note: 'Turns a specific property into an attribute instead of a nested element.',
      },
    ],
  },

  'image-rotate-tool': {
    description: `A phone photo saved sideways needs a quick, standard ninety-degree turn, but a scanned document that went through the scanner at a slight, unintentional tilt or a photo shot at a small unwanted angle needs something more precise than a fixed rotation, an exact custom degree value that actually straightens it out. This tool rotates an image by 90, 180, or 270 degrees with one click, or by a custom angle for exactly that kind of fine correction. Useful for quickly turning a sideways phone photo right side up with one click, straightening a scanned document that went in slightly skewed using a precise custom angle, or flipping an image a full 180 degrees when it was uploaded upside down by mistake.`,
    examples: [
      {
        title: 'Rotate a sideways photo',
        code: `Input: photo.jpg (rotated 90° from a phone)\nOutput: photo-rotated.jpg (upright)`,
        note: 'Fixes the orientation with one click.',
      },
      {
        title: 'Straighten a skewed scan with a custom angle',
        code: `Input: scanned-page.jpg, angle: -2.5°\nOutput: scanned-page-straight.jpg`,
        note: "Corrects a slight tilt a standard 90-degree rotation can't fix.",
      },
    ],
  },

  'add-text': {
    description: `A signature line, a date, or an annotation that needs to land on a PDF that has no actual fillable field there at all, just blank space on a scanned page or a flattened form, can't be typed in the normal way a form field would accept text, it needs an actual text layer placed directly on top of the document at an exact position. This tool adds a text overlay to a PDF with the font, size, and position all customizable, placing new text exactly where it's needed rather than requiring an editable field that doesn't exist. Useful for adding a signature line or a date to a contract that has no fillable field for it, stamping a label like confidential across a document's pages, or filling in a blank on a scanned form by placing text precisely where the blank actually is.`,
    examples: [
      {
        title: 'Add a date to a contract',
        code: `Input: contract.pdf, text: "March 14, 2025", position: page 3, bottom right\nOutput: contract-dated.pdf`,
        note: 'Places text exactly where a blank space exists with no fillable field.',
      },
      {
        title: 'Stamp a label across a document',
        code: `Input: draft-report.pdf, text: "CONFIDENTIAL", font size: 48, position: centered`,
        note: 'Overlays a label across every page without altering the original content.',
      },
    ],
  },

  'json-to-yaml': {
    description: `Kubernetes manifests, GitHub Actions workflows, and docker-compose files all expect YAML specifically, not JSON, and a deeply nested JSON structure with its braces and quotes on every line is also just genuinely harder to scan by eye than YAML's cleaner, indentation-based layout. This tool converts JSON into clean YAML with an adjustable indent and a flow mode option, running entirely in the browser so nothing gets uploaded anywhere. Useful for converting a JSON API response into the YAML format a Kubernetes manifest or a CI pipeline config specifically requires, turning a deeply nested JSON structure into something actually easier to read at a glance, or switching to flow mode for a compact, JSON-like YAML style when that's what a specific tool actually expects.`,
    examples: [
      {
        title: 'Convert JSON to a Kubernetes-ready YAML',
        code: `Input: { "apiVersion": "v1", "kind": "Pod", "metadata": { "name": "app" } }\nOutput:\napiVersion: v1\nkind: Pod\nmetadata:\n  name: app`,
        note: 'Produces the YAML format a Kubernetes manifest actually requires.',
      },
      {
        title: 'Convert using flow mode',
        code: `Input: { "tags": ["web", "api"] }\nOutput (flow mode): tags: [web, api]`,
        note: 'Switches to a compact, JSON-like style when that fits better.',
      },
    ],
  },

  'combine-images': {
    description: `A grid layout with adjustable borders and spacing is more setup than what's actually needed when the real goal is simpler, a before-and-after pair placed directly side by side, or a handful of screenshots stacked into one vertical strip for a step-by-step tutorial, not a full photo collage. This tool merges multiple images into one, stacking them vertically or horizontally, a direct, straightforward join rather than a configurable grid layout with borders to set up first. Useful for placing a before-and-after pair of photos directly side by side for a comparison, stacking a sequence of screenshots into one vertical image for a tutorial, or joining two photos horizontally into a single combined image without setting up a grid layout tool first.`,
    examples: [
      {
        title: 'Place a before-and-after pair side by side',
        code: `Input: before.jpg, after.jpg, direction: horizontal\nOutput: comparison.jpg (both images joined side by side)`,
        note: 'Gives a direct side-by-side join without a grid layout tool.',
      },
      {
        title: 'Stack screenshots into a tutorial strip',
        code: `Input: step1.png, step2.png, step3.png, direction: vertical\nOutput: tutorial-strip.png`,
        note: 'Combines a sequence of screenshots into one vertical image.',
      },
    ],
  },

  'tiff-to-png': {
    description: `Converting a TIFF into JPEG trades away some quality for a smaller file, which is fine for the web but not for a workflow where the original detail and embedded metadata genuinely need to survive the conversion, exactly the case PNG covers by staying lossless the same way TIFF is while still working in literally any browser or image viewer that TIFF itself often doesn't. This tool converts TIFF to PNG while preserving the image's full quality and its metadata, rather than trading any of it away the way a JPEG conversion would. Useful for converting a TIFF scan into a format a browser can actually display without losing any original detail, preserving embedded metadata that a lossy JPEG conversion would otherwise strip out, or archiving a TIFF file as PNG for a workflow that needs lossless quality without the TIFF container itself.`,
    examples: [
      {
        title: 'Convert a TIFF scan for the browser',
        code: `Input: archive-scan.tiff\nOutput: archive-scan.png (full quality preserved)`,
        note: 'Makes the image viewable in a browser without losing any detail.',
      },
      {
        title: 'Preserve embedded metadata',
        code: `Input: photo-with-exif.tiff\nOutput: photo-with-exif.png (EXIF metadata intact)`,
        note: 'Keeps metadata a lossy JPEG conversion would otherwise strip.',
      },
    ],
  },
};

export default FIX_BATCH_61;
