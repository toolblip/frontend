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

const FIX_BATCH_62: Record<string, FixBatchEntry> = {
  'color-luminance-calculator': {
    description: `WCAG's contrast ratio between two colors is actually built from a more basic number first, each color's own relative luminance, a single value describing how much light a color effectively reflects, calculated by weighting its red, green, and blue channels unevenly since the eye reads green as far brighter than an equal amount of blue. This tool calculates a single color's relative luminance directly, showing the number the WCAG contrast formula is actually built from rather than the final ratio between two colors. Useful for understanding why a specific color is pulling a contrast ratio up or down more than its lightness alone would suggest, debugging a custom contrast-ratio implementation by checking its luminance calculation against a known value, or seeing which color channel is actually driving a shade's luminance number the most.`,
    examples: [
      {
        title: "Calculate a single color's luminance",
        code: `Input: #4A90D9\nOutput: relative luminance: 0.253`,
        note: 'Shows the underlying value the WCAG contrast formula is built from.',
      },
      {
        title: 'Compare which channel drives luminance most',
        code: `Input: #00FF00 (pure green)\nOutput: relative luminance: 0.715 (green weighted far more heavily than red or blue)`,
        note: 'Reveals why green pixels read as much brighter than blue at the same intensity.',
      },
    ],
  },

  'image-format-converter': {
    description: `JPEG, PNG, WebP, and now AVIF all compress the exact same image differently, and the only real way to know which one actually looks best at a given file size is comparing them directly side by side rather than trusting a format's general reputation. This tool converts an image between JPEG, PNG, WebP, and AVIF with adjustable quality and a side-by-side preview, showing exactly how a quality setting actually changes the visible result before committing to it. Useful for comparing how the same photo looks and sizes across all four formats before choosing one for a website, fine-tuning a quality setting by seeing the visible difference directly next to the original, or converting to AVIF specifically for better compression than WebP on a platform that already supports it.`,
    examples: [
      {
        title: 'Compare formats side by side',
        code: `Input: photo.jpg\nOutput: photo.png (1.8 MB), photo.webp (420 KB), photo.avif (310 KB) - previewed side by side`,
        note: 'Shows visible quality and file size together before choosing a format.',
      },
      {
        title: 'Convert to AVIF for better compression',
        code: `Input: banner.png, quality: 80\nOutput: banner.avif (smaller than the equivalent WebP at the same visual quality)`,
        note: 'Uses the newer format where a platform already supports it.',
      },
    ],
  },

  'cors-header-generator': {
    description: `A browser blocking a frontend on one domain from calling an API hosted on a different one isn't a bug in either side's code, it's the browser's same-origin policy doing exactly what it's designed to do until the server explicitly opts in with the right CORS headers telling it which outside origins are actually allowed through. This tool generates Cross-Origin Resource Sharing headers for a web server, producing the specific header configuration that tells a browser which origins, methods, and headers a cross-origin request is actually permitted to use. Useful for fixing a browser console error blocked by CORS policy by generating the exact headers a backend needs to add, allowing one specific frontend domain rather than every origin for a more secure configuration, or configuring which HTTP methods a cross-origin request is actually allowed to make.`,
    examples: [
      {
        title: 'Fix a blocked CORS request',
        code: `Output:\nAccess-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Methods: GET, POST`,
        note: 'Allows one specific frontend domain instead of every origin.',
      },
      {
        title: 'Allow a custom header in cross-origin requests',
        code: `Output: Access-Control-Allow-Headers: Content-Type, Authorization`,
        note: 'Specifies which headers a cross-origin request is permitted to send.',
      },
    ],
  },

  'contrast-checker': {
    description: `Iterating through a handful of candidate text colors against the same fixed background during a design pass usually means checking each one separately, when the actual goal is simpler, finding out which of several options actually clears WCAG's bar rather than confirming just one color in isolation. This tool checks a text and background color pair against WCAG AA and AAA contrast requirements, making it fast to run several candidate colors through the same check while narrowing down a palette. Useful for testing a handful of candidate text colors against one background to see which ones actually pass, confirming a chosen color meets the stricter AAA standard once AA alone isn't enough, or double-checking a final color choice right before it gets locked into a design system.`,
    examples: [
      {
        title: 'Test several candidate colors at once',
        code: `Background: #FFFFFF\nCandidates: #767676 (4.5:1, passes AA), #999999 (2.8:1, fails), #595959 (6.8:1, passes AAA)\nOutput: #595959 clears both AA and AAA`,
        note: 'Narrows down several palette options against the same background quickly.',
      },
      {
        title: 'Confirm the stricter AAA standard',
        code: `Input: text #6B6B6B on background #FFFFFF\nOutput: contrast ratio 5.2:1 - passes AA, fails AAA (needs 7:1)`,
        note: "Flags a color that clears the lower bar but not the stricter one.",
      },
    ],
  },

  'unit-converter': {
    description: `A recipe using grams next to a temperature in Fahrenheit and a distance sign in kilometers all come from completely different measurement categories, and needing separate specialized tools for weight, temperature, and speed just to plan one trip or follow one recipe is more friction than the actual conversions deserve. This tool converts length, weight, temperature, speed, and more between metric and imperial units in one place, covering several measurement categories together rather than requiring a different specialized converter for each one. Useful for converting a recipe's weight measurements and oven temperature in the same sitting without switching tools, checking a speed limit sign and a distance both in unfamiliar units during international travel, or handling whatever everyday conversion actually comes up without first figuring out which specialized converter it technically belongs to.`,
    examples: [
      {
        title: "Convert a recipe's weight and temperature together",
        code: `Input: 250 g, 180°C\nOutput: 8.8 oz, 356°F`,
        note: 'Handles two different measurement categories in the same pass.',
      },
      {
        title: 'Convert a speed limit and distance while traveling',
        code: `Input: 100 km/h, 320 km\nOutput: 62.1 mph, 198.8 mi`,
        note: 'Covers speed and distance from one general tool instead of two specialized ones.',
      },
    ],
  },

  'number-base-converter': {
    description: `The number 202 looks completely different depending on which base it's written in, 11001010 in binary, CA in hex, 312 in octal, all describing the exact same quantity, and seeing all four representations of one value side by side is genuinely the fastest way to build an actual intuition for how positional number systems relate to each other. This tool converts a value between binary, decimal, hexadecimal, and octal instantly, displaying every base together rather than one conversion direction at a time. Useful for a student comparing how the same number looks across all four bases to understand the relationship between them, checking a hex color value's decimal equivalent while learning how the two connect, or seeing a binary flag's value across every base at once instead of converting one pair at a time.`,
    examples: [
      {
        title: 'See one number across all four bases',
        code: `Input: 202\nOutput: binary: 11001010, decimal: 202, hex: CA, octal: 312`,
        note: 'Shows every representation of the same value side by side.',
      },
      {
        title: "Compare a hex color's decimal equivalent",
        code: `Input: FF (hex)\nOutput: binary: 11111111, decimal: 255, octal: 377`,
        note: "Builds intuition for how a hex color channel relates to its decimal value.",
      },
    ],
  },

  'sql-prettifier': {
    description: `A SQL query dumped from an ORM's debug log usually comes out as one dense, barely readable line, and a multi-table JOIN with several conditions genuinely needs consistent indentation to actually follow which clause belongs to which part of the query, a structure that's invisible once everything gets flattened onto a single line. This tool formats and indents SQL queries with keyword highlighting and a customizable style, turning a dense query back into something with visible structure rather than one unreadable line. Useful for reading a query dumped from an ORM's debug output that came out as one unreadable line, formatting a complex multi-JOIN query so its structure is actually visible at a glance, or reformatting a query to match a specific team's preferred SQL style before it goes into a shared repository.`,
    examples: [
      {
        title: 'Format a query dumped from an ORM log',
        code: `Input: SELECT u.id,u.name,o.total FROM users u JOIN orders o ON u.id=o.user_id WHERE o.total>100\nOutput:\nSELECT u.id, u.name, o.total\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE o.total > 100`,
        note: 'Turns one dense line into a query with visible structure.',
      },
      {
        title: "Apply a team's preferred style",
        code: `Input: [same query], style: commas-first\nOutput:\nSELECT u.id\n     , u.name\n     , o.total\nFROM users u`,
        note: 'Matches a specific formatting convention before committing.',
      },
    ],
  },

  'color-mixer': {
    description: `Averaging two colors together in the most obvious way doesn't produce the same result a genuine blend mode would, multiply darkens toward the shared color, screen lightens, and each mode actually changes what an in-between shade ends up looking like rather than there being one single correct way to combine two colors. This tool mixes two or more colors together using adjustable blend modes, generating a new palette that reflects the specific blend chosen rather than a single fixed averaging method. Useful for creating a genuine in-between shade from two brand colors for a smooth gradient, exploring how two colors blend differently under several photo-editing-style blend modes for a design effect, or generating a small palette of intermediate shades between two anchor colors for a gradient design.`,
    examples: [
      {
        title: 'Blend two brand colors for a gradient',
        code: `Input: #FF6B35, #004E89, mode: normal\nOutput: #802F5F (midpoint blend)`,
        note: 'Creates a genuine in-between shade rather than a plain average.',
      },
      {
        title: 'Compare blend modes',
        code: `Input: #FF6B35, #004E89\nOutput: normal: #802F5F, multiply: #002310, screen: #FF8F9F`,
        note: 'Shows how the same two colors combine differently under each mode.',
      },
    ],
  },

  'list-randomizer': {
    description: `Picking a winner from a list of raffle entries, splitting a group of people into random teams, or reordering a set of interview questions so they don't always run in the exact same sequence all come down to one operation, shuffling a list into a genuinely random order rather than sorting it any particular way. This tool shuffles a list of items into random order with a one-click copy of the result, built entirely around randomizing rather than offering it as one mode buried among several sorting options. Useful for picking a random winner from a list of raffle or giveaway entries, splitting a group of names into randomly assigned teams by shuffling the list first, or randomizing the order of interview questions or presentation topics so they don't run identically every time.`,
    examples: [
      {
        title: 'Pick a random raffle winner',
        code: `Input: Jane, Mark, Priya, Alex, Sam\nOutput (shuffled): Priya, Sam, Jane, Alex, Mark -> winner: Priya`,
        note: 'Gives a genuinely random result instead of a predictable sort order.',
      },
      {
        title: 'Split a group into random teams',
        code: `Input: [16 names]\nOutput: shuffled list split into two teams of 8`,
        note: 'Randomizes assignment instead of grouping names in the order they were entered.',
      },
    ],
  },

  'uptime-calculator': {
    description: `Ninety-nine point nine percent uptime sounds close enough to perfect that it's easy to miss just how much downtime it actually allows, over eight hours a year, which only becomes obvious once that SLA percentage actually gets converted into real hours and minutes rather than left as an abstract number on a vendor's marketing page. This tool converts an SLA uptime percentage into actual downtime allowed per year, month, week, and day, turning a vague percentage into a concrete number worth comparing against an actual requirement. Useful for checking whether a cloud provider's SLA guarantee is actually good enough for a specific use case once it's converted into real hours, negotiating an SLA commitment by understanding exactly what a given percentage promises in practical terms, or setting an internal availability target and knowing exactly how much downtime margin that target actually leaves.`,
    examples: [
      {
        title: 'Convert an SLA percentage to real downtime',
        code: `Input: 99.9% uptime\nOutput: 8h 45m per year, 43m per month, 10m per week`,
        note: 'Turns an abstract percentage into concrete allowed downtime.',
      },
      {
        title: 'Compare two SLA tiers',
        code: `Input: 99.95% vs 99.99%\nOutput: 4h 22m/year vs 52m/year`,
        note: 'Shows the real-world gap between two SLA commitments that look similar on paper.',
      },
    ],
  },
};

export default FIX_BATCH_62;
