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

const FIX_BATCH_104: Record<string, FixBatchEntry> = {
  'meta-description-generator': {
    description: `A meta description that reads perfectly well in an editor can still get cut off mid-sentence in an actual Google result once it crosses roughly a hundred and fifty-five to a hundred and sixty characters, and writing one by summarizing a page from memory risks producing something that sounds plausible but doesn't actually match what the page covers. This tool generates an SEO-optimized meta description directly from a page's actual content, with character count alerts flagging anything that would get truncated in search results before it ships. Useful for generating a description that stays inside a safe character limit instead of getting cut off in a live search result, producing a summary grounded in what a page's content actually says rather than a generic guess, or catching an over-length description during drafting instead of after it's already published and truncated.`,
    examples: [
      {
        title: 'Generate a description that fits the limit',
        code: `Input: [page content about a budgeting app]\nOutput: "Track spending, set budgets, and get alerts before you overspend. Free budgeting app for..." (152 chars)`,
        note: 'Flags length before publishing, not after truncation happens.',
      },
      {
        title: 'Ground a description in actual page content',
        code: `Input: [product page for a standing desk]\nOutput: description generated from the page's actual features, not a generic template`,
        note: "Matches what the page really covers rather than a guessed summary.",
      },
    ],
  },

  metadata: {
    description: `A photo's EXIF data and a Word document's author field and revision history are technically different kinds of metadata living in completely different file formats, but they raise the exact same underlying question, what information is actually riding along inside this file that isn't visible just from opening it normally, and sometimes the answer calls for changing a specific field rather than only looking at it or wiping everything at once. This tool views and edits file metadata directly, EXIF data, document properties, and more, across file types rather than being scoped to one format or to view-only access. Useful for checking a document's author and revision history before sharing it externally, editing a single EXIF field like a photo's timestamp without stripping every other tag, or inspecting whatever metadata a specific file type happens to carry without needing a format-specific tool for each one.`,
    examples: [
      {
        title: "Check a document's author before sharing",
        code: `Input: report.docx\nOutput: Author: Jane Doe, Last Modified: 2026-07-20, Revisions: 14`,
        note: 'Surfaces document properties, not just image EXIF data.',
      },
      {
        title: 'Edit a single field without stripping the rest',
        code: `Input: photo.jpg, edit: timestamp -> 2026-01-01T10:00:00\nOutput: photo.jpg (only the timestamp field changed)`,
        note: 'Modifies one field directly rather than removing everything.',
      },
    ],
  },

  'mkv-to-mp4': {
    description: `MKV is a genuinely capable container, multiple audio tracks, embedded subtitles, modern codecs, but plenty of current, mainstream platforms still don't actually accept it, a social media upload form, a newer smart TV's app, a video call platform's file-sharing feature, all built around MP4 specifically as the expected default rather than an older legacy format from over a decade ago. This tool converts an MKV file into MP4, targeting the format that today's mainstream devices and platforms actually expect rather than genuinely old hardware. Useful for converting an MKV file before uploading it to a platform that only accepts MP4, preparing a video for a current smart TV or streaming app that doesn't recognize MKV's container, or sharing a video with someone whose device or software simply expects MP4 as the default format.`,
    examples: [
      {
        title: 'Convert before uploading to a platform',
        code: `Input: episode.mkv\nOutput: episode.mp4 (accepted by upload forms that reject MKV)`,
        note: 'Targets current mainstream compatibility, not legacy hardware.',
      },
      {
        title: 'Prepare a file for a modern smart TV app',
        code: `Input: movie.mkv (multi-track audio, embedded subtitles)\nOutput: movie.mp4`,
        note: "Matches what a current streaming app's file support actually expects.",
      },
    ],
  },

  'morse-code-translator': {
    description: `A string of dots and dashes on a screen only captures half of what Morse code actually is, since it was built from the start as an audible signal, a dot as one unit of sound, a dash as three, and internalizing that relative timing by ear is what matters for using Morse code for real, sending or receiving it, rather than just seeing how a phrase happens to look written out. This tool converts text to and from Morse code with audio playback alongside the dot-dash display, letting the actual timing be heard rather than only read as static symbols. Useful for practicing real Morse timing by ear ahead of a ham radio licensing test, translating a phrase into Morse and hearing exactly how it should actually sound when sent, or decoding a Morse audio pattern back into readable text instead of working from a written dot-dash string alone.`,
    examples: [
      {
        title: 'Practice Morse timing by ear',
        code: `Input: "SOS"\nOutput: ... --- ... (played as audio with correct dot/dash timing)`,
        note: 'Lets the actual timing be heard, not just read as symbols.',
      },
      {
        title: 'Translate and hear a phrase',
        code: `Input: "HELLO WORLD"\nOutput: .... . .-.. .-.. --- / .-- --- .-. .-.. -.. (with audio playback)`,
        note: 'Shows how a phrase should actually sound when sent.',
      },
    ],
  },

  'mov-to-mp3': {
    description: `A screen recording made on a Mac or a video clip captured on an iPhone saves as MOV by default, QuickTime's native container, and once the only part actually needed is the audio, a voice memo captured that way, a narration track, dialogue from an interview, the video itself is just extra weight next to a small MP3 that plays anywhere. This tool extracts the audio track from a MOV file and saves it as MP3, dropping the QuickTime-specific video container down to a lightweight, universally playable audio file. Useful for pulling a voice memo's audio out of a QuickTime recording without keeping the video, saving the narration from a Mac screen recording as a standalone MP3, or converting an iPhone-recorded clip's audio into a small file that plays on any device without QuickTime installed.`,
    examples: [
      {
        title: "Extract a voice memo's audio",
        code: `Input: voice-memo.mov\nOutput: voice-memo.mp3`,
        note: 'Drops the QuickTime video container down to lightweight audio.',
      },
      {
        title: 'Save narration from a Mac screen recording',
        code: `Input: screen-recording.mov\nOutput: narration.mp3`,
        note: 'Plays on any device without QuickTime installed.',
      },
    ],
  },

  'mov-to-mp4': {
    description: `A video recorded on an iPhone or captured in QuickTime saves natively as MOV, a container built around Apple's own ecosystem that doesn't always play cleanly the moment it leaves it, a Windows machine's default player, a non-Apple upload form, a website expecting standard web video. This tool converts a MOV file into MP4, moving a QuickTime-native recording into the format built for playing everywhere else. Useful for converting an iPhone-recorded video before sending it to someone on a non-Apple device, uploading a QuickTime screen recording to a website or a platform that expects standard MP4, or preparing a MOV file for sharing somewhere that doesn't have QuickTime available to play it natively.`,
    examples: [
      {
        title: 'Convert an iPhone video for a non-Apple device',
        code: `Input: IMG_4821.mov\nOutput: IMG_4821.mp4`,
        note: 'Moves a QuickTime-native file into a universally playable format.',
      },
      {
        title: 'Upload a QuickTime recording to a website',
        code: `Input: demo-recording.mov\nOutput: demo-recording.mp4`,
        note: "Matches what a standard web video upload form actually expects.",
      },
    ],
  },

  'mp4-to-mov': {
    description: `Apple's professional editing software, Final Cut Pro and iMovie included, is built around QuickTime's MOV container and the codecs that go with it, which means importing a universally-recorded MP4 into that specific editing pipeline sometimes benefits from converting to MOV first rather than working with the format as-is throughout an entire edit. This tool converts an MP4 file into QuickTime MOV, preserving quality for an editing workflow built around Apple's own container rather than for cross-platform sharing afterward. Useful for converting an MP4 before importing it into Final Cut Pro or iMovie for editing, preparing footage for a Mac-based editing pipeline that expects QuickTime's native format, or getting a video into MOV specifically because the editing software downstream works with that container more reliably than MP4.`,
    examples: [
      {
        title: 'Prepare footage for Final Cut Pro',
        code: `Input: raw-footage.mp4\nOutput: raw-footage.mov`,
        note: 'Matches the container Apple editing software is built around.',
      },
      {
        title: 'Convert before a Mac-based editing pipeline',
        code: `Input: interview-clip.mp4\nOutput: interview-clip.mov (quality preserved for editing)`,
        note: "Built for the editing step, not for cross-platform sharing.",
      },
    ],
  },

  'mp4-to-ogg': {
    description: `MP3 carried patent licensing baggage for years, which mattered to open-source software that didn't want a proprietary codec bundled into a free project, and Ogg Vorbis existed specifically as the open, patent-unencumbered alternative that a Linux application or an open-source project could actually depend on without that concern. This tool converts an MP4 video's audio track into OGG format, producing a file built around that open-source codec lineage rather than a proprietary compressed format. Useful for converting audio for a Linux-native application or an open-source project that specifically avoids proprietary codec dependencies, producing an OGG file for a platform or a game engine that expects that specific open format, or extracting an MP4's audio into a codec that doesn't carry MP3's old licensing history.`,
    examples: [
      {
        title: 'Convert audio for an open-source project',
        code: `Input: soundtrack.mp4\nOutput: soundtrack.ogg`,
        note: "Uses the codec lineage a Linux-native project actually depends on.",
      },
      {
        title: 'Produce an OGG asset for a game engine',
        code: `Input: sound-effect-source.mp4\nOutput: sound-effect.ogg`,
        note: "Matches the open format many game engines expect for audio assets.",
      },
    ],
  },

  mute: {
    description: `Every audio extraction tool in this category keeps the sound and throws away the picture, but sometimes the actual need runs the other way entirely, a background video loop for a website hero section, a placeholder clip waiting on a real voiceover, footage carrying copyrighted music that would trigger a claim the moment it's reposted, cases where the video is what matters and the audio is the part that has to go. This tool removes the audio track from a video file entirely, producing a silent version rather than extracting the sound the way a conversion tool would. Useful for creating a silent looping background video for a website that autoplays without sound, stripping a placeholder narration track before recording a final voiceover over the same footage, or removing copyrighted background music from a clip before reposting it somewhere that would otherwise flag it.`,
    examples: [
      {
        title: 'Create a silent autoplay background video',
        code: `Input: hero-loop.mp4 (with audio)\nOutput: hero-loop-silent.mp4`,
        note: 'Keeps the video and drops the audio, the reverse of extraction.',
      },
      {
        title: 'Remove copyrighted background music',
        code: `Input: clip-with-music.mp4\nOutput: clip-silent.mp4`,
        note: 'Avoids a copyright claim before reposting the footage.',
      },
    ],
  },

  'network-port-checker': {
    description: `Confirming a specific port is actually open usually means reaching for a command-line tool like telnet or nmap, software that has to be installed and run locally, which isn't always an option on a locked-down corporate laptop, a Chromebook, or a mobile device with no terminal access at all. This tool checks whether a specific network port is open on a remote host directly from the browser, without any local installation or command-line access required. Useful for confirming a server's firewall actually opened a specific port to the public internet after a configuration change, checking whether a service is reachable on its expected port from a device with no terminal available, or verifying port connectivity quickly without installing network diagnostic software first.`,
    examples: [
      {
        title: "Confirm a firewall change opened a port",
        code: `Input: host: example.com, port: 8080\nOutput: port 8080 - open`,
        note: 'Checked directly from the browser, no local tool installed.',
      },
      {
        title: 'Check connectivity from a device with no terminal',
        code: `Input: host: mail.example.com, port: 587\nOutput: port 587 - open`,
        note: 'Works on a locked-down laptop or a Chromebook.',
      },
    ],
  },
};

export default FIX_BATCH_104;
