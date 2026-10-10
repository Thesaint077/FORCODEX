import fs from 'node:fs/promises';
import {db,transaction} from './db';
export async function migrate(){
 const d=await db();
 await d.query('CREATE TABLE IF NOT EXISTS migrations (version text PRIMARY KEY)');
 const files=(await fs.readdir('migrations')).filter(f=>/^\d+.*\.sql$/.test(f)).sort();
 for(const file of files){const version=file.split('_')[0];const applied=await d.query('SELECT version FROM migrations WHERE version=$1',[version]);if(applied.rows.length)continue;const sql=await fs.readFile('migrations/'+file,'utf8');await transaction(async t=>{for(const statement of sql.split(';').map(s=>s.trim()).filter(Boolean))await t.query(statement);});}
}
