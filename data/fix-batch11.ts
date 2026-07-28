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

const FIX_BATCH_11: Record<string, FixBatchEntry> = {
  'press-release-generator': {
    description: `A press release has a specific shape that's different from ordinary marketing copy, built for a journalist skimming it in ten seconds: the most newsworthy fact goes in the first sentence, not built up to gradually, followed by supporting details, at least one quote attributed to a named person at the company, and a standard "About" boilerplate paragraph at the very end describing the company for anyone unfamiliar with it. This tool builds that exact structure from a few basics: what's being announced, who's quoted, and what the company does, arranging it the way a wire service or a reporter's inbox actually expects a release to look, dateline formatting included. Useful for announcing a product launch, a funding round, or a leadership hire in a format editors recognize immediately, rather than something that reads like a blog post pretending to be news.`,
    examples: [
      {
        title: 'Announce a funding round',
        code: `Input: announcement: "$12M Series A", quote from: CEO Maria Chen, company: "Widgetly"\nOutput: dateline + lead paragraph + CEO quote + "About Widgetly" boilerplate`,
        note: 'Leads with the funding amount immediately instead of building up to it.',
      },
      {
        title: 'Announce a product launch',
        code: `Input: announcement: "launch of Widgetly Pro", quote from: Head of Product\nOutput: headline + lead paragraph + product quote + boilerplate + media contact line`,
        note: 'Follows the exact structure editors expect, including a media contact for follow-up questions.',
      },
    ],
  },

  'homophone-checker': {
    description: `A spell checker has nothing to say about writing "their going to the store" because every word in that sentence is spelled correctly, "their" just isn't the right word for this particular spot. Homophone mistakes slip past spell check for exactly that reason: the word chosen is real, just wrong for the context, which is a different kind of error than a typo. This tool scans specifically for that pattern, there versus their versus they're, its versus it's, your versus you're, and flags each instance based on how the surrounding sentence is actually being used, then suggests the version that fits. Useful for catching the kind of mistake that survives a normal spell check untouched, in an email, an essay, or anything else where a homophone slip would otherwise read as a careless error to anyone who notices it.`,
    examples: [
      {
        title: "Catch a their/there/they're mix-up",
        code: `Input: "Their going to the store to get they're groceries."\nFlagged: "Their" -> "They're", "they're" -> "their"`,
        note: 'Both words are spelled correctly on their own, so a spell checker would miss this entirely.',
      },
      {
        title: "Catch an its/it's error",
        code: `Input: "The company updated it's policy last week."\nFlagged: "it's" -> "its"`,
        note: 'Suggests the possessive form based on how the word functions in the sentence.',
      },
    ],
  },

  'word-frequency-table': {
    description: `A word count gives you one number for an entire document; this breaks that down into every individual word and exactly how many times each one shows up, sorted from most to least frequent. That level of detail catches things a single total never would: a word repeated a dozen times across a draft without the writer noticing, a keyword that's either underused or stuffed too heavily for an SEO-focused page, or which specific terms actually dominate a speech or transcript once filler words are set aside. Paste in any block of text and get back a ranked table instead of a single summary number. Useful for tightening a draft that leans too hard on the same handful of words, checking keyword density before publishing a page, or analyzing a transcript to see which topics actually came up most often.`,
    examples: [
      {
        title: 'Find an overused word in a draft',
        code: `Input: [2000-word essay draft]\nOutput: "actually" (14), "however" (11), "important" (9)`,
        note: 'Surfaces words repeated often enough to be distracting but easy to miss while writing.',
      },
      {
        title: 'Check keyword density on a page',
        code: `Input: [blog post about "meal prep"]\nOutput: "meal" (22), "prep" (19), "recipe" (8)`,
        note: 'Confirms a target keyword appears often enough without looking stuffed.',
      },
    ],
  },

  'ai-twitter-generator': {
    description: `A single tweet and a thread are actually two different writing problems: one is compressing an idea into 280 characters without losing the point, the other is pacing a longer idea across a numbered sequence of posts that each need to stand on their own while still pulling a reader to the next one. This tool handles both: give it a topic and it either writes a single sharp tweet, or breaks a bigger idea into a thread with a hook opening post designed to earn a tap on "show more," followed by connected tweets that build the argument one piece at a time. Useful for turning a blog post's core idea into a shareable single tweet, or expanding a longer thought into a full thread without losing readers three posts in because the pacing dragged.`,
    examples: [
      {
        title: 'Write a single sharp tweet',
        code: `Input: topic: "why most to-do lists fail"\nOutput: "Most to-do lists fail because they mix urgent and important. Split them."`,
        note: 'Compresses one idea into a single tweet instead of a multi-post thread.',
      },
      {
        title: 'Build a 5-tweet thread from a blog post',
        code: `Input: blog post: "5 lessons from bootstrapping a SaaS"\nOutput: hook tweet + 4 connected tweets, each building on the last`,
        note: 'Paces one idea across several posts instead of cramming it into a single tweet.',
      },
    ],
  },

  'humanizer-ai': {
    description: `AI-generated drafts tend to share a specific set of tells: the same handful of transition phrases, a uniform sentence rhythm with little variation in length, and a habit of restating the obvious in slightly more words than a person would bother with. This tool rewrites that kind of text to remove those patterns, varying sentence length and structure, swapping generic phrasing for more direct wording, and cutting the filler that pads out a drafted paragraph without adding anything. The goal is a version that reads like a person actually wrote and edited it themselves, not a first draft that still carries the fingerprints of however it was generated. Useful for taking a rough AI-assisted first draft of a blog post or marketing email and reworking it into something that sounds like your own voice before it goes out under your name.`,
    examples: [
      {
        title: 'Vary a flat, uniform paragraph',
        code: `Input: "The product offers many benefits. The product is easy to use. The product saves time for users."\nOutput: "The product saves time and stays easy to use, with benefits that add up the more you rely on it."`,
        note: 'Breaks up the repeated sentence structure and combines ideas the way a person naturally would.',
      },
      {
        title: 'Cut filler from a drafted paragraph',
        code: `Input: "It is important to note that the update improves performance significantly."\nOutput: "The update makes things noticeably faster."`,
        note: 'Removes hedging phrases and restates the point more directly.',
      },
    ],
  },

  'grammar-score-checker': {
    description: `A list of grammar errors tells you what's wrong but not how bad the overall draft actually is, whether it's a couple of small slips away from ready or riddled with problems that need a full rewrite. This tool adds that missing piece: a single quality score alongside the specific issues behind it, subject-verb mismatches, run-on sentences, wrong word forms, misplaced commas, so there's a quick answer to whether something is ready before digging into every individual flag. It's aimed at the moment right before something gets submitted or sent: a student checking an essay before the deadline, a non-native speaker double-checking a formal email reads correctly, anyone who wants a number to compare against rather than just a wall of red underlines with no sense of overall severity. Paste in a draft, see the score and the specific fixes behind it, and decide whether it needs another pass.`,
    examples: [
      {
        title: 'Check an essay excerpt before a deadline',
        code: `Input: "The experiment show that most of the students prefer studying at night."\nScore: 68/100\nIssue: subject-verb agreement ("show" -> "shows")`,
        note: 'Gives a single readiness number instead of just a list of flagged issues.',
      },
      {
        title: 'Double-check a formal email before sending',
        code: `Input: "I am writing to inform you that the report have been completed."\nScore: 74/100\nIssue: subject-verb agreement ("have" -> "has")`,
        note: 'Useful for a non-native speaker wanting a quick confidence check before sending.',
      },
    ],
  },

  'data-uri-generator': {
    description: `A data URI packs an entire file's content directly into a string, which means a browser doesn't need a separate request to fetch it, the image or font is just sitting inline in the HTML, CSS, or XML that references it. This tool takes a file, or plain text, and encodes it into that format: base64 for binary content like an image or a font, ready to drop straight into an img tag's src attribute or a CSS background-image property. It's a good fit for small, frequently used assets, a tiny icon, a single custom font, a small SVG, where skipping an extra HTTP request actually matters and the size increase from encoding, usually around a third larger than the original file, stays negligible. Not the right move for a large photo, where that size penalty would outweigh whatever request it saved.`,
    examples: [
      {
        title: 'Inline a small icon in CSS',
        code: `Input: icon.png (1.2 KB)\nOutput: background-image: url("data:image/png;base64,iVBORw0KGgoAAAANS...");`,
        note: 'Skips a separate HTTP request for a small, frequently used icon.',
      },
      {
        title: 'Embed a font directly in a stylesheet',
        code: `Input: custom-font.woff2\nOutput: @font-face { src: url("data:font/woff2;base64,d09GMgABAAAAA...") format("woff2"); }`,
        note: 'Keeps a single custom font self-contained inside the CSS file itself.',
      },
    ],
  },

  'csv-to-json': {
    description: `A basic CSV-to-JSON conversion just turns each column into a flat key with whatever text was in the cell, which becomes awkward the moment a spreadsheet uses dotted column names like address.city and address.zip to represent what's really a nested object, or a numeric column that should stay a number instead of becoming a quoted string. This tool handles both specifically: a dotted column name gets converted into an actual nested object instead of a flat key with a literal dot in the name, and values get type-inferred, so a column of prices becomes real numbers, a column of yes-or-no values becomes real booleans, rather than everything staying a string a downstream script then has to parse itself. Paste in a CSV export from a spreadsheet and get back JSON shaped closer to how the data should actually be structured, not just a restating of the flat rows.`,
    examples: [
      {
        title: 'Convert dotted columns into a nested object',
        code: `Input CSV: name,address.city,address.zip\nAlice,Boston,02108\nOutput: [{ "name": "Alice", "address": { "city": "Boston", "zip": "02108" } }]`,
        note: 'Builds an actual nested object instead of a flat key containing a literal dot.',
      },
      {
        title: 'Infer real types instead of leaving everything as strings',
        code: `Input CSV: item,price,in_stock\nWidget,19.99,true\nOutput: [{ "item": "Widget", "price": 19.99, "in_stock": true }]`,
        note: 'Converts numeric and boolean-looking values into their actual JSON types.',
      },
    ],
  },

  'html-plaintext-express': {
    description: `Some destinations for text don't want paragraph breaks preserved at all, they want one clean, continuous line: an SMS message, a push notification, a search index's preview snippet, a plain-text database field that expects a single value rather than something formatted for reading. This tool strips HTML tags and collapses whatever whitespace and line breaks were sitting in the source into clean, normalized spacing, rather than trying to preserve the original document's paragraph structure. Feed it a chunk of scraped HTML or a page's body content, and get back compact plain text sized and shaped for a destination with a strict character limit or one that simply can't render multiple lines. Useful for turning a blog post's opening paragraph into a notification preview, or preparing scraped content for a search index field that expects one flat string instead of a formatted document.`,
    examples: [
      {
        title: 'Turn a blog excerpt into a notification preview',
        code: `Input: <h2>New Feature</h2><p>We just shipped   dark mode.\\n\\nTry it now.</p>\nOutput: "New Feature We just shipped dark mode. Try it now."`,
        note: 'Collapses headings, extra spaces, and line breaks into one clean line for a notification.',
      },
      {
        title: 'Prepare scraped content for a search index field',
        code: `Input: <div>Product   description\\n\\nwith  extra   spacing</div>\nOutput: "Product description with extra spacing"`,
        note: 'Normalizes irregular whitespace instead of preserving the original layout.',
      },
    ],
  },

  'jwt-token-tester': {
    description: `Decoding a JWT's payload without checking the signature tells you what a token claims, but not whether it's actually valid, and those are two very different questions when you're the one issuing or validating tokens for your own system. This tool does the second one: paste in a token along with the secret, for HMAC algorithms, or the public key, for RSA or ECDSA, and it verifies whether the signature genuinely matches, rather than just displaying the decoded payload as if it were automatically trustworthy. That catches a wrong signing secret, a token signed with a different algorithm than expected, or a payload tampered with after signing. Useful for confirming your own authentication system issues and validates tokens correctly, or debugging why a legitimate-looking token is being rejected somewhere in a verification pipeline.`,
    examples: [
      {
        title: 'Verify a token signed with an HMAC secret',
        code: `Input: token: eyJhbGciOiJIUzI1NiJ9..., secret: "my-signing-secret"\nOutput: signature valid: true`,
        note: 'Confirms the token was actually signed with this exact secret, not just decoded.',
      },
      {
        title: 'Catch a token signed with the wrong key',
        code: `Input: token: [RS256-signed token], public key: [mismatched key]\nOutput: signature valid: false`,
        note: 'Flags a genuine verification failure instead of just showing the payload as if it were trustworthy.',
      },
    ],
  },
};

export default FIX_BATCH_11;
