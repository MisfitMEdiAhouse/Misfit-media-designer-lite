import { useEffect } from 'react';

export default function OwnerCommandCenter() {
  useEffect(() => {
    window.location.replace('https://misfit-cloud.vercel.app/login');
  }, []);

  return (
    <main style={{minHeight:'100vh',background:'#000',color:'#fff',display:'grid',placeItems:'center',fontFamily:'system-ui'}}>
      <a href="https://misfit-cloud.vercel.app/login" style={{color:'#22d3ee'}}>Opening Misfit Cloud…</a>
    </main>
  );
}
