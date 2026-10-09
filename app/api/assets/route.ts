import {NextResponse} from 'next/server';
import {currentUser,id,now} from '@/lib/auth';
import {db} from '@/lib/db';
import {bookingAccess} from '@/lib/access';
import {store} from '@/lib/storage';
export const runtime='nodejs';
export async function POST(req:Request){try{if(req.headers.get('origin')!==(process.env.APP_URL||new URL(req.url).origin))throw new Error('Request not permitted.');const u=await currentUser();if(!u)throw new Error('Sign in first.');const form=await req.formData();const bid=String(form.get('bookingId')||'');const d=await db();const b=await bookingAccess(d,u,bid,'submit');if(b.funding!=='funded'||!['in_production','revision_requested'].includes(b.delivery))throw new Error('Upload only during funded production.');const file=form.get('file');if(!(file instanceof File))throw new Error('Select a file.');const asset=await store(file),aid=id();await d.query('INSERT INTO assets(id,booking_id,user_id,original_name,mime,storage_key,size_bytes,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',[aid,bid,u.id,asset.name,asset.mime,asset.key,asset.size,now()]);return NextResponse.json({assetId:aid,name:asset.name});}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Upload failed'},{status:400});}}
