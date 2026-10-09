import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emailConfig,sendAuthEmail} from '../lib/email-provider';

const config={apiKey:'fictional-test-key',from:'CreatorBridge <no-reply@example.test>',origin:'https://creatorbridge.example.test'};
test('authentication email uses HTTPS links, an idempotency key and both accessible body formats',async()=>{
 const request:typeof fetch=async(input,init)=>{
  assert.equal(input,'https://api.resend.com/emails');assert.equal(init?.method,'POST');
  const headers=new Headers(init?.headers);assert.equal(headers.get('Idempotency-Key'),'opaque-event-id');assert.equal(headers.get('Authorization'),'Bearer fictional-test-key');
  const body=JSON.parse(String(init?.body));assert.deepEqual(body.to,['fictional@example.test']);assert.match(body.text,/https:\/\/creatorbridge.example.test\/verify\?token=opaque-token/);assert.match(body.text,/one hour/);assert.match(body.html,/Verify email/);assert.ok(init?.signal);return new Response(JSON.stringify({id:'fictional-message-id'}),{status:200});
 };
 assert.equal(await sendAuthEmail('verify','fictional@example.test','opaque-token','opaque-event-id',config,request),'fictional-message-id');
});
test('provider failures do not expose response bodies or credentials',async()=>{
 await assert.rejects(sendAuthEmail('reset','fictional@example.test','opaque-token','event',config,async()=>new Response('secret provider diagnostics',{status:401})),/temporarily unavailable/);
 await assert.rejects(sendAuthEmail('reset','fictional@example.test','opaque-token','event',config,async()=>{throw new Error('sensitive transport diagnostics');}),/temporarily unavailable/);
 await assert.rejects(sendAuthEmail('reset','fictional@example.test','opaque-token','event',config,async()=>new Response('{}',{status:200})),/could not be confirmed/);
});
test('production email configuration rejects insecure origins and missing credentials',()=>{
 const keys=['NODE_ENV','EMAIL_PROVIDER','RESEND_API_KEY','EMAIL_FROM','APP_URL'];const prior=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
 try{Object.assign(process.env,{NODE_ENV:'production',EMAIL_PROVIDER:'resend',RESEND_API_KEY:'fictional-key',EMAIL_FROM:config.from,APP_URL:'http://localhost:3000'});assert.throws(emailConfig,/trusted application origin/);process.env.APP_URL=config.origin;assert.equal(emailConfig().origin,config.origin);delete process.env.RESEND_API_KEY;assert.throws(emailConfig,/not configured/);}
 finally{for(const key of keys){if(prior[key]===undefined)delete process.env[key];else process.env[key]=prior[key];}}
});
