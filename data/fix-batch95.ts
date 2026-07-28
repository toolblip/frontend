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

const FIX_BATCH_95: Record<string, FixBatchEntry> = {
  'circle-crop': {
    description: `A perfect circle, an oval, and a rounded square, sometimes specifically a squircle, the shape modern app icons actually use rather than a plain rounded rectangle, are three genuinely different crops, and getting a transparent PNG out the other end matters because the cropped shape then needs to sit cleanly over whatever background it's placed on next, not just display correctly inside one platform's own circular mask. This tool crops an image into a circle, an oval, or a rounded square, with a transparent PNG output built for placing the result over any background rather than one specific display context. Useful for cropping a logo into a squircle shape for an app icon rather than a plain circle, creating an oval-cropped image that needs to sit over a custom background elsewhere, or producing a transparent circular cutout for a design that isn't tied to any single platform's own avatar mask.`,
    examples: [
      {
        title: 'Crop a logo into a squircle for an app icon',
        code: `Input: logo.png\nOutput: logo-squircle.png (rounded square, transparent background)`,
        note: 'Produces the squircle shape modern app icons actually use.',
      },
      {
        title: 'Create a transparent oval cutout',
        code: `Input: photo.jpg\nOutput: photo-oval.png (transparent PNG)`,
        note: 'Ready to place over any background, not just one platform mask.',
      },
    ],
  },

  'code-beautifier': {
    description: `Formatting JavaScript, HTML, CSS, and JSON each has its own specific rules, brace placement, tag nesting, property indentation, but working across a mixed file, or just not wanting to hunt down four separate single-language tools, is exactly the case a beautifier covering all four languages in one place is actually built for. This tool formats and indents JavaScript, HTML, CSS, and JSON code, handling all four languages in a single tool rather than requiring a different formatter for each one. Useful for cleaning up a mixed HTML file with embedded CSS and JavaScript in one pass, formatting a JSON config file without switching to a JSON-specific tool, or reformatting whichever of these four languages a specific file happens to be written in without checking first.`,
    examples: [
      {
        title: 'Format a mixed HTML file',
        code: `Input: <div><script>const x=1;const y=2;</script><style>.a{color:red}</style></div>\nOutput: properly indented HTML, embedded CSS, and JavaScript all formatted`,
        note: 'Handles all three languages inside one file in a single pass.',
      },
      {
        title: 'Beautify a JSON config file',
        code: `Input: {"debug":true,"port":8080}\nOutput:\n{\n  "debug": true,\n  "port": 8080\n}`,
        note: 'Formats JSON without needing a separate JSON-only tool.',
      },
    ],
  },

  'color-format-picker': {
    description: `CSS wants a color as HEX, a canvas drawing call often wants RGB channels as separate numbers, and a design tool might prefer HSL for an easy lightness adjustment, the same color needed in a different format depending entirely on where it's actually headed next, which matters more once a color is already picked than during the picking itself. This tool picks a color and switches instantly between HEX, RGB, RGBA, HSL, and HSLA formats, built around getting one color into whichever format a specific destination actually needs. Useful for picking a color once and copying it in HEX for CSS, then switching to RGB for the same color in a canvas API call, grabbing an HSLA value for a design tool that expects that specific format, or converting a single picked color across every format without picking it again each time.`,
    examples: [
      {
        title: 'Switch a picked color between formats',
        code: `Picked: #2563EB\nOutput: rgb(37, 99, 235), hsl(217, 83%, 53%)`,
        note: 'Converts the same picked color across formats instantly.',
      },
      {
        title: 'Get RGBA for a semi-transparent use case',
        code: `Picked: #2563EB, alpha: 0.5\nOutput: rgba(37, 99, 235, 0.5)`,
        note: 'Switches to the format a specific destination actually needs.',
      },
    ],
  },

  'color-picker-wheel': {
    description: `Typing in a HEX code or clicking through a flat grid of preset swatches works fine when a specific color is already known, but exploring the full range of what's actually available, browsing hues, adjusting saturation, seeing how a color shifts as it moves around the wheel, is a fundamentally more visual, intuitive way to actually find a color rather than guess at one by typing values. This tool picks colors from an interactive wheel, returning HEX, RGB, HSL, and CSS values for whatever's selected, built around visual exploration rather than typing a value that's already decided. Useful for browsing the full color space visually to find something that feels right rather than typing a value in blind, adjusting a hue by dragging around the wheel until it looks correct, or exploring color relationships visually before settling on one specific value.`,
    examples: [
      {
        title: 'Browse hues visually on the wheel',
        code: `Drag: around the wheel edge\nOutput: hue updates live as HEX, RGB, HSL values`,
        note: 'Explores the color space visually rather than typing a value in blind.',
      },
      {
        title: 'Adjust saturation by dragging inward',
        code: `Drag: toward the wheel center\nOutput: saturation decreases, value updates live`,
        note: 'Finds a color by feel rather than by number.',
      },
    ],
  },

  'colorize-photo': {
    description: `A genuinely black-and-white photo has actually lost its original color information entirely, there's no hidden color hiding underneath the grayscale to recover, which means colorizing it means synthesizing a plausible color based on learned patterns, skin tones, sky, grass, common objects, rather than restoring anything that's technically still there. This tool adds color to black-and-white photos automatically, producing a plausible, natural-looking result rather than a historically verified reconstruction of the original colors. Useful for bringing an old black-and-white family photo to life with a natural-looking colorized version, giving an archival image more visual engagement for a presentation or a display, or adding color to a vintage photo without expecting the exact original hues to come back.`,
    examples: [
      {
        title: 'Bring an old family photo to life',
        code: `Input: grandparents-1952.jpg (black and white)\nOutput: grandparents-1952-color.jpg (plausible colorization)`,
        note: 'Synthesizes natural-looking color rather than recovering lost original hues.',
      },
      {
        title: 'Colorize a vintage archival image',
        code: `Input: archive-photo.jpg\nOutput: archive-photo-color.jpg`,
        note: 'Improves visual engagement without claiming historical color accuracy.',
      },
    ],
  },

  compress: {
    description: `Most of a PDF's file size usually comes from its embedded images, a high-resolution scan, a batch of photos dropped into a report, rather than the actual text, which barely takes up any space at all, so real compression means re-encoding those images down without pushing the reduction far enough to blur a scanned page or make an embedded photo start looking degraded. This tool reduces a PDF's file size by compressing its embedded images and removing redundant internal resources, staying inside the range where the document is still practically usable. Useful for shrinking a scanned document down small enough to email when the original file is too large to attach, compressing a PDF full of embedded photos without the images turning visibly blurry, or reducing a report's file size for upload without the text itself losing any clarity.`,
    examples: [
      {
        title: 'Shrink a scanned document for email',
        code: `Input: scanned-contract.pdf (18 MB)\nOutput: scanned-contract-compressed.pdf (3 MB, text still sharp)`,
        note: 'Fits under a typical email attachment size limit.',
      },
      {
        title: 'Compress a photo-heavy report',
        code: `Input: report.pdf (25 MB, 40 embedded photos)\nOutput: report-compressed.pdf (6 MB)`,
        note: 'Reduces embedded image size without visible quality loss.',
      },
    ],
  },

  'compress-avi': {
    description: `Some legacy device, some specific piece of software, some existing workflow simply requires a file stay in AVI format, converting the container entirely to MP4 isn't actually an option, which leaves re-encoding the video at a lower bitrate as the only real path toward a smaller file when the current AVI is impractically large. This tool compresses an AVI video, reducing its file size while keeping it in the same AVI container rather than converting it into a different format. Useful for shrinking a large AVI file down for a device or a program that specifically won't accept anything but AVI, reducing storage space for archived AVI footage without changing its format, or compressing an AVI video for easier sharing when converting away from AVI isn't actually an option.`,
    examples: [
      {
        title: 'Shrink AVI footage without converting it',
        code: `Input: legacy-clip.avi (900 MB)\nOutput: legacy-clip-compressed.avi (250 MB, still AVI)`,
        note: 'Stays in the AVI container a specific device requires.',
      },
      {
        title: 'Reduce storage for archived AVI footage',
        code: `Input: archive-footage.avi\nOutput: archive-footage-compressed.avi`,
        note: 'Frees up storage space without changing the file format.',
      },
    ],
  },

  'content-improver': {
    description: `Catching a subject-verb agreement error and suggesting a punchier sentence structure are two different kinds of feedback, mechanical correctness on one hand, stylistic judgment on the other, and getting both in a single pass beats running a draft through a purely grammar-focused tool and then a separate style-focused one afterward. This tool improves writing with AI suggestions covering grammar, clarity, and style together, combining mechanical correction with stylistic feedback in one integrated pass. Useful for catching a grammar mistake and a clarity issue in the same review instead of two separate tools, tightening a sentence's structure while also fixing an actual error within it, or getting both mechanical and stylistic feedback on a draft without switching between different tools for each.`,
    examples: [
      {
        title: 'Fix a grammar error and tighten a sentence together',
        code: `Input: "The team have finished the project, it was a big accomplishment for us."\nOutput: "The team has finished the project, a real accomplishment."`,
        note: 'Corrects subject-verb agreement and improves structure in one pass.',
      },
      {
        title: 'Get combined clarity and mechanical feedback',
        code: `Input: [rough draft paragraph]\nOutput: grammar fixes + clarity suggestions listed together`,
        note: "Doesn't require a separate grammar-only and style-only tool.",
      },
    ],
  },

  'content-summarizer': {
    description: `Deciding whether a competitor's long blog post is actually worth reading in full, or just pulling out the specific points worth referencing while writing something of your own, is a content research task with a narrower purpose than summarizing text in general, getting the gist fast enough to make a quick call about a specific piece of source material. This tool summarizes long articles and documents into their key points, built around the content research workflow of quickly evaluating source material rather than general-purpose text summarization. Useful for quickly deciding whether a long article is worth reading in full before committing the time, pulling out the key points from a competitor's content while researching your own, or getting a fast digest of a long document during a content research pass.`,
    examples: [
      {
        title: "Decide if a competitor's article is worth reading",
        code: `Input: [2,400-word competitor blog post]\nOutput: 5 key points summarizing the article`,
        note: 'Makes a fast worth-reading call before committing the time.',
      },
      {
        title: 'Pull reference points while researching',
        code: `Input: [long-form source article]\nOutput: key points worth citing in your own content`,
        note: 'Built around the content research workflow specifically.',
      },
    ],
  },

  counter: {
    description: `A calculator performs an operation on numbers that already exist, but tallying reps during a workout, attendees walking through a door, or points during a game is counting something happening live, right now, one discrete event at a time, which calls for a big, immediately tappable button rather than a calculator's input field. This tool provides a simple counter for tracking anything in real time, built around fast, in-the-moment tallying rather than a calculation performed on existing numbers. Useful for counting reps during a workout without looking away from what you're actually doing, keeping score during a game with one tap per point, or tallying attendees or items as they pass by in real time rather than after the fact.`,
    examples: [
      {
        title: 'Count reps during a workout',
        code: `Tap: + button\nOutput: 1, 2, 3, 4... (increments live)`,
        note: 'Big tappable button for counting without looking away.',
      },
      {
        title: 'Keep score during a game',
        code: `Tap: + for a point scored\nOutput: running score updates instantly`,
        note: 'Tallies live events one tap at a time.',
      },
    ],
  },
};

export default FIX_BATCH_95;
