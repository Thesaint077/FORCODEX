import Link from 'next/link';
import {notFound} from 'next/navigation';
import {db,one} from '@/lib/db';
import {Profile} from '@/lib/models';
import {naira} from '@/lib/domain';
import {Heading,Badge} from '@/components/ui';
export default async function Creator({params}:{params:Promise<{id:string}>}){const {id}=await params,p=await one<Profile>(await db(),'SELECT p.*,u.name FROM profiles p JOIN users u ON u.id=p.user_id WHERE p.user_id=$1 AND p.is_public=true',[id]);if(!p)notFound();return <div className="container narrow"><Heading eyebrow={p.service} title={p.name}>{p.city} · {p.languages}</Heading><div className="card"><Badge tone="gold">{p.verification==='sandbox_approved'?'Sandbox participation reviewed':'Review pending'}</Badge><br/><br/><h2>Creative approach</h2><p>{p.bio}</p><p>{p.category} · {p.availability}</p><p className="rate">Indicative rate {naira(p.rate_kobo)}</p>{p.portfolio&&<a href={p.portfolio} target="_blank" rel="noopener noreferrer" className="link">View external portfolio</a>}<p className="hint">Final quote depends on deliverables and rights. No audience evidence is connected in this milestone.</p><Link className="button" href="/briefs/new">Start with a brief</Link></div></div>;}
