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

const FIX_BATCH_59: Record<string, FixBatchEntry> = {
  'contrast-checker': {
    description: `A specific gray text color on a specific background either passes WCAG's minimum contrast ratio or it doesn't, and that's a single, precise yes-or-no question distinct from auditing an entire page's overall accessibility, sometimes the only thing that actually needs confirming before shipping a design is whether one exact text-and-background pairing meets AA or the stricter AAA standard. This tool checks a specific text and background color pair directly against WCAG AA and AAA contrast requirements, answering that one focused question rather than scanning a whole page for every possible accessibility issue at once. Useful for confirming a specific gray text color actually passes AA contrast against a chosen background before it ships, checking whether a color pairing meets the stricter AAA standard for a high-accessibility requirement, or quickly testing several candidate text colors against the same background to find one that actually passes.`,
    examples: [
      {
        title: 'Check a specific color pair against AA',
        code: `Input: text #595959 on background #FFFFFF\nOutput: contrast ratio 6.8:1 - passes WCAG AA and AAA`,
        note: 'Answers one focused pass/fail question for a specific pairing.',
      },
      {
        title: 'Test the stricter AAA standard',
        code: `Input: text #767676 on background #FFFFFF\nOutput: contrast ratio 4.6:1 - passes AA, fails AAA (needs 7:1)`,
        note: 'Flags a pairing that meets a lower standard but not the stricter one.',
      },
    ],
  },

  'text-deduplicator': {
    description: `A document can end up with the same word typed twice in a row by accident, the same phrase repeated from a copy-paste slip, or an entire sentence pasted in twice without anyone noticing, three different levels of repetition that a simple find-and-replace won't catch consistently across an entire piece of writing. This tool removes duplicate words, phrases, and sentences from text with one click, catching repetition at each of those three levels rather than only the line-level duplicates a list-sorting tool would catch. Useful for catching an accidental "the the" typo repeated mid-sentence, removing a phrase duplicated by a copy-paste error, or catching a sentence that got pasted into a paragraph twice by mistake without it being obvious on a quick read-through.`,
    examples: [
      {
        title: 'Remove a duplicated word',
        code: `Input: "Please make make sure to review the document."\nOutput: "Please make sure to review the document."`,
        note: 'Catches a typo where a word got accidentally repeated.',
      },
      {
        title: 'Remove a duplicated sentence',
        code: `Input: "The meeting is at 3pm. The meeting is at 3pm. Please be on time."\nOutput: "The meeting is at 3pm. Please be on time."`,
        note: 'Catches a sentence pasted into a paragraph twice by mistake.',
      },
    ],
  },

  'regex-pattern-tester': {
    description: `Writing a regular expression that seems to work against one test string and then silently fails against a slightly different real one is one of the most common ways a regex ships broken, and figuring out which capture group actually captured what, or what a find-and-replace would really produce, is hard to judge without seeing it demonstrated directly against real text. This tool tests a regex pattern with live match highlighting, labeled capture groups, a replacement preview, and a library of common patterns already written and ready to use. Useful for testing a pattern against several example strings before it ends up in production code, seeing exactly what each capture group actually captures rather than guessing, or grabbing a ready-made pattern for something common like an email address instead of writing one from scratch.`,
    examples: [
      {
        title: 'Test capture groups against sample text',
        code: `Pattern: (\\d{3})-(\\d{4})\nInput: "Call 555-0142"\nMatch: "555-0142", group 1: "555", group 2: "0142"`,
        note: 'Shows exactly what each capture group actually captures.',
      },
      {
        title: 'Preview a find-and-replace',
        code: `Pattern: (\\w+)@(\\w+\\.com)\nReplacement: $1 [at] $2\nInput: "jane@example.com"\nPreview: "jane [at] example.com"`,
        note: 'Shows the replacement result before it runs against real data.',
      },
    ],
  },

  'cron-validator': {
    description: `Right after editing a line in a crontab file, the fastest possible check isn't necessarily a plain-language explanation of what the schedule means, it's a fast yes-or-no confirmation that the syntax is actually valid along with a quick look at when it would fire next, a fast sanity check rather than a deeper explanation. This tool validates a cron expression and shows the next ten scheduled run times instantly, built for a quick guardrail check right after writing or editing an expression rather than a slower explanatory pass. Useful for a fast sanity check immediately after editing a crontab line before deploying it, confirming a cron expression's syntax is valid before a scheduled job goes live, or glancing at the next several run times to catch an obviously wrong schedule before it causes a problem.`,
    examples: [
      {
        title: 'Quick sanity check after an edit',
        code: `Input: */5 * * * *\nOutput: valid, next run in 5 minutes`,
        note: 'Confirms syntax fast right after editing a crontab line.',
      },
      {
        title: 'Catch an obviously wrong schedule',
        code: `Input: 0 0 30 2 *\nOutput: valid syntax, but next 10 runs show it rarely triggers (Feb 30 doesn't exist)`,
        note: 'Surfaces a schedule that technically parses but never actually fires as intended.',
      },
    ],
  },

  'seo-title-analyzer': {
    description: `A title tag can fit comfortably within Google's character limit and still underperform on click-through rate, since length alone doesn't capture whether a title actually reads as specific, includes a number or a compelling angle, or sounds too generic to stand out among several other results saying roughly the same thing. This tool analyzes an existing SEO title's length and quality together, evaluating what actually correlates with click-through rate in a Google search result rather than only flagging whether it's too long. Useful for auditing an existing title tag's quality beyond just its character count, checking whether a title actually reads as compelling enough to earn a click among competing search results, or comparing two already-written title options to see which one is likely to perform better.`,
    examples: [
      {
        title: "Analyze a title beyond its length",
        code: `Input: "Tips for Better Sleep"\nOutput: length: OK (21 chars), quality: generic - lacks specificity or a number`,
        note: 'Flags a title that fits the character limit but reads as vague.',
      },
      {
        title: 'Compare two title options',
        code: `Option A: "How to Sleep Better"\nOption B: "7 Sleep Habits That Actually Worked for Me"\nOutput: Option B scores higher for specificity and click-through potential`,
        note: 'Judges quality factors beyond just character count.',
      },
    ],
  },

  'remove-person': {
    description: `A stranger walking through the background of an otherwise perfect vacation photo, a crowd of unrelated tourists cluttering a landmark shot, or an ex who shouldn't be in a photo anymore all need the same specific fix, erasing a person-shaped area convincingly, which is a harder fill than removing a simple object since a person usually leaves a shadow and disrupts more of the surrounding scene. This tool removes a person from a photo and fills the background in automatically, handling that more complex fill without leaving an obvious gap or a visible patch behind. Useful for erasing a stranger who walked through an otherwise great photo, removing an ex from an old photo that's otherwise still worth keeping, or clearing a crowd of unwanted background people out of a landmark or a travel photo.`,
    examples: [
      {
        title: 'Erase a stranger from a photo',
        code: `Input: landmark-photo.jpg (tourist in background)\nOutput: landmark-photo-clean.jpg`,
        note: 'Fills the person-shaped gap convincingly instead of leaving a visible patch.',
      },
      {
        title: 'Clear a crowd from a travel photo',
        code: `Input: plaza-photo.jpg (several people in background)\nOutput: plaza-photo-clean.jpg`,
        note: 'Removes multiple people from the same scene automatically.',
      },
    ],
  },

  'linkedin-post-generator': {
    description: `A LinkedIn post that actually performs well reads differently than an ad headline or a blog title, a personal hook, a lesson learned framed as a short anecdote, line breaks giving each thought room to breathe, and closing with something that invites a comment rather than just stating a fact and stopping. This tool generates a professional LinkedIn post built specifically for that thought-leadership style and format, matching the tone and structure the platform's audience actually responds to rather than a generic paragraph of text. Useful for drafting a thought-leadership post around a professional lesson or an insight worth sharing, announcing a career milestone in the tone LinkedIn's audience expects, or writing a post with the short-paragraph, line-break structure that actually reads well in that specific feed.`,
    examples: [
      {
        title: 'Draft a thought-leadership post',
        code: `Input: topic: "a lesson learned from a failed product launch"\nOutput: post with a personal hook, short paragraphs, and a closing question inviting comments`,
        note: 'Matches the tone and structure LinkedIn audiences respond to.',
      },
      {
        title: 'Announce a career milestone',
        code: `Input: "promoted to senior engineer after 3 years"\nOutput: post framed as a reflection with a note of gratitude and a lesson learned`,
        note: 'Uses the format expected for a milestone announcement on the platform.',
      },
    ],
  },

  'force-converter': {
    description: `A physics problem set working in newtons, an engineering spec sheet listing pounds-force, and an older CGS-based calculation using dynes are all describing the same underlying quantity in units that don't share an obvious conversion factor in your head, which matters the moment a spring's rated force in one unit needs comparing against a requirement written in another. This tool converts between newtons, dynes, pounds-force, and kilogram-force, handling the specific conversion factor between each force unit directly. Useful for converting a homework problem's answer from newtons into pounds-force to match a textbook's expected unit, checking a component's force rating against a spec sheet written in a different unit, or converting an older calculation done in dynes into the newtons a modern reference actually expects.`,
    examples: [
      {
        title: 'Convert newtons to pounds-force',
        code: `Input: 500 N\nOutput: 112.4 lbf`,
        note: 'Matches a spec sheet written in a different force unit.',
      },
      {
        title: 'Convert an older CGS calculation',
        code: `Input: 2,000,000 dynes\nOutput: 20 N`,
        note: 'Brings an older dyne-based calculation into the newtons a modern reference expects.',
      },
    ],
  },

  'image-enlarger': {
    description: `Stretching a small, low-resolution image up to a larger size the ordinary way just blows up the same blurry pixels bigger, which looks obviously soft next to AI-style upscaling that actually infers plausible detail at the larger size instead of just stretching what's already there. This tool enlarges a small image using that AI-style upscaling directly in the browser, producing a larger result with detail that holds up rather than a blurry, stretched version of the original. Useful for enlarging an old, low-resolution photo up to a size that's actually usable for printing, upscaling a small logo file that's the only version available into something crisp enough for a larger display, or blowing up a small thumbnail into something that doesn't look blocky at the larger size.`,
    examples: [
      {
        title: 'Upscale an old low-resolution photo',
        code: `Input: old-photo.jpg (400x300)\nOutput: old-photo-enlarged.jpg (1600x1200), detail preserved`,
        note: 'Infers plausible detail instead of just stretching existing pixels.',
      },
      {
        title: 'Enlarge a small logo file',
        code: `Input: logo-small.png (150x150)\nOutput: logo-large.png (900x900)`,
        note: 'Produces a crisp result usable at a larger display size.',
      },
    ],
  },

  'line-counter': {
    description: `A code file or a text document's actual content isn't the same as its total line count once blank spacer lines are counted too, and a report or a size limit based on lines needs to know specifically how many of those lines actually contain something versus how many are just empty spacing. This tool counts total lines, empty lines, and non-empty lines in any text instantly, breaking the total down into those specific categories rather than reporting one combined number. Useful for checking a code file's actual content line count separate from blank spacing lines, confirming a text file matches an expected line count during a data import check, or getting a quick breakdown of how much of a log file is genuinely blank versus containing real content.`,
    examples: [
      {
        title: "Break down a file's line counts",
        code: `Input: script.js\nOutput: total lines: 240, non-empty: 198, empty: 42`,
        note: 'Separates actual content lines from blank spacing lines.',
      },
      {
        title: 'Check a file against an expected line count',
        code: `Input: data-export.csv\nOutput: total lines: 5,001 (5,000 records + 1 header row)`,
        note: 'Confirms a file matches what was expected during an import check.',
      },
    ],
  },
};

export default FIX_BATCH_59;
