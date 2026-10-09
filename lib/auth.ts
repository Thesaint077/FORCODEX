import {randomBytes,scryptSync,timingSafeEqual,createHash,randomUUID} from 'node:crypto';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {db,one,DB} from './db';
import {User} from './models';
export const now=()=>new Date().toISOString();
export const id=()=>randomUUID();
export const hash=(v:string)=>createHash('sha256').update(v).digest('hex');
export function passwordHash(value:string){const salt=randomBytes(16).toString('hex');return salt+':'+scryptSync(value,salt,64).toString('hex');}
export function passwordMatches(value:string,stored:string){try{const [salt,key]=stored.split(':');return timingSafeEqual(scryptSync(value,salt,64),Buffer.from(key,'hex'));}catch{return false;}}
export async function currentUser():Promise<User|undefined>{const token=(await cookies()).get('cb_session')?.value;if(!token)return;return one<User>(await db(),'SELECT u.id,u.email,u.name,u.role,u.email_verified FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.hash=$1 AND s.expires_at>$2',[hash(token),now()]);}
export async function requireUser(){const u=await currentUser();if(!u)redirect('/login');return u;}
export async function session(d:DB,userId:string){const token=randomBytes(32).toString('hex');await d.query('INSERT INTO sessions(hash,user_id,expires_at) VALUES($1,$2,$3)',[hash(token),userId,new Date(Date.now()+86400000*7).toISOString()]);(await cookies()).set('cb_session',token,{httpOnly:true,secure:(process.env.APP_URL||'').startsWith('https:'),sameSite:'lax',path:'/',maxAge:86400*7});}
export async function limit(key:string,max=10){const d=await db();const start=Math.floor(Date.now()/600000);const row=await one<{count:number}>(d,'INSERT INTO rate_limits(key,count,window_start) VALUES($1,1,$2) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN rate_limits.window_start=$2 THEN rate_limits.count+1 ELSE 1 END,window_start=$2 RETURNING count',[hash(key),start]);if(Number(row?.count)>max)throw new Error('Too many attempts. Please try again in ten minutes.');}
