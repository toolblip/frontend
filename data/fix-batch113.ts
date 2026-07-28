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

const FIX_BATCH_113: Record<string, FixBatchEntry> = {
  'vsdx-to-docx': {
    description: `VSDX and DOCX are both modern XML-based formats built on the same underlying Open XML container structure Microsoft adopted across its newer file formats, which means converting between them is working from one structured XML document into another rather than reverse-engineering an older proprietary binary format the way a legacy VSD conversion has to. This tool converts a Visio VSDX diagram into a Word document, producing an editable result that benefits from both formats sharing that same modern, structured foundation. Useful for converting a VSDX flowchart into a Word document with higher structural fidelity than a legacy-format conversion typically achieves, embedding a diagram inside a written report that still needs ongoing text edits, or getting a modern Visio file into an editable Word document without needing Visio installed at all.`,
    examples: [
      {
        title: 'Convert a VSDX flowchart with high fidelity',
        code: `Input: process-flow.vsdx\nOutput: process-flow.docx (structure preserved via shared Open XML foundation)`,
        note: 'Benefits from XML-to-XML conversion rather than legacy binary parsing.',
      },
      {
        title: 'Embed a diagram in an editable report',
        code: `Input: architecture-diagram.vsdx\nOutput: architecture-diagram.docx (editable alongside surrounding text)`,
        note: 'No Visio installation required to edit the surrounding document.',
      },
    ],
  },

  'vsdx-to-jpg': {
    description: `Sending someone a full VSDX file to look at one diagram assumes they have Visio installed just to glance at it, when the actual need in the moment is often just a quick snapshot to drop into a chat message or an email, not a formal deliverable meant for archiving or embedding in a slide deck. This tool exports a Visio VSDX diagram as a JPEG image, producing a fast, shareable snapshot rather than a document meant for long-term use or presentation. Useful for dropping a quick diagram snapshot into a Slack message or an email without attaching the original file, sharing a fast preview of a flowchart with someone who just needs to see it once, or grabbing an image version of a diagram for a quick reference rather than a polished deliverable.`,
    examples: [
      {
        title: 'Drop a quick snapshot into a chat message',
        code: `Input: network-diagram.vsdx\nOutput: network-diagram.jpg (ready to paste into Slack)`,
        note: 'A fast snapshot, not a formal deliverable file.',
      },
      {
        title: 'Share a fast preview without the original file',
        code: `Input: org-chart.vsdx\nOutput: org-chart.jpg`,
        note: "Useful when someone just needs to see it once.",
      },
    ],
  },

  'vsdx-to-pptx': {
    description: `A VSDX file isn't necessarily one diagram, it can hold several pages the way a multi-page document does, which maps naturally onto PowerPoint's own multi-slide structure, each page becoming its own slide in sequence rather than flattening an entire multi-page diagram set down into a single static image or one lone slide. This tool converts a Visio VSDX file into a PowerPoint presentation, turning a multi-page diagram set into a sequential slide deck rather than a single flattened output. Useful for converting a multi-page Visio process document into a full slide deck with one page per slide, turning a set of related diagrams into a sequential presentation automatically, or moving an entire multi-page VSDX file into PowerPoint without manually recreating each page as its own slide.`,
    examples: [
      {
        title: 'Convert a multi-page diagram set into a slide deck',
        code: `Input: process-flow.vsdx (4 pages)\nOutput: process-flow.pptx (4 slides, one per page)`,
        note: 'Maps each VSDX page onto its own PowerPoint slide automatically.',
      },
      {
        title: 'Move a full VSDX file into PowerPoint',
        code: `Input: training-diagrams.vsdx (6 pages)\nOutput: training-diagrams.pptx (6 slides)`,
        note: 'No manual recreation of each page as a separate slide.',
      },
    ],
  },

  watermark: {
    description: `Removing an existing watermark cleans up a mark that's already there, but adding one is the opposite move entirely, a document's owner marking a draft as a draft or a confidential file as confidential before it ever gets shared, a proactive step taken ahead of distribution rather than a reactive cleanup afterward. This tool adds a text or an image watermark to a PDF file, letting a document's owner mark it clearly before sharing rather than fixing an existing mark left by someone else. Useful for stamping 'CONFIDENTIAL' or 'DRAFT' across every page of a document before it goes out for review, adding a company logo watermark to discourage unauthorized reproduction before a file gets shared externally, or marking a draft clearly as a draft so nobody mistakes it for a final version.`,
    examples: [
      {
        title: 'Stamp a document before external review',
        code: `Input: proposal.pdf, watermark: "CONFIDENTIAL"\nOutput: proposal-watermarked.pdf (every page stamped)`,
        note: 'A proactive mark added before sharing, not a cleanup step.',
      },
      {
        title: 'Add a logo watermark before distribution',
        code: `Input: report.pdf, watermark: company-logo.png\nOutput: report-watermarked.pdf`,
        note: 'Discourages unauthorized reproduction ahead of sharing.',
      },
    ],
  },

  'webm-to-mov': {
    description: `A screen recording captured directly in a browser, a WebRTC call recording, a Chrome or Firefox screen capture, saves as WebM by default, a format macOS and iOS's own native apps, QuickTime Player, iMovie, Photos, generally don't handle as smoothly as MOV, their actual native container. This tool converts a WebM file into QuickTime MOV format, moving a browser-originated recording into the format Apple's own operating system and native apps are actually built around. Useful for converting a browser-captured screen recording so it plays smoothly in QuickTime Player on a Mac, getting a WebM video into iMovie or Photos without a playback hiccup, or preparing a browser-recorded video for macOS or iOS's native media apps rather than the format it was originally captured in.`,
    examples: [
      {
        title: "Play a browser recording in QuickTime",
        code: `Input: screen-recording.webm\nOutput: screen-recording.mov`,
        note: 'Moves a browser-native format into macOS/iOS-native containers.',
      },
      {
        title: 'Import a WebRTC recording into iMovie',
        code: `Input: call-recording.webm\nOutput: call-recording.mov`,
        note: 'Avoids a playback hiccup in native Apple media apps.',
      },
    ],
  },

  'webp-converter': {
    description: `Page weight is one of the more direct levers over how fast a site actually loads, and WebP compresses meaningfully smaller than JPEG or PNG at comparable visual quality, which makes converting an existing image library into WebP one of the more effective ways to cut load time without touching anything else about a page. This tool converts images into WebP format for high-quality web compression with smaller file sizes, built for improving a site's actual load performance rather than for compatibility with a destination that doesn't accept WebP at all. Useful for converting a site's existing image library into WebP to reduce page weight across the board, shrinking a large batch of photos before deploying them to a page where load speed actually matters, or adopting WebP as a default format specifically for the compression gain it offers over older image formats.`,
    examples: [
      {
        title: "Convert a site's image library to WebP",
        code: `Input: 200 JPEG product photos\nOutput: 200 WebP images (35% smaller on average)`,
        note: 'Aimed at page weight reduction, not compatibility fallback.',
      },
      {
        title: 'Shrink images before a performance-sensitive launch',
        code: `Input: hero-banner.png (1.8 MB)\nOutput: hero-banner.webp (420 KB)`,
        note: 'Cuts load time where it directly affects page speed.',
      },
    ],
  },

  'webp-to-avif': {
    description: `WebP already compresses noticeably smaller than JPEG or PNG, which means the jump from WebP to AVIF isn't the dramatic leap that converting from an older, less efficient format would produce, it's squeezing out the remaining margin between two formats that were both already built for efficient web delivery. This tool converts WebP images into AVIF format, next-generation compression for a site that's already adopted WebP and wants to push further rather than starting from an older baseline. Useful for moving a site that's already standardized on WebP to AVIF for the additional compression gain still available, converting an existing WebP image library to squeeze out further file size savings, or adopting AVIF specifically because WebP alone no longer represents the smallest option actually available.`,
    examples: [
      {
        title: "Push further from an already-modern baseline",
        code: `Input: banner.webp (180 KB)\nOutput: banner.avif (125 KB)`,
        note: 'A smaller marginal gain than converting from an older format.',
      },
      {
        title: "Squeeze more savings from a WebP library",
        code: `Input: 150 WebP product images\nOutput: 150 AVIF images, further reduced`,
        note: "For a site that's already adopted WebP and wants to push further.",
      },
    ],
  },

  'webp-to-gif': {
    description: `An animated WebP is a genuinely efficient format, but GIF is what reaction culture actually runs on, Slack, Discord, group chats, meme threads, all built around GIF as the assumed format for a quick animated reaction regardless of which format would technically compress the same clip smaller. This tool converts a WebP animation into a GIF, trading WebP's better compression for the format that's actually expected wherever reactions and animations get shared casually. Useful for turning an efficiently compressed WebP animation into a GIF for a reaction meant to be dropped into a group chat, converting an animated WebP into the format a meme thread or a forum actually expects, or getting an animation into GIF specifically because that's the shareable format everyone recognizes rather than the most efficient one.`,
    examples: [
      {
        title: 'Convert a reaction for a group chat',
        code: `Input: reaction.webp (animated)\nOutput: reaction.gif`,
        note: 'Trades compression efficiency for universal reaction-format recognition.',
      },
      {
        title: 'Prepare an animation for a meme thread',
        code: `Input: animated-clip.webp\nOutput: animated-clip.gif`,
        note: 'GIF is the expected format regardless of technical efficiency.',
      },
    ],
  },

  'websocket-tester': {
    description: `A normal HTTP request and response is a one-shot exchange that closes the moment the answer comes back, but a WebSocket connection stays open, letting a server push a new message to the client at any moment without the client asking again, a fundamentally different behavior no ordinary API testing tool built around request-then-close can actually exercise. This tool connects to a WebSocket server, sends messages, and inspects real-time responses, built specifically for testing that persistent, bidirectional connection rather than a single request-response cycle. Useful for confirming a WebSocket server actually pushes an update to a connected client without a new request triggering it, testing how a real-time feature behaves over a connection that's expected to stay open, or inspecting messages flowing in both directions on a persistent connection an HTTP tool was never built to hold open.`,
    examples: [
      {
        title: 'Confirm a server pushes updates unprompted',
        code: `Input: wss://example.com/live-feed\nOutput: message received: {"price": 142.5} (pushed without a new request)`,
        note: 'Exercises server-push behavior an HTTP tool cannot test.',
      },
      {
        title: 'Inspect bidirectional messages',
        code: `Sent: {"subscribe": "orders"}\nReceived: {"order_id": 4821, "status": "shipped"}`,
        note: 'Tests a connection meant to stay open, not a one-shot exchange.',
      },
    ],
  },

  'word-alphabetizer': {
    description: `Sorting a list where every line is already one discrete item, a name, a URL, a log entry, is a different task than pulling individual words out of a block of continuous prose and figuring out which ones are actually unique, since a paragraph doesn't arrive pre-split into one word per line the way a list already does. This tool extracts and alphabetically sorts unique words from any text block, working at the individual word level within continuous prose rather than sorting a list that's already broken into discrete lines. Useful for building a vocabulary list or a word index from a passage of prose rather than a pre-structured list, checking which unique words actually appear across a longer document, or generating an alphabetized glossary of terms straight from continuous text instead of a list built one line at a time.`,
    examples: [
      {
        title: 'Build a vocabulary list from a passage',
        code: `Input: "The quick brown fox jumps over the lazy dog. The dog barks."\nOutput: barks, brown, dog, fox, jumps, lazy, over, quick, the`,
        note: 'Extracts unique words from prose, not a pre-split list.',
      },
      {
        title: 'Generate a glossary from continuous text',
        code: `Input: [500-word article]\nOutput: alphabetized list of every unique word used`,
        note: 'Works at the word level within running text.',
      },
    ],
  },
};

export default FIX_BATCH_113;
