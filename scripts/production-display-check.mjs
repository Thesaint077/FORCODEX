import {spawn} from 'node:child_process';
import {chromium as pw} from '@playwright/test';
import chromium from '@sparticuz/chromium';
import {browserBinary} from './chromium-path.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const origin='http://127.0.0.1:3103';
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3103'],{env:{...process.env,DATABASE_URL:'',APP_URL:origin,ALLOW_LOCAL_ADAPTERS:'true',LOCAL_DATABASE_PATH:'.data/browser-db'},stdio:'ignore'});
let browser;
try{
 for(let i=0;i<100;i++){try{if((await fetch(origin)).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
 browser=await pw.launch({executablePath:await browserBinary(),args:chromium.args.filter(a=>!['--disable-web-security','--single-process'].includes(a)),headless:true});
 const context=await browser.newContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const login=await context.request.post(origin+'/api/action',{headers:{Origin:origin},data:{action:'login',email:'brand@demo.creatorbridge.test',password:'CreatorBridge!2026'}});assert.equal(login.status(),200);
 const {bookingId}=JSON.parse(await fs.readFile('test-results/browser-summary.json','utf8'));
 for(const theme of ['light','dark']){
  await page.emulateMedia({colorScheme:theme});
  for(const width of [360,390,768,1024,1440]){
   await page.setViewportSize({width,height:900});
   for(const route of ['/','/dashboard','/discover','/creators','/onboarding','/settings','/bookings/'+bookingId]){
    await page.goto(origin+route);await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),theme+' '+width+' '+route);
    if(route==='/dashboard'&&(width===360||width===1440))await page.screenshot({path:'test-results/dashboard-'+theme+'-'+width+'.png',fullPage:true});
    if(route==='/'&&width===390)await page.screenshot({path:'test-results/landing-'+theme+'-390.png',fullPage:true});
   }
  }
 }
 assert.deepEqual(errors,[]);
 await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});await page.goto(origin);assert.equal(await page.locator('.cb-hero-copy').evaluate(el=>getComputedStyle(el).animationName),'none');
 console.log('Production browser passed: no JavaScript errors; 7 pages × 5 widths × 2 system themes; reduced motion and screenshots.');
}finally{if(browser)await browser.close();server.kill('SIGTERM');}
