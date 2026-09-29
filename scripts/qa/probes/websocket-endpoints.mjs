import { expect, webkit } from '@playwright/test';

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
  for (let attempt = 1; attempt <= 5; attempt++) {
    await page.goto('https://toolblip.com/tools/websocket-tester', { waitUntil: 'domcontentloaded' });
    const tool = page.locator('.tb-v2-tool-card').first();
    await tool.getByRole('button', { name: /^Examples?$/ }).click();
    await expect(tool.getByLabel('Url', { exact: true })).toHaveValue('wss://echo.websocket.org');
    await tool.getByRole('button', { name: 'Connect', exact: true }).click();
    const send = tool.getByRole('button', { name: 'Send', exact: true });
    const connected = await expect(send).toBeEnabled({ timeout: 15000 }).then(() => true).catch(() => false);
    console.log(JSON.stringify({ kind: 'tool-ui', attempt, connected, log: (await tool.innerText()).slice(-500) }));
    await tool.getByRole('button', { name: 'Disconnect', exact: true }).click();
  }
} finally { await browser.close(); }
