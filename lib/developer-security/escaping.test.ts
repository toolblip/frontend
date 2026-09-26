import {it,expect} from 'vitest';
import {escapeString,unescapeString} from './escaping';
it('JavaScript escaping uses known control and quote sequences',()=>{
 expect(escapeString("'\n\u0000<",'javascript')).toBe("\\'\\n\\u0000\\x3C");
 expect(unescapeString('\\u{1F600}\\x3C\\b','javascript')).toBe('😀<\b');
 for(const s of ['\\xZZ','\\uGGGG','\\u{110000}','\\'])expect(()=>unescapeString(s,'javascript')).toThrow();
});
it('regex unescape preserves operators like backslash-d but decodes escaped literals once',()=>{
 expect(escapeString('a+b.[x]\\n','regex')).toBe('a\\+b\\.\\[x\\]\\\\n');
 expect(unescapeString('\\d\\+\\\\n','regex')).toBe('\\d+\\n');
});
it('general escaping preserves literal escape text',()=>{
 expect(unescapeString('C:\\\\new\\nfile','general')).toBe('C:\\new\nfile');
});
