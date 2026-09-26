import { escapeJson, unescapeJson, decodeHtml } from './primitives';
export type EscapeContext = 'json' | 'javascript' | 'regex' | 'html' | 'general';
export function escapeString(str: string, context: EscapeContext): string {
  if (context === 'json') return escapeJson(str);
  if (context === 'javascript') return escapeJson(str).replace(/'/g,"\\'").replace(/</g,'\\x3C').replace(/>/g,'\\x3E');
  if (context === 'html') return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  if (context === 'regex') return str.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/\t/g,'\\t');
  return str.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/\t/g,'\\t');
}
export function unescapeString(str: string, context: EscapeContext): string {
  if (context === 'json') return unescapeJson(str);
  if (context === 'html') return decodeHtml(str);
  if (context === 'javascript' && /(?:^|[^\\])(?:\\\\)*\\0[0-9]/.test(str)) throw new Error('Legacy octal escapes are not supported.');
  return str.replace(/\\(?:u\{[0-9a-fA-F]{1,6}\}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|[\s\S]|$)/g, token=>{
    const c=token.slice(1);
    if(c==='\\')return '\\';
    const controls:Record<string,string>={n:'\n',r:'\r',t:'\t'};
    if(Object.hasOwn(controls,c))return controls[c];
    if(context==='javascript'){
      if(!c)throw new Error('Incomplete escape.');
      if(/^[xu]/.test(c)){
        if(/^u\{/.test(c))return String.fromCodePoint(parseInt(c.slice(2,-1),16));
        if(!/^(?:u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2})$/.test(c))throw new Error('Invalid Unicode or hex escape.');
        return String.fromCharCode(parseInt(c.slice(1),16));
      }
      const extra:Record<string,string>={b:'\b',f:'\f',v:'\v','0':'\0','\n':'','\r':''};
      return Object.hasOwn(extra,c)?extra[c]:c;
    }
    if(context==='regex'&&/^[.*+?^${}()|[\]]$/.test(c))return c;
    return token;
  });
}
