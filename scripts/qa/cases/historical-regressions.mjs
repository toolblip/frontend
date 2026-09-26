const example = tool => tool.getByRole('button', { name: /^Examples?$/i }).first().click();
const clear = tool => tool.getByRole('button', { name: /^Clear$/i }).first().click();

// Check populated controls at 320px, even if the case subsequently clears them.
async function mobile({ page, tool, check }, state) {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const size = await tool.evaluate(root => ({ client: root.clientWidth, scroll: root.scrollWidth,
    right: root.getBoundingClientRect().right, viewport: document.documentElement.clientWidth }));
  check(size.scroll <= size.client + 1 && size.right <= size.viewport + 1,
    `${state}: 320px layout, client=${size.client}, scroll=${size.scroll}, right=${size.right}`);
}

async function jsonTable({ page, tool, expect, check }) {
  const input = tool.getByRole('textbox', { name: 'JSON input', exact: true });
  const output = tool.locator('pre');
  await example(tool);
  await expect(output).toHaveText('| name | role |\n| --- | --- |\n| Ada | Engineer |\n| Alan | Scientist |\n');
  await input.fill('[{"name":"Ada","score":0,"active":false,"note":null},{"name":"A|B","score":12,"active":true,"note":"ok"}]');
  const expected = '| name | score | active | note |\n| --- | --- | --- | --- |\n| Ada | 0 | false |  |\n| A\\|B | 12 | true | ok |\n';
  await expect(output).toHaveText(expected);
  check(await output.textContent() === expected, 'Exact Markdown preserves zero, false, null and escapes a cell pipe');
  await input.fill('{');
  await expect(tool).toContainText('Invalid JSON');
  await input.fill('[]');
  await expect(tool).toContainText('JSON array is empty');
  await clear(tool);
  await expect(input).toHaveValue('');
  await expect(output).toHaveCount(0);
  await expect(tool.getByRole('button', { name: 'Copy', exact: true })).toBeDisabled();
  check(true, 'Malformed/empty JSON errors and Clear verified');
  await input.fill('{"name":"Ada","score":0}');
  const singleExpected = '| name | score |\n| --- | --- |\n| Ada | 0 |\n';
  await expect(output).toHaveText(singleExpected);
  check(await output.textContent() === singleExpected, 'Exact single-object Markdown matches the independent table, including trailing newline');
  // The approved workflow is output + Copy, with no download requirement.
  // Observe the real clipboard call and its native completion, without substituting
  // a successful mock or reading unrelated system clipboard contents.
  const copy = tool.getByRole('button', { name: 'Copy', exact: true });
  await expect(copy).toBeEnabled();
  // Headless Chrome requires an explicit clipboard permission; WebKit uses
  // the user activation from the actual button click.
  if (page.context().browser().browserType().name() === 'chromium') {
    await page.context().grantPermissions(['clipboard-write'], { origin: new URL(page.url()).origin });
  }
  await page.evaluate(() => {
    const clipboard = navigator.clipboard;
    const original = Object.getOwnPropertyDescriptor(clipboard, 'writeText');
    const writeText = clipboard.writeText.bind(clipboard);
    window.__jsonTableCopy = { calls: [] };
    window.__jsonTableCopy.restore = () => {
      if (original) Object.defineProperty(clipboard, 'writeText', original);
      else delete clipboard.writeText;
      delete window.__jsonTableCopy;
    };
    Object.defineProperty(clipboard, 'writeText', { configurable: true, value: async text => {
      const call = { text, status: 'pending' };
      window.__jsonTableCopy.calls.push(call);
      try {
        await writeText(text);
        call.status = 'fulfilled';
      } catch (error) {
        call.status = 'rejected';
        call.error = String(error);
        throw error;
      }
    } });
  });
  try {
    await copy.click();
    await expect(tool.getByRole('button', { name: 'Copied', exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.__jsonTableCopy.calls))
      .toEqual([{ text: singleExpected, status: 'fulfilled' }]);
    check(true, 'Copy submits the independent exact table to native clipboard.writeText, which fulfills; Copied feedback appears');
  } finally {
    await page.evaluate(() => window.__jsonTableCopy?.restore());
  }
}

async function lorem({ tool, expect, check }) {
  const output = tool.getByRole('textbox', { name: 'Output', exact: true });
  const count = tool.getByRole('spinbutton', { name: 'How many' });
  await expect(output).not.toHaveValue('');
  check((await output.inputValue()).split(/\n\s*\n/).length === 3, 'Immediate default output has three paragraphs');
  await tool.getByRole('radio', { name: 'Words', exact: true }).check();
  await count.fill('7');
  await expect(output).toHaveValue('Lorem ipsum dolor sit amet consectetur adipiscing');
  check((await output.inputValue()).split(/\s+/).length === 7, 'Seven words match the independently specified opening');
  await tool.getByRole('checkbox').uncheck();
  await expect(output).toHaveValue('sed do eiusmod tempor incididunt ut labore');
  await tool.getByRole('button', { name: 'Regenerate', exact: true }).click();
  await expect(output).toHaveValue('et dolore magna aliqua Ut enim ad');
  check(true, 'Start option and Regenerate preserve seven-word output with expected text');
  await tool.getByRole('radio', { name: 'Sentences', exact: true }).check();
  await count.fill('2');
  check((await output.inputValue()).match(/[.!?]+/g)?.length === 2, 'Sentence mode generates two complete sentences');
  await tool.getByRole('radio', { name: 'Paragraphs', exact: true }).check();
  const paragraphs = (await output.inputValue()).split(/\n\s*\n/);
  check(paragraphs.length === 2 && paragraphs.every(p => p.trim() && p.match(/[.!?]+/g)?.length === 3),
    'Paragraph mode generates two nonempty paragraphs, each with three sentences');
  await count.fill('0');
  await expect(count).toHaveValue('1');
  await count.fill('101');
  await expect(count).toHaveValue('100');
  check(true, 'Count bounds clamp to 1 and 100');
  await count.fill('2');
}

async function paragraph(ctx) {
  const { tool, expect, check } = ctx;
  const input = tool.getByRole('textbox', { name: 'Text input for paragraph counting' });
  await example(tool);
  await mobile(ctx, 'Paragraph Examples');
  await input.fill('One two. Three four!\n\nFive six?');
  for (const [label, value] of [['Paragraphs','2'], ['Sentences','3'], ['Words','6'], ['Characters','31'],
    ['Characters (no spaces)','25'], ['Avg words/sentence','2.0'], ['Avg words/paragraph','3.0']]) {
    await expect(tool.getByText(label, { exact: true }).locator('..').locator('span').last()).toHaveText(value);
  }
  check(true, 'Independent two-paragraph sample: 3 sentences, 6 words, 31 characters, 25 without whitespace, averages 2.0/3.0');
  await mobile(ctx, 'Paragraph known output');
  await clear(tool);
  await expect(input).toHaveValue('');
  await expect(tool).toContainText('Enter text to see statistics');
  check(true, 'Clear removes paragraph statistics');
  await example(tool);
}

async function randomColor({ tool, expect, check }) {
  const hex = tool.getByRole('button', { name: /^HEX/ }).locator('div');
  const rgb = tool.getByRole('button', { name: /^RGB/ }).locator('div');
  const hsl = tool.getByRole('button', { name: /^HSL/ }).locator('div');
  async function valid(state) {
    await expect(hex).toHaveText(/^#[0-9A-F]{6}$/);
    const value = (await hex.textContent()).slice(1);
    const channels = [0, 2, 4].map(i => parseInt(value.slice(i, i + 2), 16));
    await expect(rgb).toHaveText(channels.join(', '));
    const match = /^(\d+)°, (\d+)%, (\d+)%$/.exec(await hsl.textContent());
    check(!!match && +match[1] <= 360 && +match[2] <= 100 && +match[3] <= 100, `${state}: valid HEX, matching RGB and bounded HSL`);
  }
  await valid('Initial color');
  await example(tool);
  await expect(hex).toHaveText('#E11D48');
  await expect(rgb).toHaveText('225, 29, 72');
  await expect(hsl).toHaveText('347°, 77%, 50%');
  check(true, 'Example color has independent exact RGB/HSL values');
  const values = new Set();
  for (let i = 0; i < 3; i++) {
    await tool.getByRole('button', { name: 'Generate new color', exact: true }).click();
    await valid(`Generated color ${i + 1}`);
    values.add(await hex.textContent());
  }
  check(values.size > 1, 'Repeated generation produces distinct valid colors');
  await clear(tool);
  await valid('Clear regenerates');
}

async function reading(ctx) {
  const { tool, expect, check } = ctx;
  const input = tool.getByRole('textbox');
  await example(tool);
  await mobile(ctx, 'Reading Examples');
  // 300 words / 200 wpm = 1m30s; / 100 = 3m; / 500 = 36s.
  await input.fill(Array(300).fill('word').join(' '));
  await expect(tool.getByText('1m 30s', { exact: true })).toBeVisible();
  await expect(tool.getByText('Words', { exact: true }).locator('..')).toHaveText('Words300');
  await expect(tool.getByText('Characters', { exact: true }).locator('..')).toHaveText('Characters1200');
  const speed = tool.getByRole('slider');
  await speed.focus();
  await speed.press('Home');
  await expect(tool.getByText('3m 0s', { exact: true })).toBeVisible();
  await speed.press('End');
  await expect(tool.getByText('36s', { exact: true })).toBeVisible();
  check(true, '300 known words yield 1m30s at 200wpm, 3m at 100wpm, 36s at 500wpm; 1200 nonspace characters');
  await mobile(ctx, 'Reading known output');
  await clear(tool);
  await expect(input).toHaveValue('');
  await expect(tool).toContainText('Enter text to calculate reading time');
  await input.fill('   ');
  await expect(tool).toContainText('Enter text to calculate reading time');
  check(true, 'Clear and whitespace input remove reading results');
  await example(tool);
}

export default [
  { slug: 'json-to-markdown-table', test: jsonTable },
  ...['lorem-ipsum-generator', 'lorem-ipsum-words'].map(slug => ({ slug, test: lorem,
    requiresExample: false, requiresClear: false,
    exceptionReason: 'Immediate generator starts with real output; Count/unit/start option and Regenerate define the approved workflow. There is no input document to load or clear.' })),
  { slug: 'paragraph-counter', test: paragraph },
  { slug: 'random-color-generator', test: randomColor },
  ...['read-time-calculator', 'reading-pace-calculator', 'reading-time-calculator', 'reading-time-estimator']
    .map(slug => ({ slug, test: reading })),
];
