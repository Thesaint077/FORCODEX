'use client';

import {useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight, ArrowRight, Camera, Megaphone, Check, FileText, MessageSquare, Sparkles} from 'lucide-react';

const services = {
  production: {title: 'Content for your brand.', description: 'Videos, photos and product stories for your own channels.', tags: ['Product videos', 'Photography', 'Social content'], icon: Camera, action: 'Explore content creators', href: '/creators?service=Content%20production'},
  sponsored: {title: 'Reach their audience.', description: 'Sponsored posts shared on a creator’s channels.', tags: ['Sponsored posts', 'Product features', 'Brand stories'], icon: Megaphone, action: 'Explore sponsored content', href: '/creators?service=Sponsored%20distribution'},
};

export function ServiceExplorer() {
  const [selected, setSelected] = useState<'production' | 'sponsored'>('production');
  const service = services[selected];
  const Icon = service.icon;
  return <div className="cb-service-explorer">
    <div className="cb-switch" role="group" aria-label="Choose a service">
      <button type="button" aria-pressed={selected === 'production'} onClick={() => setSelected('production')}>Content production</button>
      <button type="button" aria-pressed={selected === 'sponsored'} onClick={() => setSelected('sponsored')}>Sponsored content</button>
    </div>
    <div className="cb-service-body" aria-live="polite" aria-atomic="true">
      <div className="cb-service-art" aria-hidden="true"><div className="cb-art-orbit"/><div className="cb-art-icon"><Icon size={54} strokeWidth={1}/></div><span className="cb-art-label">{selected === 'production' ? 'Made for your channels' : 'Shared with their audience'}</span></div>
      <div className="cb-service-copy"><span className="cb-kicker">Two ways to work together</span><h3>{service.title}</h3><p>{service.description}</p><div className="cb-tags">{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div><Link href={service.href} className="cb-text-link">{service.action}<ArrowUpRight size={18}/></Link></div>
    </div>
  </div>;
}

export function AudienceJourney() {
  const [audience, setAudience] = useState<'brand' | 'creator'>('brand');
  const brand = audience === 'brand';
  const steps = brand ? [
    {icon: Sparkles, title: 'Find your fit', text: 'Explore creators by service, budget and location.'},
    {icon: FileText, title: 'Share your brief', text: 'Agree on the work, price and usage rights.'},
    {icon: MessageSquare, title: 'Create together', text: 'Review content and give feedback in one place.'},
  ] : [
    {icon: Camera, title: 'Show your craft', text: 'Build a profile with your portfolio and services.'},
    {icon: FileText, title: 'Pitch your idea', text: 'Respond to briefs with your price and terms.'},
    {icon: Check, title: 'Deliver your work', text: 'Submit content and manage feedback in one place.'},
  ];
  return <section className="cb-journey" id="how-it-works"><div className="cb-section-head"><div><span className="cb-kicker">A simpler way to work</span><h2>From connection<br/>to creation.</h2></div><div className="cb-switch" role="group" aria-label="Choose your perspective"><button type="button" aria-pressed={brand} onClick={() => setAudience('brand')}>For brands</button><button type="button" aria-pressed={!brand} onClick={() => setAudience('creator')}>For creators</button></div></div><div className="cb-steps" aria-live="polite" aria-atomic="true">{steps.map((step, i) => <article key={step.title}><div className="cb-step-top"><step.icon size={25} strokeWidth={1.5}/><span>0{i + 1}</span></div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div><Link className="cb-text-link" href={'/register?role=' + audience}>{brand ? 'Start a brand workspace' : 'Create your creator profile'}<ArrowRight size={18}/></Link></section>;
}
