export function httpUrl(value:string) {
 const url=new URL(value.trim());
 if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw new Error('Enter an absolute HTTP(S) URL without embedded credentials.');
 return url.href;
}
export async function boundedText(response:Response, signal:AbortSignal, limit=1000000){
 if(!response.body)return '';
 const reader=response.body.getReader();const chunks:Uint8Array[]=[];let size=0;
 try {while(true){signal.throwIfAborted();const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>limit)throw new Error('Response exceeds the 1 MB limit');chunks.push(value);}}
 finally {await reader.cancel().catch(()=>{});reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}return new TextDecoder().decode(bytes);
}
