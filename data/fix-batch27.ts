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

const FIX_BATCH_27: Record<string, FixBatchEntry> = {
  'plagiarism-checker': {
    description: `Word-for-word copying is the obvious case, but text that's been lightly reworded, a synonym swapped here, a clause reordered there, while keeping the same underlying structure and sequence of ideas, is a subtler kind of match that a simple exact-string search would miss entirely. This tool scans text for both: identical phrase matches and the broader pattern of unusually similar word choice and structure that suggests content was adapted from another source rather than written independently. Useful for a student checking a paper against sources before submitting it, a content editor confirming a freelance submission wasn't lifted from an existing article, or a writer double-checking that a heavily-edited draft still reads as distinct from whatever it was originally based on.`,
    examples: [
      {
        title: 'Check for lightly reworded content',
        code: `Input: "The economy grew significantly last quarter due to increased spending."\nSource match: "The economy expanded notably last quarter because of a rise in spending." (87% structural similarity)`,
        note: 'Catches a reworded match that an exact-phrase search would miss entirely.',
      },
      {
        title: 'Confirm a freelance submission is original',
        code: `Input: [1500-word submitted article]\nResult: 3 flagged passages matching 2 existing published sources`,
        note: 'Identifies specific passages worth reviewing rather than a single overall score.',
      },
    ],
  },

  'aac-to-flac': {
    description: `Converting a lossy format into a lossless one doesn't recover detail that was already thrown away during the original AAC compression, so an AAC file converted to FLAC won't suddenly sound better than the AAC did, it'll just stop losing anything further from this point forward, since FLAC compresses without discarding any additional audio data on top of what AAC already removed. This tool converts an AAC file into FLAC directly. Useful for standardizing a mixed audio library on a single lossless format going into further processing, feeding an AAC file into an audio workflow that specifically expects FLAC input, or archiving a file in a format that won't degrade further even though the original AAC compression already set a ceiling on the quality available to work with.`,
    examples: [
      {
        title: 'Standardize a library on a lossless format',
        code: `Input: podcast-clip.aac\nOutput: podcast-clip.flac`,
        note: "Stops further quality loss from this point forward, though it can't recover detail AAC already discarded.",
      },
      {
        title: 'Feed a file into a FLAC-only workflow',
        code: `Input: interview.aac\nOutput: interview.flac`,
        note: 'Matches the input format an audio pipeline specifically expects.',
      },
    ],
  },

  'english-dictionary': {
    description: `Looking up a word usually means bouncing between separate places for different pieces of information, a dictionary site for the definition, a thesaurus for synonyms, a pronunciation guide for how it's actually said out loud, when all of that belongs together for genuinely understanding an unfamiliar word rather than just its dictionary meaning in isolation. This tool brings definitions, synonyms, antonyms, and pronunciation together for a single lookup, so checking a word's meaning also surfaces how to say it and what else could be used in its place. Useful for confirming a word actually means what you think while writing, finding a better synonym without opening a separate thesaurus, or checking pronunciation on an unfamiliar word before using it out loud for the first time.`,
    examples: [
      {
        title: 'Look up a word with definition and pronunciation together',
        code: `Input: "ubiquitous"\nOutput: definition: "present everywhere", pronunciation: /juːˈbɪkwɪtəs/, synonyms: omnipresent, pervasive`,
        note: 'Combines meaning and pronunciation in one lookup instead of two separate sources.',
      },
      {
        title: 'Find a better synonym while writing',
        code: `Input: "happy"\nOutput: synonyms: content, delighted, elated, cheerful`,
        note: 'Surfaces alternatives without switching to a separate thesaurus tool.',
      },
    ],
  },

  'sql-to-json': {
    description: `A SQL SELECT query's result set is naturally row-and-column shaped, which maps cleanly onto JSON as an array of objects, one object per row, each column becoming a key, but getting from a raw query result to that actual JSON structure usually means writing throwaway code just to reshape it. This tool converts a SQL query or an existing result set directly into a formatted JSON array, handling that row-to-object mapping automatically rather than requiring a script written just for the conversion. Useful for turning a database query's output into JSON for an API response during prototyping, converting a result set into a format a frontend can consume directly without a backend step in between, or reshaping query output for a tool downstream that expects JSON rather than tabular rows.`,
    examples: [
      {
        title: 'Convert a query result into a JSON array',
        code: `Input: SELECT id, name FROM users LIMIT 2;\nResult: (1, "Alice"), (2, "Bob")\nOutput: [{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]`,
        note: 'Maps each row into an object with column names as keys automatically.',
      },
      {
        title: 'Reshape output for a frontend prototype',
        code: `Input: SELECT product, price FROM inventory;\nOutput: [{"product":"Widget","price":19.99}, {"product":"Gadget","price":34.50}]`,
        note: 'Skips writing a backend step just to reformat rows into JSON.',
      },
    ],
  },

  'png-to-eps': {
    description: `PNG is a raster format built for screens, and a print shop working with older layout software often specifically wants EPS, a vector-friendly format with a long history in professional print workflows that predates most modern web formats entirely. This tool converts a PNG into EPS, wrapping the raster image data in the EPS container print software expects rather than leaving it in a format the workflow doesn't recognize. Useful for preparing a raster logo or graphic for a print shop's layout software that specifically calls for EPS, feeding an image into an older print production pipeline built around the format before more modern alternatives existed, or satisfying a print vendor's file format requirement that a plain PNG wouldn't meet on its own.`,
    examples: [
      {
        title: 'Prepare a logo for a print shop',
        code: `Input: logo.png\nOutput: logo.eps`,
        note: 'Matches the format an older print layout program specifically expects.',
      },
      {
        title: 'Convert a graphic for a legacy print pipeline',
        code: `Input: banner-art.png\nOutput: banner-art.eps`,
        note: 'Fits into a production workflow built around EPS before newer formats existed.',
      },
    ],
  },

  'color-palette-extractor': {
    description: `Sometimes a palette isn't meant to match anything specific, it's inspiration pulled from somewhere unrelated entirely, a favorite painting, a photo of a sunset, a piece of nature photography, extracted purely because the colors together evoke a mood worth carrying into a completely different project. This tool pulls the dominant colors out of any image and returns them as hex, RGB, and HSL values, treating the source image as a mood reference rather than something the final palette needs to visually match or represent. Useful for building a color palette for a project inspired by an unrelated piece of art or photography, starting a mood board from an image's colors before any of the actual design work begins, or exploring a handful of palettes pulled from different reference images to see which mood actually fits a project best.`,
    examples: [
      {
        title: 'Build a mood board from a photo',
        code: `Input: sunset-photo.jpg\nOutput: #E8734A, #2B3A55, #F4C95D, #1A1A2E, #FFF8E7`,
        note: "Pulled purely for mood and inspiration, not to match anything the photo depicts.",
      },
      {
        title: 'Compare palettes from different reference images',
        code: `Input: painting-1.jpg, painting-2.jpg\nOutput: two distinct 5-color palettes to compare side by side`,
        note: 'Explores which extracted mood actually fits a project before committing to one.',
      },
    ],
  },

  'json-to-typescript-types': {
    description: `Interfaces are the more common choice for describing an object's shape in TypeScript, but a codebase built around type aliases specifically, or one that needs union types and other constructs interfaces can't express as cleanly, needs the same JSON-to-TypeScript conversion done with the type keyword instead. This tool generates TypeScript type definitions from JSON data rather than interfaces, with optional strict null handling for fields that could be null or undefined, and a readonly modifier option for shapes that shouldn't be mutated after creation. Useful for a project whose style guide specifically calls for type over interface, generating a readonly type for a Redux-style state shape that should never be mutated directly, or producing stricter null-aware types than a basic conversion would generate by default.`,
    examples: [
      {
        title: 'Generate a type instead of an interface',
        code: `Input: {"id": 1, "name": "Widget"}\nOutput: type Widget = {\n  id: number;\n  name: string;\n};`,
        note: 'Uses the type keyword for a codebase whose style guide prefers it over interface.',
      },
      {
        title: 'Generate a readonly type for immutable state',
        code: `Input: {"userId": 1, "isActive": true}, readonly: on\nOutput: type UserState = {\n  readonly userId: number;\n  readonly isActive: boolean;\n};`,
        note: 'Marks every property readonly for a shape that should never be mutated after creation.',
      },
    ],
  },

  'explain-like-five': {
    description: `A dense explanation written for someone who already understands the surrounding field, full of field-specific terms and assumed background knowledge, is a genuinely different piece of writing from one that actually starts from zero and builds up gradually using ideas and comparisons a complete beginner could follow. This tool takes a complex topic and rewrites the explanation without assuming any of that background, leaning on plain language and everyday comparisons instead of jargon that would need its own separate explanation. Useful for finally understanding a technical concept that every existing explanation seems to assume you already half know, getting a starting foothold on a subject before diving into denser, more technical material, or checking whether you actually understand something well enough to explain it simply yourself.`,
    examples: [
      {
        title: 'Simplify a technical concept',
        code: `Input: "Explain how a hash table achieves O(1) average lookup time."\nOutput: "Imagine a wall of labeled mailboxes. A hash table uses a formula to figure out which mailbox a piece of mail belongs in immediately, instead of checking every box one by one."`,
        note: 'Replaces technical terms with a physical comparison anyone can picture.',
      },
      {
        title: 'Get a starting foothold on a dense subject',
        code: `Input: "Explain quantum entanglement."\nOutput: a plain-language explanation using an everyday comparison, without assuming physics background`,
        note: 'Builds an intuition to start from rather than assuming prior knowledge of the field.',
      },
    ],
  },

  'http-request-headers-inspector': {
    description: `Response headers get most of the attention in a typical debugging session, but request headers, the ones a browser is actually sending out, tell their own story: exactly what user agent string, referrer, and cookies are leaving your machine with every request, information most people never actually look at directly even though it's sent on every single page load. This tool inspects both directions, the request headers actually being sent and the response headers coming back, and evaluates the response against a security checklist, flagging a missing content security policy, a missing HSTS header, or another gap rather than just listing raw header text with no evaluation. Useful for auditing exactly what a browser reveals about itself with every request, or checking a site's response against a security header checklist instead of eyeballing raw header output for anything obviously missing.`,
    examples: [
      {
        title: "Check what a browser's request actually reveals",
        code: `Input: https://example.com\nRequest headers sent: User-Agent, Referer, Cookie (3 values)`,
        note: 'Shows exactly what identifying information leaves the browser with the request.',
      },
      {
        title: 'Run a response against a security checklist',
        code: `Input: https://example.com\nResult: missing Content-Security-Policy, missing Strict-Transport-Security`,
        note: 'Evaluates the response instead of just listing raw header text with no assessment.',
      },
    ],
  },

  unlock: {
    description: `A password-protected PDF that's genuinely your own document, one you set a password on yourself and then forgot, or inherited from a previous job with no memory of the original password, becomes a real annoyance once the protection outlives its usefulness and just gets in the way of opening a file you're entitled to use freely. This tool removes password protection from a PDF, provided the current password is already known, converting a locked file into an open one that no longer prompts for a password on every open. Useful for removing a password from a personal document once the original reason for locking it no longer applies, unlocking an old file from a previous job or project where the password requirement has outlived its purpose, or simplifying a PDF's handling once it no longer needs to stay restricted.`,
    examples: [
      {
        title: 'Remove a password from a personal document',
        code: `Input: old-taxes.pdf (password protected), password: "known123"\nOutput: old-taxes.pdf (no password required to open)`,
        note: 'Requires the current password to be known before removing the protection.',
      },
      {
        title: 'Unlock a file inherited from a previous project',
        code: `Input: archived-report.pdf, password: [provided]\nOutput: archived-report-unlocked.pdf`,
        note: "Removes a restriction that's outlived its original purpose.",
      },
    ],
  },
};

export default FIX_BATCH_27;
