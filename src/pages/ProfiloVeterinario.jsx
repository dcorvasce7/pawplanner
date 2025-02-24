import React from 'react';
import ProfilePopup from '../components/ProfilePopup';
import Navbar from '../components/Navbar';
import AuthGuard from '../components/AuthGuard';

function ProfiloVeterinario() {
  return (
    <AuthGuard allowedRoles={['veterinario']}>
      <Navbar />
      <div className="margin-divisor"></div>
        <ProfilePopup />
    </AuthGuard>
  );
}

export default ProfiloVeterinario;