import Link from 'next/link';
import {requireUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {orgs} from '@/lib/access';
import {Heading,Empty} from '@/components/ui';
import {BriefForm} from '@/components/brief-form';
export default async function NewBrief(){const u=await requireUser();if(u.role!=='brand')return <div className="container"><Empty title="Brands create campaign briefs">Explore open opportunities in your workspace.</Empty></div>;const organizations=await orgs(await db(),u);return <div className="container narrow"><Heading eyebrow="New campaign" title="A great partnership starts with a clear brief.">Define the work, audience and rights. Save a draft before publishing.</Heading>{organizations.some(o=>['owner','editor'].includes(o.role))?<BriefForm organizations={organizations} userId={u.id}/>:<div className="notice"><Link className="link" href="/onboarding">Create a brand workspace first</Link>.</div>}</div>;}
