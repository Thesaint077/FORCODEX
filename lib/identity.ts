import {z} from 'zod';
import {DB} from './db';
import {User} from './models';
const username=z.string().trim().toLowerCase().transform(s=>s.startsWith('@')?s.slice(1):s).refine(s=>s===''||/^[a-z0-9_]{3,30}$/.test(s),'Username must be 3–30 letters, numbers or underscores.');
export async function updateIdentity(d:DB,user:User,body:Record<string,unknown>){
 const name=z.string().trim().min(1).max(120).parse(body.name);
 const handle=username.parse(body.username??'');
 const visible=body.directoryVisible===undefined?undefined:z.enum(['yes','no']).parse(body.directoryVisible)==='yes';
 try{await d.query('UPDATE users SET name=$1,username=$2,directory_visible=CASE WHEN role=\'brand\' THEN COALESCE($3,directory_visible) ELSE false END WHERE id=$4',[name,handle||null,visible??null,user.id]);}
 catch(error){if((error as {code?:string}).code==='23505')throw new Error('That username is already taken. Choose another.');throw error;}
}
