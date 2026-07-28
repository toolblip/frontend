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

const FIX_BATCH_3: Record<string, FixBatchEntry> = {
  'word-scramble-generator': {
    description: `Turning a vocabulary list into a puzzle usually means manually jumbling each word's letters by hand and hoping the result isn't accidentally readable, or worse, another real word entirely. This tool does the jumbling for you: feed in a list of words and get back scrambled versions where the letters are shuffled but the original is still recoverable by a solver who studies the mix carefully. It's built for the specific job of creating an "unscramble the word" puzzle, not for finding anagrams, so "planet" might come back as "tenpla" rather than a whole new dictionary word made from the same letters. Teachers use it to build a quick spelling worksheet from this week's vocabulary. Party hosts use it for a printable game round. Add a hint or category label alongside each scrambled entry if the puzzle needs one.`,
    examples: [
      {
        title: 'Turn a spelling list into a worksheet',
        code: `Input: photosynthesis, chlorophyll, ecosystem\nOutput: hisoptnyseshot, phyllchloro, tocessyem`,
        note: 'Each scrambled word stays solvable while avoiding an accidental match with a different real word.',
      },
      {
        title: 'Generate a party game round with hints',
        code: `Input: "guitar" (hint: musical instrument)\nOutput: "aturgi" (hint: musical instrument)`,
        note: 'Pairing the scramble with a category hint keeps it solvable without giving away the answer.',
      },
    ],
  },

  'aac-to-mp4': {
    description: `AAC is an audio-only format, so converting it to MP4 isn't about adding video, it's about repackaging the same sound inside a container that more devices and services recognize. That distinction matters because plenty of apps, upload forms, and hardware players only accept files ending in .mp4, even when all they're actually going to play is audio: a podcast host that rejects raw AAC uploads, a messaging app that only previews mp4 attachments, an old car stereo that reads video files but not bare audio streams. This tool takes an AAC file and wraps it in that more widely accepted format without re-encoding the sound itself, so quality stays exactly as it was going in. The result plays like any other mp4 file, just carrying no visible picture, while the audio underneath goes untouched.`,
    examples: [
      {
        title: 'Get a podcast episode past an upload form that rejects AAC',
        code: `Input: episode-042.aac (44kbps AAC)\nOutput: episode-042.mp4 (same audio, mp4 container)`,
        note: 'Some podcast hosts and CMS upload fields only accept mp4 files, even for audio-only content.',
      },
      {
        title: 'Make a voice memo playable on an older device',
        code: `Input: voice-memo.aac\nOutput: voice-memo.mp4`,
        note: 'Older media players and car stereos sometimes only recognize mp4, not a bare AAC stream.',
      },
    ],
  },

  'avi-to-mp3': {
    description: `An AVI file bundles video and audio together, and sometimes the only thing worth keeping is the sound: a song playing in the background of an old home video, a lecture someone filmed instead of just recording, a screen capture of a webinar you only need to listen back to. This tool pulls the audio track out of an AVI file and saves it as a standalone MP3, dropping the picture entirely so you're left with a much smaller file that plays in literally anything with a speaker. Because AVI can wrap all sorts of underlying audio codecs depending on how the file was originally created, the extraction re-encodes whatever it finds into standard MP3, so the output stays consistent and easy to share, drop into a playlist, or attach to an email without the extra weight of unused frames.`,
    examples: [
      {
        title: 'Pull the song out of an old home video',
        code: `Input: birthday-party.avi (720p video + audio)\nOutput: birthday-party.mp3 (audio only)`,
        note: 'Drops the video entirely, leaving a file a fraction of the original size.',
      },
      {
        title: 'Get audio from a screen-recorded webinar',
        code: `Input: webinar-recording.avi\nOutput: webinar-recording.mp3`,
        note: "Useful when you only need to relisten to a talk and don't care about the slides on screen.",
      },
    ],
  },

  'change-bg-photo': {
    description: `Swapping a photo's background isn't the same job as cropping or adjusting color; it means telling the subject apart from everything behind them, cutting along that edge, and dropping in something new. This tool automatically detects where a person or object ends and the backdrop begins, removes the original scene, and lets you place the cutout on a solid color, a new image, or a transparent layer instead. It handles the fiddly parts, hair strands, curved edges, the gap between an arm and a torso, that would take real patience to trace by hand in an image editor. Common uses: putting a product photo on plain white for a marketplace listing, swapping a cluttered room behind a portrait for a plain studio look, or placing a subject on a solid backdrop for a professional headshot without booking an actual studio.`,
    examples: [
      {
        title: 'Put a product on a plain white background',
        code: `Input: sneaker-photo.jpg (cluttered desk background)\nOutput: sneaker-photo-white.jpg (subject on #FFFFFF)`,
        note: 'Marketplace listings often require a plain white background behind the product.',
      },
      {
        title: 'Swap a messy room for a studio backdrop',
        code: `Input: portrait.jpg (background: bedroom)\nOutput: portrait-studio.jpg (background: solid gray)`,
        note: 'Gives a professional headshot look without renting an actual studio.',
      },
    ],
  },

  'compress-mov': {
    description: `Videos recorded on an iPhone save as MOV files, and they can get large fast: a couple of minutes of 4K footage is often too big to email, text, or upload without hitting a size limit somewhere. This tool shrinks a MOV file while keeping it in the same container, which matters if wherever you're sending it, a video editor, an existing workflow, a specific upload form, expects that exact format rather than something converted to MP4. Drop in a clip, and the compression reduces bitrate and resolution based on how much size reduction is needed, trading some quality for a file that actually fits through the upload limit instead of failing silently. Useful for sending footage to someone on a slow connection, or getting a phone recording small enough for a group chat that rejects large attachments.`,
    examples: [
      {
        title: 'Shrink a 4K clip for email',
        code: `Input: vacation-clip.mov (1.2 GB, 4K)\nOutput: vacation-clip-compressed.mov (48 MB, 1080p)`,
        note: 'Reduces resolution and bitrate enough to fit under a typical email attachment limit.',
      },
      {
        title: "Fit a video under a messaging app's size limit",
        code: `Input: recording.mov (210 MB)\nOutput: recording-compressed.mov (18 MB)`,
        note: 'Stays in the MOV container since the destination app only previews that format properly.',
      },
    ],
  },

  crop: {
    description: `Some crop tools only offer preset shapes, a perfect square, a circle, a fixed social media ratio, which is fine until the photo doesn't fit any of those. This one is the freeform version: drag a selection box to any size or ratio, position it anywhere over the image, and cut away everything outside that box. Nothing locks you into 1:1 or 16:9 unless you type those numbers in yourself. It's built for the moments a preset doesn't cover: trimming a screenshot down to just the relevant part of a UI, removing a distracting edge of a photo without changing its overall proportions, or cutting an image to an unusual size that a specific layout requires. Adjust the selection with drag handles, preview the result, and export once the framing actually looks right.`,
    examples: [
      {
        title: 'Trim a screenshot to the relevant UI element',
        code: `Input: full-screenshot.png (1920x1080)\nOutput: cropped-button.png (240x80, custom selection)`,
        note: 'No preset ratio involved, just a hand-positioned box around the one element that matters.',
      },
      {
        title: 'Cut a photo to an unusual banner size',
        code: `Input: photo.jpg, selection: 1200x300\nOutput: banner.jpg (1200x300)`,
        note: "Handles a non-standard ratio that square or circle presets can't produce.",
      },
    ],
  },

  'eps-to-svg': {
    description: `EPS is a vector format from the PostScript era, and it still shows up in old logo files and print-shop deliverables, but it doesn't open directly in a browser and plenty of modern design tools have quietly dropped support for it. SVG is what replaced it for most practical purposes: browsers actually render SVG, and every current design tool reads and edits it natively. This tool converts an EPS file into SVG while keeping the paths as real editable vector shapes instead of flattening them into a raster image, so curves stay sharp at any size and individual shapes can still be selected and recolored afterward. It's the fix for the specific situation where someone hands you a decades-old logo file in EPS and you need it usable in a current web project or design file today.`,
    examples: [
      {
        title: 'Bring an old logo file into a web project',
        code: `Input: company-logo.eps (1998, Illustrator export)\nOutput: company-logo.svg (editable paths, scalable)`,
        note: "Browsers can't render EPS directly, so SVG is what actually ends up on the page.",
      },
      {
        title: 'Reopen a print-shop vector file in a modern tool',
        code: `Input: business-card-art.eps\nOutput: business-card-art.svg (shapes remain individually selectable)`,
        note: 'Keeps each shape as an editable object instead of collapsing it into a single flat image.',
      },
    ],
  },

  'heic-to-png': {
    description: `An iPhone saves photos as HEIC by default because the format packs the same image quality into a smaller file, which is great until you try to open one outside Apple's ecosystem. Plenty of Windows machines, older browsers, and web upload forms either can't display a HEIC file at all or flatly reject it on upload. This tool converts HEIC images into PNG, a format that opens everywhere without a plugin or an update, while keeping full quality and any transparency the original file carried. Drop in a photo straight from an iPhone's camera roll, and get back a PNG you can actually attach to a work email, upload to a site that only takes JPG or PNG, or open on a Windows laptop that has no idea what a HEIC file is supposed to be.`,
    examples: [
      {
        title: 'Upload an iPhone photo to a site that rejects HEIC',
        code: `Input: IMG_4821.heic (iPhone camera roll)\nOutput: IMG_4821.png (universally viewable)`,
        note: 'Many web upload forms reject HEIC outright, so converting first avoids a failed upload.',
      },
      {
        title: 'Open an edited iPhone photo on a Windows laptop',
        code: `Input: edited-photo.heic (with transparent sticker overlay)\nOutput: edited-photo.png (transparency preserved)`,
        note: 'Keeps any transparent regions intact instead of filling them with a solid background.',
      },
    ],
  },

  'jpg-to-webp': {
    description: `JPEG has been the default photo format for decades, which is exactly why it's still everywhere, but it isn't the most efficient choice anymore for a site that cares about load times. WebP compresses images noticeably smaller than JPEG at a comparable visual quality, and every modern browser renders it without issue. This tool converts a JPEG into WebP so a page full of product photos or blog images loads faster without anyone noticing a drop in how the pictures actually look. It matters most for site owners chasing a better page speed score or trying to shave seconds off load time on a slow mobile connection, where every extra kilobyte of image weight adds up across a page with a dozen photos on it. Drop in a JPEG, get back a smaller WebP file, and compare the two side by side before swapping it in.`,
    examples: [
      {
        title: 'Shrink a hero image for faster page load',
        code: `Input: hero-banner.jpg (480 KB)\nOutput: hero-banner.webp (145 KB, same visual quality)`,
        note: "A smaller hero image often has the biggest single impact on a page's load time.",
      },
      {
        title: 'Convert an entire product gallery',
        code: `Input: product-1.jpg, product-2.jpg, product-3.jpg\nOutput: product-1.webp, product-2.webp, product-3.webp (roughly 60% smaller each)`,
        note: 'Applying the same conversion across a gallery adds up to a meaningfully faster page overall.',
      },
    ],
  },

  'mkv-to-mov': {
    description: `MKV is an open container built to hold pretty much anything, multiple audio tracks, several subtitle files, video in nearly any codec, which is exactly why so many downloaded and ripped videos come in that format. Apple's software has never fully embraced it: QuickTime won't play it, and Final Cut Pro won't import it without a workaround. This tool converts an MKV file into MOV, the container Apple's tools actually expect, so footage can be dragged straight into a Final Cut Pro timeline or played back through QuickTime without installing an extra codec pack first. Useful for editors who received footage as MKV from a client or a screen recording tool but need it in an Apple-friendly format before touching it in their usual editing software.`,
    examples: [
      {
        title: 'Import downloaded footage into Final Cut Pro',
        code: `Input: source-footage.mkv (H.264, 2 audio tracks)\nOutput: source-footage.mov (imports directly into Final Cut Pro)`,
        note: "Final Cut Pro doesn't import MKV natively, so converting first avoids a missing-codec error.",
      },
      {
        title: 'Play an MKV file through QuickTime',
        code: `Input: clip.mkv\nOutput: clip.mov (plays natively in QuickTime)`,
        note: 'Skips installing a third-party codec pack just to preview one file.',
      },
    ],
  },
};

export default FIX_BATCH_3;
