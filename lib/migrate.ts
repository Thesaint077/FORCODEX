import fs from 'node:fs/promises';
import {db} from './db';
export async function migrate(){const sql=await fs.readFile('migrations/001_initial.sql','utf8');const d=await db();for(const statement of sql.split(';').map(s=>s.trim()).filter(Boolean))await d.query(statement);}
