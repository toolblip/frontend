// Classifications annotate raw records; they never delete or rewrite browser evidence.
const parseURL = value => { try { return new URL(value); } catch { return null; } };
const resourceFailure = /^Failed to load resource: the server responded with a status of (\d{3})(?: \([^\n]*\))?\.?$/;
const abortedResourceFailure = /^Failed to load resource: (?:net::ERR_FAILED|An error occurred while loading the resource\.)$/;
const injectedFailure = record => record.requestId && record.injectedAbort?.requestId === record.requestId && record.injectedAbort.errorCode === 'failed' && typeof record.injectedAbort.reason === 'string' && record.injectedAbort.reason.trim() && Number.isInteger(record.injectedAbort.sequence) && record.injectedAbort.sequence < record.sequence && ['net::ERR_FAILED', 'Failed', 'An error occurred while loading the resource.'].includes(record.failure?.errorText);
const beacon = /^https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js(?:\/[^\s'"<>]*)?(?:\?[^\s'"<>]*)?$/;

export function validateExpectations(fixture = {}) {
  const http = fixture.expectedHttpErrors ?? [];
  const console = fixture.expectedConsoleErrors ?? [];
  if (!Array.isArray(http) || http.some(r=>!r || typeof r.pathname !== 'string' || !r.pathname.startsWith('/') || r.pathname.startsWith('//') || /[?\u0023*]/.test(r.pathname) || new URL(r.pathname,'https://qa.invalid').pathname !== r.pathname || !Number.isInteger(r.status) || r.status < 400 || r.status > 599 || typeof r.reason !== 'string' || !r.reason.trim())) throw Error('Invalid expectedHttpErrors: exact pathname, status and reason required');
  if (!Array.isArray(console) || console.some(r=>!r || typeof r.text !== 'string' || Number(r.text.match(resourceFailure)?.[1]) !== r.status || !http.some(h=>h.pathname === r.pathname && h.status === r.status))) throw Error('Invalid expectedConsoleErrors: exact browser resource-failure text and matching expectedHttpErrors rule required');
}

export function classifyRuntime(runtime, base, fixture) {
  validateExpectations(fixture);
  const origin = new URL(base).origin;
  const annotate = (record,classification,reason,extra={}) => Object.assign(record,{blocking:false,classification,reason,...extra});
  for (const kind of ['pageErrors','consoleErrors','httpErrors']) for (const record of runtime[kind]) Object.assign(record,{blocking:true,classification:'unclassified',reason:'Unrecognized runtime error'});
  for (const record of runtime.failedRequests ?? []) Object.assign(record,{blocking:false,classification:'discovery',reason:'Request failure retained as discovery evidence; HTTP, console and page errors are evaluated separately'});
  for (const record of runtime.failedRequests ?? []) if (injectedFailure(record)) annotate(record,'expected-fixture-abort',record.injectedAbort.reason);
  const linkedAborts = new Set();
  runtime.httpErrors.forEach(record=>{
    const url = parseURL(record.url);
    if (url?.origin !== origin) return;
    if (url.pathname === '/api/auth/me' && record.status === 401 && record.method === 'GET') {
      annotate(record,'anonymous-auth-probe','Expected anonymous GET /api/auth/me returns 401 in a fresh unauthenticated context');
    } else {
      const rule = fixture?.expectedHttpErrors?.find(r=>r.pathname === url.pathname && r.status === record.status);
      if (rule) annotate(record,'expected-fixture-http',rule.reason);
    }
  });
  runtime.consoleErrors.forEach(record=>{
    const text = record.text;
    // Chrome and WebKit use different CSP wording. Require a script-loading refusal,
    // CSP wording, and the exact beacon host/path, not a general analytics substring.
    const scriptCSP = /^(?:Refused to load the script|Loading the script|Refused to load) ['"]?(https:\/\/[^'"\s]+)['"]?/.exec(text);
    if (scriptCSP && beacon.test(scriptCSP[1]) && /(?:Content Security Policy|content security policy)/.test(text) && /(?:script-src|script-src-elem)/.test(text)) {
      annotate(record,'shared-environment','Cloudflare edge-injected analytics beacon is blocked by the existing script CSP; environment observation remains unresolved');
      return;
    }
    if (abortedResourceFailure.test(text) && record.source?.url && Number.isInteger(record.sequence)) {
      // ConsoleMessage exposes no request identity. Pair only a unique recorded
      // injection and retain ambiguous/real same-URL failures as blocking evidence.
      const failures = (runtime.failedRequests ?? []).map((request,index)=>({request,index})).filter(({request})=>request.url === record.source.url);
      const candidates = failures.filter(({request,index})=>injectedFailure(request) && !linkedAborts.has(index) && request.injectedAbort.sequence < record.sequence);
      if (failures.every(({request})=>injectedFailure(request)) && candidates.length === 1) {
        const {request,index} = candidates[0];
        linkedAborts.add(index);
        annotate(record,'expected-fixture-abort',`${request.injectedAbort.reason}; strict browser resource failure linked to recorded injected abort`,{failedRequestEvidence:`failedRequests[${index}]`});
        return;
      }
    }
    const status = Number(text.match(resourceFailure)?.[1]);
    const sourceURL = record.source?.url;
    if (!status || !sourceURL) return;
    const index = runtime.httpErrors.findIndex(h=>h.url === sourceURL && h.status === status && h.blocking === false);
    if (index < 0) return;
    const http = runtime.httpErrors[index];
    if (http.classification === 'anonymous-auth-probe' || fixture?.expectedConsoleErrors?.some(r=>r.text === text && r.status === status && r.pathname === parseURL(sourceURL)?.pathname)) {
      annotate(record,http.classification,`${http.reason}; console resource failure linked to observed HTTP response`,{httpEvidence:`httpErrors[${index}]`});
    }
  });
  runtime.status = ['pageErrors','consoleErrors','httpErrors'].some(kind=>runtime[kind].some(r=>r.blocking)) ? 'failed':'passed';
}

export function environmentObservations(results) {
  const observations = results.flatMap(result=>result.runtime.consoleErrors.flatMap((record,index)=>record.classification === 'shared-environment' ? [{slug:result.slug,evidence:`tools/${result.slug}.json#runtime.consoleErrors[${index}]`,...record}] : []));
  return {count:observations.length,affectedTools:[...new Set(observations.map(r=>r.slug))],status:observations.length ? 'observed-unresolved':'not-observed',observations};
}
