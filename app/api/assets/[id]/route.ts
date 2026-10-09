import {NextResponse} from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import {currentUser} from '@/lib/auth';
import {db,one} from '@/lib/db';
import {bookingAccess} from '@/lib/access';
import {storageRoot} from '@/lib/storage';
export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){try{const u=await currentUser();if(!u)return new Response('Sign in required',{status:401});const {id}=await params,d=await db();const asset=await one<{booking_id:string;storage_key:string;original_name:string;mime:string}>(d,'SELECT * FROM assets WHERE id=$1',[id]);if(!asset)return new Response('Unavailable',{status:404});await bookingAccess(d,u,asset.booking_id);const content=await fs.readFile(path.join(storageRoot(),asset.storage_key));return new NextResponse(content,{headers:{'Content-Type':asset.mime,'Content-Disposition':'attachment; filename="'+asset.original_name+'"','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});}catch{return new Response('Unavailable',{status:403});}}
