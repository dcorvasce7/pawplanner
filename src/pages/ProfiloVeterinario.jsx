import React from 'react';
import ProfilePopup from '../components/ProfilePopup';
import Navbar from '../components/Navbar';
import AuthGuard from '../components/AuthGuard';

function ProfiloVeterinario() {
  return (
    <AuthGuard>
      <Navbar />
      <div className='popup'>
        <ProfilePopup />
      </div>
    </AuthGuard>
  );
}

export default ProfiloVeterinario;