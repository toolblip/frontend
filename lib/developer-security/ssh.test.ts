import {it,expect} from 'vitest';
import {createPrivateKey,createPublicKey,sign,verify} from 'node:crypto';
import {generateRsa,generateEcdsa,generateEd25519} from './ssh';
function fields(text:string){const b=Buffer.from(text.split(' ')[1],'base64');const out:Buffer[]=[];let p=0;while(p<b.length){const n=b.readUInt32BE(p);p+=4;out.push(b.subarray(p,p+n));p+=n;}expect(p).toBe(b.length);return out;}
it('RSA SSH public blob equals the PKCS8 private key public parameters',async()=>{
 const r=await generateRsa(2048,'test@local'), f=fields(r.publicKey);const priv=createPrivateKey(r.privateKeyPem),pub=createPublicKey(priv),j=pub.export({format:'jwk'});
 expect(f[0].toString()).toBe('ssh-rsa');expect(f[1].toString('hex')).toBe('010001');expect(f[2].subarray(f[2][0]===0?1:0).toString('base64url')).toBe(j.n);
 expect(verify('sha256',Buffer.from('known message'),pub,sign('sha256',Buffer.from('known message'),priv))).toBe(true);
});
it.each(['P-256','P-384','P-521'] as const)('ECDSA %s SSH public point matches PKCS8',async curve=>{
 const r=await generateEcdsa(curve,''),f=fields(r.publicKey),j=createPublicKey(createPrivateKey(r.privateKeyPem)).export({format:'jwk'});
 expect(f[0].toString()).toBe('ecdsa-sha2-nistp'+curve.slice(2));expect(f[1].toString()).toBe('nistp'+curve.slice(2));expect(f[2]).toEqual(Buffer.concat([Buffer.from([4]),Buffer.from(j.x!,'base64url'),Buffer.from(j.y!,'base64url')]));
});
it('Ed25519 SSH public bytes match PKCS8 public key',async()=>{
 const r=await generateEd25519(''),f=fields(r.publicKey),j=createPublicKey(createPrivateKey(r.privateKeyPem)).export({format:'jwk'});
 expect(f[0].toString()).toBe('ssh-ed25519');expect(f[1].toString('base64url')).toBe(j.x);
});
