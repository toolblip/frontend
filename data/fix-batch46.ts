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

const FIX_BATCH_46: Record<string, FixBatchEntry> = {
  'html-to-jsx': {
    description: `Pasting HTML straight into a React component usually fails in a few small but specific ways, class needs to become className since class is a reserved word in JavaScript, a self-closing tag like <img> or <br> that HTML allows without a closing slash needs one in JSX, and an inline style attribute has to become a JavaScript object instead of a plain CSS string, each easy to miss while converting a chunk of markup by hand. This tool converts HTML directly into JSX, handling that attribute renaming and self-closing tag syntax automatically rather than leaving each one for a compiler error to catch one at a time. Useful for pasting a design's HTML markup into a React component without manually renaming every class attribute, converting a static HTML template into JSX before turning it into a component, or catching self-closing tag requirements that HTML itself never enforced.`,
    examples: [
      {
        title: 'Convert class and self-closing tags',
        code: `Input: <div class="card"><img src="photo.jpg"></div>\nOutput: <div className="card"><img src="photo.jpg" /></div>`,
        note: 'Renames class to className and adds the required self-closing slash.',
      },
      {
        title: 'Convert an inline style attribute',
        code: `Input: <div style="color: red; font-size: 14px;"></div>\nOutput: <div style={{ color: 'red', fontSize: '14px' }}></div>`,
        note: 'Turns a CSS string into a JavaScript object with camelCased property names.',
      },
    ],
  },

  'fake-text-generator': {
    description: `Lorem ipsum works fine for filling space, but it repeats a fairly narrow set of Latin words, which is exactly why it falls short for testing a typeface specifically, previewing a font actually requires seeing every letter of the alphabet rendered somewhere, and a pangram, a sentence built to use every letter at least once, is the specific text designed to guarantee that in a way ordinary lorem ipsum never promises to. This tool generates lorem ipsum, pangrams, general placeholder text, and random sentences together, covering both the generic filler-text need and the more specific pangram use case a font preview actually calls for. Useful for previewing a new typeface with a pangram that guarantees every letter shows up somewhere, filling a mockup with generic lorem ipsum when pangrams aren't actually needed, or generating a quick random sentence for a test case that just needs some plausible-looking text.`,
    examples: [
      {
        title: 'Preview a font with a pangram',
        code: `Output: "The quick brown fox jumps over the lazy dog."`,
        note: 'Guarantees every letter of the alphabet appears at least once.',
      },
      {
        title: 'Fill a mockup with generic placeholder text',
        code: `Output: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."`,
        note: "Standard filler text for when a pangram's specific guarantee isn't actually needed.",
      },
    ],
  },

  'url-similarity-checker': {
    description: `Two URLs pointing to genuinely different pages can still look remarkably alike, a redirect chain landing somewhere subtly different than expected, a typo-squatted domain close enough to a real one to fool a quick glance, cases where the actual question isn't whether two URLs are identical, since they clearly aren't, but how similar they actually are and whether that similarity is meaningful or coincidental. This tool compares two URLs and scores how similar they actually are, rather than only checking for an exact canonical match like a www or trailing-slash variant. Useful for confirming a redirect actually lands somewhere close enough to the intended destination, checking whether a suspicious domain is similar enough to a known one to be a deliberate lookalike, or comparing two URLs that aren't identical but might represent duplicate or near-duplicate content worth investigating.`,
    examples: [
      {
        title: 'Check if a redirect landed close enough',
        code: `Input: intended: example.com/products/widget, actual: example.com/products/widget-v2\nOutput: 87% similar`,
        note: 'Flags a redirect that landed somewhere related but not identical to the intended page.',
      },
      {
        title: 'Spot a lookalike domain',
        code: `Input: example.com, examp1e.com\nOutput: 94% similar (character substitution detected)`,
        note: 'Surfaces a domain close enough to be a deliberate lookalike rather than an unrelated URL.',
      },
    ],
  },

  'rot13-express': {
    description: `ROT13 has a neat property most substitution ciphers don't: applying it twice returns the exact original text, since shifting every letter forward by thirteen places and then doing it again moves each letter a full twenty-six places, all the way around the alphabet back to where it started, which is why the same operation both encodes and decodes with no separate reverse step needed. This tool applies ROT13 to text instantly, useful for the format's actual common purpose, obscuring a spoiler or a punchline in a forum post so it's not immediately visible but can be decoded on purpose by anyone who wants to read it, not real security in any meaningful sense. Useful for hiding a spoiler in a post so readers can choose whether to reveal it, decoding a ROT13-obscured message back into plain text, or applying the same operation either direction since encoding and decoding are identical.`,
    examples: [
      {
        title: 'Hide a spoiler in a forum post',
        code: `Input: "The killer was the butler."\nOutput: "Gur xvyyre jnf gur ohgyre."`,
        note: 'Readable only by someone who deliberately decodes it, not visible at a glance.',
      },
      {
        title: 'Confirm applying it twice restores the original',
        code: `Input: "Hello" -> ROT13 -> "Uryyb" -> ROT13 again -> "Hello"`,
        note: 'Demonstrates that ROT13 is its own exact inverse.',
      },
    ],
  },

  'binary-to-decimal': {
    description: `Each binary digit represents a specific power of two based on its position, the rightmost digit worth one, the next worth two, then four, then eight, doubling with every step left, and adding up the positions where a 1 actually appears is the entire calculation behind converting binary into decimal, straightforward once seen worked out but easy to fumble doing purely in your head. This tool converts binary to decimal and back, showing the actual positional breakdown, each bit's power of two and whether it's a 1 or a 0, rather than just returning a final number with no visible working. Useful for a student learning how positional binary notation actually represents a number for the first time, double-checking a binary-to-decimal conversion done by hand, or converting a binary value from a datasheet or a programming exercise with the calculation shown alongside the result.`,
    examples: [
      {
        title: 'See the positional breakdown',
        code: `Input: 1011\nBreakdown: (1×8) + (0×4) + (1×2) + (1×1) = 8 + 0 + 2 + 1\nOutput: 11`,
        note: 'Shows each bit multiplied by its power of two instead of just the final number.',
      },
      {
        title: 'Convert decimal back to binary',
        code: `Input: 25\nOutput: 11001`,
        note: 'Works in both directions from the same tool.',
      },
    ],
  },

  'curl-to-javascript': {
    description: `A curl command translates differently into JavaScript than into a backend scripting language, since a frontend request typically needs to work with promises, either handled through fetch's own .then chains and async/await syntax, or through Axios, a popular library with its own slightly different call conventions and automatic JSON parsing, and picking the wrong pattern produces code that runs but doesn't fit how the rest of a codebase actually handles asynchronous requests. This tool converts a curl command into JavaScript using either fetch or Axios, with proper async/await syntax, matching whichever pattern a specific frontend codebase actually uses rather than a generic style that might not fit. Useful for converting an API call copied from documentation into fetch-based code for a vanilla JavaScript project, generating Axios-based code for a codebase already built around that library, or turning a curl example into working JavaScript without hand-translating headers and the request body.`,
    examples: [
      {
        title: 'Convert to fetch with async/await',
        code: `Input: curl -X GET https://api.example.com/users\nOutput:\nconst response = await fetch("https://api.example.com/users");\nconst data = await response.json();`,
        note: 'Produces vanilla fetch code for a project with no extra HTTP library.',
      },
      {
        title: 'Convert to Axios',
        code: `Input: curl -X POST https://api.example.com/users -d '{"name":"Jane"}'\nOutput:\nconst { data } = await axios.post("https://api.example.com/users", { name: "Jane" });`,
        note: 'Matches the call convention and automatic JSON handling Axios provides.',
      },
    ],
  },

  'vcard-qr-generator': {
    description: `Handing someone a business card that gets typed into their phone later, if it doesn't end up lost in a pocket first, is a slower path to actually being saved as a contact than a QR code that adds a name, phone number, and email directly to a phone's contacts app the moment it's scanned, no manual typing and no risk of the card itself getting lost before anyone gets around to entering the details. This tool generates a QR code encoding vCard contact information, ready to be scanned straight into a phone's contacts rather than just opening a link. Useful for creating a digital business card that adds contact details directly on scan at a networking event, putting a scannable contact QR code on a printed card or a booth display, or sharing contact information without anyone needing to type a single field in by hand.`,
    examples: [
      {
        title: 'Create a scannable digital business card',
        code: `Input: name: "Jane Doe", phone: "555-0142", email: "jane@example.com"\nOutput: QR code that adds Jane as a new contact when scanned`,
        note: 'Adds directly to contacts instead of just opening a link.',
      },
      {
        title: 'Add a QR code to a printed card',
        code: `Input: company vCard details\nOutput: QR code ready to print on a business card or booth sign`,
        note: 'Lets a scan save contact details without any manual typing.',
      },
    ],
  },

  'json-formatter': {
    description: `A JSON response squeezed onto a single line with no spacing at all is technically valid and completely unreadable at the same time, and the moment something in it is actually wrong, a missing comma, an unclosed bracket, finding exactly where becomes a real task without a formatter that can pretty-print the structure and point out precisely what broke. This tool formats JSON with proper indentation and syntax highlighting, flags a specific error the instant something is malformed, and can minify the same JSON back down for production once it's confirmed correct, all running directly in the browser without the data going anywhere else. Useful for pretty-printing a minified API response into something actually readable, catching a syntax error in a JSON payload with a specific location rather than a generic parse failure, or minifying a formatted JSON file back down before it ships to production.`,
    examples: [
      {
        title: 'Pretty-print a minified API response',
        code: `Input: {"id":1,"name":"Widget","tags":["new","sale"]}\nOutput:\n{\n  "id": 1,\n  "name": "Widget",\n  "tags": ["new", "sale"]\n}`,
        note: 'Turns an unreadable single line into properly indented, readable JSON.',
      },
      {
        title: 'Catch a specific syntax error',
        code: `Input: {"id": 1, "name": "Widget",}\nResult: error, trailing comma before closing brace`,
        note: 'Points to the exact problem instead of a generic parse failure.',
      },
    ],
  },

  'jpg-to-gif': {
    description: `A phone's burst mode or a quick sequence of process photos, three or four JPGs capturing a moment in stages, is a natural fit for a simple animated GIF, and JPG being the default photo format for virtually every camera and phone makes it the actual starting point most people have on hand rather than some other image format they'd need to convert first. This tool turns a sequence of JPEG photos into an animated GIF, with the frame timing adjustable, built specifically around the format most photos already exist in rather than requiring a different starting format first. Useful for turning a burst-mode photo sequence into a simple looping animation, building a quick stop-motion-style GIF from a handful of process photos, or animating a short sequence of JPGs without needing to convert them to another format before starting.`,
    examples: [
      {
        title: 'Turn a burst-mode sequence into a GIF',
        code: `Input: burst-1.jpg, burst-2.jpg, burst-3.jpg, frame delay: 150ms\nOutput: burst-animation.gif`,
        note: 'Works directly from the JPG format most burst-mode photos already save as.',
      },
      {
        title: 'Animate a process sequence',
        code: `Input: step1.jpg, step2.jpg, step3.jpg\nOutput: process.gif (looping)`,
        note: 'Builds a simple stop-motion-style animation from a handful of process photos.',
      },
    ],
  },

  'srt-to-json': {
    description: `An SRT subtitle file is readable enough as plain text, a number, a timestamp range, then the subtitle line, repeated block after block, but that structure is awkward for a program to actually work with directly, searching for when a specific line of dialogue appears or building a custom caption display both need the timestamps and text pulled apart into something a script can actually query rather than a block of loosely formatted text. This tool converts an SRT file into JSON, with each subtitle entry becoming its own object with a start time, end time, and text field. Useful for building a custom video player's caption display from structured data instead of parsing raw SRT text manually, searching a video's subtitles for exactly when a specific line was said, or feeding subtitle data into a script or an application that expects JSON rather than SRT's plain-text block format.`,
    examples: [
      {
        title: 'Convert subtitles into structured entries',
        code: `Input SRT:\n1\n00:00:01,000 --> 00:00:03,500\nHello there.\nOutput JSON:\n[{ "start": "00:00:01,000", "end": "00:00:03,500", "text": "Hello there." }]`,
        note: 'Turns each subtitle block into a queryable object instead of plain text.',
      },
      {
        title: 'Search subtitles for a specific line',
        code: `Input: [full episode SRT converted to JSON]\nQuery: text contains "supply chain"\nOutput: match found at 00:14:22,100`,
        note: 'Finds an exact moment by searching structured data instead of scanning raw SRT text.',
      },
    ],
  },
};

export default FIX_BATCH_46;
