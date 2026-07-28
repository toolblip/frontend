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

const FIX_BATCH_26: Record<string, FixBatchEntry> = {
  'content-planner': {
    description: `Planning a month of content one post at a time means constantly re-deciding what to write about next, which topics were already covered recently, and whether the mix across different themes is actually balanced, all decisions that get harder to track the further out the calendar stretches. This tool builds out a content calendar across weeks or months at once, organizing topics, themes, and posting cadence into a structured plan rather than a running list decided post by post. Useful for mapping out a quarter's worth of blog topics before writing a single one, planning a content mix that actually balances different themes instead of drifting toward whatever's easiest to write that week, or handing a content calendar to someone else to execute against without explaining the reasoning behind every entry.`,
    examples: [
      {
        title: "Map out a quarter's worth of blog topics",
        code: `Input: niche: "personal finance", timeframe: 3 months\nOutput: 12 weekly topics organized across 4 recurring themes`,
        note: 'Plans topics and themes together rather than deciding one post at a time.',
      },
      {
        title: 'Balance recurring content themes',
        code: `Input: themes: "budgeting", "investing", "saving"\nOutput: rotating 3-week cycle across all three themes`,
        note: 'Keeps the content mix balanced instead of drifting toward one easy theme.',
      },
    ],
  },

  'curl-to-python': {
    description: `A curl command copied straight from a browser's network tab or an API's documentation is quick to test with, but turning it into actual Python means manually parsing out the URL, headers, and body from a single dense command-line string, a fiddly, error-prone translation to do by hand, especially once a command has a dozen headers stacked onto it. This tool converts a curl command directly into Python's requests library syntax, mapping headers, query parameters, and the request body into the equivalent Python arguments automatically. Useful for turning an API call copied from a browser's dev tools into working Python code without hand-transcribing every header, converting an example curl command from API documentation into a starting script, or debugging a request by comparing the generated Python against what the original curl command was actually doing.`,
    examples: [
      {
        title: 'Convert a curl command copied from dev tools',
        code: `Input: curl -X POST https://api.example.com/users -H "Authorization: Bearer abc123" -d '{"name":"Jane"}'\nOutput:\nimport requests\nresponse = requests.post(\n  "https://api.example.com/users",\n  headers={"Authorization": "Bearer abc123"},\n  json={"name": "Jane"}\n)`,
        note: 'Maps headers and the JSON body into the equivalent requests arguments automatically.',
      },
      {
        title: 'Convert a curl example from API docs',
        code: `Input: curl "https://api.example.com/search?q=widgets&limit=10"\nOutput:\nimport requests\nresponse = requests.get(\n  "https://api.example.com/search",\n  params={"q": "widgets", "limit": "10"}\n)`,
        note: 'Extracts query parameters into a params dictionary instead of a raw query string.',
      },
    ],
  },

  'mac-address-generator': {
    description: `The first three bytes of a MAC address aren't random, they identify the specific manufacturer that registered that block, which is exactly why a network inventory tool or a device-detection script can often tell "this looks like a Cisco device" or "this looks like an Apple device" just from the address prefix alone, before ever querying the device itself. This tool generates a MAC address in EUI-48, EUI-64, or a specific OUI vendor prefix, letting a test address mimic a particular manufacturer's numbering convention rather than producing something with no real-world pattern behind it. Useful for testing whether a device-detection script correctly identifies a vendor from its address prefix, generating a batch of addresses that resemble a specific hardware vendor for a test environment, or verifying an inventory system parses OUI prefixes correctly across different manufacturers.`,
    examples: [
      {
        title: "Generate an address matching a specific vendor's OUI",
        code: `Input: vendor: Cisco, format: EUI-48\nOutput: 00:1A:2B:3C:4D:5E (Cisco OUI prefix)`,
        note: 'Useful for testing whether a detection script correctly identifies the vendor from the prefix.',
      },
      {
        title: 'Generate an EUI-64 address for IPv6 testing',
        code: `Format: EUI-64\nOutput: 001A:2BFF:FE3C:4D5E`,
        note: 'EUI-64 is the longer format used when deriving part of an IPv6 address.',
      },
    ],
  },

  'jupyter-cleaner': {
    description: `A notebook that's been run interactively accumulates cell outputs, execution counts, and editor metadata that have nothing to do with the actual code, a printed dataframe, a matplotlib image encoded as base64, a cell run in a different order than it appears on the page, and none of that belongs in a git history where every rerun would otherwise produce a diff of noise instead of an actual code change. This tool strips all of that out completely, leaving only the source code and markdown cells behind, rather than reformatting the notebook while still keeping outputs in place. Useful for a pre-commit step that guarantees a clean notebook goes into version control, sharing a notebook as a template without last session's specific output values baked in, or resetting a notebook back to a clean state before handing it to someone else to run themselves.`,
    examples: [
      {
        title: 'Strip outputs before committing to git',
        code: `Input: analysis.ipynb (contains printed dataframes and a base64 plot image)\nOutput: analysis.ipynb (source and markdown only, no outputs or execution counts)`,
        note: 'Prevents rerun output changes from producing noisy diffs in version control.',
      },
      {
        title: 'Reset a notebook to a clean template',
        code: `Input: workshop-exercise.ipynb (run through, with results filled in)\nOutput: workshop-exercise.ipynb (clean slate, ready to hand out and rerun)`,
        note: "Removes last session's specific output values before sharing as a template.",
      },
    ],
  },

  'psd-to-ai': {
    description: `PNG and SVG both flatten a Photoshop file's structure in different ways, one into pixels, the other into generic vector paths, but a designer who needs to keep working on a piece specifically inside Illustrator needs the file in AI format, with shapes and paths that open as editable Illustrator objects rather than a flattened image or a vector file built around a different program's assumptions. This tool converts a PSD directly into AI, preserving shape and path data as genuine, editable Illustrator vectors. Useful for moving a logo or illustration built in Photoshop over to Illustrator to continue refining it there, handing off a PSD-based design to a team that works primarily in Illustrator, or converting artwork into the one vector format that keeps it fully editable in the specific tool it needs to live in next.`,
    examples: [
      {
        title: 'Move a logo from Photoshop into Illustrator',
        code: `Input: logo-mockup.psd (shape layers, text)\nOutput: logo-mockup.ai (editable Illustrator paths and text)`,
        note: 'Keeps shapes as genuine editable Illustrator objects rather than a flattened image.',
      },
      {
        title: 'Hand off artwork to an Illustrator-based team',
        code: `Input: illustration.psd\nOutput: illustration.ai`,
        note: 'Delivers the format a team working primarily in Illustrator can continue editing directly.',
      },
    ],
  },

  'split-csv': {
    description: `A single CSV file with a few hundred thousand rows can be too large for a spreadsheet program to open smoothly, too big for an import tool with a row limit, or simply unwieldy to hand off in one piece when only a portion is actually needed at a time. This tool splits a large CSV into smaller files, by a set number of rows per file or a target file size, keeping the header row intact across each resulting piece rather than losing column labels after the first file. Useful for breaking a huge export down into chunks a spreadsheet tool can actually open without stalling, splitting a dataset into batches for an import tool with a row-count limit, or dividing a large file into more manageable pieces before sharing it with several people who each only need part of it.`,
    examples: [
      {
        title: 'Split a large export by row count',
        code: `Input: sales-data.csv (500,000 rows)\nOutput: sales-data-part1.csv, sales-data-part2.csv (50,000 rows each, header included in every file)`,
        note: 'Keeps the header row intact in each resulting file rather than only the first.',
      },
      {
        title: 'Split a file to fit an import size limit',
        code: `Input: contacts.csv (80 MB), target: 10 MB per file\nOutput: 8 files, each under the 10 MB limit`,
        note: 'Splits by target file size for a tool with a strict upload limit.',
      },
    ],
  },

  'docker-compose-generator': {
    description: `Writing a docker-compose.yml from a blank file means remembering the exact structure for service definitions, port mappings, volume mounts, and environment variables, and YAML's whitespace sensitivity turns a small indentation slip into a file that fails to parse with an error that doesn't always point clearly at the actual problem. This tool builds a docker-compose file from common templates, a web app with a database, a full stack with a cache layer included, generating the structure with services, ports, volumes, and environment variables already wired together correctly rather than starting from an empty file and hand-indenting everything. Useful for scaffolding a new multi-container project's compose file quickly, getting a working starting point for a common stack like a web app paired with a database, or avoiding a YAML indentation mistake that would otherwise take longer to debug than to write correctly the first time.`,
    examples: [
      {
        title: 'Scaffold a web app with a database',
        code: `Template: web app + PostgreSQL\nOutput: docker-compose.yml with app and db services, port mapping, and a persistent volume for the database`,
        note: 'Wires the services together correctly instead of starting from a blank file.',
      },
      {
        title: 'Add a cache layer to an existing stack',
        code: `Template: web app + database + Redis cache\nOutput: docker-compose.yml with a redis service added, correctly indented alongside the others`,
        note: 'Avoids a YAML indentation mistake that would otherwise silently break the file.',
      },
    ],
  },

  'robots-txt-editor': {
    description: `Testing whether a robots.txt change actually does what it's supposed to usually means saving the file, deploying it, and checking later whether a crawler behaves the way the new rule intended, a slow loop for something that should be quick to verify. This tool closes that loop directly: edit robots.txt rules visually, and watch a live crawler simulation update immediately with each change, showing exactly which paths would be allowed or blocked before the file ever gets saved or published. Useful for iterating on a new Disallow rule until it targets exactly the right path without also catching something it shouldn't, building a robots.txt from scratch with immediate feedback at every step, or fixing an existing rule and confirming the fix actually works before it goes live.`,
    examples: [
      {
        title: 'Iterate on a Disallow rule with live feedback',
        code: `Editing: Disallow: /admin\nSimulation updates live: /admin/settings blocked, /administrator not blocked`,
        note: 'Shows the simulation update immediately as the rule is being written.',
      },
      {
        title: 'Confirm a fix before publishing',
        code: `Before: Disallow: / (blocks entire site)\nAfter edit: Disallow: /private/\nSimulation: only /private/ paths blocked now`,
        note: 'Verifies the fix actually works before the file gets saved or deployed.',
      },
    ],
  },

  'homoglyph-detector': {
    description: `A lowercase Latin "a" and a Cyrillic "а" look completely identical in most fonts but are two entirely different characters as far as a computer is concerned, which is exactly the trick behind a homoglyph attack: registering a domain or an identifier that looks like a trusted one to a human eye while actually being a different string a system would treat as unrelated. This tool scans a domain name or identifier for exactly that kind of lookalike character substitution, flagging any character that visually resembles a different one from another alphabet or script rather than trusting that what looks right actually is right. Useful for checking a domain before trusting a link that looks like a known brand, auditing a list of registered identifiers for a sneaked-in lookalike character, or verifying a username or domain is actually built entirely from the character set it appears to use.`,
    examples: [
      {
        title: 'Catch a lookalike character in a domain',
        code: `Input: "аpple.com" (Cyrillic "а")\nFlagged: character 1 is Cyrillic U+0430, not Latin "a"`,
        note: 'Looks visually identical to the real domain but is a completely different string.',
      },
      {
        title: 'Audit a list of registered usernames',
        code: `Input: "admin", "аdmin" (mixed script)\nFlagged: second entry contains a non-Latin lookalike character`,
        note: 'Surfaces an entry built to visually impersonate a legitimate one.',
      },
    ],
  },

  'image-format-converter': {
    description: `Choosing between JPEG, PNG, WebP, and AVIF usually comes down to a tradeoff that's hard to judge just by looking at file size numbers side by side, since the same photo can look noticeably different at a matched size depending on which format's compression handles that specific image best. This tool converts between all four formats with quality adjustable per conversion, and shows a side-by-side preview so the actual visual result, not just the resulting file size, can be judged before committing to one. Useful for comparing how the same photo holds up across all four formats before deciding which to actually ship, fine-tuning a quality setting until a smaller file still looks acceptably sharp, or converting a single source image into several formats at once to serve different browsers their best-supported option.`,
    examples: [
      {
        title: 'Compare all four formats at a matched file size',
        code: `Input: photo.jpg (400 KB)\nOutput: photo.png (1.1 MB), photo.webp (250 KB), photo.avif (180 KB), all at comparable visual quality`,
        note: 'Side-by-side preview shows the actual visual difference, not just the file size number.',
      },
      {
        title: 'Generate multiple formats from one source',
        code: `Input: hero-image.png\nOutput: hero-image.webp, hero-image.avif, hero-image.jpg`,
        note: 'Produces several formats at once to serve each browser its best-supported option.',
      },
    ],
  },
};

export default FIX_BATCH_26;
