import {spawn} from 'node:child_process';
import {chromium as playwright} from '@playwright/test';
import chromium from '@sparticuz/chromium';
import {browserBinary} from './chromium-path.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const origin='http://127.0.0.1:3101';
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3101'],{env:{...process.env,DATABASE_URL:'',APP_URL:origin,ALLOW_LOCAL_ADAPTERS:'true'},stdio:['ignore','pipe','pipe']});
let logs='';server.stdout.on('data',b=>logs+=b);server.stderr.on('data',b=>logs+=b);
let browser;
try {
 await new Promise((resolve,reject)=>{const deadline=Date.now()+40000;async function probe(){try{if((await fetch(origin)).ok)return resolve();}catch{}if(Date.now()>deadline)return reject(Error(logs));setTimeout(probe,250);}probe();});
 browser=await playwright.launch({executablePath:await browserBinary(),args:chromium.args.filter(a=>!['--disable-web-security','--single-process'].includes(a)),headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(origin);await fs.mkdir('test-results',{recursive:true});
 await page.getByRole('button',{name:'Sponsored content',exact:true}).click();await page.getByRole('heading',{name:'Reach their audience.'}).waitFor();assert.match(await page.getByRole('link',{name:'Explore sponsored content'}).getAttribute('href'),/Sponsored%20distribution/);
 await page.getByRole('button',{name:'For creators',exact:true}).click();await page.getByRole('heading',{name:'Show your craft'}).waitFor();
 await page.getByText('Do creators need a large following?',{exact:true}).click();assert.ok(await page.getByText('No. For content production, your portfolio',{exact:false}).isVisible());
 await page.getByRole('button',{name:'Content production',exact:true}).click();await page.getByRole('button',{name:'For brands',exact:true}).click();await page.getByText('Do creators need a large following?',{exact:true}).click();
 await page.screenshot({path:'test-results/landing-redesign-desktop.png',fullPage:true});
 for(const width of [360,390,768]){await page.setViewportSize({width,height:850});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow at '+width);if(width===360){await page.getByRole('button',{name:'Sponsored content',exact:true}).focus();await page.keyboard.press('Enter');await page.getByRole('heading',{name:'Reach their audience.'}).waitFor();await page.screenshot({path:'test-results/landing-redesign-mobile.png',fullPage:true});}}
 assert.deepEqual(errors,[]);console.log('Passed: service filters, audience toggle, FAQ, keyboard activation, 360/390/768px overflow, no browser errors.');
}finally{if(browser)await browser.close();server.kill('SIGTERM');}
