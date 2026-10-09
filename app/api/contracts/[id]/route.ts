import {currentUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {bookingAccess} from '@/lib/access';
export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){try{const u=await currentUser();if(!u)return new Response('Sign in required',{status:401});const {id}=await params;const b=await bookingAccess(await db(),u,id);const text=JSON.stringify({contract:b.contract,hash:b.contract_hash,brandAcceptedAt:b.brand_signed_at,creatorAcceptedAt:b.creator_signed_at},null,2);return new Response(text,{headers:{'Content-Type':'application/json','Content-Disposition':'attachment; filename="creatorbridge-contract-v1.json"','Cache-Control':'private, no-store'}});}catch{return new Response('Unavailable',{status:403});}}
