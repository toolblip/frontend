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

const FIX_BATCH_13: Record<string, FixBatchEntry> = {
  'xml-formatter': {
    description: `XML doesn't have the visual shorthand JSON does, no square brackets marking an array, no obviously matched curly braces, just opening and closing tags that can nest many levels deep with namespaces and attributes adding extra noise to every line. Squeezed onto one line or exported without indentation, figuring out which closing tag actually matches which opener becomes real work rather than something the eye picks up automatically. This tool reformats XML with proper nested indentation, applies syntax highlighting so tags, attributes, and text content are visually distinct, and flags structural problems like an unclosed tag or a mismatched namespace prefix. Paste in a minified XML export or an API response and get back something a person can actually scan top to bottom, plus an early warning if the document isn't well-formed to begin with rather than finding out from a parser error somewhere downstream.`,
    examples: [
      {
        title: 'Format a minified API response',
        code: `Input: <root><item id="1"><name>Widget</name></item></root>\nOutput:\n<root>\n  <item id="1">\n    <name>Widget</name>\n  </item>\n</root>`,
        note: 'Makes nested tag structure visible instead of one unbroken line.',
      },
      {
        title: 'Catch an unclosed tag',
        code: `Input: <user><name>Jane</name><email>jane@example.com</user>\nResult: error, <email> tag opened but never closed`,
        note: 'Flags a structural problem before it causes a parser error somewhere downstream.',
      },
    ],
  },

  'color-tint-generator': {
    description: `A single brand color rarely works alone in an actual interface; a button needs a hover state one shade darker, a background needs a version so light it barely reads as colored, a border needs something in between, and building that full ramp by eye tends to produce inconsistent jumps in lightness from one step to the next. This tool builds a complete tonal scale from one starting color instead, a numbered set running from a very light tint down to a very dark shade, similar to how a framework like Tailwind structures its color scales, with even, predictable steps between each one. Useful for turning a single brand color into a full set ready to drop into a design system, so a hover state, a subtle background tint, and a high-contrast text color all come from the same coherent scale instead of being picked separately by eye.`,
    examples: [
      {
        title: 'Build a full tonal scale from a brand color',
        code: `Input: #2563EB\nOutput: 50: #EFF6FF, 100: #DBEAFE, 300: #93C5FD, 500: #2563EB, 700: #1D4ED8, 900: #1E3A8A`,
        note: 'Generates evenly spaced steps rather than a few tints picked by eye.',
      },
      {
        title: 'Get a hover-state color for a button',
        code: `Input: #2563EB, step: 700\nOutput: #1D4ED8`,
        note: 'Pulls one specific darker step from the scale for a consistent hover effect.',
      },
    ],
  },

  'content-brief-generator': {
    description: `Handing a writer a topic and nothing else usually means getting back a draft that misses the specific angle you had in mind, covers the obvious points competitors already covered, and runs either way too short or long for what the page actually needs. This tool builds the planning document that closes that gap before anyone starts writing: a target keyword, a recommended word count based on what's already ranking, an outline of suggested headings, and a list of specific questions the piece should answer. It doesn't write the article itself, it produces the brief a writer, whether that's a freelancer, a teammate, or an AI drafting tool, would work from. Useful for a content lead assigning articles without writing every one personally, or for making sure a piece doesn't just repeat what the top-ranking competitor already said.`,
    examples: [
      {
        title: 'Build a brief for a freelance writer',
        code: `Input: topic: "meal prep for beginners"\nOutput: target keyword, 1800-word target, 6-section outline, 4 questions to answer`,
        note: 'Gives a writer a plan to follow instead of just a topic name.',
      },
      {
        title: 'Check word count against top-ranking competitors',
        code: `Input: topic: "how to fix a leaky faucet"\nOutput: top 3 ranking pages average 1400 words, recommended target: 1500-1700`,
        note: 'Bases the target length on what already ranks rather than a guess.',
      },
    ],
  },

  'text-line-deduplicator': {
    description: `Removing duplicates from a list sounds simple until the order those entries appear in actually matters, a chronological log, a sequence of steps, a list where the first occurrence of an item carries meaning that a later repeat doesn't. This tool removes duplicate lines while keeping every remaining line in its original position relative to the others, rather than resorting the list alphabetically or grouping duplicates together the way some deduplication tools do as a side effect. Paste in a list with repeated entries scattered throughout, and get back just the unique lines in the same sequence they first appeared, nothing reordered, nothing alphabetized. Useful for cleaning up a log file where entry order reflects actual chronology, a list of steps where sequence is part of the meaning, or any text where removing repeats can't come at the cost of scrambling what's left.`,
    examples: [
      {
        title: 'Clean a log file without disturbing order',
        code: `Input:\n2026-01-01 login\n2026-01-02 logout\n2026-01-01 login\n2026-01-03 login\nOutput:\n2026-01-01 login\n2026-01-02 logout\n2026-01-03 login`,
        note: 'Keeps the remaining lines in their original chronological order.',
      },
      {
        title: 'Deduplicate a list of steps',
        code: `Input:\nOpen the box\nCheck the contents\nOpen the box\nPlug in the device\nOutput:\nOpen the box\nCheck the contents\nPlug in the device`,
        note: 'Preserves the sequence, which matters when the list represents steps in order.',
      },
    ],
  },

  'website-age-checker': {
    description: `A domain that's been active for over a decade reads very differently to a researcher, an SEO analyst, or anyone vetting a site's legitimacy than one registered last month, even if the current content looks identical. This tool pulls the specific piece of information that answers that question directly: when a domain was first registered, and how long it's actually been active, without needing to dig through a full WHOIS record to find the one date that matters. Useful for a quick credibility check before trusting an unfamiliar site, researching how long a competitor has actually held their domain as part of a competitive analysis, or vetting a potential backlink source where an oddly new domain might be a signal worth noticing before reaching out.`,
    examples: [
      {
        title: "Check a domain's age before trusting a site",
        code: `Input: example-store.com\nOutput: registered: 2011-03-14 (14 years active)`,
        note: 'A domain active for over a decade reads differently than one registered last month.',
      },
      {
        title: "Research a competitor's domain history",
        code: `Input: competitor.com\nOutput: registered: 2019-08-02 (6 years active)`,
        note: 'Useful context when comparing how long competing sites have actually existed.',
      },
    ],
  },

  'email-validator': {
    description: `An email address can look completely correct, right structure, proper @ symbol, a domain that reads like a real one, and still bounce every message sent to it, because syntax alone says nothing about whether that domain actually has a mail server configured to receive anything. This tool checks both layers: the format itself, catching an obviously malformed address before it's even worth sending to, and an MX record lookup against the domain, confirming a real mail server is actually configured to accept messages there. That second check catches the specific case a format-only validator misses entirely, a syntactically perfect address on a domain that's misspelled, expired, or was simply never set up to receive email at all. Useful for cleaning a signup list before a mail campaign, or validating an address the moment someone submits a form.`,
    examples: [
      {
        title: 'Catch a domain with no mail server configured',
        code: `Input: user@typo-domain.con\nOutput: format valid: true | MX record found: false`,
        note: 'Passes basic format checks but fails the deeper check since the domain has no mail server.',
      },
      {
        title: 'Confirm an address is actually deliverable',
        code: `Input: user@company.com\nOutput: format valid: true | MX record found: true (mail.company.com)`,
        note: 'Confirms a real mail server is configured to receive messages at that domain.',
      },
    ],
  },

  'xml-sitemap-generator': {
    description: `A search engine crawler discovers new pages mostly by following links from pages it already knows about, which works fine for a site with tight internal linking but leaves gaps on a large site, or one where a page sits three clicks deep with nothing else linking to it directly. An XML sitemap solves that by handing crawlers an explicit list instead of making them find every URL organically: every page that should be indexed, plus when each one was last updated, in one file a search engine can read directly. This tool builds that file from a site's URL structure, formatted the way Google and other engines expect. Useful for a site with pages that aren't well connected through regular navigation links, or simply for making sure a large site gets crawled and indexed faster than waiting on discovery through links alone.`,
    examples: [
      {
        title: 'Generate a sitemap for a large site',
        code: `Input: 450 URLs from a site crawl\nOutput: sitemap.xml with <loc> and <lastmod> for each URL`,
        note: 'Gives crawlers an explicit list instead of relying on them to discover every page through links.',
      },
      {
        title: 'Highlight recently updated pages',
        code: `Input: /blog/new-post (updated 2026-07-20)\nOutput: <lastmod>2026-07-20</lastmod>`,
        note: 'Signals to crawlers which pages changed recently and may be worth recrawling sooner.',
      },
    ],
  },

  'ai-detector': {
    description: `No detector can say with total certainty that a specific piece of text was or wasn't written by AI, what a tool like this actually measures is a set of statistical patterns, word predictability, sentence structure, vocabulary distribution, that tend to show up more often in AI-generated writing than in most human writing, and reports a likelihood based on that, not a verdict. This tool analyzes a piece of text against those patterns and returns a percentage estimate of how likely it is to be AI-generated, along with which sections scored highest. It's meant as one signal among several, not a final answer: useful for an editor sanity-checking a freelancer's submission, a platform screening content against a disclosure policy, or a teacher looking at a paper alongside other evidence, rather than treating a single score as proof either way.`,
    examples: [
      {
        title: 'Check a freelance submission before payment',
        code: `Input: [1200-word submitted article]\nOutput: 78% likely AI-generated, highest-scoring section: paragraphs 3-5`,
        note: 'Points to specific sections rather than giving one flat score for the whole piece.',
      },
      {
        title: 'Screen content against a disclosure policy',
        code: `Input: [user-submitted blog post]\nOutput: 22% likely AI-generated`,
        note: 'A low score here is treated as one input among several, not a guarantee of human authorship.',
      },
    ],
  },

  'passive-voice-detector': {
    description: `Passive voice isn't a grammar mistake, "the report was reviewed by the committee" is perfectly correct English, it's a style choice that moves the object of an action into the subject position and often makes a sentence longer and vaguer about who actually did something. This tool scans text for that construction specifically and suggests the active version instead, "the committee reviewed the report," which is usually shorter and states directly who performed the action. That distinction matters because passive voice sometimes belongs deliberately, scientific writing often uses it to keep focus on the experiment rather than the researcher, but in most everyday writing it just adds words and hides the actor unnecessarily. Useful for tightening a draft that reads as vague or bureaucratic, or catching passive constructions that crept in without a conscious choice behind them.`,
    examples: [
      {
        title: 'Catch a passive sentence and its active rewrite',
        code: `Input: "The decision was made by the board last week."\nFlagged: passive voice\nSuggestion: "The board made the decision last week."`,
        note: 'The active version is shorter and states directly who made the decision.',
      },
      {
        title: 'Spot passive voice hiding the actor entirely',
        code: `Input: "Mistakes were made during the rollout."\nFlagged: passive voice, actor unclear\nSuggestion: "The team made mistakes during the rollout."`,
        note: "Passive voice here conveniently omits who's actually responsible.",
      },
    ],
  },

  'cron-generator-dg': {
    description: `Cron syntax packs five fields into one line, minute, hour, day of month, month, day of week, and mixing up the order or misunderstanding what a wildcard means in one of those slots is exactly how a job meant to run every five minutes ends up running once a year instead. This tool builds the expression through point-and-click controls rather than hand-typing the syntax: pick a frequency, set specific times or days visually, and watch a human-readable sentence update to confirm the schedule actually says what it's supposed to before it goes anywhere near a real crontab file. Useful for anyone who doesn't work with cron syntax often enough to have it memorized, or for double-checking an existing expression reads the way it was intended before trusting it with a production job.`,
    examples: [
      {
        title: 'Build a schedule for every weekday at 9am',
        code: `Selected: weekdays, 9:00 AM\nOutput: 0 9 * * 1-5\nHuman-readable: "At 9:00 AM, Monday through Friday"`,
        note: 'Confirms the schedule in plain language before it goes into a crontab.',
      },
      {
        title: 'Catch a mistaken "every 5 minutes" expression',
        code: `Input built visually: every 5 minutes\nOutput: */5 * * * *\nHuman-readable: "Every 5 minutes"`,
        note: 'Avoids the common mistake of writing "5 * * * *", which runs once an hour at minute 5, not every 5 minutes.',
      },
    ],
  },
};

export default FIX_BATCH_13;
