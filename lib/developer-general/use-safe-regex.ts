'use client';
import { useEffect, useState } from 'react';
import { matchRegex, type RegexResult } from './regex';
export function useSafeRegex(pattern:string, flags:string, sample:string): RegexResult {
 const [state,setState]=useState<{key:string;result:RegexResult}|null>(null);
 const key=JSON.stringify([pattern,flags,sample]);
 useEffect(()=>{
  const empty:RegexResult={matches:[],segments:[{text:sample,hit:false}],count:0,error:''};
  if (!pattern) {setState({key,result:empty});return;}
  let worker:Worker|undefined; let timer:ReturnType<typeof setTimeout>|undefined; let url=''; let active=true;
  const finish=(result:RegexResult)=>{if(active)setState({key,result});worker?.terminate();clearTimeout(timer);};
  try {
   url=URL.createObjectURL(new Blob([`const match = ${matchRegex.toString()}; onmessage = e => postMessage(match(...e.data));`],{type:'text/javascript'}));
   worker=new Worker(url); worker.onmessage=e=>finish(e.data);worker.onerror=()=>finish({...empty,error:'Regex worker unavailable'});
   timer=setTimeout(()=>finish({...empty,error:'Regex exceeded the 500 ms time limit'}),500);
   worker.postMessage([pattern,flags,sample]);
  }catch(e){finish({...empty,error:(e as Error).message});}
  return ()=>{active=false;worker?.terminate();clearTimeout(timer);if(url)URL.revokeObjectURL(url);};
 },[key,pattern,flags,sample]);
 return state?.key===key ? state.result : {matches:[],segments:[],count:0,error:''};
}
