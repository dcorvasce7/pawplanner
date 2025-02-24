import React from 'react';
import ProfilePopupUtente from '../components/ProfilePopupUtente';
import NavbarUtente from '../components/NavbarUtente';
import AuthGuard from '../components/AuthGuard';

function ProfiloUtente() {
  return (
    <AuthGuard allowedRoles={['utente']}>
      <NavbarUtente />
      <div className="margin-divisor"></div>
        <ProfilePopupUtente />
    </AuthGuard>
  );
}

export default ProfiloUtente;