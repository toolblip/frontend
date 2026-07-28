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

const FIX_BATCH_51: Record<string, FixBatchEntry> = {
  'length-converter': {
    description: `A furniture listing in centimeters doesn't mean much next to a room measured in feet and inches, and a recipe or a DIY project that mixes metric and imperial units partway through forces a manual conversion just to know if something actually fits or matches. This tool converts length and distance between metric and imperial units, meters, feet, inches, centimeters, miles, kilometers, and more, handling the actual conversion factor directly rather than requiring it looked up or estimated. Useful for checking whether an imported piece of furniture measured in centimeters actually fits a room measured in feet, converting a running route's distance between miles and kilometers, or translating a measurement from an international manual or a recipe into whichever unit is actually familiar.`,
    examples: [
      {
        title: 'Convert centimeters to feet and inches',
        code: `Input: 214 cm\nOutput: 7 ft 0.25 in`,
        note: 'Confirms whether an imported piece of furniture fits a room measured in feet.',
      },
      {
        title: 'Convert a running distance',
        code: `Input: 5 km\nOutput: 3.107 mi`,
        note: 'Converts a race distance between metric and imperial units.',
      },
    ],
  },

  'lorem-ipsum-generator': {
    description: `Lorem ipsum isn't randomly generated gibberish, it's a scrambled passage from a first-century Latin text by Cicero that's been the standard placeholder for typesetting since the 1500s, and a design mockup calling for the genuine, traditional version needs that actual text rather than a modern readable alternative built around a topic or a full sentence. This tool generates classic lorem ipsum with the paragraph count, sentence count, and word count all set precisely, producing exactly as much of the traditional text as a layout actually calls for. Useful for filling a design mockup with the standard placeholder text every designer already recognizes, generating a precise word count to test a layout's text limit, or copying a quick block of genuine lorem ipsum instead of a modern readable substitute.`,
    examples: [
      {
        title: 'Generate a precise word count',
        code: `Input: word count: 50\nOutput: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."`,
        note: 'Produces exactly the word count a layout test actually needs.',
      },
      {
        title: 'Generate by paragraph count',
        code: `Input: paragraphs: 3\nOutput: three paragraphs of classic lorem ipsum text`,
        note: 'Fills a mockup with the traditional placeholder text designers recognize.',
      },
    ],
  },

  sharpen: {
    description: `A phone photo that came out slightly soft, an old scan that lost some clarity, or an image that got a little blurry after resizing all share the same fix, boosting the contrast right at each edge so detail that's technically present but visually mushy reads as sharp again. This tool sharpens a blurry photo by enhancing exactly that edge detail, improving perceived clarity without changing the actual color or exposure of the image. Useful for crisping up a slightly out-of-focus phone photo before printing it, improving the legibility of text in a scanned document photo, or restoring some perceived sharpness to an image that got soft after being resized or compressed.`,
    examples: [
      {
        title: 'Sharpen a soft phone photo',
        code: `Input: slightly out-of-focus photo.jpg\nOutput: photo-sharpened.jpg with enhanced edge contrast`,
        note: 'Improves perceived clarity without altering color or exposure.',
      },
      {
        title: 'Improve legibility of a scanned document',
        code: `Input: scanned-page.jpg (soft text)\nOutput: scanned-page-sharpened.jpg with crisper text edges`,
        note: 'Makes scanned text easier to read without re-scanning the original.',
      },
    ],
  },

  'spelling-checker-tool': {
    description: `A full grammar pass with explanations for every rule is more than what's actually needed when the only real question is whether a word is spelled correctly, sometimes a fast, single-purpose spellcheck is exactly the point, especially pasting text into a plain textarea or a code comment field that has no spellchecker built in at all. This tool checks spelling specifically, flagging a misspelled word and offering a one-click correction without wading into grammar or punctuation at the same time. Useful for a quick spelling pass on text typed into a field that lacks its own spellchecker, catching a typo in a username, a title, or a short piece of text before it's published, or fixing a misspelled word instantly instead of retyping it by hand.`,
    examples: [
      {
        title: 'Catch a misspelled word',
        code: `Input: "The recieve confirmation was sent yesterday."\nOutput: "recieve" -> "receive"`,
        note: 'Flags the error without also analyzing grammar or punctuation.',
      },
      {
        title: 'Apply a one-click correction',
        code: `Input: "This is definately correct."\nOutput (applied): "This is definitely correct."`,
        note: 'Fixes the typo instantly instead of retyping the word.',
      },
    ],
  },

  'vsd-to-jpg': {
    description: `A Visio diagram saved as a VSD file is genuinely unreadable without Visio itself installed, which is a real problem the moment that flowchart or org chart needs sharing with someone who doesn't own the software or reviewing on a phone where Visio simply isn't available. This tool converts a VSD file into a JPEG image, turning a diagram locked inside a proprietary format into something anyone can open in literally any image viewer or embed directly into a document. Useful for sharing a Visio flowchart with someone who doesn't have Visio installed, embedding an org chart as an image in a slide deck or a wiki page, or archiving an old VSD file as a viewable image before the software it depends on becomes harder to access.`,
    examples: [
      {
        title: 'Convert a flowchart to an image',
        code: `Input: process-flow.vsd\nOutput: process-flow.jpg`,
        note: 'Makes the diagram viewable without Visio installed.',
      },
      {
        title: 'Export an org chart for a slide deck',
        code: `Input: org-chart.vsd\nOutput: org-chart.jpg (ready to embed)`,
        note: 'Turns a proprietary Visio file into an image any tool can display.',
      },
    ],
  },

  'docker-command-generator': {
    description: `A docker run command with port mapping, a volume mount, and an environment variable or two packs several easy-to-forget flags into one line, -p, -v, -e, each in a specific order, and getting one wrong usually means a container that starts but doesn't actually behave the way it was meant to. This tool builds Docker CLI commands, run, build, compose, and more, through an actual visual form instead of requiring every flag typed from memory, assembling the final command as each field gets filled in. Useful for building a docker run command with port and volume mappings without checking documentation each time, generating a docker build command with build arguments included correctly, or constructing a docker-compose command without memorizing flag order.`,
    examples: [
      {
        title: 'Build a docker run command',
        code: `Input: image: nginx, port: 8080:80, volume: ./html:/usr/share/nginx/html\nOutput: docker run -p 8080:80 -v ./html:/usr/share/nginx/html nginx`,
        note: 'Assembles the flags in the correct order from form fields.',
      },
      {
        title: 'Build a docker build command',
        code: `Input: tag: myapp:latest, build-arg: NODE_ENV=production\nOutput: docker build -t myapp:latest --build-arg NODE_ENV=production .`,
        note: 'Generates a build command with arguments included correctly.',
      },
    ],
  },

  'xml-to-excel': {
    description: `XML data nests elements and attributes in a hierarchy that a spreadsheet simply doesn't have, rows and columns are flat by nature, so converting one into the other means actually deciding how a repeated child element or a nested attribute maps onto individual spreadsheet columns rather than just changing the file extension. This tool converts XML into an Excel spreadsheet, mapping nested data into rows and columns so each XML record becomes one readable spreadsheet row. Useful for importing an XML export from an older system into Excel for analysis, converting a product feed's XML structure into a spreadsheet a non-technical teammate can actually work with, or turning repeated nested XML elements into individual columns instead of an unreadable nested block.`,
    examples: [
      {
        title: 'Convert XML records into rows',
        code: `Input: <products><product><name>Widget</name><price>9.99</price></product></products>\nOutput: Excel row: name=Widget, price=9.99`,
        note: 'Maps each XML record to one spreadsheet row.',
      },
      {
        title: 'Flatten nested elements into columns',
        code: `Input: <order><customer><name>Jane</name><city>Austin</city></customer></order>\nOutput: columns: customer_name, customer_city`,
        note: 'Turns nested child elements into individual flat columns.',
      },
    ],
  },

  'unicode-character-inspector': {
    description: `A character that looks completely ordinary on screen might actually be a zero-width space, a smart quote instead of a straight one, or an entirely different code point than expected, any of which can silently break a parser or cause a string comparison to fail for no visible reason. This tool inspects any Unicode character and shows its code point, its UTF-8 byte encoding, and its HTML entity, revealing exactly what a character actually is underneath its visual appearance. Useful for debugging a mojibake issue where the wrong character encoding produced garbled text, confirming whether an invisible character is hiding inside a string that looks fine but breaks a parser, or looking up the HTML entity code needed to embed a special character in markup.`,
    examples: [
      {
        title: 'Inspect an invisible character',
        code: `Input: "hello​world" (contains zero-width space)\nOutput: U+200B ZERO WIDTH SPACE, UTF-8: E2 80 8B, HTML entity: &#8203;`,
        note: 'Reveals a character that looks invisible but is actually present in the string.',
      },
      {
        title: 'Look up an HTML entity',
        code: `Input: "é"\nOutput: U+00E9, UTF-8: C3 A9, HTML entity: &eacute;`,
        note: 'Gives the exact entity code needed to embed the character in markup.',
      },
    ],
  },

  'hash-identifier': {
    description: `A hash digest pulled from an old database dump or a config file rarely comes labeled with which algorithm produced it, and MD5, SHA-1, SHA-256, bcrypt, and Argon2 each leave a different fingerprint, a specific length, a specific format, sometimes a recognizable prefix like $2b$ or $argon2, that narrows it down without needing to guess blindly. This tool identifies the likely algorithm behind a pasted hash by examining its length, format, and known prefixes, narrowing an unlabeled digest down to its probable source. Useful for figuring out which algorithm produced a hash found in an old database export before attempting to verify it, recognizing a bcrypt or Argon2 hash by its distinctive prefix, or confirming whether a 32-character digest is actually MD5 rather than a truncated longer hash.`,
    examples: [
      {
        title: 'Identify an algorithm by length and format',
        code: `Input: 5f4dcc3b5aa765d61d8327deb882cf99\nOutput: likely MD5 (32 hex characters)`,
        note: 'Narrows down the algorithm from digest length and format alone.',
      },
      {
        title: 'Recognize a bcrypt hash by its prefix',
        code: `Input: $2b$12$KIXQ...\nOutput: likely bcrypt (recognizable $2b$ prefix)`,
        note: 'Flags a distinctive prefix rather than guessing from length alone.',
      },
    ],
  },

  'js-beautifier': {
    description: `A minified script pulled from a live website's source, or a file that picked up inconsistent indentation after several different contributors touched it, is technically readable but practically exhausting to actually follow, every brace and semicolon crammed together with no visual structure guiding the eye through it. This tool formats and indents JavaScript code with proper brace placement and semicolon positioning, turning a dense, uglified, or inconsistently formatted file into something that actually reads the way the logic is structured. Useful for reading a minified script's actual logic after pulling it from a website's source, cleaning up inconsistent indentation in a legacy file before a refactor, or making a machine-generated JavaScript file human-readable enough to debug.`,
    examples: [
      {
        title: 'Beautify a minified script',
        code: `Input: function a(b){return b*2}var c=a(5);console.log(c);\nOutput:\nfunction a(b) {\n  return b * 2;\n}\nvar c = a(5);\nconsole.log(c);`,
        note: 'Turns a single dense line into properly indented, readable code.',
      },
      {
        title: 'Fix inconsistent indentation',
        code: `Input: [file with mixed 2-space and 4-space indentation]\nOutput: consistently indented file with uniform brace placement`,
        note: 'Normalizes formatting before a refactor.',
      },
    ],
  },
};

export default FIX_BATCH_51;
