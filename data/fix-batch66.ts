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

const FIX_BATCH_66: Record<string, FixBatchEntry> = {
  'gif-maker': {
    description: `Some GIFs start from a folder of still images, others from a short clip already recorded as video, and needing a different, format-specific converter depending on which one happens to be on hand is more friction than the actual task deserves. This tool creates an animated GIF from either multiple images or a short video clip, working from whichever starting point is actually available rather than requiring a specific source format first. Useful for building a GIF from a handful of still photos taken in sequence, turning a short video clip into a looping GIF without first figuring out which specific converter it needs, or creating a quick animation without caring whether the starting material happens to be stills or footage.`,
    examples: [
      {
        title: 'Create a GIF from still images',
        code: `Input: photo1.jpg, photo2.jpg, photo3.jpg, delay: 200ms\nOutput: sequence.gif`,
        note: 'Builds an animation from a handful of separate stills.',
      },
      {
        title: 'Create a GIF from a video clip',
        code: `Input: clip.mp4, start: 0:05, end: 0:08\nOutput: clip.gif`,
        note: 'Works directly from footage without needing a separate stills-only tool.',
      },
    ],
  },

  'screenshot-maker': {
    description: `A manual browser screenshot only captures whatever fits in the visible viewport, missing everything below the fold on a long article or a landing page, and a page that lazy-loads images or runs an entrance animation needs a moment to actually finish rendering before a screenshot captures it correctly rather than mid-load. This tool captures a full-page screenshot of any URL with a customizable viewport size and a delay setting, waiting for a page to actually finish rendering before the capture happens. Useful for capturing an entire long page in one image instead of stitching together several manual screenshots, testing how a responsive layout looks at a specific viewport width without resizing an actual browser window, or adding a delay so a page's lazy-loaded content finishes appearing before the screenshot is taken.`,
    examples: [
      {
        title: 'Capture a full-page screenshot',
        code: `Input: example.com/long-article\nOutput: full-article-screenshot.png (entire page height captured)`,
        note: 'Captures the whole page instead of just the visible viewport.',
      },
      {
        title: 'Capture at a specific viewport with a delay',
        code: `Input: example.com, viewport: 390x844, delay: 2000ms\nOutput: mobile-screenshot.png (captured after animations finished)`,
        note: 'Waits for lazy-loaded content to render before capturing.',
      },
    ],
  },

  'exif-remover': {
    description: `A photo shared online can quietly carry its exact GPS coordinates, the camera model, and a timestamp embedded in its EXIF metadata, none of which is visible looking at the picture itself but all of it readable by anyone who knows to check. This tool removes EXIF metadata from images before they're shared, stripping that hidden data out rather than leaving it embedded in a file that looks perfectly ordinary. Useful for removing GPS coordinates from a photo before posting it somewhere public so a home address isn't accidentally revealed, stripping camera and device details from a sensitive photo before sharing it, or cleaning metadata from a batch of photos before uploading them to a public gallery.`,
    examples: [
      {
        title: 'Strip GPS data before posting publicly',
        code: `Input: vacation-photo.jpg (contains GPS: 40.7484° N, 73.9857° W)\nOutput: vacation-photo-clean.jpg (no location data)`,
        note: 'Removes coordinates that would otherwise reveal exactly where a photo was taken.',
      },
      {
        title: 'Clean metadata from a batch of photos',
        code: `Input: [24 photos for a public gallery]\nOutput: 24 photos with EXIF metadata stripped`,
        note: 'Removes camera and device details before a public upload.',
      },
    ],
  },

  'image-orientation-fixer': {
    description: `A phone photo sometimes displays sideways or upside-down in one app while looking perfectly upright in another, since the actual pixel data and the EXIF flag telling a viewer how to rotate it can disagree depending on which software is reading that flag, and figuring out whether the fix needed is a rotation or a flip isn't always obvious just from looking at it. This tool fixes incorrect image orientation with one click, trying rotation or flipping automatically rather than requiring the specific operation identified first. Useful for fixing a photo that displays sideways in one app but fine in another without knowing which specific fix it needs, correcting an image that's ended up upside-down after being saved from an inconsistent EXIF orientation flag, or quickly fixing orientation on a photo without first diagnosing whether it needs a rotation or a mirror flip.`,
    examples: [
      {
        title: 'Fix a photo that displays sideways in one app',
        code: `Input: photo.jpg (upright in Photos app, sideways in a browser)\nOutput: photo-fixed.jpg (correct in both)`,
        note: 'Resolves an EXIF orientation flag mismatch automatically.',
      },
      {
        title: 'Auto-correct without diagnosing the issue',
        code: `Input: scanned-image.jpg (orientation unclear)\nOutput: scanned-image-fixed.jpg`,
        note: 'Tries rotation or flipping automatically instead of requiring the specific fix identified first.',
      },
    ],
  },

  'image-rotate-tool': {
    description: `Rotating a photo turns the whole image around a fixed point, which is why a phone photo saved sideways still reads perfectly normally after a quick ninety-degree turn, text and faces staying exactly as they were, just reoriented, and a scanned document that went in at a slight unintentional tilt needs the same underlying operation applied at a precise custom angle instead of one of the fixed steps. This tool rotates an image by 90, 180, or 270 degrees with one click, or by a custom angle for that kind of fine correction, turning the image rather than mirroring it. Useful for quickly turning a sideways phone photo right side up, straightening a scanned document that went in slightly skewed using a precise custom angle, or spinning an image a full 180 degrees when it was uploaded upside down by mistake.`,
    examples: [
      {
        title: 'Turn a photo 180 degrees, text still readable',
        code: `Input: upside-down-photo.jpg\nOutput: photo-upright.jpg`,
        note: 'Rotation preserves readability, unlike a mirror flip would.',
      },
      {
        title: 'Straighten a scan with a custom angle',
        code: `Input: scanned-page.jpg, angle: -2.5°\nOutput: scanned-page-straight.jpg`,
        note: "Corrects a slight tilt a fixed 90-degree turn can't fix.",
      },
    ],
  },

  'image-flip-tool': {
    description: `Rotating a photo turns it around a point, text staying perfectly readable after a full 180-degree spin, but flipping does something different entirely, mirroring the image so anything asymmetric, a logo, a piece of text, a person's part in their hair, ends up reversed left to right or top to bottom rather than simply turned. This tool flips an image horizontally or vertically to mirror it, producing a genuine reflection rather than a rotation, with the result ready to download instantly. Useful for correcting a selfie that came out mirrored backwards from a front-facing camera, flipping a scanned image that went into the scanner reversed, or creating a mirrored version of a graphic or a logo for a design that needs a matching, symmetrical pair.`,
    examples: [
      {
        title: 'Fix a mirrored selfie',
        code: `Input: selfie.jpg (text on shirt reads backwards)\nOutput: selfie-corrected.jpg (text reads correctly)`,
        note: 'Mirrors the image instead of rotating it.',
      },
      {
        title: 'Create a mirrored graphic for a symmetrical design',
        code: `Input: leaf-icon.png\nOutput: leaf-icon-mirrored.png`,
        note: 'Produces a matching reflected pair for a design layout.',
      },
    ],
  },

  'word-scramble-generator': {
    description: `A word puzzle for a classroom activity, a party game where letters need unscrambling, or a newsletter's fun challenge section all need the same underlying trick, taking a perfectly ordinary word and scrambling its letters into something that has to be puzzled back out. This tool scrambles the letters in any word to create an anagram or a puzzle, producing a scrambled version instantly rather than requiring someone to shuffle letters by hand. Useful for creating an unscramble-the-letters game for a classroom vocabulary activity, generating an anagram puzzle around a specific word for a party game, or putting together a scrambled-word challenge for a newsletter or a game night.`,
    examples: [
      {
        title: 'Create a classroom vocabulary puzzle',
        code: `Input: "photosynthesis"\nOutput: "sisyhtnostohp"`,
        note: 'Turns a vocabulary word into an unscramble challenge.',
      },
      {
        title: 'Generate a party game word',
        code: `Input: "adventure"\nOutput: "veurdenat"`,
        note: 'Produces a scrambled word ready for a group game.',
      },
    ],
  },

  'aac-to-mp4': {
    description: `An AAC file is audio only, no video track at all, which becomes a real problem the moment a platform's upload form specifically requires an MP4 video file and simply rejects a raw audio upload outright, no matter how good the actual audio is. This tool converts AAC audio into MP4 video format, wrapping the audio into the container format a platform actually requires rather than leaving it stuck as a file type that gets rejected on upload. Useful for uploading a podcast episode or a voice memo to a platform that only accepts MP4 uploads, converting an AAC file for compatibility with an older device or app that only recognizes MP4, or preparing an audio track for a service that requires a video container format even when there's no actual video content.`,
    examples: [
      {
        title: 'Convert a podcast episode for upload',
        code: `Input: episode-42.aac\nOutput: episode-42.mp4`,
        note: 'Wraps audio-only content into the video format an upload form requires.',
      },
      {
        title: 'Convert for an older device',
        code: `Input: voice-memo.aac\nOutput: voice-memo.mp4`,
        note: 'Produces a format an older app or device recognizes.',
      },
    ],
  },

  'avi-to-mp3': {
    description: `An old AVI file from a camcorder recording or a downloaded video from years ago often holds a soundtrack worth keeping, an interview, a song, a bit of commentary, long after the aging video codec and bulky file size have stopped being worth keeping around at all. This tool extracts the audio from an AVI video file and saves it as an MP3, keeping just the sound rather than requiring the entire legacy video file kept around. Useful for pulling a song or a soundtrack out of an old AVI recording without keeping its outdated video, extracting an interview's audio from a legacy video file to listen to separately, or converting an old camcorder recording's audio into a smaller, more usable MP3.`,
    examples: [
      {
        title: 'Extract audio from an old camcorder file',
        code: `Input: family-video-2008.avi\nOutput: family-video-2008.mp3`,
        note: 'Keeps the soundtrack without the outdated video codec.',
      },
      {
        title: "Pull an interview's audio from a legacy video",
        code: `Input: old-interview.avi (600 MB)\nOutput: old-interview.mp3 (28 MB)`,
        note: 'Produces a much smaller file with just the spoken content.',
      },
    ],
  },

  'change-bg-photo': {
    description: `An official ID photo, a passport application, or a visa form usually requires a plain white or a specific solid-colored background, a requirement a photo taken at home in front of an actual wall or a cluttered room can't meet without the background being swapped out entirely rather than just cropped or blurred. This tool cuts the subject out of a photo and places it onto a new background entirely, replacing what was there rather than leaving transparency or a blur behind. Useful for meeting a passport or an ID photo's specific plain background requirement without a professional photo session, swapping a casual photo's background for a solid color that satisfies an official form's rules, or replacing any photo's backdrop with one that actually matches what a specific document requires.`,
    examples: [
      {
        title: 'Meet a passport photo background requirement',
        code: `Input: home-photo.jpg (bedroom wall background)\nOutput: passport-photo.jpg (plain white background)`,
        note: 'Swaps the background to satisfy an official document requirement.',
      },
      {
        title: 'Replace a background for a visa application',
        code: `Input: casual-photo.jpg\nOutput: visa-photo.jpg (solid light gray background)`,
        note: 'Matches the specific background color a form requires.',
      },
    ],
  },
};

export default FIX_BATCH_66;
