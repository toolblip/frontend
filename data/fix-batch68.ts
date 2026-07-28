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

const FIX_BATCH_68: Record<string, FixBatchEntry> = {
  'energy-converter': {
    description: `A calorie count on a nutrition label, a kilowatt-hour on an electricity bill, and a BTU rating on an air conditioner's spec sheet are all measuring the exact same underlying quantity, energy, in units that come from completely different everyday contexts and don't obviously relate to one another without actually converting between them. This tool converts between joules, calories, kilowatt-hours, and BTU instantly, translating energy across whichever context a specific number actually came from. Useful for converting a food label's calorie count into kilojoules for an international nutrition format, checking how many kilowatt-hours a BTU-rated appliance actually equates to on an electricity bill, or converting a physics problem's joule answer into calories to sanity-check it against a more familiar unit.`,
    examples: [
      {
        title: 'Convert a nutrition label to kilojoules',
        code: `Input: 250 calories\nOutput: 1,046 kJ`,
        note: 'Converts a food label figure into the international energy unit.',
      },
      {
        title: 'Check a BTU rating in kilowatt-hours',
        code: `Input: 12,000 BTU\nOutput: 3.52 kWh`,
        note: 'Relates an appliance spec to what actually shows up on an electricity bill.',
      },
    ],
  },

  'heic-to-jpg': {
    description: `An iPhone photo saved as HEIC needs converting before a photo printing service, an older email client, or a platform with a strict upload allowlist will actually accept it, and JPG specifically is the format nearly every one of those destinations already expects rather than a more general universally-readable format. This tool converts HEIC iPhone photos into JPG, producing the single most universally accepted photo format rather than one that merely opens in more places than HEIC does. Useful for uploading an iPhone photo to a print shop that specifically requires JPG files, sharing a photo through an older email client or platform that doesn't recognize HEIC or even PNG reliably, or getting a smaller file size than PNG would produce for an ordinary photo with no transparency to preserve.`,
    examples: [
      {
        title: 'Upload a photo to a print shop',
        code: `Input: IMG_2891.heic\nOutput: IMG_2891.jpg`,
        note: 'Produces the format most print services specifically require.',
      },
      {
        title: 'Share a photo through an older platform',
        code: `Input: vacation.heic\nOutput: vacation.jpg`,
        note: 'Converts to the format almost every platform and email client already accepts.',
      },
    ],
  },

  'api-doc-generator': {
    description: `An OpenAPI spec file is built for tooling to consume, but a developer trying to actually understand an internal API needs something readable, a documentation page with a clear explanation of each endpoint and an actual example of what to send and what comes back. This tool generates API documentation directly from endpoint definitions, including request and response examples for each one, producing something meant to be read by a person rather than only parsed by a machine. Useful for producing a shareable documentation page for an internal API that teammates can actually read and reference, generating a concrete request and response example for each endpoint so a consumer knows exactly what to expect, or building a quick reference doc straight from a list of endpoint definitions without writing prose for each one by hand.`,
    examples: [
      {
        title: 'Generate a documentation page for an endpoint',
        code: `Input: GET /api/users/{id}\nOutput: doc page with description, parameters, and a sample response: { "id": 1, "name": "Jane" }`,
        note: 'Produces a readable reference instead of a machine-only spec file.',
      },
      {
        title: 'Include a request and response example',
        code: `Input: POST /api/orders\nOutput:\nRequest: { "productId": 5, "quantity": 2 }\nResponse: { "orderId": 91, "status": "confirmed" }`,
        note: 'Shows exactly what a consumer should send and expect back.',
      },
    ],
  },

  'english-collocations-checker': {
    description: `A phrase like "do a mistake" is grammatically fine and still sounds off to a native ear, since English pairs certain words together by convention rather than by any rule, "make a mistake," "heavy rain," "strong coffee," combinations a grammar checker has no reason to flag since nothing about them is actually incorrect. This tool checks common English word pairings and phrases for exactly that kind of natural-sounding fit, flagging a technically correct combination that still doesn't read the way a native speaker would actually phrase it. Useful for catching an unnatural verb-noun pairing that passes every grammar check but still sounds slightly off, polishing a piece of writing to sound more idiomatic beyond simply fixing errors, or double-checking a specific word combination in a formal document before it goes out.`,
    examples: [
      {
        title: 'Catch an unnatural word pairing',
        code: `Input: "She did a mistake in the report."\nOutput: flag "did a mistake" -> natural pairing: "made a mistake"`,
        note: "Flags a phrase that's grammatically fine but sounds unnatural to a native speaker.",
      },
      {
        title: "Check a formal document's phrasing",
        code: `Input: "We need to take a decision quickly."\nOutput: flag "take a decision" -> natural pairing: "make a decision"`,
        note: 'Polishes phrasing beyond what a grammar check alone would catch.',
      },
    ],
  },

  'color-palette-generator': {
    description: `Building a complete color scheme from nothing usually starts with just one color already chosen, a brand's primary shade, a color pulled from a mood board, and the actual challenge is generating everything that pairs well with it, a complementary accent, a set of analogous neighbors, tints and shades that all stay coherent with that one starting point. This tool generates a complete color palette from a single base color, applying established color theory relationships and returning hex and RGB codes for the whole set. Useful for building a full color scheme starting from just one brand color using genuine color theory rather than guesswork, generating a set of complementary or analogous colors to pair with an already-chosen shade, or creating a coherent palette from scratch when there's no existing image or second color to build from.`,
    examples: [
      {
        title: 'Generate a palette from a brand color',
        code: `Input: #2A6F97\nOutput: complementary: #975A2A, analogous: #2A9772, #2A4797, shades: #1B4A66, #3D8FBD`,
        note: 'Builds a full coherent scheme from just one starting color.',
      },
      {
        title: 'Generate a triadic color scheme',
        code: `Input: #E63946, scheme: triadic\nOutput: #46E639, #3946E6`,
        note: 'Applies an established color theory relationship rather than guessing.',
      },
    ],
  },

  'weight-converter': {
    description: `A weight given in stone means very little outside the UK and Ireland, where it's still the everyday way body weight gets discussed, which leaves anyone else needing it actually converted into kilograms or pounds before the number means anything familiar at all. This tool converts weight between kilograms, pounds, ounces, grams, and stone instantly, handling that regional unit directly alongside the more commonly used ones. Useful for converting a UK weight given in stone into kilograms or pounds for someone unfamiliar with the unit, converting a recipe's ingredient weight between grams and ounces, or converting a shipping package's weight between kilograms and pounds for an international customs form.`,
    examples: [
      {
        title: 'Convert stone into kilograms',
        code: `Input: 11 stone\nOutput: 69.85 kg`,
        note: 'Translates a UK-specific unit into one more widely understood.',
      },
      {
        title: 'Convert a recipe measurement',
        code: `Input: 250 g\nOutput: 8.82 oz`,
        note: 'Converts an ingredient weight between metric and imperial units.',
      },
    ],
  },

  sign: {
    description: `A contract that needs an actual signature doesn't have to mean printing it out, signing it by hand, and scanning it back in, when a signature can just as easily be drawn directly with a mouse or a finger, typed out in a script-style font, or uploaded once as an image and reused across multiple documents from then on. This tool adds a signature to a PDF through drawing, typing, or uploading it, giving three different ways to actually get a signature onto a document depending on what's fastest for the situation. Useful for signing a contract or an agreement digitally without printing and scanning it back in, uploading a signature image once and reusing it consistently across several documents, or quickly typing a signature in a cursive-style font for a lower-stakes document that doesn't need a hand-drawn mark.`,
    examples: [
      {
        title: 'Draw a signature directly on a contract',
        code: `Input: contract.pdf, signature: drawn with mouse/touch\nOutput: contract-signed.pdf`,
        note: 'Signs a document without printing and scanning it back in.',
      },
      {
        title: 'Upload a signature and reuse it',
        code: `Input: signature-image.png\nOutput: applied to invoice.pdf, agreement.pdf, and form.pdf`,
        note: 'Adds the same signature consistently across multiple documents.',
      },
    ],
  },

  'flesch-kincaid-calculator': {
    description: `Whether a piece of writing actually fits its intended audience's reading level isn't something to guess at, a children's book, a public health notice, and a legal disclaimer all need genuinely different reading levels, and Flesch-Kincaid is the established formula, based on sentence length and syllable count, that actually measures where a text falls. This tool calculates a text's Flesch-Kincaid grade level and reading ease score, giving an actual standardized number rather than a subjective impression of how readable something feels. Useful for confirming a children's book or a public-facing notice actually targets its intended grade level, checking whether a company's content meets a plain-language or an accessibility guideline requiring a specific reading level, or comparing two drafts' reading ease scores to see which one is genuinely easier to read.`,
    examples: [
      {
        title: "Check a children's book's grade level",
        code: `Input: [manuscript text]\nOutput: Flesch-Kincaid grade level: 2.4, reading ease: 89 (very easy)`,
        note: 'Confirms the text actually matches its intended early-grade audience.',
      },
      {
        title: "Compare two drafts' reading ease",
        code: `Draft 1: grade level 11.2, reading ease 42\nDraft 2 (revised): grade level 8.1, reading ease 61`,
        note: 'Shows which version is genuinely easier to read.',
      },
    ],
  },

  'ipynb-formatter': {
    description: `A Jupyter notebook is really just a JSON file underneath, and Jupyter's own inconsistent formatting along with cell output metadata that changes on every run turns a version control diff into noise nobody can actually review, a genuinely different problem than rendering a notebook for someone to read. This tool formats and pretty-prints a Jupyter notebook's JSON with proper indentation and consistent cell sorting, cleaning up the underlying file itself rather than rendering it for viewing. Useful for cleaning up a notebook's JSON before committing it so a git diff actually shows what changed, sorting cells consistently to avoid spurious reordering noise between commits, or pretty-printing a notebook file that's currently one dense, unreadable block of JSON.`,
    examples: [
      {
        title: 'Clean up a notebook before committing',
        code: `Input: analysis.ipynb (inconsistent indentation, unsorted cells)\nOutput: analysis.ipynb (pretty-printed, cells sorted consistently)`,
        note: 'Produces a readable git diff instead of noisy JSON changes.',
      },
      {
        title: 'Pretty-print a dense notebook file',
        code: `Input: [one-line minified .ipynb JSON]\nOutput: properly indented, multi-line JSON structure`,
        note: 'Turns an unreadable blob into a structured, reviewable file.',
      },
    ],
  },

  'http-status-ref': {
    description: `An unfamiliar status code showing up in a server log, 429, 451, 507, doesn't explain itself, and knowing which broad category a code falls into, client error, server error, redirection, matters just as much as the specific number when deciding who or what is actually responsible for the problem. This tool browses every HTTP status code with its meaning, category, and common use case, giving a reference for what a specific code actually signals rather than requiring it looked up one search at a time. Useful for looking up an unfamiliar status code that showed up in a log to understand what it actually means, confirming whether a code falls under a client or a server error before deciding where to look for the actual bug, or referencing the correct status code to return from an API for a specific situation while writing backend code.`,
    examples: [
      {
        title: 'Look up an unfamiliar status code',
        code: `Input: 429\nOutput: "Too Many Requests" - client error category, used for rate limiting`,
        note: "Explains what a specific code means and when it's used.",
      },
      {
        title: 'Check which category a code falls under',
        code: `Input: 503\nOutput: "Service Unavailable" - server error category`,
        note: 'Clarifies whether a code points to a client-side or server-side problem.',
      },
    ],
  },
};

export default FIX_BATCH_68;
