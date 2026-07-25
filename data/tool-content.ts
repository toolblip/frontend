export type ToolContentExample = {
  title: string;
  code: string;
  language?: string;
  note?: string;
};

export type ToolContent = {
  /** 100-200 word description specific to this tool, not shared boilerplate. */
  description: string;
  /** 2-3 short, concrete code examples relevant to this tool. */
  examples: ToolContentExample[];
  /** Key features specific to this tool. */
  features: string[];
};

/**
 * Hand-written, per-tool content keyed by slug. Unlike lib/faq.ts's generic
 * templateFaqs() (which picks from a small pool of category-level templates
 * and is near-duplicate across every tool in a category), everything here
 * should be unique prose written for that specific tool.
 */
export const toolContent: Record<string, ToolContent> = {
  'json-formatter': {
    description:
      "The JSON Formatter turns a single unbroken line of JSON into an indented, readable tree the moment you paste it. It runs your input through the browser's native JSON parser, so if something is malformed, the error message points at the exact character that broke the parse instead of leaving you to eyeball a wall of text for a missing comma. Switch between 2-space and 4-space indentation depending on your team's style guide, or flip to minify mode to strip every byte of whitespace before you ship a payload over the wire. Because parsing and formatting both happen with dependency-free browser APIs, there's no network round-trip and no upload step — paste an API response that contains customer records or an internal auth token and it never leaves the tab. The formatter also copes with deeply nested structures and multi-megabyte payloads without stalling, which is the case that trips up most copy-paste-into-a-website JSON tools.",
    examples: [
      {
        title: 'Minified input',
        language: 'json',
        code: '{"id":482,"user":{"name":"Alice Chen","active":true},"tags":["admin","beta"],"createdAt":"2026-01-14T10:22:00Z"}',
        note: 'A typical single-line API response — hard to scan for a specific field.',
      },
      {
        title: 'Pretty-printed output (2-space)',
        language: 'json',
        code: `{
  "id": 482,
  "user": {
    "name": "Alice Chen",
    "active": true
  },
  "tags": ["admin", "beta"],
  "createdAt": "2026-01-14T10:22:00Z"
}`,
        note: 'The same payload after formatting — every key is scannable and the nesting is visible at a glance.',
      },
      {
        title: 'A syntax error the formatter catches',
        language: 'json',
        code: `{
  "id": 482,
  "active": true,
}`,
        note: 'The trailing comma after "active": true is invalid JSON. The formatter flags it immediately instead of leaving you to guess which character broke the parse.',
      },
    ],
    features: [
      'Real-time syntax validation that points to the exact line and character of the first error',
      'Toggle between 2-space and 4-space indentation without re-pasting your input',
      'One-click minify mode for stripping whitespace before sending a payload over the wire',
      'Handles multi-megabyte, deeply nested JSON without freezing the tab',
    ],
  },

  'json-validator': {
    description:
      "JSON Validator is built for a narrower job than a full formatter: tell you, as fast as possible, whether a JSON document is syntactically valid, and if it isn't, exactly where it breaks. Paste a snippet and it reports the line and column of the first parse failure instead of pretty-printing the whole document, so you're not scrolling through reformatted output to find one bad character. That makes it a good fit for checking a config file before a deploy, verifying a webhook payload someone pasted into a support ticket, or running a quick sanity check on a .json file before committing it. It also flags the class of mistake that's easy to miss by eye — a trailing comma after the last array item, an unquoted key, a stray single quote where JSON requires double quotes — and names the specific rule that failed rather than just saying \"unexpected token\". Everything runs through the browser's built-in JSON parser, so validation is instant and nothing you paste is sent anywhere.",
    examples: [
      {
        title: 'Valid JSON',
        language: 'json',
        code: '{"name": "config", "version": 2, "flags": ["debug", "verbose"]}',
        note: 'Passes validation instantly — no output beyond a confirmation, so you can move on.',
      },
      {
        title: 'Unquoted key (invalid)',
        language: 'json',
        code: `{
  name: "config",
  "version": 2
}`,
        note: 'JSON requires double-quoted keys. The validator reports this at line 2, column 3 instead of a generic parse failure.',
      },
      {
        title: 'Trailing comma (invalid)',
        language: 'json',
        code: `{
  "flags": ["debug", "verbose",]
}`,
        note: "A trailing comma inside the array is valid in JavaScript object literals but not in JSON — a common copy-paste mistake from .js config files.",
      },
    ],
    features: [
      'Reports the exact line and column of the first syntax error instead of a generic "invalid JSON" message',
      'Distinguishes common mistakes — unquoted keys, trailing commas, single quotes — by name, not just position',
      'Validates as you type, so you catch the break before you finish pasting a large document',
      "No file size cap beyond your browser's memory — check multi-megabyte payloads without a server round-trip",
    ],
  },

  'base64-encoder-decoder': {
    description:
      "Base64 Encoder/Decoder handles the two directions people actually need: turning text or a file into a Base64 string, and turning a Base64 string back into readable text or a downloadable file. Beyond plain text, it accepts images and other binary files directly — drop in a PNG and get back a data URL you can paste straight into a CSS background-image or an HTML img src without hosting a separate asset. It also handles the URL-safe variant (- and _ instead of + and /) that shows up in JWTs and query parameters, so you're not manually swapping characters before decoding a token fragment. Because encode and decode sit side by side, you can round-trip a value — encode it, then decode your own output — to confirm nothing got mangled before you paste it into a config file or an API request body. All conversion happens with the browser's native btoa/atob and FileReader APIs, so files never leave the tab, which matters when the file in question is a private key or a signed asset.",
    examples: [
      {
        title: 'Encode a UTF-8 string',
        language: 'text',
        code: '"Hello, world! 👋" → SGVsbG8sIHdvcmxkISDwn5GL',
        note: 'Multi-byte characters (like the emoji) are handled correctly — a common failure point in hand-rolled Base64 encoders.',
      },
      {
        title: 'Data URL for inline CSS',
        language: 'css',
        code: 'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...");',
        note: 'Paste an image in, get a ready-to-use data URL out — no separate asset request.',
      },
      {
        title: 'URL-safe Base64 (JWT-style)',
        language: 'text',
        code: `Standard:  SGVsbG8/Zm9v+Jg==
URL-safe:  SGVsbG8_Zm9v-Jg`,
        note: 'JWTs and query strings use - and _ instead of + and / — toggle the variant instead of hand-editing characters.',
      },
    ],
    features: [
      'Encodes and decodes text, files, and images — not just plain strings',
      'Supports both standard and URL-safe Base64 alphabets',
      "Round-trip in one tab: decode your own encoded output to confirm it matches the original",
      'Uses native browser APIs (btoa/atob, FileReader), so files never upload anywhere',
    ],
  },

  'color-picker': {
    description:
      "Color Picker exists for the moment you have a color in one format and need it in another — a designer hands you a HEX value from Figma but your Tailwind config wants HSL, or you're eyeballing a swatch and need the RGB triplet for a canvas fillStyle. Pick visually with your OS's native color picker, paste a HEX, RGB, or HSL value directly, or drag through the spectrum, and every format updates together so you're never manually converting by hand. It also folds in a WCAG contrast check against white and black backgrounds with a plain AA/AAA/Fail badge, which turns \"does this look readable\" into a yes or no answer before you commit a text color to a stylesheet. Because it's a single input feeding every output format, it also works as a translator between tools that disagree on color syntax — a design tool that exports HEX, a CSS-in-JS library that wants an RGB object, and a Sass variable file that uses HSL can all read from the same swatch without you doing the math.",
    examples: [
      {
        title: 'One color, every format',
        language: 'text',
        code: `HEX: #E8532B
RGB: rgb(232, 83, 43)
HSL: hsl(14, 78%, 54%)`,
        note: 'Enter any one of these and the other two populate immediately.',
      },
      {
        title: 'Contrast check against white',
        language: 'text',
        code: '#E8532B on #FFFFFF → contrast ratio 3.1:1 → fails AA for normal text',
        note: 'The badge updates live as you adjust the color, before you ever paste it into CSS.',
      },
      {
        title: 'Reading a picked value into code',
        language: 'js',
        code: 'const accent = "#E8532B"; // copied straight from the swatch',
        note: 'Copy any format with one click — no manual retyping of hex digits.',
      },
    ],
    features: [
      'Live HEX, RGB, and HSL output that all update from a single picked or typed value',
      'Native OS color picker for visual selection, or type a value directly in any format',
      'Built-in WCAG AA/AAA contrast check against white and black backgrounds',
      'One-click copy per format, so you grab exactly the syntax your project uses',
    ],
  },

  'password-generator': {
    description:
      "Password Generator produces random passwords using the browser's crypto.getRandomValues, the same cryptographically secure source used by security-focused libraries, rather than Math.random(), which is predictable enough that it should never back a credential. You control length and which character classes are in play — lowercase, uppercase, digits, symbols — and a live entropy estimate tells you where the result lands from \"Weak\" to \"Very strong\" based on the actual search space, not a cosmetic strength bar. There's also a toggle to exclude visually ambiguous characters (l/1, O/0) for the specific case where a human has to type the password by hand rather than paste it — a printed recovery code or a password read aloud over the phone. Nothing about the generation touches a network: the password is created, displayed, and forgotten the moment you navigate away or close the tab, with no logging and no history, so it's safe to generate credentials for production systems here rather than reusing a weaker password out of convenience.",
    examples: [
      {
        title: '20-character password, all classes',
        language: 'text',
        code: 'xK9!mQr2$vLpN7*wZbF4',
        note: 'Full character set at 20 characters clears "Very strong" — well beyond brute-force range for any online account.',
      },
      {
        title: 'Ambiguous characters excluded',
        language: 'text',
        code: `Default:   a8gT!yWl1O0kNz
Excluded:  a8gT!yWkNzXpR2`,
        note: 'With l/1 and O/0 removed, every character is unambiguous if the password has to be typed by hand or read aloud.',
      },
      {
        title: 'Digits-only PIN mode',
        language: 'text',
        code: 'Length 6, digits only → 483920',
        note: 'Useful for numeric PINs where a device only accepts digit input.',
      },
    ],
    features: [
      'Uses crypto.getRandomValues (CSPRNG) instead of Math.random for real cryptographic randomness',
      'Live entropy-based strength rating — Weak, Fair, Strong, Very strong — from the actual character pool and length',
      'Optional exclusion of ambiguous characters (l/1, O/0) for passwords that must be typed or read aloud',
      'Nothing is logged, stored, or sent anywhere — the password exists only until you close or navigate away',
    ],
  },

  'markdown-preview': {
    description:
      "Markdown Preview is for writing, not converting: a split-pane editor where the rendered output sits next to your source the entire time, so you catch a broken table or a heading that didn't nest the way you expected while you're still typing it, not after you've pasted the whole document somewhere else to check. It's built for the documents people actually draft in Markdown day to day — a README, a PR description, release notes, a comment in a project tracker that supports Markdown — where the goal is confidence that the rendered version looks right, not a one-off format conversion. When you're done, export straight to HTML rather than copying rendered text and losing the formatting in the process. Because the preview updates on every keystroke using the same GitHub-flavored Markdown rules that most tools that consume your Markdown expect (tables, fenced code blocks, task lists), what you see in the preview pane is a close match for how the text will actually render wherever you paste it.",
    examples: [
      {
        title: 'Source',
        language: 'markdown',
        code: `## Setup

1. Clone the repo
2. Run \`npm install\`
3. Copy \`.env.example\` to \`.env\`

| Command | Purpose |
|---|---|
| \`npm run dev\` | Start dev server |`,
        note: 'Typed on the left; the rendered heading, numbered list, and table appear on the right as you type.',
      },
      {
        title: 'Task list',
        language: 'markdown',
        code: `- [x] Write the draft
- [ ] Get review
- [ ] Publish`,
        note: 'Checkbox syntax renders as an interactive-looking task list in the preview, matching how GitHub and most trackers display it.',
      },
      {
        title: 'Fenced code block with language',
        language: 'markdown',
        code: '```js\nconst sum = (a, b) => a + b;\n```',
        note: 'Syntax highlighting appears in the preview pane exactly as it will in the destination — useful for checking a code block before pasting it into a PR.',
      },
    ],
    features: [
      'Side-by-side live preview that updates on every keystroke, not on save or export',
      'GitHub-flavored Markdown support — tables, fenced code blocks, task lists — matching how most destinations render it',
      'One-click export to HTML when the draft is ready',
      "Catches formatting mistakes (broken tables, wrong heading level) while you're still writing, not after pasting elsewhere",
    ],
  },
};

export function getToolContent(slug: string): ToolContent | undefined {
  return toolContent[slug];
}
