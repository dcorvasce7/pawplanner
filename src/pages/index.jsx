import React from 'react';
import Link from 'next/link';  // Importa il Link da Next.js
import Header from '../components/Header';

function LandingPage() {
  return (
    <>
    <Header title="Veterinario da Chiara" subtitle="" />
    <div className="popup">
        <div className="popup">
          <p>Sei un utente? <Link href="/LoginUtente">Accedi</Link> <Link href="/RegistrazioneUtente">Registrati</Link></p>
        </div>
        <div className="popup">
          <p>Sei un veterinario? <Link href="/LoginVeterinario">Accedi</Link> <Link href="/RegistrazioneVeterinario">Registrati</Link></p>
        </div>
        <div className="popup">
          <p>Accesso dashboard <Link href="/DashboardVeterinario">Accedi</Link></p>
          </div>
      </div>
      </>
  );
}

export default LandingPage;