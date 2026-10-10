import {test} from 'node:test';
import assert from 'node:assert/strict';
import {migrate} from '../lib/migrate';
import {db,transaction,one} from '../lib/db';
import {updateIdentity} from '../lib/identity';
import {searchPublicDirectory} from '../lib/directory';
import {User} from '../lib/models';
process.env.DATABASE_URL='';process.env.LOCAL_DATABASE_PATH='.data/identity-tests-'+Date.now();
test('account identity updates and public directory privacy',async t=>{
 await migrate();const d=await db();
 for(const [id,role,visible] of [['public','creator',false],['private','creator',false],['brand','brand',false],['operations','operations',true]])await d.query('INSERT INTO users(id,name,email,password,role,directory_visible,created_at) VALUES($1,$1,$2,\'unused\',$3,$4,\'2026-10-10\')',[id,id+'@fictional.test',role,visible]);
 for(const [id,visible] of [['public',true],['private',false]])await d.query("INSERT INTO profiles(user_id,category,service,city,languages,bio,rate_kobo,availability,portfolio,is_public) VALUES($1,'Beauty and personal care','Content production','Lagos','English','Fictional',10000,'Available','',$2)",[id,visible]);
 const creator={id:'public',role:'creator'} as User,brand={id:'brand',role:'brand'} as User;
 await t.test('display name and normalised username update only the signed-in account',async()=>{await updateIdentity(d,creator,{id:'private',name:'Updated Creator',username:'@NEW_CREATOR'});assert.equal((await one<User>(d,'SELECT * FROM users WHERE id=\'private\''))?.name,'private');const hits=await searchPublicDirectory(d,'@new_creator');assert.equal(hits[0]?.name,'Updated Creator');assert.equal(hits[0]?.username,'new_creator');assert.ok(!('email' in hits[0]));});
 await t.test('duplicate usernames reject atomically without changing the name',async()=>{await assert.rejects(transaction(t=>updateIdentity(t,brand,{name:'Failed change',username:'NEW_CREATOR'})),/already taken/);assert.equal((await one<User>(d,"SELECT * FROM users WHERE id='brand'"))?.name,'brand');});
 await t.test('brand visibility requires opt-in and a username',async()=>{await updateIdentity(d,brand,{name:'Visible Brand',username:'test_brand',directoryVisible:'no'});assert.equal((await searchPublicDirectory(d,'test_brand')).length,0);await updateIdentity(d,brand,{name:'Visible Brand',username:'test_brand',directoryVisible:'yes'});assert.equal((await searchPublicDirectory(d,'@TEST_BRAND','brand')).length,1);assert.equal((await searchPublicDirectory(d,'test_brand','creator')).length,0);});
 await t.test('private creators and operations users never appear',async()=>{const all=await searchPublicDirectory(d);assert.deepEqual(all.map(r=>r.id).sort(),['brand','public']);});
 await t.test('wildcards are literal and invalid handles are rejected',async()=>{assert.equal((await searchPublicDirectory(d,'%')).length,0);await assert.rejects(updateIdentity(d,creator,{name:'Invalid',username:'bad handle!'}));});
});
