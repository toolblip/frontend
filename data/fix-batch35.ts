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

const FIX_BATCH_35: Record<string, FixBatchEntry> = {
  'sql-formatter': {
    description: `A query minified down to one line for an environment variable or a compact log entry and the same query formatted for a code review need opposite treatment, and getting from one to the other by hand means either manually stripping every line break or manually reintroducing indentation depending on which direction is needed. This tool does both: beautifies a cramped query into properly indented, readable SQL, or minifies a formatted query back down to a single compact line, aware of the quoting conventions that differ between databases, backticks in MySQL, double quotes in PostgreSQL, so identifiers stay correctly quoted either direction. Useful for cleaning up a query before a code review, minifying a formatted query down for a config value or a single-line log entry, or reformatting a query pulled from a different database system without its identifier quoting breaking in the process.`,
    examples: [
      {
        title: 'Beautify a minified query',
        code: `Input: select id,name from users where active=1;\nOutput:\nSELECT id, name\nFROM users\nWHERE active = 1;`,
        note: 'Turns a one-line query into properly indented SQL for a code review.',
      },
      {
        title: 'Minify a formatted query for a config value',
        code: `Input:\nSELECT id, name\nFROM users\nWHERE active = 1;\nOutput: SELECT id, name FROM users WHERE active = 1;`,
        note: 'Compresses a readable query down to one line without breaking identifier quoting.',
      },
    ],
  },

  'html-encoder': {
    description: `Text that ends up in a page's visible body, a comment, a chat message, user-submitted content, needs its angle brackets and ampersands escaped before display, or a literal script tag typed by a visitor doesn't just show up as text, it risks actually running as a script the browser interprets, which is a different and more security-relevant concern than the same characters showing up inside an HTML attribute value. This tool encodes special characters into HTML entities for safe display in a page's visible content, or decodes entities back into readable text, handling exactly the characters that matter for content rendered directly into the body of a page. Useful for safely displaying user-submitted text that might contain angle brackets or ampersands, showing a code sample's raw HTML tags as visible text instead of having the browser render them, or decoding entity-encoded text back into something readable.`,
    examples: [
      {
        title: 'Safely display user-submitted text',
        code: `Input: <script>alert(1)</script>\nOutput: &lt;script&gt;alert(1)&lt;/script&gt;`,
        note: 'Prevents the text from being interpreted as an actual script tag by the browser.',
      },
      {
        title: 'Show a code sample as visible text',
        code: `Input: <div class="card"></div>\nOutput: &lt;div class=&quot;card&quot;&gt;&lt;/div&gt;`,
        note: 'Displays the tag as readable text instead of having the browser render an actual div.',
      },
    ],
  },

  'story-generator': {
    description: `Different genres carry genuinely different expectations that a generic story prompt doesn't account for, an adventure story needs escalating stakes and physical obstacles, a romance needs emotional tension and a believable connection between characters, sci-fi needs an internally consistent world with its own rules, and a story that ignores those genre-specific conventions reads as generic regardless of how well-written the prose itself is. This tool generates short stories built around the actual conventions of a chosen genre, adventure, romance, sci-fi, and more, rather than one generic narrative template with a different label swapped on top. Useful for generating a genre-appropriate short story from a simple prompt, exploring how the same basic premise plays out differently across genres, or getting a starting draft that already understands what a specific genre's readers actually expect from it.`,
    examples: [
      {
        title: 'Generate an adventure story from a prompt',
        code: `Input: genre: adventure, premise: "a map found in an old bookstore"\nOutput: short story with escalating obstacles and a clear physical goal`,
        note: 'Builds in the rising stakes an adventure story specifically needs.',
      },
      {
        title: 'Generate a sci-fi story with consistent world rules',
        code: `Input: genre: sci-fi, premise: "a colony ship loses contact with Earth"\nOutput: short story establishing its own consistent technology and rules early on`,
        note: 'Establishes internal world logic a sci-fi story specifically depends on.',
      },
    ],
  },

  'code-to-diagram-generator': {
    description: `Reading a function and mentally tracing every branch, loop, and call it makes is possible but slow, and explaining that same logic to someone else verbally is slower still, whereas a visual flowchart or sequence diagram shows the actual control flow and interactions at a glance in a way a written explanation has to build up sentence by sentence. This tool converts code directly into a visual flowchart or sequence diagram, mapping branches, loops, and function calls into an actual diagram rather than requiring the flow to be hand-drawn or described in prose. Useful for documenting a complex function's control flow visually before onboarding a new team member, generating a sequence diagram of how several functions or services actually interact, or turning tangled legacy code into a diagram that makes its structure visible before attempting to refactor it.`,
    examples: [
      {
        title: "Visualize a function's branching logic",
        code: `Input: function with 3 nested if/else branches\nOutput: flowchart showing each decision point and branch path`,
        note: 'Shows the control flow at a glance instead of tracing it line by line.',
      },
      {
        title: 'Generate a sequence diagram of service calls',
        code: `Input: function calling authService, then paymentService, then notificationService\nOutput: sequence diagram showing the order and direction of each call`,
        note: 'Maps out interaction order between functions or services visually.',
      },
    ],
  },

  'fake-address-generator': {
    description: `A shipping form, a signup flow, or a database seed script needs realistic-looking address data to actually test against, proper street formatting, a real city-state-zip combination, without using someone's actual home address just to verify a form validates correctly or a database handles the data as expected. This tool generates a realistic but entirely fictional address, street, city, state, and zip formatted the way a real one would be, built specifically for testing rather than accidentally referencing anyone's real information. Useful for testing a checkout or signup form's address validation without entering a real address, seeding a development database with realistic-looking sample records, or generating batch test data for an application that needs to display or process address fields during development.`,
    examples: [
      {
        title: "Test a shipping form's validation",
        code: `Output: 4218 Maple Ridge Ave, Springfield, IL 62704`,
        note: "A realistic, properly formatted address for testing without using anyone's real one.",
      },
      {
        title: 'Seed a development database',
        code: `Output: 25 fictional addresses, each with street, city, state, and zip`,
        note: 'Populates realistic-looking sample records for development and testing.',
      },
    ],
  },

  'batch-image-resizer': {
    description: `Resizing fifty product photos to the same dimensions one at a time in an image editor is the kind of repetitive task that eats an afternoon for something that should take minutes, especially once each photo needs opening, resizing, and re-exporting individually with the same settings applied every single time. This tool resizes an entire batch of images to the same target dimensions in one pass, with aspect ratio lock applied consistently across every file so nothing in the batch ends up stretched or squashed. Useful for resizing an entire product catalog's photos to a marketplace's required dimensions in one operation, preparing a batch of images for a website that all need matching thumbnail dimensions, or standardizing a folder of mismatched photo sizes into one consistent dimension without processing each file by hand.`,
    examples: [
      {
        title: 'Resize an entire product catalog at once',
        code: `Input: 60 product photos, target: 1000x1000px\nOutput: 60 resized images, aspect ratio locked`,
        note: 'Applies the same dimensions across an entire batch in one operation.',
      },
      {
        title: 'Standardize mismatched photo sizes',
        code: `Input: 20 photos, various original sizes\nOutput: 20 photos, all resized to 800x600px`,
        note: 'Brings an inconsistent folder of images to one uniform dimension.',
      },
    ],
  },

  'decimal-to-hex-converter': {
    description: `A designer with an RGB value written out as three decimal numbers, 37, 99, 235, needs the hex equivalent to actually use it in CSS, and a decimal memory address pulled from a debugger needs converting to hex to match how the rest of a codebase or a piece of documentation references it, two genuinely different situations that both come down to the same underlying conversion. This tool converts a decimal number into hexadecimal and binary instantly, with a copy button for dropping the result straight into whatever context actually needs it. Useful for converting an RGB color's decimal channel values into the hex code a stylesheet requires, matching a decimal memory address from a debugger to hex for cross-referencing documentation, or converting any decimal number into hex without doing the base conversion by hand.`,
    examples: [
      {
        title: 'Convert an RGB value to a hex color code',
        code: `Input: 37, 99, 235\nOutput: #2563EB`,
        note: 'Converts each decimal channel value into the hex code CSS requires.',
      },
      {
        title: 'Convert a decimal memory address to hex',
        code: `Input: 4096\nOutput: 0x1000`,
        note: 'Matches a decimal address from a debugger to the hex format documentation typically uses.',
      },
    ],
  },

  'quote-of-the-day': {
    description: `A blank space on a dashboard, a newsletter, or a daily habit app often gets filled with a rotating quote specifically because it changes regularly enough to feel fresh without needing anyone to manually update it, a small, low-effort piece of content that still gives a returning visitor something new to see. This tool returns a new quote, inspiring or simply interesting, along with proper author attribution, rather than an unattributed line with no source behind it. Useful for filling a recurring content slot on a dashboard, an app's home screen, or a daily newsletter without maintaining the rotation manually, adding a small attributed quote to a presentation or a document, or just getting a new quote worth reading with a name actually attached to it.`,
    examples: [
      {
        title: "Fill a dashboard's daily quote slot",
        code: `Output: "The only way to do great work is to love what you do." — Steve Jobs`,
        note: 'Rotates automatically without needing manual updates to the content slot.',
      },
      {
        title: 'Add an attributed quote to a presentation',
        code: `Output: "Simplicity is the ultimate sophistication." — Leonardo da Vinci`,
        note: 'Comes with proper author attribution rather than an unsourced line.',
      },
    ],
  },

  'ipa-phonetic-finder': {
    description: `English spelling is a famously unreliable guide to actual pronunciation, the same letter combination is said differently across different words, which is exactly the gap the International Phonetic Alphabet exists to close: a standardized symbol set that represents how a word actually sounds regardless of how its letters happen to be spelled. This tool converts a word into its IPA phonetic transcription and pairs it with audio, so both the standardized symbols and the actual sound are available together rather than one without the other. Useful for a language learner trying to nail down a word's actual pronunciation rather than guessing from spelling, a linguistics student practicing reading IPA transcription against real audio, or confirming how an unfamiliar or foreign-derived word is actually meant to be said.`,
    examples: [
      {
        title: "Check a word's actual pronunciation",
        code: `Input: "colonel"\nOutput: /ˈkɜːrnəl/ + audio playback`,
        note: 'Reveals a pronunciation the spelling itself gives no clue about.',
      },
      {
        title: 'Practice reading IPA against real audio',
        code: `Input: "though"\nOutput: /ðoʊ/ + audio`,
        note: 'Pairs the standardized symbols with actual sound for comparison.',
      },
    ],
  },

  'random-fraction-generator': {
    description: `A fraction worksheet needs actual fraction problems, not decimals disguised as fractions, and building a set by hand that covers a specific range and difficulty, simple fractions for a beginner, mixed numbers for a more advanced student, takes real time to assemble one problem at a time. This tool generates random fractions, decimals, or mixed numbers within a specified range, built for producing a batch of practice problems rather than a single one-off value. Useful for generating a set of practice problems for a specific grade level or skill range, building a worksheet's worth of fraction problems in one pass instead of writing each one by hand, or getting random test values for a script or a calculator app that needs to handle fractions correctly.`,
    examples: [
      {
        title: 'Generate a worksheet of practice fractions',
        code: `Range: 1/2 to 5/6, count: 10\nOutput: 3/4, 2/3, 5/6, 1/2 (10 fractions total)`,
        note: 'Produces a batch of problems in one pass instead of writing each by hand.',
      },
      {
        title: 'Generate mixed numbers for a specific range',
        code: `Range: 1 to 5, type: mixed number, count: 5\nOutput: 2 3/4, 4 1/2, 1 5/8, 3 1/3, 4 5/6`,
        note: 'Targets mixed numbers specifically rather than simple fractions or decimals.',
      },
    ],
  },
};

export default FIX_BATCH_35;
