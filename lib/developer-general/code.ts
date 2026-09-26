import postcss from 'postcss';
export function minifyCss(input:string) {
 const root=postcss.parse(input);
 root.walkComments(c=>{if(!c.text.startsWith('!')) c.remove();});
 root.walk(node=>{node.raws.before='';node.raws.after='';if(node.type==='decl')node.raws.between=':';else if(node.type==='rule'||node.type==='atrule')node.raws.between='';});
 root.raws.after=''; return root.toString();
}
/** Preserve text whitespace and raw elements; only remove ordinary HTML comments. */
export function minifyHtml(input:string) {
 let result='', i=0;
 while(i<input.length){
  const raw=input.slice(i).match(/^<(script|style|pre|textarea)\b[^>]*>/i);
  if(raw){const end=new RegExp(`</${raw[1]}\\s*>`,'ig');end.lastIndex=i+raw[0].length;const m=end.exec(input);if(!m)throw new Error(`Unclosed ${raw[1]} element`);const stop=m.index+m[0].length;result+=input.slice(i,stop);i=stop;continue;}
  if(input.startsWith('<!--',i)){const end=input.indexOf('-->',i+4);if(end<0)throw new Error('Unclosed HTML comment');const comment=input.slice(i,end+3);if(/^<!--\[if/i.test(comment)||comment.startsWith('<!--!'))result+=comment;i=end+3;continue;}
  // Copy complete tags so quoted attributes and literal comment text remain intact.
  if(input[i]==='<'){let quote='',j=i+1;for(;j<input.length;j++){const c=input[j];if(quote){if(c===quote)quote='';}else if(c==='"'||c==="'")quote=c;else if(c==='>')break;}if(j===input.length)throw new Error('Unclosed HTML tag');result+=input.slice(i,j+1);i=j+1;continue;}
  result+=input[i++];
 }
 return result.trim();
}
export function cssSyntax(input:string){return postcss.parse(input);}
export function formatCss(input:string,indent='  '){
 const root=postcss.parse(input);
 root.walk(node=>{let depth=0;let p: import('postcss').Node | undefined = node.parent;while(p&&p.type!=='root'){depth++;p=p.parent;}
 node.raws.before='\n'+indent.repeat(depth);
 if(node.type==='decl')node.raws.between=': ';
 if(node.type==='rule'||node.type==='atrule'){node.raws.between=' ';if(node.nodes)node.raws.after='\n'+indent.repeat(depth);}
 });root.raws.after='\n';return root.toString().trim();
}
/** Reindent existing Python blocks; never infer blocks or rewrite literal contents. */
export function formatPython(input:string,indent='  '){
 const levels=[0];let triple='',brackets=0;
 return input.split('\n').map(line=>{
  let output=line;const leading=line.match(/^[ \t]*/)![0];const content=line.slice(leading.length);
  if(!triple&&brackets===0&&content&&!content.startsWith('#')){
   if(leading.includes('\t')&&leading.includes(' '))throw new Error('Mixed tabs and spaces in indentation');
   const width=leading.replace(/\t/g,'        ').length;
   if(width>levels[levels.length-1])levels.push(width);
   while(width<levels[levels.length-1])levels.pop();
   if(width!==levels[levels.length-1])throw new Error('Inconsistent Python indentation');
   output=indent.repeat(levels.length-1)+content;
  }
  let quote='';for(let i=0;i<line.length;i++){const c=line[i];if(c==='\\'){i++;continue;}if(triple){if(line.slice(i,i+3)===triple){triple='';i+=2;}continue;}if(quote){if(c===quote)quote='';continue;}if(c==='#')break;if(line.slice(i,i+3)==='"""'||line.slice(i,i+3)==="'''"){triple=line.slice(i,i+3);i+=2;}else if(c==='"'||c==="'")quote=c;else if('([{'.includes(c))brackets++;else if(')]}'.includes(c))brackets--;}
  if(brackets<0)throw new Error('Unbalanced Python brackets');return output;
 }).join('\n');
}
/** Indent block-tag boundaries while preserving inline/text/raw-element contents. */
export function formatHtml(input:string,indent='  '){
 const protectedParts:string[]=[];
 let text=input.replace(/<(script|style|pre|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,m=>{protectedParts.push(m);return `\u0000${protectedParts.length-1}\u0000`;});
 const block='html|head|body|main|section|article|header|footer|nav|div|ul|ol|li|table|thead|tbody|tr|form|p|h[1-6]';
 text=text.replace(new RegExp(`>(?=<(?:/?(?:${block})(?:\\s|>)))`,'gi'),'>\n');
 let depth=0;
 text=text.split('\n').map(line=>{const t=line.trim();if(!new RegExp(`^</?(?:${block})\\b`,'i').test(t))return line;if(new RegExp(`^</(?:${block})\\b`,'i').test(t))depth=Math.max(0,depth-1);const out=indent.repeat(depth)+t;
  const starts=new RegExp(`^<(?:${block})(?:\\s[^>]*|)>`,'i').test(t), closes=/<\/[^>]+>\s*$/.test(t);if(starts&&!closes)depth++;return out;
 }).join('\n');
 return text.replace(/\u0000(\d+)\u0000/g,(_,n)=>protectedParts[Number(n)]);
}
