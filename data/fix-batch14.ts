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

const FIX_BATCH_14: Record<string, FixBatchEntry> = {
  'hash-collision-finder': {
    description: `MD5 and SHA-1 were designed to make it computationally infeasible to find two different inputs that hash to the same output, but both have since been broken in exactly that way, researchers have published real, reproducible collisions for both algorithms, which is a big part of why security guidance moved away from them for anything sensitive. This tool demonstrates that weakness directly: search for short inputs that produce the same hash under MD5, SHA-1, or SHA-256, and see how quickly a collision turns up, or doesn't, depending on the algorithm. SHA-256 has no known practical collision, which is exactly the point of comparing it against the two that do. Useful for understanding concretely why a broken hashing algorithm is a real, demonstrable risk rather than an abstract warning, or for a security course explaining collision resistance with an actual working example instead of just a definition.`,
    examples: [
      {
        title: 'Find an MD5 collision quickly',
        code: `Search space: 4-character alphanumeric strings\nResult: "a3X9" and "k7Qz" both hash to 9e107d9d372bb6826bd81d3542a419d6`,
        note: 'Demonstrates how quickly MD5 collisions turn up even for very short inputs.',
      },
      {
        title: 'Confirm SHA-256 resists the same search',
        code: `Search space: same 4-character strings tested against SHA-256\nResult: no collision found after exhausting the search space`,
        note: 'Shows the practical difference between a broken algorithm and one with no known collision.',
      },
    ],
  },

  'svg-minifier': {
    description: `An SVG that's already reasonably clean, hand-written or exported from a well-behaved tool, can still carry unnecessary weight at the syntax level: comments left in from editing, whitespace and line breaks that only matter for human readability, attributes written out longer than they need to be. This tool strips exactly that: comments removed, whitespace collapsed, redundant or default attribute values dropped, without touching the actual path data or visual result at all. That distinction matters when an SVG is headed somewhere every byte counts differently than a standalone file would, inlined directly as a string inside a JavaScript bundle, embedded as a data attribute, or included inline in HTML dozens of times across a page. Useful for squeezing the last bit of size out of an SVG right before it gets embedded, after any deeper cleanup of the actual path structure is already done.`,
    examples: [
      {
        title: 'Strip comments and whitespace from a hand-written SVG',
        code: `Input: icon.svg (1.8 KB, includes comments and formatting)\nOutput: icon.svg (1.1 KB, comments and whitespace removed)`,
        note: 'Leaves path data untouched while trimming syntax-level overhead.',
      },
      {
        title: 'Prepare an SVG for inlining in a JS bundle',
        code: `Input: 20 small icon SVGs\nOutput: 20 minified SVG strings, ~35% smaller combined`,
        note: 'Matters most when every icon gets embedded directly as a string across a bundle.',
      },
    ],
  },

  'random-paragraph-generator': {
    description: `Some placeholder text jobs need one carefully sized paragraph to match an exact space, but a full page mockup, a blog layout, an article preview, needs several paragraphs at once, each naturally varying in length the way real paragraphs actually do rather than a uniform, prescribed block. This tool generates that in bulk instead: pick how many paragraphs are needed, and get back that many lorem ipsum blocks with natural, varied sentence and paragraph lengths, ready to fill an entire mockup page in one pass rather than pasting text one block at a time. It's built for speed over precision, filling a full page layout so a design actually looks populated during a review, rather than dialing in the exact word count of one specific space.`,
    examples: [
      {
        title: 'Fill a blog layout mockup',
        code: `Input: 4 paragraphs\nOutput: 4 lorem ipsum paragraphs, naturally varying between 3-6 sentences each`,
        note: 'Populates a full mockup quickly instead of generating one precise block at a time.',
      },
      {
        title: 'Populate an article preview grid',
        code: `Input: 6 paragraphs\nOutput: 6 varied-length blocks ready to paste into 6 separate preview cards`,
        note: 'Useful when a layout needs several distinct blocks rather than one exact-sized paragraph.',
      },
    ],
  },

  'color-harmony-generator': {
    description: `Color wheel relationships aren't just complementary and analogous; split-complementary, pairing a base color with the two colors adjacent to its direct opposite rather than the opposite itself, gives noticeably more contrast than an analogous scheme while feeling less jarring than a straight complementary pair, and it's a scheme most people have never deliberately used because it's less commonly explained. This tool generates all four major harmony types from one base hue, complementary, analogous, triadic, and split-complementary, calculated from the actual degree relationships around the color wheel rather than approximated by eye. Useful for exploring a genuinely wider range of coordinated palettes than the two or three schemes most people default to, especially split-complementary, which tends to produce combinations that read as intentional and balanced rather than either too safe or too clashing.`,
    examples: [
      {
        title: 'Generate a split-complementary scheme',
        code: `Input: #2563EB (210° on the color wheel)\nOutput: #2563EB, #EBB525 (330°), #25EB6B (90°)`,
        note: 'Pairs the base color with the two hues adjacent to its direct opposite rather than the opposite itself.',
      },
      {
        title: 'Compare triadic against complementary for the same base',
        code: `Input: #2563EB\nTriadic: #2563EB, #EB6425, #63EB25\nComplementary: #2563EB, #EBA825`,
        note: 'Shows how the same base color produces very different levels of contrast depending on the harmony rule applied.',
      },
    ],
  },

  'time-zone-converter': {
    description: `Adding a fixed number of hours to convert between two time zones works until daylight saving flips one of them and not the other, which happens on different dates in different countries and sometimes doesn't happen at all depending on the region, so a gap that was five hours in January can quietly become four or six hours in July. This tool accounts for that automatically: convert a specific time between multiple zones with daylight saving already factored in correctly for the actual date involved, not just today's offset applied blindly to some other date. Useful for scheduling a meeting across regions where the time difference isn't fixed year-round, double-checking a flight's arrival time against a home time zone, or confirming what time a scheduled call actually lands at for someone on the other side of a daylight saving transition.`,
    examples: [
      {
        title: 'Schedule a meeting across a daylight saving transition',
        code: `Input: 2:00 PM in New York on March 15\nOutput: 6:00 PM in London (before UK clocks change), 7:00 PM after March 30`,
        note: 'The US and UK change clocks on different dates, so the offset briefly shifts.',
      },
      {
        title: "Check a flight's arrival time at home",
        code: `Input: lands 9:45 PM in Tokyo\nOutput: 8:45 AM the same day in Los Angeles`,
        note: 'Confirms the correct local arrival time even when it falls on what looks like the wrong day.',
      },
    ],
  },

  'argon2-hash-generator': {
    description: `A fast hash is a feature for checking file integrity and a genuine liability for storing passwords, since the same speed that lets a checksum verify a download in milliseconds also lets an attacker with a stolen password database try billions of guesses per second on ordinary hardware. Argon2 was built specifically to remove that advantage: it's deliberately slow and memory-hungry, tunable through separate memory, time, and parallelism settings, so hashing one password takes a meaningful fraction of a second instead of a fraction of a microsecond, which is exactly what makes large-scale guessing impractical. This tool generates an Argon2 hash from a password with those three parameters configurable directly. Useful for setting up password storage in a new application, or tuning the memory and time costs to match what a specific server can actually handle without slowing down real logins.`,
    examples: [
      {
        title: 'Hash a password for a new signup system',
        code: `Input: password: "correct-horse-battery", memory: 64 MB, iterations: 3, parallelism: 4\nOutput: $argon2id$v=19$m=65536,t=3,p=4$...`,
        note: 'The memory and time costs are stored in the hash itself, so verification always uses the original settings.',
      },
      {
        title: 'Tune parameters for a lower-resource server',
        code: `Input: memory: 19 MB, iterations: 2, parallelism: 1\nOutput: $argon2id$v=19$m=19456,t=2,p=1$...`,
        note: 'Reduces the cost to fit a server with limited memory while staying meaningfully slower than a fast general-purpose hash.',
      },
    ],
  },

  'byte-converter': {
    description: `A drive advertised as 500 gigabytes shows up as roughly 465 gigabytes once it's actually plugged in, and that gap isn't a manufacturing shortfall, it's two different definitions of a gigabyte colliding: storage manufacturers use the decimal definition, 1000 bytes per kilobyte, while operating systems have traditionally reported size using the binary definition, 1024 bytes per kilobyte, and the difference compounds at every step up to gigabytes and terabytes. This tool converts between bytes, kilobytes, megabytes, gigabytes, and terabytes using either base explicitly, so a number lines up correctly with whichever convention the destination actually uses. Useful for figuring out why a drive's advertised capacity doesn't match what the operating system reports, or converting a file size correctly when a system or spec explicitly states which base it's using.`,
    examples: [
      {
        title: "Explain a drive's reported capacity gap",
        code: `Input: 500,000,000,000 bytes (500 GB, decimal)\nOutput: 465.66 GiB (binary)`,
        note: "This is why a '500GB' drive shows as about 465GB in most operating systems.",
      },
      {
        title: 'Convert a file size using an explicit base',
        code: `Input: 2,097,152 bytes, base: binary (1024)\nOutput: 2 MiB`,
        note: 'Matters when a spec or system explicitly states which base it uses for reported sizes.',
      },
    ],
  },

  'mov-to-gif': {
    description: `A screen recording or a short video clip doesn't play inline everywhere; plenty of forums, documentation platforms, and README files on code hosting sites don't support embedded video at all, but they render an animated GIF without any extra setup. This tool converts a MOV file into a GIF specifically for those situations, trading some video quality and color depth, which GIF's format simply can't preserve as well as an actual video codec, for a file that displays automatically wherever video can't. Pick the section of the clip that matters, since a shorter loop keeps the file size reasonable, and get back a GIF ready to drop into a place that treats video as a second-class citizen. Useful for turning a bug reproduction or a quick demo recording into something that actually renders inline in a GitHub README or a forum post.`,
    examples: [
      {
        title: 'Turn a bug reproduction into a GitHub README GIF',
        code: `Input: bug-repro.mov (0:00-0:06)\nOutput: bug-repro.gif (loops automatically in the README preview)`,
        note: 'GitHub renders GIFs inline but does not autoplay embedded video the same way.',
      },
      {
        title: 'Convert a screen recording for a forum post',
        code: `Input: demo-recording.mov\nOutput: demo-recording.gif`,
        note: "Works in forums that don't support embedded video uploads at all.",
      },
    ],
  },

  'regex-escape': {
    description: `Characters like a period, a parenthesis, or a plus sign mean something specific inside a regex pattern, which becomes a real problem the moment a literal string containing one of those characters needs matching exactly as written rather than interpreted as regex syntax, a search term with a period in it, a file name with brackets, user input dropped straight into a dynamically built pattern. This tool escapes exactly those special characters in a plain string, so the result can be inserted directly into a regex pattern and matched as literal text instead of triggering whatever behavior that character normally controls. Useful for building a regex dynamically from a value that isn't itself meant to be a pattern, a search box's raw input, a file path, any string where the goal is finding that exact text rather than accidentally running a mini regex nobody intended.`,
    examples: [
      {
        title: 'Escape a search term before building a dynamic pattern',
        code: `Input: "example.com (support)"\nOutput: example\\.com \\(support\\)`,
        note: 'Prevents the period and parentheses from being read as regex metacharacters.',
      },
      {
        title: 'Safely match a file name containing special characters',
        code: `Input: "invoice[2026].pdf"\nOutput: invoice\\[2026\\]\\.pdf`,
        note: 'Escapes the brackets and period so the file name matches literally instead of as a pattern.',
      },
    ],
  },

  'bulk-generator': {
    description: `Writing one piece of content at a time works fine until the actual task is producing dozens of similar but distinct pieces at once, product descriptions for a hundred catalog items, meta descriptions for every page on a site, social captions for a week's worth of scheduled posts, where doing each one individually turns a straightforward task into a repetitive slog. This tool generates multiple pieces of content in one batch instead of one at a time: feed in a list of inputs, a product name and its key features for each item, and get back a completed piece for every entry in the list rather than running the same generation step over and over by hand. Useful for populating an entire product catalog with unique descriptions in one pass, or generating a week's worth of varied captions without writing and running each request separately.`,
    examples: [
      {
        title: 'Generate descriptions for a product catalog',
        code: `Input: 50 products, each with name + 3 key features\nOutput: 50 unique product descriptions, one per entry`,
        note: 'Processes an entire list in one batch instead of generating each description individually.',
      },
      {
        title: "Generate a week's worth of social captions",
        code: `Input: 7 post topics for the week\nOutput: 7 distinct captions, one per topic`,
        note: 'Produces a full week of varied captions from one input list.',
      },
    ],
  },
};

export default FIX_BATCH_14;
