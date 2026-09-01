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

const FIX_BATCH_89: Record<string, FixBatchEntry> = {
  'png-to-eps': {
    description: `A print shop's prepress software or an older PostScript-based layout program sometimes won't accept a modern web format like SVG at all, but EPS, an older PostScript-based standard, has been the expected format for that kind of prepress workflow for decades, whether that means wrapping a raster image inside a PostScript container as-is or actually tracing it into vector paths first. This tool converts a PNG into EPS, preparing a raster image for a print production pipeline that specifically expects PostScript-based artwork rather than a modern vector or raster web format. Useful for submitting artwork to a print vendor whose prepress software specifically requires EPS files, preparing a PNG logo for placement in older layout software built around PostScript formats, or converting a raster image into the format a legacy print workflow has expected for decades.`,
    examples: [
      {
        title: 'Submit artwork to a print vendor',
        code: `Input: brand-logo.png\nOutput: brand-logo.eps`,
        note: 'Meets a print shop prepress workflow expecting PostScript-based artwork.',
      },
      {
        title: 'Prepare a logo for older layout software',
        code: `Input: icon.png\nOutput: icon.eps`,
        note: 'Converts for legacy software built around PostScript formats rather than SVG.',
      },
    ],
  },

  'color-palette-extractor': {
    description: `A simple two-color logo and a busy, detailed photograph don't actually have the same number of meaningfully distinct colors in them, and a tool that always hands back a fixed count, five swatches no matter what, either pads a simple image with colors that aren't really there or crams a complex photo's real palette down into far fewer than it should have. This tool extracts an image's dominant colors and adapts how many it returns to how much color variation the image actually contains, rather than always returning a fixed number of swatches. Useful for pulling just the two or three colors that genuinely define a simple logo, extracting a fuller palette from a photo with real color variety instead of an artificially capped count, or getting HEX, RGB, and HSL values for however many colors an image actually warrants rather than a preset number.`,
    examples: [
      {
        title: 'Extract a simple palette from a logo',
        code: `Input: two-tone-logo.png\nOutput: #2563EB, #FFFFFF (2 colors)`,
        note: 'Returns only the colors actually present instead of padding to a fixed count.',
      },
      {
        title: 'Extract a fuller palette from a busy photo',
        code: `Input: market-scene.jpg\nOutput: 9 dominant colors with HEX, RGB, and HSL values`,
        note: 'Scales the color count up to match a genuinely varied image.',
      },
    ],
  },

  'json-to-typescript-types': {
    description: `A type alias and an interface aren't interchangeable in TypeScript, a type can directly represent a union like "active" | "inactive" pulled from values actually observed across several JSON samples, something an interface has no direct way to express, while an interface is built specifically for object shapes meant to be extended or merged later. This tool converts JSON data into TypeScript type definitions using type alias syntax, built for representing unions and literal value sets a plain interface can't capture. Useful for generating a union type from a field that only ever takes a handful of specific string values across sample data, converting JSON into type definitions for a codebase that already favors type aliases over interfaces, or representing a JSON shape that genuinely needs a union rather than a single extendable object type.`,
    examples: [
      {
        title: 'Generate a union from observed string values',
        code: `Input: [{ "status": "active" }, { "status": "inactive" }, { "status": "pending" }]\nOutput: type Status = "active" | "inactive" | "pending";`,
        note: "Represents a union interface syntax can't express directly.",
      },
      {
        title: 'Convert a JSON shape into a type alias',
        code: `Input: { "id": 1, "name": "Jane" }\nOutput: type User = { id: number; name: string };`,
        note: 'Uses type alias syntax rather than an interface declaration.',
      },
    ],
  },

  'explain-like-five': {
    description: `Rewriting an existing paragraph in simpler words is a different task from explaining a concept nobody has written down yet at all, how vaccines actually work, what a blockchain is, starting from nothing and building an explanation around an everyday analogy, a firewall as a bouncer checking IDs at a door, rather than editing sentences that already exist. This tool generates a brand new, analogy-driven explanation of a complex topic from scratch, built around relating an unfamiliar concept to something immediately familiar rather than simplifying existing prose. Useful for getting a from-scratch explanation of a technical concept with no existing write-up to simplify, understanding an unfamiliar topic through a relatable everyday comparison, or getting a beginner-friendly explanation built around analogy rather than a lightly reworded version of a technical source.`,
    examples: [
      {
        title: 'Explain a concept with no existing write-up',
        code: `Input: "how do vaccines work?"\nOutput: "Think of your immune system as security guards learning a criminal's face from a photo before they ever show up."`,
        note: 'Builds an explanation from scratch around a familiar analogy.',
      },
      {
        title: 'Understand an unfamiliar technical term',
        code: `Input: "what is a firewall?"\nOutput: "A bouncer checking IDs at a door, letting in traffic that's allowed and blocking everything else."`,
        note: 'Relates an unfamiliar concept to something immediately intuitive.',
      },
    ],
  },

  'http-request-headers-inspector': {
    description: `Knowing what headers a server sent back only tells half the story, the other half is what the browser actually sent as a request in the first place, and neither one explains where the time in a slow request actually went, DNS lookup, TLS handshake, waiting on the server, without an actual timing breakdown alongside the headers themselves. This tool inspects both request and response headers for any URL together, with a timing breakdown showing where time was spent and a security analysis flagging headers that fall short of best practice. Useful for seeing exactly what headers a browser sent alongside what a server returned for the same request, diagnosing whether a slow request is actually a DNS, TLS, or server response delay, or getting a security assessment of a page's headers rather than just a plain list of what's present.`,
    examples: [
      {
        title: 'See both request and response headers together',
        code: `Input: https://example.com\nOutput: Request: User-Agent, Accept-Encoding | Response: Cache-Control, Content-Type`,
        note: 'Shows what was sent alongside what came back for the same request.',
      },
      {
        title: 'Diagnose where request time went',
        code: `Input: https://example.com\nOutput: DNS: 12ms, TLS: 45ms, Server: 210ms, Total: 267ms`,
        note: 'Breaks down a slow request into its actual timing stages.',
      },
    ],
  },

  unlock: {
    description: `A PDF you have permission to use can still be inconvenient when it asks for a password every time it opens or carries restrictions that no longer serve a purpose. This tool unlocks an accessible PDF in your browser: files that open normally are re-saved, and files that require an opening password are rendered into a new password-free PDF when you provide the current password. The password-protected path produces a flattened document, so the visible pages are preserved but the original text and form structure aren't editable.`,
    examples: [
      {
        title: 'Unlock a PDF with its current password',
        code: `Input: old-report.pdf, password: "correct password supplied"\nOutput: old-report-unlocked.pdf`,
        note: 'Creates a password-free, flattened copy after the current password is accepted.',
      },
      {
        title: 'Re-save a PDF that opens normally',
        code: `Input: handout.pdf (no opening password)\nOutput: handout-unlocked.pdf`,
        note: 'Re-saves the accessible PDF locally without its existing permission metadata.',
      },
    ],
  },

  'ogg-to-mp3': {
    description: `OGG Vorbis is a genuinely good open codec, but plenty of car stereos, older portable players, and specific apps simply don't recognize an .ogg file at all, while MP3, despite being a less efficient format by comparison, plays on nearly everything without a second thought, which is exactly the tradeoff this conversion makes. This tool converts OGG audio into MP3, trading OGG's open format for MP3's far broader hardware and software compatibility. Useful for converting an OGG file so it actually plays on a car stereo or an older device that doesn't support it, preparing audio for an app or a platform that only accepts MP3 uploads, or making an OGG-based audio library playable on hardware that never added support for the format.`,
    examples: [
      {
        title: 'Make an OGG file play on a car stereo',
        code: `Input: podcast-episode.ogg\nOutput: podcast-episode.mp3`,
        note: 'Converts to the format nearly every car stereo actually supports.',
      },
      {
        title: 'Prepare audio for an MP3-only upload',
        code: `Input: track.ogg\nOutput: track.mp3`,
        note: 'Matches a platform that only accepts MP3 files.',
      },
    ],
  },

  'emoji-finder': {
    description: `A single emoji on screen isn't always one Unicode character underneath, a family emoji or a skin-tone-modified emoji is actually several code points joined together with a zero-width joiner and rendered as one glyph by a font that knows how to combine them, and copying only the first code point instead of the full sequence produces something that renders as broken or separate symbols elsewhere. This tool searches emojis by keyword and copies the complete underlying Unicode sequence, multiple joined code points where that's what an emoji actually consists of, rather than a single character assumed to be enough. Useful for copying a compound emoji's full code point sequence so it renders correctly wherever it's pasted, searching by keyword instead of scrolling through a picker to find a specific emoji, or getting the exact Unicode sequence behind an emoji for use in code.`,
    examples: [
      {
        title: 'Copy a compound emoji correctly',
        code: `Search: "family"\nOutput: 👨‍👩‍👧‍👦 (4 code points joined by ZWJ, copied as one sequence)`,
        note: 'Copies the full code point sequence instead of a single broken character.',
      },
      {
        title: 'Search by keyword instead of scrolling a picker',
        code: `Search: "fire"\nOutput: 🔥, 🚒, 🧯`,
        note: 'Finds a specific emoji directly rather than browsing categories.',
      },
    ],
  },

  'webm-to-mp3': {
    description: `A WebM video recorded from a screen capture or downloaded from a web-native source usually carries its audio in Opus or Vorbis, codecs common inside WebM but with noticeably spottier support across devices and software than MP3 gets almost everywhere, and when only the sound actually matters, a lecture, a webinar, a podcast-style recording, converting straight to MP3 skips carrying the video along for no reason. This tool extracts a WebM video's audio track and saves it as MP3, discarding the video entirely for the widest possible audio compatibility. Useful for pulling just the audio out of a recorded webinar or lecture without keeping the video file, converting a WebM screen recording's narration into a portable MP3, or extracting sound from a web video for an audio-only use case where the picture was never actually needed.`,
    examples: [
      {
        title: 'Extract narration from a screen recording',
        code: `Input: screen-recording.webm (Opus audio)\nOutput: narration.mp3`,
        note: 'Discards the video, keeping only the widely compatible audio.',
      },
      {
        title: 'Pull audio from a webinar recording',
        code: `Input: webinar.webm\nOutput: webinar-audio.mp3`,
        note: 'Produces a portable audio-only file when the video was never needed.',
      },
    ],
  },

  unblur: {
    description: `Sharpening amplifies contrast at edges that are already there, which works fine on an image that's merely a little soft, but a photo that's genuinely out of focus or blurred by camera shake is missing detail outright, not just softened, and no amount of edge-contrast amplification recovers information that was never actually captured in the first place. This tool uses AI-based deblurring to reconstruct plausible detail in a genuinely blurry or low-resolution photo, going beyond what a standard sharpening filter can do with edges that are already faint or missing entirely. Useful for recovering a genuinely out-of-focus photo that a normal sharpen filter can't actually fix, salvaging a motion-blurred shot from camera shake, or improving a low-resolution image where the real detail needs to be reconstructed rather than just made to look crisper.`,
    examples: [
      {
        title: 'Recover a genuinely out-of-focus photo',
        code: `Input: blurry-photo.jpg (missed focus)\nOutput: blurry-photo-restored.jpg (reconstructed detail)`,
        note: "Goes beyond a sharpen filter, which can't restore genuinely missing detail.",
      },
      {
        title: 'Salvage a motion-blurred shot',
        code: `Input: action-shot.jpg (camera shake blur)\nOutput: action-shot-restored.jpg`,
        note: 'Uses AI reconstruction rather than amplifying contrast that was never there.',
      },
    ],
  },
};

export default FIX_BATCH_89;
