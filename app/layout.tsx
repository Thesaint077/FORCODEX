import type {Metadata} from 'next';
import './globals.css';
import {Shell} from '@/components/ui';
export const metadata:Metadata={title:{default:'CreatorBridge · Creators meet brands',template:'%s · CreatorBridge'},description:'A Nigerian creator and brand marketplace. First milestone sandbox preview.',icons:{icon:'/favicon.svg'}};
export const dynamic='force-dynamic';
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en-NG"><body><Shell>{children}</Shell></body></html>;}
