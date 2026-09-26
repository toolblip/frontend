import { compileString } from 'sass';
self.onmessage = (event: MessageEvent<{input:string;syntax:'scss'|'indented'}>) => {
  try { const result=compileString(event.data.input,{syntax:event.data.syntax});self.postMessage({output:result.css}); }
  catch(e) { self.postMessage({error:e instanceof Error?e.message:'Compilation failed.'}); }
};
