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

const FIX_BATCH_52: Record<string, FixBatchEntry> = {
  'vsdx-to-pdf': {
    description: `A JPEG flattens a Visio diagram into a single raster image that gets blurry once zoomed in or printed at any real size, and a multi-page Visio document loses everything past the first page entirely once exported that way, neither of which matters once PDF is the actual target format. This tool converts a VSDX file into PDF, preserving every page of a multi-page diagram and keeping the output sharp at any zoom level or print size rather than flattening it into one blurry raster image. Useful for printing a diagram at full quality without it turning pixelated, sharing a multi-page Visio document as a single file that keeps every page intact, or archiving a diagram in a format that won't degrade the way a resized image eventually would.`,
    examples: [
      {
        title: 'Convert a multi-page diagram',
        code: `Input: architecture-diagram.vsdx (4 pages)\nOutput: architecture-diagram.pdf (all 4 pages preserved)`,
        note: 'Keeps every page intact instead of exporting only the first.',
      },
      {
        title: 'Print a diagram at full quality',
        code: `Input: network-topology.vsdx\nOutput: network-topology.pdf, sharp at any zoom or print size`,
        note: 'Stays vector-sharp instead of flattening into a blurry raster image.',
      },
    ],
  },

  'meta-tag-generator': {
    description: `A brand-new page that hasn't been published yet doesn't have any existing SEO meta tags to audit, so the actual task isn't fixing what's broken on a live page but building the full set from nothing, the meta description, the Open Graph tags, the Twitter Card, before the page ever goes live and gets shared for the first time. This tool generates a complete set of SEO meta tags, Open Graph tags, and Twitter Card tags from scratch, with a live preview showing exactly how the finished page will look once shared. Useful for building a new page's full tag set before it's ever published, previewing how a blog post will actually appear when shared on social media before it goes live, or drafting Open Graph tags for a landing page still in development.`,
    examples: [
      {
        title: 'Build a full tag set for a new page',
        code: `Input: title: "10 Budget Travel Tips", description: "...", image: hero.jpg\nOutput:\n<meta name="description" content="...">\n<meta property="og:title" content="10 Budget Travel Tips">\n<meta name="twitter:card" content="summary_large_image">`,
        note: 'Generates the complete set before the page has ever been published.',
      },
      {
        title: 'Preview a social share before publishing',
        code: `Input: draft landing page details\nOutput: live preview showing how the Facebook and Twitter card will look`,
        note: 'Shows the finished share appearance before the page goes live.',
      },
    ],
  },

  'webhook-tester': {
    description: `A webhook integration is only as trustworthy as what actually gets sent and received, and neither side of that exchange is visible without a real endpoint to point the request at and a way to inspect what came back, the payload, the headers, the exact response time, rather than assuming it worked because nothing crashed. This tool provides a live endpoint that accepts a webhook payload and shows the full response along with its timing, letting an integration be tested against something real rather than guessed at. Useful for verifying what payload a payment provider or a CI system actually sends before writing code to handle it, confirming a server's webhook response looks correct before going live, or diagnosing a slow webhook by seeing its actual response timing.`,
    examples: [
      {
        title: 'Inspect a payment provider payload',
        code: `Endpoint: https://webhook-tester.example/abc123\nReceived: POST { "event": "payment.succeeded", "amount": 4999 }\nResponse time: 142ms`,
        note: 'Shows exactly what a third-party service actually sends before writing handler code.',
      },
      {
        title: 'Diagnose a slow webhook response',
        code: `Sent: test payload\nResponse: 200 OK\nTiming: 3,840ms`,
        note: 'Surfaces an unusually slow response time that might otherwise go unnoticed.',
      },
    ],
  },

  'plain-text-formatter': {
    description: `Text copied out of a PDF or pulled from an OCR scan usually comes with extra line breaks splitting sentences in the middle, doubled spaces between words, and formatting artifacts that make it look fine on screen but read strangely once pasted somewhere else. This tool cleans that up, stripping extra spaces and unwanted line breaks so the result reads like continuous, properly formatted text rather than something visibly copied from another source. Useful for cleaning text copied out of a PDF before pasting it into a document, removing line breaks an OCR scan introduced mid-sentence, or condensing repeated blank lines and spacing before publishing a piece of text somewhere it actually needs to look clean.`,
    examples: [
      {
        title: 'Clean text copied from a PDF',
        code: `Input: "This is a\\nsentence split\\nacross lines."\nOutput: "This is a sentence split across lines."`,
        note: 'Removes line breaks that split a sentence mid-thought.',
      },
      {
        title: 'Remove doubled spaces and blank lines',
        code: `Input: "Hello   world.\\n\\n\\nGoodbye."\nOutput: "Hello world.\\n\\nGoodbye."`,
        note: 'Condenses extra spacing left over from a scan or a copy-paste.',
      },
    ],
  },

  'percentage-change-calc': {
    description: `Going from 100 to 150 is a 50 percent increase, but dropping back from 150 to 100 afterward is only a 33 percent decrease, not 50, since percentage change is calculated against a different starting value each direction, a detail that trips people up constantly when comparing an increase against the decrease that supposedly reverses it. This tool calculates the percentage change between two values, showing both the direction, an increase or a decrease, and the actual magnitude rather than leaving the arithmetic to be worked out by hand. Useful for calculating how much a price actually increased between two dates, tracking a metric's change from one reporting period to the next, or understanding why reversing a percentage increase doesn't land back exactly where it started.`,
    examples: [
      {
        title: 'Calculate an increase',
        code: `Input: from 100 to 150\nOutput: +50% (increase)`,
        note: 'Shows both the direction and the magnitude of the change.',
      },
      {
        title: "See why the reverse isn't symmetric",
        code: `Input: from 150 to 100\nOutput: -33.3% (decrease)`,
        note: "Demonstrates that reversing a 50% increase isn't a 50% decrease.",
      },
    ],
  },

  'number-base-converter': {
    description: `A hex color code, a binary flag used in a bitwise permission check, and a plain decimal number are all the same underlying value represented in a different base, and moving between binary, decimal, hexadecimal, and octal by hand means recalculating positional values every single time instead of just converting directly. This tool converts a value between all four bases at once, handling the specific cases a developer actually runs into, translating a hex color code, checking a binary flag's decimal equivalent, or converting an octal file permission into something more readable. Useful for converting a hex color value into its decimal RGB components, checking what a specific binary flag combination equals in decimal for a bitwise operation, or translating an octal file permission like 755 into binary to see exactly which bits are set.`,
    examples: [
      {
        title: 'Convert a hex color to decimal RGB',
        code: `Input: #FF5733 (hex)\nOutput: R: 255, G: 87, B: 51 (decimal)`,
        note: 'Breaks a hex color code down into its decimal components.',
      },
      {
        title: 'Check a binary flag combination',
        code: `Input: 1011 (binary)\nOutput: 11 (decimal), 13 (octal)`,
        note: 'Converts a bitwise flag value across all four bases at once.',
      },
    ],
  },

  'fraction-calculator': {
    description: `Adding 1/3 cup of one ingredient to 1/4 cup of another means finding a common denominator first, and dividing a board's length into thirds for a woodworking project runs into the same arithmetic, simple in principle but easy to get wrong doing entirely in your head, especially once the fractions don't share an obvious denominator. This tool adds, subtracts, multiplies, and divides fractions while showing the actual step-by-step working, finding the common denominator or simplifying the result rather than only returning a final answer with no visible process. Useful for checking a recipe's fraction math when combining measurements that don't share a denominator, verifying a woodworking or a sewing measurement divided into fractional segments, or checking homework where the working needs to be shown, not just the final answer.`,
    examples: [
      {
        title: 'Add two recipe measurements',
        code: `Input: 1/3 + 1/4\nStep 1: common denominator = 12\nStep 2: 4/12 + 3/12 = 7/12\nOutput: 7/12`,
        note: 'Shows the common denominator step instead of just the final fraction.',
      },
      {
        title: 'Divide a board length into thirds',
        code: `Input: 7/8 ÷ 3\nOutput: 7/24`,
        note: 'Works through multiplication by the reciprocal step by step.',
      },
    ],
  },

  'password-generator': {
    description: `A weak password reused across sites is still one of the most common ways an account actually gets compromised, and generating something genuinely random with the right length and character mix matters more than most people give it credit for, especially when a specific site's complexity rule demands a mix that's tedious to construct by hand. This tool creates a strong, random password with adjustable length, special characters, and complexity rules, running entirely in the browser so nothing generated is ever sent to a server. Useful for generating a password that satisfies a specific site's complexity requirement without constructing it manually, creating a long passphrase suited to a password manager's master password, or confirming random generation stays entirely local with nothing transmitted anywhere.`,
    examples: [
      {
        title: "Generate a password matching a site's policy",
        code: `Input: length: 16, uppercase, lowercase, digits, symbols\nOutput: xK9#mQ2$vL7!pR4&`,
        note: 'Meets a specific complexity rule without constructing it by hand.',
      },
      {
        title: 'Generate a long passphrase-style password',
        code: `Input: length: 32, no ambiguous characters\nOutput: 32-character random string suited to a password manager`,
        note: 'Runs entirely in the browser with nothing sent to a server.',
      },
    ],
  },

  'broken-image-checker': {
    description: `A CMS migration, a deleted file, or a renamed image path all leave the same trace behind, an image tag on a page still pointing at a file that no longer actually exists there, which a browser quietly renders as a blank broken icon instead of flagging loudly as an actual error. This tool checks every image on a webpage for a broken link or a failed load, surfacing exactly which image tag points somewhere that no longer resolves rather than requiring each one clicked or inspected individually. Useful for catching a broken image left behind after a CMS migration or a file rename, auditing a page before publishing to confirm every image actually loads, or finding an old image reference pointing at a file that got deleted or moved somewhere else.`,
    examples: [
      {
        title: 'Find a broken image after a migration',
        code: `Input: example.com/blog/post\nOutput: <img src="/old-uploads/hero.jpg"> -> 404 Not Found`,
        note: 'Flags exactly which image reference stopped resolving after a migration.',
      },
      {
        title: 'Audit a page before publishing',
        code: `Input: example.com/products\nOutput: 18 images checked, 17 loaded, 1 broken`,
        note: 'Confirms every image actually loads before the page goes live.',
      },
    ],
  },

  'json-graph-visualizer': {
    description: `A normalized JSON response where one object references another by id, a comment referencing a user, an order referencing a product, reads as a flat list of disconnected records until those references are actually traced by eye, and a reference pointing at an id that doesn't exist anywhere in the document is easy to miss entirely reading raw nested JSON. This tool visualizes those relationships as an actual graph of nodes and edges, highlighting a missing or broken reference directly rather than leaving it buried in a JSON structure that has to be searched manually. Useful for tracing how entities in a normalized API response actually reference each other, catching a dangling reference before it causes a runtime error downstream, or exporting a relationship map to document a complex object graph for debugging later.`,
    examples: [
      {
        title: 'Visualize entity references as a graph',
        code: `Input: { "orders": [{ "id": 1, "productId": 5 }], "products": [{ "id": 5 }] }\nOutput: node "order 1" -> edge -> node "product 5"`,
        note: 'Traces how records reference each other instead of reading raw nested JSON.',
      },
      {
        title: 'Catch a dangling reference',
        code: `Input: { "comments": [{ "userId": 42 }], "users": [{ "id": 7 }] }\nOutput: warning - comment references userId 42, which doesn't exist`,
        note: 'Flags a reference pointing at an id that was never actually defined.',
      },
    ],
  },
};

export default FIX_BATCH_52;
