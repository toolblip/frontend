export const products = [
  {
    name: 'CloudPloy', category: 'Cloud & AI', url: 'https://cloudploy.com', domain: 'cloudploy.com',
    status: 'Waitlist open', logo: 'cloudploy.svg', tone: 'cloud', tagline: 'Your next deploy starts with a prompt.',
    description: 'Deploy to your own cloud from Claude Code, Cursor, or any MCP client. Connect your AI tools and put deployment into your existing workflow.',
  },
  {
    name: 'SkaleAgents', category: 'Cloud & AI', url: 'https://skaleagents.com', domain: 'skaleagents.com',
    logo: 'skaleagents.svg', tone: 'agents', tagline: 'A second pair of eyes for your infrastructure.',
    description: 'An AI DevOps control plane for code and infrastructure reviews. Find specialist agents, reuse prompts, and bring findings back to your editor through MCP.',
  },
  {
    name: 'Crontinel', category: 'Developer tools', url: 'https://crontinel.com', domain: 'crontinel.com',
    logo: 'crontinel.png', tone: 'monitor', tagline: 'Hear about failures before your users do.',
    description: 'Monitor scheduled jobs, queues, workers, and AI agent runs. Open-source SDKs and a hosted dashboard help catch failures an uptime check can miss.',
  },
  {
    name: 'AmazingPlugins', category: 'Commerce', url: 'https://amazingplugins.com', domain: 'amazingplugins.com',
    logo: 'amazingplugins.jpg', tone: 'plugins', tagline: 'Quiet plugins. Better stores.',
    description: 'Focused, free plugins for WooCommerce store owners. Starting with accessibility, each plugin tackles a specific problem in your store.',
  },
  {
    name: 'Appnary', category: 'Commerce', url: 'https://appnary.com', domain: 'appnary.com',
    status: 'Coming soon', logo: 'appnary.png', tone: 'shopify', tagline: 'Shopify apps built around your day.',
    description: 'Simple, affordable apps for Shopify merchants. Pixel Tracker brings Facebook, Google, TikTok, and more tracking pixels into one dashboard.',
  },
  {
    name: 'harun.dev', category: 'More from us', url: 'https://harun.dev', domain: 'harun.dev',
    logo: 'harun.svg', tone: 'personal', tagline: 'Meet the engineer behind the work.',
    description: "Harun R. Rayhan's home on the web. Software engineering, cloud architecture, and DevOps consulting, with notes from the work along the way.",
  },
] as const;
