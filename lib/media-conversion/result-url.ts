type Preview = HTMLMediaElement | HTMLImageElement;
/** The URL owner also detaches consumers, before cancellation or unmount revokes it. */
export function createResultUrl(blob: Blob) {
  const url = URL.createObjectURL(blob);
  let preview: Preview | null = null;
  let disposed = false;
  const detach = () => {
    const element = preview;
    preview = null;
    if (!element) return;
    if ('pause' in element) element.pause();
    element.removeAttribute('src');
    if ('load' in element) element.load();
  };
  return {
    url,
    attachPreview(element: Preview | null) {
      if (preview === element) return;
      detach();
      preview = element;
      if (disposed) detach();
      else if (element && element.getAttribute('src') !== url) element.setAttribute('src', url);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      detach();
      URL.revokeObjectURL(url);
    },
  };
}
export type ResultUrl = ReturnType<typeof createResultUrl>;
