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
          <CalendarioAppuntamenti /> 
          <Emergenze role="veterinario" />
      </div>

    </AuthGuard>
  );
}

export default DashboardVeterinario;