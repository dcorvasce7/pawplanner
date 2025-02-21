import React from 'react';
import Navbar from '../components/Navbar';
import CalendarioAppuntamenti from '../components/CalendarioAppuntamenti';
import AuthGuard from '../components/AuthGuard';
import Emergenze from '../components/Emergenze';


function DashboardVeterinario() {
  return (
    <AuthGuard allowedRoles={['veterinario']}>
      <Navbar />
      <div className="margin-divisor"></div>
      <div className="dashboard-content">
      <div className="content">
          <CalendarioAppuntamenti /> 
        </div>
      <div className="content">
        <Emergenze role="veterinario" />
      </div>
      </div>

    </AuthGuard>
  );
}

export default DashboardVeterinario;