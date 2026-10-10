import Link from 'next/link';
import {ArrowUpRight, ArrowRight, Check, Camera, Play, Plus, MoveUpRight} from 'lucide-react';
import {AudienceJourney, ServiceExplorer} from '@/components/landing-explorer';

export default function Home() {
  return <div className="cb-landing">
    <section className="cb-hero cb-wrap">
      <div className="cb-hero-copy"><span className="cb-kicker"><span className="cb-dot"/>Nigerian creativity. Connected.</span><h1>Find your<br/>creative <em>match.</em></h1><p>Connect with Nigerian creators.<br/>Make content that brings your brand to life.</p><div className="cb-actions"><Link className="button" href="/creators">Find a creator<ArrowUpRight size={19}/></Link><Link className="button secondary" href="/register?role=creator">I’m a creator<ArrowRight size={18}/></Link></div><a className="cb-how-link" href="#how-it-works">See how it works<span>↓</span></a></div>
      <div className="cb-hero-visual" aria-label="Illustration of a content collaboration; sample brief">
        <div className="cb-visual-top"><span>THE SPACE BETWEEN<br/>AN IDEA & ITS NEXT CHAPTER.</span><MoveUpRight size={30} strokeWidth={1}/></div>
        <div className="cb-studio"><div className="cb-studio-frame"><div className="cb-studio-mark"><span/><span/></div><span className="cb-studio-word">create.</span><span className="cb-frame-caption"><Camera size={14}/>A fresh perspective</span></div><div className="cb-floating-label"><span className="cb-live-dot"/>Ideas meet possibility</div></div>
        <div className="cb-brief-card"><div className="cb-brief-icon"><Play size={19}/></div><div><strong>Your next brand story</strong><span>Clear brief. Shared vision.</span></div><span className="cb-brief-check"><Check size={17}/></span></div>
        <span className="cb-sample-label">Illustrative workspace preview</span>
      </div>
    </section>
    <div className="cb-category-bar"><div className="cb-wrap"><span>Made for your world</span><span>Beauty & personal care</span><span>Fashion & lifestyle</span><span>Food & hospitality</span></div></div>
    <section className="cb-services cb-wrap" id="services"><div className="cb-section-head"><div><span className="cb-kicker">Your idea. The right talent.</span><h2>What do you want<br/>to create?</h2></div><p>Content for your channels.<br/>Or a story told through theirs.</p></div><ServiceExplorer/></section>
    <div className="cb-soft-band"><div className="cb-wrap"><AudienceJourney/></div></div>
    <section className="cb-benefits cb-wrap"><div><span className="cb-kicker">Less back-and-forth</span><h2>More creating.<br/><em>Less chasing.</em></h2><p>Keep the details together,<br/>so the work can move forward.</p></div><div className="cb-benefit-list">{[{title:'Clear prices',text:'See the creator’s quote and your booking fee.'},{title:'Agreed terms',text:'Define deliverables, deadlines and usage rights.'},{title:'One workspace',text:'Keep messages, submissions and feedback together.'}].map((b,i)=><article key={b.title}><span>0{i+1}</span><div><h3>{b.title}</h3><p>{b.text}</p></div><ArrowUpRight size={20}/></article>)}</div></section>
    <section className="cb-faq cb-wrap"><div><span className="cb-kicker">A few good questions</span><h2>Before you begin.</h2></div><div>{[{q:'Do creators need a large following?',a:'No. For content production, your portfolio and creative skills matter. Sponsored content also depends on how your audience fits the brand.'},{q:'Can I join from outside Lagos?',a:'Yes. CreatorBridge welcomes Nigerian creators nationwide. Brands can explore talent by location.'},{q:'How are prices agreed?',a:'Creators submit itemised proposals. The proposed brand booking fee is 15% of the creator’s quote and is shown separately before agreement.'},{q:'Can I make real payments yet?',a:'This version is a sandbox. Funding and payouts are simulations. No real money is collected or transferred.'}].map(f=><details key={f.q}><summary>{f.q}<Plus size={19}/></summary><p>{f.a}</p></details>)}</div></section>
    <section className="cb-final"><div className="cb-wrap"><span className="cb-kicker">Your next chapter starts here</span><h2>Good ideas deserve<br/><em>great collaborators.</em></h2><div className="cb-actions"><Link className="button" href="/creators">Find your creator<ArrowUpRight size={19}/></Link><Link className="cb-final-link" href="/register?role=creator">Bring your creativity<ArrowRight size={18}/></Link></div><span className="cb-final-note">Built for brands. Open to Nigerian creators.</span></div><div className="cb-final-arc" aria-hidden="true"/></section>
  </div>;
}
