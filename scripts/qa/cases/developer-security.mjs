import { createHash, createHmac, createPrivateKey, createPublicKey } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import bcrypt from 'bcryptjs';

const UUID='550e8400-e29b-41d4-a716-446655440000';
const V7='017f22e2-79b0-7cc3-98c4-dc0c0c07398f';
const enc=s=>Buffer.from(s).toString('base64url');
const jwt=(payload={name:'বাংলা',exp:0},alg='HS256',secret='test-secret')=>{const data=enc(JSON.stringify({alg,typ:'JWT'}))+'.'+enc(JSON.stringify(payload));return data+'.'+createHmac({HS256:'sha256',HS384:'sha384',HS512:'sha512'}[alg],secret).update(data).digest('base64url');};
const pre=tool=>tool.locator('.tb-v2-tool-output-body pre').last();
const fill=(tool,label,value)=>tool.getByLabel(label,{exact:true}).fill(value);
const examples=tool=>tool.getByRole('button',{name:'Examples',exact:true}).click();
const tests={};
const add=(slugs,test)=>{for(const slug of slugs.split(' '))tests[slug]=test;};

add('hash-from-text sha-256-hash md5-hash-generator sha1-hash-generator sha256-hash-generator',async({tool,expect,check,slug})=>{
 await examples(tool);const algorithm=slug==='md5-hash-generator'?'MD5':slug==='sha1-hash-generator'?'SHA-1':'SHA-256';
 if(slug!=='sha-256-hash')await tool.getByLabel('Algorithm',{exact:true}).selectOption(algorithm);
 await expect(tool.getByLabel('Hash output')).toHaveText(createHash(algorithm.replace('-','').toLowerCase()).update('abc').digest('hex'));
 check(true,`${algorithm} abc matches an independent Node crypto digest`);
 if(slug!=='sha-256-hash')for(const algo of ['MD5','SHA-1','SHA-256','SHA-384','SHA-512']){
  await tool.getByLabel('Algorithm',{exact:true}).selectOption(algo);await fill(tool,'Hash input','é😀');
  await expect(tool.getByLabel('Hash output')).toHaveText(createHash(algo.replace('-','').toLowerCase()).update('é😀').digest('hex'));
 }
 await fill(tool,'Hash input','');await tool.getByRole('button',{name:'Generate Hash',exact:true}).click();
 const selected=slug==='sha-256-hash'?'sha256':'sha512';await expect(tool.getByLabel('Hash output')).toHaveText(createHash(selected).update('').digest('hex'));
 check(true,'Empty input is hashed; Unicode and algorithm changes update current results');
});
add('url-encode url-encoder',async({tool,expect,check})=>{
 await examples(tool);await expect(pre(tool)).toHaveText('caf%C3%A9%20%26%20tea');
 const decode=tool.getByRole('tab',{name:'Decode',exact:true});await decode.click();await expect(decode).toHaveAttribute('aria-selected','true');await fill(tool,'Input','%F0%9F%98%80%20%2B');await expect(pre(tool)).toHaveText('😀 +');
 await fill(tool,'Input','%E0%A4');await expect(tool.getByRole('alert')).toBeVisible();check(true,'URI-component UTF-8 vector and malformed percent sequence');
});
add('base64-encoder-decoder',async({tool,expect,check})=>{
 await examples(tool);await expect(pre(tool)).toHaveText('w6nwn5iA');
 await tool.getByRole('tab',{name:'Decode',exact:true}).click();await fill(tool,'Input','w6nwn5iA');await expect(pre(tool)).toHaveText('é😀');
 await fill(tool,'Input','/w==');await expect(tool.getByRole('alert')).toBeVisible();check(true,'Base64 known UTF-8 vector and invalid UTF-8 rejection');
});
add('html-encoder-decoder html-attribute-encoder',async({tool,expect,check})=>{
 await examples(tool);await fill(tool,'Input','<>&"');await expect(tool.getByLabel('Output',{exact:true})).toHaveValue('&lt;&gt;&amp;&quot;');
 await tool.getByRole('button',{name:'Decode',exact:true}).first().click();await fill(tool,'Input','&amp;lt; &#x1F600;');await expect(tool.getByLabel('Output',{exact:true})).toHaveValue('&lt; 😀');
 check(true,'Entities encode correctly and nested entities decode once');
});
add('binary-converter',async({tool,expect,check})=>{
 await examples(tool);await expect(pre(tool)).toHaveText('11000011 10101001');
 await tool.getByRole('button',{name:'Binary to Text',exact:true}).click();await fill(tool,'Input','11000011 10101001');await expect(pre(tool)).toHaveText('é');
 await fill(tool,'Input','0000001');await expect(tool.getByRole('alert')).toBeVisible();check(true,'UTF-8 byte vector and incomplete-byte rejection');
});
add('backslash-escape-unescape json-escape-unescape',async({tool,expect,check})=>{
 await examples(tool);await tool.getByRole('button',{name:'Json',exact:true}).click();await fill(tool,'Input','a\n"b');await expect(pre(tool)).toHaveText('a\\n\\"b');
 await tool.getByRole('tab',{name:/Unescape/}).click();await fill(tool,'Input','\\\\n');await expect(pre(tool)).toHaveText('\\n');
 await fill(tool,'Input','\\q');await expect(tool.getByRole('alert')).toBeVisible();check(true,'JSON controls, literal backslash-n and invalid escape');
});
add('regex-escape',async({tool,expect,check})=>{
 await examples(tool);await fill(tool,'Input','a+b?.[x]');await expect(pre(tool)).toHaveText('a\\+b\\?\\.\\[x\\]');
 const escaped=await pre(tool).innerText();check(new RegExp('^'+escaped+'$').test('a+b?.[x]'),'Escaped output matches the literal with a real RegExp');
 await tool.getByRole('button',{name:'Unescape (pattern → plain text)',exact:true}).click();await fill(tool,'Input',escaped);await expect(pre(tool)).toHaveText('a+b?.[x]');
});
add('punycode-encoder',async({tool,expect,check})=>{
 await examples(tool);await expect(tool.getByLabel('Punycode / ASCII',{exact:true})).toHaveValue('xn--schn-7qa.de');
 await fill(tool,'Unicode / IDN','bücher.de');await expect(tool.getByLabel('Punycode / ASCII',{exact:true})).toHaveValue('xn--bcher-kva.de');
 await fill(tool,'Punycode / ASCII','xn--bcher-kva.de');await expect(tool.getByLabel('Unicode / IDN',{exact:true})).toHaveValue('bücher.de');check(true,'Independent IDN known vectors in both directions');
});
add('data-uri-generator',async({tool,expect,check})=>{
 await examples(tool);await fill(tool,'Text','é😀');await expect(pre(tool)).toHaveText('data:text/plain;base64,w6nwn5iA');
 await tool.getByRole('button',{name:'File',exact:true}).click();const bytes=Buffer.from([0,255,65,128]);
 await tool.getByLabel('File',{exact:true}).setInputFiles({name:'bytes.bin',mimeType:'application/octet-stream',buffer:bytes});
 await expect(pre(tool)).toHaveText('data:application/octet-stream;base64,AP9BgA==');check(true,'Data URI contains exact uploaded binary bytes');
 await tool.getByLabel('File',{exact:true}).setInputFiles({name:'large.bin',mimeType:'application/octet-stream',buffer:Buffer.alloc(2*1024*1024+1)});await expect(tool.getByRole('alert')).toContainText('2 MiB');
});
add('encodings-reference',async({tool,expect,check})=>{
 await examples(tool);const row=tool.getByRole('row').filter({hasText:'Ampersand'});await expect(row).toContainText('&amp;');await expect(row).toContainText('&#38;');
 await fill(tool,'Search','no-such-entity');await expect(tool.getByRole('row').filter({hasText:'Ampersand'})).toHaveCount(0);check(true,'Ampersand entity maps to decimal 38 and filtering removes it');
});
add('hash-identifier',async({tool,expect,check})=>{
 await examples(tool);await expect(tool).toContainText('MD5 / MD4 / NTLM');
 await fill(tool,'Input','z'.repeat(32));await expect(tool).toContainText('Unknown');check(true,'Hex digest is a candidate; arbitrary 32-character text is not called MD5');
});
add('email-validator',async({tool,expect,check})=>{
 await examples(tool);await expect(tool).toContainText('Valid');
 await fill(tool,'Email','a..b@example.com');await expect(tool).toContainText('Invalid');
 await fill(tool,'Email','a+b@example.com');await expect(tool).not.toContainText('Invalid local');check(true,'Dot-atom validation rejects consecutive dots and accepts plus addressing');
});
add('credit-card-validator',async({tool,expect,check})=>{
 await examples(tool);await expect(tool).toContainText('Checksum valid (Luhn pass)');await expect(tool).toContainText('Visa');
 for(const bad of ['4111111111111112','0000000000000000','x4111111111111111']){await fill(tool,'Card number',bad);await expect(tool).toContainText('Invalid card number');}
 check(true,'Independent Visa Luhn vector; changed check digit, zeros and letters rejected');
});
add('uuid-validator',async({tool,expect,check})=>{
 await examples(tool);await expect(tool).toContainText('Valid UUID');await expect(tool).toContainText('v7');
 await fill(tool,'UUID input',UUID);await expect(tool).toContainText('v4');
 await fill(tool,'UUID input',UUID.replace('-a716-','-7716-'));await expect(tool).toContainText('Invalid UUID');check(true,'Version nibble and RFC variant are validated');
});
add('uuid-normalizer',async({tool,expect,check})=>{
 await examples(tool);await expect(pre(tool)).toHaveText(UUID);
 await fill(tool,'UUID input','{'+UUID.toUpperCase()+'}');await expect(pre(tool)).toHaveText(UUID);
 await fill(tool,'UUID input','{'+UUID+']');await expect(tool.getByRole('alert')).toBeVisible();check(true,'Case/braces normalize while mismatched wrappers are rejected');
});
add('uuid-comparator uuid-compare',async({tool,expect,check})=>{
 await examples(tool);await expect(tool).toContainText(/(?:UUIDs are equal|✓ Equal)/);
 await fill(tool,'UUID A',V7);await fill(tool,'UUID B','017f22e2-79b1-7cc3-98c4-dc0c0c07398f');await expect(tool).toContainText(/(?:UUID A is chronologically earlier|A is earlier)/);
 await fill(tool,'UUID A','bad');await expect(tool.getByRole('alert')).toBeVisible();check(true,'Normalized equality and independent v7 timestamp ordering');
});
add('uuid-generator uuid-v1-generator random-uuid-v7',async({tool,expect,check,slug})=>{
 await examples(tool);const version=slug==='uuid-generator'?4:slug==='uuid-v1-generator'?1:7;
 if(version!==4){await fill(tool,'Count','3');await tool.getByRole('button',{name:version===7?'Generate':/^Generate UUID/,exact:version===7}).click();}
 const pattern=new RegExp(`[0-9a-f]{8}-[0-9a-f]{4}-${version}[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}`,'ig');
 await expect.poll(async()=>((await tool.innerText()).match(pattern)||[]).length).toBeGreaterThanOrEqual(version===4?1:3);
 const values=(await tool.innerText()).match(pattern);check(new Set(values).size===values.length,'UUID outputs are distinct with the required version and variant bits');
 const h=values[0].replaceAll('-','');if(version===7)check(Math.abs(parseInt(h.slice(0,12),16)-Date.now())<60000,'v7 embeds current Unix milliseconds');
 if(version===1){const t=BigInt('0x'+h.slice(13,16)+h.slice(8,12)+h.slice(0,8));check(Math.abs(Number((t-122192928000000000n)/10000n)-Date.now())<60000,'v1 embeds current Gregorian timestamp');check((parseInt(h.slice(20,22),16)&1)===1,'Random node has multicast bit');}
});
add('ulid-generator',async({tool,expect,check})=>{
 await examples(tool);await fill(tool,'Count','3');await tool.getByRole('button',{name:'Generate ULID',exact:true}).click();
 const pattern=/\b[0-7][0-9A-HJKMNP-TV-Z]{25}\b/g;await expect.poll(async()=>((await tool.innerText()).match(pattern)||[]).length).toBe(3);
 const values=(await tool.innerText()).match(pattern),alphabet='0123456789ABCDEFGHJKMNPQRSTVWXYZ';let time=0;for(const c of values[0].slice(0,10))time=time*32+alphabet.indexOf(c);
 check(new Set(values).size===3&&Math.abs(time-Date.now())<60000,'ULIDs have Crockford alphabet, distinct randomness and current 48-bit timestamp');
});
add('password-generator random-password-generator',async({tool,expect,check})=>{
 await examples(tool);const value=tool.locator('.tb-v2-pw-value');await expect(value).toHaveText(/^[\s\S]{16}$/);let p=await value.innerText();
 check(/[A-Z]/.test(p)&&/[a-z]/.test(p)&&/\d/.test(p)&&/[^A-Za-z0-9]/.test(p),'All selected password character groups are represented');
 await tool.getByRole('button',{name:'No look-alikes',exact:true}).click();await expect(value).not.toHaveText(/[O0Il1]/);p=await value.innerText();check(!/[O0Il1]/.test(p),'Excluded ambiguous characters never appear');
 for(const name of ['A–Z','a–z','0–9','!@#$'])await tool.getByRole('button',{name,exact:true}).click();await expect(tool.getByRole('alert')).toContainText('Select at least');
});
add('password-strength-checker',async({tool,expect,check})=>{
 await examples(tool);await fill(tool,'Password','PasswordPasswordPassword');await expect(tool).toContainText('Weak');await expect(tool).toContainText('Not predictable');check(true,'Repeated common patterns are weak and no precise crack time is claimed');
});
add('secure-random-generator',async({tool,expect,check})=>{
 await examples(tool);await expect(pre(tool)).toHaveText(/^[A-Za-z0-9]{16}$/);
 await tool.getByRole('button',{name:'Number',exact:true}).click();await fill(tool,'Minimum','7');await fill(tool,'Maximum','7');await tool.getByRole('button',{name:/^Generate/}).click();await expect(pre(tool)).toHaveText('7');
 await fill(tool,'Minimum','1.5');await tool.getByRole('button',{name:/^Generate/}).click();await expect(tool.getByRole('alert')).toContainText('safe integers');check(true,'Secure string format, inclusive singleton integer range and fractional-input rejection');
});
add('hmac-generator',async({tool,expect,check})=>{
 await examples(tool);await expect(tool.getByLabel('HMAC output')).toHaveText('f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8');
 for(const alg of ['SHA-1','SHA-256','SHA-384','SHA-512']){await tool.getByLabel('Hash Algorithm',{exact:true}).selectOption(alg);await fill(tool,'Message','');await expect(tool.getByLabel('HMAC output')).toHaveText(createHmac(alg.replace('-','').toLowerCase(),'key').update('').digest('hex'));}
 await tool.getByLabel('Output Format',{exact:true}).selectOption('base64');await expect(tool.getByLabel('HMAC output')).toHaveText(createHmac('sha512','key').update('').digest('base64'));check(true,'Independent known HMAC vector, all SHA modes, empty message and Base64');
});
add('jwt-decoder jwt-inspector jwt-token-decoder jwt-token-inspector jwt-tester jwt-token-tester',async({tool,expect,check,slug})=>{
 await examples(tool);await fill(tool,'JWT input',jwt());await expect(tool).toContainText('বাংলা');await expect(tool).toContainText('Expired');
 if(slug==='jwt-tester'||slug==='jwt-token-tester')for(const alg of ['HS256','HS384','HS512']){
  await fill(tool,'JWT input',jwt({name:'বাংলা',exp:0},alg));await fill(tool,'HMAC secret','test-secret');await expect(tool).toContainText('Signature valid');
  await fill(tool,'HMAC secret','wrong');await expect(tool).toContainText('Signature does not match');
 }
 await fill(tool,'JWT input','e30.W10.');await expect(tool.getByRole('alert')).toBeVisible();check(true,'Unicode payload and expiry parsed; malformed JSON objects rejected'+(slug.includes('tester')?'; independent HMAC signatures verified in all supported modes':''));
});
add('token-builder',async({tool,expect,check})=>{
 await examples(tool);await fill(tool,'JWT header JSON','{"alg":"HS256","typ":"JWT"}');await fill(tool,'JWT payload JSON','{"name":"বাংলা","exp":0}');await fill(tool,'Signing secret','test-secret');
 await tool.getByRole('button',{name:'Generate token',exact:true}).click();await expect(pre(tool)).toHaveText(jwt());check(true,'Generated JWT exactly matches independent Node HMAC signing');
 await fill(tool,'JWT payload JSON','[]');await expect(tool.getByRole('alert')).toContainText('JSON object');await expect(pre(tool)).toHaveCount(0);
});
add('bcrypt-hash-generator',async({tool,expect,check})=>{
 await examples(tool);await fill(tool,'Password input','password');await tool.getByRole('slider',{name:'Cost factor rounds'}).focus();await tool.getByRole('slider',{name:'Cost factor rounds'}).press('Home');await expect(tool.getByRole('slider',{name:'Cost factor rounds'})).toHaveValue('4');await tool.getByRole('button',{name:'Generate Hash',exact:true}).click();
 await expect(pre(tool)).toHaveText(/^\$2b\$04\$[./A-Za-z0-9]{53}$/);const hash=await pre(tool).innerText();check(bcrypt.compareSync('password',hash),'Generated bcrypt hash verifies against the input');
 await fill(tool,'Verify password','wrong');await tool.getByRole('button',{name:'Verify',exact:true}).click();await expect(tool).toContainText('Password does not match');
 await fill(tool,'Verify password','password');await tool.getByRole('button',{name:'Verify',exact:true}).click();await expect(tool).toContainText('Password matches');
 await fill(tool,'Password input','é'.repeat(37));await tool.getByRole('button',{name:'Generate Hash',exact:true}).click();await expect(tool.getByRole('alert')).toContainText('72 UTF-8 bytes');
});
add('hash-diff-checker',async({tool,expect,check})=>{
 await examples(tool);await fill(tool,'Text A','abc');await fill(tool,'Text B','abc');await expect(tool.getByText('MATCH',{exact:true})).toBeVisible();await expect(tool).toContainText('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
 await fill(tool,'Text B','abcd');await expect(tool.getByText('NO MATCH',{exact:true})).toBeVisible();
 await tool.getByRole('tab',{name:'Compare hashes directly',exact:true}).click();await fill(tool,'Hash A','zz');await fill(tool,'Hash B','zz');await expect(tool.getByRole('alert')).toBeVisible();check(true,'Known SHA-256 abc digest, equal and different inputs, invalid hexadecimal hashes');
});
add('hash-collision-finder',async({tool,expect,check})=>{
 await examples(tool);await tool.getByRole('button',{name:'Find Collision',exact:true}).click();await expect(tool).toContainText('Collision found after',{timeout:30000});
 const values=await tool.locator('.tb-v2-hash-val').allTextContents();const [a,ha,b,hb]=values;
 check(a!==b&&ha===createHash('sha256').update(a).digest('hex')&&hb===createHash('sha256').update(b).digest('hex')&&ha.slice(0,2)===hb.slice(0,2),'Different inputs have genuine SHA-256 digests sharing a two-hex-digit prefix');
});
add('ssh-key-generator',async({page,tool,expect,check,artifactsDir})=>{
 await examples(tool);await tool.getByRole('button',{name:'Generate key pair',exact:true}).click();const outputs=tool.locator('.tb-v2-tool-output-body pre');await expect(outputs).toHaveCount(2);
 const publicText=await outputs.nth(0).innerText(),pem=await outputs.nth(1).innerText();const jwk=createPublicKey(createPrivateKey(pem)).export({format:'jwk'});const b=Buffer.from(publicText.split(' ')[1],'base64');let pos=0;const parts=[];while(pos<b.length){const n=b.readUInt32BE(pos);pos+=4;parts.push(b.subarray(pos,pos+n));pos+=n;}
 check(parts[0].toString()==='ecdsa-sha2-nistp256'&&parts[2].equals(Buffer.concat([Buffer.from([4]),Buffer.from(jwk.x,'base64url'),Buffer.from(jwk.y,'base64url')])),'OpenSSH public wire-format point matches the real PKCS8 private key');
 const downloadPromise=page.waitForEvent('download');await tool.getByRole('button',{name:'Download',exact:true}).nth(1).click();const download=await downloadPromise;const file=path.join(artifactsDir,'developer-security-private.pem');await download.saveAs(file);check(createPrivateKey(await readFile(file)).asymmetricKeyType==='ec','Downloaded private key is valid PKCS8 bytes');
});

export default Object.entries(tests).map(([slug,test])=>({slug,requiresExample:true,requiresClear:true,async test(ctx){
 const {page,tool,expect,check}=ctx;
 await page.setViewportSize({width:320,height:900});
 await tool.getByRole('button',{name:'Clear',exact:true}).first().click();
 await test({...ctx,slug});
 const layout=await tool.evaluate(root=>({client:root.clientWidth,scroll:root.scrollWidth,left:root.getBoundingClientRect().left,right:root.getBoundingClientRect().right,viewport:document.documentElement.clientWidth}));
 check(layout.scroll<=layout.client+1&&layout.left>=-1&&layout.right<=layout.viewport+1,'Functional interactions at 320px stay within the tool and viewport');
 await page.screenshot({path:path.join(ctx.artifactsDir,'security-functional-320.png')});
 await tool.getByRole('button',{name:'Clear',exact:true}).first().click();
 const inputs=tool.locator('textarea:not([readonly]), input[type="text"], input[type="password"], input[type="email"], input:not([type])');
 for(let i=0;i<await inputs.count();i++)await expect(inputs.nth(i)).toHaveValue('');
 await expect(tool.getByRole('alert')).toHaveCount(0);
 check(true,'Clear resets editable text and visible errors');
}}));
