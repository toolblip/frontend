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

const FIX_BATCH_47: Record<string, FixBatchEntry> = {
  'csv-generator': {
    description: `Testing a CSV import feature, seeding a demo database, or building a dashboard mockup all need believable tabular data, not necessarily real data, but skip the trouble of typing out rows of columns and values by hand or writing a one-off script just to get some rows in place. This tool takes a header row, the actual column names for a specific dataset, and generates however many rows of realistic sample data are needed to fill them, matching each column's apparent type, a name field gets names, a date field gets dates, rather than the same generic filler value repeated down every row. Useful for populating a CSV import feature with data that actually looks plausible before a real dataset exists, seeding a demo or a staging database with rows that resemble production, or generating a specific row count for a spreadsheet a stakeholder needs to review as a mockup.`,
    examples: [
      {
        title: 'Generate sample rows from a header',
        code: `Input: headers: name, email, signup_date; rows: 5\nOutput:\nname,email,signup_date\nJordan Lee,jordan.lee@example.com,2024-03-11\nPriya Nair,priya.nair@example.com,2024-05-02`,
        note: 'Fills each column with data matching its apparent type instead of one repeated value.',
      },
      {
        title: 'Seed a staging database export',
        code: `Input: headers: product_id, price, in_stock; rows: 100\nOutput: 100 rows of plausible product data as CSV`,
        note: 'Produces a specific row count for testing an import feature or a demo dashboard.',
      },
    ],
  },

  'random-uuid-v7': {
    description: `A regular random UUID inserts into a database index at an unpredictable location every single time, since there's no ordering to the bits at all, which fragments a B-tree index as it grows, UUID v7 fixes that by embedding a timestamp in its leading bits, so newly generated values sort in roughly the same order they were created, inserting near the end of an index much like an auto-incrementing integer id would rather than scattering randomly across it. This tool generates UUID v7 values instantly, time-ordered and still globally unique, suited specifically to database primary keys and distributed systems where insertion order matters for performance. Useful for a primary key that needs to sort by creation time without a separate timestamp column, a distributed system generating unique ids across multiple servers without central coordination, or replacing a v4 UUID where index fragmentation has become a measured problem.`,
    examples: [
      {
        title: 'Generate a time-ordered UUID',
        code: `Output: 018f4d2a-7b3e-7c21-9a4d-3e8f1c9b2a6d`,
        note: 'Leading bits encode the creation timestamp, so values sort in generation order.',
      },
      {
        title: 'Compare insertion order against v4',
        code: `v7 (in order generated): 018f4d2a..., 018f4d2b..., 018f4d2c...\nv4 (same order generated): 7a1f..., 2c9e..., f031...`,
        note: 'v7 values stay sorted by creation time; v4 values scatter randomly across an index.',
      },
    ],
  },

  'page-speed-preview': {
    description: `A single load-time score doesn't say which specific asset is actually responsible for a slow page, a bloated hero image, an unminified script bundle, a font file loading before anything else can render, and testing on a fast office connection hides exactly what a visitor on a throttled mobile connection actually experiences. This tool estimates how a URL loads specifically on a slow connection, breaking the total size down by asset type, images, scripts, stylesheets, fonts, so the actual heaviest piece is identifiable rather than buried in one aggregate number. Useful for finding which single image or script is actually inflating a page's load time before optimizing blindly, checking how a page feels for a visitor on a slow mobile network rather than a fast office connection, or comparing a size breakdown before and after removing an unused script.`,
    examples: [
      {
        title: 'See a size breakdown by asset type',
        code: `Input: https://example.com/blog/post\nOutput:\nImages: 2.4MB\nJS: 890KB\nCSS: 120KB\nFonts: 210KB\nEstimated load on 3G: 8.2s`,
        note: 'Points to images as the single largest contributor to load time.',
      },
      {
        title: 'Compare before and after removing a script',
        code: `Before: total 3.6MB, load 8.2s\nAfter removing unused analytics script: total 3.1MB, load 6.9s`,
        note: 'Confirms a specific optimization actually reduced load time.',
      },
    ],
  },

  'code-diff': {
    description: `A generic text diff treats every line the same way, whitespace, indentation, a stray semicolon, all flagged with equal weight, which buries an actual logic change under formatting noise when comparing two versions of a function rather than two paragraphs of prose. This tool compares two code snippets specifically, highlighting differences with syntax-aware, line-by-line detail that understands it's looking at code rather than plain text. Useful for reviewing what actually changed between two versions of a function before merging, comparing a snippet from documentation against the version actually running in production, or spotting a subtle change buried in a large pasted block of code that would be easy to miss reading line by line manually.`,
    examples: [
      {
        title: 'Compare two versions of a function',
        code: `Version A:\nfunction total(items) {\n  return items.reduce((a, b) => a + b, 0);\n}\n\nVersion B:\nfunction total(items) {\n  return items.reduce((a, b) => a + b.price, 0);\n}\nDiff: line 2 changed, b to b.price`,
        note: 'Flags the actual logic change instead of surrounding formatting.',
      },
      {
        title: 'Spot a subtle change in a large snippet',
        code: `Diff: line 47: if (user.active) -> if (user.active && !user.banned)`,
        note: 'Surfaces a condition change buried inside a long pasted block.',
      },
    ],
  },

  'http-status-checker': {
    description: `A single broken link is easy enough to notice by clicking it, but a site with hundreds of outbound references, old blog posts, a sitemap built up over years, needs every URL checked at once rather than one at a time, since a redirect chain or a dead link buried on page forty of a site rarely gets noticed until a visitor actually hits it. This tool checks HTTP status codes for a whole batch of URLs at once, surfacing a broken link, an unexpected redirect, or a server error across the entire list rather than one lookup at a time. Useful for auditing every outbound link on a site after a migration to catch anything that broke, checking a sitemap's URLs in bulk for dead pages before submitting it, or confirming a batch of redirects actually point where they're supposed to after a domain change.`,
    examples: [
      {
        title: 'Check a batch of URLs at once',
        code: `Input: [example.com/page1, example.com/page2, example.com/old-post]\nOutput:\npage1: 200 OK\npage2: 301 -> /page2-new\nold-post: 404 Not Found`,
        note: 'Surfaces a dead page and a redirect in one pass instead of checking each link individually.',
      },
      {
        title: 'Audit a sitemap after a migration',
        code: `Input: sitemap.xml (340 URLs)\nOutput: 331 OK, 6 redirects, 3 broken`,
        note: 'Finds exactly which links broke during a migration rather than discovering them one at a time.',
      },
    ],
  },

  'color-temperature-adjuster': {
    description: `Warmth and coolness sit on their own axis entirely separate from how light or dark or how saturated a color is, a photographer white-balancing a shot under tungsten lighting or a designer wanting a palette to feel like golden-hour sunlight instead of overcast daylight is adjusting temperature specifically, not lightness and not saturation. This tool shifts a color warmer toward yellow and red or cooler toward blue by adjusting its actual temperature value, leaving lightness and saturation untouched rather than changing multiple properties at once. Useful for warming up a palette to feel like late-afternoon sunlight instead of a clinical fluorescent tone, cooling a color down for a wintry or nighttime scene, or correcting a photo's white balance by shifting temperature without altering how bright or saturated it already looks.`,
    examples: [
      {
        title: 'Warm a color toward golden-hour light',
        code: `Input: #4A90D9, temperature: +40\nOutput: #D9A94A`,
        note: 'Shifts toward yellow/red without changing lightness or saturation.',
      },
      {
        title: 'Cool a color for a nighttime scene',
        code: `Input: #E8C547, temperature: -30\nOutput: #6FA8DC`,
        note: 'Shifts toward blue while keeping the color equally bright and saturated.',
      },
    ],
  },

  'paragraph-generator': {
    description: `Generic lorem ipsum works for filling space, but it looks obviously out of place dropped next to real content in a mockup, and a text field being tested for a specific word count limit needs placeholder text of an exact, controllable length rather than however long a random Latin block happens to run. This tool generates random paragraphs with an adjustable word count and an actual topic, technology, food, travel, whatever fits the mockup, producing readable filler text that looks like real writing instead of Latin gibberish. Useful for filling a content mockup with paragraphs that read naturally alongside actual copy instead of obvious lorem ipsum, testing a text field or a character limit against a specific word count, or generating placeholder content on a particular topic so a demo doesn't look empty or generic.`,
    examples: [
      {
        title: 'Generate on-topic filler text',
        code: `Input: topic: "cooking", word count: 60\nOutput: "Searing the fish at high heat first locks in the juices before the sauce goes on..."`,
        note: 'Reads like real writing instead of obvious lorem ipsum.',
      },
      {
        title: 'Test a field against an exact word count',
        code: `Input: word count: 150\nOutput: paragraph of exactly 150 words`,
        note: 'Confirms a text field or character limit at a precise length.',
      },
    ],
  },

  'cron-schedule-validator': {
    description: `A cron expression copied from a config file or a Stack Overflow answer either runs on the schedule someone intended or it doesn't, and five fields of asterisks and numbers packed together give no obvious clue which, especially once a step value or a comma-separated list gets involved. This tool checks whether a cron expression is actually valid, then translates it into a plain-language description and lists the next ten times it would actually run, rather than leaving someone to mentally simulate five cryptic fields. Useful for confirming a cron expression copied from documentation actually means what it appears to mean, catching a typo in a scheduled job before it ships to production, or checking the next several run times to confirm a job fires exactly when expected rather than five minutes off.`,
    examples: [
      {
        title: 'Validate and translate an expression',
        code: `Input: 0 */4 * * 1-5\nOutput: Valid. Runs "every 4 hours, Monday through Friday"`,
        note: 'Turns five cryptic fields into a plain-language description.',
      },
      {
        title: 'List the next run times',
        code: `Input: 30 9 * * 1\nOutput: Next 10 runs: Mon Aug 4 09:30, Mon Aug 11 09:30, Mon Aug 18 09:30, ...`,
        note: 'Confirms exactly when a job will actually fire.',
      },
    ],
  },

  'grammar-checker-v2': {
    description: `Being told a sentence is wrong without being told why leaves the actual rule unclear the next time a similar mistake happens, a subject-verb mismatch and a misplaced comma are different problems with different explanations, and fixing one manually is slower than accepting a correction already written out. This tool checks grammar, spelling, and punctuation together, attaching a detailed explanation of the specific rule behind each flagged issue and a one-click correction that applies it directly rather than leaving the rewrite to be typed out by hand. Useful for catching a subtle grammar mistake along with the actual reason it's wrong, applying a suggested correction instantly instead of retyping a sentence from scratch, or proofreading a longer piece of writing where spelling, punctuation, and grammar issues all need catching in a single pass.`,
    examples: [
      {
        title: 'Fix an error with the rule explained',
        code: `Input: "Each of the students have submitted their essay."\nFlag: "have" should be "has" - subject "each" is singular\nOutput (one-click applied): "Each of the students has submitted their essay."`,
        note: 'Explains the subject-verb agreement rule behind the fix, not just the correction.',
      },
      {
        title: 'Catch a misplaced comma',
        code: `Input: "After we ate the dog started barking."\nFlag: missing comma after introductory clause\nOutput: "After we ate, the dog started barking."`,
        note: 'Identifies the specific punctuation rule rather than a generic error.',
      },
    ],
  },

  counter: {
    description: `Some counting doesn't need a spreadsheet or an app, just a number that goes up by one every time something happens, reps during a workout set, people walking through a door for an event headcount, votes tallied by hand during a meeting, tracking any of these on paper or in your head gets error-prone past a certain point. This tool is a plain increment-and-decrement counter, tap up, tap down, reset back to zero, nothing else attached to it. Useful for counting reps during a workout without losing track mid-set, keeping score in a card game or a casual match, or tallying attendance at a door one person at a time instead of guessing the total afterward.`,
    examples: [
      {
        title: 'Count reps during a workout',
        code: `Tap +: 1, 2, 3, ... 12\nReset: 0`,
        note: 'Tracks a set without losing count partway through.',
      },
      {
        title: 'Tally attendance at a door',
        code: `Tap + for each person entering: 1, 2, 3 ... 87\nFinal count: 87`,
        note: 'Gives an exact headcount instead of an after-the-fact estimate.',
      },
    ],
  },
};

export default FIX_BATCH_47;
