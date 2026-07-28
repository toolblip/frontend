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

const FIX_BATCH_56: Record<string, FixBatchEntry> = {
  'api-endpoint-debugger': {
    description: `Testing your own API during development or poking at a third party's endpoint before writing integration code both come down to sending an actual request with the right headers, body, and authentication and seeing exactly what comes back, not assuming it works because a request went out without erroring. This tool sends a request to any API endpoint with custom headers, a custom body, and authentication included, showing the real response rather than requiring a separate script written just to test one call. Useful for confirming your own API endpoint handles a specific header or auth scheme correctly during development, poking at an unfamiliar third-party API to understand its actual behavior before writing integration code, or debugging why a request is failing by adjusting one field at a time and watching the response change.`,
    examples: [
      {
        title: 'Test an endpoint with a custom auth header',
        code: `Request: GET https://api.example.com/users/42\nHeaders: Authorization: Bearer eyJhbGci...\nResponse: 200 OK { "id": 42, "name": "Jane" }`,
        note: 'Confirms an endpoint accepts a specific auth scheme correctly.',
      },
      {
        title: 'Debug a failing request',
        code: `Request: POST https://api.example.com/orders\nBody: { "quantity": 0 }\nResponse: 422 { "error": "quantity must be greater than 0" }`,
        note: 'Reveals the actual reason a request is being rejected.',
      },
    ],
  },

  'json-editor': {
    description: `Editing a JSON document by hand in a plain text field risks breaking its syntax with one misplaced bracket, and finding the specific nested value that actually needs changing inside a large document means scrolling through raw text instead of expanding just the relevant branch. This tool edits JSON through syntax highlighting, a tree view that expands and collapses nested sections, live validation, and real-time formatting as changes are made, rather than requiring the whole document retyped or reformatted after every edit. Useful for changing one specific nested value inside a large JSON document through a tree view instead of scrolling raw text, catching a syntax break the instant it happens rather than after saving, or reformatting a document automatically while actively editing it rather than as a separate step.`,
    examples: [
      {
        title: 'Edit a nested value in the tree view',
        code: `Tree: user > address > city: "Austin" -> click to edit -> "Denver"\nDocument updates in real time`,
        note: 'Changes one nested field without touching the raw text around it.',
      },
      {
        title: 'Catch a syntax break while typing',
        code: `Input: { "name": "Widget"„\nValidation: error - unexpected character after value`,
        note: 'Flags a mistake the instant it happens instead of after saving.',
      },
    ],
  },

  'hmac-generator': {
    description: `A plain hash only proves a piece of content hasn't changed, but it doesn't prove who actually generated it, which is exactly the gap HMAC closes by mixing in a secret key known only to the sender and the receiver, the same mechanism a webhook signature header relies on to prove a payload genuinely came from the expected service rather than being forged by someone else entirely. This tool generates an HMAC digest from text using SHA-256, SHA-1, or MD5 combined with a secret key, producing the same value a legitimate sender's signing process would. Useful for verifying that a webhook's signature header actually matches what a shared secret would produce, generating a signed payload for an API that requires HMAC authentication, or confirming two systems are computing the same signature from the same secret key.`,
    examples: [
      {
        title: 'Verify a webhook signature',
        code: `Payload: '{"event":"payment.succeeded"}'\nSecret: whsec_abc123\nGenerated HMAC-SHA256: 5f9e3a...\nReceived header: 5f9e3a... -> match`,
        note: 'Confirms the payload actually came from the expected sender.',
      },
      {
        title: 'Generate a signed request payload',
        code: `Input: text: "amount=1000&currency=usd", secret: mySecretKey, algorithm: SHA-256\nOutput: 8b2c94e1...`,
        note: 'Produces the signature an API requiring HMAC authentication expects.',
      },
    ],
  },

  'tiff-to-text': {
    description: `A scanned document or an old fax saved as a TIFF file, the format many scanners default to for lossless archival quality, holds text that's completely unsearchable and untouchable until it's actually extracted, since a TIFF is just a picture of the words rather than the words themselves. This tool extracts text from a TIFF image using OCR, turning a scanned document into text that can actually be searched, copied, or edited rather than only viewed as an image. Useful for digitizing an old scanned document or fax that only exists as a TIFF file, extracting searchable text from an archived paper record without retyping it by hand, or pulling text out of a multi-page TIFF scan page by page.`,
    examples: [
      {
        title: 'Extract text from a scanned fax',
        code: `Input: old-fax-scan.tiff\nOutput: "Invoice #4521 - Payment due within 30 days..."`,
        note: 'Turns a scanned image into text that can be searched or copied.',
      },
      {
        title: 'Digitize a multi-page archival scan',
        code: `Input: archive-record.tiff (6 pages)\nOutput: full text extracted from all 6 pages`,
        note: 'Extracts text page by page from a multi-page TIFF file.',
      },
    ],
  },

  'api-spec-generator': {
    description: `Writing an OpenAPI or Swagger specification by hand from scratch is slow, and documenting an API that already exists but was never formally specified usually means someone has to reverse-engineer its shape from an actual example response instead of a written contract that was never created in the first place. This tool generates an OpenAPI or Swagger spec directly from JSON sample data, inferring the structure and types from an actual response rather than requiring the specification written manually field by field. Useful for bootstrapping API documentation from a real example response instead of writing YAML by hand, documenting an existing but previously undocumented endpoint by feeding in one of its actual responses, or generating a starting spec that can be refined rather than built entirely from nothing.`,
    examples: [
      {
        title: 'Generate a spec from a sample response',
        code: `Input: { "id": 1, "name": "Widget", "price": 9.99 }\nOutput: OpenAPI schema with id: integer, name: string, price: number`,
        note: 'Infers types and structure directly from an actual response.',
      },
      {
        title: 'Document an undocumented endpoint',
        code: `Input: sample response from GET /api/orders/1\nOutput: OpenAPI path definition for GET /api/orders/{id}`,
        note: 'Builds a starting spec for an endpoint that was never formally documented.',
      },
    ],
  },

  'favicon-png-creator': {
    description: `A favicon isn't one image, it's a whole set of them, a tiny 16x16 icon for a browser tab, a larger one for an Apple touch icon, another for an Android home screen shortcut, and generating each size individually by hand from a single logo is exactly the kind of repetitive task worth automating. This tool creates a favicon and a full set of app icons from any image or even an emoji, outputting every size a modern site actually needs from one source rather than resizing each individually. Useful for generating a complete favicon set from a single logo so every device shows a properly sized icon instead of a blurry one, or turning a plain emoji into a quick favicon for a personal project or a prototype that doesn't have custom artwork yet.`,
    examples: [
      {
        title: 'Generate a full icon set from a logo',
        code: `Input: logo.png\nOutput: favicon-16x16.png, favicon-32x32.png, apple-touch-icon-180x180.png, android-chrome-512x512.png`,
        note: 'Produces every size a modern site needs from one source image.',
      },
      {
        title: 'Create a favicon from an emoji',
        code: `Input: 🚀\nOutput: favicon.ico and a full PNG size set`,
        note: 'Gives a quick icon for a prototype with no custom artwork yet.',
      },
    ],
  },

  'sitemap-xml-validator': {
    description: `A sitemap can list nothing but perfectly healthy URLs and still get rejected by Search Console if the XML file itself is missing a required tag, uses the wrong namespace, or is malformed in some structural way that has nothing to do with whether any individual URL actually works. This tool validates a sitemap's XML structure directly, checking for a missing tag, a malformed element, or a URL formatting issue within the file itself rather than checking whether the listed URLs are actually reachable. Useful for catching a structural problem that would get a sitemap rejected before it's ever submitted to Search Console, confirming a sitemap generated by an unfamiliar tool actually follows the expected XML format, or finding a missing required tag hiding somewhere in a large sitemap file.`,
    examples: [
      {
        title: 'Catch a missing required tag',
        code: `Input: sitemap.xml\nOutput: error - <url> entry on line 42 is missing a <loc> tag`,
        note: 'Flags a structural problem that would get the sitemap rejected.',
      },
      {
        title: 'Confirm the XML namespace is correct',
        code: `Input: sitemap.xml\nOutput: valid - correct namespace and all required tags present`,
        note: 'Confirms the file follows the format Search Console expects.',
      },
    ],
  },

  'jwt-token-decoder': {
    description: `A JWT carries its header and its payload in plain, readable base64, not encrypted, which means the claims inside, an expiration time, a user id, a role, can be inspected directly without ever needing the secret key that actually signs and verifies it, useful during debugging even though it doesn't confirm the token itself is genuine or untampered. This tool decodes a JWT's header and payload for inspection, explicitly without verifying its signature, showing what's actually inside the token rather than confirming its authenticity. Useful for checking exactly when a token actually expires while debugging a rejected API call, inspecting the claims inside a token received from a service you don't control and don't have the signing secret for, or reading a JWT's payload during development without needing signature verification at all.`,
    examples: [
      {
        title: 'Check when a token expires',
        code: `Input: eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MjAwMDAwMDB9.signature\nOutput: header: { "alg": "HS256" }, payload: { "exp": 1720000000 } -> expires Jul 3, 2024`,
        note: 'Reveals the expiration claim without needing the signing secret.',
      },
      {
        title: 'Inspect claims in a third-party token',
        code: `Input: [JWT received from an external service]\nOutput: payload: { "sub": "user_492", "role": "admin" }`,
        note: 'Shows what a token actually contains during debugging, without verifying it.',
      },
    ],
  },

  'broken-link-checker': {
    description: `Auditing a page's outbound links usually starts with actually collecting every link on that page first, which is tedious enough by hand that a dead link buried deep in an old post routinely goes unnoticed for months. This tool scans an entire webpage automatically, finding every outbound link on it and checking each one's HTTP status without requiring the list assembled or pasted in beforehand. Useful for auditing a single page's links automatically after a site redesign to catch anything that broke, finding a dead link buried in an old blog post without manually collecting every URL on the page first, or confirming every outbound link on a page actually resolves before it's shared widely.`,
    examples: [
      {
        title: 'Scan a page for dead links automatically',
        code: `Input: example.com/blog/2019-post\nOutput: 14 links found, 2 broken (404), 12 OK`,
        note: 'Finds every outbound link without the list being collected manually first.',
      },
      {
        title: 'Audit a page after a redesign',
        code: `Input: example.com/resources\nOutput: 3 links now returning 404 that worked before the redesign`,
        note: 'Catches links that broke as a side effect of a recent site change.',
      },
    ],
  },

  'webp-to-png': {
    description: `WebP is what a lot of modern websites now serve by default since it's smaller than PNG or JPG at similar quality, but an older image editor, a legacy CMS, or a platform that hasn't caught up yet often can't open a WebP file at all, leaving it stuck in a format that looks fine in a browser but won't open anywhere else. This tool converts WebP to PNG, preserving both transparency and quality rather than flattening or degrading the image during conversion. Useful for opening a WebP image downloaded from a modern website in an older editor that doesn't support the format, converting a WebP graphic into PNG for a CMS or a platform that only accepts traditional image formats, or preserving a WebP image's transparency after converting it to a more universally compatible format.`,
    examples: [
      {
        title: 'Convert a WebP image for an older editor',
        code: `Input: photo.webp\nOutput: photo.png`,
        note: 'Makes the image openable in software that never added WebP support.',
      },
      {
        title: 'Preserve transparency during conversion',
        code: `Input: logo-transparent.webp\nOutput: logo-transparent.png (alpha channel intact)`,
        note: 'Keeps transparency instead of flattening it to a solid background.',
      },
    ],
  },
};

export default FIX_BATCH_56;
