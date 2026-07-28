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

const FIX_BATCH_87: Record<string, FixBatchEntry> = {
  translate: {
    description: `Getting the gist of a foreign email, a restaurant menu, or a sign is a genuinely different bar to clear than producing a translation precise enough for a legal contract or a piece of literature, where word choice, tone, and cultural nuance actually carry weight, and a fast machine translation is built for the first case, understanding and communicating quickly, rather than replacing a professional translator for the second. This tool translates text between more than a hundred languages instantly, built for quick comprehension and everyday communication rather than certified or literary-grade translation. Useful for quickly understanding an email or a document written in an unfamiliar language, translating a message well enough to communicate casually with someone who speaks a different language, or getting the general meaning of foreign text before deciding whether it needs a professional translation.`,
    examples: [
      {
        title: 'Get the gist of a foreign email',
        code: `Input: "Estimado cliente, su pedido ha sido enviado." (Spanish)\nOutput: "Dear customer, your order has been shipped." (English)`,
        note: 'Fast enough for everyday comprehension, not certified for legal use.',
      },
      {
        title: 'Communicate casually across languages',
        code: `Input: "Can we reschedule to Thursday?" -> French\nOutput: "Pouvons-nous reporter à jeudi ?"`,
        note: 'Suitable for casual back-and-forth rather than a formal document.',
      },
    ],
  },

  'tsv-to-csv': {
    description: `A comma sitting inside an actual data field causes no problem at all in a tab-separated file, since tabs, not commas, mark where one column ends and the next begins, but that same comma becomes a real threat the moment the data becomes comma-separated, and a naive conversion that just swaps every tab for a comma without quoting fields that already contain one will corrupt the resulting file's column structure. This tool converts TSV into CSV, correctly quoting and escaping any field that contains a comma so the column structure survives the conversion intact. Useful for converting a TSV export containing comma-heavy fields like addresses into a properly escaped CSV file, preparing tab-separated data for a tool or system that only accepts CSV, or converting between the two formats without a stray comma silently breaking a spreadsheet import.`,
    examples: [
      {
        title: 'Escape a comma-containing field',
        code: `Input TSV:\nname\taddress\nJane\t1600 Pennsylvania Ave, Washington DC\nOutput CSV:\nname,address\nJane,"1600 Pennsylvania Ave, Washington DC"`,
        note: 'Quotes the address field so its comma is not misread as a delimiter.',
      },
      {
        title: 'Prepare data for a CSV-only tool',
        code: `Input: TSV export from a database tool\nOutput: properly escaped CSV file`,
        note: 'Converts for a system that only accepts comma-separated files.',
      },
    ],
  },

  'rgba-color-picker': {
    description: `Picking an opaque color and then figuring out how to add transparency afterward is an extra step most color pickers force, when the actual need from the start is a semi-transparent overlay, a modal backdrop, a subtle hover tint, that transparency baked in as part of the color itself rather than layered on separately once an opaque value is already chosen. This tool picks a color with its alpha transparency set directly, copying the result as HEX, RGB, RGBA, or HSL rather than picking an opaque color and adjusting opacity in a separate step. Useful for picking a semi-transparent overlay color for a modal backdrop from the start, choosing a subtle hover-state tint with the right transparency built in, or copying an RGBA value ready to paste directly into CSS without adding an alpha channel afterward.`,
    examples: [
      {
        title: 'Pick a modal backdrop color with transparency built in',
        code: `Output: rgba(0, 0, 0, 0.5)`,
        note: 'Sets the alpha channel directly instead of adding it after picking an opaque color.',
      },
      {
        title: 'Copy a hover-tint value ready for CSS',
        code: `Output: rgba(37, 99, 235, 0.15)`,
        note: 'Produces a value ready to paste directly without a separate opacity step.',
      },
    ],
  },

  'gif-to-jpg': {
    description: `The literal first frame of an animated GIF is sometimes a blank loading state or an awkward mid-transition moment rather than the frame that actually represents what the animation is about, which is exactly why a good static thumbnail sometimes needs to come from a specific, chosen frame rather than automatically whichever one happens to be first. This tool extracts a static JPG from an animated GIF, either the first frame or a specifically chosen one, flattening any transparency to a solid background since JPG has no alpha channel to preserve it. Useful for picking a genuinely representative frame from a GIF to use as a thumbnail rather than defaulting to frame one, extracting a static preview image from an animation for a context that can't display GIFs, or converting a GIF into a single JPG when only a still image is actually needed.`,
    examples: [
      {
        title: 'Choose a representative frame for a thumbnail',
        code: `Input: animation.gif (18 frames), selected frame: 9\nOutput: thumbnail.jpg`,
        note: 'Picks a specific frame instead of defaulting to a possibly blank first frame.',
      },
      {
        title: 'Flatten a transparent frame to a solid background',
        code: `Input: animation.gif (frame with transparent background)\nOutput: frame.jpg (white background, transparency flattened)`,
        note: 'Fills transparent areas since JPG has no alpha channel to preserve them.',
      },
    ],
  },

  'ulid-generator': {
    description: `A ULID isn't a UUID at all, it's a different, older specification encoded in Crockford's Base32, twenty-six characters with no visually ambiguous letters like I, l, O, or 0, which makes it noticeably shorter than a standard UUID's thirty-six characters and genuinely easier to read aloud, type by hand, or reference in a support ticket without a stray typo silently pointing at the wrong record. This tool generates ULIDs, time-sortable identifiers built around compact, human-friendly encoding rather than the standard UUID hex format. Useful for generating an identifier that's actually practical to read aloud or type manually, choosing a shorter, sortable ID for a system where UUID's format isn't a hard requirement, or picking ULID specifically for its unambiguous character set over other time-sortable identifier formats.`,
    examples: [
      {
        title: 'Generate a short, unambiguous identifier',
        code: `Output: 01HZY3K9F8QJZ4X6R2N7M5P0VT`,
        note: 'Avoids visually confusing characters like I, l, O, and 0.',
      },
      {
        title: 'Compare length against a standard UUID',
        code: `ULID: 01HZY3K9F8QJZ4X6R2N7M5P0VT (26 chars)\nUUID: 018f4e2a-9c3d-7b1a-8f2c-1a2b3c4d5e6f (36 chars)`,
        note: 'Produces a noticeably shorter identifier for the same sortable-uniqueness purpose.',
      },
    ],
  },

  'color-shade-gen': {
    description: `Dragging a single slider and instantly seeing a handful of lighter and darker variations to eyeball against a specific design decision is a fundamentally different workflow than generating a complete, evenly stepped color scale meant to become a documented design system spec, one is exploratory and immediate, the other is systematic and built to be referenced later. This tool generates lighter, darker, and tinted variations of a color interactively, built for quickly exploring options rather than producing a full numbered scale. Useful for dragging through a handful of shade options to find one that looks right for a specific button or accent, quickly previewing a darker variant for a hover state without generating an entire palette, or exploring color variations interactively before committing to a systematic design system scale.`,
    examples: [
      {
        title: 'Explore shades for a hover state',
        code: `Input: #2563EB\nDrag slider: -10%, -20%, -30%\nOutput: live preview updates instantly for each`,
        note: 'Lets a designer eyeball options rather than compute a full numbered scale.',
      },
      {
        title: 'Preview a lighter variant quickly',
        code: `Input: #2563EB, lighten: 15%\nOutput: #5C89EF`,
        note: 'Produces one quick variant rather than a complete design-system palette.',
      },
    ],
  },

  'content-planner': {
    description: `Deciding that a product tip goes out in week one, a customer story in week two, and industry news in week three is a calendar-level decision that happens before any single post gets outlined or written, a different layer of planning than detailing what one specific article should cover, or brainstorming a pool of angles with no schedule attached to any of them yet. This tool plans a content calendar across weeks or months, organizing what topic or format goes where in the schedule rather than detailing one piece of content or listing angles with no timeline. Useful for mapping out a month's worth of content themes before any individual piece gets outlined, organizing a content calendar's overall rhythm and topic variety across several weeks, or planning when each type of content should go out before deciding exactly what each one will say.`,
    examples: [
      {
        title: "Map a month's content themes",
        code: `Input: 4-week window\nOutput: Week 1: product tips, Week 2: customer story, Week 3: industry news, Week 4: behind-the-scenes`,
        note: 'Organizes topics across a calendar before any single post is outlined.',
      },
      {
        title: "Plan a quarter's content rhythm",
        code: `Input: 12-week window, cadence: 2 posts/week\nOutput: 24 scheduled slots with rotating content themes`,
        note: "Sets the schedule's overall variety and pacing across a longer timeline.",
      },
    ],
  },

  'curl-to-python': {
    description: `Python's requests library expects things a certain way, query parameters passed as a plain dictionary rather than a URLSearchParams object, a call that runs synchronously by default without the promise-based async ceremony JavaScript's fetch needs, conventions suited to a backend script, a data pipeline, or an automation task rather than a browser-based frontend call. This tool converts a curl command into Python using the requests library, with headers, query parameters, and body handled the way Python's ecosystem actually expects rather than JavaScript's async patterns. Useful for converting an API call from documentation into a Python script for a scheduled data pipeline, turning a curl example into requests code for a backend automation task, or generating Python code with query parameters already structured as a dictionary instead of hand-building them.`,
    examples: [
      {
        title: 'Convert to requests with dict-based params',
        code: `Input: curl "https://api.example.com/search?q=widgets&limit=10"\nOutput:\nimport requests\nresponse = requests.get("https://api.example.com/search", params={"q": "widgets", "limit": 10})`,
        note: 'Structures query parameters as a Python dictionary rather than a URL string.',
      },
      {
        title: 'Generate a synchronous POST request',
        code: `Input: curl -X POST https://api.example.com/users -d '{"name":"Jane"}'\nOutput:\nresponse = requests.post("https://api.example.com/users", json={"name": "Jane"})`,
        note: 'Runs synchronously by default, matching a typical backend script.',
      },
    ],
  },

  'mac-address-generator': {
    description: `A MAC address carries a specific bit, the second bit of its first byte, that tells a network whether the address was assigned by an actual hardware manufacturer or deliberately marked as locally administered, meaning it was made up for a specific purpose and isn't claiming to belong to any real registered device, which matters a great deal for a virtual machine or a container that needs a unique address without any risk of colliding with or impersonating real hardware. This tool generates random MAC addresses with that locally administered bit set correctly, safe for virtual network interfaces rather than mimicking a real manufacturer's address. Useful for assigning a unique, collision-safe address to a virtual machine's network interface, generating MAC addresses for a container platform that needs many unique identifiers on demand, or creating test addresses explicitly marked as non-manufacturer rather than imitating real hardware.`,
    examples: [
      {
        title: 'Generate a safe address for a VM network interface',
        code: `Output: 02:1A:2B:3C:4D:5E (locally administered bit set)`,
        note: 'Marked as non-manufacturer, avoiding any collision with real hardware.',
      },
      {
        title: 'Generate unique addresses for a container platform',
        code: `Output: 02:AA:BB:CC:00:01, 02:AA:BB:CC:00:02, 02:AA:BB:CC:00:03`,
        note: 'Produces many unique, collision-safe identifiers on demand.',
      },
    ],
  },

  'jupyter-cleaner': {
    description: `A notebook's code can stay completely unchanged between two commits and still produce an enormous, unreadable diff, because every time a cell runs, its execution count increments and its output, sometimes a large embedded plot image encoded as a long base64 string, gets rewritten even when nothing about the actual logic changed at all. This tool strips every output, execution count, and piece of metadata out of a Jupyter notebook, keeping only the source code and markdown cells that actually reflect real changes. Useful for cleaning a notebook before committing it so diffs reflect genuine code changes instead of output noise, stripping large embedded plot images out of a notebook before it goes into version control, or removing execution counts that increment on every run and clutter a diff with nothing meaningful in it.`,
    examples: [
      {
        title: 'Strip outputs before committing',
        code: `Input: analysis.ipynb (cell outputs include base64-encoded plot images)\nOutput: analysis.ipynb (source and markdown only, outputs removed)`,
        note: 'Prevents large embedded images from bloating the git diff.',
      },
      {
        title: 'Remove execution counts cluttering diffs',
        code: `Input: cell execution_count: 47\nOutput: execution_count: null`,
        note: 'Removes a number that changes on every run but reflects no actual code change.',
      },
    ],
  },
};

export default FIX_BATCH_87;
