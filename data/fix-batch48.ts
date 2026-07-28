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

const FIX_BATCH_48: Record<string, FixBatchEntry> = {
  'jsonpath-query-tool': {
    description: `A deeply nested JSON response might bury the one field actually needed several levels down inside arrays and objects, and scrolling through a formatted tree to find it by eye works for a small file but breaks down once a response runs into hundreds of lines. JSONPath solves that with a query syntax built specifically for JSON, something like $.store.book[*].author pulls out every author across an entire array in one expression rather than manually tracing each branch. This tool runs a JSONPath query against pasted JSON and highlights every match instantly, letting an expression be tested and refined before it ends up in actual code. Useful for pulling one specific nested value out of a large API response without writing a script, testing a JSONPath expression before dropping it into an application, or exploring an unfamiliar JSON structure by querying pieces of it directly instead of reading the whole tree.`,
    examples: [
      {
        title: 'Extract every author from a nested array',
        code: `Input JSON: { "store": { "book": [{ "author": "Rowling" }, { "author": "Tolkien" }] } }\nQuery: $.store.book[*].author\nOutput: ["Rowling", "Tolkien"]`,
        note: 'Pulls a value out of every array item in one query instead of tracing each branch manually.',
      },
      {
        title: 'Query a deeply nested field',
        code: `Query: $.data.user.address.city\nOutput: "Austin"`,
        note: 'Reaches straight into a specific field without reading the whole tree.',
      },
    ],
  },

  summarizer: {
    description: `A ten-page report or a long article buries its actual conclusion somewhere inside paragraphs of supporting detail, and deciding whether it's worth reading in full often takes almost as long as reading it would, particularly when only the main takeaway is actually needed right now. This tool reads through a pasted article, document, or block of text and returns the key points condensed into a short summary, cutting straight to what the piece is actually arguing or reporting rather than requiring every paragraph to be read start to finish. Useful for deciding whether a long article is worth reading in full before committing the time, condensing a lengthy report into a few sentences for a meeting recap, or getting the gist of a document quickly before diving into specific sections that actually matter.`,
    examples: [
      {
        title: 'Condense a long article',
        code: `Input: [1,200-word article on remote work trends]\nOutput: "Remote work adoption has plateaued as companies shift toward hybrid models, driven mainly by real estate costs rather than employee preference."`,
        note: 'Returns the core takeaway in a few sentences instead of the full article.',
      },
      {
        title: 'Summarize a report for a meeting',
        code: `Input: [8-page quarterly report]\nOutput: 3-sentence summary highlighting revenue growth, the main risk flagged, and the recommended next step`,
        note: 'Gives a quick recap without requiring every page to be read.',
      },
    ],
  },

  'tiktok-script-writer': {
    description: `A TikTok script lives or dies in its first couple of seconds, unlike a blog outline or a longer YouTube script, since a viewer scrolling past decides almost instantly whether to keep watching, which means the opening hook, the middle content, and the closing call-to-action all need a different rhythm than a longer format actually allows for. This tool generates a script structured specifically for short-form video, an attention-grabbing hook up front, body content that delivers on what the hook promised, and a clear call-to-action at the close, rather than a generic outline that ignores how short-form attention spans actually work. Useful for drafting a fast first pass before filming instead of staring at a blank page, generating a hook variation to test against an existing script, or structuring a product or idea pitch specifically for a short vertical video format.`,
    examples: [
      {
        title: 'Generate a hook-body-CTA script',
        code: `Input: topic: "budget meal prepping"\nOutput:\nHook: "I fed myself for $30 this whole week."\nBody: [steps and ingredients]\nCTA: "Follow for the full grocery list."`,
        note: 'Structures the script around the first-two-seconds hook a short video depends on.',
      },
      {
        title: 'Generate a hook variation to test',
        code: `Input: existing script topic: "morning routine"\nOutput: alternate hook: "This 5-minute routine replaced my alarm snooze habit."`,
        note: 'Produces a fresh hook to A/B test against an existing draft.',
      },
    ],
  },

  'api-auth-header-generator': {
    description: `Bearer, Basic, and AWS Signature authentication each expect a completely different header format, Bearer just needs a token appended after a keyword, Basic needs a username and password base64-encoded together, and AWS Signature Version 4 needs a canonical request hashed and signed against a secret key, a process involved enough that getting it wrong by hand is genuinely easy. This tool builds the correct header for whichever scheme an API actually requires, handling the base64 encoding or the AWS signing calculation directly rather than leaving that math to be done manually. Useful for generating a Basic auth header's base64-encoded credentials without a separate tool, formatting a Bearer token header correctly on the first try, or producing an AWS Signature V4 header without implementing the multi-step signing process from scratch.`,
    examples: [
      {
        title: 'Generate a Basic auth header',
        code: `Input: username: admin, password: secret123\nOutput: Authorization: Basic YWRtaW46c2VjcmV0MTIz`,
        note: 'Base64-encodes the credentials automatically.',
      },
      {
        title: 'Generate an AWS Signature V4 header',
        code: `Input: access key, secret key, region: us-east-1, service: s3\nOutput: Authorization: AWS4-HMAC-SHA256 Credential=.../us-east-1/s3/aws4_request, SignedHeaders=..., Signature=...`,
        note: 'Produces the signed header without hand-computing the canonical request hash.',
      },
    ],
  },

  'rgb-to-hex-new': {
    description: `An RGB value with an alpha channel doesn't translate to hex the same way a plain RGB value does, since transparency needs an extra pair of hex digits appended after the usual six, RRGGBBAA instead of just RRGGBB, a detail that's easy to get wrong converting by hand or with a converter that only handles opaque colors. This tool converts both RGB and RGBA values into hex format, showing a live color swatch alongside the result so the actual output can be checked visually rather than trusted blindly. Useful for converting a semi-transparent RGBA value into its 8-digit hex equivalent for CSS, checking a converted color against a live preview before using it in a design file, or translating a color picked from an image editor's RGB sliders into the hex format a stylesheet actually needs.`,
    examples: [
      {
        title: 'Convert RGBA with transparency',
        code: `Input: rgba(220, 20, 60, 0.5)\nOutput: #DC143C80`,
        note: 'Appends the alpha channel as the extra two hex digits.',
      },
      {
        title: 'Convert a plain RGB value',
        code: `Input: rgb(64, 224, 208)\nOutput: #40E0D0`,
        note: 'Shows a live swatch alongside the converted value.',
      },
    ],
  },

  'json-schema-validator': {
    description: `Writing a schema and generating one from sample data are both just the setup, the actual question that matters day to day is whether a specific piece of JSON, an API payload, a config file, actually conforms to that schema, and a generic parse error doesn't say which field broke the rule or why. This tool validates JSON against a schema and returns a detailed error for each violation, naming the exact field and the exact rule it failed rather than a single generic failure message. Useful for confirming an API response actually matches its documented schema before trusting it in production, catching exactly which field in a config file violates a required type or pattern, or checking a payload against a schema during development before it ever reaches a real integration test.`,
    examples: [
      {
        title: 'Catch a specific field violation',
        code: `Schema requires: "age": { "type": "integer", "minimum": 0 }\nInput: { "age": -5 }\nOutput: error at "age" - value must be >= 0`,
        note: 'Names the exact field and rule that failed instead of a generic parse error.',
      },
      {
        title: 'Validate an API response against its schema',
        code: `Input: API response + schema.json\nOutput: valid - all 12 required fields present and correctly typed`,
        note: 'Confirms a response actually matches what was documented.',
      },
    ],
  },

  'smart-text-sorter': {
    description: `Alphabetical order works for a list of names but puts "10" before "9" and treats a long line the same as a short one, which means a list of scores, file paths, or log lines often needs sorting by an entirely different rule depending on what's actually being looked at. This tool sorts a list of text lines alphabetically, by length, numerically, or into random order, picking whichever rule actually fits the data instead of forcing every list through the same alphabetical pass. Useful for sorting a list of numeric scores in actual numeric order instead of alphabetical, arranging file paths or log lines by length to spot an unusually long outlier, or shuffling a list of names into random order for a randomized drawing or a raffle.`,
    examples: [
      {
        title: 'Sort scores numerically',
        code: `Input: 9, 10, 2, 33\nAlphabetical: 10, 2, 33, 9\nNumeric: 2, 9, 10, 33`,
        note: 'Numeric mode avoids the "10 before 9" problem of plain alphabetical sort.',
      },
      {
        title: 'Sort lines by length to spot outliers',
        code: `Input: [short paths and one unusually long one]\nOutput: sorted shortest to longest, longest line at the bottom`,
        note: 'Surfaces an unusually long log line or file path immediately.',
      },
    ],
  },

  'cron-generator': {
    description: `Writing a cron expression from scratch means getting five fields of minutes, hours, days, months, and weekdays exactly right without a typo, which is a different problem than checking whether an expression someone already wrote is valid, this is about building a schedule visually from nothing rather than validating one that already exists. This tool builds a cron expression through point-and-click controls instead of typing the syntax directly, showing a human-readable preview and the next five run times as each setting changes, so an expression can be confirmed correct before it's ever saved into a config file. Useful for building a new scheduled job's cron expression without memorizing field order, confirming a schedule's next several run times visually before deploying it, or constructing a recurring schedule for someone unfamiliar with cron syntax at all.`,
    examples: [
      {
        title: 'Build a schedule visually',
        code: `Selections: every 15 minutes, weekdays only\nGenerated expression: */15 * * * 1-5\nPreview: "every 15 minutes, Monday through Friday"`,
        note: 'Builds the expression from point-and-click controls instead of typed syntax.',
      },
      {
        title: 'Preview the next run times',
        code: `Expression: 0 9 1 * *\nNext 5 runs: Aug 1 09:00, Sep 1 09:00, Oct 1 09:00, Nov 1 09:00, Dec 1 09:00`,
        note: 'Confirms the schedule behaves as intended before saving it.',
      },
    ],
  },

  'hex-to-named-color': {
    description: `A hex code like #DC143C communicates nothing on its own to someone reading it in a design spec or a code review, while the actual name crimson does, which is exactly the gap between a color a program can render precisely and a color a person can picture and discuss without pulling up a swatch. This tool converts a hex code into the nearest CSS named color, crimson, turquoise, ivory, and hundreds of others, translating a numeric value into a word an actual person recognizes. Useful for writing more readable CSS with a named color instead of a hex string wherever precision doesn't actually matter, describing a color verbally in a design handoff document without attaching a swatch, or figuring out what an unfamiliar hex value from an old stylesheet is actually supposed to look like.`,
    examples: [
      {
        title: 'Find the nearest named color',
        code: `Input: #DC143C\nOutput: crimson (exact match)`,
        note: 'Translates a hex value into a name a person actually recognizes.',
      },
      {
        title: 'Get the closest name for an unusual shade',
        code: `Input: #FFFFF0\nOutput: ivory (exact match)`,
        note: 'Works even for less common CSS color names.',
      },
    ],
  },

  'random-sentence-generator': {
    description: `A pangram tests a font and lorem ipsum fills a mockup, but a typing exercise, a grammar drill, or an ESL practice worksheet needs something different, individual sentences that are complete, grammatically sound, and actually mean something rather than either a Latin filler block or an alphabet-covering exercise sentence. This tool generates single, complete, meaningful sentences one at a time, built for practice and placeholder use where a full paragraph would be too much and a nonsense phrase wouldn't hold up under scrutiny. Useful for a typing practice tool that needs a fresh sentence to type out each round, a grammar or ESL worksheet needing sample sentences that actually read naturally, or a single placeholder line of text where an entire paragraph would be more filler than the layout actually calls for.`,
    examples: [
      {
        title: 'Generate a sentence for typing practice',
        code: `Output: "The museum extended its hours during the summer festival."`,
        note: 'A complete, meaningful sentence rather than lorem ipsum or a pangram.',
      },
      {
        title: 'Generate a sample sentence for a grammar worksheet',
        code: `Output: "She had already finished her homework before dinner."`,
        note: 'Grammatically complete and natural, suited to language practice exercises.',
      },
    ],
  },
};

export default FIX_BATCH_48;
