import type { Tool } from "@/data/tools";

/** Generate a unique, meaningful usage description for a tool.
 *  Server-rendered so Googlebot indexes it. */
export function generateToolContent(tool: Tool): {
  howToUse: string;
  whyUse: string;
  relatedPhrases: string[];
} {
  const name = tool.name;
  const cat = tool.category;
  const desc = tool.description;

  // Category-specific usage patterns
  const catHowTo: Record<string, string> = {
    Developer: `To use the ${name}, paste or type your input into the editor on this page. The tool processes everything locally in your browser - nothing is uploaded to any server. Results update instantly as you type or paste.`,
    Text: `Using the ${name} is straightforward: enter or paste your text content into the input area. The tool works entirely in your browser, so your text never leaves your device. Copy the result with one click when done.`,
    Image: `To use the ${name}, upload an image from your device using the file picker or drag and drop. All processing happens locally in your browser - no images are uploaded to any server. Download the result when ready.`,
    Color: `To use the ${name}, enter a color value in your preferred format (HEX, RGB, HSL, or named color). The tool converts and displays the equivalent values in all common color formats instantly, right in your browser.`,
    SEO: `Using the ${name} helps you optimize your website for search engines. Enter your URL or the relevant data in the input fields. All analysis happens on your device - nothing is sent to external servers.`,
    Cryptography: `To use the ${name}, enter the text or data you want to process. All cryptographic operations happen locally in your browser - your data never leaves your machine. No server-side storage or transmission occurs.`,
    Conversion: `Using the ${name} is simple: paste or upload your source content, choose your target format, and get the converted result instantly. Everything runs locally - no server uploads.`,
    Design: `To use the ${name}, adjust the controls and inputs on this page to your preferences. Changes reflect immediately in the preview. All rendering happens in your browser - nothing is sent to a server.`,
    Authentication: `Using the ${name} is secure and private: paste your token or credentials data into the input field. All processing happens client-side - your secrets never leave your browser.`,
    Performance: `To use the ${name}, provide your input (URL, code, or metrics) in the field below. The analysis runs entirely in your browser for instant results with no server round-trip.`,
    Reference: `The ${name} provides quick lookups and reference data right in your browser. Browse or search through the information below. Everything is loaded client-side - no server requests needed.`,
    MCP: `To use the ${name}, configure your MCP client with the endpoint shown on this page. The tool helps you integrate Toolblip's capabilities into AI-powered development workflows.`,
    Guide: `The ${name} walks you through the topic step by step. Read through the guide below and follow along. All content is rendered server-side for reliable indexing.`,
    "Social Media": `To use the ${name}, enter your content or URL in the input area below. The tool processes everything in your browser - no data is uploaded. Instantly see the formatted result ready to copy.`,
    "AI / ML": `Using the ${name} is straightforward: provide your input in the fields below. Processing happens locally in your browser, so your data stays private. Results update in real time.`,
  };

  const howToUse = catHowTo[cat] ?? catHowTo.Developer;

  // Category-specific "why use" text
  const catWhy: Record<string, string> = {
    Developer: `${name} eliminates the need to install software or visit multiple websites. Everything runs in your browser, so you can work faster without context switching. No signup, no ads, no data leaving your machine.`,
    Text: `${name} gives you a fast, private way to work with text content. Since everything runs client-side, you get instant results without waiting for server round-trips. Your data stays yours.`,
    Image: `${name} processes images entirely in your browser using modern web APIs. This means faster results, no upload limits, and complete privacy - your images never reach any server.`,
    Color: `${name} works instantly in your browser. There is no need to install design software or open complex tools - just enter your color and get all the format conversions you need on one page.`,
    SEO: `${name} runs locally in your browser, giving you instant feedback without exposing your site data to third-party services. Make better SEO decisions with private, real-time analysis.`,
    Cryptography: `${name} keeps your sensitive data private by processing everything client-side. No server ever sees your input. This is especially important when working with passwords, keys, or private data.`,
    Conversion: `${name} handles conversions directly in your browser. There are no file size limits, no upload queues, and no privacy concerns - your source data stays on your device.`,
    Design: `${name} runs in your browser with zero installation required. Adjust settings and see results instantly. Export your work directly from the page.`,
    Authentication: `${name} processes tokens and credentials entirely on your device. Your secrets are never transmitted, logged, or stored on any server.`,
    Performance: `${name} helps you identify performance bottlenecks without sending your data to external services. Everything stays local and private.`,
    Reference: `${name} is always available in your browser. No bookmarks needed, no searching through documentation - just fast, reliable reference data at your fingertips.`,
    MCP: `${name} makes it easy to connect Toolblip's developer tools to your AI workflow via the Model Context Protocol.`,
    Guide: `${name} provides practical, actionable information you can apply immediately. No fluff, no sales pitch - just useful guidance for developers and tinkerers.`,
    "Social Media": `${name} helps you create and optimize social media content quickly. Processing happens locally - your drafts and ideas stay private until you are ready to share.`,
    "AI / ML": `${name} makes AI and ML tools accessible right in your browser. No setup, no API keys needed - just paste and go.`,
  };

  const whyUse = catWhy[cat] ?? catWhy.Developer;

  // Generate related search phrases from tags and name
  const phrases: string[] = [];
  const words = name.toLowerCase().split(" ");
  const basePhrase = words.length > 2
    ? words.slice(0, 3).join(" ")
    : name.toLowerCase();

  phrases.push(`free ${basePhrase} online`);
  phrases.push(`${basePhrase} tool`);
  phrases.push(`online ${basePhrase} no signup`);
  if (cat !== "Developer") {
    phrases.push(`${basePhrase} for developers`);
  }

  return { howToUse, whyUse, relatedPhrases: [...new Set(phrases)] };
}
