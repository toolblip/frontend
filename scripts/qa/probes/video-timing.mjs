/** Dedicated safety regression; passing this does NOT mean successful export QA passed.
 * node scripts/qa/probes/video-timing.mjs [--webkit] [--headed] [--force-drift | --scenes] [--single-chunk]
 * QA_BASE selects the server; QA_OUT must be a new directory. Otherwise output is unique.
 * QA_WEBKIT_EXECUTABLE optionally selects WebKit. Normal mode runs strict export fixtures.
 * QA_TRUNCATED_WEBM=/path/to/known-bad.webm injects encoded bytes to test rejection,
 * never successful export acceptance. --single-chunk is a diagnostic override.
 */
import { chromium, webkit, expect } from '@playwright/test';
import { mkdir, mkdtemp, writeFile, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { auditTool } from '../browser.mjs';
import cases from '../cases/media-conversion.mjs';

const forced = process.argv.includes('--force-drift');
const truncatedPath = process.env.QA_TRUNCATED_WEBM;
const truncated = truncatedPath ? (await readFile(truncatedPath)).toString('base64') : null;
const headed = process.argv.includes('--headed');
const scenes = process.argv.includes('--scenes');
const singleChunk = process.argv.includes('--single-chunk');
const engine = process.argv.includes('--webkit') ? 'webkit' : 'chrome';
const base = process.env.QA_BASE ?? 'http://localhost:3190';
const baseURL = new URL(base);
// Only loopback HTTP development needs this override. Production CSP is untouched.
const stripDevUpgradeCsp = baseURL.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(baseURL.hostname);
let output;
if (process.env.QA_OUT) {
  output = path.resolve(process.env.QA_OUT);
  await mkdir(path.dirname(output), { recursive: true });
  await mkdir(output); // EEXIST deliberately protects prior evidence, even an empty directory.
} else {
  output = await mkdtemp(path.join(tmpdir(), `toolblip-video-${engine}-${forced ? 'drift' : scenes ? 'scenes' : 'export'}-${headed ? 'headed' : 'headless'}-`));
}
if (scenes) execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', "color=c=red:s=64x48:r=30:d=2,drawbox=c=lime:t=fill:enable='between(t,0.5,0.999)',drawbox=c=blue:t=fill:enable='between(t,1,1.499)',drawbox=c=yellow:t=fill:enable='gte(t,1.5)'", '-f', 'lavfi', '-i', 'sine=frequency=440:sample_rate=48000:duration=2', '-c:v', 'libvpx', '-c:a', 'libopus', '-shortest', `${output}/scenes.webm`]);
const browserType = engine === 'webkit' ? webkit : chromium;
const server = await browserType.launchServer({ headless: !headed,
  ...(engine === 'chrome' ? { channel: 'chrome' } : process.env.QA_WEBKIT_EXECUTABLE ? { executablePath: process.env.QA_WEBKIT_EXECUTABLE } : {}),
});
const browser = await browserType.connect(server.wsEndpoint());
const results = [];
try {
  const instrumented = { async newContext(options) {
    const context = await browser.newContext(options);
    await context.addInitScript(({ forced, singleChunk, truncated }) => {
      window.__videoTimingResources = { streams: [], contexts: [], played: 0, events: [] };
      const state = window.__videoTimingResources;
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        state.played++;
        state.video = this;
        state.events.push({kind:'play-call',at:performance.now(),time:this.currentTime});
        if (forced) this.playbackRate = 0.1;
        return play.call(this).then(value=>{state.events.push({kind:'play-resolved',at:performance.now(),time:this.currentTime});return value;});
      };
      const capture = HTMLCanvasElement.prototype.captureStream;
      HTMLCanvasElement.prototype.captureStream = function (...args) {
        const stream = capture.apply(this, args); state.streams.push(stream); return stream;
      };
      const NativeMediaRecorder = window.MediaRecorder;
      window.MediaRecorder = class extends NativeMediaRecorder {
        constructor(...args) { super(...args);
          // Fault injection only: replace native encoded bytes with a known
          // truncated artifact to exercise the built product's rejection path.
          if (truncated) this.addEventListener('dataavailable',event=>{if(!event.isTrusted)return;event.stopImmediatePropagation();this.dispatchEvent(new BlobEvent('dataavailable',{data:new Blob([Uint8Array.from(atob(truncated),character=>character.charCodeAt(0))],{type:'video/webm'})}));});
          for (const kind of ['start','stop','dataavailable','error']) this.addEventListener(kind,event=>state.events.push({kind,at:performance.now(),videoTime:state.video?.currentTime,bytes:event.data?.size})); }
        start(...args) { state.events.push({kind:'start-call',at:performance.now(),videoTime:state.video?.currentTime});return singleChunk ? super.start() : super.start(...args); }
        stop(...args) { state.events.push({kind:'stop-call',at:performance.now(),videoTime:state.video?.currentTime});return super.stop(...args); }
      };
      const NativeAudioContext = window.AudioContext;
      window.AudioContext = class extends NativeAudioContext {
        constructor(...args) { super(...args); state.contexts.push(this); }
      };
    }, { forced, singleChunk, truncated });
    return context;
  } };
  for (const slug of ['cutter', 'add-subtitles']) {
    const artifactsDir = path.join(output, 'artifacts', slug);
    await mkdir(artifactsDir, { recursive: true });
    const fixture = forced || truncated ? { slug, async test({ tool, page, check }) {
      await tool.getByRole('button', { name: /^Examples?$/ }).click();
      await expect(tool.getByRole('button', { name: 'Convert', exact: true })).toBeEnabled();
      await tool.getByLabel('Start seconds', { exact: true }).fill('0.5');
      await tool.getByLabel('End seconds', { exact: true }).fill('1.5');
      await tool.getByRole('button', { name: 'Convert', exact: true }).click();
      await expect(tool.getByRole('alert')).toContainText(truncated ? /encoder dropped.*keep this tab visible.*try again/i : /out of sync.*keep this tab visible/i, { timeout: 15000 });
      await expect(tool.getByRole('link', { name: /^Download/ })).toHaveCount(0);
      await expect(tool.getByRole('button', { name: 'Convert', exact: true })).toBeEnabled();
      await expect.poll(() => page.evaluate(() => {
        const { streams, contexts, played } = window.__videoTimingResources;
        return played > 0 && streams.length > 0 && contexts.length > 0 && streams.every(s => s.getTracks().every(t => t.readyState === 'ended')) && contexts.every(c => c.state === 'closed');
      })).toBe(true);
      check(true, `${truncated ? 'Known truncated encoded output' : 'Slow playback'} is rejected with actionable error, no download, and released recording/audio resources.`);
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
      const outputLink = tool.getByRole('link', { name: /^Download WEBM/ });
      const alert = tool.getByRole('alert');
      await expect(outputLink.or(alert)).toBeVisible({ timeout: 15000 });
      await writeFile(path.join(artifactsDir,'timing-events.json'),JSON.stringify(await page.evaluate(()=>window.__videoTimingResources.events),null,2));
      if (await alert.count()) check(false, `Export rejected: ${await alert.innerText()}`);
      const [download] = await Promise.all([page.waitForEvent('download'),tool.getByRole('link', { name: /^Download WEBM/ }).click()]);
      const file = path.join(artifactsDir, `${slug}-scenes.webm`);
      await download.saveAs(file);
      const pixel = (file,time) => [...execFileSync('ffmpeg', ['-v', 'error', '-ss', String(time), '-i', file, '-frames:v', '1', '-vf', 'format=rgb24,crop=1:1:2:2', '-f', 'rawvideo', 'pipe:1'])];
      const references = ['red','green','blue','yellow'].map((name,index)=>({name,rgb:pixel(`${output}/scenes.webm`,index*0.5+0.1)}));
      const nearest = rgb => rgb.length !== 3 ? 'missing-frame' : references.map(scene=>({...scene,distance:scene.rgb.reduce((sum,value,index)=>sum+(value-rgb[index])**2,0)})).sort((a,b)=>a.distance-b.distance)[0].name;
      const early = pixel(file,0.1), late = pixel(file,0.85);
      check(nearest(early)==='green', `Opening scene is nearest to source green: ${early}.`);
      check(nearest(late)==='blue', `Final scene is nearest to source blue: ${late}.`);
      const packets = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', 'packet=pts_time', '-of', 'json', file], { encoding: 'utf8' })).packets;
      const duration = Number(packets.at(-1).pts_time);
      check(Math.abs(duration - 1) < 0.15, `Independent video packet timestamps cover the one-second selection (${duration}s).`);
      const audioPackets = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'packet=pts_time,duration_time', '-of', 'json', file], { encoding: 'utf8' })).packets;
      const audioEnd = Number(audioPackets.at(-1)?.pts_time) + Number(audioPackets.at(-1)?.duration_time || 0);
      check(Math.abs(audioEnd - 1) < 0.15, `Independent audio packets cover the one-second selection (${audioEnd}s).`);
    } } : cases.find(c => c.slug === slug);
    const result = await auditTool({ browser: instrumented, entry: { slug, category: 'Video' }, fixture, options: { base, engine, 'strip-dev-upgrade-csp': stripDevUpgradeCsp }, expect, artifactsDir });
    results.push(result);
    await writeFile(path.join(artifactsDir, 'audit.json'), JSON.stringify(result, null, 2), { flag: 'wx' });
  }
} finally { await browser.close(); await server.close(); }
await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2), { flag: 'wx' });
console.log(JSON.stringify({ output, base, engine, stripDevUpgradeCsp, results }, null, 2));
if (results.some(result => result.status !== 'passed' || result.functional.status !== 'passed')) process.exitCode = 1;
