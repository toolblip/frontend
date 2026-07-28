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

const FIX_BATCH_2: Record<string, FixBatchEntry> = {
  'css-animation-generator': {
    description: `Getting a CSS animation to feel right usually means editing keyframe percentages, saving the file, and refreshing a browser tab to see if the timing actually matches what was in your head, then repeating that loop a dozen times. This tool cuts out the guesswork with sliders and a live preview: set how long the animation runs, how many times it repeats (or loop it forever), whether it plays forward, in reverse, or alternates between the two, and which easing curve controls the acceleration. Adjust a value and the preview updates immediately instead of waiting on a page reload. Once the motion looks right, export the @keyframes rule plus the animation shorthand, ready to paste into a stylesheet. It suits anything that needs to move on its own: a spinner while data loads, a shake on a failed form field, a subtle pulse on a call-to-action button.`,
    examples: [
      {
        title: 'Build a loading spinner',
        code: `@keyframes spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}\n.spinner { animation: spin 1s linear infinite; }`,
        note: 'Linear easing keeps the rotation speed constant instead of speeding up and slowing down.',
      },
      {
        title: 'Shake an invalid form field',
        code: `@keyframes shake {\n  0%, 100% { transform: translateX(0); }\n  25% { transform: translateX(-6px); }\n  75% { transform: translateX(6px); }\n}\n.input-error { animation: shake 0.3s ease-in-out 2; }`,
        note: 'An iteration count of 2 gives a quick shake without looping forever.',
      },
    ],
  },

  'color-opacity-generator': {
    description: `A regular color picker gives you a solid color. This one is built around a single extra dimension: opacity. Pick a base color, drag the alpha slider from fully see-through to fully solid, and get the result back as both an 8-digit hex code and an rgba() value, since browsers and design tools don't always agree on which format they expect. It matters most in places where a color needs to sit on top of something else without hiding it completely: a dark overlay over a hero image so white text stays readable, a semi-transparent border around a card that should pick up whatever background sits behind it, a frosted glass panel over a photo. Nail the exact percentage instead of eyeballing an rgba() value with a random fourth number, then copy whichever format your CSS or design tool actually needs.`,
    examples: [
      {
        title: 'Darken a hero image behind headline text',
        code: `Input: #000000, Opacity: 45%\nOutput: #00000073 | rgba(0, 0, 0, 0.45)`,
        note: 'Darkens the background image just enough that white headline text stays readable.',
      },
      {
        title: 'Add a subtle card border',
        code: `Input: #FFFFFF, Opacity: 20%\nOutput: #FFFFFF33 | rgba(255, 255, 255, 0.2)`,
        note: 'A faint white border that works over any background color behind the card.',
      },
    ],
  },

  'ping-test': {
    description: `Command-line ping sends raw ICMP packets, something a browser isn't allowed to do for security reasons, so this tool takes a different route: it fires a timed request at the host you enter and measures how long the response takes to come back, then reports that alongside the TTL and status it can read from the reply. It won't match a terminal's ping byte for byte, but it answers the same practical question without opening a terminal at all: is a server actually reachable right now, and roughly how far away is it. Useful for a quick check from a work laptop with no terminal access, confirming a new DNS record has actually propagated, or comparing response time on hotel Wi-Fi against your usual connection when something feels slow. Enter a domain or IP and get a result in seconds.`,
    examples: [
      {
        title: 'Confirm a DNS change propagated',
        code: `Input: api.example.com\nOutput: Response time: 42ms | TTL: 58 | Status: reachable`,
        note: 'Confirms a freshly pointed DNS record is resolving and the server is responding.',
      },
      {
        title: 'Compare latency across two networks',
        code: `Input: example.com (hotel Wi-Fi)\nOutput: Response time: 310ms | TTL: 51 | Status: reachable`,
        note: 'A high response time here, compared to the usual result at home, points to the network rather than the server.',
      },
    ],
  },

  'color-palette-extractor': {
    description: `Instead of starting from one color and building a palette around it, this tool works backward: upload a photo and it analyzes the actual pixels to find which colors show up most often, then returns each one as hex, RGB, and HSL. That's the useful move when you have a finished image but not the values behind it: a product photo, a screenshot of a competitor's site, a logo file with no accompanying style guide. Drop it in and get back the five or six colors that actually define how the image looks, ready to paste into a stylesheet or design tool. Photographers use it to build a website theme that matches their portfolio shots. Designers use it to reverse-engineer a brand's palette from a logo PNG when the original swatches were never handed over.`,
    examples: [
      {
        title: 'Build a website theme from a photo',
        code: `Input: sunset-photo.jpg\nOutput: #E8734A, #2B3A55, #F4C95D, #1A1A2E, #FFF8E7`,
        note: 'Pulls the five most common colors straight from the pixels, useful for matching a site theme to a hero image.',
      },
      {
        title: 'Reverse-engineer brand colors from a logo',
        code: `Input: company-logo.png\nOutput: #0057B8, #FFFFFF, #00A651`,
        note: 'Useful when you only have the logo file and no official style guide listing hex codes.',
      },
    ],
  },

  'gif-maker': {
    description: `There are two common starting points for an animated GIF, and this tool handles both: string together a handful of still images into a frame-by-frame animation, or feed in a short video clip and have it converted into a looping GIF automatically. For the image route, you control how long each frame stays on screen before the next one appears, which is the difference between a snappy flipbook effect and a slow slideshow. For the video route, trim to the section you actually want before conversion, since a GIF of an entire clip is usually bigger and messier than a five-second loop of the best part. Common uses: a reaction clip turned into a GIF, a before-and-after comparison built from two photos, or a quick product demo stitched together from screenshots.`,
    examples: [
      {
        title: 'Turn a three-photo sequence into a comparison GIF',
        code: `Input: before.jpg, during.jpg, after.jpg, frame delay: 800ms each\nOutput: comparison.gif (3 frames, looping)`,
        note: 'An 800ms delay per frame gives viewers enough time to register each stage before it advances.',
      },
      {
        title: 'Convert a short video clip into a loop',
        code: `Input: clip.mp4 (0:02-0:05), 12 fps\nOutput: reaction.gif (3 seconds, looping)`,
        note: 'Trimming to the highlight keeps the file size down compared to converting the whole clip.',
      },
    ],
  },

  'screenshot-maker': {
    description: `A browser's own screenshot shortcut usually only grabs whatever fits on screen at that moment, cutting off everything below the fold on a long page. This tool captures the entire page from top to bottom in one image, and lets you set the viewport size first, so you can see how a page renders at a phone width versus a widescreen monitor before the capture happens. There's also a delay setting, which matters more than it sounds: a page with a cookie banner animation, lazy-loaded images, or a slow API call can look broken if captured half a second too early. Enter a URL, pick a device width, add a short delay if the page needs it, and get back a full-length image ready for a bug report, a portfolio mockup, or an archive of how a page looked on a given date.`,
    examples: [
      {
        title: 'Capture a long pricing page for a bug report',
        code: `Input: https://example.com/pricing, viewport: 1440x900, delay: 1500ms\nOutput: pricing-full.png (full page height)`,
        note: 'The 1.5-second delay lets lazy-loaded pricing cards finish rendering before capture.',
      },
      {
        title: 'Check a mobile layout without a phone',
        code: `Input: https://example.com, viewport: 390x844\nOutput: example-mobile.png`,
        note: 'Simulates an iPhone-width viewport to catch layout issues without a physical device.',
      },
    ],
  },

  'exif-remover': {
    description: `A photo taken on a phone carries more than pixels. Buried in the file is EXIF metadata: the exact GPS coordinates where it was taken, the camera or phone model, the date and time down to the second, sometimes even the software used to edit it. None of that is visible when you look at the image, but it travels along with the file wherever it's uploaded or sent, which is how people have accidentally revealed their home address just by posting a photo taken on their porch. This tool strips that metadata out while leaving the image itself untouched: same pixels, same quality, no hidden location or device data riding along. Run a photo through it before posting to a marketplace listing, a public forum, or anywhere a stranger might view the file directly instead of through a platform that already scrubs metadata on its own.`,
    examples: [
      {
        title: 'Strip GPS data before selling an item online',
        code: `Input: porch-photo.jpg (GPS: 40.7128, -74.0060)\nOutput: porch-photo-clean.jpg (no location data)`,
        note: 'Removes the exact coordinates a marketplace listing photo would otherwise reveal.',
      },
      {
        title: 'Remove device and timestamp info before a public post',
        code: `Input: photo.jpg (Camera: iPhone 14 Pro, Date: 2026-03-02 14:31:07)\nOutput: photo-clean.jpg (metadata fields empty)`,
        note: "Strips the camera model and exact timestamp without changing how the image looks.",
      },
    ],
  },

  'image-orientation-fixer': {
    description: `Phone cameras save a small instruction inside every photo's metadata: hold it this way up. Most apps read that tag and display the photo correctly, but plenty of them don't, which is why a photo you took right-side up sometimes shows up sideways or completely upside down once it lands on a website, an old forum, or an email attachment. This tool exists for exactly that moment: instead of digging through rotate and flip menus to guess the right combination, one click applies the correction the file was already asking for. It's narrower than a general rotation tool on purpose, built for fixing a photo that's wrong, not for creatively angling one that's already correct. Upload the sideways image, apply the fix, and download a version that displays the way it was actually shot, no metadata guesswork required.`,
    examples: [
      {
        title: 'Fix a phone photo that displays sideways in an email',
        code: `Input: IMG_0482.jpg (displays rotated 90° despite a correct orientation tag)\nOutput: IMG_0482-fixed.jpg (pixels rotated to match, tag reset to normal)`,
        note: 'Bakes the correction into the pixels so it displays correctly even in apps that ignore orientation tags.',
      },
      {
        title: 'Correct an upside-down scanned document photo',
        code: `Input: scan.jpg (upside down, orientation tag: 3)\nOutput: scan-fixed.jpg (rotated 180°)`,
        note: 'One click applies the 180° correction instead of rotating twice through a menu by hand.',
      },
    ],
  },

  'image-rotate-tool': {
    description: `Sometimes rotating an image isn't about fixing a mistake, it's a design choice. This tool covers both the quick presets, 90, 180, and 270 degrees for turning a landscape photo into portrait or flipping it fully around, and a custom angle slider for anything in between, useful when a photo's horizon is tilted by a few degrees and needs straightening rather than a full quarter-turn. Enter an exact number like 3.5 degrees to level out a crooked horizon line, or 45 degrees to angle a graphic element for a poster layout. The canvas expands automatically so nothing gets clipped off the edges during an odd-angle rotation, and you can preview the result before committing to a download. Works on any image format the browser can display, with no separate conversion step required first.`,
    examples: [
      {
        title: 'Straighten a tilted horizon',
        code: `Input: beach-photo.jpg, angle: -2.5°\nOutput: beach-photo-straight.jpg (canvas auto-expanded, no clipping)`,
        note: 'A small custom angle corrects a slightly tilted horizon without a full 90-degree turn.',
      },
      {
        title: 'Turn a landscape photo into portrait orientation',
        code: `Input: wide-photo.jpg, angle: 90°\nOutput: wide-photo-portrait.jpg`,
        note: 'Useful for fitting a landscape-shot photo into a portrait-oriented story or poster template.',
      },
    ],
  },

  'image-flip-tool': {
    description: `Flipping an image is a mirror move, not a turn: a horizontal flip swaps left and right, a vertical flip swaps top and bottom, and neither one rotates the image around a center point the way a rotate tool does. That distinction matters most when there's text or an asymmetric detail in the shot; a phone's front camera often saves selfies mirrored, so any text on a shirt or a sign in the background reads backward until it's flipped back to how it actually looked in person. It's also useful for building a symmetrical design, mirroring one half of a graphic to create a matching pattern, or correcting a scanned photo that came out reversed because of how the scanner bed was oriented. Pick horizontal or vertical, see the result immediately, and download it without opening a separate editor just to flip one image.`,
    examples: [
      {
        title: 'Fix a selfie with backward text',
        code: `Input: selfie.jpg (shirt text reads mirrored)\nOutput: selfie-flipped.jpg (horizontal flip, text reads correctly)`,
        note: 'Front cameras commonly save mirrored selfies, so text and logos need a horizontal flip to read correctly.',
      },
      {
        title: 'Mirror one half of a graphic into a symmetrical pattern',
        code: `Input: half-pattern.png, flip: vertical\nOutput: mirrored-pattern.png (stacked below the original)`,
        note: 'A vertical flip creates the mirrored bottom half needed for a symmetrical design.',
      },
    ],
  },
};

export default FIX_BATCH_2;
