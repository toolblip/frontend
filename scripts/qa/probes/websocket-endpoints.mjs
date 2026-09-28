import { webkit } from '@playwright/test';

const browser = await webkit.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto('https://toolblip.com/tools/websocket-tester', { waitUntil: 'domcontentloaded' });
  for (const url of ['wss://echo.websocket.org', 'wss://ws.postman-echo.com/raw']) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      const result = await page.evaluate(url => new Promise(resolve => {
        const socket = new WebSocket(url);
        const timeout = setTimeout(() => { socket.close(); resolve('timeout'); }, 12000);
        socket.onopen = () => { clearTimeout(timeout); socket.close(); resolve('open'); };
        socket.onerror = () => { clearTimeout(timeout); resolve('error'); };
      }), url);
      console.log(JSON.stringify({ url, attempt, result }));
    }
  }
} finally { await browser.close(); }
