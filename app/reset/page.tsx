import {ActionForm} from '@/components/form';
import {Field} from '@/components/ui';
export default async function Reset({searchParams}:{searchParams:Promise<{token?:string}>}){const {token}=await searchParams;return <section className="auth"><p className="eyebrow">Secure recovery</p><h1>A fresh start.</h1><ActionForm action="reset" data={{token:token||''}} label="Set new password"><Field name="password" type="password" label="New password · at least 12 characters"/></ActionForm></section>;}
