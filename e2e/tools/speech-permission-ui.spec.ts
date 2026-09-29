import { expect, test } from '@playwright/test';

test('speech recognition confirms granted microphone access and stops the acquired stream', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    (window as any).__mic = { stopped: 0, starts: 0 };
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: async () => ({ getTracks: () => [{ stop: () => (window as any).__mic.stopped++ }] }) },
    });
    (window as any).SpeechRecognition = class {
      onstart?: () => void;
      onend?: () => void;
      start() { (window as any).__recognition = this; (window as any).__mic.starts++; this.onstart?.(); }
      stop() { this.onend?.(); }
      abort() { this.onend?.(); }
    };
  });
  await page.goto('/tools/speech-to-text');
  await expect(page.getByText('Microphone access is needed to transcribe speech.')).toBeVisible();
  await page.getByRole('button', { name: 'Start Listening' }).click();
  await expect(page.getByRole('status')).toContainText('Microphone allowed');
  await expect(page.getByRole('button', { name: 'Stop Listening' })).toBeVisible();
  expect(await page.evaluate(() => (window as any).__mic)).toEqual({ stopped: 1, starts: 1 });
  await page.screenshot({ path: testInfo.outputPath('speech-to-text-desktop.png'), fullPage: true });
  await page.getByRole('button', { name: 'Stop Listening' }).click();
  await page.evaluate(() => (window as any).__recognition.onresult?.({ results: [[{ transcript: 'late words' }]] }));
  await expect(page.getByLabel('Transcript', { exact: true })).toHaveValue('');
});

test('speech recognition explains a denied permission without starting recognition', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__starts = 0;
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: async () => { throw new DOMException('Permission denied', 'NotAllowedError'); } },
    });
    (window as any).SpeechRecognition = class { start() { (window as any).__starts++; } abort() {} };
  });
  await page.goto('/tools/speech-to-text');
  await page.getByRole('button', { name: 'Start Listening' }).click();
  await expect(page.locator('.tb-v2-tool-card').getByRole('alert')).toContainText('Allow microphone access in your browser site settings');
  expect(await page.evaluate(() => (window as any).__starts)).toBe(0);
});

test('speech transcript is read-only and copies microphone output in one click', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: async () => ({ getTracks: () => [{ stop() {} }] }) },
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (value: string) => { (window as any).__copiedTranscript = value; } },
    });
    (window as any).SpeechRecognition = class {
      start() { (window as any).__recognition = this; this.onstart?.(); }
      stop() { this.onend?.(); }
      abort() { this.onend?.(); }
      onstart?: () => void;
      onend?: () => void;
      onresult?: (event: any) => void;
    };
  });
  await page.goto('/tools/speech-to-text');
  const card = page.locator('.tb-v2-tool-card').first();
  await expect(card.getByRole('textbox', { name: 'Manual transcript' })).toHaveCount(0);
  await expect(card.getByRole('button', { name: 'Examples' })).toHaveCount(0);
  await card.getByRole('button', { name: 'Start Listening' }).click();
  await page.evaluate(() => (window as any).__recognition.onresult({ results: [[{ transcript: 'Hello from the microphone.' }]] }));
  const transcript = card.getByRole('textbox', { name: 'Transcript', exact: true });
  await expect(transcript).toHaveValue('Hello from the microphone.');
  await expect(transcript).toHaveJSProperty('readOnly', true);
  const fieldBox = await transcript.boundingBox();
  const icon = card.getByRole('button', { name: 'Copy transcript' });
  const iconBox = await icon.boundingBox();
  expect(fieldBox && iconBox).toBeTruthy();
  expect(iconBox!.x).toBeGreaterThan(fieldBox!.x + fieldBox!.width / 2);
  expect(iconBox!.x + iconBox!.width).toBeLessThanOrEqual(fieldBox!.x + fieldBox!.width);
  expect(iconBox!.y).toBeGreaterThanOrEqual(fieldBox!.y);
  expect(iconBox!.y + iconBox!.height).toBeLessThan(fieldBox!.y + fieldBox!.height / 2);
  await transcript.click({ position: { x: 18, y: 65 } });
  expect(await page.evaluate(() => (window as any).__copiedTranscript)).toBe('Hello from the microphone.');
  await page.keyboard.type('attempted edit');
  await expect(transcript).toHaveValue('Hello from the microphone.');
  await page.evaluate(() => { (window as any).__copiedTranscript = ''; });
  await icon.click();
  expect(await page.evaluate(() => (window as any).__copiedTranscript)).toBe('Hello from the microphone.');
  await expect(card.getByRole('status').filter({ hasText: 'Copied' })).toBeVisible();
});

test('Clear cancels a microphone request that resolves late', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__mic = { stopped: 0, starts: 0 };
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: () => new Promise(resolve => { (window as any).__resolveMic = resolve; }) },
    });
    (window as any).SpeechRecognition = class { start() { (window as any).__mic.starts++; } abort() {} };
  });
  await page.goto('/tools/speech-to-text');
  await page.getByRole('button', { name: 'Start Listening' }).click();
  await expect.poll(() => page.evaluate(() => typeof (window as any).__resolveMic)).toBe('function');
  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  await page.evaluate(() => (window as any).__resolveMic({ getTracks: () => [{ stop: () => (window as any).__mic.stopped++ }] }));
  await expect.poll(() => page.evaluate(() => (window as any).__mic.stopped)).toBe(1);
  expect(await page.evaluate(() => (window as any).__mic.starts)).toBe(0);
  await expect(page.getByText('Microphone allowed')).toHaveCount(0);
});

test('text to speech presents an in-view Listen control and compact voice selector', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    const voices = [{ name: 'Voice One', lang: 'en-US' }, { name: 'Voice Two', lang: 'en-US' }];
    (window as any).SpeechSynthesisUtterance = class { constructor(public text: string) {} };
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: { getVoices: () => voices, addEventListener() {}, removeEventListener() {}, cancel() {}, speak(utterance: any) { (window as any).__spoken = utterance; utterance.onstart?.(); } },
    });
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/tools/text-to-speech');
  await page.getByLabel('Text input for speech synthesis').fill('Hello from Toolblip.');
  const inputHeader = page.locator('.tb-v2-tool-input-head').filter({ hasText: 'Text to Convert' });
  await expect(inputHeader.getByRole('button', { name: 'Examples' })).toBeVisible();
  await expect(inputHeader.getByRole('button', { name: 'Clear', exact: true })).toBeVisible();
  const listen = page.getByRole('button', { name: 'Listen', exact: true });
  await expect(listen).toBeVisible();
  const box = await listen.boundingBox();
  expect(box && box.y + box.height).toBeLessThan(900);
  const voice = page.getByLabel('Selected Voice');
  expect((await voice.boundingBox())?.height).toBeLessThan(60);
  await voice.selectOption('Voice Two');
  await listen.click();
  await expect(page.getByRole('status')).toContainText('Speaking');
  expect(await page.evaluate(() => ({ text: (window as any).__spoken.text, voice: (window as any).__spoken.voice?.name }))).toEqual({ text: 'Hello from Toolblip.', voice: 'Voice Two' });
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Stopped');
  await page.screenshot({ path: testInfo.outputPath('text-to-speech-desktop.png'), fullPage: true });
});

test('speech controls fit narrow screens', async ({ page }) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 740 });
    for (const path of ['/tools/speech-to-text', '/tools/text-to-speech']) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.tb-v2-tool-card').first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  }
});
