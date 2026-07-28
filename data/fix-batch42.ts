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

const FIX_BATCH_42: Record<string, FixBatchEntry> = {
  'ip-range-calculator': {
    description: `A DHCP scope or a firewall rule is sometimes defined as two endpoints, a starting address and an ending address, rather than a single CIDR block, and converting that kind of start-to-end range into a usable count and network boundary is a different calculation than the CIDR notation math most subnet tools are actually built around. This tool calculates the usable IP count, broadcast address, and network range directly from two IP addresses marking a range's start and end, rather than requiring the input to already be expressed as CIDR notation. Useful for figuring out how many addresses actually fall within a DHCP scope defined by a start and end IP, converting a firewall rule's IP range into its broadcast address and boundaries, or working with network documentation that specifies ranges as two endpoints rather than a single CIDR block.`,
    examples: [
      {
        title: 'Calculate a range from two IP addresses',
        code: `Input: 192.168.1.10 to 192.168.1.100\nOutput: 91 usable addresses, broadcast: 192.168.1.255`,
        note: 'Works from a start-and-end range rather than requiring CIDR notation.',
      },
      {
        title: "Check a DHCP scope's actual address count",
        code: `Input: 10.0.0.50 to 10.0.0.150\nOutput: 101 total addresses in range`,
        note: 'Matches how a DHCP scope is often defined in network documentation.',
      },
    ],
  },

  'm4a-to-mp3': {
    description: `An M4A file exported from iTunes or downloaded through Apple Music plays fine in Apple's own ecosystem, but the moment it needs to go somewhere that only recognizes MP3, an older car stereo, a non-Apple music player, a service that doesn't accept M4A uploads, the format itself becomes the actual blocker rather than anything about the audio quality. This tool converts an M4A file into MP3, moving audio out of Apple's specific ecosystem into the one format that plays almost anywhere regardless of device or software. Useful for getting a song purchased through iTunes playing on a device that's never recognized M4A, converting an Apple Music download for a platform that specifically requires MP3 uploads, or standardizing an audio library that's a mix of M4A and other formats onto one consistently playable type.`,
    examples: [
      {
        title: 'Play an iTunes purchase on a non-Apple device',
        code: `Input: song.m4a\nOutput: song.mp3`,
        note: 'Moves audio out of an Apple-specific format into one that plays almost anywhere.',
      },
      {
        title: 'Upload an Apple Music download to a platform requiring MP3',
        code: `Input: track.m4a\nOutput: track.mp3`,
        note: "Satisfies a platform that doesn't accept M4A uploads.",
      },
    ],
  },

  'sla-uptime-calculator': {
    description: `Each additional nine in an uptime percentage sounds like a small difference on paper, 99.9 percent versus 99.99 percent, but the actual allowable downtime behind those numbers changes dramatically, roughly nine hours a year at three nines, down to about five minutes a year at five nines, a gap that's easy to underestimate until it's translated into actual hours and minutes rather than left as an abstract percentage. This tool calculates exactly how much downtime a given SLA percentage actually allows across a year, a month, and a day, turning an uptime commitment into concrete, comparable time figures. Useful for understanding what a vendor's uptime guarantee actually promises in real hours rather than an abstract percentage, comparing two SLA offers by their actual allowed downtime instead of just their percentage, or checking whether an internal system's actual uptime record still meets a stated SLA commitment.`,
    examples: [
      {
        title: 'Translate an SLA percentage into real downtime',
        code: `Input: 99.9%\nOutput: 8.76 hours/year, 43.8 minutes/month, 1.44 minutes/day`,
        note: 'Turns an abstract percentage into concrete, comparable time figures.',
      },
      {
        title: 'Compare two vendor SLA offers',
        code: `Vendor A: 99.9% (8.76 hrs/year allowed downtime)\nVendor B: 99.99% (52.6 min/year allowed downtime)`,
        note: 'Makes the real difference between two SLA tiers concrete rather than abstract percentages.',
      },
    ],
  },

  'uuid-v1-generator': {
    description: `A version 1 UUID isn't purely random the way a version 4 UUID is, it encodes an actual timestamp along with a node identifier traditionally derived from the generating machine's MAC address, which makes it naturally sortable by creation time but also means it can leak a real piece of hardware identification embedded right in the identifier, a known privacy consideration that pushed systems toward alternatives that don't encode anything hardware-specific. This tool generates version 1 UUIDs from a given timestamp, time-ordered and correctly structured, for systems that specifically require or already rely on that format. Useful for generating a UUID that needs to sort by creation time for a legacy system already built around version 1, understanding what information is actually embedded inside a version 1 UUID before using it somewhere sensitive, or producing a time-based identifier for a system that predates newer sortable alternatives.`,
    examples: [
      {
        title: 'Generate a time-ordered UUID v1',
        code: `Input: timestamp: 2026-07-27T10:00:00Z\nOutput: 4e8f2a10-6c1b-11f0-8a3d-0242ac120002`,
        note: 'Sorts naturally by creation time, unlike a purely random version 4 UUID.',
      },
      {
        title: 'Inspect what a UUID v1 actually encodes',
        code: `Input: 4e8f2a10-6c1b-11f0-8a3d-0242ac120002\nOutput: timestamp: 2026-07-27T10:00:00Z, node identifier: 02:42:ac:12:00:02`,
        note: 'Reveals the embedded timestamp and node identifier some implementations derive from a MAC address.',
      },
    ],
  },

  metadata: {
    description: `A photo carries EXIF data, camera settings and sometimes GPS coordinates, a Word document carries its own separate kind of metadata, an author name, a creation date, the software version it was last saved with, and neither of those is something most people ever see just by opening the file normally, since it's sitting in the file's structure rather than its visible content. This tool views and edits metadata across different file types, not just images, showing what's actually embedded in a document or a photo and allowing specific fields to be changed or cleared rather than only displayed. Useful for checking what metadata a document or photo actually carries before sharing it, editing a specific field like an author name or a creation date rather than stripping everything at once, or inspecting a file type's metadata that an image-only viewer wouldn't cover at all.`,
    examples: [
      {
        title: "Check a document's embedded metadata",
        code: `Input: report.docx\nOutput: author: "Jane Smith", created: 2024-03-14, last modified with: Word 16.0`,
        note: 'Shows metadata a document carries beyond its visible text content.',
      },
      {
        title: 'Edit a specific metadata field',
        code: `Input: photo.jpg, field: author, new value: "Studio Name"\nOutput: photo.jpg (author field updated, other metadata unchanged)`,
        note: 'Changes one field directly instead of stripping all metadata at once.',
      },
    ],
  },

  'markdown-to-html': {
    description: `Seeing raw Markdown syntax next to its rendered HTML output side by side, updating live as each character gets typed, is a genuinely faster way to learn Markdown's syntax than reading a reference table, since the effect of an asterisk or a pound sign becomes immediately visible rather than something to look up separately. This tool converts Markdown into HTML with exactly that live, split-pane view, tables, code blocks, and standard formatting all rendering instantly as the Markdown is written, with the resulting HTML ready to copy out directly. Useful for learning Markdown syntax by watching it render in real time, converting a chunk of Markdown into clean HTML to paste into a CMS that doesn't accept Markdown directly, or previewing exactly how a table or a code block will actually look before committing to the raw syntax.`,
    examples: [
      {
        title: 'Watch Markdown render live',
        code: `Typing: **bold** and *italic*\nLive preview: bold and italic (rendered immediately)`,
        note: 'Shows the rendering effect the moment a character is typed.',
      },
      {
        title: 'Get clean HTML for a CMS',
        code: `Input: # Heading\\n\\nSome **bold** text.\nOutput: <h1>Heading</h1>\\n<p>Some <strong>bold</strong> text.</p>`,
        note: "Produces HTML ready to paste into a CMS that doesn't accept Markdown directly.",
      },
    ],
  },

  'cold-email-writer': {
    description: `A cold email that reads like it was mail-merged, a first name dropped into an otherwise identical template, gets ignored or deleted immediately, while genuine personalization, referencing something specific about the recipient's actual company or role, is what makes a cold email worth reading at all, which is exactly the harder problem to solve once outreach needs to happen at any real volume rather than one email at a time. This tool generates personalized cold emails at scale, built around the specific details of each individual recipient rather than one generic template with a name swapped in. Useful for running a legitimate outreach campaign that still reads as individually written rather than obviously templated, drafting a first version of many personalized emails quickly before a final human review pass, or scaling a sales outreach effort without every email reading like the same message sent a hundred times.`,
    examples: [
      {
        title: 'Generate personalized emails for a list of prospects',
        code: `Input: 20 prospects with company name, role, and one relevant detail each\nOutput: 20 emails, each referencing the specific detail provided`,
        note: 'Avoids a mail-merged feel by working from a real detail per recipient.',
      },
      {
        title: 'Draft a first version before a human review pass',
        code: `Input: prospect: "VP Engineering at a Series B startup, recently posted about scaling issues"\nOutput: email referencing the specific scaling post before pitching relevant help`,
        note: 'Produces a starting draft for review rather than a final send-as-is message.',
      },
    ],
  },

  'color-contrast-matrix': {
    description: `Checking one color pair at a time works fine for a single decision, but a full brand palette, six or eight colors mixed and matched across a design system, has every possible pair worth knowing about in advance, which text colors are actually safe on which backgrounds, before a single component gets built using a combination nobody checked. This tool generates a full contrast matrix for a set of colors, checking every color against every other in the set at once and marking which pairings pass WCAG AA or AAA, rather than testing pairs one at a time as they come up. Useful for planning a color system where every safe text-and-background combination is known upfront, auditing an entire brand palette's usable pairings in one pass, or catching a pair that looks fine together visually but actually fails contrast requirements before it ends up in a live component.`,
    examples: [
      {
        title: 'Check every pair in a brand palette at once',
        code: `Input: 6 brand colors\nOutput: 15 pairings checked, 4 fail AA, 11 pass`,
        note: 'Tests every combination in one pass instead of checking pairs individually.',
      },
      {
        title: 'Plan a design system before building components',
        code: `Input: 8-color palette\nOutput: matrix showing exactly which text/background combinations are safe to use`,
        note: 'Identifies safe pairings in advance rather than discovering a failure after a component ships.',
      },
    ],
  },

  'color-tone-generator': {
    description: `Warmer, cooler, more muted, more vivid are four genuinely different directions a single color can shift in, and seeing all four side by side from the same starting color is a different, more useful comparison than adjusting one slider and losing sight of what the other directions would have looked like. This tool generates all four tonal variants at once from a single base color, warm, cool, muted, and vivid, so the different directions can be compared directly rather than explored one adjustment at a time. Useful for seeing a brand color's warmer and cooler variants side by side before picking one for a seasonal campaign, comparing a muted, toned-down version against a more vivid, saturated one for the same base color, or exploring a color's full range of tonal directions at once instead of nudging a single slider repeatedly.`,
    examples: [
      {
        title: 'Compare all four tonal directions at once',
        code: `Input: #2563EB\nOutput: warm: #6B4FDB, cool: #2563EB, muted: #6B7A99, vivid: #0047FF`,
        note: 'Shows every direction side by side instead of adjusting one slider at a time.',
      },
      {
        title: 'Pick a seasonal variant of a brand color',
        code: `Input: #DC2626, target: warm variant\nOutput: #E8734A`,
        note: 'Generates a warmer variant specifically for a seasonal campaign.',
      },
    ],
  },

  'extract-text': {
    description: `A photographed page, a screenshot of an error message, a picture of a whiteboard covered in notes, all contain text that looks completely readable to a person but is just pixels as far as a computer is concerned, no way to select it, search it, or copy it out, until optical character recognition actually reads the shapes and converts them into real text characters. This tool applies OCR to an image and extracts the text it recognizes into actual editable, selectable text, rather than leaving it trapped as pixels inside a picture. Useful for pulling text out of a photographed document instead of retyping it by hand, extracting a message from a screenshot that can't otherwise be copied, or converting a photo of handwritten or printed notes into text that can actually be searched and edited.`,
    examples: [
      {
        title: 'Pull text from a photographed document',
        code: `Input: photo-of-page.jpg\nOutput: full editable text extracted from the image`,
        note: 'Converts pixels that look like text into actual selectable characters.',
      },
      {
        title: 'Extract a message from a screenshot',
        code: `Input: error-screenshot.png\nOutput: "Error: connection timed out after 30 seconds"`,
        note: "Recovers copyable text from an image that couldn't otherwise be selected.",
      },
    ],
  },
};

export default FIX_BATCH_42;
