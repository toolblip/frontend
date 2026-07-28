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

const FIX_BATCH_77: Record<string, FixBatchEntry> = {
  'time-zone-converter': {
    description: `Two time zones aren't a fixed number of hours apart all year, daylight saving time shifts the clock in some countries and not others, and not always on the same date, so a city eight hours ahead in January can be seven or nine hours ahead for a few weeks in spring or fall depending on which side of the DST switch each location is currently on. This tool converts a time across multiple time zones, accounting for each location's current daylight saving status rather than assuming a fixed year-round offset, and shows the current time in every zone side by side. Useful for scheduling a meeting across offices in different countries without miscounting an hour during a DST transition week, checking what time it actually is somewhere right now, or converting a specific time into several time zones at once for an international call.`,
    examples: [
      {
        title: 'Schedule a meeting across DST-mismatched zones',
        code: `Input: 2026-03-15 10:00 New York -> London\nOutput: 14:00 London (DST transition week, not the usual 5-hour offset)`,
        note: "Accounts for each zone's actual DST status instead of a fixed offset.",
      },
      {
        title: 'Check several time zones at once',
        code: `Input: 3:00 PM Los Angeles\nOutput: 6:00 PM New York, 11:00 PM London, 8:00 AM (+1 day) Tokyo`,
        note: 'Converts one time into multiple zones side by side.',
      },
    ],
  },

  'argon2-hash-generator': {
    description: `Argon2 won the Password Hashing Competition specifically because it tunes three separate knobs independently, memory cost, time cost, and parallelism, rather than the single cost factor older algorithms rely on, letting a hash be deliberately expensive to compute on the exact kind of parallel hardware, GPUs and custom chips, that makes cracking older hashes cheap at scale. This tool generates Argon2 password hashes with all three parameters configurable, matching the memory and thread settings to actual server hardware rather than accepting one fixed difficulty level. Useful for tuning a hash's memory cost high enough to resist GPU-based cracking attempts, setting a parallelism value that matches the CPU cores actually available at hashing time, or generating a properly configured Argon2 hash for a new user authentication system.`,
    examples: [
      {
        title: 'Tune memory cost for stronger resistance',
        code: `Input: password: "correct-horse", memory: 64 MB, iterations: 3, parallelism: 4\nOutput: $argon2id$v=19$m=65536,t=3,p=4$...`,
        note: 'Higher memory cost makes GPU-based cracking significantly more expensive.',
      },
      {
        title: 'Match parallelism to available CPU cores',
        code: `Input: server with 8 cores, parallelism: 8\nOutput: hash computed using all 8 threads`,
        note: 'Tunes the hashing workload to the actual hardware running it.',
      },
    ],
  },

  'byte-converter': {
    description: `A hard drive advertised as 1 terabyte and showing up as roughly 931 gigabytes in an operating system isn't a manufacturing error, it's two different definitions of the same units colliding, drive manufacturers use decimal base, where a kilobyte is exactly 1,000 bytes, while operating systems typically report binary base, where a kilobyte is 1,024 bytes, and that gap compounds noticeably by the time it reaches terabytes. This tool converts byte counts into KB, MB, GB, and TB using either the binary or decimal base explicitly, showing both results rather than picking one silently. Useful for understanding why a purchased drive's capacity looks smaller once it's actually plugged in, converting a file size using the same base a specific operating system reports, or double-checking which byte definition a spec sheet or a cloud storage plan is actually using.`,
    examples: [
      {
        title: 'See the manufacturer-vs-OS discrepancy',
        code: `Input: 1,000,000,000,000 bytes\nDecimal: 1.0 TB\nBinary: 0.909 TiB (~931 GB)`,
        note: "Explains why a '1 TB' drive shows up as roughly 931 GB in an OS.",
      },
      {
        title: 'Convert a file size using a specific base',
        code: `Input: 4,700,000,000 bytes, base: decimal\nOutput: 4.7 GB`,
        note: 'Matches whichever base a specific platform actually reports.',
      },
    ],
  },

  'mov-to-gif': {
    description: `A GIF autoplays and loops the instant it loads wherever it's posted, Twitter, Slack, Discord, an old forum, with no click required, while a MOV file typically needs a tap or a click to start playing as a native video, a real difference when the whole point of a clip is to loop instantly as a quick reaction. This tool converts a MOV video into an animated GIF, preserving the clip's motion in a format built to autoplay anywhere rather than wait for someone to press play. Useful for turning a short screen recording into a reaction GIF that loops the moment it's posted, converting a phone video clip for a platform that doesn't autoplay MOV files, or preparing a quick animated clip for a forum or chat that only supports GIFs.`,
    examples: [
      {
        title: 'Turn a screen recording into a reaction GIF',
        code: `Input: reaction-clip.mov (3 seconds)\nOutput: reaction-clip.gif (autoplays and loops)`,
        note: 'Loops instantly on platforms that never autoplay MOV files.',
      },
      {
        title: 'Prepare a clip for a GIF-only platform',
        code: `Input: phone-video.mov\nOutput: phone-video.gif`,
        note: 'Converts for a forum or chat that only supports GIF uploads.',
      },
    ],
  },

  'regex-escape': {
    description: `A period inside a regex pattern doesn't mean a literal period, it means match any single character, so searching for the exact string "file.txt" with an unescaped pattern would also match "fileXtxt", a subtle bug that shows up specifically when a regex gets built dynamically from a variable string, a filename, a price, a URL, rather than typed by hand with the special characters already accounted for. This tool escapes every regex metacharacter in a string, turning it into a pattern that matches only the literal text rather than anything a stray period, asterisk, or parenthesis would otherwise mean. Useful for safely inserting a user-supplied filename into a larger regex pattern, searching for a literal price string like "$19.99" without the dollar sign or period being misread as regex syntax, or building a dynamic pattern from a variable without a stray character silently changing what it matches.`,
    examples: [
      {
        title: 'Escape a literal filename before matching',
        code: `Input: file.txt\nOutput: file\\.txt`,
        note: 'Prevents the period from matching any character instead of a literal dot.',
      },
      {
        title: 'Escape a price string safely',
        code: `Input: $19.99\nOutput: \\$19\\.99`,
        note: 'Keeps the dollar sign and decimal point literal instead of regex syntax.',
      },
    ],
  },

  'bulk-generator': {
    description: `Running a single-item content generator fifty separate times for fifty product names is the same task fifty times over, and the tedious part isn't writing any one description, it's repeating an identical process fifty times in a row rather than handling the whole batch as one job. This tool takes a list of inputs and generates a distinct piece of content for each one in a single pass, rather than one item at a time. Useful for generating fifty unique product descriptions from a spreadsheet of product names in one batch, producing a full set of blog titles from a list of topics at once, or scaling any single-item content task up to however many inputs actually need covering.`,
    examples: [
      {
        title: 'Generate descriptions for a product list',
        code: `Input: ["Wireless Mouse", "USB-C Hub", "Laptop Stand"]\nOutput: 3 unique product descriptions, one per item`,
        note: 'Processes an entire list in one batch instead of one item at a time.',
      },
      {
        title: 'Produce blog titles from a topic list',
        code: `Input: ["email marketing", "cold outreach", "lead scoring"]\nOutput: 3 distinct blog post titles`,
        note: 'Scales a single-item generator up to however many inputs are supplied.',
      },
    ],
  },

  'psd-to-png': {
    description: `A PSD file with a transparent background needs Photoshop, or at least something that understands Photoshop's layer format, just to open it at all, which is rarely what's actually needed once a design is finished, usually the image just needs to drop into a website, a slide deck, or an email with its transparent background staying transparent rather than flattened to solid white the way a JPEG export would. This tool exports a PSD file as a PNG, keeping the same transparency intact in a format nearly anything can open without Photoshop installed. Useful for exporting a logo or icon with a see-through background for use on a website, handing off a finished design asset to someone without Photoshop, or flattening a layered PSD into a single image that still keeps its transparent edges.`,
    examples: [
      {
        title: 'Export a logo with a transparent background',
        code: `Input: logo.psd (transparent background)\nOutput: logo.png (transparency preserved)`,
        note: 'Keeps the see-through background instead of flattening it to white.',
      },
      {
        title: 'Hand off a design asset without Photoshop',
        code: `Input: banner-design.psd (multiple layers)\nOutput: banner-design.png (flattened, viewable anywhere)`,
        note: 'Opens in any image viewer without needing Photoshop installed.',
      },
    ],
  },

  'sentence-extractor': {
    description: `Splitting text into sentences on every period sounds simple until "Dr. Smith arrived at 3.5 mph near the U.S. border" runs through it, since a period after an abbreviation, inside a decimal number, or inside an initial isn't actually the end of a sentence, and a naive split breaks that single sentence into several meaningless fragments. This tool extracts actual sentences from a block of text, numbering each one and offering it for export, while telling a true sentence boundary apart from a period that only looks like one. Useful for reviewing a long document one sentence at a time during an edit, building a numbered list of individual claims from an article to fact-check separately, or exporting a text's sentences as a clean list for a translation or proofreading workflow.`,
    examples: [
      {
        title: 'Extract sentences without breaking on abbreviations',
        code: `Input: "Dr. Smith arrived at 3.5 mph near the U.S. border. He was late."\nOutput: 1. "Dr. Smith arrived at 3.5 mph near the U.S. border." 2. "He was late."`,
        note: 'Correctly ignores periods inside abbreviations and decimal numbers.',
      },
      {
        title: 'Build a numbered list for fact-checking',
        code: `Input: [long article]\nOutput: 1. ... 2. ... 3. ... (each claim numbered separately)`,
        note: 'Produces a clean, numbered list ready to review one sentence at a time.',
      },
    ],
  },

  'sitemap-urls-extractor': {
    description: `A sitemap isn't always a single flat list, a large site often has a sitemap index file that itself just points to several other sitemaps, and pulling every actual page URL out of that structure means following each of those referenced sitemaps in turn rather than reading only the top-level file and missing everything nested underneath it. This tool extracts every URL from an XML sitemap, following a sitemap index down into its individual sitemaps automatically, and outputs one flat, plain list of page URLs, ready to paste into another tool. Useful for pulling a complete URL list out of a sitemap index for a bulk link checker, exporting every page URL from a site for a spreadsheet-based audit, or generating a clean URL list to feed into a separate crawling or indexing tool.`,
    examples: [
      {
        title: 'Flatten a sitemap index into one URL list',
        code: `Input: sitemap-index.xml -> sitemap-1.xml, sitemap-2.xml\nOutput: [all URLs from both nested sitemaps, combined]`,
        note: 'Follows a sitemap index into its individual sitemaps automatically.',
      },
      {
        title: 'Export a plain URL list for a bulk checker',
        code: `Input: sitemap.xml (1,200 URLs)\nOutput: plain list of 1,200 URLs, one per line`,
        note: 'Produces a bare list ready to paste into another tool.',
      },
    ],
  },

  'currency-converter': {
    description: `A meter converts to the same number of feet today as it did last year and will next year too, but an exchange rate between two currencies changes constantly, sometimes meaningfully within a single day, which means a currency conversion using yesterday's cached rate can already be noticeably wrong by the time it's actually used for something that matters. This tool converts an amount between currencies using an up-to-date exchange rate fetched at the time of conversion, rather than a fixed ratio treated as though it never changes. Useful for converting a travel budget into local currency using today's actual rate rather than an outdated one, checking what a foreign invoice amount comes to before paying it, or converting a price between currencies for a quick comparison while shopping online.`,
    examples: [
      {
        title: "Convert a travel budget with today's rate",
        code: `Input: $1,500 USD -> EUR\nOutput: EUR 1,382 (rate fetched at conversion time)`,
        note: 'Uses a live rate instead of a fixed or outdated one.',
      },
      {
        title: 'Check a foreign invoice amount',
        code: `Input: JPY 250,000 -> USD\nOutput: $1,672`,
        note: 'Confirms what an invoice actually costs before paying it.',
      },
    ],
  },
};

export default FIX_BATCH_77;
