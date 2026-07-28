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

const FIX_BATCH_23: Record<string, FixBatchEntry> = {
  'text-to-speech': {
    description: `Reading your own writing silently makes it easy to skip right past an awkward sentence or a typo, since a familiar brain fills in what it expects to see rather than what's actually on the page, but hearing the same text read aloud breaks that pattern and makes clunky phrasing genuinely audible in a way it wasn't visible. This tool converts any text into spoken audio directly in the browser, with voice, speed, and pitch all adjustable, so a draft can be proofread by ear instead of by eye, or a script can be previewed roughly the way it'll sound once actually recorded. Useful for catching an awkward sentence that reads fine silently but sounds wrong out loud, previewing a voiceover script's pacing before recording it for real, or making a piece of text accessible to someone who processes spoken audio more easily than reading.`,
    examples: [
      {
        title: 'Proofread a draft by ear',
        code: `Input: "The the report was finished on time and it it covers all requirements."\nOutput: audio reveals the repeated words immediately`,
        note: 'Repeated words that slip past a silent read become obvious the moment they are heard.',
      },
      {
        title: "Preview a voiceover script's pacing",
        code: `Input: [90-second script], voice: neutral, speed: 1.0x\nOutput: audio playback at roughly the pace the final recording would run`,
        note: 'Gives a rough sense of timing before booking real recording time.',
      },
    ],
  },

  'ping-test': {
    description: `A site that feels slow once could be a one-off blip or a genuine ongoing problem, and telling those two apart from a single request is basically impossible; the difference only shows up by sending several requests over a stretch of time and watching whether the response time stays consistent or spikes intermittently. This tool pings a host repeatedly and tracks response time across that whole run rather than a single check, so an intermittent slowdown, a server that's fine nineteen times out of twenty and inexplicably slow on the twentieth, actually becomes visible instead of getting lost in one good-looking result. Useful for confirming whether a site being slow right now is a brief fluke or an ongoing pattern, or ruling out your own connection as the source of a problem before assuming a server issue.`,
    examples: [
      {
        title: 'Spot an intermittent slowdown',
        code: `Input: example.com, 20 requests over 2 minutes\nOutput: 18 requests ~40ms, 2 requests ~900ms`,
        note: 'A single request would likely have landed on one of the fast results and missed the pattern.',
      },
      {
        title: 'Rule out your own connection',
        code: `Input: example.com and a known-reliable site, same network\nOutput: both show elevated response times`,
        note: 'A slowdown affecting both sites points to your connection rather than one specific server.',
      },
    ],
  },

  'shell-command-generator-new': {
    description: `Knowing exactly what you want a command to do, find every file modified in the last day and archive them, doesn't mean remembering the specific flag combination that actually does it, especially across shells that don't all agree on syntax, a for-loop in fish doesn't look anything like one in bash, and zsh has its own quirks layered on top of bash's. This tool takes a plain English description of a task and generates the actual command for whichever shell it's needed in, bash, zsh, or fish, rather than requiring the exact flags and syntax to already be known. Useful for translating a task you know how to describe but not how to type into the right command, or getting the fish-shell equivalent of a command you already know in bash without learning fish's syntax from scratch.`,
    examples: [
      {
        title: 'Generate a bash command from a plain description',
        code: `Input: "find files modified in the last 24 hours and archive them"\nOutput: find . -mtime -1 -print0 | tar -czvf recent.tar.gz --null -T -`,
        note: 'Produces the actual flag combination instead of requiring it to already be known.',
      },
      {
        title: 'Get the fish-shell equivalent of a bash command',
        code: `Input: "set an environment variable in fish"\nOutput: set -x MY_VAR "value"`,
        note: "Fish's syntax for variables differs enough from bash that a direct translation isn't obvious.",
      },
    ],
  },

  'heic-to-png': {
    description: `Plenty of photo editing software and design tool plugins were built before HEIC existed and simply don't recognize it as an input format, which becomes a real blocker the moment an iPhone photo needs to go into an editor, a compositing tool, or a design file that only reads more established formats. This tool converts HEIC into PNG specifically, keeping full image quality and any transparency the file carries, rather than JPEG, which would flatten transparency and add its own compression on top. Useful for bringing an iPhone photo into an editing tool that doesn't read HEIC at all, layering an image with a transparent region into a design file, or getting a HEIC photo into the one format almost every piece of creative software already knows how to open.`,
    examples: [
      {
        title: 'Import an iPhone photo into an editor that rejects HEIC',
        code: `Input: photo.heic\nOutput: photo.png (opens in editors with no native HEIC support)`,
        note: 'Many editing tools and plugins were built before HEIC existed as a format.',
      },
      {
        title: 'Preserve a transparent region for a design file',
        code: `Input: sticker-edit.heic (transparent background)\nOutput: sticker-edit.png (transparency intact)`,
        note: 'Keeps transparency intact, unlike converting to JPEG which would flatten it.',
      },
    ],
  },

  'regex-description-generator': {
    description: `Inheriting a regex from an old codebase, or finding one buried in someone else's script with no comment explaining it, means either parsing the character classes and quantifiers by hand or just trusting it works without actually knowing what it matches, neither of which is a comfortable position when that pattern is about to get modified. This tool goes the opposite direction from writing a pattern: paste in an existing regex and get back a plain English explanation of what it actually matches, piece by piece rather than a single vague summary. Useful for understanding an unfamiliar pattern before changing it, documenting what a regex in a codebase actually does for the next person who finds it, or double-checking that a pattern you wrote yourself does what you meant it to.`,
    examples: [
      {
        title: 'Understand an inherited regex before modifying it',
        code: `Input: ^(?=.*[A-Z])(?=.*\\d).{8,}$\nOutput: "Requires at least 8 characters, containing at least one uppercase letter and at least one digit."`,
        note: 'Breaks a dense pattern into the specific rules it actually enforces.',
      },
      {
        title: 'Document a pattern for the next person who finds it',
        code: `Input: ^\\+?[1-9]\\d{1,14}$\nOutput: "Matches an optional leading plus sign, followed by 2 to 15 digits, the first of which is not zero."`,
        note: 'Turns an unlabeled pattern into a plain-language comment worth keeping in the code.',
      },
    ],
  },

  'post-rewriter': {
    description: `A post that performed well six months ago is still a good post, the problem with reposting it verbatim is that anyone who follows closely will recognize it immediately as a repeat, which reads as either lazy or like the account ran out of new things to say. This tool reworks an existing post into a fresh version that carries the same core message with different wording and structure, close enough to keep whatever made the original work, different enough that it doesn't read as a copy-paste repost. Useful for recycling a piece of evergreen content that's worth resurfacing without it looking identical to the original, refreshing a post that underperformed the first time with a different angle, or getting more mileage out of content that took real effort to originally write.`,
    examples: [
      {
        title: 'Repost a well-performing post with a fresh angle',
        code: `Input: "5 tips for better sleep" (posted 6 months ago)\nOutput: "Struggling to fall asleep? Here's what actually works." (same 5 tips, reworded)`,
        note: 'Keeps the core message while avoiding an obvious copy-paste repeat.',
      },
      {
        title: 'Refresh an underperforming post',
        code: `Input: original post (low engagement)\nOutput: rewritten version with a different opening hook and structure`,
        note: 'Gives a second try at the same message with a different entry point.',
      },
    ],
  },

  'color-shade-tints': {
    description: `Tints, shades, and tones aren't three names for the same operation, they're three genuinely different moves: a tint mixes a color with white to make it lighter, a shade mixes it with black to make it darker, and a tone mixes it with gray, which mutes and desaturates the color without necessarily making it lighter or darker at all, a distinct, dusty-looking result the other two don't produce. This tool generates all three separately from one base color, rather than blending them into a single generic scale, so a design system gets an actual lighter tint, an actual darker shade, and an actual muted tone to choose from individually. Useful for picking a genuinely muted, toned-down version of a brand color for a subtle background, rather than settling for a lighter tint when a desaturated tone is what the design actually calls for.`,
    examples: [
      {
        title: 'Generate a tint, a shade, and a tone from one color',
        code: `Input: #2563EB\nTint: #A9C6F7 (mixed with white)\nShade: #163A73 (mixed with black)\nTone: #6E7B94 (mixed with gray)`,
        note: 'Produces three distinct results instead of one blended scale.',
      },
      {
        title: 'Pick a muted tone for a subtle background',
        code: `Input: #DC2626, tone: 40% gray\nOutput: #A16A6A`,
        note: 'A tone desaturates the color rather than just lightening or darkening it.',
      },
    ],
  },

  'json-path-evaluator-express': {
    description: `Pulling one value, or every value matching a pattern, out of a deeply nested JSON structure by hand means walking through brackets and keys manually until landing on the right spot, which gets old fast once the JSON is more than a couple of levels deep. JSONPath solves that the way XPath does for XML, a query syntax that can point directly at a nested field or match every element fitting a pattern across a structure in one expression. This tool evaluates a JSONPath expression against real JSON data and returns exactly the matched nodes, so a query can be tested and refined against actual data before it goes into an application that depends on it. Useful for building a JSONPath filter for an API or config tool that accepts one, or extracting a set of values from a large response without writing custom code just to dig them out.`,
    examples: [
      {
        title: 'Extract a nested value from a large response',
        code: `Input: {"store": {"books": [{"title": "A"}, {"title": "B"}]}}\nQuery: $.store.books[*].title\nOutput: ["A", "B"]`,
        note: 'Matches every title across the array in one expression instead of manual traversal.',
      },
      {
        title: 'Filter matches by a condition',
        code: `Query: $.store.books[?(@.price < 20)].title\nOutput: titles of books priced under 20`,
        note: 'Applies a filter condition directly inside the JSONPath expression.',
      },
    ],
  },

  'age-calculator': {
    description: `Age looks like simple subtraction until you actually try to calculate it exactly, since months have different lengths, leap years add a day every four years except when they don't, and someone born on February 29th technically only has a birthday in years divisible by four, all of which makes a hand calculation of exact age in years, months, and days genuinely error-prone rather than the trivial math it looks like at a glance. This tool calculates exact age from a birth date down to the day, along with the total number of days lived, accounting for those calendar irregularities automatically rather than approximating with a rough thirty-day month. Useful for confirming an exact age against a legal or eligibility cutoff where the precise date matters, or satisfying curiosity about exactly how many days you've actually been alive.`,
    examples: [
      {
        title: 'Calculate exact age including leap year handling',
        code: `Input: birth date: 2000-02-29\nOutput: as of 2026-07-27: 26 years, 4 months, 28 days`,
        note: 'Correctly handles a February 29th birth date across non-leap years.',
      },
      {
        title: 'Get total days lived',
        code: `Input: birth date: 1995-03-14\nOutput: 11,458 days as of today`,
        note: 'Accounts for variable month lengths and leap years rather than approximating.',
      },
    ],
  },

  'pixel-density-calculator': {
    description: `PPI and DPI get used interchangeably in casual conversation, but they're not quite the same thing: PPI describes pixels per inch on a digital display or an image file, while DPI is technically a printing term for how many dots of ink a printer physically lays down, and confusing the two is how a photo that looks perfectly sharp on a screen turns out blurry and pixelated once printed at a larger physical size. This tool calculates PPI and DPI together for an image at different dimensions and print sizes, showing whether a file actually has enough resolution to print cleanly at the size intended rather than just assuming it does. Useful for checking before sending a file to a print shop whether a web-sized image will hold up enlarged to an 8x10 print, or figuring out the maximum size an image can be printed at before quality visibly suffers.`,
    examples: [
      {
        title: 'Check if an image will print sharp at a given size',
        code: `Input: 1200x800px image, print size: 8in x 5.3in\nOutput: 150 PPI (sharp for print)`,
        note: 'Confirms resolution before sending a file to a print shop.',
      },
      {
        title: 'Find the maximum print size for acceptable quality',
        code: `Input: 1200x800px image, target: 300 PPI\nOutput: maximum print size: 4in x 2.7in`,
        note: 'Shows the largest size the file supports before quality visibly degrades.',
      },
    ],
  },
};

export default FIX_BATCH_23;
