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

const FIX_BATCH_85: Record<string, FixBatchEntry> = {
  'shell-command-generator-new': {
    description: `Bash and zsh share most of their core syntax, but fish deliberately breaks from that lineage, using its own syntax for variables, conditionals, and loops, which means the exact same plain English request, find every file modified in the last week, doesn't translate into one universal command, it needs to come out differently depending on which shell is actually going to run it. This tool generates a shell command from a plain English description, targeted specifically at bash, zsh, or fish rather than a single syntax assumed to work everywhere. Useful for getting a fish-specific command that won't silently misbehave if pasted from a bash-oriented answer, generating the same request in both bash and zsh to confirm they're actually interchangeable, or producing a command in whichever shell a specific script or terminal setup actually uses.`,
    examples: [
      {
        title: 'Generate a fish-specific command',
        code: `Input: "find files modified in the last 7 days", shell: fish\nOutput: find . -mtime -7 -type f`,
        note: "Targets fish's own syntax rather than assuming bash conventions apply.",
      },
      {
        title: 'Compare the same request across shells',
        code: `Input: "list all environment variables containing PATH", shells: bash, zsh\nOutput: env | grep PATH (identical in both)`,
        note: 'Confirms when a command is actually portable between shells.',
      },
    ],
  },

  'regex-description-generator': {
    description: `A regex pasted into a code review or dropped above a function as a comment doesn't need a full token-by-token tutorial explaining every character, it needs one clear sentence describing what the pattern is actually for, matches a valid US phone number, matches an email address with a required domain, the kind of concise summary that documents intent rather than walking through syntax. This tool generates a single plain English description summarizing what a regex pattern matches overall, built for documentation rather than a step-by-step breakdown of each token. Useful for writing a one-line comment above a regex in code explaining its purpose, documenting what a validation pattern actually checks for in a pull request description, or getting a quick summary of an unfamiliar regex without parsing every character by hand.`,
    examples: [
      {
        title: 'Summarize a pattern for a code comment',
        code: `Input: /^\\(\\d{3}\\)\\s\\d{3}-\\d{4}$/\nOutput: "Matches a US phone number formatted as (123) 456-7890."`,
        note: 'Produces one documentation-ready sentence instead of a token breakdown.',
      },
      {
        title: 'Document a validation pattern',
        code: `Input: /^[a-zA-Z0-9_]{3,16}$/\nOutput: "Matches a username between 3 and 16 characters, letters, numbers, and underscores only."`,
        note: "Summarizes the pattern's purpose for a pull request description.",
      },
    ],
  },

  'post-rewriter': {
    description: `A post that performed well six months ago is still worth posting again, the core idea hasn't gone stale, but reposting it word for word reads as a lazy repeat to anyone who follows the account closely, which is exactly the gap between simply reposting and actually giving an old post a fresh angle worth seeing again. This tool rewrites an existing social media post with new wording and a different angle while keeping its original message intact, built specifically for repurposing a post that's already been published rather than drafting one from scratch. Useful for reposting a high-performing piece of evergreen content without it looking like a duplicate, giving an old announcement a fresh spin before sharing it again, or varying the wording across several reposts of the same core message over time.`,
    examples: [
      {
        title: 'Repost evergreen content with a fresh angle',
        code: `Input: [post from 6 months ago about time-blocking]\nOutput: same core message, new opening line and different framing`,
        note: "Doesn't read as a duplicate of the original post.",
      },
      {
        title: 'Vary wording across repeated reposts',
        code: `Input: [original announcement], repost count: 3\nOutput: 3 differently worded versions of the same message`,
        note: 'Keeps the message consistent while wording changes each time.',
      },
    ],
  },

  'color-shade-tints': {
    description: `A tint lightens a color toward white and a shade darkens it toward black, but neither one touches how saturated or vivid the color actually looks, that's a tone, made by mixing a color toward gray instead, which is exactly the operation that turns a loud, saturated brand color into a softer, more muted variant without simply making it lighter or darker. This tool generates tints, shades, and tones of a base color together, covering the desaturated, muted variant a tint or shade alone can't produce. Useful for creating a softer, muted version of a bright brand color for a secondary UI element or a background, building a complete set of tints, shades, and tones for a design system from one base color, or toning down a color's vibrancy without changing how light or dark it appears.`,
    examples: [
      {
        title: 'Mute a saturated brand color',
        code: `Input: #E63946 (bright red)\nOutput tone: #B37B7E (same lightness, less saturated)`,
        note: 'Softens vibrancy without lightening or darkening the color.',
      },
      {
        title: 'Generate tints, shades, and tones together',
        code: `Input: #2563EB\nOutput: tint #93B4F5, shade #1A46A8, tone #6B7BA8`,
        note: 'Covers all three color-theory operations from one base color.',
      },
    ],
  },

  'json-path-evaluator-express': {
    description: `A simple dot-notation path like $.store.name handles the easy case, but JSONPath's real power shows up in a filter expression like $.store.book[?(@.price < 10)], selecting only the nodes that match a condition, or a recursive descent operator like $..author, finding every author field no matter how deeply nested it is, syntax that's genuinely harder to get right than a plain property lookup. This tool evaluates JSONPath expressions against real JSON data, handling filter conditions and recursive descent correctly rather than only simple property paths. Useful for testing a filter expression that selects nodes matching a specific condition, confirming a recursive descent query actually finds every matching field at any depth, or debugging a JSONPath expression that returns the wrong nodes before it goes into actual code.`,
    examples: [
      {
        title: 'Filter nodes by a condition',
        code: `Input: $.store.book[?(@.price < 10)]\nData: [{ "price": 8.99 }, { "price": 15.00 }]\nOutput: [{ "price": 8.99 }]`,
        note: 'Selects only nodes matching the filter condition.',
      },
      {
        title: 'Find a field at any depth',
        code: `Input: $..author\nData: nested book/chapter/section structure\nOutput: every "author" field found regardless of nesting depth`,
        note: 'Handles recursive descent rather than just a fixed-depth path.',
      },
    ],
  },

  'age-calculator': {
    description: `Subtracting a birth year from the current year gets the wrong answer more often than it seems like it should, if today's date falls before this year's birthday has actually happened yet, that simple subtraction overcounts by a full year, an easy mistake that only shows up as a wrong result rather than an obvious error. This tool calculates exact age in years, months, and days from a birth date, correctly accounting for whether this year's birthday has occurred yet, and also reports total days lived. Useful for getting a precise age broken into years, months, and days rather than a rounded year count, calculating exactly how many total days someone has been alive, or confirming an age calculation is correct for a date near someone's actual birthday when simple subtraction would get it wrong.`,
    examples: [
      {
        title: "Calculate age before this year's birthday",
        code: `Input: birth date: 1990-06-15, today: 2026-03-03\nOutput: 35 years, 8 months, 16 days`,
        note: "Correctly avoids overcounting since this year's birthday hasn't happened yet.",
      },
      {
        title: 'Get total days lived',
        code: `Input: birth date: 1990-06-15\nOutput: 13,048 total days`,
        note: 'Reports a precise day count alongside the years/months/days breakdown.',
      },
    ],
  },

  'pixel-density-calculator': {
    description: `The same 3,000 by 2,000 pixel photo that looks crisp printed as a small 4x6 print can look visibly soft and pixelated printed as a 24x36 poster, not because the file changed, but because the same fixed number of pixels gets spread across far more physical inches, lowering the effective pixel density at the larger size below what looks sharp. This tool calculates PPI and DPI for an image at different dimensions and print sizes, showing whether a specific size actually has enough pixel density to look sharp rather than assuming a resolution that worked once will work at any size. Useful for checking whether a photo has enough resolution for a specific poster size before sending it to print, confirming an image meets a print shop's minimum DPI requirement, or figuring out the largest size a given image can print at while still looking sharp.`,
    examples: [
      {
        title: 'Check if a photo is sharp enough for a poster',
        code: `Input: 3000x2000px image, print size: 24x36 in\nOutput: 83 PPI (below the 300 PPI print-quality threshold)`,
        note: 'Flags when a print size stretches an image below sharp resolution.',
      },
      {
        title: 'Find the largest sharp print size',
        code: `Input: 3000x2000px image, target: 300 PPI\nOutput: max sharp print size: 10x6.7 in`,
        note: 'Calculates the largest size that stays at full print quality.',
      },
    ],
  },

  'psd-to-pdf': {
    description: `A flattened PNG or JPEG export shows one version of a design, but a client reviewing several layout variations, or a design with distinct layer groups meant to be compared side by side, benefits from something a single flattened image can't provide, each variation on its own page within one document that can be paged through and annotated with standard PDF review tools. This tool converts a PSD file into a PDF, with layers preserved and optionally split across separate pages rather than flattened into one image. Useful for turning several design variations stored as layer groups into a single paginated PDF for client review, preserving transparency and layer structure in a format that supports commenting and markup, or producing a multi-page proof document from one PSD file instead of exporting each variation separately.`,
    examples: [
      {
        title: 'Turn layer variations into a paginated proof',
        code: `Input: design.psd (3 layer groups: Option A, B, C)\nOutput: design-proof.pdf (3 pages, one per variation)`,
        note: 'Splits layer groups into separate pages for client review.',
      },
      {
        title: 'Preserve transparency for markup',
        code: `Input: banner.psd (transparent background)\nOutput: banner.pdf (transparency preserved, ready for PDF comments)`,
        note: 'Keeps the file reviewable with standard PDF annotation tools.',
      },
    ],
  },

  'css-class-generator': {
    description: `Adopting a utility-first framework like Tailwind for the handful of spacing and flexbox classes an actual project needs pulls in a far larger set of utilities than will ever get used, while hand-writing custom CSS for each one loses the composability that made utility classes appealing in the first place. This tool generates exactly the utility CSS classes a project actually needs, spacing, typography, colors, and flexbox layouts, without requiring an entire framework dependency to get that same utility-first pattern. Useful for generating a lightweight set of spacing and flexbox utilities for a project that doesn't want a full framework installed, producing custom-named utility classes that match an existing design system's conventions, or adopting the utility-class approach incrementally without committing to Tailwind's complete class set.`,
    examples: [
      {
        title: 'Generate only the utilities a project needs',
        code: `Input: spacing scale, flex utilities\nOutput: .mt-4 { margin-top: 1rem; } .flex { display: flex; } ...`,
        note: 'Produces a lightweight class set instead of an entire framework.',
      },
      {
        title: "Match an existing design system's naming",
        code: `Input: prefix: "u-", spacing scale: [4, 8, 16, 24]\nOutput: .u-mt-4, .u-mt-8, .u-mt-16, .u-mt-24`,
        note: "Generates classes matching a project's own naming conventions.",
      },
    ],
  },

  'paragraph-rewriter': {
    description: `Rewording a paragraph you already wrote yourself for a fresher angle mid-edit is a different task from restating someone else's source material to avoid repeating it word for word, the first is an ordinary editing pass on your own draft, the second carries a specific citation concern the first never has to think about. This tool rewrites an individual paragraph with fresh wording while preserving its original meaning, built for refreshing your own already-written draft rather than rephrasing quoted or cited source material. Useful for giving a paragraph you've already drafted a different angle before finalizing it, reworking an awkward paragraph's phrasing without changing what it actually says, or trying a few wording variations of the same paragraph before picking the one that reads best.`,
    examples: [
      {
        title: 'Give a drafted paragraph a fresh angle',
        code: `Input: "Our product saves time by automating repetitive tasks."\nOutput: "Repetitive tasks disappear once the product takes over, freeing up real time."`,
        note: 'Reworks your own paragraph rather than a quoted source.',
      },
      {
        title: 'Try a few wording variations',
        code: `Input: [one paragraph]\nOutput: 3 differently worded versions of the same paragraph`,
        note: 'Offers alternatives to pick from before finalizing a draft.',
      },
    ],
  },
};

export default FIX_BATCH_85;
