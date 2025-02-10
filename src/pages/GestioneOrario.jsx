import React from 'react';
import Navbar from '../components/Navbar';
import AuthGuard from '../components/AuthGuard';

function GestioneOrario() {
  return (
    <AuthGuard>
      <Navbar />
      <div className="content">
        <div>
          <h2>Gestione Orario</h2>
          <p>Qui puoi gestire il tuo orario di lavoro.</p>
        </div>
      </div>
    </AuthGuard>
  );
}

export default GestioneOrario;