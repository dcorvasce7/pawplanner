import React from 'react';
import Link from 'next/link';  // Importa il Link da Next.js
import Header from '../components/Header';

function LandingPage() {
  return (
    <>
    <Header title="PawPlanner" subtitle="" />
    <div className="popup">
        <div className="popup">
          <p>Sei un utente? <Link href="/Login?tipo=utente">Accedi</Link> <Link href="/Registrazione?tipo=utente">Registrati</Link></p>
        </div>
        <div className="popup">
          <p>Sei un veterinario? <Link href="/Login?tipo=veterinario">Accedi</Link> <Link href="/Registrazione?tipo=veterinario">Registrati</Link></p>
        </div>
      </div>
      </>
  );
}

export default LandingPage;