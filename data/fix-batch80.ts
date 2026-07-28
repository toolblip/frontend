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

const FIX_BATCH_80: Record<string, FixBatchEntry> = {
  'base64-file-encoder': {
    description: `A PDF, a font file, a zip archive, any binary file really, sometimes needs to travel somewhere that only accepts text, a JSON field in an API request, a config file, a database column typed as a string, and Base64 is the standard way to represent that binary data as plain text characters that survive being copied, pasted, or transmitted without corruption. This tool encodes any file into a Base64 string, or decodes an existing Base64 string back into its original file, working with any file type rather than just images. Useful for embedding a small file's contents directly into a JSON API payload as a Base64 field, decoding a Base64 string received from an API back into a downloadable file, or converting a font or a document into a text-safe format for a system that can't accept binary uploads directly.`,
    examples: [
      {
        title: 'Embed a file in a JSON payload',
        code: `Input: invoice.pdf\nOutput: { "file": "JVBERi0xLjQKJ...", "filename": "invoice.pdf" }`,
        note: 'Represents binary file data as a text-safe field for an API request.',
      },
      {
        title: 'Decode a Base64 string back to a file',
        code: `Input: "JVBERi0xLjQKJ..."\nOutput: invoice.pdf (downloadable file)`,
        note: 'Reverses the encoding to recover the original file.',
      },
    ],
  },

  'url-slug-generator': {
    description: `Lowercasing a title and swapping spaces for hyphens handles the easy half of making a URL slug, the genuinely tricky part is a title like "Café Münchën" or one carrying a smart quote or an em dash, characters that need to be transliterated or stripped into clean, ASCII-safe text rather than left as encoded garbage or silently dropped from the slug entirely. This tool converts any text or title into a clean, SEO-friendly slug, properly handling Unicode characters, accents, and special punctuation rather than just the straightforward lowercase-and-hyphenate cases. Useful for turning an accented, non-English title into a clean ASCII slug that still reads sensibly, converting a title with smart quotes or an em dash without leaving broken characters in the URL, or generating a consistent slug format for a site that publishes content in more than one language.`,
    examples: [
      {
        title: 'Transliterate an accented title',
        code: `Input: "Café Münchën Review"\nOutput: cafe-munchen-review`,
        note: 'Converts accented characters into clean ASCII rather than dropping them.',
      },
      {
        title: 'Handle smart quotes and an em dash',
        code: `Input: "It's Great — Really"\nOutput: its-great-really`,
        note: 'Strips special punctuation without leaving broken characters in the slug.',
      },
    ],
  },

  'summarize-youtube': {
    description: `Getting the gist of a forty-minute video usually means scrubbing through it hunting for the two or three moments that actually matter, since the input here isn't a document, it's a timeline, and the useful content, whatever was actually said, lives scattered across a transcript rather than sitting on a page ready to be skimmed. This tool pulls a YouTube video's transcript and condenses it into key points, with timestamps pointing back to roughly where in the video each point was actually made. Useful for deciding whether a long video is worth watching in full before committing to it, jumping straight to the timestamp where a specific point is actually discussed, or getting the key takeaways from a video during research without watching the whole thing start to finish.`,
    examples: [
      {
        title: 'Get key points with timestamps',
        code: `Input: https://youtube.com/watch?v=abc123 (42 min video)\nOutput: 1. Intro (0:45) 2. Main argument (12:30) 3. Conclusion (38:10)`,
        note: 'Points back to roughly where each key point was made in the video.',
      },
      {
        title: 'Decide whether a video is worth watching',
        code: `Input: [product review video]\nOutput: "Recommends the product overall but flags battery life as a weak point"`,
        note: 'Gives the gist without watching the video start to finish.',
      },
    ],
  },

  'speed-converter': {
    description: `Kilometers per hour, miles per hour, and meters per second all convert to each other with a straightforward decimal factor, but a knot is defined as one nautical mile per hour, and a nautical mile itself comes from one minute of latitude rather than any round metric or imperial number, which is exactly why converting to or from knots trips people up in a way the other speed units don't. This tool converts between km/h, mph, m/s, knots, and feet per second, handling the maritime and aviation-specific knot conversion correctly rather than approximating it. Useful for converting a ship or aircraft's speed in knots into mph for a general audience, checking a wind speed reported in knots against a familiar km/h figure, or converting between any pair of these five units for a physics problem or a real-world comparison.`,
    examples: [
      {
        title: "Convert a ship's speed from knots",
        code: `Input: 20 knots\nOutput: 23.02 mph`,
        note: "Applies the nautical mile's specific conversion factor rather than a round decimal shift.",
      },
      {
        title: 'Convert wind speed to a familiar unit',
        code: `Input: 15 knots\nOutput: 27.8 km/h`,
        note: 'Translates a maritime or aviation unit into one more familiar to a general audience.',
      },
    ],
  },

  'lorem-ipsum-api': {
    description: `Most lorem ipsum generators expect someone to open a page, click a button, and copy the result by hand, which works fine for a one-off mockup but breaks down completely for a build script, a test fixture generator, or a CI pipeline that needs placeholder text generated automatically without a person ever touching a browser. This tool exposes lorem ipsum generation as an actual API endpoint, returning customizable paragraphs, sentence counts, and output formats programmatically rather than through a manual web form. Useful for seeding a test database with placeholder content automatically during a CI run, generating filler text on demand from within a script rather than copying it by hand, or fetching lorem ipsum in a specific format directly from application code during development.`,
    examples: [
      {
        title: 'Seed test data from a CI script',
        code: `GET /api/lorem?paragraphs=3&format=json\nOutput: { "text": ["Lorem ipsum dolor...", "..."] }`,
        note: 'Generates placeholder text programmatically without opening a browser.',
      },
      {
        title: 'Fetch a specific sentence count from code',
        code: `GET /api/lorem?sentences=5&format=text\nOutput: "Lorem ipsum dolor sit amet..."`,
        note: 'Callable directly from application code during development.',
      },
    ],
  },

  'sticky-notes': {
    description: `A structured to-do list keeps everything in one tidy, linear order, which is exactly the wrong shape for a handful of quick reminders that need to be color-coded, glanced at, and rearranged freely the way actual sticky notes on a corkboard would be, disposable, visual, and spatial rather than a single ranked list. This tool creates digital sticky notes in different colors that can be placed and repositioned freely, closer to a corkboard than a task manager. Useful for jotting down a quick reminder that doesn't belong in a formal to-do list, color-coding a handful of loosely related ideas by topic at a glance, or arranging a set of quick notes spatially instead of forcing them into one ranked order.`,
    examples: [
      {
        title: 'Jot a quick reminder outside a formal list',
        code: `Note: "Call the plumber back", color: yellow`,
        note: "Doesn't require fitting into a structured, ranked to-do list.",
      },
      {
        title: 'Color-code loosely related ideas',
        code: `Note 1: "Blog topic idea" (blue)\nNote 2: "Bug to investigate" (red)\nNote 3: "Ask Sam about deploy" (green)`,
        note: 'Groups ideas visually by color rather than by list position.',
      },
    ],
  },

  'jpg-to-png': {
    description: `A JPEG loses a little quality every single time it's opened, edited, and saved again as a JPEG, since its compression is lossy and each re-save recompresses the image from what's already a slightly degraded version, a kind of generational loss that quietly compounds over several rounds of editing. This tool converts a JPEG into PNG, a lossless format, so any further edits and saves after the conversion stop losing quality altogether rather than degrading further with each pass. Useful for converting a JPEG to PNG before a round of edits so repeated saving afterward doesn't degrade it further, preserving a photo's current quality exactly instead of letting one more JPEG re-save erode it, or converting an image into a format where saving it five more times looks identical to saving it once.`,
    examples: [
      {
        title: 'Stop generational loss before editing',
        code: `Input: photo.jpg (re-saved 3 times already)\nOutput: photo.png (lossless from this point forward)`,
        note: 'Prevents further quality loss from repeated future saves.',
      },
      {
        title: 'Preserve current quality exactly',
        code: `Input: scan.jpg\nOutput: scan.png (identical quality, no further compression)`,
        note: 'Locks in the current quality instead of letting one more JPEG save erode it.',
      },
    ],
  },

  'random-choice-wheel': {
    description: `Picking a random index out of a list happens instantly no matter how it's done, but a plain instant pick doesn't feel fair or transparent to a room full of people watching, which is exactly the gap a spinning wheel fills, a visible, suspenseful process everyone can watch unfold rather than a result that just appears with no visible process behind it. This tool spins a customizable wheel to pick randomly from a list of names or items, making the selection process itself something a group can watch happen. Useful for picking a raffle winner in front of an audience where the process needs to feel visibly fair, deciding whose turn goes next in a classroom or a game night, or randomly assigning teams while everyone watches the wheel land.`,
    examples: [
      {
        title: 'Pick a raffle winner visibly',
        code: `Input: ["Alice", "Ben", "Chen", "Dana"]\nOutput: wheel spins, lands on "Chen"`,
        note: 'Makes the selection process visible rather than an instant, invisible pick.',
      },
      {
        title: 'Decide whose turn is next',
        code: `Input: ["Team A", "Team B", "Team C"]\nOutput: wheel lands on "Team B"`,
        note: 'Gives a group activity a shared, suspenseful moment.',
      },
    ],
  },

  'real-estate-description': {
    description: `Turning "kitchen has an east-facing window" into "sun-drenched breakfast nook" is the easy part of writing a real estate listing, the part that actually requires care is fair housing law, which prohibits language that references or implies a preference about who should live somewhere, even indirectly, a phrase like "perfect for a young couple" or a mention of proximity to a specific religious institution can cross that line in ways generic marketing copy never has to worry about. This tool writes property listing descriptions that turn plain features into evocative, buyer-focused language while staying inside fair housing guidelines. Useful for turning a spec sheet of square footage and room counts into descriptive copy that helps a buyer picture living there, drafting a listing that highlights a property's best features first, or writing compelling real estate copy without accidentally including language that violates fair housing rules.`,
    examples: [
      {
        title: 'Turn features into evocative copy',
        code: `Input: "3 bed, 2 bath, east-facing kitchen window, 1,800 sq ft"\nOutput: "A sun-drenched breakfast nook anchors this bright 1,800 sq ft home..."`,
        note: 'Translates plain specs into language that helps a buyer picture living there.',
      },
      {
        title: 'Stay inside fair housing guidelines',
        code: `Input: draft mentioning "great for young families"\nOutput: flagged - replace with feature-based language instead of buyer-preference language`,
        note: 'Avoids phrasing that implies a preference about who should live there.',
      },
    ],
  },

  'uuid-generator': {
    description: `A UUID v1 embeds an actual timestamp and the generating machine's MAC address right inside the identifier, which makes it sortable by creation time but also leaks real information about when and where it was created, while a v4 UUID is built from 122 bits of pure randomness instead, carrying no timestamp, no machine identifier, nothing to infer beyond the identifier itself being effectively unique. This tool generates random v4 UUIDs, the safest default choice specifically when sortability isn't needed and avoiding any embedded information about origin actually matters. Useful for generating a database identifier that reveals nothing about when or where it was created, creating unique IDs for a system where sortable ordering isn't a requirement, or generating a batch of identifiers guaranteed not to leak timestamp or machine information the way a v1 UUID would.`,
    examples: [
      {
        title: 'Generate an identifier with no embedded info',
        code: `Output: 9f8c9e2a-4b3d-4e1a-8f2c-1a2b3c4d5e6f`,
        note: 'Pure randomness, no timestamp or machine identifier embedded.',
      },
      {
        title: 'Generate a batch for a system needing no sortability',
        code: `Output: 3 UUIDs, each independently random with no shared ordering`,
        note: 'The right choice when sortable creation order is not a requirement.',
      },
    ],
  },
};

export default FIX_BATCH_80;
