import Link from 'next/link';
import {ActionForm} from '@/components/form';
import {Field} from '@/components/ui';
export default function Login(){return <section className="auth"><p className="eyebrow">Welcome back</p><h1>Your next connection starts here.</h1><p className="lead">Sign in to your CreatorBridge workspace.</p><ActionForm action="login" label="Sign in"><Field name="email" label="Email address" type="email"/><Field name="password" label="Password" type="password"/></ActionForm><div className="auth-links"><Link className="link" href="/forgot">Forgot password?</Link><Link className="link" href="/register">Create an account</Link></div><p className="privacy-note">Development accounts: see the project README. All seeded profiles and campaigns are fictional.</p></section>;}
