// Starts from the Next.js 16.2 default so setting this option does not drop
// Google, Bing, and link-preview bots. Extra names are assistants that do not
// execute JavaScript and need title, canonical, and JSON-LD in the first HTML.
export const htmlLimitedBots =
  /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|Googlebot|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-SearchBot|Claude-User|anthropic-ai|PerplexityBot|Perplexity-User|Amazonbot|DuckAssistBot|cohere-ai|Meta-ExternalAgent|CCBot|Bytespider/i;
