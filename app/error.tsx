'use client';
export default function Error({reset}:{reset:()=>void}){return <section className="container narrow"><h1>Something interrupted this page.</h1><p>Your saved work is still in your workspace. Try opening the page again.</p><button className="button" onClick={reset}>Try again</button></section>;}
