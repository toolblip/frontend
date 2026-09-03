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

const FIX_BATCH_93: Record<string, FixBatchEntry> = {
  'aac-to-wav': {
    description: `Converting a lossy AAC file to WAV doesn't restore any detail AAC's compression already discarded, that damage was done during the original encoding and no format change afterward gets it back, what actually happens is the compressed audio gets decoded into an uncompressed, universally readable container instead. This tool converts AAC into WAV, producing a file virtually any audio editor or piece of hardware can open without needing an AAC decoder installed at all. Useful for feeding an AAC recording into editing software that doesn't handle the format natively, archiving audio in a format that doesn't depend on a specific codec surviving long-term, or preparing an AAC file for a device or workflow that specifically expects uncompressed WAV input.`,
    examples: [
      {
        title: 'Prepare audio for an editor without AAC support',
        code: `Input: interview.aac\nOutput: interview.wav (uncompressed PCM)`,
        note: 'Opens in editing software that has no built-in AAC decoder.',
      },
      {
        title: 'Archive audio in a codec-independent format',
        code: `Input: recording.aac\nOutput: recording.wav`,
        note: "Doesn't depend on a specific codec still being supported years later.",
      },
    ],
  },

  'add-subtitles': {
    description: `SRT and VTT aren't interchangeable formats wearing different file extensions, their timestamp syntax actually differs, SRT separates milliseconds with a comma, VTT with a period, and VTT requires its own header line SRT doesn't carry at all, small enough differences that a subtitle file written for one format often fails silently when fed into software expecting the other. This tool attaches subtitles to a video and accepts either SRT or VTT directly, without requiring one format to be converted into the other first. Useful for adding captions to a video when the subtitle file already exists as SRT from one source and VTT from another, attaching subtitles without a separate conversion step beforehand, or preparing a video for a platform that specifically expects one subtitle format over the other.`,
    examples: [
      {
        title: 'Attach an SRT subtitle file',
        code: `Input: video.mp4, subtitles.srt\nOutput: video with SRT captions attached`,
        note: 'Accepts SRT directly without converting it first.',
      },
      {
        title: 'Attach a VTT subtitle file',
        code: `Input: video.mp4, subtitles.vtt\nOutput: video with VTT captions attached`,
        note: 'Handles VTT syntax, including its required header line.',
      },
    ],
  },

  'angle-unit-converter': {
    description: `Degrees split a circle into 360 arbitrary divisions chosen by ancient convention, but a radian is defined mathematically, the angle where an arc's length equals the circle's radius, which is exactly why a full circle comes out to two pi radians, an irrational number, rather than a clean round figure, and converting between the two means multiplying by pi over 180 instead of a tidy ratio. This tool converts angles between degrees, radians, gradians, and arcminutes instantly, handling that irrational conversion factor correctly rather than rounding it away. Useful for converting a trigonometry problem's answer from radians into degrees for a more intuitive reading, checking a CAD or engineering angle given in gradians against its degree equivalent, or converting arcminutes into decimal degrees for a navigation or surveying calculation.`,
    examples: [
      {
        title: 'Convert radians to degrees',
        code: `Input: π/4 radians\nOutput: 45°`,
        note: 'Applies the π/180 factor rather than a round conversion ratio.',
      },
      {
        title: 'Convert arcminutes to decimal degrees',
        code: `Input: 30 arcminutes\nOutput: 0.5°`,
        note: 'Useful for a navigation or surveying calculation.',
      },
    ],
  },

  'annotate-pdf': {
    description: `Leaving feedback on a shared draft and actually changing the document's content are two different operations that shouldn't be confused, a reviewer highlighting a paragraph and adding a comment needs the original text to stay visible underneath the markup. This tool draws text comments, highlights, and rectangles over a PDF page without replacing its underlying content. Useful for leaving feedback on a shared draft, highlighting a specific clause in a contract for discussion before anyone edits it, or marking up a document for review while keeping the actual text intact.`,
    examples: [
      {
        title: 'Leave feedback without editing the original',
        code: `Input: draft.pdf, comment: "Clarify this paragraph" on page 3\nOutput: draft-annotated.pdf (original text unchanged)`,
        note: 'Keeps review markup separate from the actual document content.',
      },
      {
        title: 'Highlight a clause for discussion',
        code: `Input: contract.pdf, highlight: paragraph 4.2\nOutput: contract-annotated.pdf`,
        note: 'Marks a specific section without altering the underlying text.',
      },
    ],
  },

  'article-generator': {
    description: `Handing over nothing but a topic and getting back a fully structured article means the AI is making every structural decision itself, the heading breakdown, the paragraph order, the overall angle, decisions someone providing an actual outline would rather make themselves and have the writing simply fill in. This tool generates a complete article from just a topic, handling the full structure automatically rather than requiring an outline to already exist. Useful for turning a bare topic idea into a fully structured, publishable draft without planning the outline first, generating a complete blog post fast when the specific structure matters less than getting a solid first draft, or producing a full article from minimal input when there's no time to outline one first.`,
    examples: [
      {
        title: 'Generate a full article from a bare topic',
        code: `Input: "benefits of remote work"\nOutput: full structured article with headings, intro, and conclusion`,
        note: 'Handles the entire structure automatically from minimal input.',
      },
      {
        title: 'Get a fast first draft',
        code: `Input: "how to choose a project management tool"\nOutput: complete draft ready for editing`,
        note: 'Produces a publishable starting point without an outline step first.',
      },
    ],
  },

  'article-title-generator': {
    description: `A title stuffed with the exact keyword phrase can read stiffly enough that nobody actually wants to click it, while a genuinely catchy headline sometimes skips the specific words people are searching for entirely, and the real answer usually isn't picking one extreme, it's generating several different angles on the same topic, a how-to framing, a listicle framing, a question framing, and choosing whichever one actually fits the article underneath it. This tool generates multiple title options from a single topic, each built around a different angle and balanced between SEO keyword inclusion and genuine click appeal. Useful for generating a handful of different title angles for the same article before picking the one that fits best, comparing a keyword-focused title against a curiosity-driven one for the same topic, or drafting several headline options quickly instead of staring at a blank title field.`,
    examples: [
      {
        title: 'Generate multiple title angles',
        code: `Input: "meal prepping for beginners"\nOutput: "5 Meal Prep Mistakes Beginners Make", "How to Start Meal Prepping This Week", "Is Meal Prepping Actually Worth It?"`,
        note: 'Produces distinct angles instead of one keyword-stuffed option.',
      },
      {
        title: 'Compare an SEO title against a catchy one',
        code: `Input: "budget travel tips"\nOutput: "Budget Travel Tips for 2026" vs "How I Traveled Europe on $30 a Day"`,
        note: 'Balances keyword inclusion against genuine click appeal.',
      },
    ],
  },

  'article-writer': {
    description: `Starting from an outline that already lays out the sections and their order is a fundamentally different writing task than starting from nothing but a bare topic, the structural decisions are already made, and what's actually needed is prose that fills in each section faithfully rather than an AI inventing its own structure from scratch. This tool writes a complete article from an existing outline through to a finished draft, following a structure that's already been decided rather than generating one automatically. Useful for turning a rough outline into full prose without losing the section order already planned, drafting an article's full text once the heading structure has already been worked out, or writing a complete piece from a specific outline rather than letting an AI choose the structure itself.`,
    examples: [
      {
        title: 'Turn an outline into full prose',
        code: `Input outline: [Intro, 3 main points, Conclusion]\nOutput: complete article following that exact structure`,
        note: 'Fills in prose without changing the planned section order.',
      },
      {
        title: 'Draft full text from a decided structure',
        code: `Input: 5-section outline with headings already chosen\nOutput: finished draft matching those headings`,
        note: 'Writes to a structure already decided rather than inventing one.',
      },
    ],
  },

  'ascii-art-generator': {
    description: `Turning the word "HELLO" into a large stylized banner built from block letters and turning an actual photograph into ASCII art are two completely different processes bundled under one name, the first draws each letter from a stylized character font, the second analyzes a photo's actual brightness values pixel by pixel and maps each level to a character of similar visual density, a period for something light, an @ symbol for something dark. This tool converts both text and images into ASCII art, with an adjustable character set and font size for either input type. Useful for generating a stylized text banner for a terminal README or a code comment header, converting an actual photo into ASCII art by mapping its brightness values to characters, or adjusting the character set to control how much visual detail an image-based conversion actually captures.`,
    examples: [
      {
        title: 'Generate a text banner',
        code: `Input: "HELLO"\nOutput:\n _   _ _____ _     _     ___\n| | | | ____| |   | |   / _ \\\n| |_| |  _| | |   | |  | | | |\n|  _  | |___| |___| |__| |_| |\n|_| |_|_____|_____|_____\\___/`,
        note: 'Draws stylized block letters from a character font.',
      },
      {
        title: 'Convert a photo to ASCII art',
        code: `Input: portrait.jpg\nOutput: characters mapped by brightness (. for light areas, @ for dark)`,
        note: "Maps each pixel's brightness to a character of similar visual density.",
      },
    ],
  },

  'avi-to-gif': {
    description: `Old camcorder footage, a video downloaded years ago, a clip pulled off an old hard drive, AVI shows up often enough in exactly this kind of legacy material, and turning a specific memorable moment from it into a shareable GIF means pulling that footage forward into a format actually usable today rather than leaving it stuck in an old container nobody shares directly anymore. This tool converts an AVI video into an animated GIF, built around extracting a short, shareable moment from older footage. Useful for turning a funny few seconds from an old AVI recording into a GIF worth sharing, pulling a reaction clip out of legacy camcorder footage, or converting an old downloaded AVI file into something that actually posts cleanly on a modern platform.`,
    examples: [
      {
        title: 'Turn old footage into a shareable GIF',
        code: `Input: old-camcorder-clip.avi, trim: 0:12-0:15\nOutput: reaction.gif`,
        note: 'Pulls a specific memorable moment out of legacy footage.',
      },
      {
        title: 'Convert a downloaded AVI clip',
        code: `Input: downloaded-clip.avi\nOutput: downloaded-clip.gif`,
        note: 'Turns an old container format into something that shares cleanly today.',
      },
    ],
  },

  'avi-to-mp4': {
    description: `AVI's typical codecs compress noticeably less efficiently than MP4's modern H.264 encoding, which means the same footage usually comes out both smaller and more broadly compatible once it's converted, a real upgrade rather than a lateral format swap, especially since plenty of phones, browsers, and social platforms don't accept a raw AVI upload at all. This tool converts AVI video into MP4, typically producing a smaller file that plays and uploads virtually everywhere AVI itself doesn't. Useful for shrinking old camcorder or downloaded AVI footage down to a size that's actually practical to store or share, converting an AVI file for a platform or an app that flatly rejects the format, or modernizing legacy video footage into the format phones and browsers actually expect today.`,
    examples: [
      {
        title: 'Shrink old footage for easier storage',
        code: `Input: home-video.avi (1.2 GB)\nOutput: home-video.mp4 (approximately 400 MB, comparable quality)`,
        note: 'Modern compression typically produces a smaller file than AVI.',
      },
      {
        title: 'Convert for a platform that rejects AVI',
        code: `Input: clip.avi\nOutput: clip.mp4`,
        note: 'Converts to a format phones, browsers, and social platforms actually accept.',
      },
    ],
  },
};

export default FIX_BATCH_93;
