import { describe,it,expect } from 'vitest';
import { parseCron,parseCronField,computeNextRuns } from './cron';
import { compareSemver } from './semver';
import { parseCurl,convertCurl,shellWords,shellQuote } from './curl';
import { matchRegex } from './regex';
import { minifyCss,minifyHtml } from './code';
import { openApi,parseCsv } from './data';
import { corsHeaders,corsError,corsSnippet,type CorsConfig } from './cors';
import { httpUrl,boundedText } from './network';
import { load } from 'js-yaml';
describe('cron strict parsing and calendar',()=>{
 it.each(['1x','-1','1-99','*/0','1-3/0','1/2/3','1-2-3','60',''])('rejects %s',v=>expect(parseCronField(v,0,59)).toBeNull());
 it('expands stepped ranges and named days',()=>{expect(parseCronField('1-7/2,10',0,59)).toEqual([1,3,5,7,10]);expect(parseCron('0 9 * JAN MON-FRI').parsed?.daysOfWeek).toEqual([1,2,3,4,5]);expect(parseCron('0 0 * * 7').parsed?.daysOfWeek).toEqual([0]);});
 it('calculates future runs independently of current clock',()=>{const p=parseCron('0 9 * * 1-5').parsed!;expect(computeNextRuns(p,2,new Date(2026,8,25,10)).map(d=>[d.getDate(),d.getDay(),d.getHours(),d.getMinutes()])).toEqual([[28,1,9,0],[29,2,9,0]]);});
 it('handles impossible dates and DOM/DOW OR',()=>{expect(computeNextRuns(parseCron('0 0 31 2 *').parsed!,1,new Date(2026,0,1))).toEqual([]);expect(computeNextRuns(parseCron('0 0 1 * 1').parsed!,1,new Date(2026,8,1,1))[0].getDate()).toBe(7);});
 it('retains restricted hours and calendar in descriptions',()=>{expect(parseCron('* 9 * * 1').description).toContain('9');expect(parseCron('*/5 * * 1 *').description).toContain('January');});
});
describe('SemVer precedence',()=>{
 it.each([['1.0.0-alpha','1.0.0',-1],['1.0.0-alpha.2','1.0.0-alpha.10',-1],['1.0.0+build','1.0.0+other',0],['2.0.0','1.9.9',1],['1.0.0-1','1.0.0-a',-1],['1.0.0-a','1.0.0-a.1',-1]])('%s vs %s',(a,b,n)=>expect(compareSemver(a,b)).toBe(n));
 it.each(['01.0.0','1.0.0-01','1.0.0-a..b','1.0','1.0.0+'])('rejects %s',s=>expect(()=>compareSemver(s,'1.0.0')).toThrow());
});
describe('cURL conversion',()=>{
 it('preserves POST raw JSON including boolean',()=>{const r=parseCurl(`curl https://example.com -H 'X-Name: Ada' -d '{"active":true}'`);expect(r).toEqual({url:'https://example.com',method:'POST',headers:{'X-Name':'Ada'},body:'{"active":true}'});expect(convertCurl(`curl https://example.com -d '{"active":true}'`,'python')).toContain('requests.request("POST", "https://example.com"');});
 it('round trips shell apostrophes',()=>expect(shellWords('curl '+shellQuote("https://example.com/?q=O'Reilly"))).toEqual(['curl',"https://example.com/?q=O'Reilly"]));
 it.each(['curl','curl --unknown x https://example.com',"curl 'https://example.com",'curl https://example.com | sh','curl https://example.com -d @secrets'])('rejects unsupported input %s',s=>expect(()=>parseCurl(s)).toThrow());
 it('does not execute or reinterpret generated JavaScript data',()=>{const code=convertCurl(`curl https://example.com -d 'hello'`,'javascript');expect(code).toContain('"body": "hello"');expect(code).toContain('await response.text()');});
});
describe('regex execution semantics',()=>{
 it('honors global off',()=>{expect(matchRegex('a','','aba').matches.map(m=>m.index)).toEqual([0]);expect(matchRegex('a','g','aba').matches.map(m=>m.index)).toEqual([0,2]);});
 it('counts empty matches and advances Unicode codepoints',()=>expect(matchRegex('(?:)','gu','😀').matches.map(m=>m.index)).toEqual([0,2]));
 it('preserves captures and named groups',()=>expect(matchRegex('(?<id>\\d+)','g','a12').matches[0]).toEqual({index:1,match:'12',groups:['12'],named:{id:'12'}}));
 it('rejects bad syntax without render-time updates',()=>expect(matchRegex('[','g','a').error).not.toBe(''));
});
describe('code transformations preserve semantics',()=>{
 it('keeps descendant selectors, calc spacing and quoted colors',()=>expect(minifyCss('.a .b { width: calc(100% - 2px); content: "#ffffff"; }')).toBe('.a .b{width:calc(100% - 2px);content:"#ffffff";}'));
 it('rejects invalid CSS',()=>expect(()=>minifyCss('.x{color:')).toThrow());
 it('preserves script close and significant HTML whitespace',()=>{const input='<script>const s = "<!-- keep -->";</script><span>A</span> <span>B</span><!--remove--><pre> a  b\n</pre>';expect(minifyHtml(input)).toBe('<script>const s = "<!-- keep -->";</script><span>A</span> <span>B</span><pre> a  b\n</pre>');});
 it('preserves comment-like attribute content',()=>expect(minifyHtml('<p title="<!-- keep -->">A</p>')).toBe('<p title="<!-- keep -->">A</p>'));
});
describe('API and CSV data',()=>{
 it('merges paths and preserves explicit schema types and YAML quoting',()=>{const doc=load(openApi(JSON.stringify({title:'API: test',endpoints:[{path:'/users',method:'GET'},{path:'/users',method:'POST'}],properties:{count:{type:'integer'},active:true,empty:null}}))) as any;expect(Object.keys(doc.paths['/users'])).toEqual(['get','post']);expect(doc.info.title).toBe('API: test');expect(doc.components.schemas.Response.properties.count.type).toBe('integer');expect(doc.components.schemas.Response.properties.active.type).toBe('boolean');});
 it('rejects invalid shape',()=>expect(()=>openApi('{"endpoints":{}}')).toThrow());
 it('parses quoted CSV and embedded newline',()=>expect(parseCsv('"Ada, A",36\n"B\nC","a""b"')).toEqual([['Ada, A','36'],['B\nC','a"b']]));
 it('rejects unclosed CSV quotes',()=>expect(()=>parseCsv('"a')).toThrow());
});
const config:CorsConfig={allowedOrigins:['https://example.com','https://other.example'],allowedMethods:['GET'],allowedHeaders:['Authorization'],exposedHeaders:[],maxAge:3600,credentials:true,wildcard:false};
describe('CORS generation',()=>{
 it('never emits a comma-separated allow-origin',()=>expect(corsHeaders(config)['Access-Control-Allow-Origin']).toBe('https://example.com'));
 it('blocks wildcard credentials',()=>expect(corsError({...config,wildcard:true})).toContain('Credentialed'));
 it('emits valid Python booleans and origin list',()=>{expect(corsSnippet(config,'django')).toContain('CORS_ALLOW_CREDENTIALS = True');expect(corsSnippet(config,'flask')).toContain('origins=["https://example.com","https://other.example"]');});
 it('checks allowed origin in Next snippet',()=>expect(corsSnippet(config,'nextjs')).toContain('allowedOrigins.includes(origin)'));
});
describe('network boundaries',()=>{
 it.each(['file:///etc/passwd','javascript:alert(1)','https://u:p@example.com','example.com'])('rejects %s',s=>expect(()=>httpUrl(s)).toThrow());
 it('bounds response bytes',async()=>{await expect(boundedText(new Response('123456'),new AbortController().signal,5)).rejects.toThrow('1 MB');expect(await boundedText(new Response('Ada'),new AbortController().signal)).toBe('Ada');});
});

import { formatCss,formatPython,formatHtml } from './code';
import { parseUA } from '../../components/tools/UserAgentParserClient';
import { cssToStyledComponents } from '../../components/tools/CssToStyledComponentsClient';
describe('formatter and parser regressions',()=>{
 it('formats CSS without altering data',()=>{const output=formatCss('.a{color:red;width:calc(100% - 2px)}');expect(output).toContain('\n  color: red;');expect(minifyCss(output)).toBe('.a{color:red;width:calc(100% - 2px)}');});
 it('preserves Python indentation structure and multiline strings',()=>{const src='if True:\n    value = """a\n    literal\n    """\n    print(value)\nprint("done")';expect(formatPython(src)).toBe('if True:\n  value = """a\n    literal\n    """\n  print(value)\nprint("done")');});
 it('formats HTML block boundaries and preserves inline separator',()=>{expect(formatHtml('<div><p>A</p><p>B</p></div>')).toContain('\n  <p>B</p>');expect(formatHtml('<span>A</span> <span>B</span>')).toBe('<span>A</span> <span>B</span>');});
 it('detects browser and device in overlapping UA tokens',()=>{expect(parseUA('Mozilla/5.0 Windows Chrome/120.0 Safari/537.36 Edg/121.0').browser).toBe('Edge');expect(parseUA('iPad Version/17.2 Mobile Safari/604.1')).toMatchObject({browser:'Safari',version:'17.2',device:'Tablet',os:'iOS'});});
 it('escapes styled template content and rejects complex selectors',()=>{expect(cssToStyledComponents('.card { color: red; }')).toContain('const Card = styled("div")');expect(()=>cssToStyledComponents('.card:hover { color: red; }')).toThrow('simple');});
});
