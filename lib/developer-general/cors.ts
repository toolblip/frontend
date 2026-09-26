export interface CorsConfig {allowedOrigins:string[];allowedMethods:string[];allowedHeaders:string[];exposedHeaders:string[];maxAge:number;credentials:boolean;wildcard:boolean;}
export function corsError(c:CorsConfig){
 if(c.credentials&&(c.wildcard||c.allowedOrigins.includes('*')))return 'Credentialed requests require explicit origins; wildcard origin is invalid.';
 if(!c.wildcard&&!c.allowedOrigins.length)return 'Add an allowed origin.';
 for(const o of c.allowedOrigins){if(o==='*'&&!c.credentials)continue;try{const u=new URL(o);if(!['https:','http:'].includes(u.protocol)||u.origin!==o)throw new Error();}catch{return 'Origins must be HTTP(S) origins without paths, credentials or trailing slashes.';}}
 if(!c.allowedMethods.length)return 'Choose at least one method.';
 if(!Number.isInteger(c.maxAge)||c.maxAge<0||c.maxAge>86400)return 'Max age must be an integer from 0 to 86400.';
 if([...c.allowedHeaders,...c.exposedHeaders].some(h=>!/^[-!#$%&'*+.^_`|~\da-zA-Z]+$/.test(h)))return 'Invalid header name.';
 if(c.credentials&&c.allowedHeaders.includes('*'))return 'Credentialed requests require explicit allowed header names.';
 return '';
}
export function corsHeaders(c:CorsConfig){
 if(corsError(c))return {};
 const h:Record<string,string>={'Access-Control-Allow-Origin':c.wildcard?'*':c.allowedOrigins[0],'Access-Control-Allow-Methods':c.allowedMethods.join(', ')};
 if(c.allowedHeaders.length)h['Access-Control-Allow-Headers']=c.allowedHeaders.join(', ');
 if(c.exposedHeaders.length)h['Access-Control-Expose-Headers']=c.exposedHeaders.join(', ');
 if(c.credentials)h['Access-Control-Allow-Credentials']='true';
 if(c.maxAge)h['Access-Control-Max-Age']=String(c.maxAge);
 if(!c.wildcard)h.Vary='Origin';
 return h;
}
export function corsSnippet(c:CorsConfig,format:string){
 if(corsError(c))return '';
 const h=corsHeaders(c),j=JSON.stringify,py=(v:boolean)=>v?'True':'False';
 if(format==='raw')return Object.entries(h).map(([k,v])=>`${k}: ${v}`).join('\n');
 if(format==='nginx')return `# Static origin configuration; use an allowlist map for multiple origins.\nlocation / {\n${Object.entries(h).map(([k,v])=>`  add_header ${k} ${j(v)} always;`).join('\n')}\n  if ($request_method = OPTIONS) { return 204; }\n}`;
 if(format==='apache')return `# Requires mod_headers and mod_rewrite. Static first origin only.\n${Object.entries(h).map(([k,v])=>`Header always set ${k} ${j(v)}`).join('\n')}\nRewriteEngine On\nRewriteCond %{REQUEST_METHOD} =OPTIONS\nRewriteRule ^ - [R=204,L]`;
 if(format==='express')return `const cors = require('cors');\napp.use(cors(${j({origin:c.wildcard?'*':c.allowedOrigins,methods:c.allowedMethods,allowedHeaders:c.allowedHeaders,exposedHeaders:c.exposedHeaders,credentials:c.credentials,maxAge:c.maxAge},null,2)}));`;
 if(format==='nextjs')return `import { NextResponse } from 'next/server';\nconst allowedOrigins = ${j(c.allowedOrigins)};\nexport function middleware(request) {\n  const origin = request.headers.get('origin');\n  const response = request.method === 'OPTIONS' ? new NextResponse(null, {status: 204}) : NextResponse.next();\n  if (${c.wildcard?'true':'allowedOrigins.includes(origin)'}) {\n    const headers = ${j(h,null,2)};\n    headers['Access-Control-Allow-Origin'] = ${c.wildcard?"'*'":'origin'};\n    for (const [key,value] of Object.entries(headers)) response.headers.set(key,value);\n  }\n  return response;\n}\nexport const config = {matcher: '/api/:path*'};`;
 if(format==='django')return `# Install django-cors-headers; add corsheaders to INSTALLED_APPS\n# and corsheaders.middleware.CorsMiddleware before CommonMiddleware.\nCORS_ALLOW_ALL_ORIGINS = ${py(c.wildcard)}\nCORS_ALLOWED_ORIGINS = ${j(c.wildcard?[]:c.allowedOrigins)}\nCORS_ALLOW_METHODS = ${j(c.allowedMethods)}\nCORS_ALLOW_HEADERS = ${j(c.allowedHeaders.map(x=>x.toLowerCase()))}\nCORS_EXPOSE_HEADERS = ${j(c.exposedHeaders)}\nCORS_ALLOW_CREDENTIALS = ${py(c.credentials)}\nCORS_PREFLIGHT_MAX_AGE = ${c.maxAge}`;
 return `from flask_cors import CORS\nCORS(app, origins=${j(c.wildcard?'*':c.allowedOrigins)}, methods=${j(c.allowedMethods)}, allow_headers=${j(c.allowedHeaders)}, expose_headers=${j(c.exposedHeaders)}, supports_credentials=${py(c.credentials)}, max_age=${c.maxAge})`;
}
