export interface RegexResult { matches: {index:number;match:string;groups:(string|undefined)[];named:Record<string,string>}[]; segments:{text:string;hit:boolean}[]; count:number; error:string; }
// Self-contained so the exact tested matcher can run in a disposable browser worker.
export function matchRegex(pattern: string, flags: string, sample: string): RegexResult {
 const result: RegexResult = {matches:[],segments:[],count:0,error:''};
 try {
  if (pattern.length > 2000 || sample.length > 50000) throw new Error('Limit: 2,000 pattern and 50,000 test characters');
  if (!pattern) return {...result,segments:[{text:sample,hit:false}]};
  const re = new RegExp(pattern, flags); let m: RegExpExecArray | null; let last = 0;
  while ((m = re.exec(sample)) !== null) {
   if (result.matches.length === 1000) throw new Error('Match limit exceeded (1,000); shorten the test string');
   if (m.index > last) result.segments.push({text:sample.slice(last,m.index),hit:false});
   result.segments.push({text:m[0],hit:true}); last=m.index+m[0].length;
   result.matches.push({index:m.index,match:m[0],groups:m.slice(1),named:{...m.groups}});
   if (!re.global) break;
   if (!m[0]) re.lastIndex += re.unicode && (sample.codePointAt(re.lastIndex) ?? 0) > 0xffff ? 2 : 1;
  }
  if (last < sample.length) result.segments.push({text:sample.slice(last),hit:false});
  result.count=result.matches.length;
 } catch(e) {return {matches:[],segments:[{text:sample,hit:false}],count:0,error:(e as Error).message};}
 return result;
}
