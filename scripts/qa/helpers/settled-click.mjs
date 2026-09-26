/** Let native smooth scrolling finish before a single ordinary pointer click.
 * WebKit can otherwise move a button between pointerdown and pointerup, so the
 * resulting click targets its parent and the React action never runs.
 */
export async function clickWhenSettled(locator) {
  await locator.scrollIntoViewIfNeeded();
  await locator.evaluate(element => element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' }));
  await locator.evaluate(element => new Promise((resolve, reject) => {
    let frame;
    let previous;
    let stableSince = performance.now();
    const cleanup = () => { clearTimeout(timeout); cancelAnimationFrame(frame); };
    const timeout = setTimeout(() => { cleanup(); reject(new Error('Click target did not stop scrolling within 5 seconds.')); }, 5000);
    const sample = now => {
      if (!element.isConnected) { cleanup(); reject(new Error('Click target detached while scrolling.')); return; }
      const rect = element.getBoundingClientRect();
      const current = [rect.x, rect.y, rect.width, rect.height, window.scrollX, window.scrollY];
      if (!previous || current.some((value, index) => Math.abs(value - previous[index]) > 0.25)) stableSince = now;
      previous = current;
      // Observe a quiet interval across several animation frames. This waits on
      // geometry, rather than sleeping a fixed amount or retrying the action.
      if (now - stableSince >= 120) { cleanup(); resolve(); return; }
      frame = requestAnimationFrame(sample);
    };
    frame = requestAnimationFrame(sample);
  }));
  await locator.click();
}
