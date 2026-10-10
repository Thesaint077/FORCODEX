import {spawn} from 'node:child_process';
import {chromium as playwright} from '@playwright/test';
import chromium from '@sparticuz/chromium';
import {browserBinary} from './chromium-path.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const origin='http://127.0.0.1:3100';
const env={...process.env,APP_URL:origin,APP_MODE:'sandbox',ENABLE_DEV_MAIL:'true',ALLOW_LOCAL_ADAPTERS:'true',DATABASE_URL:'',LOCAL_DATABASE_PATH:'.data/browser-db',STORAGE_PATH:'.data/browser-assets'};
await fs.rm('.data/browser-db',{recursive:true,force:true});
await new Promise((resolve,reject)=>{const seed=spawn(process.execPath,['--import','tsx','scripts/seed.ts'],{env,stdio:'inherit'});seed.on('exit',code=>code===0?resolve():reject(new Error('seed failed')));});
let logs='';const server=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1','--port','3100'],{env,stdio:['ignore','pipe','pipe']});
server.stdout.on('data',b=>{logs+=b;});server.stderr.on('data',b=>{logs+=b;});
let browser;
try{
await new Promise((resolve,reject)=>{const deadline=Date.now()+45000;async function probe(){try{const r=await fetch(origin);if(r.ok)return resolve();}catch{}if(Date.now()>deadline)return reject(new Error('server unavailable: '+logs.slice(-2500)));setTimeout(probe,250);}probe();});
const executablePath=await browserBinary();
browser=await playwright.launch({executablePath,args:chromium.args.filter(arg=>!['--disable-web-security','--single-process'].includes(arg)),headless:true});
const contexts={};for(const role of ['brand','creator','ops','other'])contexts[role]=await browser.newContext({viewport:{width:1440,height:1000}});
async function action(role,data){const r=await contexts[role].request.post(origin+'/api/action',{headers:{Origin:origin},data});const result=await r.json();if(!r.ok())throw new Error(data.action+': '+result.error);return result;}
for(const [role,email] of [['brand','brand'],['creator','creator'],['ops','ops'],['other','other']])await action(role,{action:'login',email:email+'@demo.creatorbridge.test',password:'CreatorBridge!2026'});
const page=await contexts.brand.newPage();page.on('pageerror',e=>console.error('PAGEERROR',e.message));page.on('response',async r=>{if(r.url().endsWith('/api/action'))console.log('ACTION',r.status(),await r.text());});await page.goto(origin);await fs.mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/landing-desktop.png',fullPage:true});
await page.goto(origin+'/briefs/new');
const inputs={title:'Browser-verified skincare campaign',budget:'250000',deadline:'2026-12-01',description:'Fictional test campaign with two clear demonstration videos.',audience:'Adults interested in skincare',deliverables:'Two 30-second vertical demonstration videos'};
for(const [name,value] of Object.entries(inputs))await page.locator('form [name="'+name+'"]').fill(value);
await page.getByRole('button',{name:'Save draft',exact:true}).click();await page.waitForURL(url=>/^\/briefs\/[^/]+$/.test(url.pathname)&&url.pathname!=='/briefs/new');const briefId=page.url().split('/').pop();
const denied=await contexts.creator.request.get(origin+'/briefs/'+briefId);assert.match(await denied.text(),/This page isn’t available/);
console.log('Draft isolation passed');await page.getByRole('link',{name:'Edit brief'}).click();await page.getByRole('button',{name:'Publish brief',exact:true}).click();await page.waitForURL(/\/briefs\/[^/]+$/);
console.log('Brief published');console.log('Creator session cookies', (await contexts.creator.cookies()).map(c=>c.name));const creatorPage=await contexts.creator.newPage();creatorPage.on('response',async r=>{if(r.url().endsWith('/api/action'))console.log('CREATORACTION',r.status(),await r.text());});await creatorPage.goto(origin+'/briefs/'+briefId);await creatorPage.locator('[name="notes"]').fill('Two original vertical product videos, clear audio and agreed revisions.');await creatorPage.getByRole('button',{name:'Send proposal',exact:true}).click();await creatorPage.getByText('Saved successfully.').waitFor();
console.log('Proposal submitted');await page.reload();await page.getByRole('button',{name:'Accept proposal & create booking'}).click();await page.waitForURL(/\/bookings\//);const bid=page.url().split('/').pop();
assert.match(await (await contexts.other.request.get(origin+'/bookings/'+bid)).text(),/This page isn’t available/);
const forbidden=await contexts.other.request.post(origin+'/api/action',{headers:{Origin:origin},data:{action:'fund',bookingId:bid,idempotencyKey:'intrusion'}});assert.equal(forbidden.status(),400);
console.log('Booking isolated');await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Accept contract terms'}).click();await page.getByText('Saved successfully.').waitFor();
await creatorPage.goto(origin+'/bookings/'+bid);await creatorPage.getByRole('checkbox').check();await creatorPage.getByRole('button',{name:'Accept contract terms'}).click();await creatorPage.getByText('Saved successfully.').waitFor();
console.log('Contract signed');await page.reload();await page.getByRole('button',{name:'Simulate funding',exact:true}).click();await page.getByText('Saved successfully.').waitFor();await action('brand',{action:'fund',bookingId:bid,idempotencyKey:'another-key'});
console.log('Funding passed');await creatorPage.reload();await creatorPage.locator('[name="notes"]').fill('Version one: demo delivery notes for the accepted brief.');await creatorPage.locator('input[type=file]').setInputFiles({name:'delivery.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n% Fictional test fixture\n%%EOF')});await creatorPage.getByText('Attachment saved privately. Ready to submit.').waitFor();await creatorPage.getByRole('button',{name:'Submit version',exact:true}).click();await creatorPage.getByText('Saved successfully.').waitFor();
await page.reload();const assetLink=page.getByRole('link',{name:'Download private attachment'});const assetURL=await assetLink.getAttribute('href');assert.equal((await contexts.other.request.get(origin+assetURL)).status(),403);assert.equal((await contexts.brand.request.get(origin+assetURL)).status(),200);
await page.locator('[name="reason"]').first().fill('Please clarify the final closing statement.');await page.getByRole('button',{name:'Request included revision'}).click();await page.getByText('Saved successfully.').waitFor();
await creatorPage.reload();await creatorPage.locator('[name="notes"]').fill('Version two: clarified closing statement.');await creatorPage.getByRole('button',{name:'Submit version',exact:true}).click();await creatorPage.getByText('Saved successfully.').waitFor();
await page.reload();await page.getByRole('button',{name:'Accept latest delivery'}).click();await page.getByText('Saved successfully.').waitFor();
const opsPage=await contexts.ops.newPage();await opsPage.goto(origin+'/bookings/'+bid);await opsPage.locator('[name="reason"]').fill('Simulated content review only; no real regulatory clearance.');await opsPage.getByRole('button',{name:'Record simulated review'}).click();await opsPage.getByText('Saved successfully.').waitFor();
await page.reload();await page.getByRole('button',{name:'Simulate creator payout'}).click();await page.getByText('Sandbox payout completed. No real money moved.').waitFor();await action('brand',{action:'payout',bookingId:bid,idempotencyKey:'duplicate-payout'});
await page.screenshot({path:'test-results/booking-completed.png',fullPage:true});
await page.goto(origin+'/dashboard');await page.screenshot({path:'test-results/dashboard-desktop.png',fullPage:true});
const mobile=await browser.newContext({viewport:{width:360,height:800}});const mp=await mobile.newPage();await mp.goto(origin+'/creators');assert.ok(await mp.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));await mp.screenshot({path:'test-results/discovery-mobile.png',fullPage:true});await mp.goto(origin);assert.ok(await mp.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));await mp.screenshot({path:'test-results/landing-mobile.png',fullPage:true});
assert.equal((await contexts.brand.request.get(origin+'/api/contracts/'+bid)).status(),200);
assert.equal((await contexts.other.request.get(origin+'/api/contracts/'+bid)).status(),403);
await action('brand',{action:'logout'});await page.goto(origin+'/dashboard');await page.waitForURL(/\/login$/);
const authContext=await browser.newContext();contexts.new=authContext;const email='new-'+Date.now()+'@example.test';await action('new',{action:'register',name:'Fictional onboarding test',email,password:'NewAccount!2026',role:'creator',adult:'yes'});await action('new',{action:'onboard',category:'Beauty and personal care',service:'Content production',city:'Lagos',languages:'English',bio:'A fictional onboarding test profile',rate:'150000',availability:'Available',portfolio:'',isPublic:'no'});
const files=await fs.readdir('.data/mail');async function mail(kind){for(const f of [...files].reverse()){const m=JSON.parse(await fs.readFile(path.join('.data/mail',f),'utf8'));if(m.to===email&&m.kind===kind)return m;}throw new Error('Mail missing');}
const vm=await mail('verify');await action('new',{action:'verify',token:new URL(vm.url).searchParams.get('token')});await action('new',{action:'forgot',email});const all=await fs.readdir('.data/mail');let reset;for(const f of all){const m=JSON.parse(await fs.readFile('.data/mail/'+f,'utf8'));if(m.to===email&&m.kind==='reset')reset=m;}await action('new',{action:'reset',token:new URL(reset.url).searchParams.get('token'),password:'ChangedAccount!2026'});await action('new',{action:'login',email,password:'ChangedAccount!2026'});
const replay=await authContext.request.post(origin+'/api/action',{headers:{Origin:origin},data:{action:'reset',token:new URL(reset.url).searchParams.get('token'),password:'ReplayPassword!2026'}});assert.equal(replay.status(),400);
await action('brand',{action:'login',email:'brand@demo.creatorbridge.test',password:'CreatorBridge!2026'});

// Profile identity, directory consent, system themes and responsive layout checks.
await action('creator',{action:'onboard',name:'Updated Creator Demo',username:'updated_creator',category:'Beauty and personal care',service:'Content production',city:'Lagos',languages:'English',bio:'Fictional profile for browser verification.',rate:'150000',availability:'Available',portfolio:'',isPublic:'yes'});
await creatorPage.goto(origin+'/onboarding');assert.equal(await creatorPage.locator('[name="name"]').inputValue(),'Updated Creator Demo');assert.equal(await creatorPage.locator('[name="username"]').inputValue(),'updated_creator');
await creatorPage.locator('[name="name"]').fill('Edited Creator Demo');await creatorPage.getByRole('button',{name:'Save creator profile'}).click();await creatorPage.waitForURL(/\/dashboard$/);await creatorPage.getByRole('heading',{name:'Welcome, Edited.'}).waitFor();
await creatorPage.goto(origin+'/creators?q=updated_creator');await creatorPage.getByRole('heading',{name:'Edited Creator Demo'}).waitFor();
await action('brand',{action:'updateAccount',name:'Fictional Sample Brand',username:'sample_brand',directoryVisible:'yes'});
const anon=await browser.newContext();const publicPage=await anon.newPage();await publicPage.goto(origin+'/discover?q=sample_brand&role=brand');await publicPage.getByRole('heading',{name:'Fictional Sample Brand'}).waitFor();await publicPage.getByRole('link',{name:'View brand'}).click();await publicPage.getByRole('heading',{name:'Fictional Sample Brand'}).waitFor();
await action('brand',{action:'updateAccount',name:'Fictional Sample Brand',username:'sample_brand',directoryVisible:'no'});await publicPage.goto(origin+'/discover?q=sample_brand');await publicPage.getByText('No public matches yet').waitFor();
const duplicate=await contexts.brand.request.post(origin+'/api/action',{headers:{Origin:origin},data:{action:'updateAccount',name:'Rejected Name',username:'updated_creator'}});assert.equal(duplicate.status(),400);assert.match((await duplicate.json()).error,/already taken/);
for(const theme of ['light','dark']){
 await page.emulateMedia({colorScheme:theme});
 for(const width of [360,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/','/dashboard','/discover','/creators','/onboarding','/bookings/'+bid]){
   await page.goto(origin+route);await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
   const overflow=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));assert.ok(overflow.page<=overflow.viewport,JSON.stringify({theme,width,route,overflow}));
   if(route==='/dashboard'&&(width===360||width===1440))await page.screenshot({path:'test-results/dashboard-'+theme+'-'+width+'.png',fullPage:true});
   if(route==='/'&&width===390)await page.screenshot({path:'test-results/landing-'+theme+'-390.png',fullPage:true});
  }
 }
}
await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});await page.goto(origin);assert.equal(await page.locator('.cb-hero-copy').evaluate(el=>getComputedStyle(el).animationName),'none');assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).colorScheme),'dark');
await page.emulateMedia({colorScheme:'light'});assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).colorScheme),'light');
console.log('Additional checks passed: profile name persistence, username search, brand directory opt-in, duplicate handle protection, both system themes, reduced motion, six pages at five viewport widths.');
const summary={status:'passed',bookingId:bid,checks:['browser full booking lifecycle including revision and private upload','tenant/asset/contract access isolation','duplicate funding and payout','registration/onboarding/email verification/recovery/token replay','logout and session invalidation','360px landing and discovery overflow','desktop and mobile screenshots'],date:new Date().toISOString()};await fs.writeFile('test-results/browser-summary.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));
}catch(error){if(browser)for(const context of browser.contexts())for(const page of context.pages()){console.error('Failure page:',page.url(),(await page.locator('body').innerText()).slice(-2500));await page.screenshot({path:'test-results/failure-'+Date.now()+'.png',fullPage:true}).catch(()=>{});}throw error;}finally{if(browser)await browser.close();server.kill('SIGTERM');}
