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

const FIX_BATCH_79: Record<string, FixBatchEntry> = {
  'business-name-generator': {
    description: `A name that sounds perfect is dead on arrival if the matching domain is already registered, and finding that out usually means naming something first, then separately checking a domain registrar, then going back to the drawing board if it's taken, a slow back-and-forth that repeats for every idea worth considering. This tool generates multiple business name ideas and checks domain availability for each one immediately, so a name only gets seriously considered once its matching domain is confirmed as actually available. Useful for brainstorming a batch of name ideas and immediately seeing which ones have an available .com, narrowing down naming options to only the ones that are actually registrable today, or checking a specific name idea's domain availability before getting attached to it.`,
    examples: [
      {
        title: 'Generate names with domain availability included',
        code: `Input: industry: "artisan coffee roaster"\nOutput: "Roast & Ember" - roastandember.com available, "Bean Foundry" - beanfoundry.com taken`,
        note: 'Checks each name idea against domain availability immediately.',
      },
      {
        title: 'Check one specific name idea',
        code: `Input: "Northwind Analytics"\nOutput: northwindanalytics.com available`,
        note: 'Confirms a single name is actually registrable before getting attached to it.',
      },
    ],
  },

  'square-crop': {
    description: `Instagram's grid view crops a non-square photo automatically the moment it's uploaded, cutting off part of the image in whatever way its own algorithm decides rather than the way it was actually composed, which is exactly the kind of unpredictable crop a square photo sidesteps entirely by already being 1:1 before it's ever uploaded. This tool crops any image to a perfect square directly in the browser, with no file ever uploaded to a server, so composition stays under control rather than left to a platform's own auto-crop. Useful for pre-cropping a photo to 1:1 before it goes into an Instagram grid post, preparing a square profile picture for a platform that expects that exact ratio, or making sure a composition looks the way it was intended rather than however an app decides to crop it.`,
    examples: [
      {
        title: 'Pre-crop a photo for an Instagram grid post',
        code: `Input: photo.jpg (1600x1000, landscape)\nOutput: photo-square.jpg (1000x1000)`,
        note: "Composes the square crop directly instead of letting Instagram's auto-crop decide.",
      },
      {
        title: 'Prepare a square profile picture',
        code: `Input: headshot.jpg (1200x1500, portrait)\nOutput: headshot-square.jpg (1200x1200)`,
        note: 'Processes entirely in the browser with no file uploaded to a server.',
      },
    ],
  },

  'hex-to-rgb-new': {
    description: `A HEX value from a design system's style guide is exactly what CSS wants, but a canvas API or a JavaScript color library usually needs the individual red, green, and blue channels as separate numbers between 0 and 255, and turning a solid color into a semi-transparent overlay means adding a fourth alpha value HEX doesn't carry at all. This tool converts a HEX color into its RGB channel values and, with an alpha value added, into RGBA, ready for a canvas call or a color library that expects numeric channels rather than a hex string. Useful for pulling RGB channel values out of a design system's HEX color for a canvas drawing call, turning a solid brand color into a semi-transparent RGBA overlay, or converting a HEX value into the numeric format a JavaScript animation library actually expects.`,
    examples: [
      {
        title: 'Get RGB channels for a canvas call',
        code: `Input: #2563EB\nOutput: rgb(37, 99, 235)`,
        note: 'Splits a HEX value into the numeric channels a canvas API expects.',
      },
      {
        title: 'Add alpha for a semi-transparent overlay',
        code: `Input: #2563EB, alpha: 0.4\nOutput: rgba(37, 99, 235, 0.4)`,
        note: 'Adds the transparency channel HEX alone cannot represent.',
      },
    ],
  },

  'dummy-text-detector': {
    description: `A live website or a printed brochure going out into the world with "Lorem ipsum dolor sit amet" still sitting in a paragraph where real copy was supposed to go is a genuinely common, entirely avoidable mistake, placeholder text left over from an early mockup that nobody swapped out before launch. This tool scans a document for lorem ipsum and other placeholder text patterns, flagging exactly where it was left behind with a suggested removal. Useful for running a final check on a webpage before it goes live to catch any leftover mockup text, scanning a printed design file for placeholder copy before it goes to press, or auditing a document that passed through several hands to confirm no dummy text survived the process.`,
    examples: [
      {
        title: 'Catch leftover placeholder text before launch',
        code: `Input: [homepage draft]\nOutput: "Lorem ipsum dolor sit amet..." found in About section`,
        note: 'Flags mockup text left behind before a page goes live.',
      },
      {
        title: 'Scan a print file before it goes to press',
        code: `Input: [brochure layout text]\nOutput: no placeholder text found`,
        note: 'Confirms a design file is clear before final print production.',
      },
    ],
  },

  'graphql-playground': {
    description: `A REST API has no standard way to describe its own shape, but a GraphQL endpoint typically does, through introspection, which means a client can ask the API itself what queries, types, and fields actually exist and offer real autocomplete against that exact schema rather than a generic syntax highlighter guessing at field names. This tool queries any public GraphQL endpoint with autocomplete built from that endpoint's own introspected schema, along with query history and variable support, rather than treating a GraphQL query as an undifferentiated block of text. Useful for exploring an unfamiliar GraphQL API's available types and fields through its own schema, testing a query with variables against a live endpoint before writing it into actual code, or revisiting a previous query from history instead of retyping it from scratch.`,
    examples: [
      {
        title: 'Autocomplete against a live schema',
        code: `Endpoint: https://api.example.com/graphql\nTyping: query { us...\nSuggestion: user(id: ID!): User`,
        note: "Suggests fields pulled from the endpoint's own introspected schema.",
      },
      {
        title: 'Run a query with variables',
        code: `Query: query($id: ID!) { user(id: $id) { name email } }\nVariables: { "id": "42" }`,
        note: 'Tests a parameterized query against a live endpoint before it ships in code.',
      },
    ],
  },

  'text-statistics-calculator': {
    description: `A tweet, an SMS, an academic essay with a strict minimum, a meta description with a hard character cap, they all come with an actual number to hit, and knowing whether a piece of writing clears or blows past that number means counting characters and words precisely rather than estimating from a glance at the page. This tool breaks text down into exact word count, sentence count, average word length, and a full character-type breakdown, letters, digits, spaces, punctuation counted separately, built around hitting a precise limit rather than judging how easy something is to read. Useful for confirming a meta description actually stays under its character cap before publishing, checking an essay clears a required minimum word count, or getting an exact character breakdown for a field with a strict length limit.`,
    examples: [
      {
        title: 'Confirm a meta description fits its cap',
        code: `Input: [meta description draft]\nOutput: 158 characters (limit: 160)`,
        note: 'Checks an exact character count against a hard limit.',
      },
      {
        title: 'Get a full character-type breakdown',
        code: `Input: "Hello, World! 123"\nOutput: 13 letters, 3 digits, 2 spaces, 2 punctuation marks`,
        note: 'Breaks a string down by character type rather than just a total count.',
      },
    ],
  },

  'word-density-analyzer': {
    description: `A target keyword needs to show up often enough in a page for search engines to register what it's actually about, but past a certain density it starts reading as keyword stuffing, repeated so often it looks engineered for search engines rather than written for an actual reader, and staying inside that middle range means measuring density as an actual percentage rather than guessing at how often is enough. This tool calculates what percentage of a page's total words a target keyword or phrase makes up, flagging density that's crossed from natural into stuffed. Useful for checking a target keyword doesn't exceed a safe density threshold before publishing a page, confirming a keyword actually appears often enough to signal relevance in the first place, or comparing keyword density across a few page drafts before picking which one to publish.`,
    examples: [
      {
        title: "Check a keyword hasn't crossed into stuffing",
        code: `Input: [800-word page], keyword: "email marketing"\nOutput: appears 22 times - 2.75% density (flagged: above safe range)`,
        note: 'Flags a density high enough to read as keyword stuffing.',
      },
      {
        title: 'Confirm a keyword appears often enough',
        code: `Input: [600-word page], keyword: "budget travel"\nOutput: appears 4 times - 0.67% density (below typical relevance range)`,
        note: "Surfaces when a keyword doesn't appear often enough to signal relevance.",
      },
    ],
  },

  'robots-txt-simulator': {
    description: `Checking whether one specific URL is blocked answers a narrow question, but it says nothing about the bigger picture, which pages across an entire site a crawler like Googlebot could actually reach by following links from the homepage outward, and which sections would end up walled off once every robots.txt rule is applied across the whole structure rather than just one path. This tool simulates a crawler walking through an entire site under the current robots.txt rules, mapping out which pages and sections are reachable and which are blocked overall. Useful for seeing the full picture of what a search engine could actually crawl across a site rather than checking one URL at a time, catching a rule that unintentionally walls off an entire section rather than the one page it was meant for, or reviewing a site's overall crawlability before a robots.txt change goes live.`,
    examples: [
      {
        title: 'Map what a crawler can reach site-wide',
        code: `Input: robots.txt + site starting at /\nOutput: 42 pages reachable, /admin/* and /drafts/* blocked`,
        note: 'Shows overall crawlability rather than one URL at a time.',
      },
      {
        title: 'Catch a rule blocking more than intended',
        code: `Input: Disallow: /blog\nOutput: warning - blocks /blog and every page under /blog/*, not just the index`,
        note: 'Surfaces a rule with a wider blast radius than likely intended.',
      },
    ],
  },

  'post-generator': {
    description: `Keeping a content calendar consistent across platforms doesn't mean posting the identical text everywhere, since a LinkedIn audience expects a different tone and length than an Instagram caption or a Twitter post built around the same announcement, and writing each platform's version separately from scratch is slower than adapting one core message into several formats at once. This tool takes a single topic or announcement and generates a version suited to each platform's own conventions, tone, length, and formatting, all from the same underlying message. Useful for turning one product announcement into a LinkedIn post, an Instagram caption, and a Twitter post in one pass, keeping a content calendar's core message consistent while its format shifts per platform, or generating a week's worth of platform-adapted posts around a single theme.`,
    examples: [
      {
        title: 'Adapt one announcement across platforms',
        code: `Input: "we just launched dark mode"\nOutput: LinkedIn: professional announcement, Twitter: short punchy post, Instagram: caption with emoji`,
        note: 'Keeps the core message consistent while format shifts per platform.',
      },
      {
        title: 'Generate a week of posts around one theme',
        code: `Input: theme: "customer success stories"\nOutput: 7 platform-adapted posts, one per day`,
        note: 'Produces a full content calendar batch from a single theme.',
      },
    ],
  },

  'color-contrast-ratio-checker': {
    description: `Knowing a color pairing fails WCAG contrast is only half of what's actually useful, the other half is knowing what to change it to, and a checker that stops at a pass-or-fail verdict leaves picking a replacement color to trial and error rather than offering an actual answer. This tool checks a foreground and background pairing against WCAG AA and AAA thresholds and, when it fails, suggests a specific adjusted color that would pass instead, rather than a verdict alone. Useful for getting a concrete replacement color the moment a current pairing fails AA, choosing between AA and the stricter AAA threshold for a project with a higher accessibility bar, or fixing a failing color pairing directly from the suggestion instead of guessing at a few alternatives by eye.`,
    examples: [
      {
        title: 'Get a passing color suggestion after a failure',
        code: `Input: text #767676, background #FFFFFF\nOutput: 4.5:1 - fails AAA, suggestion: #595959 passes AAA at 7.1:1`,
        note: 'Suggests a specific replacement instead of stopping at a fail verdict.',
      },
      {
        title: 'Compare against the stricter AAA threshold',
        code: `Input: text #2563EB, background #FFFFFF\nOutput: 4.8:1 - passes AA, fails AAA`,
        note: 'Distinguishes between the AA and AAA thresholds for the same pairing.',
      },
    ],
  },
};

export default FIX_BATCH_79;
