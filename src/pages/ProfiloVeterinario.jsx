import React from 'react';
import ProfilePopup from '../components/ProfilePopup';
import Navbar from '../components/Navbar';
import AuthGuard from '../components/AuthGuard';

function ProfiloVeterinario() {
  return (
    <AuthGuard allowedRoles={['veterinario']}>
      <Navbar tipoUtente="veterinario" />
      <div className="margin-divisor"></div>
        <ProfilePopup role="veterinario" />
    </AuthGuard>
  );
}

export default ProfiloVeterinario;