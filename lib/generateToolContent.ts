import type { Tool } from "@/data/tools";

/**
 * Generate unique, meaningful content for each tool page.
 * Uses multiple template variations per category, seeded by tool name/description,
 * so each page gets genuinely different server-rendered content.
 */
export function generateToolContent(tool: Tool): {
  howToUse: string;
  whyUse: string;
  howToUseAlt: string;
  relatedPhrases: string[];
} {
  const { name, description, category } = tool;

  // Deterministic seed from tool name for variant selection
  const seed = name.length + description.length + name.charCodeAt(0);
  const variant = seed % 5; // 0-4, gives us 5 variants per category

  // ── How-to-use templates (3-5 variants per category) ──────────────
  const howToTemplates = getHowToTemplates(category, variant);
  const howToUse = howToTemplates
    .replace(/\{name\}/g, name)
    .replace(/\{desc\}/g, description);

  // ── Why-use templates ─────────────────────────────────────────────
  const whyTemplates = getWhyTemplates(category, variant);
  const whyUse = whyTemplates
    .replace(/\{name\}/g, name)
    .replace(/\{desc\}/g, description);

  // ── Alt how-to for extra variety in the secondary block ───────────
  const altVariant = (variant + 3) % 5;
  const altHowToTemplates = getHowToTemplates(category, altVariant);
  const howToUseAlt = altHowToTemplates
    .replace(/\{name\}/g, name)
    .replace(/\{desc\}/g, description);

  // ── Related search phrases from tool name ─────────────────────────
  const phrases: string[] = [];
  const words = name.toLowerCase().split(" ");
  const basePhrase = words.length > 2
    ? words.slice(0, 3).join(" ")
    : name.toLowerCase();

  phrases.push(`free ${basePhrase} online`);
  phrases.push(`${basePhrase} tool`);
  phrases.push(`online ${basePhrase} no signup`);
  if (category !== "Developer") {
    phrases.push(`${basePhrase} for developers`);
  }
  // Extract a key noun from the description
  const descWords = description.toLowerCase().split(" ");
  const keyNouns = descWords.filter(w =>
    w.length > 5 && !["online", "your", "free", "with", "that", "this", "browser"].includes(w)
  );
  if (keyNouns.length > 2) {
    phrases.push(`best ${keyNouns.slice(0, 2).join(" ")} ${words[0]}`);
  }

  return { howToUse, whyUse, howToUseAlt, relatedPhrases: [...new Set(phrases)] };
}

// ── Template pools ──────────────────────────────────────────────────

function getHowToTemplates(cat: string, v: number): string {
  const templates: Record<string, string[]> = {
    Developer: [
      `Using the tool is simple: open {name} on this page and paste your input into the editor. The tool processes everything locally — nothing leaves your browser. Adjust settings as needed and copy the result.`,
      `To get started with {name}, enter or paste your source data in the input area. All processing happens client-side using modern browser APIs, so your data never reaches a server. Results appear instantly.`,
      `Open {name} and paste your code or data into the input field. The {desc} Works entirely in your browser — no uploads, no signups, just instant results you can copy with one click.`,
      `Start by pasting your content into {name}. The tool analyzes and transforms your input right in your browser using Web APIs — zero server round-trips. Tweak options and grab the output.`,
      `{name} runs completely in your browser. Paste or type your input, choose your options, and see the formatted result update in real time. Your data never leaves your device — it's that private.`,
    ],
    Text: [
      `Using {name} takes seconds: paste or type your text into the input area. The tool works instantly in your browser with no server uploads. Copy the cleaned or transformed result when you are done.`,
      `To use {name}, enter your text in the field on this page. All processing runs client-side — your text never leaves your machine. Results update in real time as you type.`,
      `Paste your content into {name} and let the tool work its magic. Every operation happens locally in your browser, so your text stays private. Copy the result with one click.`,
      `{name} processes your text entirely in your browser. Just paste your content, review the results, and copy. No data is uploaded, no account is needed.`,
      `Getting started with {name} is straightforward: paste your text and the tool instantly processes it. All logic runs in your browser, keeping your content completely private. No hidden server calls.`,
    ],
    Conversion: [
      `To use {name}, paste your source content in the input area and select your target format. The conversion happens instantly in your browser — nothing is uploaded. Copy the result when ready.`,
      `{name} converts your data right in your browser. Enter or paste your input, choose the output format, and get instant results. No file uploads, no server processing, complete privacy.`,
      `Start by pasting your source material into {name}. The tool handles the conversion locally using browser-based algorithms, so your data never hits a network. Results appear immediately.`,
      `Using {name} is easy: provide your source content and the tool converts it on the spot. Everything runs client-side for speed and privacy. Copy the output and carry on.`,
      `Open {name}, paste your input, and the conversion happens in real time — all in your browser. Your data stays on your device from paste to copy. No middleman servers.`,
    ],
    SEO: [
      `{name} helps you optimize your site directly in the browser. Paste your URL or data in the input field and get instant analysis. No data is sent to external services — everything stays local.`,
      `To use {name}, enter your URL or paste the relevant content. The tool runs entirely in your browser, giving you private, instant SEO insights without exposing your data to third parties.`,
      `Run {name} right here in your browser. Enter your site URL or paste your content, and the tool analyzes it locally. Your SEO data stays yours — no server uploads, no third-party sharing.`,
      `{name} works entirely on your device. Provide your URL or content, and the tool processes it in-browser for instant, private analysis. No signup, no data leaving your machine.`,
      `Using {name} is private by design: paste or enter your data and get real-time SEO analysis without any server communication. Everything runs locally for speed and security.`,
    ],
    Color: [
      `{name} works instantly in your browser. Enter a color value in any format — HEX, RGB, HSL, or a named color — and see the equivalent values across all formats immediately.`,
      `To use {name}, pick or paste a color. The tool converts and displays it in every common format in real time. All processing happens client-side — no server needed.`,
      `Using {name} is as simple as entering a color value. The tool instantly shows you the HEX, RGB, HSL, and named equivalents — all converted right in your browser.`,
      `Open {name}, enter any color value, and get instant format conversions. The tool runs in your browser, so you can experiment freely without worrying about data leaving your machine.`,
      `{name} lets you explore colors without leaving your browser. Type or pick a color and see all format representations update live. Completely private, completely client-side.`,
    ],
    Image: [
      `To use {name}, upload an image from your device or paste one from your clipboard. All image processing happens locally in your browser using Canvas APIs — nothing is uploaded.`,
      `{name} processes images entirely in your browser. Select a file using the picker or drag and drop. The tool uses Web APIs for all transformations — your images never reach a server.`,
      `Using {name} is private: upload your image and the tool processes it locally. No file is sent to any server. Download the result when you are happy with the output.`,
      `Start by choosing an image in {name}. The tool uses browser-based APIs to process your image instantly. All operations happen offline in your browser — zero uploads.`,
      `{name} handles your images right in your browser. Pick a file, adjust the settings, and see previews update in real time. Your images never leave your device — complete privacy.`,
    ],
    "AI Tools": [
      `{name} runs AI processing directly in your browser. Paste your input or upload your file, and the tool processes it locally using in-browser models. Your data never leaves your device.`,
      `Using {name} is simple: provide your input and let the AI model process it in your browser. No API keys, no server round-trips, no data uploaded — just private, instant results.`,
      `To use {name}, enter your prompt or data in the input area. The AI model runs client-side, so your information stays private. Results appear without any network calls.`,
      `{name} brings AI to your browser. No signup, no API keys — just paste your input and get results processed locally on your machine. Your data never reaches an external server.`,
      `Open {name} and paste your content. The tool uses browser-based AI to process everything locally. Private, instant, and free — no server-side processing at all.`,
    ],
    Utility: [
      `Using {name} is quick: fill in the fields on this page and the tool does the rest. Everything runs client-side, so your data stays private. Copy or download the result when ready.`,
      `{name} processes your input entirely in your browser. Enter the required information, adjust any options, and get your result instantly. No server uploads.`,
      `To use {name}, enter your data in the form below. The tool handles the logic locally and returns results immediately. Private, fast, and no account required.`,
    ],
    "Image Tools": [
      `{name} works entirely in your browser. Upload your image, apply adjustments, and see the preview update in real time. No images are uploaded to any server.`,
      `Using {name} is straightforward: select an image from your device and the tool processes it locally. All transformations use in-browser APIs for instant results with complete privacy.`,
      `Open {name} and pick an image. The tool applies edits and transformations right in your browser — your files never leave your device. Download the result when satisfied.`,
    ],
    "Video Tools": [
      `{name} processes video content in your browser. Upload your file and apply edits or transformations locally. Your videos never reach a server — everything stays on your device.`,
      `Using {name}, upload a video file and the tool handles processing in-browser. All operations use Web APIs for private, local video handling.`,
      `To use {name}, select a video file from your device. The tool processes it entirely in your browser — no uploads, no server processing. Download the result when ready.`,
    ],
    "PDF Tools": [
      `{name} works on PDFs entirely in your browser. Upload your PDF and the tool processes it locally using in-browser APIs. Your documents never leave your device.`,
      `Using {name} keeps your documents private: upload your PDF and the tool handles everything client-side. No server uploads, no data leaks. Download the processed result.`,
      `To use {name}, pick a PDF from your device. The tool processes it in your browser using Web APIs. Your document data stays completely local.`,
    ],
    Network: [
      `{name} runs network diagnostics from your browser. Enter the target URL or address and the tool performs checks locally. Your requests are handled entirely client-side.`,
      `Using {name}, enter the network details you want to check. The tool runs diagnostics in your browser and returns results instantly. No server-side processing.`,
      `To use {name}, provide the target information below. The tool handles the analysis in your browser for instant, private results.`,
    ],
    CSS: [
      `{name} generates CSS right in your browser. Adjust the controls to see your styles update in real time, then copy the generated CSS with one click. No server round-trips.`,
      `Using {name} is visual and instant: tweak the settings and preview the CSS output live. Everything runs client-side — no uploads, no waiting.`,
      `Open {name} and adjust the controls to build your CSS. The preview updates instantly, and you can copy the output with one click. All processing is local.`,
    ],
    Math: [
      `{name} performs calculations directly in your browser. Enter your numbers or expressions and get instant results. No data is sent to any server.`,
      `Using {name}, input your values and the tool computes results locally. Everything runs client-side for instant, private calculations.`,
      `To use {name}, enter the values you need to compute. The tool processes everything in your browser and returns results immediately.`,
    ],
  };

  // Fallback for uncategorized
  const pool = templates[cat] ?? templates.Developer;
  return pool[v % pool.length];
}

function getWhyTemplates(cat: string, v: number): string {
  const templates: Record<string, string[]> = {
    Developer: [
      `{name} saves you from installing desktop software or juggling multiple online tools. It runs entirely in your browser, so you get instant results with zero setup. No signup, no ads, no data leaving your machine.`,
      `Instead of opening a code editor or installing a CLI tool, use {name} right in your browser. It handles the task locally, giving you fast, private results without context switching.`,
      `{name} eliminates the friction of finding, installing, and learning a dedicated tool. Just open this page, paste your input, and get the output — all in your browser with no server uploads.`,
      `With {name}, you get a focused tool that does exactly what you need — no bloat, no signups, no ads. Everything runs client-side, so your data stays private and results are instant.`,
      `{name} is built for developers who value speed and privacy. The tool processes everything in your browser, removing the need for API calls, file uploads, or third-party services.`,
    ],
    Text: [
      `{name} gives you a fast, private way to work with text. Since everything runs client-side, you get instant results without waiting for network round-trips. Your text stays on your device.`,
      `Skip the word processor or web search — {name} handles text tasks right in your browser. No uploads, no signups, just private, instant text processing.`,
      `{name} processes your text locally for maximum speed and privacy. Paste your content, get results instantly, and move on — no server needed, no data trail left behind.`,
      `You do not need to install anything or create an account to use {name}. It runs in your browser and processes your text entirely on your device for instant, private results.`,
      `{name} is the quickest way to process text without compromising privacy. Everything runs in your browser — your content never touches a server.`,
    ],
    Conversion: [
      `{name} converts your data instantly in your browser. No file size limits, no upload queues, no privacy concerns — your source data stays on your device the entire time.`,
      `With {name}, you avoid the typical conversion hassles: upload limits, queue times, and data privacy worries. Everything runs locally in your browser for instant, secure results.`,
      `{name} handles conversions directly on your machine. Your data never leaves your browser, so you can convert even sensitive files without worry. No server, no trace.`,
      `Skip the third-party conversion sites that upload your data. {name} does everything in your browser — faster, private, and with no file size restrictions.`,
      `{name} is the privacy-first way to convert data. All processing happens client-side, so your source material never reaches an external server. Instant results, zero uploads.`,
    ],
    SEO: [
      `{name} gives you actionable SEO insights without exposing your site data to third-party services. Everything runs locally in your browser for private, instant analysis.`,
      `Unlike SEO tools that upload your data to external servers, {name} runs entirely in your browser. Your site URLs and content stay private while you get the insights you need.`,
      `{name} provides fast, private SEO analysis right where you are. No signup, no data sharing — just paste, analyze, and act. All processing is local.`,
      `You do not need to grant access to your site or share data with unknown services. {name} runs in your browser and checks everything client-side for complete privacy.`,
      `{name} is built for privacy-conscious site owners. Get SEO insights without uploading your data to third parties — everything processes locally in your browser.`,
    ],
    Color: [
      `{name} works instantly in your browser without installing design software. Enter any color and see conversions, palettes, and values update in real time — all locally.`,
      `Instead of switching between color pickers and converters, use {name} on one page. It handles format conversion, palette generation, and more — all in your browser.`,
      `{name} eliminates the need for expensive design tools when you just need color values. Everything runs client-side, giving you instant results with zero setup.`,
      `With {name}, you get a complete color toolkit in your browser. Pick, convert, and generate palettes without uploading anything or installing software.`,
      `{name} is the fastest way to work with colors online. No software installs, no account creation — just enter a color and get everything you need, processed locally.`,
    ],
    Image: [
      `{name} processes images entirely in your browser using modern Canvas APIs. This means faster results, no file size limits, and complete privacy — your images never leave your device.`,
      `Upload your images to {name} with confidence — all processing happens locally. No server ever sees your files. You get instant results and complete control.`,
      `With {name}, you skip the usual image editing hassles: wait times, upload limits, and privacy concerns. Everything runs in your browser for instant, private processing.`,
      `{name} gives you professional image processing right in your browser. No software to install, no files uploaded — just pick an image and the tool handles it locally.`,
      `Unlike most image tools, {name} processes everything client-side. Your images stay on your device, results are instant, and there are no arbitrary limits on file size.`,
    ],
    "AI Tools": [
      `{name} makes AI accessible right in your browser. No API keys, no cloud credits, no setup — just paste your input and get results processed locally on your machine.`,
      `With {name}, you get AI-powered processing without the usual privacy trade-offs. Everything runs in your browser, so your data never reaches an external server.`,
      `{name} brings AI to your fingertips without any infrastructure. No accounts, no API keys, no cloud dependencies — just private, instant processing in your browser.`,
      `Skip the complex AI tooling. {name} runs in your browser with zero configuration — paste your input and get results processed locally on your device.`,
      `{name} is the private, instant way to use AI. No data leaves your browser, no accounts are needed, and results appear as fast as your machine can process them.`,
    ],
    Utility: [
      `{name} handles the task quickly and privately in your browser. No software to install, no accounts to create — just fill in the fields and get your result.`,
      `{name} is a focused utility that does one thing well — all in your browser. Your data stays private, results are instant, and there is no clutter.`,
      `With {name}, you get a straightforward tool that works offline in your browser. No signups, no uploads, no distractions — just the utility you need.`,
    ],
    "Image Tools": [
      `{name} gives you image editing capabilities right in your browser. All processing uses in-browser APIs, so your images stay private and results are instant.`,
      `With {name}, your images never leave your device. Upload, edit, and download — everything happens locally in your browser for complete privacy.`,
      `Skip desktop image editors for quick tasks. {name} runs in your browser with no installation needed and processes everything on your machine.`,
    ],
    "Video Tools": [
      `{name} processes video content locally in your browser. Your files never reach a server, so even large or sensitive videos stay private.`,
      `With {name}, video editing happens on your machine. No uploads, no server processing, no waiting in queues — just local, private handling.`,
      `{name} brings video processing to your browser without privacy compromises. All operations run client-side — your videos stay on your device.`,
    ],
    "PDF Tools": [
      `{name} keeps your documents private by processing them entirely in your browser. No PDF is ever uploaded to a server.`,
      `With {name}, you handle PDFs securely — all processing happens client-side. Your documents stay on your device, and results are instant.`,
      `{name} gives you PDF processing without the privacy risks of online upload tools. Everything runs in your browser, so your documents never leave your machine.`,
    ],
    Network: [
      `{name} performs network checks directly from your browser. No need to SSH into a server or install CLI tools — just enter the target and get results instantly.`,
      `With {name}, you get network diagnostics without leaving your browser. All checks run client-side for quick, private results.`,
      `{name} eliminates the need for command-line network tools. Run diagnostics right in your browser with instant, easy-to-read results.`,
    ],
    CSS: [
      `{name} generates production-ready CSS without the trial-and-error of manual coding. Adjust settings visually and copy clean CSS — all in your browser.`,
      `With {name}, you can experiment with CSS values in real time and see the results immediately. No need to edit files and refresh — everything updates live.`,
      `{name} helps you write better CSS faster. Tweak visual controls, preview changes instantly, and copy the generated code — all without leaving your browser.`,
    ],
    Math: [
      `{name} performs calculations instantly in your browser. No need for a calculator app or spreadsheet — just enter your values and get results.`,
      `With {name}, mathematical operations are a click away. Everything runs client-side for instant results with no network dependency.`,
      `{name} is the quickest way to perform calculations online. No downloads, no signups — just enter your numbers and get the answer.`,
    ],
  };

  const pool = templates[cat] ?? templates.Developer;
  return pool[v % pool.length];
}
