import React from 'react';
import ProfilePopup from '../components/ProfilePopup';
import Navbar from '../components/Navbar';

function ProfiloVeterinario() {
  return (
    <>
      <Navbar />
      <div className='popup'>
        <ProfilePopup />
      </div>
    </>

  );
}

export default ProfiloVeterinario;