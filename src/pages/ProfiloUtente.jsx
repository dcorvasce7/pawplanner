import React from 'react';
import ProfilePopup from '../components/ProfilePopup';
import Navbar from '../components/Navbar';
import AuthGuard from '../components/AuthGuard';

function ProfiloUtente() {
  return (
    <AuthGuard allowedRoles={['utente']}>
      <Navbar tipoUtente="utente" />
      <div className="margin-divisor"></div>
        <ProfilePopup role="utente" />
    </AuthGuard>
  );
}

export default ProfiloUtente;