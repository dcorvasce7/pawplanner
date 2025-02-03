import React from 'react';
import Navbar from '../components/Navbar';
import CalendarioAppuntamenti from '../components/CalendarioAppuntamenti';

function DashboardVeterinario() {
  return (
    <>
      <Navbar />
      <div className="content">
        <div>
          <h2>Dashboard Veterinario</h2>
          <p>Benvenuto nella tua dashboard.</p>
        </div>
        <div>
          <CalendarioAppuntamenti /> 
        </div>
        
      </div>
    </>
  );
}

export default DashboardVeterinario;