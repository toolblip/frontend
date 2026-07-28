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

const FIX_BATCH_65: Record<string, FixBatchEntry> = {
  'area-converter': {
    description: `A property listed in acres doesn't mean anything to an international buyer used to thinking in hectares or square meters, and a room's square footage on a floor plan needs converting into square meters for anyone outside the countries that still measure homes that way. This tool converts between square meters, acres, hectares, square feet, and other area units, handling the specific conversion factor land and floor space actually get measured in rather than a generic length-based estimate. Useful for converting a property's land size from acres into hectares for an international listing, converting a room's square footage into square meters for a floor plan aimed at a metric-using audience, or understanding roughly how large an acre or a hectare actually is relative to a more familiar unit.`,
    examples: [
      {
        title: 'Convert a property listing to hectares',
        code: `Input: 2.5 acres\nOutput: 1.01 hectares`,
        note: 'Converts land size for an international property listing.',
      },
      {
        title: 'Convert a floor plan to square meters',
        code: `Input: 1,200 sq ft\nOutput: 111.5 sq m`,
        note: "Translates a room's square footage for a metric-using audience.",
      },
    ],
  },

  'whois-lookup': {
    description: `Taking over management of a domain someone else originally set up, a client's site handed off from a previous freelancer, an inherited project with no documentation, means changing DNS blindly is genuinely risky until the current registrar, name servers, and expiry date are actually confirmed first, since a wrong assumption there can quietly break email or another service still depending on the old configuration. This tool looks up a domain's full registration details, owner information, expiry date, and name servers together in one lookup. Useful for confirming a domain's current setup before making any DNS change to a project inherited from someone else, checking exactly when a takeover domain's registration actually expires before it lapses unexpectedly, or identifying who currently holds a domain's registration before reaching out about it.`,
    examples: [
      {
        title: 'Confirm current setup before a DNS change',
        code: `Input: inherited-client-site.com\nOutput: registrar: Example Registrar, name servers: ns1.oldhost.com, ns2.oldhost.com, expires: 2026-01-15`,
        note: 'Reveals the current configuration before changing anything on a project inherited from someone else.',
      },
      {
        title: "Check a takeover domain's expiry",
        code: `Input: legacy-project.com\nOutput: expires in 41 days`,
        note: 'Flags an upcoming expiry before an inherited domain lapses unexpectedly.',
      },
    ],
  },

  'html-attribute-encoder': {
    description: `A double quote sitting inside a value meant to go into an HTML attribute doesn't stay part of that value, it closes the attribute early and breaks the rest of the tag, a different and more specific problem than encoding regular text content between two tags. This tool encodes HTML attributes for safe use inside element tags and their values, handling that attribute-closing character specifically rather than only escaping content the way a general HTML encoder would. Useful for safely inserting a user-submitted string containing a quote character into a title or an alt attribute without breaking the surrounding tag, encoding a value for a data attribute that might contain special characters, or preparing dynamic content to be safely interpolated into an attribute value inside a template.`,
    examples: [
      {
        title: 'Encode a quote inside an attribute value',
        code: `Input: title="She said "hello" to everyone"\nOutput: title="She said &quot;hello&quot; to everyone"`,
        note: 'Prevents the quote character from closing the attribute early.',
      },
      {
        title: 'Encode a data attribute value',
        code: `Input: data-label=User's <favorite>\nOutput: data-label="User&#39;s &lt;favorite&gt;"`,
        note: 'Keeps special characters from breaking the surrounding tag.',
      },
    ],
  },

  'grammar-score-checker': {
    description: `Deciding whether a cover letter or an essay's writing quality has actually improved between two drafts is hard to judge just by reading them side by side, an objective number that can be tracked and compared is a more concrete way to see whether a specific revision genuinely helped. This tool gives a piece of text a grammar quality score along with specific suggestions for improvement, providing an actual number to track alongside the individual fixes rather than only a list of flagged issues. Useful for tracking a score across several drafts of the same piece to confirm a revision actually helped, comparing two versions of the same text to see which one is objectively cleaner, or getting a quick overall quality signal on a piece of writing without necessarily working through every single suggestion one by one.`,
    examples: [
      {
        title: 'Score a cover letter draft',
        code: `Input: [cover letter draft 1]\nOutput: score: 72/100, 8 suggestions`,
        note: 'Gives a number to compare against a later revision.',
      },
      {
        title: "Compare two drafts' scores",
        code: `Draft 1: 72/100\nDraft 2 (revised): 89/100`,
        note: 'Confirms a revision objectively improved the writing.',
      },
    ],
  },

  'font-to-png': {
    description: `A licensed display font that can't legally be embedded as a web font, or a decorative typeface that just isn't available anywhere as CSS, still needs to show up somewhere, and rendering that text as a static image is the way around a font that was never meant to load in a browser to begin with. This tool turns text into a PNG image using a custom font, producing a typographic graphic rather than requiring the font actually embedded and loaded as a stylesheet resource. Useful for creating a logo-style text graphic using a licensed font that can't be embedded as a web font, generating a stylized quote graphic for social media in a specific decorative typeface, or producing a typographic image for a design that calls for a font unavailable anywhere in CSS.`,
    examples: [
      {
        title: 'Create a logo graphic with a licensed font',
        code: `Input: text: "Aurora Studio", font: Didot Bold\nOutput: aurora-studio-logo.png`,
        note: "Renders text as an image using a font that can't be embedded as CSS.",
      },
      {
        title: 'Generate a quote graphic for social media',
        code: `Input: text: "Stay curious.", font: Brush Script\nOutput: quote-graphic.png (1080x1080)`,
        note: 'Produces a typographic image in a decorative font unavailable in a browser.',
      },
    ],
  },

  'css-animation-generator': {
    description: `A designer's animation spec handed off from a prototyping tool describes motion in terms a browser doesn't directly accept, a bounce that eases in a specific way over a specific duration, and translating that description into actual keyframe percentages and cubic-bezier values by hand is where a handoff often loses fidelity to what was actually designed. This tool builds a CSS @keyframes animation through a visual editor, controlling timing, iteration, and easing curves, producing the actual CSS a handoff spec described rather than requiring each keyframe value guessed at manually. Useful for translating a designer's animation handoff into working CSS without hand-computing keyframe percentages, fine-tuning an easing curve visually to match a specific motion described in a spec, or generating a repeating animation with the exact iteration count a design calls for.`,
    examples: [
      {
        title: 'Translate a handoff spec into CSS',
        code: `Spec: bounce, 0.8s, ease-out, 2 repeats\nOutput:\n@keyframes bounce {\n  0% { transform: translateY(0); }\n  50% { transform: translateY(-16px); }\n  100% { transform: translateY(0); }\n}\nanimation: bounce 0.8s ease-out 2;`,
        note: 'Produces the CSS a design handoff described without hand-computing keyframes.',
      },
      {
        title: 'Fine-tune an easing curve',
        code: `Input: duration: 1.2s, easing: cubic-bezier(0.34, 1.56, 0.64, 1)\nOutput: animation: pop 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);`,
        note: 'Matches a specific motion feel described in a design spec.',
      },
    ],
  },

  'webp-to-png': {
    description: `A stock photo marketplace, a print service, or an older CMS's upload validator often rejects a WebP file outright even though the image itself displays fine everywhere else, since their allowlist of accepted formats simply hasn't caught up to a format most modern browsers already handle by default. This tool converts WebP to PNG, preserving both transparency and quality, producing a file in the format an older upload validator will actually accept. Useful for getting a WebP image past an upload validator that only accepts traditional image formats, submitting a graphic to a print service or a stock photo site that doesn't yet support WebP, or preserving a WebP image's transparency after converting it into a more universally accepted format.`,
    examples: [
      {
        title: 'Get past an upload validator',
        code: `Input: product-photo.webp\nOutput: product-photo.png (accepted by upload form that only allows JPG/PNG)`,
        note: "Passes a format allowlist that hasn't caught up to WebP yet.",
      },
      {
        title: 'Submit a graphic to a print service',
        code: `Input: artwork.webp\nOutput: artwork.png`,
        note: "Converts to a format a print service's upload system actually supports.",
      },
    ],
  },

  'color-opacity-generator': {
    description: `A dark overlay sitting over a busy hero image needs just enough opacity to keep white text readable without completely hiding the photo underneath, and a subtle border that should blend into a background rather than stand out sharply needs the opposite, a low, barely-there alpha value, both requiring the exact same underlying control over transparency. This tool generates HEX and RGB colors with a custom alpha value for exactly that kind of overlay or border use, producing the transparency level a specific visual effect actually calls for. Useful for creating a dark semi-transparent overlay that keeps text readable over a busy background image, generating a subtle low-opacity border that blends into a background instead of standing out harshly, or producing an RGBA value tuned for a hover-state overlay effect.`,
    examples: [
      {
        title: 'Create a dark overlay for a hero image',
        code: `Input: #000000, opacity: 45%\nOutput: rgba(0, 0, 0, 0.45)`,
        note: 'Keeps white text readable without fully hiding the background photo.',
      },
      {
        title: 'Generate a subtle low-opacity border',
        code: `Input: #FFFFFF, opacity: 12%\nOutput: rgba(255, 255, 255, 0.12)`,
        note: 'Blends into a background instead of standing out harshly.',
      },
    ],
  },

  'ping-test': {
    description: `Confirming a server is actually reachable and reasonably responsive is the first thing worth checking before troubleshooting a slow site any further, and doing that without opening a terminal or having command-line access at all is exactly what a browser-based check makes possible. This tool pings any host and shows its response time, TTL, and status directly from the browser, giving a quick reachability check without requiring a terminal. Useful for confirming a specific server is actually reachable before digging into a slow site's deeper cause, comparing response times to a couple of different servers or regions to see which one responds faster, or running a quick network health check from a browser when command-line access isn't available at all.`,
    examples: [
      {
        title: 'Check if a server is reachable',
        code: `Input: example.com\nOutput: response time: 42ms, TTL: 58, status: reachable`,
        note: 'Confirms basic reachability before digging into a slower issue.',
      },
      {
        title: 'Compare response times across regions',
        code: `Input: us-east.example.com, eu-west.example.com\nOutput: us-east: 38ms, eu-west: 112ms`,
        note: 'Shows which server responds faster from the current location.',
      },
    ],
  },

  'color-palette-extractor': {
    description: `Picking individual pixels one at a time from a photo works for grabbing one exact color, but building a whole theme or a color scheme around an image calls for something broader, the handful of colors that actually dominate the picture as a whole rather than whichever single pixel happens to get clicked. This tool extracts an image's dominant colors automatically and returns their HEX, RGB, and HSL values, analyzing the whole picture rather than sampling one pixel at a time. Useful for automatically generating a color scheme from a hero image without manually picking individual pixels, extracting a full palette to build a website theme that matches a featured photo, or pulling a quick set of dominant colors from a mood board image for a design brief.`,
    examples: [
      {
        title: 'Extract a palette from a hero image',
        code: `Input: hero-photo.jpg\nOutput: dominant colors: #2A5D63, #E8B84B, #C24E4E, #F4F1E8`,
        note: 'Analyzes the whole image instead of sampling one pixel at a time.',
      },
      {
        title: 'Build a theme from a featured photo',
        code: `Input: product-shot.jpg\nOutput: HEX #1B3A4B, RGB(27, 58, 75), HSL(203, 47%, 20%) (primary dominant color)`,
        note: 'Gives a starting palette to build a matching website theme.',
      },
    ],
  },
};

export default FIX_BATCH_65;
