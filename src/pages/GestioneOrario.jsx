import React from 'react';
import Navbar from '../components/Navbar';
import AuthGuard from '../components/AuthGuard';
import Orario from '../components/Orario';

function GestioneOrario() {
  
  return (
    <AuthGuard allowedRoles={['veterinario']}>
      <Navbar tipoUtente="veterinario" />
      <div className="margin-divisor"></div>
      <Orario />
    </AuthGuard>
  );
}

export default GestioneOrario;