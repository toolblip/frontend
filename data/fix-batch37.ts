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

const FIX_BATCH_37: Record<string, FixBatchEntry> = {
  'yaml-to-toml': {
    description: `YAML's indentation-based structure hides a well-known parsing trap: an unquoted value like "no" or "NO" or even a two-letter country code can get silently interpreted as a boolean or a different type entirely depending on which YAML parser reads it, the same ambiguity that made TOML's designers build a format specifically to avoid it. This tool converts YAML into TOML, validating the source structure and pretty-printing the result, which matters for landing in the exact format a growing number of developer tools specifically expect for config files, Rust's Cargo.toml, Python's pyproject.toml, several static site generators, rather than the YAML config those tools were never actually built around. Useful for converting an existing YAML config into TOML for a tool that specifically requires it, sidestepping YAML's implicit type-conversion quirks in the process, or standardizing a project's config files on TOML's less ambiguous syntax.`,
    examples: [
      {
        title: 'Convert a config file for a tool that requires TOML',
        code: `Input YAML:\nname: my-project\nversion: 1.0.0\nOutput TOML:\nname = "my-project"\nversion = "1.0.0"`,
        note: 'Matches the format tools like Cargo or a Python build system specifically expect.',
      },
      {
        title: "Avoid YAML's implicit boolean conversion",
        code: `Input YAML: country: NO (Norway, misread as boolean false by some parsers)\nOutput TOML: country = "NO" (always parsed as a string)`,
        note: "TOML's syntax avoids the ambiguity that causes YAML's well-known 'Norway problem.'",
      },
    ],
  },

  'scrypt-hash-generator': {
    description: `Argon2 is the newer, generally recommended choice for a brand-new project's password hashing, but plenty of existing systems, a cryptocurrency wallet, an older authentication library, a stack that specifically standardized on Scrypt years before Argon2 existed, still need to generate or verify hashes using Scrypt specifically rather than switching algorithms just to match a newer recommendation. This tool generates a Scrypt hash with its core parameters, the CPU and memory cost factor N, the block size r, and the parallelization factor p, all configurable directly, tuned to match whatever an existing system already expects. Useful for generating a Scrypt hash compatible with a system that already uses it, matching parameters to a specific existing implementation like Node's built-in Scrypt support, or working with a legacy codebase where switching to a newer hashing algorithm isn't the actual task at hand.`,
    examples: [
      {
        title: 'Generate a Scrypt hash matching an existing system',
        code: `Input: password: "correct-horse-battery", N: 16384, r: 8, p: 1\nOutput: $scrypt$ln=14,r=8,p=1$...`,
        note: 'Matches the specific parameters an existing Scrypt-based system already uses.',
      },
      {
        title: "Match Node's built-in Scrypt defaults",
        code: `Input: N: 16384, r: 8, p: 1 (Node.js crypto.scrypt defaults)\nOutput: hash compatible with Node's native scrypt implementation`,
        note: 'Useful when verifying against a system built on a specific standard implementation.',
      },
    ],
  },

  'image-optimizer': {
    description: `Converting to a different format entirely isn't always an option, a CMS that only accepts JPEG uploads, a platform with a strict format whitelist, which leaves compressing the file smarter within its existing format as the only real lever available for cutting an image's size down. This tool optimizes JPEG, PNG, WebP, and AVIF images by compressing more intelligently within their own format, with quality adjustable per image, rather than requiring a format change to see a meaningful size reduction. Useful for shrinking a JPEG's file size for a platform that specifically requires JPEG and won't accept anything else, optimizing a PNG screenshot's size without introducing a new format into an existing pipeline, or reducing an entire image library's total size while keeping every file in its original format.`,
    examples: [
      {
        title: 'Shrink a JPEG for a platform requiring JPEG',
        code: `Input: photo.jpg (2.1 MB)\nOutput: photo.jpg (480 KB, same format, quality: 82%)`,
        note: 'Stays in the original JPEG format rather than converting to a different one.',
      },
      {
        title: 'Optimize a PNG screenshot without changing format',
        code: `Input: screenshot.png (1.4 MB)\nOutput: screenshot.png (620 KB)`,
        note: 'Reduces size within PNG for a pipeline that expects PNG specifically.',
      },
    ],
  },

  'jwt-tester': {
    description: `A token that's valid right now might behave completely differently in ten minutes once it crosses its expiration timestamp, and testing that edge, how an application actually handles a token the moment it expires, or a refresh flow that's supposed to trigger just before expiration, is a different test than simply confirming a token's signature is valid today. This tool tests a JWT's behavior specifically around expiration and validity windows, checking how the token evaluates at different points in time rather than only confirming it's currently valid. Useful for testing whether an application correctly rejects a token the moment it expires rather than a few seconds late, verifying a refresh-token flow actually triggers before the access token it depends on expires, or checking an auth system's edge-case handling around a token's exact validity window rather than just its current state.`,
    examples: [
      {
        title: 'Test behavior right at token expiration',
        code: `Token exp: 1706000000\nTest time: 1706000001 (1 second after expiration)\nResult: correctly rejected as expired`,
        note: "Confirms the application doesn't accept a token even a moment past its expiration timestamp.",
      },
      {
        title: 'Verify a refresh flow triggers before expiration',
        code: `Token exp: in 5 minutes\nRefresh threshold: 2 minutes before expiration\nResult: refresh triggered at the 2-minute mark as expected`,
        note: 'Tests the refresh timing logic rather than just current token validity.',
      },
    ],
  },

  'png-to-tiff': {
    description: `A print shop, a photo lab, or a scientific imaging workflow typically wants TIFF specifically, not because it's smaller or more convenient, but because it supports lossless compression and far higher bit depth than a web-oriented format like PNG was ever designed around, which matters when a printed result or an archival scan needs to preserve every bit of captured detail rather than something optimized for a screen. This tool converts a PNG into TIFF, formatted for the print and archival workflows that specifically expect it rather than a format built for web display. Useful for preparing a raster graphic for a professional print shop's layout software that requires TIFF, archiving a scanned image in a format built for long-term preservation rather than screen display, or converting a PNG for a workflow, print production, scientific imaging, that was never built around web-native formats in the first place.`,
    examples: [
      {
        title: 'Prepare a graphic for a print shop',
        code: `Input: logo.png\nOutput: logo.tiff (lossless, high bit depth)`,
        note: 'Matches the format professional print layout software typically expects.',
      },
      {
        title: 'Archive a scan for long-term preservation',
        code: `Input: document-scan.png\nOutput: document-scan.tiff`,
        note: 'TIFF is built for archival preservation rather than screen display.',
      },
    ],
  },

  'cron-schedule-generator': {
    description: `A schedule like every five minutes is straightforward, but the last day of the month, the second Tuesday of every month, or every weekday except a specific one push against what standard five-field cron syntax expresses cleanly, some genuinely need a special character or a workaround rather than a schedule that maps directly onto minute, hour, day, month, and weekday fields. This tool builds a cron schedule visually through point-and-click controls and shows a human-readable preview as it's assembled, making even an unusual, hard-to-express schedule visible in plain language before it goes anywhere near a real crontab. Useful for building a schedule that doesn't map neatly onto the standard five fields, like a specific weekday of the month, confirming a complex schedule actually reads the way it's intended to before deploying it, or constructing a cron expression visually without memorizing the syntax for an unusual recurrence pattern.`,
    examples: [
      {
        title: 'Build a schedule for the last day of the month',
        code: `Selected: last day of the month, 11:59 PM\nOutput: 59 23 L * *\nHuman-readable: "At 11:59 PM on the last day of the month"`,
        note: 'Handles a schedule that requires a special character rather than a plain numeric field.',
      },
      {
        title: 'Build a schedule for a specific weekday of the month',
        code: `Selected: second Tuesday, 9:00 AM\nOutput: 0 9 * * 2#2\nHuman-readable: "At 9:00 AM on the second Tuesday of the month"`,
        note: 'Constructs a recurrence pattern that standard fields alone cannot express directly.',
      },
    ],
  },

  'transcribe-podcast': {
    description: `A summary tells you the main points of an episode, but a full transcript is a completely different asset: every word actually spoken, searchable for one specific phrase mentioned partway through a two-hour conversation, usable as captions, and publishable alongside the episode itself so search engines can index spoken content that would otherwise be invisible to them entirely. This tool converts a podcast episode's audio into a complete text transcript rather than a condensed summary, preserving the full conversation as searchable, shareable text. Useful for publishing a transcript alongside an episode so its content becomes indexable by search engines, searching for one specific moment or quote across a long episode without scrubbing through the audio, or making an episode accessible to someone who can't or would rather not listen to the audio directly.`,
    examples: [
      {
        title: 'Publish a searchable transcript alongside an episode',
        code: `Input: episode-42.mp3 (55 minutes)\nOutput: full text transcript, indexable by search engines`,
        note: 'Makes spoken content discoverable that would otherwise be invisible to search engines.',
      },
      {
        title: 'Search for a specific moment in a long episode',
        code: `Input: [2-hour interview transcript]\nSearch: "supply chain"\nOutput: exact passage found instead of scrubbing through audio`,
        note: 'Finds one specific mention without listening through the entire episode.',
      },
    ],
  },

  'reading-time-estimator': {
    description: `The standard 200 words per minute assumption behind most reading time estimates works reasonably for casual prose skimmed by a fluent adult reader, but it's genuinely off for denser technical content read more slowly, or for an audience reading in a second language at a noticeably different pace, which means a single fixed-rate estimate doesn't actually fit every piece of writing equally well. This tool estimates reading time from a text's actual word count, built around that reference speed while making clear what assumption the estimate rests on, rather than presenting a single number as if it applies universally regardless of content type or audience. Useful for estimating how long a blog post will take an average reader to get through, setting expectations for technical writing a reader will likely move through more slowly than casual prose, or getting a baseline reading time to include alongside a published article.`,
    examples: [
      {
        title: 'Estimate reading time for a blog post',
        code: `Input: [1,400-word article]\nOutput: ~7 minutes at 200 words per minute`,
        note: 'Gives a baseline estimate for casual prose read at an average pace.',
      },
      {
        title: 'Set expectations for denser technical content',
        code: `Input: [2,000-word technical guide]\nOutput: ~10 minutes at the standard rate (likely longer for readers moving through it more slowly)`,
        note: 'Makes clear the estimate assumes casual reading speed, which technical content often runs slower than.',
      },
    ],
  },

  'avi-to-mov': {
    description: `An old AVI file, downloaded years ago or pulled off an old camcorder, doesn't drop cleanly into a Mac-based editing workflow the way a native Apple format would, since AVI was never part of Apple's own ecosystem and needs converting before QuickTime or Final Cut Pro treats it as a normal video file rather than something requiring an extra codec. This tool converts an AVI file into MOV, the format QuickTime and Apple's editing software actually expect, so old or downloaded AVI footage opens and edits the way native Mac video would. Useful for bringing an old AVI archive into a Final Cut Pro project without a codec error, playing a downloaded AVI file through QuickTime without installing extra software, or modernizing old camcorder footage for editing on a current Mac-based workflow.`,
    examples: [
      {
        title: 'Bring an old AVI archive into Final Cut Pro',
        code: `Input: home-video-2003.avi\nOutput: home-video-2003.mov (imports without a codec error)`,
        note: "Converts footage into the format Apple's editing software actually expects.",
      },
      {
        title: 'Play a downloaded AVI file through QuickTime',
        code: `Input: downloaded-clip.avi\nOutput: downloaded-clip.mov`,
        note: 'Opens directly without installing an extra codec pack.',
      },
    ],
  },

  'mp4-to-avi': {
    description: `MP4 already plays on nearly everything modern, which makes converting it down to AVI look backward at first glance, until the destination is something built around specifically older assumptions, a legacy Windows machine, an embedded or industrial display system, an old piece of editing software from the Windows XP era that only ever learned to read AVI and was never updated for anything newer. This tool converts an MP4 file into AVI for exactly that kind of destination, trading MP4's broader modern support for compatibility with software and hardware that predates it. Useful for getting a modern MP4 file playing on an old Windows machine or embedded system that never learned newer formats, feeding a video into legacy editing software that only accepts AVI, or preparing footage for a specific older Windows environment where AVI is still the only format reliably supported.`,
    examples: [
      {
        title: 'Play a modern MP4 on an old Windows machine',
        code: `Input: recording.mp4\nOutput: recording.avi (plays on legacy Windows Media Player)`,
        note: 'Fits hardware or software that never learned newer formats.',
      },
      {
        title: 'Feed footage into legacy editing software',
        code: `Input: clip.mp4\nOutput: clip.avi`,
        note: 'Matches an older Windows-era editing program that only accepts AVI input.',
      },
    ],
  },
};

export default FIX_BATCH_37;
