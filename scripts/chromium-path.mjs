// Test-only extraction: avoid ownership changes in restricted root containers.
import {createReadStream,createWriteStream,existsSync,statSync} from 'node:fs';
import {mkdir,writeFile} from 'node:fs/promises';
import {createBrotliDecompress} from 'node:zlib';
import {pipeline} from 'node:stream/promises';
import {createRequire} from 'node:module';
import path from 'node:path';
import os from 'node:os';
const require=createRequire(import.meta.url);
export async function browserBinary(){
 if(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE)return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
 const root=path.resolve(path.dirname(require.resolve('@sparticuz/chromium')),'../bin');
 const dest=path.join(os.tmpdir(),'creatorbridge-browser');await mkdir(dest,{recursive:true});
 const binary=path.join(dest,'chromium');
 if(!existsSync(binary)||statSync(binary).size===0)await pipeline(createReadStream(path.join(root,'chromium.br')),createBrotliDecompress(),createWriteStream(binary,{mode:0o700}));
 const tar=require('tar-fs');
 for(const name of ['fonts','swiftshader']){const target=name==='fonts'?path.join(dest,'fonts'):dest;await mkdir(target,{recursive:true});await pipeline(createReadStream(path.join(root,name+'.tar.br')),createBrotliDecompress(),tar.extract(target,{chown:false}));}
 // Point Fontconfig at the extracted bundle and available system fonts.
 await writeFile(path.join(dest,'fonts','fonts.conf'),`<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>${path.join(dest,'fonts','fonts')}</dir><dir>/usr/share/fonts</dir><cachedir>${path.join(dest,'fonts-cache')}</cachedir></fontconfig>`);
 process.env.FONTCONFIG_PATH=path.join(dest,'fonts');
 process.env.LD_LIBRARY_PATH=[dest,process.env.LD_LIBRARY_PATH].filter(Boolean).join(':');
 return binary;
}
