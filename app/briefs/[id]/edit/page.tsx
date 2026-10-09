import {notFound} from 'next/navigation';
import {requireUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {briefAccess,orgs} from '@/lib/access';
import {Heading} from '@/components/ui';
import {BriefForm} from '@/components/brief-form';
export default async function Edit({params}:{params:Promise<{id:string}>}){const u=await requireUser(),d=await db(),{id}=await params;let b;try{b=await briefAccess(d,u,id,'brief');}catch{notFound();}return <div className="container narrow"><Heading eyebrow="Edit brief" title="Make the scope clear.">Briefs with proposals cannot be overwritten.</Heading><BriefForm organizations={await orgs(d,u)} userId={u.id} brief={b}/></div>;}
