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

const FIX_BATCH_39: Record<string, FixBatchEntry> = {
  'favicon-generator': {
    description: `A favicon isn't one image, it's a set of them: 16x16 for a browser tab, 32x32 for a taskbar, a 180x180 Apple touch icon for an iPhone home screen, 192x192 and 512x512 for Android, each platform expecting its own size and sometimes its own format, which is why one logo file rarely covers every context correctly on its own. This tool generates the full set from a single source image, logo, or emoji, producing ICO, PNG, and SVG output at every size a modern site needs rather than one icon stretched or shrunk inconsistently across contexts it was never sized for. Useful for generating a complete, correctly-sized icon set from one logo instead of manually resizing it per platform, adding a home-screen icon for iOS and Android alongside the standard favicon, or fixing a site where the icon looks fine in a tab but blurry elsewhere.`,
    examples: [
      {
        title: 'Generate a full icon set from one logo',
        code: `Input: logo.png\nOutput: favicon.ico (16x16, 32x32), apple-touch-icon.png (180x180), android-chrome-192x192.png, android-chrome-512x512.png`,
        note: 'Produces every size a modern site actually needs from a single source image.',
      },
      {
        title: 'Add a home-screen icon for mobile',
        code: `Input: emoji: 🚀\nOutput: apple-touch-icon.png (180x180), android icons at 192x192 and 512x512`,
        note: 'Generates a proper home-screen icon set instead of just a browser tab favicon.',
      },
    ],
  },

  mute: {
    description: `Plenty of browsers block a video from autoplaying with sound the moment a page loads, but they'll happily autoplay a video with no audio track at all, which is exactly why a background video loop on a website almost always needs to be silent regardless of whether the original clip actually had sound worth keeping. This tool removes the audio track from a video entirely, producing a genuinely silent file rather than one where the volume is just set to zero internally while an audio track still technically exists. Useful for preparing a video for a website's autoplay background loop that needs to actually be silent to play automatically, removing an unwanted audio track from a screen recording before sharing it, or creating a silent version of a clip for a context where sound would be distracting or inappropriate.`,
    examples: [
      {
        title: 'Prepare a video for autoplay background use',
        code: `Input: hero-clip.mp4 (with audio track)\nOutput: hero-clip-silent.mp4 (audio track fully removed)`,
        note: 'Many browsers only allow autoplay when a video genuinely has no audio track.',
      },
      {
        title: 'Remove audio from a screen recording',
        code: `Input: demo-recording.mp4\nOutput: demo-recording-muted.mp4`,
        note: 'Strips an unwanted audio track before sharing the recording.',
      },
    ],
  },

  'podcast-writer': {
    description: `A podcast script has different pacing needs than a video script, since a listener is usually doing something else at the same time, driving, cooking, walking, which means they can't glance back at a visual cue to re-orient themselves the way a video viewer can pause and rewind, so a podcast script needs more verbal signposting, restating what a segment is about, recapping before a transition, than a script written to be watched rather than only heard. This tool generates a podcast script structured around that reality: a cold open or intro, clearly signposted segments, and an outro, written for a listener who's paying partial attention rather than watching a screen. Useful for structuring a new episode from a topic before recording, outlining segment transitions that make sense for someone listening passively, or getting a full script scaffold that already accounts for how differently audio gets consumed compared to video.`,
    examples: [
      {
        title: 'Structure a new episode from a topic',
        code: `Input: topic: "the psychology of procrastination"\nOutput: cold open + 3 signposted segments + outro with CTA`,
        note: 'Includes verbal recaps between segments for a listener who may be only half paying attention.',
      },
      {
        title: 'Draft a segment transition',
        code: `Input: moving from "why we procrastinate" to "practical fixes"\nOutput: "Now that we know why it happens, let's get into what actually helps."`,
        note: 'Explicitly signposts the shift rather than assuming a listener will follow a silent cut.',
      },
    ],
  },

  'unit-converter': {
    description: `Most unit conversion needs aren't a multi-step research task, they're a single quick number, how many pounds is this in kilograms, what's this in Fahrenheit, that comes up mid-task and needs answering in seconds rather than navigating through a specialized tool built around one specific measurement category. This tool covers length, weight, temperature, speed, and more in one straightforward, instant conversion, built for that quick single-number need rather than a deeper, more specialized conversion workflow. Useful for a fast one-off conversion in the middle of another task without switching to a more specialized tool, checking a quick measurement while reading a recipe or a spec sheet in a different unit system, or getting an instant answer to a simple unit question without extra steps in the way.`,
    examples: [
      {
        title: 'Get a quick single conversion',
        code: `Input: 10 lbs\nOutput: 4.54 kg`,
        note: 'Answers a fast, one-off question without navigating a specialized tool.',
      },
      {
        title: 'Check a recipe measurement instantly',
        code: `Input: 350°F\nOutput: 176.7°C`,
        note: 'Handles a quick mid-task conversion without extra steps.',
      },
    ],
  },

  'kubernetes-yaml-generator': {
    description: `A Kubernetes Deployment, a Service, and a ConfigMap each require their own specific apiVersion, their own required fields structured differently, and YAML's whitespace sensitivity means a manifest that looks almost right can still fail to apply over a single misplaced indent, a mistake that's easy to make and sometimes tedious to spot just by reading the file. This tool generates correctly structured manifests for Deployments, Services, ConfigMaps, and other common resource types, with each one's specific required fields and structure already accounted for rather than assembled from memory. Useful for scaffolding a new Deployment or Service manifest without misremembering its specific required fields, generating a ConfigMap with the correct structure before applying it to a cluster, or avoiding a YAML indentation mistake that would otherwise fail silently or with an error that doesn't point clearly at the actual problem.`,
    examples: [
      {
        title: 'Generate a Deployment manifest',
        code: `Input: name: web-app, image: nginx:latest, replicas: 3\nOutput: apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web-app\nspec:\n  replicas: 3`,
        note: 'Uses the correct apiVersion and structure a Deployment specifically requires.',
      },
      {
        title: 'Generate a ConfigMap',
        code: `Input: name: app-config, data: { LOG_LEVEL: "info" }\nOutput: apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: app-config\ndata:\n  LOG_LEVEL: info`,
        note: "Matches a ConfigMap's own required structure, distinct from a Deployment's.",
      },
    ],
  },

  'typo-checker': {
    description: `A typo is a specific, narrow kind of mistake, transposed letters, a missing letter, a doubled character from typing too fast, genuinely different from a grammar error like subject-verb disagreement or a homophone mistake like confusing their and there, since a typo is usually just a keyboard slip rather than a misunderstanding of grammar or word choice. This tool checks specifically for that category of mistake, spotting a transposed or missing letter and suggesting the correct spelling, rather than trying to also catch grammar or word-choice issues that need a different kind of check entirely. Useful for catching a fast-typing slip before sending a message or publishing a piece of writing, cleaning up typos in a draft written quickly without also second-guessing grammar choices, or checking specifically for keyboard-level mistakes rather than a broader style or grammar review.`,
    examples: [
      {
        title: 'Catch a transposed-letter typo',
        code: `Input: "Plesae confirm the recieved order."\nFlagged: "Plesae" -> "Please", "recieved" -> "received"`,
        note: 'Targets keyboard-level slips, not grammar or word-choice issues.',
      },
      {
        title: 'Fix a doubled-letter typo',
        code: `Input: "The commitee will meet tommorow."\nFlagged: "commitee" -> "committee", "tommorow" -> "tomorrow"`,
        note: 'Focuses on spelling mistakes from fast typing rather than a broader style review.',
      },
    ],
  },

  'list-difference-finder': {
    description: `Comparing two separate lists, an old customer list against a new export, one inventory sheet against another, to find what's actually different between them is a different question than deduplicating one list on its own, since the goal here is finding which items exist only in list A, which exist only in list B, and which show up in both. This tool compares two lists directly and returns exactly that: items unique to the first list, items unique to the second, without requiring either list to be sorted or manually cross-referenced by eye first. Useful for finding which customers dropped off between two versions of a mailing list, comparing two inventory exports to see what's actually different between them, or checking two lists of names or IDs to find exactly which entries don't appear in both.`,
    examples: [
      {
        title: 'Compare two versions of a mailing list',
        code: `List A: 500 emails (last month)\nList B: 480 emails (this month)\nOutput: 25 emails only in A (unsubscribed), 5 emails only in B (new signups)`,
        note: 'Finds exactly what changed between two lists rather than deduplicating one.',
      },
      {
        title: 'Compare two inventory exports',
        code: `List A: 1,200 SKUs\nList B: 1,150 SKUs\nOutput: 60 SKUs only in A, 10 SKUs only in B`,
        note: 'Surfaces items unique to each side without manually cross-referencing by eye.',
      },
    ],
  },

  'unix-timestamp-converter': {
    description: `A Unix timestamp is the same number worldwide, counted from a single fixed reference point in UTC, but the date and time it represents genuinely changes depending on which timezone it's displayed in, which means converting it into a readable date requires knowing which timezone the answer needs to reflect rather than assuming one universal answer. This tool converts a Unix timestamp into a human-readable date, or a date back into a timestamp, with the specific timezone accounted for directly rather than defaulting to UTC and leaving local time to be worked out separately. Useful for converting a timestamp found in a log file into the local time it actually represents, checking what a specific timestamp means in a different timezone than your own, or converting a chosen date and time back into the timestamp a system expects.`,
    examples: [
      {
        title: 'Convert a log timestamp to local time',
        code: `Input: 1706000000, timezone: America/New_York\nOutput: 2024-01-23 04:33:20 EST`,
        note: 'Shows the timestamp in a specific local timezone rather than defaulting to UTC.',
      },
      {
        title: 'Convert a chosen date back to a timestamp',
        code: `Input: 2026-07-27 15:00:00, timezone: Asia/Dhaka\nOutput: 1785157200`,
        note: 'Produces the Unix timestamp a system expects from a specific local date and time.',
      },
    ],
  },

  protect: {
    description: `A watermark labeled confidential is a visible request not to share a document, but it does nothing to actually stop someone from opening the file and reading it, which is a completely different level of protection than encrypting the document itself so it genuinely can't be opened at all without the correct password, regardless of whether whoever has the file respects a label. This tool encrypts a PDF with AES-256, real encryption applied to the file's actual content, rather than a cosmetic label or a weak, easily bypassed lock. Useful for protecting a document containing genuinely sensitive information before sending it anywhere, locking a PDF so it can't be opened at all without the correct password rather than just discouraging sharing, or securing a file that needs actual encryption rather than a visible warning that depends on good faith.`,
    examples: [
      {
        title: 'Encrypt a sensitive PDF before sending it',
        code: `Input: financial-report.pdf, password: [set by user]\nOutput: financial-report-protected.pdf (AES-256 encrypted)`,
        note: 'Actually prevents the file from opening without the password, not just a warning label.',
      },
      {
        title: 'Lock a document containing personal data',
        code: `Input: medical-records.pdf\nOutput: medical-records-protected.pdf`,
        note: 'Applies real encryption rather than a cosmetic confidentiality marking.',
      },
    ],
  },

  'browser-image-resizer': {
    description: `Resizing a personal or sensitive photo, a scanned ID, a private family picture, means thinking twice about a tool that uploads the image to a server first, however briefly, which is exactly the concern this tool avoids by resizing entirely inside the browser: the image never leaves the device, with aspect ratio lock and batch resizing both available without any of the photos ever being sent anywhere. Useful for resizing a batch of genuinely private photos without uploading any of them to a server, processing images with no internet connection required once the tool itself has loaded, or handling a sensitive image where local-only processing actually matters more than the convenience of a server-side tool.`,
    examples: [
      {
        title: 'Resize a sensitive photo without uploading it',
        code: `Input: id-scan.jpg (processed entirely in-browser)\nOutput: id-scan-resized.jpg (never sent to a server)`,
        note: 'Keeps a private image on the device throughout the entire resize.',
      },
      {
        title: 'Batch resize private photos with locked aspect ratio',
        code: `Input: 8 personal photos, aspect ratio: locked\nOutput: 8 resized images, none uploaded`,
        note: 'Combines batch resizing with local-only processing for sensitive images.',
      },
    ],
  },
};

export default FIX_BATCH_39;
