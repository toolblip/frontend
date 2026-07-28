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

const FIX_BATCH_88: Record<string, FixBatchEntry> = {
  'psd-to-ai': {
    description: `Handing a logo off to another designer who works in Illustrator calls for something more specific than a universal web vector format, an AI file that opens directly in Illustrator with its artboards, swatches, and layer structure intact, ready for further editing inside the same Adobe ecosystem rather than a generic SVG meant for a browser to render. This tool converts a PSD file into Adobe Illustrator's AI format, translating vector shape layers into editable Illustrator paths built for continued work inside Adobe's own tools. Useful for handing a logo design off to a colleague who'll refine it further in Illustrator, converting a PSD's vector layers into an AI file for a print production workflow built around Adobe software, or moving a design from Photoshop into Illustrator without flattening its editable vector paths.`,
    examples: [
      {
        title: 'Hand off a logo for further Illustrator editing',
        code: `Input: logo.psd (vector shape layers)\nOutput: logo.ai (editable Illustrator paths)`,
        note: 'Preserves editable vector paths for continued work in Illustrator.',
      },
      {
        title: 'Move a design into an Adobe print workflow',
        code: `Input: brochure-design.psd\nOutput: brochure-design.ai`,
        note: 'Keeps the file inside the Adobe ecosystem rather than a generic web format.',
      },
    ],
  },

  'split-csv': {
    description: `A CRM's bulk import capping at ten thousand rows, an email platform rejecting anything over a certain file size, these limits are common enough that splitting a large CSV is really about getting each piece under a platform's actual limit, not handling big data in the abstract, and a naive split by line count that leaves the header row only in the first chunk breaks every import after that one. This tool splits a large CSV into smaller files, repeating the header row at the top of every chunk so each piece imports correctly on its own. Useful for splitting a massive contact export into pieces that each fit under a bulk import tool's row limit, breaking up a large CSV so every file still opens correctly with its own header row, or preparing smaller files from one large export for a platform with a strict file size cap.`,
    examples: [
      {
        title: 'Fit under a bulk import row limit',
        code: `Input: contacts.csv (45,000 rows)\nOutput: contacts-part1.csv (10,000 rows + header), contacts-part2.csv (10,000 rows + header), ...`,
        note: 'Each chunk includes its own header row and imports correctly on its own.',
      },
      {
        title: 'Split for a strict file size cap',
        code: `Input: export.csv (80 MB)\nOutput: export-part1.csv (20 MB), export-part2.csv (20 MB), ...`,
        note: "Breaks a large export into pieces that each clear a platform's size limit.",
      },
    ],
  },

  'docker-compose-generator': {
    description: `Kubernetes is built for running a production cluster across multiple machines, replicas, services, ingress rules, considerably more than a local development setup actually needs, while Docker Compose does the much simpler job of describing a handful of containers, a web app, a database, a cache, that just need to talk to each other on one machine, started with a single command. This tool generates a Docker Compose YAML file for a multi-container application, built around common local development setups rather than production cluster orchestration. Useful for scaffolding a local Postgres and Redis setup alongside an app container in one YAML file, generating a starting Compose file for a common multi-container stack instead of writing the YAML by hand, or setting up a local development environment without reaching for Kubernetes' considerably heavier orchestration model.`,
    examples: [
      {
        title: 'Scaffold a local Postgres and Redis stack',
        code: `Output:\nservices:\n  app:\n    build: .\n  db:\n    image: postgres:16\n  cache:\n    image: redis:7`,
        note: 'Generates a working local multi-container setup in one file.',
      },
      {
        title: 'Start a common stack with one command',
        code: `Output: docker-compose up\n(starts app, db, and cache containers together)`,
        note: "Runs on one machine without Kubernetes' cluster-level complexity.",
      },
    ],
  },

  'robots-txt-editor': {
    description: `Analyzing an already-deployed robots.txt file answers whether its current rules are working as intended, but actually changing those rules is a different task, one where seeing the effect of an edit immediately, before it's saved, matters more than analyzing a finished file after the fact. This tool provides a visual interface for editing robots.txt rules, simulating how a crawler would respond to each change live as it's being made rather than only after the file is finalized. Useful for building a robots.txt file's rules visually while watching how each one affects crawler access in real time, testing a rule change's effect immediately before committing it to a live file, or authoring a new robots.txt from scratch with instant feedback on what each line actually blocks.`,
    examples: [
      {
        title: 'Watch crawler access update while editing',
        code: `Editing: Disallow: /admin\nLive result: /admin/* now blocked for all crawlers`,
        note: 'Shows the effect of a rule change immediately, before saving.',
      },
      {
        title: 'Author a new robots.txt from scratch',
        code: `Building: User-agent: *, Disallow: /private, Sitemap: https://example.com/sitemap.xml\nLive preview: shows exactly which paths are blocked`,
        note: 'Provides instant feedback while constructing the file visually.',
      },
    ],
  },

  'homoglyph-detector': {
    description: `A Cyrillic а and a Latin a render as pixel-identical characters in most fonts but are completely different code points to a computer, which is exactly what makes "аpple.com" with that Cyrillic а an entirely different domain from the real apple.com despite looking indistinguishable at a glance, a well-known phishing technique called an IDN homograph attack. This tool scans domain names and identifiers for suspicious script mixing and known lookalike character substitutions, flagging exactly which character doesn't belong before a spoofed domain gets mistaken for a real one. Useful for checking whether a suspicious-looking domain actually contains a lookalike character from a different script, auditing a list of identifiers for a homoglyph substitution hiding in plain sight, or verifying a domain is genuinely what it appears to be before trusting a link that looks correct.`,
    examples: [
      {
        title: 'Catch a Cyrillic lookalike domain',
        code: `Input: аpple.com (Cyrillic а, U+0430)\nOutput: warning - contains a non-Latin lookalike character`,
        note: 'Flags a script-mixing substitution invisible to the eye.',
      },
      {
        title: 'Audit a list of identifiers for substitutions',
        code: `Input: ["paypal.com", "paypaI.com"]\nOutput: "paypaI.com" flagged - capital I substituted for lowercase l`,
        note: 'Surfaces a lookalike character hiding in plain sight.',
      },
    ],
  },

  'image-format-converter': {
    description: `Committing to a lossy format's compression level sight unseen is a gamble, since the same quality setting that looks fine on one photo can visibly degrade a different one, and confirming that tradeoff actually requires seeing the compressed result sitting right next to the original before deciding it's acceptable. This tool converts an image between JPEG, PNG, WebP, and AVIF in any direction, with a quality slider and a side-by-side preview showing exactly what a given setting does before committing to it. Useful for comparing how the same photo compresses across several different formats before picking one, dialing in a JPEG or WebP quality level while watching the visible tradeoff update live, or converting between any pair of these formats without needing a separate single-purpose tool for each direction.`,
    examples: [
      {
        title: 'Compare compression across formats',
        code: `Input: photo.jpg\nOutput: photo.webp (side-by-side preview), photo.avif (side-by-side preview)`,
        note: 'Shows the visible quality tradeoff before committing to a format.',
      },
      {
        title: 'Dial in a quality setting live',
        code: `Input: photo.png, target: WebP, quality: 75%\nOutput: live preview updates as quality slider moves`,
        note: 'Lets the tradeoff be judged visually rather than guessed at.',
      },
    ],
  },

  'plagiarism-checker': {
    description: `Comparing two specific documents against each other is a narrower question than the one that actually matters before publishing something, whether phrases in a piece of writing match content that already exists somewhere out in the world, published articles, other websites, prior work, rather than just one document supplied for comparison. This tool scans text for matching phrases and distinctive word patterns that suggest it overlaps with existing published content, rather than comparing it against a single reference document. Useful for confirming a piece of writing is actually original before submitting it academically or publishing it online, checking a freelance submission for unintentional overlap with existing published material, or catching duplicate phrasing that could read as unoriginal before it goes live.`,
    examples: [
      {
        title: 'Confirm originality before publishing',
        code: `Input: [blog post draft]\nOutput: 3 matching phrases found in existing published content`,
        note: 'Checks against existing content rather than a single comparison document.',
      },
      {
        title: 'Check a freelance submission',
        code: `Input: [submitted article]\nOutput: 98% original, one flagged passage overlapping a published source`,
        note: 'Surfaces unintentional overlap before it goes live.',
      },
    ],
  },

  'aac-to-flac': {
    description: `Converting a lossy AAC file into lossless FLAC doesn't recover any quality that AAC's compression already discarded, once detail is gone during that original lossy encoding, no downstream conversion gets it back, it only repackages the same already-reduced audio into a larger, uncompressed container, which is worth knowing before expecting the FLAC file to sound noticeably better. This tool converts AAC audio into FLAC, useful for compatibility with software or hardware that specifically expects a FLAC container rather than as a way to improve audio quality that's already been lost. Useful for converting AAC into the FLAC format a specific piece of software or hardware requires, preparing an audio file for an archival system that only accepts FLAC containers, or matching a workflow's expected file format without mistaking the conversion for an actual quality upgrade.`,
    examples: [
      {
        title: 'Convert for a FLAC-only archival system',
        code: `Input: podcast-episode.aac\nOutput: podcast-episode.flac`,
        note: 'Matches a required container format rather than improving audio quality.',
      },
      {
        title: "Understand what the conversion doesn't do",
        code: `Input: song.aac (128kbps lossy)\nOutput: song.flac (larger file, same underlying audio quality)`,
        note: 'Repackages the already-lossy audio without recovering lost detail.',
      },
    ],
  },

  'english-dictionary': {
    description: `Generating a quick list of related words works fine for a thesaurus-style brainstorm, but it isn't the same as actually knowing what a word means, how it's pronounced, or which part of speech it is, the kind of full reference entry someone needs when the real question is a word's actual definition rather than a handful of alternatives to swap in. This tool looks up a word's full definition, part of speech, pronunciation guide, synonyms, and antonyms together, built as a complete reference entry rather than just a list of related terms. Useful for checking a word's actual meaning and pronunciation before using it in writing, looking up a full dictionary entry rather than just a quick synonym list, or confirming a word's part of speech when that distinction actually matters for a sentence.`,
    examples: [
      {
        title: "Look up a word's full definition and pronunciation",
        code: `Input: "ubiquitous"\nOutput: adjective, "present, appearing, or found everywhere", pronunciation: /juːˈbɪkwɪtəs/`,
        note: 'Provides the full reference entry, not just a list of alternatives.',
      },
      {
        title: 'Check synonyms alongside the formal definition',
        code: `Input: "meticulous"\nOutput: definition, part of speech: adjective, synonyms: careful, precise, thorough`,
        note: 'Combines definition and related words in one reference lookup.',
      },
    ],
  },

  'sql-to-json': {
    description: `A SQL result set carries types JSON was never designed to hold exactly, a DATETIME column, a DECIMAL value that needs to stay a decimal rather than lose precision as a floating-point number the way money values often do when converted carelessly, and a NULL that has to map cleanly onto JSON's own null rather than an empty string or a missing key. This tool converts SQL SELECT queries or their results into formatted JSON arrays, handling those type conversions deliberately rather than leaving decimal precision or null handling to chance. Useful for converting a query result containing decimal currency values into JSON without losing precision, turning a SELECT statement's output into a JSON array for an API response, or exporting database rows into JSON with NULL values mapped correctly rather than left ambiguous.`,
    examples: [
      {
        title: 'Preserve decimal precision for currency',
        code: `Input: SELECT price FROM products -> 19.99 (DECIMAL)\nOutput: [{ "price": "19.99" }]`,
        note: 'Keeps an exact decimal value rather than risking floating-point rounding.',
      },
      {
        title: 'Map SQL NULL to JSON null',
        code: `Input: SELECT middle_name FROM users -> NULL\nOutput: [{ "middle_name": null }]`,
        note: 'Converts NULL cleanly instead of leaving it as an empty string.',
      },
    ],
  },
};

export default FIX_BATCH_88;
