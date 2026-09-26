import fs from 'node:fs/promises';
import path from 'node:path';

// Probe the native browser API before installing any controlled lifecycle fixture.
// No fake audio, permission grant, or invented transcript is used.
export async function probeNativeSpeech(ctx, kind) {
  const observation = await ctx.page.evaluate(async kind => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const supported = kind === 'recognition' ? Boolean(Recognition) : Boolean(window.speechSynthesis && window.SpeechSynthesisUtterance);
    const base = {mode:'native-browser-capability',kind,supported,secureContext:isSecureContext,
      acceptance:'unverified',blocker:kind==='recognition'?'No known spoken audio supplied; recognition accuracy cannot be accepted.':'Audible output is not independently monitored.'};
    if (!supported) return {...base,outcome:'unsupported',blocker:'Native browser API absent.'};
    return new Promise(resolve=>{
      let timer, api, settled=false;const events=[];
      const finish=outcome=>{
        if(settled)return;settled=true;clearTimeout(timer);
        const blocker = outcome.startsWith('error:') || outcome.startsWith('exception:')
          ? `${outcome}. ${base.blocker}`
          : outcome === 'no-terminal-event-within-4s' ? `Native API supplied no terminal event within 4 seconds. ${base.blocker}` : base.blocker;
        resolve({...base,outcome,blocker,events,voices:kind==='synthesis'?speechSynthesis.getVoices().map(v=>({name:v.name,lang:v.lang})):undefined});
        try {if(kind==='recognition')api?.abort();else speechSynthesis.cancel();}catch{}
      };
      timer=setTimeout(()=>finish('no-terminal-event-within-4s'),4000);
      try {
        if(kind==='recognition') {
          api=new Recognition();api.lang='en-US';
          api.onstart=()=>events.push('start');
          api.onresult=e=>{events.push(`result-count:${e.results.length}`);finish('result-observed-without-known-audio');};
          api.onerror=e=>{events.push(e.error);finish(`error:${e.error}`);};
          api.onend=()=>finish('ended-without-known-transcript');api.start();
        } else {
          api=new SpeechSynthesisUtterance('Browser capability check.');
          api.onstart=()=>events.push('start');api.onend=()=>finish('end-event-observed-audio-unverified');
          api.onerror=e=>finish(`error:${e.error}`);speechSynthesis.speak(api);
        }
      } catch(e){finish(`exception:${e.name}:${e.message}`);}
    });
  },kind);
  await fs.mkdir(ctx.artifactsDir,{recursive:true});
  await fs.writeFile(path.join(ctx.artifactsDir,`native-${kind}.json`),JSON.stringify(observation,null,2));
  ctx.check(true,`Native ${kind} observation: ${observation.outcome}; acceptance=${observation.acceptance}; blocker=${observation.blocker}`);
  return observation;
}
