import {notFound} from 'next/navigation';
import {db,one} from '@/lib/db';
import {User,Brief} from '@/lib/models';
import {Heading,CardLink,Empty} from '@/components/ui';
import {naira} from '@/lib/domain';
export default async function Brand({params}:{params:Promise<{username:string}>}){const {username}=await params;const d=await db();const u=await one<User>(d,"SELECT id,name,username FROM users WHERE role='brand' AND directory_visible=true AND lower(username)=$1",[username.toLowerCase()]);if(!u)notFound();const briefs=(await d.query<Brief>("SELECT id,title,category,budget_kobo FROM briefs WHERE created_by=$1 AND status='published' ORDER BY created_at DESC",[u.id])).rows;return <div className="container"><Heading eyebrow={'@'+u.username} title={u.name}>Public brand profile · Published briefs only.</Heading><h2>Open briefs</h2><div className="grid">{briefs.map(b=><CardLink key={b.id} title={b.title} href={'/briefs/'+b.id}>{b.category} · {naira(b.budget_kobo)} creator budget</CardLink>)}</div>{!briefs.length&&<Empty title="No open briefs yet">This brand has not published a brief.</Empty>}</div>;}
