import {PGlite} from '@electric-sql/pglite';
import {Pool,PoolClient} from 'pg';
import path from 'node:path';
import fs from 'node:fs/promises';
export interface DB {query<T=Record<string,unknown>>(sql:string,params?:unknown[]):Promise<{rows:T[]}>}
const g=globalThis as typeof globalThis & {cbDB?:Promise<DB>;cbPool?:Pool;cbLocal?:PGlite};
export async function db():Promise<DB>{
 if(!g.cbDB)g.cbDB=(async()=>{
  if(process.env.DATABASE_URL){g.cbPool=new Pool({connectionString:process.env.DATABASE_URL});return g.cbPool as DB;}
  if(process.env.NODE_ENV==='production'&&process.env.ALLOW_LOCAL_ADAPTERS!=='true')throw new Error('DATABASE_URL required; local adapters are disabled.');
  const location=path.resolve(process.env.LOCAL_DATABASE_PATH||'.data/postgres');await fs.mkdir(location,{recursive:true});g.cbLocal=new PGlite(location);await g.cbLocal.waitReady;return g.cbLocal as DB;
 })();return g.cbDB;
}
export async function transaction<T>(run:(d:DB)=>Promise<T>):Promise<T>{await db();if(g.cbPool){const c:PoolClient=await g.cbPool.connect();try{await c.query('BEGIN');const result=await run(c as DB);await c.query('COMMIT');return result;}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}}return g.cbLocal!.transaction(async t=>run(t as DB));}
export async function one<T>(d:DB,sql:string,params:unknown[]=[]):Promise<T|undefined>{return (await d.query<T>(sql,params)).rows[0];}
