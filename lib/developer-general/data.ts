import { dump } from 'js-yaml';
export function openApi(input:string){
 const data=JSON.parse(input);if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Expected a JSON object');
 const paths:Record<string,Record<string,unknown>>=Object.create(null);
 const endpoints=data.endpoints??data.routes??[];if(!Array.isArray(endpoints))throw new Error('endpoints must be an array');
 for(const ep of endpoints){if(!ep||typeof ep!=='object')throw new Error('Each endpoint must be an object');const method=String(ep.method??'get').toLowerCase(),path=ep.path??ep.url;
  if(!['get','post','put','patch','delete','options','head','trace'].includes(method)||typeof path!=='string'||!path.startsWith('/'))throw new Error('Each endpoint needs a valid method and /path');
  paths[path]??=Object.create(null);if(paths[path][method])throw new Error('Duplicate method and path');
  paths[path][method]={summary:String(ep.description??ep.name??'Endpoint'),responses:{'200':{description:'Successful response',...(ep.response===undefined&&ep.responseBody===undefined?{}:{content:{'application/json':{example:ep.response??ep.responseBody}}})}}};
 }
 const properties=data.properties??data.fields??data.schema;
 const spec:Record<string,unknown>={openapi:'3.0.0',info:{title:String(data.title??data.name??'API'),version:String(data.version??'1.0.0'),description:String(data.description??'')},paths};
 if(data.baseUrl||data.base_path){const url=new URL(data.baseUrl??data.base_path);if(!['http:','https:'].includes(url.protocol))throw new Error('Server URL must be HTTP(S)');spec.servers=[{url:url.href}];}
 if(properties){if(typeof properties!=='object'||Array.isArray(properties))throw new Error('properties must be an object');const fields:Record<string,unknown>=Object.create(null);
  for(const [key,value] of Object.entries(properties)){if(value&&typeof value==='object'&&!Array.isArray(value)&&'type' in value){const type=(value as {type:unknown}).type;if(!['string','number','integer','boolean','array','object'].includes(String(type)))throw new Error('Unsupported schema type');fields[key]=value;}else fields[key]=value===null?{nullable:true}:Array.isArray(value)?{type:'array',items:{}}:{type:typeof value==='object'?'object':typeof value};}
  spec.components={schemas:{Response:{type:'object',properties:fields}}};
 }
 return dump(spec,{noRefs:true,lineWidth:100});
}
export function parseCsv(text:string):string[][] {
 const rows:string[][]=[];let row:string[]=[],value='',quoted=false,closed=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(quoted){if(c==='"'){if(text[i+1]==='"'){value+='"';i++;}else{quoted=false;closed=true;}}else value+=c;continue;}
  if(c==='"'){if(value||closed)throw new Error('Unexpected quote in CSV');quoted=true;}
  else if(c===','||c==='\n'||c==='\r'){row.push(value);value='';closed=false;if(c!==','){if(c==='\r'&&text[i+1]==='\n')i++;rows.push(row);row=[];}}
  else{if(closed&&!/\s/.test(c))throw new Error('Unexpected text after quoted field');if(!closed)value+=c;}
 }
 if(quoted)throw new Error('Unclosed CSV quote');if(value||row.length||closed){row.push(value);rows.push(row);}return rows;
}
