import {ActionForm} from '@/components/form';
import {Field} from '@/components/ui';
export default function Forgot(){return <section className="auth"><p className="eyebrow">Account recovery</p><h1>Let’s get you back in.</h1><p className="lead">Request a one-use link. In this development preview, mail is saved to the private local mail folder described in the README.</p><ActionForm action="forgot" label="Request recovery link"><Field name="email" type="email" label="Account email"/></ActionForm></section>;}
