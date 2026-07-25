import type { Tool } from "@/data/tools";

/**
 * Generate unique, meaningful content for each tool page.
 * Uses multiple template variations per category, seeded by tool name/description,
 * so each page gets genuinely different server-rendered content.
 */
export function generateToolContent(tool: Tool): {
  howToUse: string;
  whyUse: string;
  whenToUse: string;
  benefits: string;
  commonUseCases: string;
  relatedPhrases: string[];
} {
  const { name, description, category } = tool;

  // Deterministic seed from tool name for variant selection
  const seed = name.length + description.length + name.charCodeAt(0);
  const variant = seed % 10; // 0-9, gives us 10 variants per category

  // ── How-to-use templates (10 variants per category) ──────────────
  const howToUse = getHowToTemplates(category, variant)
    .replace(/\{name\}/g, name)
    .replace(/\{desc\}/g, description);

  // ── Why-use templates ─────────────────────────────────────────────
  const whyUse = getWhyTemplates(category, variant)
    .replace(/\{name\}/g, name)
    .replace(/\{desc\}/g, description);

  // ── When-to-use templates (unique pool, 10 variants) ──────────────
  const whenToUse = getWhenToTemplates(category, variant)
    .replace(/\{name\}/g, name)
    .replace(/\{desc\}/g, description);

  // ── Benefits templates (5 variants) ───────────────────────────────
  const benefits = getBenefitsTemplates(category, variant % 5)
    .replace(/\{name\}/g, name)
    .replace(/\{desc\}/g, description);

  // ── Use cases templates (5 variants) ──────────────────────────────
  const commonUseCases = getUseCasesTemplates(category, variant % 5)
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

  return { howToUse, whyUse, whenToUse, benefits, commonUseCases, relatedPhrases: [...new Set(phrases)] };
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
      `When you open {name}, the first thing you will see is a clean input area ready for your code or data. Paste or type your content, and the tool formats, validates, or transforms it using the browser's native APIs — no uploads, no waiting, no configuration screens to dismiss before you can start working. The output area updates the moment it detects a change.`,
      `Using {name} requires no onboarding. Navigate to the page, paste your source material — whether that is a JSON payload from an API response, a Base64 string from a log file, or a chunk of minified JavaScript — and the result appears in real time. Tabs, buttons, and toggles are labelled clearly so you never have to hunt for a feature.`,
      `{name} streamlines what would otherwise be a multi-tool workflow. Instead of copying data into a linter, then a formatter, then a validator, you paste once and the tool handles all three. The output section includes a prominent copy button that respects your chosen format, and keyboard-focused developers will appreciate that Enter or Tab often advances the workflow.`,
      `Getting started with {name} is as simple as pasting your source data into the text area on the left. The tool immediately begins processing — formatting indentation, highlighting syntax, or decoding encoded strings — and displays the result in the panel on the right. Controls for switching between modes (format, minify, validate) sit directly above the input for easy access.`,
      `Open {name} in any modern browser and you are ready to go. The interface is intentionally minimal: an input panel for your source data, controls to choose what transformation you want, and an output panel that updates live. Every option — indentation width, case preference, encoding type — is exposed as a visible toggle rather than buried in a settings menu.`,
],
    Text: [
      `Using {name} takes seconds: paste or type your text into the input area. The tool works instantly in your browser with no server uploads. Copy the cleaned or transformed result when you are done.`,
      `To use {name}, enter your text in the field on this page. All processing runs client-side — your text never leaves your machine. Results update in real time as you type.`,
      `Paste your content into {name} and let the tool work its magic. Every operation happens locally in your browser, so your text stays private. Copy the result with one click.`,
      `{name} processes your text entirely in your browser. Just paste your content, review the results, and copy. No data is uploaded, no account is needed.`,
      `Getting started with {name} is straightforward: paste your text and the tool instantly processes it. All logic runs in your browser, keeping your content completely private. No hidden server calls.`,
      `Using {name} is straightforward: paste your text into the editor on this page, and the tool processes it instantly using client-side logic. Whether you need word counts, case conversion, line deduplication, or whitespace normalisation, the results appear as you type without any page reload or server round-trip.`,
      `{name} is designed for anyone who works with text — writers, editors, students, translators. Paste your content, select the operation you need from the controls above the input area, and the transformed text appears on the right. You can copy it with one click, tweak the input, or undo the operation and try a different mode.`,
      `To use {name}, type or paste your content into the input field. The tool works entirely in your browser, so long documents process just as quickly as short snippets. Most operations have additional options — case sensitivity, character exclusions, output format — shown as toggles or dropdowns below the input area.`,
      `{name} handles text tasks in real time. Open the page, paste your source text, and the tool applies the selected transformation immediately. The clean, ad-free interface means no distractions while you work, and the one-click copy button gets the result into your clipboard for pasting into documents, emails, or CMS fields.`,
      `Working with {name} is a three-step process: paste your text, choose what you want to do (count, convert, clean, or transform), and copy the result. The tool processes everything locally, so there is no perceptible lag even with multi-page documents, and nothing you paste is logged or stored.`,
],
    Conversion: [
      `To use {name}, paste your source content in the input area and select your target format. The conversion happens instantly in your browser — nothing is uploaded. Copy the result when ready.`,
      `{name} converts your data right in your browser. Enter or paste your input, choose the output format, and get instant results. No file uploads, no server processing, complete privacy.`,
      `Start by pasting your source material into {name}. The tool handles the conversion locally using browser-based algorithms, so your data never hits a network. Results appear immediately.`,
      `Using {name} is easy: provide your source content and the tool converts it on the spot. Everything runs client-side for speed and privacy. Copy the output and carry on.`,
      `Open {name}, paste your input, and the conversion happens in real time — all in your browser. Your data stays on your device from paste to copy. No middleman servers.`,
      `Using {name} for conversions is simple: paste your source data in the input area, select the target format from the available options, and the converted result appears instantly. The tool preserves data fidelity — no silent truncation or encoding loss — and flags any format incompatibilities so you can adjust the input and try again.`,
      `{name} converts data between common formats without uploading anything to a server. Open the page, paste your source, and pick the output format. The conversion happens in your browser using lightweight parsing libraries, so even large files process quickly. Copy the result or swap directions for round-trip conversion.`,
      `To get started with {name}, paste your source content into the input area and select the format you want to convert to. The tool immediately processes the conversion client-side and displays the result. A convenient swap button lets you reverse the conversion direction if you need to go back the other way.`,
      `{name} makes data conversion a single-step operation. Navigate to the page, paste your input, and the tool detects the source format and offers compatible target formats. Choose one, and the converted output appears in real time — no file uploads, no account creation, no waiting for server-side processing.`,
      `Open {name} and paste the data you want to convert. The tool recognises common input formats and shows you the available output options. Select your target, and the browser handles the conversion locally. A side-by-side view lets you compare the source and result before copying the output.`,
],
    SEO: [
      `{name} helps you optimize your site directly in the browser. Paste your URL or data in the input field and get instant analysis. No data is sent to external services — everything stays local.`,
      `To use {name}, enter your URL or paste the relevant content. The tool runs entirely in your browser, giving you private, instant SEO insights without exposing your data to third parties.`,
      `Run {name} right here in your browser. Enter your site URL or paste your content, and the tool analyzes it locally. Your SEO data stays yours — no server uploads, no third-party sharing.`,
      `{name} works entirely on your device. Provide your URL or content, and the tool processes it in-browser for instant, private analysis. No signup, no data leaving your machine.`,
      `Using {name} is private by design: paste or enter your data and get real-time SEO analysis without any server communication. Everything runs locally for speed and security.`,
      `Using {name} is simple: paste your URL or content into the input field, and the tool immediately analyses it for SEO-relevant factors. Results are displayed in a structured format — title tag status, meta description length, heading hierarchy, and other on-page elements — so you can quickly identify what needs attention.`,
      `{name} gives you SEO insights without sending your data to third parties. Open the page, enter the URL or paste the HTML content you want to analyse, and the tool examines it client-side. The results are organised by category — meta tags, content structure, technical elements — making it easy to prioritise fixes.`,
      `To use {name}, paste your page URL or raw HTML into the input area. The tool parses the content in your browser and displays a structured report of on-page SEO factors. Each section has clear pass/fail indicators so you can spot issues at a glance, and the report updates if you change the input.`,
      `{name} runs entirely in your browser, so your SEO data never reaches a server. Paste a URL or snippet, and the tool analyses title tags, meta descriptions, headers, and structured data. The clean report view groups findings by priority, helping you address the most impactful issues first.`,
      `Getting started with {name}: open the page, enter a URL or paste your markup, and the tool processes everything locally. You will see an instant breakdown of on-page SEO factors — titles, descriptions, headings, canonical tags — with actionable feedback for each element that needs improvement.`,
],
    Color: [
      `{name} works instantly in your browser. Enter a color value in any format — HEX, RGB, HSL, or a named color — and see the equivalent values across all formats immediately.`,
      `To use {name}, pick or paste a color. The tool converts and displays it in every common format in real time. All processing happens client-side — no server needed.`,
      `Using {name} is as simple as entering a color value. The tool instantly shows you the HEX, RGB, HSL, and named equivalents — all converted right in your browser.`,
      `Open {name}, enter any color value, and get instant format conversions. The tool runs in your browser, so you can experiment freely without worrying about data leaving your machine.`,
      `{name} lets you explore colors without leaving your browser. Type or pick a color and see all format representations update live. Completely private, completely client-side.`,
      `{name} is designed for quick colour lookups and conversions. Enter a colour value in any format — HEX with or without the hash, RGB functional notation, HSL, or a named CSS colour — and all equivalent formats appear simultaneously. The tool also displays a preview swatch and WCAG contrast information for the selected colour.`,
      `Using {name}: type or paste a colour value, and the tool immediately converts it to every common CSS format. The visual preview shows you the actual colour, while the contrast section tells you how readable text of various sizes would be against a white or black background. Pick a colour visually using the native colour picker, or type values directly.`,
      `{name} eliminates the need to memorise colour format conversions. Open the page, enter any colour (HEX, RGB, HSL, or named), and the tool shows you all representations at once. The live preview swatch confirms you have the right colour, and the contrast checker helps you make accessibility-informed decisions before you commit the value to your stylesheet.`,
      `To use {name}, simply type, paste, or pick a colour. The input accepts HEX (with or without #), RGB, HSL, and standard CSS named colours. Results update in real time — you see the colour preview, all format equivalents, and the contrast ratio against common backgrounds side by side. Each value has its own copy button.`,
      `{name} works the moment the page loads. Enter a colour value in any CSS-recognised format, and the tool instantly displays the colour visually, its equivalent values in other formats, and accessibility contrast information. The colour picker button opens your system's native picker for visual selection.`,
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
      `Using {name} is as simple as typing or pasting your input into the text area. The AI processes your text locally in your browser using on-device models — no data is sent to any server. Results appear in the output panel, where you can copy them, refine your input, or adjust the AI parameters.`,
      `{name} brings AI capabilities directly to your browser. Open the page, enter your prompt or content, and the model processes everything on your machine. Choose from available modes — summarise, rewrite, expand, or classify — and the output updates in the panel below. Everything stays local.`,
      `Getting started with {name}: paste or type your source text, select the AI operation you want, and the model processes it in your browser. No API keys, no cloud credits, no setup — just a text area and an output panel. The result appears within seconds, depending on your device.`,
      `{name} runs on-device AI models directly in your browser. Enter your input, pick the task type, and the model processes everything locally. The interface is minimal — an input field, task selector, and output area — so you can focus on content rather than navigating complex settings.`,
      `To use {name}, navigate to the page and type or paste your content. The browser-based AI model processes your input locally, and the result appears in the output panel. The tool supports multiple modes — summarisation, paraphrasing, tone adjustment — all accessible from a simple dropdown.`,
],
    Utility: [
      `Using {name} is quick: fill in the fields on this page and the tool does the rest. Everything runs client-side, so your data stays private. Copy or download the result when ready.`,
      `{name} processes your input entirely in your browser. Enter the required information, adjust any options, and get your result instantly. No server uploads.`,
      `To use {name}, enter your data in the form below. The tool handles the logic locally and returns results immediately. Private, fast, and no account required.`,
      `{name} works instantly in your browser. Fill in the input fields on this page, and the tool processes your data using client-side logic. Results update immediately, and the clean interface means you can focus on the task rather than navigating complex menus or dismissing pop-ups.`,
      `Open {name} and enter the information requested in the form fields. The tool handles the processing entirely in your browser, so your data stays private and results appear without any network delay. Copy or download the output using the button at the bottom of the result area.`,
      `Using {name} is a matter of providing your input and reading the result. The page loads with a clear form or input area, and the tool processes everything locally. No signup forms, no data collection notices, no rate-limiting warnings — just a straightforward utility that does its job and gets out of your way.`,
      `To use {name}, enter your values into the fields on this page. The tool uses client-side logic to compute the result instantly, and you can copy it with a single click. Everything runs in your browser, so you can work offline after the initial page load and your data never reaches a server.`,
      `{name} is ready the moment you open the page. Enter your input, and the result appears in real time. The interface is designed for speed — the input area is prominent, the controls are minimal, and the copy button is always within reach. No account, no ads, no tracking scripts.`,
      `Start by opening {name} and entering your data in the provided fields. The tool processes everything client-side using the browser's built-in capabilities, and the result appears instantly. Use the copy button to grab the output, or adjust your inputs and try again — there are no usage limits.`,
      `{name} puts functionality first: open the page, fill in the fields, and get your result. The tool does not collect data, show ads, or prompt you to create an account. Everything runs in your browser for speed and privacy, and the result is formatted and ready to copy.`,
],
    "Image Tools": [
      `{name} works entirely in your browser. Upload your image, apply adjustments, and see the preview update in real time. No images are uploaded to any server.`,
      `Using {name} is straightforward: select an image from your device and the tool processes it locally. All transformations use in-browser APIs for instant results with complete privacy.`,
      `Open {name} and pick an image. The tool applies edits and transformations right in your browser — your files never leave your device. Download the result when satisfied.`,
      `Using {name} is easy: click the upload area or drag and drop an image from your file system. The tool processes the image entirely in your browser using Canvas APIs — nothing is uploaded to any server. Adjustments and transformations happen in real time, and you can download the result when you are satisfied.`,
      `Open {name} and select an image from your device. The tool loads it into the browser's memory and displays a preview. Choose from the available operations — resize, crop, convert, compress — and see the changes reflected in the preview immediately. Download the processed image when ready.`,
      `{name} keeps your images private by processing them entirely in your browser. Upload an image using the file picker or drag-and-drop zone, then adjust the settings for the operation you need. The preview updates in real time, and the download button saves the result to your device with no server interaction.`,
      `Getting started with {name}: click the upload button or drop an image onto the page. The tool reads the file into your browser's memory and displays a preview. Select your desired operation from the available options, tweak any parameters, and download the processed image. Your files never leave your device.`,
      `{name} processes images locally on your machine. Use the file picker to select an image, then choose what you want to do — resize to specific dimensions, convert to a different format, compress for web use, or strip metadata. Each operation updates the preview in real time and the download produces the result with a single click.`,
      `To use {name}, drag an image onto the page or click the upload area to browse your files. The tool loads the image into your browser and immediately shows a preview. The available operations are shown as clearly labelled buttons or sliders, each with real-time feedback. No uploads, no queues, no limits.`,
      `{name} is a browser-based image tool that respects your privacy. Pick an image from your device, apply the transformations you need — resizing, format conversion, compression, or metadata removal — and download the result. Every operation runs client-side using the Canvas API, so your original files never leave your machine.`,
],
    "Video Tools": [
      `{name} processes video content in your browser. Upload your file and apply edits or transformations locally. Your videos never reach a server — everything stays on your device.`,
      `Using {name}, upload a video file and the tool handles processing in-browser. All operations use Web APIs for private, local video handling.`,
      `To use {name}, select a video file from your device. The tool processes it entirely in your browser — no uploads, no server processing. Download the result when ready.`,
      `Using {name} requires no video editing experience. Upload your video file using the picker, select the operation — trim, compress, or convert to GIF — and adjust any settings. The tool processes your video locally using WebAssembly, so your files stay on your device. Download the result when processing completes.`,
      `Open {name} and select a video file from your device. The tool loads it into browser memory and displays basic information. Choose the operation you need — trimming a segment, compressing for sharing, or converting a clip to GIF — and let the tool handle the processing locally.`,
      `{name} brings video processing to your browser without privacy compromises. Upload a video, choose your operation, and the tool handles everything client-side using WebAssembly. Trimming, format conversion, and compression are supported, and results are ready to download as soon as processing finishes.`,
      `To use {name}, upload your video file using the file picker. The tool supports common formats and processes everything locally. Trim your clip by setting start and end points, choose output settings, and the browser handles the rest. Download the result when it is ready — no server ever sees your file.`,
      `{name} processes videos entirely in your browser. Select a file, choose the operation (trim, compress, or export as GIF), and the tool handles conversion client-side. Your original videos are never uploaded anywhere, and the processed result is delivered as a direct download from your browser.`,
      `Getting started with {name}: pick a video file from your device and select the output you want. The tool uses browser-based processing to trim, compress, or convert your video without sending it to any server. Progress is shown in real time, and the download starts automatically when processing finishes.`,
      `{name} lets you edit videos without uploading them. Choose a file, apply the transformation — trimming unwanted sections, compressing for email attachments, or extracting a GIF — and the browser processes it locally. No account, no upload queue, no privacy concerns.`,
],
    "PDF Tools": [
      `{name} works on PDFs entirely in your browser. Upload your PDF and the tool processes it locally using in-browser APIs. Your documents never leave your device.`,
      `Using {name} keeps your documents private: upload your PDF and the tool handles everything client-side. No server uploads, no data leaks. Download the processed result.`,
      `To use {name}, pick a PDF from your device. The tool processes it in your browser using Web APIs. Your document data stays completely local.`,
      `Using {name} is straightforward: upload your PDF using the file picker, then select the operation you need — merge, split, rotate, or extract pages. The tool processes the document entirely in your browser using client-side PDF libraries. Your files never touch a server, and the result is ready for download immediately.`,
      `Open {name} and select a PDF from your device. The tool loads it into browser memory and shows a preview of the pages. Choose from available operations: merge multiple PDFs, split a document into separate files, rotate individual pages, or extract a range. Every operation is local and private.`,
      `{name} handles PDF operations without uploading. Upload your document, pick what you want to do, and the tool processes everything in your browser. Merging, splitting, rotating, and extracting pages are all supported. The output preserves the original quality, and you download the result directly.`,
      `To use {name}, drag your PDF onto the page or click to browse. The tool reads it into browser memory and displays thumbnails of each page. Click the operation you need — merge another file, split into sections, rotate a page, or extract a range. All processing is done locally.`,
      `{name} is a privacy-first PDF tool. Upload your document using the file picker, select your operation, and the tool processes everything client-side. Your PDFs — even those containing sensitive information like contracts or invoices — never leave your device. Download the result when processing completes.`,
      `Getting started with {name}: pick a PDF file and select what you want to do. The tool uses client-side libraries to process the document entirely in your browser. Available operations include merging multiple PDFs, splitting a document, rotating pages, and extracting specific page ranges. No uploads required.`,
      `{name} gives you essential PDF operations without the privacy risks of cloud-based tools. Upload a document, choose your operation (merge, split, rotate, extract), and the browser handles it locally. Your files are never uploaded to a server, and you download the processed result directly.`,
],
    Network: [
      `{name} runs network diagnostics from your browser. Enter the target URL or address and the tool performs checks locally. Your requests are handled entirely client-side.`,
      `Using {name}, enter the network details you want to check. The tool runs diagnostics in your browser and returns results instantly. No server-side processing.`,
      `To use {name}, provide the target information below. The tool handles the analysis in your browser for instant, private results.`,
      `{name} runs network diagnostics from your browser. Enter the target URL or hostname, and the tool performs the requested checks — DNS resolution, HTTP headers, redirect chain tracing — using the browser's networking APIs. Results appear instantly, and your targets are not logged or shared.`,
      `Open {name} and enter the URL or IP address you want to investigate. The tool runs diagnostics locally and displays structured results — response status codes, headers, DNS records, redirect chain details. Each section is collapsible so you can focus on the information you need.`,
      `Using {name}: paste a URL into the input field and choose the type of check you want to run. The tool performs the analysis using browser APIs and presents the results in an organised format. No need for SSH access, third-party services, or command-line networking tools.`,
      `{name} provides network diagnostics without exposing your IP or data to third-party services. Enter a URL, select the checks you need (status, headers, DNS, redirects), and the tool executes them using your browser. Results are displayed in a structured, easy-to-read format.`,
      `To use {name}, simply enter a URL and pick what you want to check. The tool runs diagnostics from your browser and returns structured information about the target's HTTP headers, DNS records, redirect chain, and response status. All checks are performed client-side.`,
      `{name} turns your browser into a network diagnostics tool. Enter a URL, select the checks you need, and the tool performs them locally. Results include response status, headers, DNS information, and redirect chain details. Clean output makes it easy to identify issues at a glance.`,
      `Getting started with {name}: paste or type the URL you want to check, then choose from available diagnostics. The tool runs everything in your browser using built-in APIs and presents results in a clear, structured format. No external services involved, no data shared.`,
],
    CSS: [
      `{name} generates CSS right in your browser. Adjust the controls to see your styles update in real time, then copy the generated CSS with one click. No server round-trips.`,
      `Using {name} is visual and instant: tweak the settings and preview the CSS output live. Everything runs client-side — no uploads, no waiting.`,
      `Open {name} and adjust the controls to build your CSS. The preview updates instantly, and you can copy the output with one click. All processing is local.`,
      `Using {name} is visual and intuitive: adjust the on-screen controls — sliders, colour pickers, dropdowns — and the CSS preview updates in real time. Once you have the style you want, click the copy button to grab the generated code. Everything runs in your browser with no server interaction.`,
      `Open {name} and start tweaking the controls. Each adjustment updates the preview panel instantly, so you can see exactly how your CSS changes affect the visual output. When you are satisfied, copy the generated code with one click — formatted and ready to paste into your stylesheet.`,
      `{name} lets you experiment with CSS properties visually. Adjust colours, sizes, shadows, and spacing using the on-screen controls, and watch the preview update in real time. No more edit-refresh cycles in your dev tools — tweak until it looks right, then copy the finished CSS.`,
      `To use {name}, interact with the visual controls on the page. Each slider, colour picker, or dropdown corresponds to a CSS property, and the preview reflects every change immediately. When the result matches your design intent, click the copy button to grab the generated styles.`,
      `{name} generates CSS through visual experimentation. Turn knobs, slide controls, and pick colours — the preview responds instantly. The generated code is clean, formatted, and ready to paste into any project. All processing happens in your browser, so you can iterate freely.`,
      `Getting started with {name}: use the visual controls to set your desired CSS values. The tool shows a live preview of how the styles will look, and the code panel updates automatically. When you are happy with the result, copy the generated CSS with a single click and paste it into your project.`,
      `{name} eliminates the trial and error of CSS authoring. Use the visual controls to experiment with properties, and the preview updates in real time. Once you have the look you want, copy the generated code — it is production-ready and formatted for immediate use.`,
],
    Math: [
      `{name} performs calculations directly in your browser. Enter your numbers or expressions and get instant results. No data is sent to any server.`,
      `Using {name}, input your values and the tool computes results locally. Everything runs client-side for instant, private calculations.`,
      `To use {name}, enter the values you need to compute. The tool processes everything in your browser and returns results immediately.`,
      `Using {name} is straightforward: enter your numbers or expression in the input field, and the result appears instantly. The tool supports arithmetic, number base conversion, and random generation — all processed client-side. The clean interface has no ads or distractions.`,
      `Open {name} and enter the values you need to calculate. The tool processes everything in your browser and displays results in real time. Multiple modes let you switch between basic arithmetic, number base conversion (binary, octal, decimal, hex), and random number generation.`,
      `{name} performs calculations instantly in your browser. Type an expression or enter values in the converter fields, and the result updates as you type. The tool handles large integers via BigInt for precise arithmetic and supports common number base conversions.`,
      `To use {name}, type your calculation into the input area. The tool evaluates expressions client-side and shows the result immediately. Switch between modes — calculator, base converter, random generator — using the tabs above the result area. Everything runs locally.`,
      `{name} puts essential calculation tools in your browser. Type or paste an expression, and the result appears in real time. The tool handles basic arithmetic, base conversions between binary/octal/decimal/hex, and random number generation — all without sending data to a server.`,
      `Getting started with {name}: enter your numbers or expression in the input field. The tool processes everything client-side and displays the result instantly. Additional modes let you convert between number bases or generate random values for test fixtures. No network calls, no latency.`,
      `{name} is a no-fuss calculation tool for developers. Enter values in the input area, and the browser handles the processing locally. Use the mode selector to switch between a calculator, a number base converter, and a random value generator. Results are always instant.`,
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
      `{name} fits naturally into a developer's workflow because it removes the friction of installing, configuring, and switching between specialised tools. Instead of opening a terminal and running a CLI formatter, or finding an online tool that limits input size and uploads your data, you paste into {name} and get the result in the same browser tab where you are already reading documentation or reviewing a PR.`,
      `What makes {name} valuable is the combination of instant results and absolute privacy. Your code or data never leaves your browser — no upload progress bar, no "we store your data for 30 days" notice, no server-side logs. For developers working with API keys, debugging tokens, or proprietary code snippets, that privacy guarantee is the difference between using a tool and not using it.`,
      `{name} wins over alternatives because it requires zero setup. There is no CLI to install, no account to create, no API key to configure. You open the page and the tool is ready. For developers who work across multiple machines (laptop, workstation, cloud VM), having the same tool available in any browser without installing anything is a genuine productivity gain.`,
      `The main advantage of {name} is that it does not compromise between features and privacy. Many online tools either limit what you can do without a paid account or upload your data to their servers. {name} runs entirely client-side, gives you formatting, validation, and transformation in one page, and never asks for your email address or charges a subscription fee.`,
      `{name} saves developers time by consolidating multiple utilities into one page. Instead of remembering which CLI flag formats JSON vs minifies it, which website converts Base64 without logging your input, or which editor plugin validates YAML, you use one tool that handles all of it. The consistent interface means you never have to re-learn how to use it.`,
],
    Text: [
      `{name} gives you a fast, private way to work with text. Since everything runs client-side, you get instant results without waiting for network round-trips. Your text stays on your device.`,
      `Skip the word processor or web search — {name} handles text tasks right in your browser. No uploads, no signups, just private, instant text processing.`,
      `{name} processes your text locally for maximum speed and privacy. Paste your content, get results instantly, and move on — no server needed, no data trail left behind.`,
      `You do not need to install anything or create an account to use {name}. It runs in your browser and processes your text entirely on your device for instant, private results.`,
      `{name} is the quickest way to process text without compromising privacy. Everything runs in your browser — your content never touches a server.`,
      `{name} is the fastest way to process text without compromising privacy. Unlike word processors that sync to the cloud or online tools that may store your input, {name} runs entirely in your browser. Your text — whether it is a draft blog post, a client email, or a manuscript — never leaves your machine.`,
      `Choose {name} for text processing because it adapts to how you work. Need word counts? You get them instantly. Need case conversion? Toggle a mode. Need to strip duplicates from a long list? It is one click away. The tool grows with your needs without requiring you to install plugins or upgrade to a paid tier.`,
      `{name} eliminates the friction of switching between applications for basic text tasks. Instead of copying text into a word processor to count words, then into a different tool to change case, then into another to remove duplicates, you do everything in one page. The results are instant because nothing is uploaded to a server.`,
      `What sets {name} apart is its focus on the task without the overhead. No template library, no collaboration features you will never use, no AI assistant rewriting your sentences — just fast, reliable text processing that respects your privacy. The output is formatted exactly the way you need it.`,
      `{name} is built for people who work with text every day. Writers, editors, students, and developers all benefit from the instant feedback loop: paste, transform, copy. The tool does not track what you paste, does not show you ads, and does not require you to create an account. It simply processes text in your browser and presents the result.`,
],
    Conversion: [
      `{name} converts your data instantly in your browser. No file size limits, no upload queues, no privacy concerns — your source data stays on your device the entire time.`,
      `With {name}, you avoid the typical conversion hassles: upload limits, queue times, and data privacy worries. Everything runs locally in your browser for instant, secure results.`,
      `{name} handles conversions directly on your machine. Your data never leaves your browser, so you can convert even sensitive files without worry. No server, no trace.`,
      `Skip the third-party conversion sites that upload your data. {name} does everything in your browser — faster, private, and with no file size restrictions.`,
      `{name} is the privacy-first way to convert data. All processing happens client-side, so your source material never reaches an external server. Instant results, zero uploads.`,
      `{name} stands out from other conversion tools because it processes everything locally. Most online converters upload your data to their servers, which creates privacy risks and file size limits. {name} handles conversions of any size in your browser, keeping your source data on your device the entire time.`,
      `The biggest advantage of {name} is the combination of speed and security. Conversions are instant because no network round-trip is needed, and your data never touches a server. Whether you are converting configuration files, data exports, or formatted text, you get results without compromising on privacy.`,
      `{name} eliminates the overhead of finding, evaluating, and learning one-off conversion tools for different format pairs. Instead of bookmarking YAML→JSON on one site, XML→JSON on another, and CSV→JSON on a third, you use one tool that handles multiple conversions with a consistent interface and the same privacy guarantees.`,
      `Why use {name} over a dedicated conversion library? Because you do not always have your development environment available. On a borrowed machine, during a code review, or while pair-programming, opening a browser and pasting data into {name} is faster than installing dependencies and writing a conversion script.`,
      `{name} makes data conversion approachable for everyone, not just developers who can write a script. Team leads, QA engineers, technical writers, and project managers can convert data between formats without asking a developer for help or learning command-line tools. The browser-based interface eliminates the technical barrier.`,
],
    SEO: [
      `{name} gives you actionable SEO insights without exposing your site data to third-party services. Everything runs locally in your browser for private, instant analysis.`,
      `Unlike SEO tools that upload your data to external servers, {name} runs entirely in your browser. Your site URLs and content stay private while you get the insights you need.`,
      `{name} provides fast, private SEO analysis right where you are. No signup, no data sharing — just paste, analyze, and act. All processing is local.`,
      `You do not need to grant access to your site or share data with unknown services. {name} runs in your browser and checks everything client-side for complete privacy.`,
      `{name} is built for privacy-conscious site owners. Get SEO insights without uploading your data to third parties — everything processes locally in your browser.`,
      `{name} gives you SEO insights without exposing your site data to third-party platforms. Most SEO analysis tools require you to enter your URL into their system, which means they can track your queries, build profiles of your site, and potentially share your competitive research. {name} runs entirely in your browser, so your data stays private.`,
      `What makes {name} different from dedicated SEO platforms is the instant, focused analysis. You do not need to navigate a complex dashboard with dozens of metrics you do not need. Paste a URL, get the key on-page factors — title, description, headers, canonical, structured data — and act on the findings.`,
      `{name} is useful for site owners who want a quick SEO health check without committing to a paid subscription or granting API access to a third party. The tool gives you the information you need to catch issues — missing titles, duplicate descriptions, broken canonicals — before they impact your search performance.`,
      `Choose {name} for SEO checks because it respects your privacy and your time. No account creation, no email newsletter signup, no data collection. Paste your URL, analyse the results, fix the issues, and move on. The tool is designed for the "check and fix" workflow rather than endless reporting.`,
      `{name} is the right tool when you need a quick, private SEO audit without the overhead of a full SEO platform. Instead of waiting for a crawler to index your site or navigating a dashboard built for agencies, you get instant feedback on the fundamental on-page elements that influence how search engines understand your content.`,
],
    Color: [
      `{name} works instantly in your browser without installing design software. Enter any color and see conversions, palettes, and values update in real time — all locally.`,
      `Instead of switching between color pickers and converters, use {name} on one page. It handles format conversion, palette generation, and more — all in your browser.`,
      `{name} eliminates the need for expensive design tools when you just need color values. Everything runs client-side, giving you instant results with zero setup.`,
      `With {name}, you get a complete color toolkit in your browser. Pick, convert, and generate palettes without uploading anything or installing software.`,
      `{name} is the fastest way to work with colors online. No software installs, no account creation — just enter a color and get everything you need, processed locally.`,
      `{name} eliminates the need for multiple colour tools by combining format conversion, contrast checking, and palette exploration in one page. Instead of switching between a converter, an accessibility checker, and a colour picker, you get everything in one browser tab with consistent output formats and instant updates.`,
      `What makes {name} useful for daily design work is the real-time format conversion. Pick a colour visually using the native picker, type a HEX value from a design file, or paste an HSL value from a CSS variable — every format updates simultaneously so you can copy whichever representation your current project needs.`,
      `{name} is the fastest way to check whether a colour choice is accessible. The WCAG contrast indicator updates as you adjust the colour, showing you the pass/fail status against white and black backgrounds. This immediate feedback loop helps you catch low-contrast combinations before they reach your users.`,
      `Why keep a browser tab open for {name}? Because colour conversion is a constant, low-grade friction in frontend development. Every time you switch between a hex code from a design file and an HSL value for a Tailwind config, you save a context switch. Over dozens of colour operations per day, those seconds add up to genuine time savings.`,
      `{name} handles the colour tasks that come up most frequently — converting between CSS colour formats, checking contrast accessibility, and generating variations — without requiring you to install design software or navigate a feature-heavy colour tool. The minimal interface means you find the value you need and get back to work.`,
],
    Image: [
      `{name} processes images entirely in your browser using modern Canvas APIs. This means faster results, no file size limits, and complete privacy — your images never leave your device.`,
      `Upload your images to {name} with confidence — all processing happens locally. No server ever sees your files. You get instant results and complete control.`,
      `With {name}, you skip the usual image editing hassles: wait times, upload limits, and privacy concerns. Everything runs in your browser for instant, private processing.`,
      `{name} gives you professional image processing right in your browser. No software to install, no files uploaded — just pick an image and the tool handles it locally.`,
      `Unlike most image tools, {name} processes everything client-side. Your images stay on your device, results are instant, and there are no arbitrary limits on file size.`,
      `{name} processes images entirely in your browser, which means your files never reach a server. Most online image tools upload your originals to their infrastructure, creating privacy risks and download/upload delays. With {name}, you get instant previews and direct downloads from your browser's memory with no server interaction.`,
      `Choose {name} for image processing because there are no arbitrary limits. No maximum file size, no maximum resolution, no daily upload quota. Since everything runs locally on your device, the only constraint is your browser's available memory. This makes it suitable for high-resolution photography and large design exports that online tools typically reject.`,
      `{name} eliminates the need for heavyweight desktop image editors when you just need a quick transformation. Resizing an image for a profile picture, converting a screenshot to a web-friendly format, or stripping metadata before sharing — these are tasks that should take seconds, not minutes, and {name} delivers them in your browser.`,
      `The main benefit of {name} is the instant feedback loop. Adjust a resize slider and see the new dimensions previewed immediately. Toggle between output formats and see the estimated file size change. Because everything runs locally, there is no network latency between making an adjustment and seeing the result.`,
      `{name} gives you the confidence that your images are not being stored, analysed, or used by a third-party service. For photographers, designers, and developers working with client assets, this privacy guarantee is essential. The tool simply reads the file, processes it in your browser, and discards it when you close the tab.`,
],
    "AI Tools": [
      `{name} makes AI accessible right in your browser. No API keys, no cloud credits, no setup — just paste your input and get results processed locally on your machine.`,
      `With {name}, you get AI-powered processing without the usual privacy trade-offs. Everything runs in your browser, so your data never reaches an external server.`,
      `{name} brings AI to your fingertips without any infrastructure. No accounts, no API keys, no cloud dependencies — just private, instant processing in your browser.`,
      `Skip the complex AI tooling. {name} runs in your browser with zero configuration — paste your input and get results processed locally on your device.`,
      `{name} is the private, instant way to use AI. No data leaves your browser, no accounts are needed, and results appear as fast as your machine can process them.`,
      `{name} makes AI accessible without the usual trade-offs. Most AI tools require you to send your data to a cloud service, which creates privacy concerns and dependency on network connectivity. {name} runs entirely in your browser, so your prompts and data never leave your machine.`,
      `The biggest advantage of {name} is that it eliminates API costs and usage quotas. Because processing happens on your device, there are no per-request charges, no rate limits, and no tiered pricing plans. You use the tool as much as you want, for as long as you want, with no metering.`,
      `{name} is ideal for users who are privacy-conscious about AI. While cloud AI services may log, review, or train on your inputs, {name} processes everything locally. Your draft emails, private documents, and proprietary content stay on your device, giving you the benefits of AI assistance without the data-sharing compromises.`,
      `Choose {name} over cloud AI tools when you want to experiment with AI capabilities without committing to a subscription or sharing your data. The browser-based models handle common tasks — rewriting, summarisation, classification — with no setup. If the results are useful, you can later decide whether to invest in a more powerful cloud solution.`,
      `{name} reduces friction for quick AI-assisted edits. Instead of opening a separate AI chat interface, pasting your text, waiting for a server response, and copying the result back, you do everything in one page. The tool processes your input locally and returns results without network latency.`,
],
    Utility: [
      `{name} handles the task quickly and privately in your browser. No software to install, no accounts to create — just fill in the fields and get your result.`,
      `{name} is a focused utility that does one thing well — all in your browser. Your data stays private, results are instant, and there is no clutter.`,
      `With {name}, you get a straightforward tool that works offline in your browser. No signups, no uploads, no distractions — just the utility you need.`,
      `{name} is a straightforward utility that does exactly what you expect without surprises. No hidden features, no upsells, no data collection. You enter your input, get your result, and close the tab — the tool respects your time and your privacy.`,
      `What makes {name} useful is its reliability. It does the same thing every time, with predictable output and no external dependencies. Whether you are online or offline, on a fast connection or a slow one, the tool works identically because everything runs locally in your browser.`,
      `{name} eliminates the need to install dozens of tiny utility apps for one-off tasks. Instead of downloading, installing, and eventually uninstalling a separate application for every micro-task, you open one page, get the result, and move on.`,
      `The main advantage of {name} is availability. It works on any device with a modern browser — your laptop, your tablet, a borrowed computer, a public terminal. The same interface, the same functionality, the same privacy guarantees regardless of where you are.`,
      `Choose {name} because it respects your attention. There are no notifications, no email signup prompts, no "upgrade to pro" banners. The tool is designed to get you in, get you your result, and get you out as quickly as possible.`,
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


// ── When-to-use templates (10 unique variants per category) ──────────────
function getWhenToTemplates(cat: string, v: number): string {
  const templates: Record<string, string[]> = {
    Developer: [
      `You would use {name} whenever you need to quickly transform, validate, or inspect a piece of code or data without switching to a full IDE. It is ideal for debugging an API response, checking the structure of configuration files, or reformatting output from another tool before you paste it into a pull request or a ticket comment.`,
      `Reach for {name} during code review when you want to verify that a snippet is well-formed, or when you are working on a remote machine and do not have your usual dev environment set up. It also helps when you want to share a clean, readable version of some data with a colleague who does not have the same toolchain installed.`,
      `{name} is useful when you are learning a new technology and want to experiment with sample data without setting up a local project. Students, tutorial-followers, and self-taught developers use it to test inputs, inspect outputs, and build intuition for how different formats and structures behave in real time.`,
      `Open {name} when you are in the middle of a coding session and need a quick sanity check on a block of data — is this JSON valid, does this Base64 string decode correctly, does this URL contain the right parameters? It fills the gap between "I wonder if this is right" and "let me write a test case," saving you several context switches per day.`,
      `Use {name} when you need to convert or transform data between formats during a migration or integration project. Moving from YAML config files to JSON, encoding binary assets for inline embedding, or normalising data from one API shape to another are all scenarios where a browser-based tool helps you iterate fast without scripting a one-off conversion pipeline.`,
      `{name} is the right tool when you need to share a clean, formatted version of your data with non-technical stakeholders. Instead of handing someone raw logs or minified output, you paste it into {name}, apply the transformation, and share a result that is immediately readable — no explanations needed.`,
      `You would turn to {name} during incident response or debugging sessions when every second counts. Pasting a payload, a token, or a configuration block into a browser tool that processes it instantly beats writing a throwaway script or navigating CLI menus under time pressure.`,
      `{name} helps when you are writing documentation or a blog post and need to include formatted code samples, data dumps, or configuration examples. The clean output copies straight into your editor, and the client-side processing means you can include sensitive example data without worrying about server-side logging.`,
      `Pick {name} when you work across multiple machines and do not want to install a different set of CLI tools on each one. As long as you have a browser, you have access to the same formatting, encoding, and validation capabilities regardless of whether you are on your laptop, a borrowed workstation, or a cloud terminal.`,
      `{name} is the quickest way to check whether data you received from an external system matches the expected format. Paste the payload, inspect the result, and confirm validity — all before you wire it into your application logic or write an assertion in your test suite.`,
    ],
    Text: [
      `Use {name} when you need to clean up, normalise, or transform text before publishing. It is especially handy for writers and editors who want to standardise formatting across multiple sources without manually retyping or running regex find-and-replace in several documents.`,
      `Reach for {name} during content migration projects when you need to batch-process text from one format to another. Whether you are stripping HTML tags, converting case, removing duplicate lines from a CSV export, or counting words to meet a publication limit, the tool works instantly in your browser.`,
      `{name} is ideal for students and researchers who need to format citations, remove extra whitespace from copied text, or transform data from one academic format to another. Since everything runs locally, you can paste draft material or unpublished findings without confidentiality concerns.`,
      `You would open {name} when preparing social media copy that has to fit character limits. Draft a tweet, check the word count, adjust case, and copy the polished result — all in one page without switching between a text editor and a social platform composer.`,
      `Use {name} when you have text from multiple sources (emails, documents, web pages) pasted together and need to normalise spacing, line breaks, and formatting into a single consistent style before you put it into a report or a presentation deck.`,
    ],
    Conversion: [
      `You would use {name} when you receive data in one format but your stack expects another — converting a CSV export from a database tool into JSON for a frontend mock, or translating a YAML config from a sample repository into the format your application reads. The browser-based approach means no installation is required on whichever machine you happen to be using.`,
      `{name} is useful during API integration work when you need to reshape sample payloads between formats. A third-party service returns XML but your internal tools speak JSON, or a configuration snippet is in TOML but your deployment pipeline requires YAML — paste, convert, copy, done.`,
      `Open {name} when you are migrating legacy data and need to verify that the conversion preserves all fields and values. Convert a small batch first, inspect the structure, then adjust settings before running the full migration. The instant feedback loop makes it faster than writing and debugging a conversion script for one-off jobs.`,
      `Use {name} in educational contexts to demonstrate how data serialisation formats relate to each other. Teachers and tutorial authors can show real-time conversion between YAML, JSON, and other formats, helping students understand structural equivalences without needing multiple tools installed.`,
      `{name} is the right choice when you need to convert sensitive configuration or internal data. Since all processing happens client-side, you can convert database connection strings, private keys in PEM format, or infrastructure configs without sending them over the network to a server-side converter.`,
    ],
    SEO: [
      `Use {name} when you are auditing a client site or your own pages and need quick technical SEO checks. Analyse headers, meta tags, and content structure in your browser without sharing the target URL with third-party services — your site data stays yours.`,
      `Reach for {name} during content optimisation rounds when you are refining title tags and meta descriptions to fit search engine length limits. Preview how your page will appear in search results, adjust the copy, and iterate until every character counts.`,
      `{name} helps when you are researching competitors or benchmarking industry pages. Run the same analysis on multiple URLs, compare their meta structures, and identify gaps in your own strategy — all without exposing your research trail to an external SEO platform.`,
      `Open {name} when onboarding a new team member or client to demonstrate how technical SEO factors (titles, descriptions, headers, structured data) affect search appearance. The instant feedback makes abstract SEO concepts tangible for non-technical stakeholders.`,
      `Use {name} as part of your pre-publish checklist. Before a new page goes live, paste the URL or content through the tool to verify that titles, descriptions, and canonical tags are correctly set and optimised for the target keywords.`,
    ],
    Color: [
      `Use {name} when you are translating a design mockup into code and need to convert colour values between the formats your CSS framework expects. A designer hands you HEX values but your Tailwind configuration works with HSL — paste the colour, get both formats instantly, copy the one you need.`,
      `Reach for {name} during accessibility audits when you need to verify that your chosen text and background colours meet WCAG contrast ratios. The tool shows you contrast against white and black, helping you catch low-contrast combinations before they reach production.`,
      `{name} is ideal for branding projects where you need to maintain colour consistency across web, print, and social media assets. Convert the brand palette between HEX, RGB, and HSL formats, ensure every channel uses the exact same colour values, and document the results for the rest of the team.`,
      `Open {name} when experimenting with colour schemes during the design phase. Pick a base colour, explore its RGB and HSL equivalents, and build a mental model of how channel adjustments affect the perceived hue — all without leaving your browser or installing a design tool.`,
      `Use {name} when you are contributing to an open-source project and need to match the project's existing colour conventions. Convert the theme colours from the project style guide into your preferred format, confirm your contribution uses the right variables, and submit with confidence.`,
    ],
    Image: [
      `Use {name} when you need to resize, crop, or convert an image for a specific platform requirement — a 1200×630 Open Graph preview, a 150×150 avatar, or a WebP version of a JPEG for faster page loads. Everything processes locally, so you can work with product photos, headshots, or design mockups without uploading them to a server.`,
      `Reach for {name} during content creation when you need to quickly optimise images for the web. Reduce file size without visible quality loss, convert to modern formats, and add metadata — all in your browser without launching a full image editor or relying on an online service that stores your uploads.`,
      `{name} helps when you are building a UI prototype and need placeholder images that look more polished than generic sample photos. Resize, crop, and format your own screenshots or design exports to fit the mockup dimensions, keeping everything local and private.`,
      `Open {name} to batch-prepare images for a presentation or portfolio submission. Standardise dimensions, strip unnecessary metadata for privacy, and output every image in the format your submission guidelines require — no server uploads, no privacy concerns with unreleased work.`,
    ],
    "AI Tools": [
      `Use {name} when you want to experiment with AI processing without signing up for a cloud service or setting up API credentials. The browser-based models handle common tasks like summarisation, rewriting, and classification directly on your machine — your input never leaves your device.`,
      `{name} is handy when you need to quickly rewrite or rephrase a piece of text — an email, a PR description, a social media post — and want a second perspective without pasting it into a cloud AI service. The local processing means drafts and sensitive content stays on your device.`,
      `Reach for {name} during brainstorming sessions when you need alternative phrasings, expanded outlines, or concise summaries of longer documents. The AI assists without logging your prompts or storing your data, making it safe for proprietary or confidential material.`,
      `Open {name} to help non-native speakers polish their written English. Paste a draft, get suggestions for more natural phrasing, and learn from the output — all processed locally with no data leaving your browser.`,
    ],
    Utility: [
      `Use {name} for everyday micro-tasks that would otherwise need a specialised app or a command-line incantation. Converting units, generating a password, checking a hash, or encoding a string are all done in your browser without installing anything or sending data to a server.`,
      `Reach for {name} when you need a quick utility on a machine that is not your own — a friend's laptop, a library computer, or a locked-down work device. Any browser gives you access to the same set of utilities regardless of what software is installed locally.`,
      `{name} fits into your workflow whenever you need a reliable, no-nonsense utility that just works. No ads, no signup prompts, no data collection — paste your input, get your result, copy it out, and move on to the next task.`,
    ],
    "Image Tools": [
      `Use {name} for quick image transformations during design handoff. Convert a PNG mockup to JPEG for email, resize a screenshot to fit a documentation template, or strip EXIF data before sharing a client asset — all processed locally without uploading.`,
      `{name} is useful when you need to process product images for an e-commerce listing. Resize to the platform's required dimensions, convert to the recommended format, and ensure the file is under the size limit — everything happens in your browser with no upload queues.`,
    ],
    "Video Tools": [
      `Use {name} to quickly trim, convert, or compress short video clips without installing desktop video software. Social media snippets, screen recordings for bug reports, and short presentation clips are all handled locally in your browser.`,
      `{name} helps when you need to extract a GIF segment from a longer video for use in documentation, a PR comment, or a social post. Trim the relevant portion, generate the GIF, and download it — no video editor required.`,
    ],
    "PDF Tools": [
      `Use {name} when you need to merge, split, or extract pages from a PDF without uploading sensitive documents to a cloud service. Contracts, invoices, and internal reports stay on your device while you reorganise pages or extract the sections you need.`,
      `{name} is useful when you receive a PDF that needs a quick adjustment — rotating a scanned page, removing a blank page before sharing, or extracting a single page as a separate file. All operations run client-side for privacy.`,
    ],
    Network: [
      `Use {name} when troubleshooting connectivity issues or verifying DNS records from a machine that does not have the usual networking tools installed. Diagnose why a domain is not resolving, check HTTP response headers, or trace a redirect chain — all from your browser.`,
      `{name} helps during security assessments or pentesting labs where you need to inspect HTTP headers, verify SSL configuration, or test endpoint responses without exposing your source IP or installing verbose CLI tools.`,
    ],
    CSS: [
      `Use {name} when you are designing a new UI component and need to experiment with layout, spacing, and colour values to see how they interact. The live preview eliminates the CSS edit-refresh loop, letting you iterate on styles directly in your browser.`,
      `{name} is ideal for generating production CSS snippets for common patterns — gradients, shadows, keyframe animations, and responsive grid layouts — without writing each line by hand or pulling in a heavy CSS framework for what should be a simple declaration.`,
    ],
    Math: [
      `Use {name} for quick calculations during development — converting between number bases, evaluating expressions, or generating random values for test fixtures. The browser handles it instantly without opening a separate calculator or Python REPL.`,
      `{name} helps students and educators demonstrate mathematical concepts interactively. Enter values, see results update in real time, and explore how different operations affect the output — all without specialised software.`,
    ],
  };
  const pool = templates[cat] ?? templates.Developer;
  return pool[v % pool.length];
}

// ── Benefits templates (5 variants per category) ──────────────────────────
function getBenefitsTemplates(cat: string, v: number): string {
  const templates: Record<string, string[]> = {
    Developer: [
      `Key benefits of {name} include instant processing with no server uploads, support for large inputs that would cause web-based alternatives to time out, and a clean copy button that puts the result straight on your clipboard. The tool preserves line endings, encoding, and special characters so the output is ready to use in your editor, terminal, or API client without manual cleanup.`,
      `{name} offers real-time validation so you catch syntax errors as you paste, multiple output modes (pretty-print, minified, highlighted) to suit different stages of your workflow, and zero configuration — open the page and start working. There are no login prompts, rate limits, or hidden charges.`,
      `With {name} you get a focused interface that does one thing well: no sidebars, no ads, no data collection scripts. The tool processes your content using the browser's built-in APIs, which means it works offline after the first load and never phones home with your data.`,
      `{name} is private by design, works without an account, and handles everything client-side using modern web standards. You can paste API keys, debug tokens, and internal payloads without worrying about server-side logging because nothing leaves your browser's memory.`,
      `{name} combines formatting, validation, and transformation in one page — you do not need to switch between a linter, a converter, and a minifier. The output updates as you type, errors are flagged inline with the exact position, and the copy button respects your selected format and indentation preferences.`,
    ],
    Text: [
      `{name} processes text entirely in your browser for speed and privacy. There are no file size limits, the output preserves your original formatting where applicable, and the clean interface means you focus on your content rather than navigating tool clutter. Paste, transform, copy — it takes seconds.`,
      `With {name} you get instant results without network latency, support for long documents that would surpass online character limits, and complete privacy since your text never reaches a server. The tool is free, requires no signup, and works offline once loaded.`,
    ],
    Conversion: [
      `{name} converts data locally with no upload limits, supports multiple input and output formats, and preserves data fidelity — no silent truncation, no encoding errors. The instant feedback lets you iterate quickly without round-tripping through a server.`,
      `With {name} you avoid the typical conversion pain points: file size caps, queue times, and data privacy violations. Your source data stays in your browser, conversions are instant, and the output is formatted for immediate use in your project.`,
    ],
    SEO: [
      `{name} runs entirely in your browser, so your site URLs and content are never sent to a third-party server. You get instant technical analysis without creating accounts or granting external services access to your site data.`,
      `With {name} you can audit, analyse, and optimise SEO elements without exposing your research or client data. The tool works offline after first load and delivers results in real time with no arbitrary daily limits.`,
    ],
    Color: [
      `{name} gives you every colour format at once — HEX, RGB, HSL — with accurate WCAG contrast checks against light and dark backgrounds. Pick a colour visually or type a value, and all representations update simultaneously for instant comparison.`,
      `{name} eliminates the need for multiple colour tools by combining a picker, converter, contrast checker, and palette generator in one browser-based interface. Every conversion is local, so you can explore colour schemes without uploading anything.`,
    ],
    Image: [
      `{name} processes images entirely in your browser using Canvas APIs, so your files never reach a server. You get unlimited file size, instant processing, and complete privacy — ideal for sensitive or proprietary image assets.`,
      `With {name} you skip upload queues, file size restrictions, and privacy concerns. All image transformations — resizing, format conversion, compression, metadata stripping — happen locally on your device with real-time previews.`,
    ],
    "AI Tools": [
      `{name} runs AI models in your browser without any cloud dependency. No API keys, no usage quotas, no data leaving your machine — the processing power of your own device handles everything locally, keeping your inputs completely private.`,
      `With {name} you get AI-assisted text processing without the privacy trade-offs of cloud services. Prompts, drafts, and data never leave your browser, there are no subscription fees, and the tool works offline after the initial page load.`,
    ],
    Utility: [
      `{name} is a focused, no-distraction utility that does one job well. No ads, no signup prompts, no data tracking — paste your input, get your result, and move on. Everything processes in your browser for instant feedback and complete privacy.`,
      `With {name} you get a reliable, offline-capable utility that works on any device with a browser. No installation needed, no account required, and no limits on usage. The output is ready to copy the moment it appears.`,
    ],
    "Image Tools": [
      `{name} handles image operations locally in your browser for speed and privacy. No upload queues, no file size limits, and no server-side storage of your images. Every transformation uses browser Canvas APIs for instant results.`,
      `With {name} your images never leave your device. Resize, convert, compress, and edit all happen client-side with real-time preview. The tool is free and requires no signup or data sharing.`,
    ],
    "Video Tools": [
      `{name} processes video content locally in your browser using WebAssembly. Your files stay on your machine, there are no upload queues, and the tool works with large files that would time out on server-based video processors.`,
      `With {name} you get private, local video processing without installing desktop software. Trim, compress, and convert video clips entirely in your browser with no file size limits and no data uploads.`,
    ],
    "PDF Tools": [
      `{name} handles PDF operations entirely in your browser using client-side libraries. Your documents never touch a server, making it safe for contracts, invoices, and confidential reports. All processing is local and instant.`,
      `With {name} you can merge, split, rotate, and extract PDF pages without uploading documents to a cloud service. The tool works offline and preserves your original document quality.`,
    ],
    Network: [
      `{name} runs network diagnostics directly from your browser without exposing your IP or requiring CLI tools. Check headers, DNS records, and redirect chains instantly — all client-side for accurate results.`,
      `With {name} you get network troubleshooting tools in your browser. No SSH access needed, no command-line tools required — just enter a URL and get structured diagnostic information back instantly.`,
    ],
    CSS: [
      `{name} generates production-ready CSS with live preview, so you see exactly what your styles look like before copying them. No more edit-refresh cycles in your dev tools — adjust, preview, copy, and paste.`,
      `With {name} you can experiment with CSS properties visually and copy clean, validated output. Gradients, shadows, animations, and layouts are generated client-side with zero setup and no dependencies.`,
    ],
    Math: [
      `{name} performs accurate calculations using the browser's native number handling. Results update instantly as you change inputs, and the tool handles large integers via BigInt for precise arithmetic beyond JavaScript's normal safe integer range.`,
      `With {name} you get instant calculations without opening a separate app or reaching for a physical calculator. Number base conversion, arithmetic, and random generation all work offline after page load.`,
    ],
  };
  const pool = templates[cat] ?? templates.Developer;
  return pool[v % pool.length];
}

// ── Use cases templates (5 variants per category) ─────────────────────────
function getUseCasesTemplates(cat: string, v: number): string {
  const templates: Record<string, string[]> = {
    Developer: [
      `Common scenarios include: debugging an API response to verify its structure before parsing it in code; formatting a configuration file that was pulled from a production server where only the minified version is available; and validating a JSON schema or XML document against expected patterns during integration testing between microservices.`,
      `{name} is frequently used for: converting log output from a compressed or encoded format into something human-readable during incident post-mortems; preparing cleanly formatted code samples for technical documentation or Stack Overflow answers; and quickly checking whether a third-party library returned data in the expected shape before writing assertions in unit tests.`,
      `Typical situations for {name}: a developer receives a payload from a webhook and needs to inspect its structure before writing the handler; a DevOps engineer decodes a Base64-encoded Kubernetes secret to verify its contents; a QA tester validates that API responses match the documented schema without opening a full API client.`,
      `You might reach for {name} when: pair-programming and wanting to share a cleanly formatted snippet with your partner; reviewing a pull request and needing to verify that a data fixture file is well-formed; or quickly checking whether a string of seemingly random characters is valid Base64 before you spend time debugging why a decoder is failing.`,
    ],
    Text: [
      `Typical use cases for {name}: a writer normalises line spacing and removes extra whitespace from a document copied from an email before publishing; an editor counts words in a draft to verify it fits a publication limit; a translator converts text case to match style guide requirements across multilingual content.`,
      `{name} is commonly used when: preparing social media copy that has to fit strict character limits; cleaning up CSV data exported from a legacy system; deduplicating lines in a mailing list or inventory export; and formatting raw text extracted from a PDF into clean paragraphs for reuse.`,
    ],
    Conversion: [
      `Common scenarios: migrating configuration from a legacy YAML-based deployment to a JSON-based infrastructure-as-code tool; converting a batch of CSV records into JSON for a frontend mock server; and translating XML responses from a SOAP API into JSON during a gradual REST migration project.`,
      `{name} is used when: sharing data with a teammate who uses a different toolchain that expects a different format; converting colour palette files between design tool export formats; and preparing test fixtures in multiple formats to cover different parser implementations in a test suite.`,
    ],
    SEO: [
      `{name} is used when: auditing a client's site during onboarding to identify missing meta tags and duplicate titles; preparing a pre-launch checklist that verifies every new page has optimised title tags and descriptions; and analysing competitor SERP features to identify keyword opportunities for your own content strategy.`,
      `Typical SEO scenarios: a content marketer previews how a blog post will appear in Google search results before publishing; an SEO specialist checks whether recommended snippet lengths are being respected across a site's template files; and a site owner verifies that canonical tags are correctly set after a site migration.`,
    ],
    Color: [
      `{name} is used when: a frontend developer converts the HEX values from a Figma design file into HSL for a Tailwind CSS configuration; a designer checks whether light text on a coloured background meets WCAG AA accessibility standards; and a branding manager documents the exact RGB equivalents of a company's HEX brand palette for print use.`,
      `Typical scenarios: a UI developer experiments with colour variations by adjusting HSL sliders and copying the resulting HEX values directly into component styles; an accessibility auditor tests multiple colour combinations against contrast ratio guidelines in one session; and a student learns how different colour models represent the same hue differently.`,
    ],
    Image: [
      `{name} is used when: converting a screenshot from PNG to JPEG to reduce file size before attaching it to a support ticket; resizing product photos to match e-commerce platform dimension requirements; and stripping EXIF metadata from images before sharing them publicly.`,
      `Typical scenarios: a technical writer compresses and resizes screenshots for a documentation site while keeping them readable; a designer exports mockups in multiple formats from one original; and a developer optimises Open Graph images for a blog without launching a full design tool.`,
    ],
    "AI Tools": [
      `{name} is used when: a non-native speaker drafts an email and wants suggestions for more natural phrasing; a developer asks the AI to summarise a long error log into bullet points; and a content creator brainstorms headline variants for a blog post without logging into a cloud AI platform.`,
      `Typical scenarios: a student rewrites a paragraph to match an academic tone requirement; a manager drafts a performance review comment and wants a more diplomatic phrasing; and a marketer generates multiple A/B test variants for a landing page headline.`,
    ],
    Utility: [
      `{name} is used when: generating a secure random password for a new account; converting units in a recipe or DIY project; hashing a file checksum to verify download integrity; and encoding a URL parameter that contains special characters that would break a query string.`,
      `Typical utility scenarios: calculating the time difference between two dates for a project timeline; generating a UUID for a database record; converting text to Morse code for a creative project; and looking up the ASCII or Unicode code point for a special character.`,
    ],
  };
  const pool = templates[cat] ?? templates.Developer;
  return pool[v % pool.length];
}
