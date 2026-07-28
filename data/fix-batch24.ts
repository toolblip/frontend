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

const FIX_BATCH_24: Record<string, FixBatchEntry> = {
  'psd-to-pdf': {
    description: `A PNG flattens a PSD into one image, which is fine for the web but the wrong format the moment a design comp needs to go to someone without Photoshop for review, sign-off, or printing, since a PDF opens universally, supports multiple pages or artboards in one file, and lets a client mark up comments directly on the page rather than describing feedback over email. This tool converts a PSD into PDF, preserving layer visibility and transparency in the flattened result, and combining multiple artboards into a single multi-page document rather than exporting each one as a separate image. Useful for sending a multi-screen design comp to a client for approval, printing a design proof at actual size, or sharing a PSD-based layout with someone who has no design software installed at all.`,
    examples: [
      {
        title: 'Send a multi-screen design comp for client review',
        code: `Input: app-mockup.psd (3 artboards: home, profile, settings)\nOutput: app-mockup.pdf (3-page document, one artboard per page)`,
        note: 'Combines multiple artboards into one shareable multi-page document.',
      },
      {
        title: 'Share a design with someone who has no design software',
        code: `Input: poster-design.psd\nOutput: poster-design.pdf (opens in any PDF viewer)`,
        note: 'Lets a client mark up comments directly on the page instead of describing feedback by email.',
      },
    ],
  },

  'bmi-calculator': {
    description: `BMI isn't calculated the same way in both unit systems: metric divides weight in kilograms by height in meters squared directly, while the imperial version needs an extra 703 multiplier folded in to get an equivalent result from weight in pounds and height in inches, a detail that trips up a from-scratch calculation done by hand in whichever system isn't the formula's native one. This tool calculates BMI correctly in either metric or imperial input, without needing to convert units first or remember the extra constant imperial requires. It's worth being upfront about what BMI actually measures: a population-level screening ratio that doesn't distinguish muscle from fat, so an individual result, especially for someone very muscular or otherwise atypical, is a starting reference point rather than a precise verdict on health. Useful for a quick standard BMI reading in whichever unit system is more natural to think in.`,
    examples: [
      {
        title: 'Calculate BMI in metric units',
        code: `Input: 70 kg, 1.75 m\nOutput: BMI: 22.9`,
        note: 'Uses the direct metric formula: weight in kilograms divided by height in meters squared.',
      },
      {
        title: 'Calculate BMI in imperial units',
        code: `Input: 154 lbs, 68 in\nOutput: BMI: 23.4`,
        note: 'Applies the 703 multiplier the imperial formula requires that metric does not need.',
      },
    ],
  },

  'css-class-generator': {
    description: `Writing a custom CSS rule for every spacing value, font size, and flex layout a project needs means the same handful of properties get redefined slightly differently across dozens of classes, padding: 15px in one place, padding: 16px in another, purely because nobody's tracking a consistent scale. A utility-first approach fixes that by generating a defined set of small, single-purpose classes instead, p-4 for a consistent padding step, text-lg for a set type size, flex items-center for a common layout pattern, reusable across an entire project rather than reinvented per component. This tool generates that set of utility classes for spacing, typography, color, and flexbox without adopting a full framework like Tailwind, just the classes and the consistent scale behind them. Useful for a project that wants utility-class convenience without pulling in an entire framework's build tooling.`,
    examples: [
      {
        title: 'Generate a consistent spacing scale',
        code: `Output: .p-1 { padding: 4px; } .p-2 { padding: 8px; } .p-4 { padding: 16px; }`,
        note: 'Produces a defined scale instead of ad hoc padding values scattered across a stylesheet.',
      },
      {
        title: 'Generate flexbox utility classes',
        code: `Output: .flex { display: flex; } .items-center { align-items: center; } .justify-between { justify-content: space-between; }`,
        note: 'Gives reusable layout classes without adopting a full utility framework.',
      },
    ],
  },

  'paragraph-rewriter': {
    description: `Sometimes only one paragraph in an otherwise finished piece feels off, a section that repeats a word too many times, a sentence structure that reads clunkier than the rest of the draft, phrasing that just doesn't sit right on a second read, while the rest of the document is fine and doesn't need touching. This tool rewrites a single paragraph in isolation, keeping the same meaning while reworking the wording and sentence structure, without pulling in the surrounding context or rewriting anything beyond the one section that actually needs it. Useful for fixing one rough paragraph in an otherwise finished draft without disturbing the rest, trying a different phrasing for one specific section before committing to it, or reworking a paragraph that reads repetitively compared to the writing around it.`,
    examples: [
      {
        title: 'Fix one repetitive paragraph in a draft',
        code: `Input: "The results show improvement. The results also show consistency. The results indicate reliability."\nOutput: "The results show improvement, consistency, and reliability across the board."`,
        note: 'Rewrites just the one section without touching the rest of the document.',
      },
      {
        title: 'Try an alternate phrasing for one section',
        code: `Input: [one clunky paragraph from a longer report]\nOutput: reworded version with the same meaning and smoother phrasing`,
        note: 'Isolated to a single paragraph rather than reworking the whole document.',
      },
    ],
  },

  'csv-to-xml': {
    description: `Plenty of older enterprise systems, SOAP-based APIs, and legacy data interchange formats still expect XML specifically and won't take a JSON payload no matter how well-structured it is, which is a real constraint when the data on hand started life as a spreadsheet export. This tool converts CSV rows into XML, mapping each column to its own XML element automatically and wrapping each row in a consistent parent element, rather than requiring the structure to be defined by hand for every field. Useful for feeding a spreadsheet export into a legacy system that only accepts XML input, preparing data for a SOAP API that has no JSON option at all, or converting a CSV report into XML for an older tool in a pipeline that was never updated to read anything newer.`,
    examples: [
      {
        title: 'Convert a spreadsheet export for a legacy system',
        code: `Input CSV: name,age\\nAlice,30\nOutput:\n<records>\n  <record>\n    <name>Alice</name>\n    <age>30</age>\n  </record>\n</records>`,
        note: 'Maps each column to its own XML element automatically.',
      },
      {
        title: 'Prepare data for a SOAP API',
        code: `Input CSV: order_id,total\\n1042,89.50\nOutput: <records><record><order_id>1042</order_id><total>89.50</total></record></records>`,
        note: 'SOAP APIs typically require XML input with no JSON option available.',
      },
    ],
  },

  'http-status-codes': {
    description: `Most status codes that show up day to day are the same handful, 200, 404, 500, but every so often something unfamiliar turns up in a log, a 429 rate limit response, a 451 blocked for legal reasons, a 507 insufficient storage, and figuring out what an uncommon code signals means either guessing from context or searching for it separately every time it comes up. This tool is a browsable reference covering every standard status code, organized by category, informational, success, redirection, client error, server error, with a plain explanation of what each one signals, including codes rare enough to never quite stick in memory. Useful for looking up a code that just appeared in a log, confirming what an unfamiliar response actually means before writing error-handling logic around it, or browsing a category to see the full range of options for a specific kind of response.`,
    examples: [
      {
        title: 'Look up an unfamiliar rate-limit response',
        code: `Lookup: 429 Too Many Requests -> "client has sent too many requests in a given time"`,
        note: 'Explains a code that shows up rarely enough to never quite stick in memory.',
      },
      {
        title: 'Understand a rare legal-block response',
        code: `Lookup: 451 Unavailable For Legal Reasons -> "resource is unavailable due to a legal demand"`,
        note: 'Covers uncommon codes alongside the everyday 200s, 400s, and 500s.',
      },
    ],
  },

  'cmyk-to-rgb': {
    description: `A CMYK value from a print spec sheet, a Pantone reference, or a design file built for a print run doesn't tell you anything about how that same color should look on a screen, since CMYK describes how ink mixes on paper and RGB describes how light mixes on a display, two fundamentally different processes that happen to both produce color. This tool converts a CMYK value into its RGB and hex equivalents, so a brand color specified for print can be reproduced correctly in a digital context, a website, an app, a digital ad, instead of guessing at an RGB value that only approximately matches. Useful for extending a brand's print color specification into a website's stylesheet, matching a Pantone-referenced brand color in a digital design tool, or converting a printed brochure's color values for a matching digital campaign.`,
    examples: [
      {
        title: 'Convert a print brand color for a website',
        code: `Input: cmyk(84%, 58%, 0%, 8%)\nOutput: #2563EB`,
        note: 'Lets a print-specified brand color be reproduced correctly in a digital context.',
      },
      {
        title: 'Match a Pantone-referenced color digitally',
        code: `Input: cmyk(0%, 76%, 81%, 0%)\nOutput: #FF3B30`,
        note: 'Converts a print color specification into the hex value a design tool or stylesheet needs.',
      },
    ],
  },

  'regex-pattern-generator': {
    description: `Choosing from a preset list of common patterns, email, phone, URL, works fine until the actual requirement is something more specific that doesn't fit any of those categories, match a product code that starts with two letters followed by four digits, or a username that has to start with a letter and can't end in an underscore. This tool takes a plain-language description of a custom requirement and generates the actual pattern for it, rather than offering a fixed menu of common cases to pick from and adjust. Useful for generating a pattern for a genuinely custom validation rule described in a sentence rather than picked from a preset list, or getting a working starting pattern for an unusual requirement without hand-writing the character classes from scratch.`,
    examples: [
      {
        title: 'Generate a pattern from a custom description',
        code: `Input: "match a product code with 2 letters followed by 4 digits"\nOutput: ^[A-Z]{2}\\d{4}$`,
        note: 'Handles a specific custom rule rather than picking from a fixed preset list.',
      },
      {
        title: 'Generate a pattern with multiple constraints',
        code: `Input: "match a username starting with a letter, not ending in an underscore"\nOutput: ^[A-Za-z][A-Za-z0-9_]*[^_]$`,
        note: 'Builds a pattern for a rule with more than one condition described in plain language.',
      },
    ],
  },

  'cors-header-generator': {
    description: `Getting CORS headers wrong is a common source of a request that fails silently from the browser's side with no useful error beyond "blocked by CORS policy," and one specific mistake trips people up constantly: setting Access-Control-Allow-Origin to a wildcard while also trying to send credentials, which browsers actually reject outright, since a wildcard origin combined with credentials would defeat the entire point of the restriction. This tool generates the correct set of CORS headers for a server, Access-Control-Allow-Origin, -Methods, -Headers, and -Credentials, configured to work together correctly rather than producing a combination a browser will silently refuse to honor. Useful for setting up CORS on a new API that needs to accept requests from a specific frontend origin, or debugging why a request with credentials is being blocked despite headers that look correct at a glance.`,
    examples: [
      {
        title: 'Allow a specific frontend origin with credentials',
        code: `Access-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Credentials: true`,
        note: "Uses a specific origin instead of a wildcard, since browsers reject '*' combined with credentials.",
      },
      {
        title: 'Allow specific methods and headers',
        code: `Access-Control-Allow-Methods: GET, POST, PUT\nAccess-Control-Allow-Headers: Content-Type, Authorization`,
        note: 'Explicitly lists what a cross-origin request is allowed to use.',
      },
    ],
  },

  'slug-permalink-checker': {
    description: `Publishing a new page under a slug that's already in use somewhere else on the site either creates a silent conflict or forces an awkward numbered suffix onto the URL, neither of which anyone wants to discover after the page is already live and possibly linked to from somewhere else. This tool checks whether a specific slug is actually available before a new page goes live, similar to a username availability check, and also looks at the broader permalink structure a site is using, whether it's date-based, flat, or organized by category, to flag a new URL that doesn't match the pattern the rest of the site already follows. Useful for confirming a slug is free before publishing a new post, or catching a URL structure inconsistency before it becomes another oddly-formatted permalink among otherwise consistent ones.`,
    examples: [
      {
        title: 'Check if a slug is already in use',
        code: `Input: /blog/best-running-shoes\nResult: taken, already used by an existing post`,
        note: 'Flags a conflict before a new page goes live under a duplicate slug.',
      },
      {
        title: "Flag a slug that doesn't match the site's structure",
        code: `Input: /blog/best-running-shoes (site pattern: /blog/2026/category/title)\nResult: flagged, inconsistent with the rest of the site's date-based structure`,
        note: "Catches a URL that would stick out from the site's otherwise consistent permalink pattern.",
      },
    ],
  },
};

export default FIX_BATCH_24;
