import {randomBytes} from 'node:crypto';
import fs from 'node:fs/promises';
import {DB} from './db';
import {hash,now,id} from './auth';
import {emailConfig,sendAuthEmail} from './email-provider';
export async function tokenMail(d:DB,userId:string,email:string,kind:'verify'|'reset'){
 const development=process.env.ENABLE_DEV_MAIL==='true'&&process.env.NODE_ENV!=='production'&&process.env.EMAIL_PROVIDER!=='resend';
 const config=development?undefined:emailConfig();
 const token=randomBytes(32).toString('hex');await d.query('INSERT INTO auth_tokens(hash,user_id,kind,expires_at) VALUES($1,$2,$3,$4)',[hash(token),userId,kind,new Date(Date.now()+3600000).toISOString()]);
 if(!development){try{await sendAuthEmail(kind,email,token,'auth-'+hash(token),config);}catch(error){await d.query('DELETE FROM auth_tokens WHERE hash=$1',[hash(token)]);throw error;}return;}
 await fs.mkdir('.data/mail',{recursive:true});await fs.writeFile('.data/mail/'+id()+'.json',JSON.stringify({to:email,kind,url:(process.env.APP_URL||'http://localhost:3000')+'/'+kind+'?token='+token,created_at:now()}));
}
