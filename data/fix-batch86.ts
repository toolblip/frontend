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

const FIX_BATCH_86: Record<string, FixBatchEntry> = {
  'csv-to-xml': {
    description: `A JSON key can be almost any quoted string, spaces and all, but an XML element name has real rules, it can't start with a number, can't contain a space, and can't include several special characters, which means a CSV header like "First Name" or "2024 Total" has to be sanitized into something like First_Name or Total_2024 before it can even become a valid tag, a wrinkle JSON conversion never has to deal with. This tool converts CSV into XML, automatically turning each column header into a valid XML element name and each row into a properly nested, correctly closed element structure. Useful for converting a CSV export with spaced or number-led column headers into valid XML tags automatically, turning spreadsheet rows into properly nested XML elements for a system that expects that structure, or generating XML from CSV data without manually sanitizing every column name by hand.`,
    examples: [
      {
        title: 'Sanitize a spaced header into a valid tag',
        code: `Input CSV header: "First Name"\nOutput XML: <First_Name>Jane</First_Name>`,
        note: 'Converts a header XML would otherwise reject into a valid element name.',
      },
      {
        title: 'Convert rows into nested elements',
        code: `Input CSV:\nid,name\n1,Widget\nOutput XML:\n<row><id>1</id><name>Widget</name></row>`,
        note: 'Produces properly nested, correctly closed XML elements from each row.',
      },
    ],
  },

  'http-status-codes': {
    description: `Everyone already knows what 404 means, but the codes that actually cause confusion during real debugging are the ones that look interchangeable and aren't, 401 means a request isn't authenticated at all, 403 means it is but still isn't allowed, and getting back the wrong one from your own API can send whoever's debugging it down entirely the wrong path. This tool provides a full reference of HTTP status codes with their meanings, categories, and common real-world use cases, covering the less obvious codes alongside the famous ones. Useful for figuring out whether an API should actually return 401 or 403 for a specific failure case, distinguishing a 429 rate limit from a 503 temporary outage when debugging a failed request, or looking up an unfamiliar status code's actual meaning before deciding how to handle it in code.`,
    examples: [
      {
        title: 'Distinguish 401 from 403',
        code: `401: "not authenticated - no valid credentials provided"\n403: "authenticated but not permitted to access this resource"`,
        note: 'Clarifies two codes that look similar but signal different problems.',
      },
      {
        title: 'Tell a rate limit apart from an outage',
        code: `429: "too many requests - rate limit exceeded"\n503: "service temporarily unavailable"`,
        note: 'Distinguishes a client-side throttling issue from a server-side outage.',
      },
    ],
  },

  'cmyk-to-rgb': {
    description: `A brand that started as a printed product or a packaging design often has its actual color defined in CMYK first, a value from a print vendor's spec sheet or a physical brand guideline, and the first time that same brand needs a website or a digital app, that print-native color has to be translated into RGB and HEX before it means anything to a browser or a design tool built for screens. This tool converts CMYK color values into RGB and HEX, translating a print-first color definition into the format screen-based design actually uses. Useful for translating a printed brand guideline's CMYK values into HEX for a new digital style guide, checking how a packaging design's ink-based color will actually display on a screen, or converting a Pantone-adjacent CMYK spec into RGB for a website's first color palette.`,
    examples: [
      {
        title: 'Translate a print spec into a digital style guide',
        code: `Input: C: 20%, M: 90%, Y: 70%, K: 5%\nOutput: RGB(196, 43, 66) / #C42B42`,
        note: 'Converts a print vendor spec into HEX for a website style guide.',
      },
      {
        title: 'Check how a packaging color displays on screen',
        code: `Input: C: 0%, M: 0%, Y: 0%, K: 100%\nOutput: RGB(35, 31, 32) / #231F20`,
        note: 'Shows the actual screen equivalent of an ink-based color definition.',
      },
    ],
  },

  'regex-pattern-generator': {
    description: `Describing what a pattern needs to match in a plain sentence, an email address, a phone number in a specific format, and getting back working regex text is a fundamentally different interaction than clicking together pattern pieces in a visual, node-based builder, one starts from language, the other starts from a UI, and which one actually fits depends on whether typing a description or assembling pieces visually feels more natural for a given moment. This tool generates a regex pattern directly from a natural language description, producing ready-to-use pattern text rather than requiring pieces to be assembled through a visual interface. Useful for typing "matches a US phone number" and getting a working pattern back immediately, generating a pattern for a common format like an email or a URL without knowing regex syntax by heart, or getting a starting pattern from a plain description to refine further by hand.`,
    examples: [
      {
        title: 'Generate a pattern from a plain description',
        code: `Input: "matches a US phone number"\nOutput: /^\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$/`,
        note: 'Produces working pattern text directly from a natural language request.',
      },
      {
        title: 'Generate a common format pattern',
        code: `Input: "matches an email address"\nOutput: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/`,
        note: 'Skips needing to already know regex syntax for a common format.',
      },
    ],
  },

  'cors-header-generator': {
    description: `Setting Access-Control-Allow-Origin to a wildcard and also trying to allow credentialed requests at the same time looks like it should work but doesn't, browsers actually reject that specific combination outright, a well-known but easy-to-hit CORS gotcha that silently breaks an authenticated cross-origin request rather than throwing an obvious error explaining why. This tool generates a complete, consistent set of CORS headers, origin, methods, headers, and credentials together, avoiding invalid combinations like a wildcard origin paired with allowed credentials. Useful for generating CORS headers for an API that needs to allow credentialed requests without accidentally combining them with a wildcard origin, configuring exactly which methods and headers a cross-origin request is allowed to use, or debugging why a browser is silently blocking a cross-origin request despite headers that look correct at a glance.`,
    examples: [
      {
        title: 'Avoid the wildcard-plus-credentials mistake',
        code: `Input: allow credentials: true\nOutput: Access-Control-Allow-Origin: https://app.example.com (not "*")`,
        note: 'Prevents an invalid combination browsers silently reject.',
      },
      {
        title: 'Configure allowed methods and headers together',
        code: `Output:\nAccess-Control-Allow-Methods: GET, POST, PUT\nAccess-Control-Allow-Headers: Content-Type, Authorization`,
        note: 'Generates a consistent header set rather than one header at a time.',
      },
    ],
  },

  'slug-permalink-checker': {
    description: `A single slug's text can be perfectly clean and still fit badly into a site's actual permalink structure, whether URLs follow a flat pattern like /blog/post-title or a dated one like /blog/2024/03/post-title is a site-wide decision, and confirming a specific slug is both available and consistent with that structure is a different check than just cleaning up a title into a slug in isolation. This tool checks whether a URL slug is already in use and evaluates how it fits into a site's broader permalink pattern. Useful for confirming a planned slug isn't already taken before publishing a new page, checking whether a URL path is consistent with a site's existing permalink structure, or auditing a set of planned URLs against both availability and structural consistency before they go live.`,
    examples: [
      {
        title: 'Check slug availability before publishing',
        code: `Input: /blog/why-seo-still-matters\nOutput: available`,
        note: 'Confirms the exact URL is not already in use before a page goes live.',
      },
      {
        title: "Check consistency with a site's permalink pattern",
        code: `Input: /blog/2024/03/post-title, site pattern: flat (/blog/post-title)\nOutput: warning - doesn't match the site's existing flat permalink structure`,
        note: 'Flags a URL that breaks from the structure the rest of the site follows.',
      },
    ],
  },

  'lorem-ipsum-detector': {
    description: `Placeholder text comes in more than one flavor, a bracketed [INSERT TEXT HERE] marker reads nothing like the specific, recognizable Latin vocabulary of actual lorem ipsum, dolor sit amet, consectetur adipiscing, and a detector built to recognize that particular fixed pattern catches it reliably even when it's been lightly reworded, rather than only flagging obvious, unedited copy-paste blocks. This tool specifically detects lorem ipsum's distinctive Latin text pattern within a document and flags it for removal. Useful for catching lorem ipsum specifically left behind in a design mockup that made it into production, confirming a document is actually free of the classic Latin placeholder text before publishing, or scanning a large document for lingering lorem ipsum that survived several rounds of edits.`,
    examples: [
      {
        title: 'Catch classic lorem ipsum left in production',
        code: `Input: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."\nOutput: flagged - matches standard lorem ipsum text`,
        note: "Recognizes the specific Latin pattern even if it's been lightly edited.",
      },
      {
        title: 'Confirm a document is free of lorem ipsum',
        code: `Input: [final draft]\nOutput: no lorem ipsum detected`,
        note: 'Verifies placeholder Latin text is fully cleared before publishing.',
      },
    ],
  },

  'color-blindness-simulator': {
    description: `Red-green color blindness is the most common type by far, but it isn't the only one, and a design that carefully avoids a risky red-green pairing can still be genuinely unreadable to someone with the much rarer blue-yellow type if that specific pairing was never actually checked, since fixing for one type of color vision deficiency doesn't automatically fix for another. This tool simulates how colors actually appear across several distinct types of color vision deficiency, rather than only the most common one. Useful for checking a color palette against both red-green and blue-yellow color blindness before finalizing a design, confirming a chart's color coding is still distinguishable to someone with a less common type of color vision deficiency, or auditing an entire UI's color choices across multiple types of color blindness rather than just the most familiar one.`,
    examples: [
      {
        title: 'Check a red-green pairing',
        code: `Input: #E63946 (red), #2A9D8F (green)\nOutput (deuteranopia): both render as a similar brownish-yellow`,
        note: 'Shows the most common type of color vision deficiency struggling with this pairing.',
      },
      {
        title: 'Check a less common type',
        code: `Input: #2563EB (blue), #F7C548 (yellow)\nOutput (tritanopia): both render as a similar pink-gray`,
        note: 'Reveals a pairing problem the more common red-green check would miss.',
      },
    ],
  },

  'crop-circle': {
    description: `A circular crop doesn't just trim a square photo's edges, it discards its corners entirely, so a face perfectly centered in a square crop can still end up with an ear or a chin clipped once that same photo is masked into a circle, a problem invisible until the circular shape is actually applied. This tool crops an image into a circle or an oval, showing exactly where the circular mask falls so a subject stays properly centered within it rather than just within the square crop behind it. Useful for cropping a profile photo so a face stays fully inside the circular mask a chat app or a social platform will actually display, creating an avatar that doesn't clip anything important at the edges, or previewing how a square photo will look once it's masked into a circle before committing to the crop.`,
    examples: [
      {
        title: 'Keep a face centered inside the circular mask',
        code: `Input: photo.jpg (square crop, face near top edge)\nOutput: preview shows chin clipped by the circle`,
        note: 'Reveals a clipping issue invisible in the square crop alone.',
      },
      {
        title: 'Create an avatar for a chat app',
        code: `Input: headshot.jpg\nOutput: headshot-circle.png (transparent corners, circular mask)`,
        note: 'Matches the circular display mask most chat apps apply to avatars.',
      },
    ],
  },

  'mov-to-wav': {
    description: `Extracting audio as MP3 is fine for casual listening, but MP3's compression is lossy, and running it through several more rounds of editing, cleaning up dialogue, adjusting levels, adding effects, compounds that quality loss the same way repeatedly re-saving a JPEG does, which is exactly why serious audio editing starts from an uncompressed source instead. This tool extracts a MOV file's audio as WAV, an uncompressed format that holds up through repeated editing rather than losing quality with every pass. Useful for extracting a video's audio track as a lossless source before serious podcast editing or sound design, pulling dialogue out of a MOV file for cleanup work that needs an uncompressed starting point, or preparing an audio track for a professional editing workflow where MP3's lossy compression would be a real limitation.`,
    examples: [
      {
        title: 'Extract a lossless source for podcast editing',
        code: `Input: interview.mov\nOutput: interview.wav (uncompressed audio)`,
        note: 'Holds up through repeated editing passes without compounding quality loss.',
      },
      {
        title: 'Pull dialogue for cleanup work',
        code: `Input: scene.mov\nOutput: scene.wav`,
        note: 'Provides an uncompressed starting point for serious audio cleanup.',
      },
    ],
  },
};

export default FIX_BATCH_86;
