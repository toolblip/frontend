import { afterEach, describe, expect, it, vi } from 'vitest';
import { createResultUrl } from './result-url';
afterEach(() => vi.restoreAllMocks());
function setup() {
  const events: string[] = [];
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:result');
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => { events.push('revoke'); });
  let src: string | null = 'blob:result';
  const media = { getAttribute: () => src, setAttribute: (name: string, value: string) => { src = value; events.push(`set:${name}:${value}`); }, pause: () => events.push('pause'), removeAttribute: (name: string) => { src = null; events.push(`remove:${name}`); }, load: () => events.push('load') } as unknown as HTMLMediaElement;
  return { events, media, owner: createResultUrl(new Blob(['result'])) };
}
describe('converted result URL ownership', () => {
  it('stops and resets an attached media preview before revoking its URL', () => {
    const { events, media, owner } = setup(); owner.attachPreview(media); owner.dispose();
    expect(events).toEqual(['pause', 'remove:src', 'load', 'revoke']);
    owner.attachPreview(null); owner.dispose(); expect(events).toHaveLength(4);
  });
  it('resets previews on React ref detach before later unmount revocation', () => {
    const { events, media, owner } = setup(); owner.attachPreview(media); owner.attachPreview(null);
    expect(events).toEqual(['pause', 'remove:src', 'load']); owner.dispose(); expect(events.at(-1)).toBe('revoke');
  });
  it('detaches an image source without invoking media APIs', () => {
    const { events, owner } = setup(); const image = { getAttribute: () => 'blob:result', removeAttribute: (name: string) => events.push(`remove:${name}`) } as unknown as HTMLImageElement;
    owner.attachPreview(image); owner.dispose(); expect(events).toEqual(['remove:src', 'revoke']);
  });
});

it('restores the owned source after StrictMode ref detach and reattachment',()=>{
  const {events,media,owner}=setup();owner.attachPreview(media);owner.attachPreview(null);owner.attachPreview(media);
  expect(media.getAttribute('src')).toBe('blob:result');expect(events).toEqual(['pause','remove:src','load','set:src:blob:result']);
});
it('restores a replacement preview and leaves late attachments detached after disposal',()=>{
  const {events,media,owner}=setup();owner.attachPreview(media);
  let src:string|null=null;
  const replacement={getAttribute:()=>src,setAttribute:(_name:string,value:string)=>{src=value;},removeAttribute:()=>{src=null;},pause:vi.fn(),load:vi.fn()} as unknown as HTMLMediaElement;
  owner.attachPreview(replacement);expect(src).toBe('blob:result');expect(events).toEqual(['pause','remove:src','load']);
  owner.dispose();expect(src).toBeNull();owner.attachPreview(media);expect(media.getAttribute('src')).toBeNull();
});
