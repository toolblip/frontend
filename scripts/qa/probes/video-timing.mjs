/** Dedicated safety regression; passing this does NOT mean successful export QA passed.
 * node scripts/qa/probes/video-timing.mjs [--headed] [--force-drift | --scenes]
 * Uses the existing development server. Normal mode runs strict export fixtures.
 */
import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { auditTool } from '../browser.mjs';
import cases from '../cases/media-conversion.mjs';

const forced = process.argv.includes('--force-drift');
const headed = process.argv.includes('--headed');
const scenes = process.argv.includes('--scenes');
const output = `/private/tmp/toolblip-video-${forced ? 'drift' : scenes ? 'scenes' : 'export'}-${headed ? 'headed' : 'headless'}`;
await mkdir(output, { recursive: true });
if (scenes) execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', "color=c=red:s=64x48:r=30:d=2,drawbox=c=lime:t=fill:enable='between(t,0.5,0.999)',drawbox=c=blue:t=fill:enable='between(t,1,1.499)',drawbox=c=yellow:t=fill:enable='gte(t,1.5)'", '-f', 'lavfi', '-i', 'sine=frequency=440:sample_rate=48000:duration=2', '-c:v', 'libvpx', '-c:a', 'libopus', '-shortest', `${output}/scenes.webm`]);
const server = await chromium.launchServer({ channel: 'chrome', headless: !headed });
const browser = await chromium.connect(server.wsEndpoint());
const results = [];
try {
  const instrumented = { async newContext(options) {
    const context = await browser.newContext(options);
    await context.addInitScript(({ forced }) => {
      window.__videoTimingResources = { streams: [], contexts: [], played: 0 };
      const state = window.__videoTimingResources;
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        state.played++;
        if (forced) this.playbackRate = 0.1;
        return play.call(this);
      };
      const capture = HTMLCanvasElement.prototype.captureStream;
      HTMLCanvasElement.prototype.captureStream = function (...args) {
        const stream = capture.apply(this, args); state.streams.push(stream); return stream;
      };
      const NativeAudioContext = window.AudioContext;
      window.AudioContext = class extends NativeAudioContext {
        constructor(...args) { super(...args); state.contexts.push(this); }
      };
    }, { forced });
    return context;
  } };
  for (const slug of ['cutter', 'add-subtitles']) {
    const fixture = forced ? { slug, async test({ tool, page, check }) {
      await tool.getByRole('button', { name: /^Examples?$/ }).click();
      await expect(tool.getByRole('button', { name: 'Convert', exact: true })).toBeEnabled();
      await tool.getByLabel('Start seconds', { exact: true }).fill('0.5');
      await tool.getByLabel('End seconds', { exact: true }).fill('1.5');
      await tool.getByRole('button', { name: 'Convert', exact: true }).click();
      await expect(tool.getByRole('alert')).toContainText(/out of sync.*keep this tab visible/i, { timeout: 15000 });
      await expect(tool.getByRole('link', { name: /^Download/ })).toHaveCount(0);
      await expect(tool.getByRole('button', { name: 'Convert', exact: true })).toBeEnabled();
      await expect.poll(() => page.evaluate(() => {
        const { streams, contexts, played } = window.__videoTimingResources;
        return played > 0 && streams.length > 0 && contexts.length > 0 && streams.every(s => s.getTracks().every(t => t.readyState === 'ended')) && contexts.every(c => c.state === 'closed');
      })).toBe(true);
      check(true, 'Slow playback is rejected with actionable error, no download, and released recording/audio resources.');
      await tool.getByRole('button', { name: 'Clear', exact: true }).click();
      await expect(tool.getByRole('alert')).toHaveCount(0);
      await tool.getByRole('button', { name: /^Examples?$/ }).click();
      await expect(tool.getByRole('button', { name: 'Convert', exact: true })).toBeEnabled();
      await tool.getByRole('button', { name: 'Convert', exact: true }).click();
      await tool.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(tool.getByRole('button', { name: 'Convert', exact: true })).toBeEnabled();
      await expect(tool.getByRole('link', { name: /^Download/ })).toHaveCount(0);
      await expect(tool.getByRole('alert')).toHaveCount(0);
      await expect.poll(() => page.evaluate(() => window.__videoTimingResources.streams.every(s => s.getTracks().every(t => t.readyState === 'ended')) && window.__videoTimingResources.contexts.every(c => c.state === 'closed'))).toBe(true);
      check(true, 'Cancel releases resources and restores usable controls without stale output or error.');
    } } : scenes ? { slug, async test({ tool, page, check }) {
      await tool.getByLabel('Video file', { exact: true }).setInputFiles(`${output}/scenes.webm`);
      await expect(tool.getByRole('button', { name: 'Convert', exact: true })).toBeEnabled();
      await tool.getByLabel('Start seconds', { exact: true }).fill('0.5');
      await tool.getByLabel('End seconds', { exact: true }).fill('1.5');
      if (slug === 'add-subtitles') await tool.getByLabel('Subtitles', { exact: true }).fill('1\n00:00:00,500 --> 00:00:01,500\nSelected scenes');
      await tool.getByRole('button', { name: 'Convert', exact: true }).click();
      await expect(tool.getByRole('link', { name: /^Download WEBM/ })).toBeVisible({ timeout: 15000 });
      const downloaded = page.waitForEvent('download');
      await tool.getByRole('link', { name: /^Download WEBM/ }).click();
      const download = await downloaded;
      const file = `${output}/${slug}-scenes.webm`;
      await download.saveAs(file);
      const pixel = time => [...execFileSync('ffmpeg', ['-v', 'error', '-ss', String(time), '-i', file, '-frames:v', '1', '-vf', 'format=rgb24,crop=1:1:2:2', '-f', 'rawvideo', 'pipe:1'])];
      const early = pixel(0.1), late = pixel(0.85);
      check(early[1] > 180 && early[0] < 60 && early[2] < 60, `Selected opening scene is green: ${early}.`);
      check(late[2] > 180 && late[0] < 60 && late[1] < 60, `Selected final scene is blue: ${late}.`);
      const packets = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', 'packet=pts_time', '-of', 'json', file], { encoding: 'utf8' })).packets;
      const duration = Number(packets.at(-1).pts_time);
      check(Math.abs(duration - 1) < 0.15, `Independent video packet timestamps cover the one-second selection (${duration}s).`);
    } } : cases.find(c => c.slug === slug);
    const result = await auditTool({ browser: instrumented, entry: { slug, category: 'Video' }, fixture, options: { base: process.env.QA_BASE ?? 'http://localhost:3190', engine: 'chrome', 'strip-dev-upgrade-csp': true }, expect, artifactsDir: output });
    results.push({ slug, functional: result.functional });
  }
} finally { await browser.close(); await server.close(); }
await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify({ output, results }, null, 2));
if (results.some(result => result.functional.status !== 'passed')) process.exitCode = 1;
