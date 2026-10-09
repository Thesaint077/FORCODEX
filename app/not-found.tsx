import Link from 'next/link';
export default function NotFound(){return <section className="container narrow"><h1>This page isn’t available.</h1><p>It may belong to another workspace or no longer exist.</p><Link className="button" href="/dashboard">Return to workspace</Link></section>;}
