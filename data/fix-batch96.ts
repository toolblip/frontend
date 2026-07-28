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

const FIX_BATCH_96: Record<string, FixBatchEntry> = {
  'cron-human-readable': {
    description: `Building a cron schedule visually is only half the job, the more lasting value is what gets left behind afterward, a plain English sentence describing exactly what "0 9 * * 1-6" actually means that can sit right next to the expression in a code comment or a config file, so nobody stumbles onto that schedule months later and has to mentally parse five cron fields from scratch. This tool builds a cron schedule through a point-and-click editor and produces a plain English description as the actual output, built around documenting a schedule clearly rather than just constructing it. Useful for generating a readable description to drop into a code comment right next to a cron expression, documenting exactly what a scheduled job does for someone who didn't write it, or building a new schedule visually while getting a plain English sentence to record alongside it.`,
    examples: [
      {
        title: 'Document a schedule with a readable comment',
        code: `Input: 0 9 * * 1-6\nOutput: "At 9:00 AM, Monday through Saturday"`,
        note: 'Produces a description ready to drop directly into a code comment.',
      },
      {
        title: 'Build a schedule and get its description together',
        code: `Selected: every 15 minutes, weekdays only\nOutput: "*/15 * * * 1-5" + "Every 15 minutes, Monday through Friday"`,
        note: 'Documents the schedule as part of building it, not as an extra step.',
      },
    ],
  },

  'cron-parser': {
    description: `A cron expression that's already written, and possibly already broken, calls for a different kind of tool than one still being built from scratch, something that takes the existing string as-is and diagnoses it, catching a malformed field, an out-of-range value, or a syntax mistake, with the resulting explanation and upcoming run times serving as evidence for whatever's actually wrong. This tool parses an existing cron expression, validating it for errors while showing a human-readable explanation and the next five run times as supporting detail for debugging it. Useful for pasting in a cron expression someone else wrote to check whether it's actually valid, debugging why a scheduled job hasn't been running when expected, or confirming a schedule's next five run times actually line up with what it was supposed to do.`,
    examples: [
      {
        title: 'Validate an existing cron expression',
        code: `Input: 0 25 * * *\nOutput: error - hour value 25 is out of range (0-23)`,
        note: 'Catches an invalid field in a schedule someone already wrote.',
      },
      {
        title: "Debug why a job hasn't run",
        code: `Input: 0 9 * * 8\nOutput: error - day-of-week value 8 is invalid (0-6 or SUN-SAT)`,
        note: 'Surfaces the exact reason a scheduled job never fired.',
      },
    ],
  },

  crop: {
    description: `Cropping to remove a stranger who wandered into the edge of a photo or a messy background element doesn't call for picking a named preset ratio first, the exact resulting dimensions genuinely don't matter, what matters is dragging a crop box freely to whatever size actually gets rid of the unwanted part. This tool crops an image to any size and aspect ratio freely, built around removing something unwanted from a photo rather than hitting a specific output ratio a preset list would offer. Useful for cropping out a photobomber or a distracting background element without worrying about the exact resulting ratio, trimming a photo down to just the relevant part quickly, or cropping freely to any custom size when no standard preset actually fits what needs removing.`,
    examples: [
      {
        title: 'Remove a photobomber from the edge',
        code: `Input: group-photo.jpg (stranger visible at right edge)\nOutput: group-photo-cropped.jpg (custom crop, edge removed)`,
        note: 'Crops to whatever size removes the problem, no preset ratio required.',
      },
      {
        title: 'Trim to just the relevant part',
        code: `Input: screenshot.png (full browser window)\nOutput: screenshot-cropped.png (just the relevant panel)`,
        note: 'Freeform cropping without matching a named aspect ratio.',
      },
    ],
  },

  'css-filter-generator': {
    description: `A CSS filter isn't a one-time edit baked into a new image file, it's a live property applied to the existing image reference in the browser, GPU-accelerated and non-destructive, which means the same source image can render differently on different pages just by changing the CSS, and it can transition smoothly, a hover effect that gradually desaturates a photo, in a way a permanently edited file never could. This tool generates CSS filter effects, blur, brightness, contrast, grayscale, sepia, and more, with a live preview showing exactly how each one renders before the CSS gets copied anywhere. Useful for generating a grayscale hover effect that transitions smoothly rather than editing a separate desaturated image file, previewing how a blur or contrast filter actually looks before committing to the CSS, or applying the same filter effect across multiple images from one shared image file.`,
    examples: [
      {
        title: 'Preview a grayscale hover effect',
        code: `Output: img:hover { filter: grayscale(100%); transition: filter 0.3s; }`,
        note: 'Transitions live in the browser rather than swapping to a separate edited file.',
      },
      {
        title: 'Preview a blur and contrast combination',
        code: `Output: filter: blur(3px) contrast(120%);`,
        note: 'Shows the rendered result before the CSS is copied anywhere.',
      },
    ],
  },

  'css-flexbox-generator': {
    description: `Flexbox arranges items along a single direction, a row or a column, with wrapping onto a new line as a fallback behavior rather than genuine two-axis control, which makes it the right fit for a navbar, a button group, or anything that just needs to distribute or align along one dimension rather than an entire page's rows and columns at once. This tool builds flex layouts visually with direction, wrap, justify-content, and align-items controls, generating CSS for exactly this kind of one-dimensional arrangement. Useful for building a navbar's item alignment and spacing visually before writing the CSS by hand, distributing a row of buttons evenly without calculating flex values manually, or wrapping a set of items onto new lines with the spacing behavior previewed before copying the code.`,
    examples: [
      {
        title: 'Align a navbar visually',
        code: `Selected: direction: row, justify-content: space-between, align-items: center\nOutput: display: flex; justify-content: space-between; align-items: center;`,
        note: 'Generates the alignment CSS without calculating flex values by hand.',
      },
      {
        title: 'Distribute a row of buttons evenly',
        code: `Selected: justify-content: space-around\nOutput: display: flex; justify-content: space-around;`,
        note: 'Previews the spacing behavior before copying the CSS.',
      },
    ],
  },

  'css-grid-generator': {
    description: `A page layout with a header, a sidebar, a main content area, and a footer needs actual control over both rows and columns simultaneously, items placed at specific intersections or spanning multiple cells at once, a genuinely two-dimensional structure that flexbox's single-axis model was never built to express, however far its wrapping behavior gets stretched to compensate. This tool builds CSS Grid layouts visually with rows, columns, gaps, and named areas, generating CSS for two-dimensional structure rather than a single row or column. Useful for laying out a full page structure with a header, sidebar, and footer visually before writing the grid CSS by hand, placing an item to span multiple columns or rows without calculating the grid lines manually, or defining named grid areas visually for a layout more complex than flexbox can actually express.`,
    examples: [
      {
        title: 'Lay out a header, sidebar, and content area',
        code: `Output:\ngrid-template-areas:\n  "header header"\n  "sidebar content";\ngrid-template-columns: 200px 1fr;`,
        note: 'Defines named areas visually for a full two-dimensional layout.',
      },
      {
        title: 'Span an item across multiple columns',
        code: `Output: grid-column: span 3;`,
        note: 'Places an item across a specific span without calculating grid lines by hand.',
      },
    ],
  },

  'css-minifier': {
    description: `Stripping whitespace and comments is the obvious part of minifying CSS, but the specific size gains come from elsewhere, shortening a color value like #ffffff down to #fff, dropping a unit off a zero value since 0px and 0 render identically, and combining separate margin or padding properties into a single shorthand line, optimizations a naive whitespace-only stripper never catches. This tool minifies CSS by removing whitespace and comments while also applying these CSS-specific size reductions, rather than only stripping formatting. Useful for shrinking a stylesheet for production beyond what basic whitespace removal alone achieves, shortening color values and zero units automatically instead of hunting for them by hand, or minifying CSS with shorthand property optimization included rather than left for a separate pass.`,
    examples: [
      {
        title: 'Shorten color values and zero units',
        code: `Input: margin: 0px; color: #ffffff;\nOutput: margin:0;color:#fff;`,
        note: 'Applies CSS-specific reductions beyond stripping whitespace alone.',
      },
      {
        title: 'Combine shorthand properties',
        code: `Input: margin-top: 8px; margin-right: 16px; margin-bottom: 8px; margin-left: 16px;\nOutput: margin:8px 16px;`,
        note: 'Merges separate properties into a single shorthand line.',
      },
    ],
  },

  'css-preview': {
    description: `A structured builder with named controls works well once the actual layout system is already decided, but trying out an unfamiliar CSS property, a transform, a new filter, an animation nobody on the team has used before, calls for something that just renders whatever's typed in rather than a form limited to one specific system's known options. This tool previews any CSS property live with editable code and real-time rendered output, built for experimenting freely with arbitrary CSS rather than a guided builder scoped to one layout system. Useful for trying out an unfamiliar CSS property to see exactly what it actually does visually, testing a transform or an animation before committing it to a real stylesheet, or experimenting freely with any CSS rule rather than being limited to a specific builder's named controls.`,
    examples: [
      {
        title: 'Try an unfamiliar CSS property',
        code: `Input: backdrop-filter: blur(10px);\nOutput: live rendered preview of the blurred backdrop effect`,
        note: "Renders any property typed in, not just a specific builder's known controls.",
      },
      {
        title: 'Test an animation before committing it',
        code: `Input: @keyframes fade { from { opacity: 0; } to { opacity: 1; } }\nOutput: live preview of the fade animation`,
        note: 'Experiments freely with arbitrary CSS rather than a scoped form.',
      },
    ],
  },

  'curl-command-builder': {
    description: `Building a request from a blank form, picking the method, adding headers one at a time, writing the body, is a forward construction process starting from nothing, a genuinely different task from reverse-engineering a curl command out of a request that already happened somewhere else, like one captured in a browser's network tab. This tool builds a curl command from scratch with a specified method, headers, body, and authentication entered directly, rather than extracting one from an existing captured request. Useful for constructing a curl command for an API call that doesn't exist as a browser request yet, building a request from a specification or documentation rather than something already observed, or assembling a curl command's method, headers, and body manually when there's no existing request to extract it from.`,
    examples: [
      {
        title: 'Build a request from scratch',
        code: `Input: method: POST, header: "Content-Type: application/json", body: {"name":"Jane"}\nOutput: curl -X POST -H "Content-Type: application/json" -d '{"name":"Jane"}' https://api.example.com/users`,
        note: 'Constructs the command from a blank form rather than an observed request.',
      },
      {
        title: 'Add authentication manually',
        code: `Input: auth: Bearer token abc123\nOutput: curl -H "Authorization: Bearer abc123" https://api.example.com/users`,
        note: 'Builds the header directly when there is no existing request to extract it from.',
      },
    ],
  },

  'curl-gen-express': {
    description: `A request that already happened in the browser, visible in the Network tab after a page loaded or a form submitted, carries every header and body value curl would need, and reconstructing that request manually field by field is redundant work when it can be extracted directly from what already fired. This tool generates a curl command from an actual browser network request, extracting its headers and body automatically rather than requiring them to be specified by hand. Useful for turning a request already captured in DevTools into a curl command to replay it from a terminal, reproducing an API call a webpage made without rebuilding it field by field, or extracting a working curl command from a real request instead of guessing at what headers it originally sent.`,
    examples: [
      {
        title: 'Convert a captured DevTools request',
        code: `Input: [request captured in Network tab]\nOutput: curl -X GET -H "Authorization: Bearer ..." https://api.example.com/data`,
        note: 'Extracts headers automatically rather than requiring them typed in.',
      },
      {
        title: "Replay a webpage's API call from a terminal",
        code: `Input: [POST request observed after form submission]\nOutput: curl -X POST -d '{"email":"user@example.com"}' https://api.example.com/signup`,
        note: 'Reproduces an observed request without rebuilding it field by field.',
      },
    ],
  },
};

export default FIX_BATCH_96;
