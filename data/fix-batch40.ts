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

const FIX_BATCH_40: Record<string, FixBatchEntry> = {
  'ogg-to-wav': {
    description: `A compressed audio format like OGG has to be decoded in real time before it can actually play, which adds a small but real amount of processing overhead every time a sound effect triggers, something that matters far more in a game engine firing dozens of short sound effects per second than it does for a song playing once start to finish. This tool converts an OGG file into WAV, an uncompressed format many game engines and real-time audio tools specifically prefer for short sound effects, since it plays back directly without a decode step eating into the same processing budget as everything else running at once. Useful for preparing a game's sound effects for an engine that expects uncompressed audio, converting an open-source audio asset into a format ready for further editing, or getting OGG game audio into WAV before importing it into a project that expects that format.`,
    examples: [
      {
        title: 'Prepare a game sound effect for an engine',
        code: `Input: jump-sound.ogg\nOutput: jump-sound.wav (uncompressed, ready for real-time playback)`,
        note: 'Avoids the decode overhead a compressed format adds to short, frequently triggered sound effects.',
      },
      {
        title: 'Convert an open-source audio asset for editing',
        code: `Input: ambient-loop.ogg\nOutput: ambient-loop.wav`,
        note: 'Provides an uncompressed source file ready for further audio editing.',
      },
    ],
  },

  'title-case-converter': {
    description: `Capitalizing every single word in a title isn't actually correct title case, small words like a, the, of, and, and in typically stay lowercase unless they happen to be the first or last word, and style guides genuinely disagree on exactly which words count as small enough to skip, AP style and Chicago style don't always draw that line the same way. This tool converts text into proper title case with those small-word rules applied, plus support for custom exceptions, a brand name or an acronym that should keep its own specific capitalization rather than being re-cased along with everything else. Useful for titling a post correctly according to a specific style guide's small-word rules, preserving a brand name's exact capitalization while title-casing the rest of a heading, or fixing a title naively capitalized word by word without accounting for articles and short prepositions.`,
    examples: [
      {
        title: 'Apply proper small-word rules',
        code: `Input: "the lord of the rings"\nOutput: "The Lord of the Rings"`,
        note: '"of" and "the" stay lowercase mid-title but "The" capitalizes as the first word.',
      },
      {
        title: 'Preserve a brand name exception',
        code: `Input: "a guide to using iphone effectively", exception: "iPhone"\nOutput: "A Guide to Using iPhone Effectively"`,
        note: "Keeps the brand's specific capitalization instead of re-casing it like a normal word.",
      },
    ],
  },

  'text-structure-validator': {
    description: `A document can be full of good sentences and still be genuinely hard to get through if its structure works against the reader, a heading level skipped without warning, a single paragraph running fifteen lines with no break, a numbered sequence of steps buried in a regular paragraph instead of an actual list, all structural problems a spell checker or grammar tool would never catch since nothing about the sentences themselves is wrong. This tool checks a document's heading hierarchy, paragraph length, and list usage together, flagging structural issues rather than sentence-level writing problems. Useful for catching a paragraph that's grown too long to read comfortably, noticing that a sequence of steps should really be a numbered list instead of a wall of prose, or confirming a document's heading levels actually follow a logical order before it goes out.`,
    examples: [
      {
        title: 'Flag an overly long paragraph',
        code: `Input: [one paragraph, 380 words, no breaks]\nResult: flagged, paragraph exceeds recommended length`,
        note: 'Surfaces a structural issue a grammar checker would never catch.',
      },
      {
        title: 'Catch steps that should be a list',
        code: `Input: "First, open the app. Then, click settings. Next, select your profile."\nResult: flagged, sequential steps embedded in prose instead of a numbered list`,
        note: 'Recommends converting a step sequence into an actual list for readability.',
      },
    ],
  },

  'hash-diff-checker': {
    description: `Two 64-character SHA-256 hashes that differ in exactly one character are, for verification purposes, completely different values, but scanning two long hex strings side by side looking for that one mismatched character is exactly the kind of task human eyes are bad at, especially past the first dozen characters when attention starts to drift. This tool compares two hash outputs directly and reports whether they match or differ, pinpointing exactly where they diverge rather than requiring a manual character-by-character read-through. Useful for verifying a downloaded file's hash actually matches a publisher's published checksum before trusting the file, confirming two systems computed the same hash for the same input, or catching a single-character mismatch that would be genuinely easy to miss scanning two long hash strings by eye.`,
    examples: [
      {
        title: 'Verify a downloaded file against a published checksum',
        code: `Computed: a3f5e8b9...c21d\nPublished: a3f5e8b9...c21e\nResult: mismatch at the final character`,
        note: 'Pinpoints exactly where two long hashes diverge instead of requiring a manual scan.',
      },
      {
        title: 'Confirm two systems produced an identical hash',
        code: `System A: 9f86d081...5e8f\nSystem B: 9f86d081...5e8f\nResult: match`,
        note: 'Confirms an exact match across the full length of both hash strings.',
      },
    ],
  },

  'text-difference-checker': {
    description: `Comparing two versions of a function or a config file before and after a refactor is a code-specific version of the same comparison problem: confirming only the intended change actually happened, and catching an accidental unrelated edit that slipped in alongside it, which is exactly the kind of thing a visual diff surfaces immediately but a side-by-side read-through can miss. This tool compares two blocks of text and highlights every addition and deletion, built for exactly that kind of before-and-after check on code, configuration, or any other text where confirming precisely what changed matters. Useful for reviewing a code change before committing it to confirm nothing unrelated snuck in, comparing a config file's old and new versions line by line, or checking a document revision to see precisely what an editor actually touched.`,
    examples: [
      {
        title: 'Review a code change before committing',
        code: `Before: function total(a, b) { return a + b; }\nAfter: function total(a, b) { return a + b + tax; }\nResult: addition of "+ tax" highlighted`,
        note: 'Confirms only the intended change is present before the commit goes through.',
      },
      {
        title: 'Compare two versions of a config file',
        code: `Before: timeout=30\nAfter: timeout=60\nResult: "timeout" value flagged as changed, all other lines unchanged`,
        note: 'Isolates exactly which setting changed between two config versions.',
      },
    ],
  },

  'blog-outline': {
    description: `Before a single sentence of an actual post gets written, there's a separate, earlier problem worth solving on its own: organizing the rough shape of what to say, which points come first, which supporting ideas belong under which heading, what the piece is actually building toward, a step that's easy to skip and then feel stuck partway through a draft that never had a clear structure to begin with. This tool builds that outline directly from a topic, structuring the rough shape of an argument or a piece of writing before any actual prose gets written. Useful for organizing scattered thoughts on a topic into an actual structure before drafting, avoiding the stuck-halfway-through feeling that comes from writing without a plan, or getting a starting skeleton to write into rather than facing a blank page with only a topic in mind.`,
    examples: [
      {
        title: 'Structure a post from a topic',
        code: `Input: topic: "why remote teams struggle with communication"\nOutput: intro hook + 4 supporting sections + conclusion, each with a one-line summary`,
        note: 'Organizes the shape of the argument before any prose gets written.',
      },
      {
        title: 'Turn scattered notes into a structure',
        code: `Input: rough notes on 3 unrelated points about a topic\nOutput: outline grouping the points under 3 logical headings in a sensible order`,
        note: 'Gives disorganized thoughts an actual sequence to write into.',
      },
    ],
  },

  'sha-256-hash': {
    description: `Confirming a downloaded file hasn't been tampered with, or checking that a piece of text matches what it's supposed to be, means comparing hashes rather than the files or text themselves, since even a single altered byte produces a completely different SHA-256 output while the original content might look identical at a glance. This tool generates a SHA-256 hash from any text input directly in the browser, with nothing sent to a server, so a checksum can be computed and verified without the text or file itself needing to leave your machine at all. Useful for generating a checksum to verify a piece of text hasn't been altered, computing a hash to compare against a published value before trusting a download, or getting a SHA-256 value for a password or a piece of data without it touching anything beyond your own browser.`,
    examples: [
      {
        title: "Verify text hasn't been altered",
        code: `Input: "Contract terms v2 final"\nOutput: 7d4f2e1a... (SHA-256 hash)`,
        note: 'Any change to the input, even one character, produces a completely different hash.',
      },
      {
        title: 'Generate a hash entirely client-side',
        code: `Input: "sensitive-value-123"\nOutput: hash computed and displayed, nothing sent to a server`,
        note: 'Keeps the original input from ever leaving the browser.',
      },
    ],
  },

  'readability-improver': {
    description: `Simplifying a sentence for readability is a more specific job than rephrasing it for style, the actual target is a measurable number, a Flesch-Kincaid grade level, a reading ease score, moving in a specific direction, which usually means breaking up an overly long sentence, swapping a needlessly complex word for a simpler one, and cutting the kind of dense phrasing that inflates a readability score without necessarily changing what the sentence actually says. This tool simplifies complex sentences with that measurable goal directly in mind, rather than rephrasing for a vaguer sense of quality with no way to confirm whether it actually moved the needle. Useful for bringing a piece of writing's reading level down to match its intended audience, simplifying a sentence that scores as unexpectedly dense, or checking that a rewrite actually improved a readability score rather than just sounding different.`,
    examples: [
      {
        title: 'Simplify a sentence to lower its grade level',
        code: `Input: "The implementation of this methodology necessitates a comprehensive understanding of the underlying architecture." (Grade 18)\nOutput: "Using this method requires understanding how the system works underneath." (Grade 8)`,
        note: 'Targets a specific, measurable drop in reading grade level.',
      },
      {
        title: 'Break up an overly long sentence',
        code: `Input: [one 45-word sentence with three separate ideas]\nOutput: three shorter sentences, one idea each`,
        note: 'Splits dense phrasing to directly improve a measurable readability score.',
      },
    ],
  },

  'random-color-generator': {
    description: `Sometimes the actual need isn't a specific color chosen deliberately, it's a color you didn't pick yourself, useful precisely because it wasn't decided in advance, a placeholder for a mockup before real branding exists, a bit of creative inspiration when every deliberately chosen option starts looking the same after staring at a palette too long. This tool generates a genuinely random color and returns it as hex, RGB, and HSL together, ready to copy, rather than requiring a color to already be picked or planned out. Useful for grabbing a placeholder color for a quick mockup without deciding on one, breaking out of a creative rut by seeing a color combination you wouldn't have chosen deliberately, or generating a batch of random swatches to react to rather than starting from a blank decision.`,
    examples: [
      {
        title: 'Get a placeholder color for a mockup',
        code: `Output: #7C3AED | rgb(124, 58, 237) | hsl(262, 83%, 58%)`,
        note: 'Provides a color to use immediately without deciding on one.',
      },
      {
        title: 'Generate a batch of colors for inspiration',
        code: `Count: 5\nOutput: #E63946, #2A9D8F, #F4A261, #457B9D, #E9C46A`,
        note: 'Surfaces combinations you might not have chosen deliberately.',
      },
    ],
  },

  'xml-to-json': {
    description: `An XML element can carry both attributes and its own text content or nested child elements at the same time, a single tag with an id attribute and text inside it, which doesn't map cleanly onto JSON's plainer key-value structure the way a simpler element does, and how that combination gets represented in JSON is a real design decision rather than an obvious, automatic translation. This tool converts XML into JSON with that attribute handling made explicit and configurable, along with options for how repeated elements become arrays, rather than a naive conversion that loses attributes or misrepresents repeated elements as something other than a proper array. Useful for converting an XML API response into JSON for an app that only consumes JSON, preserving attributes rather than silently dropping them, or getting repeated XML elements represented as a proper array instead of overwriting each other under the same key.`,
    examples: [
      {
        title: 'Convert an element with both an attribute and text',
        code: `Input: <user id="5">John</user>\nOutput: {"user": {"@id": "5", "#text": "John"}}`,
        note: 'Preserves the attribute and text content together instead of dropping one.',
      },
      {
        title: 'Convert repeated elements into a proper array',
        code: `Input: <items><item>A</item><item>B</item></items>\nOutput: {"items": {"item": ["A", "B"]}}`,
        note: 'Represents repeated elements as an actual array instead of overwriting one under a shared key.',
      },
    ],
  },
};

export default FIX_BATCH_40;
