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

const FIX_BATCH_38: Record<string, FixBatchEntry> = {
  'vsd-to-pdf': {
    description: `A Visio diagram file only opens in Visio itself, Windows-only, licensed software most people simply don't have installed, which means a network diagram or an org chart saved as VSD is effectively locked away from anyone outside a small group with the right software, even though the actual content, boxes, arrows, a diagram anyone should be able to view, has nothing to do with needing Visio specifically. This tool converts a VSD file into PDF, so the diagram opens for anyone with a PDF viewer, which is to say almost anyone, rather than requiring Visio itself just to look at it. Useful for sharing a network diagram or process flowchart with someone who doesn't have Visio installed, printing a Visio-created diagram without opening the original application, or archiving a diagram in a format that will still open years from now regardless of what software licenses are still active.`,
    examples: [
      {
        title: 'Share a network diagram without Visio',
        code: `Input: network-topology.vsd\nOutput: network-topology.pdf (opens in any PDF viewer)`,
        note: 'Makes the diagram viewable by anyone, not just people with a Visio license.',
      },
      {
        title: 'Print an org chart from Visio',
        code: `Input: org-chart.vsd\nOutput: org-chart.pdf`,
        note: 'Prints cleanly without needing Visio installed on the printing machine.',
      },
    ],
  },

  'youtube-to-text': {
    description: `A summary gives you the main points; a full transcript gives you every word actually said, which matters when the goal is quoting a specific line accurately, translating a video's dialogue in full, or searching the complete text for one phrase rather than settling for a condensed version that might skip the exact part that matters. This tool transcribes a YouTube video's full spoken content into complete text, rather than a shortened summary of the key points. Useful for pulling an exact quote from a video to cite accurately elsewhere, getting a full transcript to translate or repurpose as written content, or searching through everything actually said in a video without needing to watch it and listen for one specific moment.`,
    examples: [
      {
        title: 'Get an exact quote from a video',
        code: `Input: https://youtube.com/watch?v=abc123\nOutput: full transcript, searchable for the exact line needed`,
        note: 'Preserves every word said, not a condensed summary that might skip the exact quote.',
      },
      {
        title: "Translate a video's full dialogue",
        code: `Input: [interview video]\nOutput: complete transcript ready to translate in full`,
        note: 'Provides the entire spoken content rather than a shortened version.',
      },
    ],
  },

  'cidr-calculator': {
    description: `A /24 network sounds like it should provide 256 usable addresses, but two of those, the network address itself and the broadcast address, are reserved and can't actually be assigned to a device, which is exactly the kind of detail that leads to under-provisioning a subnet if the math is done from memory rather than calculated properly. This tool calculates the actual subnet mask, network range, usable IP addresses, and wildcard mask from any CIDR notation, accounting for those reserved addresses rather than a naive total that overstates actual capacity. Useful for sizing a cloud subnet correctly before provisioning it, understanding exactly how many devices a given CIDR block can actually support once reserved addresses are excluded, or checking a network range's boundaries before assigning IP addresses within it.`,
    examples: [
      {
        title: 'Calculate usable IPs in a /24 subnet',
        code: `Input: 192.168.1.0/24\nOutput: 256 total addresses, 254 usable (network and broadcast reserved)`,
        note: 'Accounts for the two reserved addresses that reduce the actual usable count.',
      },
      {
        title: 'Size a cloud subnet correctly',
        code: `Input: 10.0.0.0/26\nOutput: 64 total addresses, 62 usable`,
        note: 'Confirms a subnet actually supports the number of hosts it needs to before provisioning it.',
      },
    ],
  },

  'barcode-scanner': {
    description: `A barcode from a product on a store shelf and a barcode on a shipping label or an internal inventory tag usually aren't even using the same encoding, retail products use globally standardized UPC or EAN formats, while logistics and inventory systems often use more flexible alphanumeric formats like Code 128 or Code 39 built for internal tracking rather than universal product identification. This tool scans and decodes across all of those formats, rather than assuming every barcode encountered is a retail product code. Useful for scanning a retail product's UPC or EAN to look up what it actually is, decoding a Code 128 or Code 39 label from a shipping box or an inventory tag, or reading an unfamiliar barcode format without knowing in advance which encoding it actually uses.`,
    examples: [
      {
        title: "Decode a retail product barcode",
        code: `Input: [UPC barcode image]\nOutput: 012345678905 (UPC-A format)`,
        note: 'Reads the globally standardized format used on retail products.',
      },
      {
        title: 'Decode a shipping label barcode',
        code: `Input: [Code 128 barcode image]\nOutput: "SHIP-2026-04829" (Code 128 format)`,
        note: 'Reads the alphanumeric format common in logistics and inventory tracking, not retail products.',
      },
    ],
  },

  'binary-converter': {
    description: `A negative number in binary isn't just a positive number's bit pattern with a minus sign tacked on, it's represented through two's complement, a specific encoding where flipping every bit and adding one produces the negative equivalent, which is genuinely non-obvious the first time you actually need to read or construct a negative binary value by hand. This tool converts between binary, decimal, hexadecimal, and octal with explicit support for signed integers, correctly handling the two's complement representation rather than only covering positive, unsigned values. Useful for understanding how a negative number is actually stored in binary rather than guessing at the pattern, converting a signed integer between number systems without the negative sign getting lost or misrepresented, or working through a systems programming or computer architecture problem that specifically deals with signed binary representation.`,
    examples: [
      {
        title: 'Represent a negative number correctly',
        code: `Input: -5 (8-bit signed)\nOutput: 11111011 (two's complement)`,
        note: "Shows the actual two's complement pattern, not just a positive value with a sign.",
      },
      {
        title: 'Convert a signed integer to hex',
        code: `Input: -20 (8-bit signed)\nOutput: 0xEC`,
        note: 'Correctly handles the signed representation rather than treating the value as unsigned.',
      },
    ],
  },

  'slideshow-generator': {
    description: `Writing a presentation as plain markdown, one heading and bullet list per slide, tracked in version control, diffable like any other text file, is a genuinely different workflow than clicking through a GUI slide editor building each slide visually, and it suits a developer who thinks more naturally in text than in a drag-and-drop interface. This tool converts markdown or plain text into an actual HTML slideshow, complete with transitions, selectable themes, and keyboard navigation for moving between slides, rather than requiring a separate presentation application. Useful for writing a technical talk as version-controlled markdown instead of a binary presentation file, building a quick slideshow from an outline without opening presentation software, or generating a lightweight, keyboard-navigable slideshow that runs anywhere a browser does.`,
    examples: [
      {
        title: 'Build a slideshow from markdown',
        code: `Input:\n# Intro\\n\\n# Key Point\\n- detail one\\n- detail two\nOutput: HTML slideshow, 2 slides, keyboard navigation enabled`,
        note: 'Turns plain markdown headings into individual slides automatically.',
      },
      {
        title: 'Apply a theme and transition',
        code: `Input: talk.md, theme: dark, transition: fade\nOutput: themed HTML slideshow with fade transitions between slides`,
        note: 'Produces a polished slideshow without opening a separate presentation app.',
      },
    ],
  },

  'html-minifier': {
    description: `Stripping whitespace and comments is the easy, safe part of minifying HTML; going further by dropping optional closing tags, HTML5 doesn't actually require a closing </li> or </p> tag in plenty of contexts, is a more aggressive technique that shaves off more bytes but genuinely requires understanding exactly which tags are safe to omit without breaking the page's structure. This tool minifies HTML by removing whitespace and comments, and optionally dropping those legitimately optional tags for a more aggressive size reduction, rather than only handling the safest, most conservative whitespace stripping. Useful for shaving extra load time off a page by removing whitespace and comments before it ships, going further with optional tag removal when every byte of page weight matters, or minifying a large HTML file without introducing a rendering bug from an unsafe optimization.`,
    examples: [
      {
        title: 'Strip whitespace and comments safely',
        code: `Input: <!-- header -->\\n<div>\\n  <p>Hello</p>\\n</div>\nOutput: <div><p>Hello</p></div>`,
        note: 'The conservative, always-safe level of minification.',
      },
      {
        title: 'Remove optional closing tags aggressively',
        code: `Input: <ul><li>One</li><li>Two</li></ul>\nOutput: <ul><li>One<li>Two</ul>`,
        note: "Drops closing </li> tags HTML5 doesn't require in this context for extra size savings.",
      },
    ],
  },

  'keyword-density-checker': {
    description: `Knowing your own page's keyword density in isolation only answers half the question; the number that actually matters for SEO is how that density compares to what's already ranking, since a given density on a topic where competitors average four percent looks thin, while the same percentage on a topic where competitors average one percent would look like stuffing. This tool analyzes keyword density in text or HTML content and puts it in that comparative context rather than checking it against one fixed universal threshold that ignores what's actually normal for a specific topic and competitive landscape. Useful for checking whether a page's keyword usage is actually competitive with what's currently ranking for the same term, rather than just clearing a generic density guideline that may not fit the specific topic.`,
    examples: [
      {
        title: 'Compare density against top-ranking competitors',
        code: `Input: your page: 0.4% density for "meal prep"\nTop 3 competitors average: 2.3% density`,
        note: 'Reveals under-optimization relative to what actually ranks, not just an absolute number.',
      },
      {
        title: 'Check density against a low-competition topic',
        code: `Input: your page: 3.1% density\nTop competitors average: 1.2% density`,
        note: 'Flags a density that would look like stuffing for this particular topic even though the raw number seems modest.',
      },
    ],
  },

  'json-diff': {
    description: `Two JSON documents can be functionally identical while looking completely different as plain text, since JSON doesn't care what order an object's keys appear in, but a plain text diff absolutely does, flagging every reordered key as a change even though nothing about the actual data changed at all. This tool compares two JSON documents by their actual structure and values rather than by literal text position, so a reordered key shows up as unchanged while a genuinely different value gets flagged correctly. Useful for comparing two versions of a config file or an API response without false positives from harmless key reordering, spotting exactly which values actually changed between two JSON documents, or confirming two JSON payloads are functionally equivalent even if they were serialized in a different key order.`,
    examples: [
      {
        title: 'Ignore harmless key reordering',
        code: `A: {"name":"Alice","age":30}\nB: {"age":30,"name":"Alice"}\nResult: no differences (same structure and values, different key order)`,
        note: 'A plain text diff would incorrectly flag this as changed.',
      },
      {
        title: 'Catch a genuine value change',
        code: `A: {"status":"active"}\nB: {"status":"inactive"}\nResult: "status" changed from "active" to "inactive"`,
        note: 'Flags the actual data change precisely instead of noise from formatting differences.',
      },
    ],
  },

  'random-password-generator': {
    description: `Not every site accepts the same password rules, one form forbids symbols entirely, another requires a minimum length well past the usual default, some exclude visually ambiguous characters like a zero and a capital O to avoid transcription errors when a password gets written down, and a genuinely random password generated without those specific constraints in mind can end up rejected by the exact form it was meant for. This tool generates a strong password with length and character type fully customizable, letting the result match whatever specific rules a destination actually enforces rather than a one-size-fits-all default. Useful for generating a password that fits a form's specific length and character requirements on the first try, excluding ambiguous characters when a password might need to be read aloud or written down, or building a maximally random password once all the practical constraints of where it's actually going are accounted for.`,
    examples: [
      {
        title: "Generate a password matching a form's specific rules",
        code: `Input: length: 16, symbols: off, min length required: 12\nOutput: "Xk4mPqRt9WvZbN2c"`,
        note: 'Matches a form that specifically forbids symbols instead of generating one that would get rejected.',
      },
      {
        title: 'Exclude ambiguous characters',
        code: `Input: length: 12, exclude ambiguous: on (no 0, O, l, 1)\nOutput: "hK9mXsQrTbNw"`,
        note: 'Avoids characters easily confused when a password needs to be read aloud or written down.',
      },
    ],
  },
};

export default FIX_BATCH_38;
